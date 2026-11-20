// @ts-check
// SPDX-FileCopyrightText: 2026 WEBDEPLOY S.R.L.
// SPDX-License-Identifier: AGPL-3.0-only
import { existsSync, readFileSync } from 'node:fs';
import { appendFile, link, mkdir, readFile, rename, rm, writeFile } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import { loadavg } from 'node:os';
import { dirname, join, relative } from 'node:path';
import { setTimeout as sleep } from 'node:timers/promises';
import { performance } from 'node:perf_hooks';
import { categories, reportName } from './lighthouse-gate.mjs';

/** @typedef {import('./lighthouse-types.d.ts').HostReading} HostReading */
/** @typedef {import('./lighthouse-types.d.ts').QuietWindow} QuietWindow */
/** @typedef {import('./lighthouse-types.d.ts').WaitBudget} WaitBudget */
/** @typedef {import('./lighthouse-types.d.ts').Measurement} Measurement */
/** @typedef {import('./lighthouse-types.d.ts').MeasurementRecord} MeasurementRecord */
/** @typedef {import('./lighthouse-types.d.ts').MeasurementAttempt} MeasurementAttempt */
/** @typedef {import('./lighthouse-types.d.ts').Preset} Preset */

export const measurementPolicy = Object.freeze({
	loadBelow: 3, idleAbovePercent: 70, cellQuietMs: 20_000, initialQuietMs: 60_000,
	sampleMs: 5_000, minimumBenchmark: 1000, runtimeRetries: 2, degradedRetries: 1
});

/** Read the same Linux workstation CPU counters for both qualification and per-report conditions.
 * @returns {HostReading}
 */
export function hostSample() {
	const fields = readFileSync('/proc/stat', 'utf8').split('\n', 1)[0].trim().split(/\s+/).slice(1, 9).map(Number);
	if (fields.length !== 8 || fields.some((value) => !Number.isFinite(value))) throw new Error('Linux CPU counters are unavailable');
	return {
		time: performance.now(), utc: new Date().toISOString(), load1: loadavg()[0],
		idle: fields[3], total: fields.reduce((sum, value) => sum + value, 0)
	};
}

/** @param {HostReading} before @param {HostReading} after @returns {number} */
export function idlePercent(before, after) {
	const total = after.total - before.total;
	return total > 0 ? 100 * (after.idle - before.idle) / total : 0;
}

/** @param {number} previous @param {import('./lighthouse-types.d.ts').QuietInterval} sample @returns {number} */
export function quietDuration(previous, sample) {
	const policy = measurementPolicy;
	if (sample.load1Start >= policy.loadBelow || sample.load1End >= policy.loadBelow ||
		sample.idlePercent <= policy.idleAbovePercent || sample.durationMs > 2 * policy.sampleMs) return 0;
	return previous + sample.durationMs;
}

/** Sleep between samples and charge the actual wait to the shared release-run budget.
 * @param {WaitBudget} budget @param {number} [requiredMs] @param {string} [sampleLog] @returns {Promise<QuietWindow>}
 */
export async function waitForQuiet(budget, requiredMs = measurementPolicy.cellQuietMs, sampleLog) {
	/** @type {QuietWindow} */
	const window = {qualified: false, waitedMs: 0, requiredMs, consecutiveMs: 0, samples: []};
	let before = hostSample();
	while (budget.remainingMs > 0) {
		await sleep(Math.min(measurementPolicy.sampleMs, budget.remainingMs));
		const after = hostSample();
		const durationMs = Math.max(after.time - before.time, Date.parse(after.utc) - Date.parse(before.utc));
		const sample = {utc: after.utc, load1Start: before.load1, load1End: after.load1, idlePercent: idlePercent(before, after), durationMs};
		window.samples.push(sample);
		if (sampleLog) await appendFile(sampleLog, JSON.stringify(sample) + '\n');
		window.waitedMs += durationMs;
		window.consecutiveMs = quietDuration(window.consecutiveMs, sample);
		const timeLeft = budget.remainingMs - durationMs;
		budget.remainingMs = Math.max(0, timeLeft);
		if (window.consecutiveMs >= requiredMs && timeLeft >= 0) {
			window.qualified = true;
			break;
		}
		before = after;
	}
	return window;
}

/** Classify measurement quality without consulting any numerical category score for selection.
 * @param {Measurement} result @param {boolean} ordinary404
 * @returns {{status:'measured'|'runtime-error'|'host-degraded',reason:string,hostDegraded:boolean}}
 */
