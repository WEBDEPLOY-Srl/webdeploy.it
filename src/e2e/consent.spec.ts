import { expect, test } from './fixtures';

const KEY = 'wd_consent_marketing';
const banner = (page: import('@playwright/test').Page) =>
	page.getByRole('complementary', { name: 'Privacy & cookies' });

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

test('the footer control reopens the banner and a refusal withdraws an earlier acceptance', async ({
	page,
	traffic
}) => {
	// Seeds the first visit only, so the refusal below is not overwritten on the next page load.
	await page.addInitScript((key) => {
		if (localStorage.getItem(key) === null) localStorage.setItem(key, 'granted');
	}, KEY);
	await page.goto('/contacts');
	await page.waitForLoadState('networkidle');
	await expect(banner(page)).toHaveCount(0);
	expect(traffic.meta.length).toBeGreaterThan(0);

	const control = page.getByRole('contentinfo').getByRole('button', { name: 'Cookie settings' });
	await control.click();
	await expect(banner(page)).toBeVisible();
	await expect(banner(page)).toBeFocused();

	// Closing without a choice keeps the stored decision and returns focus to the control.
	await banner(page).getByRole('button', { name: 'Close' }).click();
	await expect(banner(page)).toBeHidden();
	await expect(control).toBeFocused();
	expect(await page.evaluate((key) => localStorage.getItem(key), KEY)).toBe('granted');

	// Escape closes it too.
	await control.click();
	await expect(banner(page)).toBeVisible();
	await page.keyboard.press('Escape');
	await expect(banner(page)).toBeHidden();

	await control.click();
	await banner(page)
		.getByRole('button', { name: /reject/i })
		.click();
	await expect(banner(page)).toBeHidden();
	expect(await page.evaluate((key) => localStorage.getItem(key), KEY)).toBe('denied');
	expect(
		await page.evaluate(() => document.cookie.split('; ').filter((c) => /^_fb[pc]=/.test(c)))
	).toEqual([]);

	// The refusal holds on the next visit: nothing more goes to Meta.
	const before = traffic.meta.length;
	await page.goto('/');
	await page.waitForLoadState('networkidle');
	expect(traffic.meta.length).toBe(before);
});

test('accepting from the footer control after a refusal loads the pixel', async ({
	page,
	traffic
}) => {
	await page.addInitScript((key) => localStorage.setItem(key, 'denied'), KEY);
	await page.goto('/');
	await page.waitForLoadState('networkidle');
	expect(traffic.meta).toEqual([]);

	const pixel = page.waitForRequest(/connect\.facebook\.net\/en_US\/fbevents\.js/);
	await page.getByRole('contentinfo').getByRole('button', { name: 'Cookie settings' }).click();
	await banner(page)
		.getByRole('button', { name: /accept/i })
		.click();
	await pixel;
	expect(await page.evaluate((key) => localStorage.getItem(key), KEY)).toBe('granted');
});

test('the privacy page says where to change the choice and discloses the map tiles', async ({
	page,
	traffic
}) => {
	void traffic;
	await page.goto('/privacy');
	await expect(page.getByText('"Cookie settings" link in the footer')).toBeVisible();
	await expect(page.getByText('tile.openstreetmap.org')).toBeVisible();
});
