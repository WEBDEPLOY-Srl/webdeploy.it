import { expect, test } from './fixtures';
import { sitemapPaths } from './routes';

// A returning visitor who already answered the banner, so it does not cover the page.
test.beforeEach(async ({ page }) => {
	await page.addInitScript(() => localStorage.setItem('wd_consent_marketing', 'denied'));
});

// The fixture fails any test that reports a violation; these tests make that coverage explicit.
for (const path of sitemapPaths()) {
	test(`${path} carries a hashed policy and breaks none of it`, async ({
		page,
		traffic,
		cspViolations
	}) => {
		void traffic;
		await page.goto(path);
		await page.waitForLoadState('networkidle');
		await expect(page.locator('meta[http-equiv="content-security-policy"]')).toHaveAttribute(
			'content',
			/script-src[^;]*'sha256-[^']+'/
		);
		expect(cspViolations).toEqual([]);
	});
}

test('the contacts map loads its tiles from the allowed tile host', async ({
	page,
	traffic,
	cspViolations
}) => {
	await page.goto('/contacts');
	await expect(page.locator('.leaflet-tile-loaded').first()).toBeVisible();
	expect(traffic.all.some((url) => url.startsWith('https://tile.openstreetmap.org/'))).toBe(true);
	expect(cspViolations).toEqual([]);
});

test('newsletter challenge and hosted form have only the required CSP destinations', async ({
	page,
	cspViolations
}) => {
	await page.goto('/newsletter');
	await page.waitForLoadState('networkidle');
	const policy = await page
		.locator('meta[http-equiv="content-security-policy"]')
		.getAttribute('content');
	expect(policy).toContain('connect-src');
	expect(policy).toContain('https://newsletter.webdeploy.it');
	expect(policy).toContain('form-action');
	expect(policy).toMatch(/form-action[^;]*https:\/\/newsletter\.webdeploy\.it/);
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
