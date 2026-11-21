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
	const start = await page.evaluate(async () => {
		const start = scrollY;
		for (let y = 0; y < document.documentElement.scrollHeight; y += innerHeight) {
			scrollTo({ top: y, behavior: 'instant' });
			await new Promise((resolve) => requestAnimationFrame(resolve));
		}
		await document.fonts.ready;
		return start;
	});
	// Keep lazy images in view through an actual paint. A responsive request can
	// be decoded before the compositor draws it on a long mobile page.
	// Paint each tool grid as a unit; every native image is still decoded below.
	for (const grid of await page.locator('.home-tools__grid:visible').all()) {
		await grid.scrollIntoViewIfNeeded();
		await expect.poll(() => grid.locator('img').evaluateAll((images) =>
			images.every((image) => image instanceof HTMLImageElement && image.complete && image.naturalWidth > 0)
		)).toBe(true);
		await grid.screenshot({ animations: 'disabled' });
	}
	// A live workstation replaces its preview on approach. Inspect the actual
	// device rather than retaining a locator for the outgoing static image.
	for (const device of await page.locator('.ws-demo__device:visible').all()) {
		await device.scrollIntoViewIfNeeded();
		await expect(device.locator('.ws-demo__stage')).toBeVisible();
		await device.screenshot({ animations: 'disabled' });
	}
	for (const lazy of await page.locator('img[loading="lazy"]:not(.tool-mark,.ws-demo__preview):visible').all()) {
		await lazy.scrollIntoViewIfNeeded();
		await expect.poll(() => lazy.evaluate(image =>
			image instanceof HTMLImageElement && image.complete && image.naturalWidth > 0
		), { timeout: 10_000 }).toBe(true);
		await lazy.screenshot({ animations: 'disabled' });
	}
	// A decode on a superseded request can reject. Require a successful decode
	// of the current request for every image before capturing.
	await expect.poll(() => page.evaluate(async () => {
		const pending = await Promise.all(Array.from(document.images, async (image) => {
			if (image.complete && image.naturalWidth > 0) {
				try {
					await image.decode();
					return '';
				} catch { /* Recheck the current request on the next poll. */ }
			}
			return image.currentSrc || image.src || '(missing image source)';
		}));
		return pending.filter(Boolean);
	}), { timeout: 10_000, message: 'Every screenshot image must decode' }).toEqual([]);
	await page.evaluate(async (position) => {
		scrollTo({ top: position, behavior: 'instant' });
		await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
	}, start);
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
	await expect(banner).toBeFocused();
	// The banner is fixed. A shared document origin keeps fractional footer scroll
	// positions from shifting the screenshot rectangle by one device pixel.
	await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
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
	await page.evaluate(async () => { await document.fonts.ready; });
	await page.getByRole('button', { name: 'Subscribe' }).click();
	await expect(page.locator('#newsletter-list-error')).not.toHaveText('');
	if (info.project.use.browserName === 'chromium') {
		// Chromium animates its own validation bubble outside the page's animation clock.
		// Allow its fade-in to finish on both images while the message is still visible.
		await page.waitForTimeout(1000);
	}
	await capture(page, info, 'signup-invalid', page.locator('form'));
});

test('inline newsletter results', async ({ page }, info) => {
	await page.addInitScript(() => localStorage.setItem('wd_consent_marketing', 'denied'));
	let attempt = 0;
	await page.route('https://newsletter.webdeploy.it/subscription/form', route => {
		attempt++;
		if (attempt === 2) return route.abort();
		return route.fulfill({
			status: attempt === 1 ? 429 : 200,
			headers: { 'access-control-allow-origin': new URL(page.url()).origin, vary: 'Origin' },
			contentType: 'text/html', body: '<p>Hosted result</p>'
		});
	});
	await page.goto('/newsletter');
	const form = page.locator('form');
	const submit = form.getByRole('button', { name: 'Subscribe' });
	await expect(submit).toBeEnabled();
	await page.evaluate(async () => {
		await document.fonts.ready;
		await document.querySelector('altcha-widget')?.configure({ test: true });
	});
	await form.getByLabel('Email address').fill('reader@example.test');
	await form.locator('input[name=l]').first().check();
	await submit.click();
	await expect(form.locator('[data-submit-error]')).toBeVisible();
	await capture(page, info, 'signup-rate-limited', form);
	await submit.click();
	await expect(form.locator('[data-submit-error]')).toContainText('Check your inbox before');
	await capture(page, info, 'signup-unknown', form);
	await submit.click();
	await expect(form.getByRole('status')).toBeFocused();
	await capture(page, info, 'signup-pending-confirmation', form);
});
