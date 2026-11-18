// @ts-check
// SPDX-FileCopyrightText: 2026 WEBDEPLOY S.R.L.
// SPDX-License-Identifier: AGPL-3.0-only
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mkdtemp, mkdir, readFile, readlink, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { brotliDecompressSync, gunzipSync } from 'node:zlib';
import { buildSite } from '../build.mjs';
import { digest, write, within } from '../build-tools/files.mjs';
import { render } from '../build-tools/template.mjs';
import { jsonLd, organization, publisher } from '../build-tools/schema.mjs';
import { validateRoutes } from '../build-tools/validate.mjs';

/** @type {import('../types.d.ts').SiteFacts} */
const site = {
	url: 'https://example.test',
	name: 'Example',
	legalName: 'Example Ltd',
	description: 'Test site',
	logoPath: '/logo.svg',
	defaultShareImage: '/logo.svg',
	sourceUrl: 'https://example.test/source',
	contact: {
		email: 'support@example.test',
		careersEmail: 'jobs@example.test',
		phone: { href: '+1', display: '+1' }
	},
	address: { street: 'Street', postalCode: '1', locality: 'City', region: 'R', country: 'IT' },
	services: ['Test'],
	areaServed: 'Italy'
};
/** @type {import('../types.d.ts').SitePage[]} */
const pages = [
	{ path: '/', file: 'index.html', title: 'title', description: 'description' },
	{ path: '/404', file: '404.html', title: 'title', description: 'description', robots: 'noindex' }
];

/** @param {import('node:test').TestContext} t @returns {Promise<import('../types.d.ts').BuildInputs & {site:typeof site}>} */
async function fixture(t) {
	const root = await mkdtemp(join(tmpdir(), 'vanilla-site-test-'));
	t.after(() => rm(root, { recursive: true, force: true }));
	for (const dir of ['assets/css', 'assets/js', 'vendor', 'static', 'partials', 'pages'])
		await mkdir(join(root, dir), { recursive: true });
	for (const [name, contents] of Object.entries({
		'vendor/manifest.json': '{}',
		'static/logo.svg': '<svg></svg>',
		'static/.well-known/security.txt': 'Contact: mailto:test@example.test',
		'partials/shell.html':
			'<!doctype html><html lang="en"><head>{{@head}}</head><body>{{@body}}</body></html>',
		'partials/heading.html': '<h1 id="main">{{title}}</h1>',
		'pages/index.html':
			'{{>heading}}<a href="#main">Main</a><img src="/logo.svg" srcset="/logo.svg 1x, /logo.svg 2x" alt="">',
		'pages/404.html': '{{>heading}}',
		'assets/js/shell.mjs': "import './helper.mjs';\nnew URL('./worker.js',import.meta.url);",
		'assets/js/helper.mjs': "export const label = 'v1';",
		'assets/js/worker.js': 'self.close();',
		'assets/css/site.css': "@import './parts/base.css';\nbody { color: cyan; }",
		'assets/css/parts/base.css': "main { background: url('/logo.svg'); }"
	}))
		await write(join(root, name), contents);
	return {
		root,
		output: join(root, 'build'),
		site,
		pages,
		copy: { title: 'A <void> & B', description: 'Description' }
	};
}

