// @ts-check
// SPDX-FileCopyrightText: 2026 WEBDEPLOY S.R.L.
// SPDX-License-Identifier: AGPL-3.0-only
import { expect, test } from './fixtures.mjs';
import { sitemapPaths } from './routes.mjs';
// A returning visitor who already answered the banner, so it does not cover the page.
test.beforeEach(async ({ page }) => {
	await page.addInitScript(() => localStorage.setItem('wd_consent_marketing', 'denied'));
});
// The fixture fails any test that reports a violation; these tests make that coverage explicit.
for (const path of [...sitemapPaths(), '/newsletter/confirmed', '/__missing__/csp']) {
	test(`${path} carries the static policy and breaks none of it`, async ({
		page,
		traffic,
		cspViolations
	}) => {
		void traffic;
		const response = await page.goto(path);
		await page.waitForLoadState('networkidle');
		const policy = await response?.headerValue('content-security-policy');
		expect(policy).toContain(
			"script-src 'self' https://analytics.inwd.org https://connect.facebook.net"
		);
		expect(policy).not.toMatch(/sha256-|unsafe-eval/);
		expect(cspViolations).toEqual([]);
	});
}
test('the contacts map loads its tiles from the allowed tile host', async ({
	page,
	traffic,
	cspViolations
}) => {
	await page.goto('/contacts');
	await page.locator('.contacts-map').scrollIntoViewIfNeeded();
	await expect(page.locator('.leaflet-tile-loaded').first()).toBeVisible();
	expect(traffic.all.some((url) => url.startsWith('https://tile.openstreetmap.org/'))).toBe(true);
	expect(cspViolations).toEqual([]);
});
test('newsletter challenge and hosted form have only the required CSP destinations', async ({
	page,
	cspViolations
}) => {
	const response = await page.goto('/newsletter');
	const policy = await response?.headerValue('content-security-policy');
	const directives = Object.fromEntries(
		(policy ?? '').split('; ').map((directive) => {
			const [name, ...values] = directive.split(' ');
			return [name, values];
		})
	);
	expect(directives['connect-src']).toEqual([
		"'self'",
		'https://analytics.inwd.org',
		'https://newsletter.webdeploy.it',
		'https://www.facebook.com',
		'https://connect.facebook.net'
	]);
	expect(directives['form-action']).toEqual(["'self'", 'https://newsletter.webdeploy.it']);
	expect(directives).not.toHaveProperty('worker-src');
	expect(policy).not.toMatch(/blob:|wasm-unsafe-eval|unsafe-eval/);
	expect(cspViolations).toEqual([]);
});
test('Matomo and, after consent, the Meta pixel run inside the policy', async ({
	page,
	traffic,
	cspViolations
}) => {
	await page.addInitScript(() => localStorage.removeItem('wd_consent_marketing'));
	await page.goto('/');
	const pixel = page.waitForRequest(/connect\.facebook\.net\/en_US\/fbevents\.js/);
	await page
		.getByRole('complementary', { name: 'Privacy & cookies' })
		.getByRole('button', { name: /accept/i })
		.click();
	await pixel;
	await page.waitForLoadState('networkidle');
	expect(traffic.all.some((url) => url.startsWith('https://analytics.inwd.org/matomo.js'))).toBe(
		true
	);
	expect(cspViolations).toEqual([]);
});
test('the policy blocks an injected inline script and an unlisted host', async ({
	page,
	traffic,
	cspViolations
}) => {
	void traffic;
	await page.goto('/');
	await page.evaluate(() => {
		const script = document.createElement('script');
		script.textContent = 'window.injected = true';
		document.head.appendChild(script);
		const image = document.createElement('img');
		image.src = 'https://example.org/pixel.png';
		document.body.appendChild(image);
	});
	await expect.poll(() => cspViolations.length).toBeGreaterThanOrEqual(2);
	expect(await page.evaluate(() => 'injected' in window)).toBe(false);
	expect(cspViolations.join('\n')).toMatch(/script-src/);
	expect(cspViolations.join('\n')).toMatch(/img-src/);
	// Provoked on purpose, so the fixture must not fail the test for them.
	cspViolations.length = 0;
});
