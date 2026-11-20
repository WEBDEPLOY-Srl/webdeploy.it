// @ts-check
// SPDX-FileCopyrightText: 2026 WEBDEPLOY S.R.L.
// SPDX-License-Identifier: AGPL-3.0-only
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { digest, files, write } from './files.mjs';

/** @typedef {import('../types.d.ts').Content} Content */

/** @param {string} value @returns {string} */
export function escapeHtml(value) {
	return value
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;')
		.replaceAll("'", '&#39;');
}

/** @param {Content} tree @param {string} key @returns {string} */
export function stringAt(tree, key) {
	let node = tree;
	for (const part of key.split('.')) {
		if (typeof node === 'string' || !Object.hasOwn(node, part))
			throw new Error(`Missing content: ${key}`);
		node = /** @type {Record<string, Content>} */ (node)[part];
	}
	if (typeof node !== 'string' || !node.trim()) throw new Error(`Expected text at ${key}`);
	return node;
}

/** @param {string} directory @returns {Promise<Map<string,string>>} */
export async function readPartials(directory) {
	/** @type {Map<string,string>} */
	const partials = new Map();
	for (const file of await files(directory)) {
		if (file.endsWith('.html'))
			partials.set(file.slice(0, -5), await readFile(join(directory, file), 'utf8'));
	}
	return partials;
}

/**
 * Keep the actual SVG paths and source viewBox in separately cacheable images.
 * Native lazy loading lets a visitor reach the first screen without fetching
 * a large sheet of marks used only in the tools directory below it.
 * @param {string} source @param {Map<string,string>} partials @param {string} stage @returns {Promise<string>}
 */
export async function toolImages(source, partials, stage) {
	const pieces = [];
	let offset = 0;
	const pattern = /<svg\b[^>]*?viewBox="([^"]+)"[^>]*>\s*\{\{>\s*marks\/([\w.-]+)\s*\}\}\s*<\/svg>/g;
	for (const match of source.matchAll(pattern)) {
		const [, viewBox, name] = match;
		const dimensions = viewBox.trim().split(/\s+/).map(Number);
		if (dimensions.length !== 4 || !dimensions.every(Number.isFinite) || dimensions[2] <= 0 || dimensions[3] <= 0)
			throw new Error('Invalid tool mark viewBox: ' + name);
		const mark = partials.get('marks/' + name);
		if (!mark) throw new Error('Missing tool mark: ' + name);
		const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${escapeHtml(viewBox)}" fill="#00f0ff">\n${mark}</svg>\n`;
		const url = '/assets/media/tools/' + name + '.' + digest(svg).slice(0, 16) + '.svg';
		await write(join(stage, url), svg);
		pieces.push(source.slice(offset, match.index),
			`<img class="tool-mark" src="${url}" alt="" width="${dimensions[2]}" height="${dimensions[3]}" loading="lazy" decoding="async">`);
		offset = match.index + match[0].length;
	}
	pieces.push(source.slice(offset));
	return pieces.join('');
}

/**
 * Only local partials and known text keys can enter a template. Trusted slots
 * such as the rendered page body come from the build, never from site content.
 * @param {string} source
 * @param {Content} copy
 * @param {Map<string,string>} partials
 * @param {Record<string,string>} slots
 * @param {string[]} [chain]
 * @returns {string}
 */
export function render(source, copy, partials, slots, chain = []) {
	return source.replace(/\{\{([^{}]+)\}\}/g, (_, token) => {
		const name = String(token).trim();
		if (name.startsWith('>')) {
			const key = name.slice(1).trim();
			if (chain.includes(key))
				throw new Error(`Recursive partial: ${[...chain, key].join(' -> ')}`);
			const partial = partials.get(key);
			if (partial === undefined) throw new Error(`Missing partial: ${key}`);
			return render(partial, copy, partials, slots, [...chain, key]);
		}
		if (name.startsWith('@')) {
			const key = name.slice(1);
			if (!Object.hasOwn(slots, key)) throw new Error(`Missing slot: ${key}`);
			return slots[key];
		}
		return escapeHtml(stringAt(copy, name));
	});
}
