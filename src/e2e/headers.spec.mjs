// @ts-check
// SPDX-FileCopyrightText: 2026 WEBDEPLOY S.R.L.
// SPDX-License-Identifier: AGPL-3.0-only
import { expect, test } from './fixtures.mjs';
// Response headers come from nginx, so these need the container:
//   E2E_BASE_URL=http://127.0.0.1:18080 npx playwright test headers
const SINGLE = [
	'content-security-policy',
	'cache-control',
	'x-frame-options',
	'x-content-type-options',
	'referrer-policy',
	'permissions-policy',
	'cross-origin-opener-policy'
];
/** @param {import("@playwright/test").APIRequestContext} request @param {string} path */
async function headersOf(request, path) {
	const response = await request.get(path, { maxRedirects: 0, failOnStatusCode: false });
	const list = response.headersArray();
	/** @param {string} name */
	const values = (name) => list.filter((h) => h.name.toLowerCase() === name).map((h) => h.value);
	return { response, values };
}
/** @param {import("@playwright/test").APIRequestContext} request */
async function assetPaths(request) {
	const html = await (await request.get('/')).text();
	const script = /\/assets\/build\/[a-f0-9]{16}\/js\/shell\.mjs/.exec(html)?.[0];
	if (!script) throw new Error('no hashed entry script on the homepage');
	return { script };
}
test('every response carries each security header exactly once', async ({ request }) => {
	const { script } = await assetPaths(request);
	const paths = ['/', '/contacts', script, '/favicon.png', '/news-php2shell.webp', '/nope'];
	for (const path of paths) {
		const { values } = await headersOf(request, path);
		for (const name of SINGLE) expect(values(name), `${name} on ${path}`).toHaveLength(1);
		expect(values('server')[0], `server on ${path}`).toBe('nginx');
	}
});
test('headers survive redirects, gone and error responses', async ({ request }) => {
	for (const [path, status] of /** @type {const} */ ([
		['/early-access', 302],
		['/services', 301],
		['/uploads/nis2-cra-gap-analysis.pdf', 410],
		['/nope', 404]
	])) {
		const { response, values } = await headersOf(request, path);
		expect(response.status(), path).toBe(status);
		for (const name of SINGLE) expect(values(name), `${name} on ${path}`).toHaveLength(1);
	}
	const tracked = await request.get(
		'/early-access?utm_source=instagram&utm_campaign=newsletter-2026',
		{
			maxRedirects: 0,
			failOnStatusCode: false
		}
	);
	expect(tracked.status()).toBe(302);
	expect(tracked.headers()['location']).toBe(
		'/newsletter?utm_source=instagram&utm_campaign=newsletter-2026'
	);
});
test('cache rules: immutable only for hashed build output, none for pages', async ({ request }) => {
	const { script } = await assetPaths(request);
	/** @param {string} path */
	const cache = async (path) => (await headersOf(request, path)).values('cache-control')[0];
	expect(await cache(script)).toBe('public, max-age=31536000, immutable');
	expect(await cache('/')).toBe('no-cache');
	expect(await cache('/contacts')).toBe('no-cache');
	expect(await cache('/nope')).toBe('no-cache');
	expect(await cache('/favicon.png')).toBe('public, max-age=3600');
	expect(await cache('/news-php2shell.webp')).toBe('public, max-age=3600');
	expect(await cache('/fonts/space-mono-400-latin.woff2')).toBe('public, max-age=3600');
	expect(await cache('/early-access')).toBe('no-store');
});
test('the static policy applies identically to pages and missing paths', async ({ request }) => {
	const home = (await headersOf(request, '/')).values('content-security-policy')[0];
	expect(home).toContain("frame-ancestors 'self'");
	expect(home).not.toMatch(/sha256-|unsafe-eval/);
	for (const path of [
		'/',
		'/contacts',
		'/privacy',
		'/newsletter',
		'/newsletter/confirmed',
		'/nope'
	]) {
		const { response, values } = await headersOf(request, path);
		expect(values('content-security-policy'), path).toEqual([home]);
		expect(await response.text()).not.toMatch(/<meta[^>]+http-equiv=["']content-security-policy/i);
	}
});
test('pages and scripts are served precompressed', async ({ request }) => {
	const { script } = await assetPaths(request);
	for (const path of ['/', script]) {
		const response = await request.get(path, { headers: { 'accept-encoding': 'gzip' } });
		expect(response.headers()['content-encoding'], path).toBe('gzip');
	}
});

test('all retired paths preserve their HTTP contracts', async ({ request }) => {
	for (const path of [
		'/early-access',
		'/early-access/',
		'/early-access/confermato',
		'/early-access/confermato/'
	]) {
		const { response, values } = await headersOf(request, path + '?a=one%20two&a=three');
		expect(response.status()).toBe(302);
		expect(values('location')).toEqual(['/newsletter?a=one%20two&a=three']);
		expect(values('cache-control')).toEqual(['no-store']);
	}
	for (const path of ['/services', '/services/']) {
		const { response, values } = await headersOf(request, path);
		expect(response.status()).toBe(301);
		expect(values('location')).toEqual(['/#services']);
	}
});
test('hashed subresources are immutable and pages revalidate by ETag', async ({ request }) => {
	const { response } = await headersOf(request, '/');
	const html = await response.text();
	const asset = /\/assets\/(?:media|build)\/[^"\s<>]+/g;
	const urls = [...new Set(html.match(asset))];
	for (const extension of ['.css', '.mjs', '.woff2', '.png', '.webp']) {
		const path = urls.find((url) => url.endsWith(extension));
		if (!path) throw new Error('Missing hashed reference: ' + extension);
		const result = await headersOf(request, path);
		expect(result.response.status()).toBe(200);
		expect(result.values('cache-control')).toEqual(['public, max-age=31536000, immutable']);
		if (extension === '.mjs') expect(result.values('content-type')[0]).toMatch(/javascript/);
	}
	const tag = response.headers().etag;
	expect(tag).toBeTruthy();
	const unchanged = await request.get('/', { headers: { 'if-none-match': tag } });
	expect(unchanged.status()).toBe(304);
	expect(unchanged.headers()['cache-control']).toBe('no-cache');
	const marker = await headersOf(request, '/_app/version.json');
	expect(marker.values('cache-control')).toEqual(['no-cache']);
	expect((await marker.response.json()).version).toMatch(/^2-/);
});