test('preserves native imports, resolves media references and emits a complete reproducible site', async (t) => {
	const input = await fixture(t);
	await buildSite(input);
	const home = await readFile(join(input.output, 'index.html'), 'utf8');
	const base = home.match(/(\/assets\/build\/[\da-f]{16})\/js\/shell.mjs/)?.[1];
	assert.ok(base);
	const media = '/assets/media/logo.' + digest('<svg></svg>').slice(0, 16) + '.svg';
	assert.ok(home.includes('A &lt;void&gt; &amp; B'));
	assert.ok(home.includes(`srcset="${media} 1x, ${media} 2x"`));
	assert.ok(home.includes('property="og:image" content="https://example.test/logo.svg"'));
	assert.ok(home.includes('"logo":"https://example.test/logo.svg"'));
	assert.equal(
		await readFile(join(input.output, base, 'js/shell.mjs'), 'utf8'),
		await readFile(join(input.root, 'assets/js/shell.mjs'), 'utf8')
	);
	const css = await readFile(join(input.output, base, 'css/site.css'), 'utf8');
	assert.ok(css.includes(media));
	assert.ok(!css.includes('@import'));
	assert.equal(
		await readFile(join(input.output, media), 'utf8'),
		await readFile(join(input.output, 'logo.svg'), 'utf8')
	);
	assert.equal((await readFile(join(input.output, 'sitemap.xml'), 'utf8')).includes('/404'), false);
	assert.equal(gunzipSync(await readFile(join(input.output, 'index.html.gz'))).toString(), home);
	const br = await readFile(join(input.output, 'index.html.br'));
	assert.equal(brotliDecompressSync(br).toString(), home);
	await buildSite(input);
	assert.deepEqual(await readFile(join(input.output, 'index.html.br')), br);
	await write(join(input.root, 'assets/js/helper.mjs'), "export const label = 'v2';");
	await buildSite(input);
	const next = await readFile(join(input.output, 'index.html'), 'utf8');
	assert.ok(!next.includes(base + '/'));
	assert.ok(next.includes(media));
});

test('a failed full rebuild preserves the last good generation', async (t) => {
	const input = await fixture(t);
	await buildSite(input);
	const previous = await readlink(input.output);
	for (const [source, error] of [
		['<h1 id="x">One</h1><div id="x"></div>', /Duplicate id/],
		['<h1>One</h1><a href="#missing">bad</a>', /Missing fragment/],
		['<h1>One</h1><img src="/missing.svg">', /Broken link/],
		['<h1>One</h1><script>alert(1)</script>', /Executable inline/],
		['<h1>One</h1><span style="color: red"></span>', /Inline handler or style/],
		['<h1>{{unknown}}</h1>', /Missing content/]
	]) {
		await write(join(input.root, 'pages/index.html'), String(source));
		await assert.rejects(buildSite(input), /** @type {RegExp} */ (error));
		assert.equal(await readlink(input.output), previous);
	}
});

test('refuses corrupt vendors, broken import chains and missing metadata', async (t) => {
	const input = await fixture(t);
	await write(join(input.root, 'vendor/lib.js'), 'export {};');
	await write(join(input.root, 'vendor/manifest.json'), JSON.stringify({ 'lib.js': 'incorrect' }));
	await assert.rejects(buildSite(input), /Vendor checksum mismatch/);
	await write(join(input.root, 'vendor/manifest.json'), '{}');
	await write(join(input.root, 'assets/css/parts/base.css'), "@import '../site.css';");
	await assert.rejects(buildSite(input), /CSS import cycle/);
	await write(join(input.root, 'assets/css/parts/base.css'), 'body {}');
	await assert.rejects(
		buildSite({ ...input, copy: { title: 'Title', description: '' } }),
		/Expected text/
	);
});

test('validates routes, includes, source boundaries and JSON-LD data', () => {
	assert.throws(() => validateRoutes([...pages, pages[0]], []), /duplicate route/);
	assert.throws(() => validateRoutes(pages, ['unexpected.html']), /Unlisted page/);
	assert.throws(() => within('/site/pages', '../secret'), /outside input/);
	assert.throws(
		() => render('{{>loop}}', {}, new Map([['loop', '{{>loop}}']]), {}),
		/Recursive partial/
	);
	assert.throws(() => render('{{>missing}}', {}, new Map(), {}), /Missing partial/);
	const value = '</script><!--\u2028\u2029';
	const block = jsonLd(value);
	assert.equal((block.match(/<\/script>/g) ?? []).length, 1);
	assert.equal(JSON.parse(block.slice(block.indexOf('>') + 1, block.lastIndexOf('<'))), value);
	assert.equal(organization(site)['@id'], 'https://example.test/#organization');
	assert.equal(publisher(site).name, site.legalName);
});
