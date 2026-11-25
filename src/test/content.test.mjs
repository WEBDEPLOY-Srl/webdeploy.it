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

test('preserves the privacy and newsletter dictionaries', () => {
	assert.deepEqual(
		[en.privacy, en.newsletter, it.privacy, it.newsletter].map((tree) =>
			digest(JSON.stringify(tree))
		),
		[
			'39f8e57883879d475f92b65c1a02b9235bc14a0c2d1796209c11ce36779f58bd',
			'ab5e92254321f615066c81b57444401286cb36120f8c5f2950425ec4827ad66f',
			'42f20dfee96881845a9d8b1c349da45ceb4019d121f551a7ec135150ce82fd1e',
			'aeca80e6355a10bfca58b496316c9784758b2210bd25f2609b323e65149b8363'
		]
	);
});

test('the two list-specific consent statements stay verbatim across newsletter copy edits', () => {
	assert.deepEqual(
		[en.newsletter, it.newsletter].map(({ generalText, marketingText }) =>
			digest(JSON.stringify([generalText, marketingText]))
		),
		[
			'7b515084c6dcdad4527061a0451933f7dd57a422989f951ed376e93a2df324f8',
			'6d0160f2b6c136c522c964873c763b7769f64e680c8bc46e82bd5079b571a1fd'
		]
	);
});

test('retains canonical sitemap coverage and the site, service and article data', () => {
	assert.equal(site.url, new URL(site.url).origin);
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
