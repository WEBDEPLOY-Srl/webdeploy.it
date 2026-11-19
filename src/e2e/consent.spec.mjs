// @ts-check
// SPDX-FileCopyrightText: 2026 WEBDEPLOY S.R.L.
// SPDX-License-Identifier: AGPL-3.0-only
import assert from 'node:assert/strict';
import { expect, test } from './fixtures.mjs';
const KEY = 'wd_consent_marketing';
/** @param {import("@playwright/test").Page} page */
const banner = (page) => page.getByRole('complementary', { name: 'Privacy & cookies' });
test('no Meta request is made before consent, and one is made after accepting', async ({
	page,
	traffic
}) => {
	await page.goto('/');
	await expect(banner(page)).toBeVisible();
	await expect(banner(page)).not.toHaveAttribute('aria-hidden');
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
	// Closing settings without a new choice restores focus and keeps the stored decision.
	await banner(page).getByRole('button', { name: 'Close' }).click();
	await expect(banner(page)).toBeHidden();
	await expect(control).toBeFocused();
	expect(await page.evaluate((key) => localStorage.getItem(key), KEY)).toBe('granted');
	await expect(page.locator('.consent-reservation')).toHaveCount(0);
	await control.click();
	await expect(banner(page)).toBeVisible();
	await page.keyboard.press('Escape');
	await expect(banner(page)).toBeHidden();
	expect(await page.evaluate((key) => localStorage.getItem(key), KEY)).toBe('granted');
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
test('banner decisions use identical controls and the privacy link survives larger text', async ({
	page
}) => {
	await page.setViewportSize({ width: 360, height: 640 });
	await page.goto('/');
	const reject = banner(page).getByRole('button', { name: 'Reject' });
	const accept = banner(page).getByRole('button', { name: 'Accept' });
	/** @param {import("@playwright/test").Locator} button */
	const getStyle = (button) =>
		button.evaluate((element) => {
			const style = getComputedStyle(element);
			const box = element.getBoundingClientRect();
			return {
				width: box.width,
				height: box.height,
				fontFamily: style.fontFamily,
				fontSize: style.fontSize,
				fontWeight: style.fontWeight,
				color: style.color,
				backgroundColor: style.backgroundColor,
				borderColor: style.borderColor
			};
		});
	expect(await getStyle(reject)).toEqual(await getStyle(accept));
	await page.evaluate(() => (document.documentElement.style.zoom = '200%'));
	const bannerBox = await banner(page).boundingBox();
	const privacyBox = await banner(page).getByRole('link', { name: 'privacy notice' }).boundingBox();
	assert.ok(bannerBox);
	assert.ok(privacyBox);
	expect(privacyBox.x).toBeGreaterThanOrEqual(bannerBox.x);
	expect(privacyBox.y).toBeGreaterThanOrEqual(bannerBox.y);
	expect(privacyBox.x + privacyBox.width).toBeLessThanOrEqual(bannerBox.x + bannerBox.width);
	expect(privacyBox.y + privacyBox.height).toBeLessThanOrEqual(bannerBox.y + bannerBox.height);
});
test.describe('short landscape touch screens', () => {
	test.use({ viewport: { width: 640, height: 480 }, hasTouch: true });
	test('phone field focus hides consent', async ({ page }) => {
		await page.goto('/newsletter');
		await expect(banner(page)).toBeVisible();
		expect(await page.evaluate(() => matchMedia('(pointer: coarse)').matches)).toBe(true);
		await page.getByLabel('Email address').focus();
		await expect(banner(page)).toBeHidden();
	});
});
test('the privacy page says where to change the choice and discloses the map tiles', async ({
	page,
	traffic
}) => {
	void traffic;
	await page.goto('/privacy');
	await expect(page.getByText('using Cookie settings in the footer').first()).toBeVisible();
	await expect(page.getByText('tile.openstreetmap.org')).toBeVisible();
});

for (const width of [390, 1280]) {
	test('pending consent leaves keyboard focus visible at ' + width + 'px', async ({ page }) => {
		await page.setViewportSize({ width, height: 844 });
		await page.goto('/services/backup');
		const panel = banner(page);
		const size = await panel.boundingBox();
		assert.ok(size);
		await expect(page.locator('html')).toHaveCSS('scroll-padding-bottom', Math.ceil(size.height) + 'px');
		const targets = ['.contact-band__action', '.site-footer__link[href="/security"]', '.site-footer__settings'];
		await page.locator('main').focus();
		for (const selector of targets) {
			const target = page.locator(selector);
			for (let tab = 0; tab < 25; tab++) {
				await page.keyboard.press('Tab');
				if (await target.evaluate((node) => node === document.activeElement)) break;
			}
			await expect(target).toBeFocused();
			await expect.poll(async () => {
				const rect = await target.boundingBox();
				const overlay = await panel.boundingBox();
				return !!rect && !!overlay && rect.y + rect.height <= overlay.y + 1;
			}, { message: selector + ' must be above the consent banner' }).toBe(true);
		}
		await panel.getByRole('button', { name: 'Reject' }).click();
		await expect(page.locator('html')).toHaveCSS('scroll-padding-bottom', '0px');
	});
}
