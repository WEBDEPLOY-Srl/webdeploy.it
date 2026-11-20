// @ts-check
// SPDX-FileCopyrightText: 2026 WEBDEPLOY S.R.L.
// SPDX-License-Identifier: AGPL-3.0-only
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mkdtemp, mkdir, readFile, readlink, rm, stat } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { gunzipSync } from 'node:zlib';
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
	{ path: '/', file: 'index.html', title: 'title', description: 'description', modules: ['shell'] },
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
		'assets/css/parts/base.css': "main { background: url('../../../static/logo.svg'); }"
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
	const gzip = await readFile(join(input.output, 'index.html.gz'));
	assert.equal((await stat(input.output)).mode & 0o777, 0o755);
	await assert.rejects(stat(join(input.output, 'index.html.br')), { code: 'ENOENT' });
	await buildSite(input);
	assert.deepEqual(await readFile(join(input.output, 'index.html.gz')), gzip);
	await write(join(input.root, 'assets/js/helper.mjs'), "export const label = 'v2';");
	await buildSite(input);
	const next = await readFile(join(input.output, 'index.html'), 'utf8');
	assert.ok(!next.includes(base + '/'));
	assert.ok(next.includes(media));
});

test('preloads transitive static imports once and validates multiline and lazy references', async (t) => {
	const input = await fixture(t);
	const js = (/** @type {string} */ name) => join(input.root, 'assets/js', name);
	await write(js('shell.mjs'), "import {\n value\n} from './shared.mjs';\nimport './helper.mjs';\nimport('./lazy.mjs');\nnew URL('./worker.js', import.meta.url);");
	await write(js('helper.mjs'), "export {\n value\n} from './shared.mjs';");
	await write(js('shared.mjs'), "import './deep.mjs';\nexport const value = 1;");
	await write(js('deep.mjs'), "import './helper.mjs';");
	await write(js('lazy.mjs'), "export default 1;");
	input.pages = [{ ...pages[0], modules: ['helper'] }, pages[1]];
	await buildSite(input);
	const home = await readFile(join(input.output, 'index.html'), 'utf8');
	const preloaded = [...home.matchAll(/rel="modulepreload" href="[^"]+\/js\/([^"]+)"/g)].map((m) => m[1]);
	assert.deepEqual(preloaded, ['shared.mjs', 'deep.mjs']);
	for (const statement of [
		"import {\n missing\n} from './missing.mjs';", "export {\n missing\n} from './missing.mjs';",
		"import('./missing.mjs');", "new URL('./missing.mjs', import.meta.url);"
	]) {
		await write(js('shell.mjs'), statement);
		await assert.rejects(buildSite(input), /Missing asset from js\/shell.mjs: \.\/missing.mjs/);
	}
});

test('collects repeated partial notices without discarding third-party attributions', async (t) => {
	const input = await fixture(t);
	const ownerField = 'SPDX-' + 'FileCopyrightText';
	const licenseField = 'SPDX-' + 'License-Identifier';
	const notice = `<!-- ${ownerField}: Example -->\n<!-- ${licenseField}: CC0-1.0 -->\n`;
	await write(join(input.root, 'pages/index.html'), notice + '<h1>Home</h1>{{>mark}}{{>mark}}');
	await write(join(input.root, 'partials/mark.html'), notice.replace('Example -->', 'Artist -->') + '<span>Mark</span>');
	await buildSite(input);
	const html = await readFile(join(input.output, 'index.html'), 'utf8');
	assert.equal(html.split(ownerField + ': Artist').length - 1, 1);
	assert.equal((html.match(/<!--/g) ?? []).length, 1);
	assert.ok(html.includes(ownerField + ': Example'));
	assert.ok(html.includes(licenseField + ': CC0-1.0'));
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

test('a page requests one stylesheet with shared and page styles in authored order', async (t) => {
	const input = await fixture(t);
	await write(join(input.root, 'assets/css/demo.css'), '.demo { color: tomato; }');
	input.pages = [{ ...pages[0], styles: ['demo'] }, pages[1]];
	await buildSite(input);
	const html = await readFile(join(input.output, 'index.html'), 'utf8');
	const links = [...html.matchAll(/<link rel="stylesheet" href="([^"]+)">/g)];
	assert.equal(links.length, 1);
	const sheet = await readFile(join(input.output, links[0][1]), 'utf8');
	assert.ok(sheet.indexOf('color: cyan') >= 0);
	assert.ok(sheet.indexOf('color: cyan') < sheet.indexOf('color: tomato'));
	await assert.rejects(buildSite({ ...input, pages: [{ ...pages[0], styles: ['missing'] }, pages[1]] }), /Missing page stylesheet/);
});

test('responsive image preloads omit the fixed URL and single-image preloads retain it', async (t) => {
	const input = await fixture(t);
	await write(join(input.root,'partials/shell.html'),
		'<!doctype html><html lang="en"><head>{{@imagePreload}}{{@head}}</head><body>{{@body}}</body></html>');
	const href = '/logo.svg';
	const type = 'image/svg+xml';
	input.pages = [
		{...pages[0],priorityImage:{href,type,srcset:'/logo.svg 320w, /logo.svg 640w',sizes:'100vw'}},
		{...pages[1],priorityImage:{href,type}}
	];
	await buildSite(input);
	const home = await readFile(join(input.output,'index.html'),'utf8');
	const error = await readFile(join(input.output,'404.html'),'utf8');
	const responsive = home.match(/<link rel="preload" as="image"[^>]*>/)?.[0];
	const fixed = error.match(/<link rel="preload" as="image"[^>]*>/)?.[0];
	assert.ok(responsive && fixed);
	assert.doesNotMatch(responsive,/\shref=/);
	assert.match(responsive,/imagesrcset="\/assets\/media\/logo\.[a-f0-9]{16}\.svg 320w, [^"]+ 640w"/);
	assert.match(responsive,/imagesizes="100vw"/);
	assert.match(fixed,/href="\/assets\/media\/logo\.[a-f0-9]{16}\.svg"/);
	assert.doesNotMatch(fixed,/imagesrcset=/);
});

test('tool marks keep the original viewBox and use a hashed lazy image', async (t) => {
	const input = await fixture(t);
	await write(join(input.root, 'partials/marks/tool.html'), '<path d="M0 0h4v4z"/>');
	await write(join(input.root, 'pages/index.html'), '<h1>Home</h1><svg viewBox="5 2 8 3">{{>marks/tool}}</svg>');
	await buildSite(input);
	const home = await readFile(join(input.output, 'index.html'), 'utf8');
	const image = /<img class="tool-mark" src="([^"]+)" alt="" width="8" height="3" loading="lazy"/.exec(home);
	assert.ok(image);
	assert.match(image[1], /tool\.[a-f0-9]{16}\.svg$/);
	const svg = await readFile(join(input.output, image[1]), 'utf8');
	assert.ok(svg.includes('viewBox="5 2 8 3"') && svg.includes('<path d="M0 0h4v4z"/>'));
});

test('the homepage embeds its real portrait and emits a complete script-free stylesheet', async (t) => {
	const input = await fixture(t);
	await write(join(input.root,'static/portrait.avif'),'fixture-image');
	await write(join(input.root,'assets/css/first.css'),'h1 { color: cyan; }');
	await write(join(input.root,'assets/js/home-start.mjs'),'export {};');
	await write(join(input.root,'pages/index.html'),'<h1>Home</h1><picture><source type="image/avif" srcset="{{@portraitImage}}"><img src="/logo.svg" alt=""></picture>');
	input.pages = [{...pages[0],entry:'home-start',modules:[],firstStylesheet:'first',embeddedPortrait:'/portrait.avif'},pages[1]];
	await buildSite(input);
	const html = await readFile(join(input.output,'index.html'),'utf8');
	assert.match(html,/rel="stylesheet" href="[^"]+\/css\/first\.css"/);
	assert.match(html,/<template id="home-page-styles"><link rel="stylesheet" href="([^"]+)"><\/template>\s*<noscript><link rel="stylesheet" href="\1"><\/noscript>/);
	assert.ok(html.includes('data:image/avif;base64,' + Buffer.from('fixture-image').toString('base64')));
	assert.match(html,/type="module" src="[^"]+\/home-start\.mjs"/);
});