export function classifyAttempt(result, ordinary404) {
	const {report, exitCode, lab} = result;
	const index = lab.benchmarkIndex;
	const hostDegraded = typeof index === 'number' && index < measurementPolicy.minimumBenchmark;
	const error = report?.runtimeError;
	const expected404 = ordinary404 && error?.code === 'ERRORED_DOCUMENT_REQUEST';
	const missingScore = !report || categories.some((id) => {
		const value = report.categories?.[id]?.score;
		return typeof value !== 'number' || !Number.isFinite(value) || value < 0 || value > 1;
	});
	if (!report || (!expected404 && (error || missingScore)) || typeof index !== 'number' || !Number.isFinite(index)) {
		const reason = error ? error.code + ': ' + error.message :
			!report ? 'Missing or unreadable Lighthouse report' : exitCode ? 'Lighthouse exit ' + exitCode : missingScore ? 'Unscorable Lighthouse category' : 'Missing benchmarkIndex';
		return {status: 'runtime-error', reason, hostDegraded};
	}
	if (hostDegraded) return {status:'host-degraded', reason:'benchmarkIndex below 1000', hostDegraded};
	const reason = expected404 ? 'Expected ordinary HTTP 404 navigation diagnostic' :
		exitCode !== 0 ? 'Lighthouse exit ' + exitCode + ' after producing a numerical report' : '';
	return {status:'measured', reason, hostDegraded};
}

/** @param {MeasurementAttempt[]} attempts @returns {boolean} */
export function shouldRetry(attempts) {
	const status = attempts.at(-1)?.status;
	if (status === 'runtime-error') return attempts.filter((a) => a.status === status).length <= measurementPolicy.runtimeRetries;
	if (status === 'host-degraded') return attempts.filter((a) => a.status === status).length <= measurementPolicy.degradedRetries;
	return false;
}

/** @param {string} file @param {unknown} data @returns {Promise<void>} */
export async function writeJson(file, data) {
	const temporary = file + '.' + randomUUID() + '.tmp';
	try {
		await writeFile(temporary, JSON.stringify(data, null, 2) + '\n');
		await rename(temporary, file);
	} finally {
		await rm(temporary, {force:true});
	}
}

/** Preserve every raw attempt, including the first valid score even when it falls below 100.
 * @param {string} directory @param {string} path @param {Preset} preset @param {boolean} ordinary404
 * @param {WaitBudget} budget @param {(file:string) => Promise<Measurement>} collect
 * @param {typeof waitForQuiet} [qualify] @returns {Promise<MeasurementRecord>}
 */
export async function measureCell(directory, path, preset, ordinary404, budget, collect, qualify = waitForQuiet) {
	const name = ordinary404 ? '404-default' : reportName(path);
	const folder = join(directory, 'attempts', preset, name);
	const canonical = join(directory, preset, name + '.json');
	const conditions = join(directory, 'conditions', preset, name + '.json');
	await mkdir(folder, {recursive:true});
	await mkdir(dirname(conditions), {recursive:true});
	/** @type {MeasurementRecord} */
	const record = {path,preset,ordinary404,selected:null,outcome:'host-timeout',attempts:[]};
	do {
		const number = record.attempts.length + 1;
		const file = join(folder, String(number).padStart(2, '0') + '.json');
		const quiet = await qualify(budget, measurementPolicy.cellQuietMs, file + '.host.jsonl');
		await writeJson(file + '.quiet.json', quiet);
		/** @type {MeasurementAttempt} */
		const attempt = {number,status:'host-timeout',reason:'Quiet-wait budget exhausted',hostDegraded:false,
			exitCode:null,benchmarkIndex:null,raw:null,log:null,conditions:null,quiet:relative(directory,file + '.quiet.json')};
		if (quiet.qualified) {
			const result = await collect(file);
			const classification = classifyAttempt(result, ordinary404);
			Object.assign(attempt, classification);
			attempt.exitCode = result.exitCode;
			attempt.benchmarkIndex = result.lab.benchmarkIndex;
			attempt.raw = existsSync(file) ? relative(directory,file) : null;
			attempt.log = relative(directory,file + '.log');
			attempt.conditions = relative(directory,file + '.lab.json');
			if (classification.status === 'measured') {
				record.selected = number;
				await link(file, canonical);
				await link(file + '.lab.json', conditions);
				if (result.exitCode !== 0 && !ordinary404) await writeFile(canonical + '.error', classification.reason);
			}
		}
		const artifacts = [attempt.raw && `[Raw](${attempt.raw})`, attempt.log && `[Log](${attempt.log})`,
			attempt.conditions && `[Host](${attempt.conditions})`, `[Quiet window](${attempt.quiet})`].filter(Boolean).join(' · ');
		const label = attempt.status + (attempt.hostDegraded && attempt.status !== 'host-degraded' ? ' / host-degraded' : '');
		await appendFile(join(directory, 'attempts.md'), `| ${path} | ${preset} | ${ordinary404 ? 'ordinary 404' : 'scored'} | ${number} | ${label} | ${attempt.benchmarkIndex ?? '—'} | ${artifacts} |\n`);
		record.attempts.push(attempt);
		record.outcome = attempt.status;
		await writeJson(join(folder, 'attempts.json'), record);
	} while (shouldRetry(record.attempts));
	if (record.selected === null) {
		const last = record.attempts.at(-1);
		// Keep data from an invalid attempt inspectable, without presenting it as an accepted score.
		if (last?.raw) await link(join(directory,last.raw),canonical);
		if (last?.conditions) await link(join(directory,last.conditions),conditions);
		await writeFile(canonical + '.error', last?.reason ?? 'No accepted measurement');
	}
	return record;
}

