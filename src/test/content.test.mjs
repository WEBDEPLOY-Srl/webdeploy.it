// @ts-check
// SPDX-FileCopyrightText: 2026 WEBDEPLOY S.R.L.
// SPDX-License-Identifier: AGPL-3.0-only
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { en } from '../content/en.mjs';
import { it } from '../content/it.mjs';
import { pages } from '../data/pages.mjs';
import { site } from '../data/site.mjs';
import { digest } from '../build-tools/files.mjs';
import { stringAt } from '../build-tools/template.mjs';
import { organization, pageSchema } from '../build-tools/schema.mjs';
import { sitemap } from '../build-tools/documents.mjs';

/** @param {import('../types.d.ts').Content} value @param {string} [at] @returns {string[]} */
function keys(value, at = '') {
	if (typeof value === 'string') {
		assert.ok(value.trim(), at);
		return [at];
	}
	const prefix = Array.isArray(value) ? at + '[]' : at;
	return Object.entries(value).flatMap(([key, text]) => keys(text, prefix + '.' + key));
}

test('the Italian archive mirrors every English string and array', () => {
	assert.deepEqual(keys(en).sort(), keys(it).sort());
	assert.ok(keys(en).length >= 487);
	for (const page of pages)
		for (const language of [en, it])
			for (const key of [page.title, page.description]) assert.ok(stringAt(language, key));
});

test('preserves the four approved privacy and newsletter dictionaries', () => {
	assert.deepEqual(
		[en.privacy, en.newsletter, it.privacy, it.newsletter].map((tree) =>
			digest(JSON.stringify(tree))
		),
		[
			'39f8e57883879d475f92b65c1a02b9235bc14a0c2d1796209c11ce36779f58bd',
			'399f2278633fde0c5d502100b8fae7a094b8aca3fbd2b00fce3ba715162c26d2',
			'42f20dfee96881845a9d8b1c349da45ceb4019d121f551a7ec135150ce82fd1e',
			'9094b413295dc0b1e2c4f3464516239e9aad0b8fc6b20d23435dce61d19446a7'
		]
	);
});

test('retains canonical sitemap coverage and the site, service and article data', () => {
	const xml = sitemap(pages, site.url);
	const locations = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => new URL(match[1]));
	const expected = [
		'/',
		'/contacts',
		'/developer-manifesto',
		'/news',
		'/news/fosdem-2026',
		'/news/php2shell-cve-2026-109618-109619',
		'/newsletter',
		'/privacy',
		'/security',
		'/services/backup',
		'/services/consulting',
		'/services/linux-workstations',
		'/totem'
	];
	assert.deepEqual(
		locations.map((url) => url.pathname),
		expected
	);
	assert.ok(locations.every((url) => url.origin === site.url && !url.search && !url.hash));
	assert.equal(organization(site).logo, site.url + '/webdeploy-logo.svg');
	for (const page of pages.filter((p) => p.kind)) {
		const block = pageSchema(page, site, stringAt(en, page.title), stringAt(en, page.description));
		const data = JSON.parse(block.slice(block.indexOf('>') + 1, block.lastIndexOf('<')));
		assert.equal(data['@type'], page.kind === 'service' ? 'Service' : 'NewsArticle');
		assert.equal((data.publisher ?? data.provider).logo, site.url + '/webdeploy-logo.svg');
	}
});
