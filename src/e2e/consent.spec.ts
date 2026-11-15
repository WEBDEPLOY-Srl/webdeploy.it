import { expect, test } from './fixtures';

const KEY = 'wd_consent_marketing';
const banner = (page: import('@playwright/test').Page) => page.getByRole('dialog');

test('no Meta request is made before consent, and one is made after accepting', async ({
	page,
	traffic
}) => {
	await page.goto('/');
	await expect(banner(page)).toBeVisible();
	await page.waitForLoadState('networkidle');
	// Matomo is cookieless and always on; Meta must wait for the visitor.
	expect(traffic.all.some((url) => url.startsWith('https://analytics.inwd.org/'))).toBe(true);
	expect(traffic.meta).toEqual([]);

	// Navigating while undecided still sends nothing to Meta.
	await page.goto('/privacy');
	await page.waitForLoadState('networkidle');
	expect(traffic.meta).toEqual([]);

	const pixel = page.waitForRequest(/connect\.facebook\.net\/en_US\/fbevents\.js/);
	await page.goto('/');
	await banner(page)
		.getByRole('button', { name: /accept/i })
		.click();
	await pixel;
	await expect(banner(page)).toBeHidden();
	expect(await page.evaluate((key) => localStorage.getItem(key), KEY)).toBe('granted');
});

test('refusing survives a reload and keeps Meta silent', async ({ page, traffic }) => {
	await page.goto('/');
	await banner(page)
		.getByRole('button', { name: /reject/i })
		.click();
	await expect(banner(page)).toBeHidden();
	expect(await page.evaluate((key) => localStorage.getItem(key), KEY)).toBe('denied');

	await page.reload();
	await page.waitForLoadState('networkidle');
	await expect(banner(page)).toHaveCount(0);
	await page.goto('/contacts');
	await page.waitForLoadState('networkidle');
	await expect(banner(page)).toHaveCount(0);
	expect(traffic.meta).toEqual([]);
});

test('an earlier acceptance loads the pixel on the next visit', async ({ page, traffic }) => {
	await page.addInitScript((key) => localStorage.setItem(key, 'granted'), KEY);
	const pixel = page.waitForRequest(/connect\.facebook\.net\/en_US\/fbevents\.js/);
	await page.goto('/');
	await pixel;
	await expect(banner(page)).toHaveCount(0);
	expect(traffic.meta.length).toBeGreaterThan(0);
});
