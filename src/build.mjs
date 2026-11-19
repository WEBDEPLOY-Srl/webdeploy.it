// @ts-check
// SPDX-FileCopyrightText: 2026 WEBDEPLOY S.R.L.
// SPDX-License-Identifier: AGPL-3.0-only
import { lstat, mkdir, mkdtemp, readFile, readlink, rename, rm, symlink } from 'node:fs/promises';
import { watch } from 'node:fs';
import { basename, dirname, join, resolve } from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { gzipSync, brotliCompressSync, constants } from 'node:zlib';
import { digest, files, write } from './build-tools/files.mjs';
import { emitAssets } from './build-tools/assets.mjs';
import { emitPage, sitemap } from './build-tools/documents.mjs';
import { readPartials } from './build-tools/template.mjs';
import { validateDocuments, validateRoutes } from './build-tools/validate.mjs';

/** @typedef {import('./types.d.ts').BuildInputs} BuildInputs */
/** @typedef {import('./types.d.ts').SiteFacts} SiteFacts */

/** @param {string} path @returns {Promise<import('node:fs').Stats | undefined>} */
async function statIfPresent(path) {
	try {
		return await lstat(path);
	} catch (error) {
		if (error instanceof Error && 'code' in error && error.code === 'ENOENT') return undefined;
		throw error;
	}
}

/** @param {string} stage @returns {Promise<void>} */
async function precompress(stage) {
	for (const name of await files(stage)) {
		if (!/\.(html|m?js|css|map|svg|txt|json|xml)$/.test(name)) continue;
		const path = join(stage, name);
		const bytes = await readFile(path);
		await write(path + '.gz', gzipSync(bytes, { level: 9 }));
		await write(
			path + '.br',
			brotliCompressSync(bytes, { params: { [constants.BROTLI_PARAM_QUALITY]: 8 } })
		);
	}
}

/**
 * Atomically publish a symbolic link only after the full generation validates.
 * Retain the old output if a build fails, including during a watch rebuild.
 * @param {BuildInputs & {site:SiteFacts}} input
 * @returns {Promise<void>}
 */
export async function buildSite({ root, output, pages, copy, site }) {
	const destination = resolve(output);
	if (!['build', 'vanilla-build'].includes(basename(destination)))
		throw new Error('Output must be named build or vanilla-build');
	const parent = dirname(destination);
	const generations = join(parent, '.' + basename(destination) + '-generations');
	await mkdir(generations, { recursive: true });
	const stage = await mkdtemp(join(generations, 'site-'));
	let published = false;
	try {
		validateRoutes(pages, await files(join(root, 'pages')));
		const assets = await emitAssets(root, stage);
		const partials = await readPartials(join(root, 'partials'));
		const docs = new Map();
		for (const page of pages)
			docs.set(page.path, await emitPage(page, site, copy, assets, partials, root, stage, pages));
		await write(join(stage, 'sitemap.xml'), sitemap(pages, site.url));
		await write(
			join(stage, '_app/version.json'),
			JSON.stringify({ version: '2-' + assets.base.split('/').at(-1) })
		);
		await validateDocuments(docs, stage, site.url);
		await precompress(stage);
		const pointer = stage + '.link';
		// The link moves to the output directory's parent. Keep it relative for portable artifacts.
		await symlink(basename(generations) + '/' + basename(stage), pointer, 'dir');
		const existing = await statIfPresent(destination);
		if (existing && !existing.isSymbolicLink()) {
			if (!existing.isDirectory() || !(await statIfPresent(join(destination, '_app/version.json'))))
				throw new Error('Refusing to replace unrecognized output: ' + destination);
			await rename(destination, join(generations, 'legacy-' + basename(stage)));
		}
		const previous = existing?.isSymbolicLink() ? await readlink(destination) : null;
		await rename(pointer, destination);
		published = true;
		if (
			previous &&
			dirname(previous) === basename(generations) &&
			/^site-[\w-]+$/.test(basename(previous))
		) {
			await rm(join(parent, previous), { recursive: true, force: true });
		}
	} finally {
		if (!published) {
			await rm(stage, { recursive: true, force: true });
			await rm(stage + '.link', { force: true });
		}
	}
}

/** @param {string} file @returns {Promise<Record<string,unknown>>} */
async function loadData(file) {
	return import(pathToFileURL(file).href + '?v=' + digest(await readFile(file)));
}

/** @param {string} root @param {string} output @returns {Promise<void>} */
async function compile(root, output) {
	const [catalog, content, facts] = await Promise.all([
		loadData(join(root, 'data/pages.mjs')),
		loadData(join(root, 'content/en.mjs')),
		loadData(join(root, 'data/site.mjs'))
	]);
	await buildSite({
		root,
		output,
		pages: /** @type {BuildInputs['pages']} */ (catalog.pages),
		copy: /** @type {BuildInputs['copy']} */ (content.en),
		site: /** @type {SiteFacts} */ (facts.site)
	});
}

/** @param {string} root @param {string} output @returns {Promise<void>} */
export async function watchSite(root, output) {
	let running = false,
		pending = false;
	async function rebuild() {
		pending = true;
		if (running) return;
		running = true;
		do {
			pending = false;
			try {
				await compile(root, output);
				process.stdout.write('Built ' + output + '\n');
			} catch (error) {
				process.stderr.write(String(error) + '\n');
			}
		} while (pending);
		running = false;
	}
	for (const dir of ['assets', 'static', 'vendor', 'content', 'data', 'pages', 'partials'])
		watch(join(root, dir), { recursive: true }, () => {
			void rebuild();
		});
	await rebuild();
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
	const root = dirname(fileURLToPath(import.meta.url));
	const args = process.argv.slice(2);
	const index = args.indexOf('--out');
	const output = index >= 0 ? resolve(args[index + 1]) : join(root, 'build');
	if (args.includes('--watch')) await watchSite(root, output);
	else await compile(root, output);
}