/** Recompute the selection from the raw attempts and host receipts. A valid low score
 * cannot be relabeled as a failed measurement to select a later attempt.
 * @param {string} directory @param {string} path @param {Preset} preset @param {boolean} [ordinary404]
 * @returns {Promise<MeasurementRecord>}
 */
export async function verifiedRecord(directory, path, preset, ordinary404 = false) {
	const name = ordinary404 ? '404-default' : reportName(path);
	const folder = join(directory, 'attempts', preset, name);
	/** @type {MeasurementRecord} */
	const record = JSON.parse(await readFile(join(folder,'attempts.json'),'utf8'));
	if (record.path !== path || record.preset !== preset || record.ordinary404 !== ordinary404 || !record.attempts?.length)
		throw new Error('Unexpected measurement ledger');
	for (const [index, attempt] of record.attempts.entries()) {
		const file = join(folder,String(index + 1).padStart(2,'0') + '.json');
		if (attempt.number !== index + 1 || attempt.quiet !== relative(directory,file + '.quiet.json') ||
			(index && !shouldRetry(record.attempts.slice(0,index)))) throw new Error('Invalid attempt sequence');
		/** @type {QuietWindow} */
		const quiet = JSON.parse(await readFile(file + '.quiet.json','utf8'));
		if (attempt.status === 'host-timeout') {
			if (quiet.qualified || index !== record.attempts.length - 1) throw new Error('Invalid quiet timeout');
			continue;
		}
		if (!quiet.qualified || quiet.requiredMs !== measurementPolicy.cellQuietMs ||
			quiet.samples.reduce(quietDuration,0) < measurementPolicy.cellQuietMs)
			throw new Error('Missing continuous quiet qualification');
		if (attempt.conditions !== relative(directory,file + '.lab.json') || attempt.exitCode === null)
			throw new Error('Missing attempt conditions');
		/** @type {import('./lighthouse-types.d.ts').LabConditions} */
		const lab = JSON.parse(await readFile(file + '.lab.json','utf8'));
		/** @type {import('./lighthouse-types.d.ts').LighthouseReport | null} */
		let report = null;
		let bytes;
		if (existsSync(file)) {
			if (attempt.raw !== relative(directory,file)) throw new Error('Unexpected raw attempt path');
			bytes = await readFile(file);
			try { report = JSON.parse(bytes.toString()); } catch { /* A corrupt attempt is recorded as a collection error. */ }
		}
		const classification = classifyAttempt({exitCode:attempt.exitCode,lab,report},ordinary404);
		if ((report && (report.environment?.benchmarkIndex ?? null) !== lab.benchmarkIndex) ||
			classification.status !== attempt.status || classification.hostDegraded !== attempt.hostDegraded ||
			lab.benchmarkIndex !== attempt.benchmarkIndex) throw new Error('Attempt disagrees with its raw evidence');
		if (attempt.status === 'measured') {
			if (record.selected !== attempt.number || index !== record.attempts.length - 1 || !bytes ||
				!bytes.equals(await readFile(join(directory,preset,name + '.json')))) throw new Error('Invalid selected measurement');
		}
	}
	const last = record.attempts.at(-1);
	if (!last || record.outcome !== last.status || record.selected !== (last.status === 'measured' ? last.number : null))
		throw new Error('Incomplete measurement selection');
	return record;
}
