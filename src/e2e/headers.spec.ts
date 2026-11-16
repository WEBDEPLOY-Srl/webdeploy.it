import { expect, test } from './fixtures';

// Response headers come from nginx, so these need the container:
//   E2E_BASE_URL=http://127.0.0.1:18080 npx playwright test headers
test.skip(!process.env.E2E_BASE_URL, 'needs the nginx container (E2E_BASE_URL)');

const SINGLE = [
	'content-security-policy',
	'cache-control',
	'x-frame-options',
	'x-content-type-options',
	'referrer-policy',
	'permissions-policy',
	'cross-origin-opener-policy'
];

async function headersOf(request: import('@playwright/test').APIRequestContext, path: string) {
	const response = await request.get(path, { maxRedirects: 0, failOnStatusCode: false });
	const list = response.headersArray();
	const values = (name: string) =>
		list.filter((h) => h.name.toLowerCase() === name).map((h) => h.value);
	return { response, values };
}

async function assetPaths(request: import('@playwright/test').APIRequestContext) {
	const html = await (await request.get('/')).text();
	const script = /\/_app\/immutable\/entry\/start\.[^"']+\.js/.exec(html)?.[0];
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
	for (const [path, status] of [
		['/early-access', 302],
		['/services', 301],
		['/uploads/nis2-cra-gap-analysis.pdf', 410],
		['/nope', 404]
	] as const) {
		const { response, values } = await headersOf(request, path);
		expect(response.status(), path).toBe(status);
		for (const name of SINGLE) expect(values(name), `${name} on ${path}`).toHaveLength(1);
	}
});

test('cache rules: immutable only for hashed build output, none for pages', async ({ request }) => {
	const { script } = await assetPaths(request);
	const cache = async (path: string) => (await headersOf(request, path)).values('cache-control')[0];
	expect(await cache(script)).toBe('public, max-age=31536000, immutable');
	expect(await cache('/')).toBe('no-cache');
	expect(await cache('/contacts')).toBe('no-cache');
	expect(await cache('/nope')).toBe('no-cache');
	expect(await cache('/favicon.png')).toBe('public, max-age=3600');
	expect(await cache('/news-php2shell.webp')).toBe('public, max-age=3600');
	expect(await cache('/fonts/space-mono-400-latin.woff2')).toBe('public, max-age=3600');
	expect(await cache('/early-access')).toBe('no-store');
});

test('the header policy is the page policy plus frame-ancestors, and the hash matches', async ({
	request
}) => {
	for (const path of ['/', '/contacts', '/privacy', '/nope']) {
		const { values } = await headersOf(request, path);
		const html = await (await request.get(path, { failOnStatusCode: false })).text();
		const meta = /http-equiv="content-security-policy"\s+content="([^"]*)"/.exec(html)?.[1];
		expect(meta, `meta policy on ${path}`).toBeTruthy();
		expect(values('content-security-policy')[0], path).toBe(`${meta}; frame-ancestors 'self'`);
	}
});

test('pages and scripts are served precompressed', async ({ request }) => {
	const { script } = await assetPaths(request);
	for (const path of ['/', script]) {
		const response = await request.get(path, { headers: { 'accept-encoding': 'gzip' } });
		expect(response.headers()['content-encoding'], path).toBe('gzip');
	}
});
