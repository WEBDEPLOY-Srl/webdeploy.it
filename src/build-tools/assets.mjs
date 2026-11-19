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
	const raw = await readFile(within(base, file), 'utf8');
	const source = raw.replace(
		/url\(\s*(?:(["'])(.*?)\1|([^\s)]+))\s*\)/gs,
		(whole, quote, quoted, plain) => {
			const url = String(quoted ?? plain);
			if (url.startsWith('#') || url.startsWith('data:')) return whole;
			const [path] = url.split(/[?#]/);
			const stable = path.startsWith('/')
				? path
				: '/' + relative(join(base, '../../static'), join(base, dirname(file), path));
			if (!urls.has(stable)) throw new Error('Missing stylesheet asset in ' + file + ': ' + url);
			return (
				'url(' +
				(quote ?? '') +
				mediaUrl(stable + url.slice(path.length), urls) +
				(quote ?? '') +
				')'
			);
		}
	);
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
	return result;
}

/** @param {string[]} [styles] @returns {string} */
export function stylesheetPath(styles = []) {
	return styles.length ? 'css/page-' + digest(JSON.stringify(styles)).slice(0, 16) + '.css' : 'css/site.css';
}

/** @param {string} root @param {string} stage @param {import('../types.d.ts').SitePage[]} pages @returns {Promise<BuiltAssets>} */
export async function emitAssets(root, stage, pages) {
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
	// The browser needs one ordered stylesheet for each distinct page composition.
	const publishedSheets = new Set(['css/no-script.css', 'css/site.css']);
	for (const { styles = [], firstStylesheet } of pages) {
		if (firstStylesheet) {
			const initial = 'css/' + firstStylesheet + '.css';
			if (!code.has(initial)) throw new Error('Missing first-paint stylesheet: ' + firstStylesheet);
			publishedSheets.add(initial);
		}
		const output = stylesheetPath(styles);
		if (publishedSheets.has(output)) continue;
		const parts = ['site', ...styles].map((style) => {
			const text = code.get('css/' + style + '.css');
			if (typeof text !== 'string') throw new Error('Missing page stylesheet: ' + style);
			return text;
		});
		code.set(output, parts.join('\n'));
		publishedSheets.add(output);
	}
	for (const name of code.keys()) {
		if (name.startsWith('css/') && !publishedSheets.has(name)) code.delete(name);
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
	// Vendor archives stay byte-identical in source. Resolve their CSS image
	// references against the original file, then emit individually hashed media.
	const vendorMedia = new Map();
	for (const [name, bytes] of code) {
		if (!name.startsWith('vendor/') || !/\.(?:png|woff2|svg)$/.test(name)) continue;
		const ext = extname(name);
		const target =
			'/assets/media/' + name.slice(0, -ext.length) + '.' + digest(bytes).slice(0, 16) + ext;
		vendorMedia.set(name, target);
		await write(join(stage, target), bytes);
	}
	for (const [name, bytes] of code) {
		if (!name.startsWith('vendor/') || !name.endsWith('.css')) continue;
		const css = bytes
			.toString()
			.replace(/url\((['"]?)(?!#|data:)([^'")]+)\1\)/g, (whole, quote, url) => {
				const target = vendorMedia.get(join(dirname(name), url));
				if (!target) throw new Error('Unknown vendor CSS asset: ' + url);
				return 'url(' + quote + target + quote + ')';
			});
		code.set(name, css);
	}
	const identity = [...code].map(([name, bytes]) => [name, digest(bytes)]).sort();
	const base = '/assets/build/' + digest(JSON.stringify(identity)).slice(0, 16);
	const emitted = new Set([...urls.values(), ...[...code.keys()].map((name) => base + '/' + name)]);
	/** @type {Map<string,string[]>} */
	const imports = new Map();
	for (const [name, bytes] of code) {
		if (name.startsWith('vendor/')) continue;
		const css = name.endsWith('.css');
		const source = css ? bytes.toString() : bytes.toString().replace(/\/\*[\s\S]*?\*\/|^\s*\/\/[^\n]*/gm, '');
		// Keep static imports distinct from modules and workers fetched only on interaction.
		const links = css
			? /url\(\s*['"]?([^'"\s)]+)/g
			: /(?:^|;)\s*(?:import\s*(?:[\w$*,\s{}]*?\bfrom\s*)?|export\s*(?:\*(?:\s+as\s+[\w$]+)?|\{[^{};]*\})\s*from\s*)['"](\.[^'"]+)['"]|\b(?:import|new URL)\(\s*['"](\.[^'"]+)['"]/gm;
		const ownUrl = base + '/' + name;
		const dependencies = [];
		for (const match of source.matchAll(links)) {
			const specifier = match[1] ?? match[2];
			if (specifier.startsWith('#') || specifier.startsWith('data:')) continue;
			const url = new URL(specifier, 'https://assets.invalid' + ownUrl);
			if (url.origin !== 'https://assets.invalid') continue;
			if (!emitted.has(url.pathname)) throw new Error('Missing asset from ' + name + ': ' + specifier);
			if (!css && match[1]) dependencies.push(url.pathname);
		}
		if (!css) imports.set(ownUrl, dependencies);
	}
	for (const [name, bytes] of code) await write(join(stage, base, name), bytes);
	return { base, urls, imports };
}

/** @param {string} folder @param {string} file @returns {string} */
function posixPath(folder, file) {
	return folder + '/' + file.replaceAll('\\', '/');
}
