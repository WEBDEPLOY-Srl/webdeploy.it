// @ts-check
// SPDX-FileCopyrightText: 2026 WEBDEPLOY S.R.L.
// SPDX-License-Identifier: AGPL-3.0-only
import { expect, test } from '@playwright/test';

/** @typedef {import('@playwright/test').Page} Page */
/** @typedef {import('@playwright/test').TestInfo} TestInfo */
/** @typedef {import('@playwright/test').Locator} Locator */

const routes = [
	'/',
	'/contacts',
	'/developer-manifesto',
	'/news',
	'/news/fosdem-2026',
	'/news/php2shell-cve-2026-109618-109619',
	'/newsletter',
	'/newsletter/confirmed',
	'/privacy',
	'/security',
	'/services/backup',
	'/services/consulting',
	'/services/linux-workstations',
	'/totem',
	'/__parity__/missing'
];
const tile = Buffer.from(
	'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
	'base64'
);

/**
 * Wait for below-fold fonts, images and the map while preserving the capture position.
 * @param {Page} page
 * @returns {Promise<void>}
 */
async function settle(page) {
	await page.evaluate(async () => {
		const start = scrollY;
		for (let y = 0; y < document.documentElement.scrollHeight; y += innerHeight) {
			scrollTo({ top: y, behavior: 'instant' });
			await new Promise((resolve) => requestAnimationFrame(resolve));
		}
		await document.fonts.ready;
		await Promise.all(Array.from(document.images, (image) => image.decode()));
		scrollTo({ top: start, behavior: 'instant' });
		await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
	});
}

/**
 * Keep an actual image for every comparison, including successful comparisons.
 * @param {Page} page
 * @param {TestInfo} info
 * @param {string} name
 * @param {Locator} [region]
 * @returns {Promise<void>}
 */
async function capture(page, info, name, region) {
	const path = info.outputPath(`${name}.png`);
	const options = /** @type {const} */ ({ path, animations: 'disabled', caret: 'hide' });
	const png = region
		? await region.screenshot(options)
		: await page.screenshot({ ...options, fullPage: true });
	expect(png).toMatchSnapshot(`${name}.png`, {
		threshold: 0.1,
		...(region ? { maxDiffPixels: 20 } : { maxDiffPixelRatio: 0.001 })
	});
}

test.beforeEach(async ({ page, baseURL }) => {
	const origin = new URL(baseURL ?? '').origin;
	await page.clock.setFixedTime(new Date('2026-11-18T12:34:00Z'));
	await page.route('**/*', async (route) => {
		const url = new URL(route.request().url());
		if (url.origin === origin) return route.continue();
		if (url.origin === 'https://tile.openstreetmap.org') {
			return route.fulfill({ contentType: 'image/png', body: tile });
		}
		if (url.origin === 'https://analytics.inwd.org') {
			return route.fulfill({ contentType: 'application/javascript', body: '' });
		}
		throw new Error(`Unexpected external request during parity capture: ${url.origin}`);
	});
});

for (const path of routes) {
	test(`full page ${path}`, async ({ page }, info) => {
		await page.addInitScript(() => localStorage.setItem('wd_consent_marketing', 'denied'));
		const response = await page.goto(path);
		expect(response?.status()).toBe(path === '/__parity__/missing' ? 404 : 200);
		await expect(page.locator('h1')).toBeVisible();
		if (path === '/contacts') {
			await page.locator('.contacts-map').scrollIntoViewIfNeeded();
			await expect(page.locator('.leaflet-tile-loaded').first()).toBeVisible();
			await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
		}
		await settle(page);
		await capture(page, info, path.slice(1).replaceAll('/', '--') || 'home');
	});
}

test('newsletter banner and choices', async ({ page }, info) => {
	await page.goto('/newsletter');
	const banner = page.getByRole('complementary', { name: 'Privacy & cookies' });
	await expect(banner).toBeVisible();
	await expect(page.getByRole('button', { name: 'Subscribe' })).toBeEnabled();
	await settle(page);
	await capture(page, info, 'pending-consent', banner);
	await capture(page, info, 'signup-form', page.locator('form'));
	await banner.getByRole('button', { name: 'Reject' }).click();
	await page.getByRole('button', { name: 'Cookie settings' }).click();
	await capture(page, info, 'reopened-consent', banner);
});

test('interaction states', async ({ page }, info) => {
	await page.addInitScript(() => localStorage.setItem('wd_consent_marketing', 'denied'));
	await page.goto('/');
	const mobile = info.project.name.endsWith('-mobile');
	if (mobile) {
		await page.locator('button[aria-controls="mobile-menu"]').click();
		await page.locator('button[aria-controls="mobile-services-menu"]').click();
		await capture(page, info, 'services-navigation', page.locator('#mobile-menu'));
	} else {
		await page.locator('button[aria-controls="services-menu"]').press('ArrowDown');
		await capture(page, info, 'services-navigation', page.locator('#services-menu'));
	}
	await page.goto('/totem');
	const kiosk = page.getByRole('group', { name: 'Interactive kiosk demo' });
	await kiosk.getByRole('button', { name: 'Opening hours' }).click();
	await capture(page, info, 'kiosk-hours', kiosk);
	await kiosk.getByRole('button', { name: 'Windows kiosk' }).click();
	await capture(page, info, 'kiosk-windows', kiosk);
	await page.goto('/services/linux-workstations');
	const workstation = page.locator('.ws-demo');
	await workstation.locator('.ws-demo__controls button').first().click();
	await capture(page, info, 'workstation-app', workstation);
	await page.goto('/privacy#newsletter');
	await capture(page, info, 'privacy-newsletter', page.locator('#newsletter'));
	await page.goto('/contacts');
	await page.locator('.contacts-map').scrollIntoViewIfNeeded();
	await page.locator('.leaflet-marker-icon').click();
	await capture(page, info, 'map-popup', page.locator('.leaflet-popup'));
});

test('invalid newsletter form', async ({ page }, info) => {
	await page.addInitScript(() => localStorage.setItem('wd_consent_marketing', 'denied'));
	await page.goto('/newsletter');
	await page.locator('input[type=email]').fill('example@example.test');
	await page.getByRole('button', { name: 'Subscribe' }).click();
	await expect(page.locator('#newsletter-list-error')).not.toHaveText('');
	if (info.project.name === 'chromium-desktop') {
		// Chromium animates its own validation bubble outside the page's animation clock.
		// Allow its fade-in to finish on both images while the message is still visible.
		await page.waitForTimeout(1000);
	}
	await capture(page, info, 'signup-invalid', page.locator('form'));
});
