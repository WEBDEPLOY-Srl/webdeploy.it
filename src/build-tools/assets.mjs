// @ts-check
// SPDX-FileCopyrightText: 2026 WEBDEPLOY S.R.L.
// SPDX-License-Identifier: AGPL-3.0-only
import { readFile } from 'node:fs/promises';
import { dirname, extname, join, relative } from 'node:path';
import { files, digest, within, write } from './files.mjs';

/** @typedef {import('../types.d.ts').BuiltAssets} BuiltAssets */

/** @param {string} url @param {Map<string,string>} urls @returns {string} */
export function mediaUrl(url, urls) {
	const [path] = url.split(/[?#]/);
	return (urls.get(path) ?? path) + url.slice(path.length);
}

/**
 * Imported styles retain the URL base of their source. Author imports are local,
 * unconditional and top-level. Explicit layer blocks belong inside the imported files.
 * @param {string} base
 * @param {string} file
 * @param {Map<string,string>} urls
 * @param {string[]} [chain]
 * @returns {Promise<string>}
 */
async function sheet(base, file, urls, chain = []) {
	if (chain.includes(file)) throw new Error(`CSS import cycle: ${[...chain, file].join(' -> ')}`);
	const source = await readFile(within(base, file), 'utf8');
	const pieces = [];
	let last = 0;
	for (const match of source.matchAll(/^\s*@import\s+['"]([^'"]+)['"]\s*;/gm)) {
		const next = relative(base, within(base, join(dirname(file), match[1])));
		pieces.push(source.slice(last, match.index), await sheet(base, next, urls, [...chain, file]));
		last = match.index + match[0].length;
	}
	pieces.push(source.slice(last));
	const result = pieces.join('');
	if (/^\s*@import\b/m.test(result)) throw new Error(`Unsupported CSS import in ${file}`);
	return result.replace(
		/url\((['"]?)(\/(?!\/)[^"')]+)\1\)/g,
		(_, quote, url) => `url(${quote}${mediaUrl(url, urls)}${quote})`
	);
}

/** @param {string} root @param {string} stage @returns {Promise<BuiltAssets>} */
export async function emitAssets(root, stage) {
	/** @type {Map<string,string>} */
	const urls = new Map();
	/** @type {Map<string,Buffer | string>} */
	const code = new Map();
	for (const file of await files(join(root, 'static'))) {
		const bytes = await readFile(join(root, 'static', file));
		await write(join(stage, file), bytes);
		if (!/\.(?:woff2|png|jpe?g|webp|svg|avif)$/i.test(file)) continue;
		const ext = extname(file);
		const url = `/assets/media/${file.slice(0, -ext.length)}.${digest(bytes).slice(0, 16)}${ext}`;
		urls.set('/' + file, url);
		await write(join(stage, url), bytes);
	}
	for (const folder of ['js', 'css']) {
		const base = join(root, 'assets', folder);
		for (const file of await files(base)) {
			const bytes =
				folder === 'css' ? await sheet(base, file, urls) : await readFile(join(base, file));
			code.set(posixPath(folder, file), bytes);
		}
	}
	const vendor = join(root, 'vendor');
	/** @type {Record<string,string>} */
	const expected = JSON.parse(await readFile(join(vendor, 'manifest.json'), 'utf8'));
	for (const [file, hash] of Object.entries(expected).sort(([a], [b]) =>
		a.localeCompare(b, 'en')
	)) {
		const bytes = await readFile(within(vendor, file));
		if (digest(bytes) !== hash) throw new Error(`Vendor checksum mismatch: ${file}`);
		code.set(posixPath('vendor', file), bytes);
	}
	const identity = [...code].map(([name, bytes]) => [name, digest(bytes)]).sort();
	const base = '/assets/build/' + digest(JSON.stringify(identity)).slice(0, 16);
	const emitted = new Set([...urls.values(), ...[...code.keys()].map((name) => base + '/' + name)]);
	for (const [name, bytes] of code) {
		if (name.startsWith('vendor/')) continue;
		const css = name.endsWith('.css');
		const links = css
			? /url\(\s*['"]?([^'"\s)]+)/g
			: /(?:^\s*(?:import|export)\s+(?:[^'"\n;]*?\bfrom\s*)?|\bimport\(\s*|\bnew URL\(\s*)['"](\.[^'"]+)['"]/gm;
		// JSDoc imports reference development declarations and do not run in the browser.
		const source = css
			? bytes.toString()
			: bytes.toString().replace(/\/\*[\s\S]*?\*\/|^\s*\/\/[^\n]*/gm, '');
		for (const match of source.matchAll(links)) {
			if (match[1].startsWith('#') || match[1].startsWith('data:')) continue;
			const url = new URL(match[1], 'https://assets.invalid' + base + '/' + name);
			if (url.origin === 'https://assets.invalid' && !emitted.has(url.pathname))
				throw new Error(`Missing asset from ${name}: ${match[1]}`);
		}
	}
	for (const [name, bytes] of code) await write(join(stage, base, name), bytes);
	return { base, urls };
}

/** @param {string} folder @param {string} file @returns {string} */
function posixPath(folder, file) {
	return folder + '/' + file.replaceAll('\\', '/');
}
