// @ts-check
// SPDX-FileCopyrightText: 2026 WEBDEPLOY S.R.L.
// SPDX-License-Identifier: AGPL-3.0-only
import { spawn, execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { createReadStream } from 'node:fs';
import { mkdir, readFile, realpath, writeFile } from 'node:fs/promises';
import { homedir } from 'node:os';
import { basename, dirname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import { pages } from '../data/pages.mjs';
import { assess, categories, emptyCell, missingPath, presets, reportName, targets, version } from './lighthouse-gate.mjs';

import { hostSample, idlePercent, measureCell, measurementPolicy, verifiedRecord, waitForQuiet, writeJson } from './lighthouse-measure.mjs';

/** @typedef {import('./lighthouse-types.d.ts').AuditCell} AuditCell */
/** @typedef {import('./lighthouse-types.d.ts').GateManifest} GateManifest */
/** @typedef {import('./lighthouse-types.d.ts').LighthouseReport} LighthouseReport */

/** @typedef {import('./lighthouse-types.d.ts').Measurement} Measurement */
/** @typedef {import('./lighthouse-types.d.ts').WaitBudget} WaitBudget */
/** @typedef {import('./lighthouse-types.d.ts').MeasurementRecord} MeasurementRecord */

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const { values } = parseArgs({ options: {
	gate: { type: 'boolean' }, strict: { type: 'boolean' }, 'working-tree': { type: 'boolean' },
	'base-url': { type: 'string' }, output: { type: 'string' }, runner: { type: 'string' },
	runs: { type: 'string' }, 'max-quiet-seconds': { type: 'string' },
	chrome: { type: 'string' }, commit: { type: 'string' }, 'read-run': { type: 'string' }
} });
if (values.strict && values.gate) throw new Error('Choose one of --gate and --strict');
const strict = Boolean(values.strict);
/** @type {import('./lighthouse-types.d.ts').Expectations} */
const expectations = JSON.parse(await readFile(new URL('./lighthouse-expectations.json', import.meta.url), 'utf8'));

/** @param {string} origin @returns {string} */
function localOrigin(origin) {
	const url = new URL(origin);
	if (url.protocol !== 'http:' || !['localhost', '127.0.0.1'].includes(url.hostname) ||
		url.href !== url.origin + '/' || url.username || url.password) throw new Error('Use the HTTP origin of a loopback production nginx container');
	return url.origin;
}

/** @param {string} file @returns {string} */
function external(file) {
	const path = resolve(file);
	if (path === root || path.startsWith(root + sep)) throw new Error('Keep Lighthouse tools and reports outside the repository');
	return path;
}

/** @param {string} cli @param {string} chrome @param {string} url @param {string} preset @param {string} file @param {boolean} ignoreStatus @returns {Promise<Measurement>} */
async function collect(cli, chrome, url, preset, file, ignoreStatus) {
	const flags = ['--headless', '--remote-debugging-address=127.0.0.1'];
	// The documented non-root, capability-dropped Chromium container supplies process isolation.
	if (process.env.LIGHTHOUSE_CONTAINER === '1') flags.push('--no-sandbox');
	const args = [cli, url, '--quiet', '--only-categories=' + categories.join(','),
		'--output=json', '--output-path=' + file, '--chrome-flags=' + flags.join(' ')];
	if (preset === 'desktop') args.push('--preset=desktop');
	if (ignoreStatus) args.push('--ignore-status-code');
	const before = hostSample();
	/** @type {Buffer[]} */
	const chunks = [];
	let exitCode = 1;
	try {
		const child = spawn(process.execPath, args, {
			env: {...process.env, CHROME_PATH: chrome}, stdio: ['ignore', 'pipe', 'pipe'], timeout: 180_000
		});
		for (const stream of [child.stdout, child.stderr]) stream.on('data', (chunk) => chunks.push(chunk));
		exitCode = await new Promise((resolveCode, reject) => {
			child.once('error', reject);
			child.once('close', (status) => resolveCode(status ?? 1));
		});
	} catch (error) {
		chunks.push(Buffer.from(String(error)));
	}
	const after = hostSample();
	await writeFile(file + '.log', Buffer.concat(chunks));
	/** @type {LighthouseReport | null} */
	let report = null;
	try { report = JSON.parse(await readFile(file, 'utf8')); }
	catch { /* Preserve the CLI log and let measurement classification handle unreadable output. */ }
	const benchmarkIndex = report?.environment?.benchmarkIndex;
	const lab = {startedUtc:before.utc, finishedUtc:after.utc, load1Start:before.load1, load1End:after.load1,
		cpuIdlePercent:idlePercent(before, after), benchmarkIndex:typeof benchmarkIndex === 'number' ? benchmarkIndex : null};
	await writeJson(file + '.lab.json', lab);
	return {exitCode, report, lab};
}

/** @param {WaitBudget} budget @param {boolean} initial @returns {Promise<{directory:string, manifest:GateManifest, exhausted:boolean}>} */
async function gather(budget, initial) {
	const origin = localOrigin(values['base-url'] ?? 'http://127.0.0.1:18080');
	const output = external(values.output ?? join(homedir(), 'work/webdeploy-oss/lighthouse'));
	const runner = external(await realpath(values.runner ?? join(output, 'runner')));
	const lockBytes = await readFile(join(runner, 'package-lock.json'));
	const lockSha256 = createHash('sha256').update(lockBytes).digest('hex');
	if (lockSha256 !== '6a0c4d525a5b555e08ea814a10413f0de3aa962178faf913b9f595bdd61fd67b')
		throw new Error('The external Lighthouse lockfile differs from the documented runner');
	const lock = JSON.parse(lockBytes.toString());
	const pkg = JSON.parse(await readFile(join(runner, 'node_modules/lighthouse/package.json'), 'utf8'));
	if (lock.packages?.['node_modules/lighthouse']?.version !== version || lock.packages?.['']?.dependencies?.lighthouse !== version || pkg.version !== version)
		throw new Error('The external runner and lock must pin lighthouse@' + version);
	const chromePath = values.chrome ?? process.env.CHROME_PATH;
	if (!chromePath) throw new Error('Set --chrome or CHROME_PATH to the pinned full Chromium binary');
	const chrome = await realpath(chromePath);
	const browserHash = createHash('sha256');
	for await (const chunk of createReadStream(chrome)) browserHash.update(chunk);
	const browserVersion = execFileSync(chrome, ['--version'], { encoding: 'utf8' }).trim();
	if (!/\b157\.0\.8103\.78\b/.test(browserVersion)) throw new Error('Unexpected Chromium build: ' + browserVersion);
	const revision = values.commit ?? execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim();
	if (!/^[a-f\d]{40}$/.test(revision)) throw new Error('Expected a full source commit');
	const sitemap = await fetch(origin + '/sitemap.xml', { redirect: 'error' });
	if (sitemap.status !== 200 || !sitemap.headers.get('server')?.includes('nginx')) throw new Error('Expected a sitemap served by production nginx');
	const matrix = targets(await sitemap.text());
	const imageId = process.env.QUALITY_IMAGE_ID;
	if (values['working-tree'] && !/^sha256:[a-f0-9]{64}$/.test(imageId ?? ''))
		throw new Error('A diagnostic working-tree run requires its actual production image ID');
	const group = values['working-tree'] ? join(output, 'working-tree', String(imageId).slice(7)) : join(output, revision);
	const directory = join(group, new Date().toISOString().replaceAll(':', '-'));
	await mkdir(group, { recursive: true });
	await mkdir(directory);
	/** @type {GateManifest} */
	const manifest = { revision, sourceState: values['working-tree'] ? 'working-tree' : 'commit', origin, version, chrome: browserVersion, node: process.version,
		sourceTree: process.env.QUALITY_SOURCE_TREE, measurementPolicy,
		platform: process.platform + '/' + process.arch,
		browserSha256: browserHash.digest('hex'),
		browserImage: process.env.QUALITY_BROWSER_IMAGE ?? 'Host browser',
		lockSha256, imageId,
		matrix, responses: {} };
	for (const path of matrix) {
		const response = await fetch(origin + path, { redirect: 'manual' });
		const text = await response.text();
		const noindex = /<meta\s+name=["']robots["']\s+content=["'][^"']*\bnoindex\b/i.test(text);
		if (response.status !== (path === missingPath ? 404 : 200) || noindex !== Object.hasOwn(expectations.pages, path))
			throw new Error('Unexpected response status or index policy for ' + path);
		manifest.responses[path] = {status: response.status, noindex};
	}
	await writeJson(join(directory, 'manifest.json'), manifest);
	await writeFile(join(directory,'attempts.md'), '# Measurement attempts\n\n| URL | Preset | Navigation | Attempt | Status | Benchmark | Evidence |\n|---|---|---|---:|---|---:|---|\n');
	process.stdout.write('Reports ' + directory + '\n');
	if (initial) {
		const quiet = await waitForQuiet(budget, measurementPolicy.initialQuietMs, join(directory, 'initial-host.jsonl'));
		await writeJson(join(directory, 'initial-quiet.json'), quiet);
		if (!quiet.qualified) return {directory,manifest,exhausted:true};
	}
	const cli = join(runner, 'node_modules/lighthouse/cli/index.js');
	for (const preset of presets) {
		await mkdir(join(directory, preset));
		for (const path of matrix) {
			const url = origin + path;
			const modes = path === missingPath ? [true, false] : [false];
			for (const ordinary of modes) {
				process.stdout.write(preset + ' ' + path + (ordinary ? ' ordinary 404' : '') + '\n');
				const result = await measureCell(directory, path, preset, ordinary, budget, (file) =>
					collect(cli, chrome, url, preset, file, path === missingPath && !ordinary));
				if (result.outcome === 'host-timeout') return {directory,manifest,exhausted:true};
			}
		}
	}
	return {directory,manifest,exhausted:false};
}

/** @param {string} directory @param {GateManifest} manifest @param {boolean} strictMode @returns {Promise<AuditCell[]>} */
async function score(directory, manifest, strictMode) {
	const origin = localOrigin(manifest.origin);
	const required = [...new Set([...pages.filter((p) => !p.robots).map((p) => p.path), '/newsletter', '/newsletter/confirmed', missingPath])].sort();
	if (JSON.stringify([...manifest.matrix].sort()) !== JSON.stringify(required) || manifest.version !== version) throw new Error('Invalid run inventory or version');
	const cells = [];
	for (const path of manifest.matrix) {
		for (const preset of presets) {
			const file = join(directory, preset, reportName(path) + '.json');
			let cell = emptyCell(path, preset);
			/** @type {MeasurementRecord | undefined} */
			let record;
			try {
				if (manifest.measurementPolicy) {
					record = await verifiedRecord(directory,path,preset);
					if (record.selected === null) throw new Error('Measurement failure: ' + record.outcome);
				}
				/** @type {LighthouseReport} */
				const report = JSON.parse(await readFile(file, 'utf8'));
				cell = assess(report, origin + path, preset, expectations, strictMode);
				const labFile = join(directory, 'conditions', preset, basename(file));
				try { cell.lab = JSON.parse(await readFile(labFile, 'utf8')); }
				catch (error) {
					if (!(error instanceof Error && 'code' in error && error.code === 'ENOENT')) throw error;
				}
				// Chromium reduces its public UA to the major version. The binary check records the full build.
				const chromeMajor = /(\d+)\.\d+\.\d+\.\d+/.exec(manifest.chrome)?.[1];
				if (!chromeMajor || !report.environment?.hostUserAgent?.includes('Chrome/' + chromeMajor + '.'))
					cell.failures.push('Report came from a different browser');
				if (path === missingPath) {
					if (manifest.measurementPolicy) {
						/** @type {MeasurementRecord} */
						const receipt = await verifiedRecord(directory,path,preset,true);
						if (!receipt.ordinary404 || receipt.outcome !== 'measured' || receipt.selected === null)
							cell.failures.push('Ordinary 404 navigation evidence did not qualify');
					}
					/** @type {LighthouseReport} */
					const ordinary = JSON.parse(await readFile(join(directory, preset, '404-default.json'), 'utf8'));
					if (ordinary.lighthouseVersion !== version || ordinary.requestedUrl !== origin + path ||
						ordinary.configSettings?.formFactor !== preset ||
						(ordinary.runtimeError && ordinary.runtimeError.code !== 'ERRORED_DOCUMENT_REQUEST'))
						cell.failures.push('Invalid ordinary 404 navigation evidence');
				}
				if (record && (!cell.lab || cell.lab.benchmarkIndex !== report.environment?.benchmarkIndex ||
					cell.lab.benchmarkIndex !== record.attempts.at(-1)?.benchmarkIndex ||
					(cell.lab.benchmarkIndex ?? 0) < measurementPolicy.minimumBenchmark))
					cell.failures.push('Invalid benchmark evidence');
				const recorded = manifest.responses[path];
				if (recorded?.status !== (path === missingPath ? 404 : 200) || recorded.noindex !== Object.hasOwn(expectations.pages, path))
					cell.failures.push('Unexpected recorded HTTP or robots policy');
				const error = await readFile(file + '.error', 'utf8').catch((reason) => {
					if (reason.code === 'ENOENT') return '';
					throw reason;
				});
				if (error) cell.failures.push(error.trim());
			} catch (error) { cell.failures.push(String(error)); }
			if (record) cell.measurement = record;
			cells.push(cell);
		}
	}
	return cells;
}

/** @param {string} directory @param {GateManifest} manifest @param {boolean} strictMode @returns {Promise<{passed:boolean,count:number}>} */
async function summarize(directory, manifest, strictMode) {
	const cells = await score(directory, manifest, strictMode);
	const mode = strictMode ? 'strict' : 'gate';
	const count = cells.filter((cell) => !cell.failures.length).length;
	await writeJson(join(directory, mode + '.json'), {mode,passed:count === cells.length,cells});
	const header = '| URL | Preset | Performance | Accessibility | Best Practices | SEO | Attempts | Benchmark | Load start/end | Idle | Matomo credited / total TBT (ms) | Expectations or failures |';
	const rows = cells.map((cell) => {
		const lab = cell.lab;
		const attempts = cell.measurement?.attempts.map((a) => a.number + ' ' + a.status).join(', ') ?? 'legacy';
		const proof = cell.performanceAttribution;
		return '| ' + [cell.path,cell.preset,...categories.map((id) => cell.scores[id] ?? '—'),attempts,
			lab?.benchmarkIndex?.toFixed(0) ?? '—',lab ? lab.load1Start.toFixed(2) + '/' + lab.load1End.toFixed(2) : '—',
			lab?.cpuIdlePercent?.toFixed(1) ?? '—',proof ? proof.creditedBlockingMs.toFixed(1) + ' / ' + proof.reportedTbtMs.toFixed(1) : '—',
			[...cell.exceptions,...cell.failures].join(', ')].join(' | ') + ' |';
	});
	await writeFile(join(directory, mode + '.md'), [header,'|---|---|---:|---:|---:|---:|---|---:|---|---:|---:|---|',...rows].join('\n') + '\n');
	process.stdout.write(mode + ': ' + count + '/' + cells.length + ' passed\n');
	return {passed:count === cells.length,count};
}

if (values['read-run']) {
	const directory = external(await realpath(values['read-run']));
	const manifest = JSON.parse(await readFile(join(directory, 'manifest.json'), 'utf8'));
	process.exitCode = (await summarize(directory, manifest, strict)).passed ? 0 : 1;
} else {
	const runs = Number(values.runs ?? 1);
	const seconds = Number(values['max-quiet-seconds'] ?? 14_400);
	if (![1,2].includes(runs) || !Number.isInteger(seconds) || seconds <= 0 || seconds > 14_400)
		throw new Error('Use one or two matrices and a quiet-wait budget of up to 14400 seconds');
	const output = external(values.output ?? join(homedir(), 'work/webdeploy-oss/lighthouse'));
	const release = join(output, 'releases', new Date().toISOString().replaceAll(':','-'));
	await mkdir(release, {recursive:true});
	const budget = {remainingMs:seconds * 1000};
	const receipt = {startedUtc:new Date().toISOString(), plannedRuns:runs, maxQuietSeconds:seconds,
		measurementPolicy, runs: /** @type {{directory:string,gate:number,strict:number,exhausted:boolean}[]} */ ([])};
	const receiptFile = join(release,'release.json');
	await writeJson(receiptFile, {...receipt,status:'running'});
	process.stdout.write('Release ' + release + '\n');
	let passed = true;
	try {
		for (let index = 0; index < runs; index++) {
			const {directory,manifest,exhausted} = await gather(budget,index === 0);
			const gate = await summarize(directory, manifest, false);
			const raw = await summarize(directory, manifest, true);
			receipt.runs.push({directory:relative(output,directory),gate:gate.count,strict:raw.count,exhausted});
			await writeJson(receiptFile, {...receipt,status:'running',remainingQuietMs:budget.remainingMs});
			passed = passed && (strict ? raw.passed : gate.passed);
			if (exhausted) break;
		}
		const exhausted = receipt.runs.some((run) => run.exhausted);
		await writeJson(receiptFile, {...receipt,status:exhausted ? 'quiet-timeout' : 'finished',
			finishedUtc:new Date().toISOString(),remainingQuietMs:budget.remainingMs});
		process.exitCode = passed && receipt.runs.length === runs ? 0 : 1;
	} catch (error) {
		await writeJson(receiptFile, {...receipt,status:'error',error:String(error),
			finishedUtc:new Date().toISOString(),remainingQuietMs:budget.remainingMs});
		throw error;
	}
}
