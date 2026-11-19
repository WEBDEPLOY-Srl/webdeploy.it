// @ts-check
// SPDX-FileCopyrightText: 2026 WEBDEPLOY S.R.L.
// SPDX-License-Identifier: AGPL-3.0-only
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import { en } from '../content/en.mjs';
import { it } from '../content/it.mjs';
import { pages } from '../data/pages.mjs';
import { site } from '../data/site.mjs';
import { jsonLd, organization, publisher } from '../build-tools/schema.mjs';
import { render } from '../build-tools/template.mjs';

test('nginx sets one static policy for the public tracker and signup configuration', async () => {
	const config = await readFile(new URL('../../nginx.conf', import.meta.url), 'utf8');
	const policies = [
		...config.matchAll(/add_header\s+Content-Security-Policy\s+"([^"]+)"\s+always;/g)
	];
	assert.equal(policies.length, 1);
	const directives = new Map(
		policies[0][1].split(';').map((directive) => {
			const [name, ...sources] = directive.trim().split(/\s+/);
			return /** @type {const} */ ([name, sources]);
		})
	);
	const analytics = new URL(site.analytics.matomo.url).origin;
	assert.deepEqual(directives.get('script-src'), [
		"'self'",
		analytics,
		'https://connect.facebook.net'
	]);
	assert.deepEqual(directives.get('form-action'), ["'self'", 'https://newsletter.webdeploy.it']);
	assert.deepEqual(directives.get('style-src'), ["'self'"]);
	assert.deepEqual(directives.get('style-src-attr'), ["'unsafe-inline'"]);
	assert.deepEqual(directives.get('frame-ancestors'), ["'self'"]);
	assert.ok(directives.get('connect-src')?.includes(analytics));
	assert.equal(directives.has('worker-src'), false);
	for (const sources of directives.values()) {
		for (const source of sources.filter((value) => value.includes('.'))) {
			assert.equal(new URL(source).protocol, 'https:');
		}
	}
});

test('footer actions and routes resolve against both dictionaries', async () => {
	const template = await readFile(new URL('../partials/footer.html', import.meta.url), 'utf8');
	const paths = new Set(pages.map((page) => page.path));
	for (const copy of [en, it]) {
		const html = render(template, copy, new Map(), {
			email: site.contact.email,
			careersEmail: site.contact.careersEmail,
			sourceUrl: site.sourceUrl,
			office: [site.address.locality, site.address.street, site.address.postalCode].join(', ')
		});
		assert.equal([...html.matchAll(/class="site-footer__settings"/g)].length, 1);
		assert.ok(html.includes(copy.footer.cookieSettings));
		assert.ok(html.includes(site.sourceUrl));
		for (const [, target] of html.matchAll(/href="([^"]+)"/g)) {
			const url = new URL(target, site.url);
			if (url.origin === site.url) assert.ok(paths.has(url.pathname), target);
			else assert.ok(['https:', 'mailto:'].includes(url.protocol), target);
		}
	}
});

test('organization, support and publisher data remain safe in an HTML data block', () => {
	const org = organization(site);
	assert.equal(org.name, site.legalName);
	assert.deepEqual(org.contactPoint, [
		{
			'@type': 'ContactPoint',
			contactType: 'customer support',
			email: site.contact.email,
			telephone: site.contact.phone.href,
			availableLanguage: ['English', 'Italian']
		},
		{ '@type': 'ContactPoint', contactType: 'human resources', email: site.contact.careersEmail }
	]);
	assert.equal(publisher(site).url, site.url);
	const text = '</script><!--\u2028\u2029';
	const block = jsonLd({ text });
	const encoded = block.slice(block.indexOf('>') + 1, block.lastIndexOf('<'));
	assert.doesNotMatch(encoded, /[<\u2028\u2029]/);
	assert.deepEqual(JSON.parse(encoded), { text });
});
