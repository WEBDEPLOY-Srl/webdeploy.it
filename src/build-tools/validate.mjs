// @ts-check
// SPDX-FileCopyrightText: 2026 WEBDEPLOY S.R.L.
// SPDX-License-Identifier: AGPL-3.0-only
import { files } from './files.mjs';

/** @typedef {{tag:string, attrs:Record<string,string>}} Element */
/** @typedef {import('../types.d.ts').SitePage} SitePage */

/** @param {string} html @returns {Element[]} */
function elements(html) {
	const source = html.replace(/<!--[\s\S]*?-->/g, '');
	const tags = [];
	for (const match of source.matchAll(/<([A-Za-z][\w:-]*)((?:[^<>"']|"[^"]*"|'[^']*')*)>/g)) {
		/** @type {Record<string,string>} */
		const attrs = Object.create(null);
		for (const attr of match[2].matchAll(
			/\s+([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g
		)) {
			attrs[attr[1].toLowerCase()] = attr[2] ?? attr[3] ?? attr[4] ?? '';
		}
		tags.push({ tag: match[1].toLowerCase(), attrs });
	}
	return tags;
}

/** @param {SitePage[]} pages @param {string[]} templates @returns {void} */
export function validateRoutes(pages, templates) {
	const paths = new Set();
	const used = new Set();
	for (const page of pages) {
		if (
			!/^\/(?:[a-z0-9-]+(?:\/[a-z0-9-]+)*)?$/.test(page.path) ||
			paths.has(page.path) ||
			used.has(page.file)
		)
			throw new Error(`Invalid or duplicate route: ${page.path}`);
		paths.add(page.path);
		used.add(page.file);
	}
	if (!paths.has('/') || !paths.has('/404'))
		throw new Error('Expected homepage and error document');
	for (const name of templates.filter((file) => file.endsWith('.html')))
		if (!used.has(name)) throw new Error(`Unlisted page: ${name}`);
}

/** @param {Map<string,string>} docs @param {string} stage @param {string} origin @returns {Promise<void>} */
export async function validateDocuments(docs, stage, origin) {
	const disk = new Set((await files(stage)).map((file) => '/' + file));
	/** @type {Map<string,Set<string>>} */
	const anchors = new Map();
	/** @type {Array<[string,string]>} */
	const references = [];
	for (const [route, html] of docs) {
		if (!/<title>[^<]+<\/title>/i.test(html)) throw new Error(`Missing title: ${route}`);
		const tags = elements(html);
		if (
			!tags.some(
				(e) => e.tag === 'meta' && e.attrs.name === 'description' && e.attrs.content?.trim()
			)
		)
			throw new Error(`Missing description: ${route}`);
		if (tags.filter((e) => e.tag === 'h1').length !== 1)
			throw new Error(`Expected one heading: ${route}`);
		const ids = new Set();
		anchors.set(route, ids);
		for (const { tag, attrs } of tags) {
			if (attrs.id) {
				if (ids.has(attrs.id)) throw new Error(`Duplicate id: ${route}#${attrs.id}`);
				ids.add(attrs.id);
			}
			if (tag === 'script' && !attrs.src && attrs.type !== 'application/ld+json')
				throw new Error(`Executable inline script: ${route}`);
			if (Object.keys(attrs).some((k) => /^on[a-z]/.test(k)) || 'style' in attrs)
				throw new Error(`Inline handler or style: ${route}`);
			for (const attr of ['href', 'src', 'action', 'data-image'])
				if (attrs[attr]) references.push([route, attrs[attr]]);
			for (const attr of ['srcset', 'imagesrcset'])
				if (attrs[attr]) {
					// A single embedded image has a comma between its MIME type and payload.
					if (/^data:image\/avif;base64,[A-Za-z0-9+/]+={0,2}$/.test(attrs[attr])) continue;
					for (const item of attrs[attr].split(','))
						references.push([route, item.trim().split(/\s+/)[0]]);
				}
			if (tag === 'meta' && ['og:image', 'twitter:image'].includes(attrs.property ?? attrs.name))
				references.push([route, attrs.content]);
		}
	}
	for (const [route, href] of references) {
		const url = new URL(href.replaceAll('&amp;', '&'), new URL(route, origin));
		if (url.protocol === 'javascript:') throw new Error(`Forbidden link on ${route}`);
		if (url.origin !== origin) continue;
		const path = decodeURIComponent(url.pathname);
		if (!anchors.has(path) && !disk.has(path)) throw new Error(`Broken link: ${route} -> ${href}`);
		if (
			url.hash &&
			anchors.has(path) &&
			!anchors.get(path)?.has(decodeURIComponent(url.hash.slice(1)))
		)
			throw new Error(`Missing fragment: ${route} -> ${href}`);
	}
}
