// @ts-check
// SPDX-FileCopyrightText: 2026 WEBDEPLOY S.R.L.
// SPDX-License-Identifier: AGPL-3.0-only
import { expect, test } from './fixtures.mjs';

test.beforeEach(async ({ page }) => {
	await page.addInitScript(() => localStorage.setItem('wd_consent_marketing', 'denied'));
});

test('kiosk views and system switching work from the keyboard', async ({ page }) => {
	await page.goto('/totem');
	const demo = page.getByRole('group', { name: 'Interactive kiosk demo' });
	for (const name of ['Opening hours', 'Find your way', 'Today']) {
		await demo.getByRole('button', { name, exact: true }).press('Enter');
		await expect(demo.locator('.kiosk-demo__list li').first()).toBeVisible();
		await demo.getByRole('button', { name: 'Back', exact: true }).press('Enter');
	}
	await demo.getByRole('button', { name: 'Windows kiosk' }).press('Enter');
	await expect(demo.getByRole('status')).toContainText('Working on updates');
	await demo.getByRole('button', { name: 'inWD™ Kiosk', exact: true }).press('Enter');
	await expect(demo.getByRole('button', { name: 'Opening hours' })).toBeVisible();
});

for (const path of ['/', '/services/linux-workstations']) {
	test(`workstation launches apps and prints a label at ${path}`, async ({ page }) => {
		await page.emulateMedia({ reducedMotion: 'reduce' });
		await page.goto(path);
		const demo = page.locator('.ws-demo');
		for (const [app, title] of [
			['files', 'Dolphin'],
			['browser', 'Firefox'],
			['office', 'LibreOffice Writer']
		]) {
			await demo.locator('button[data-app="' + app + '"]').click();
			await expect(demo.locator('.desk .win__title')).toHaveText(title);
		}
		await demo.locator('[data-print]').click();
		await demo.locator('[data-print]').click();
		await expect(demo.locator('.queue [data-test-label]')).toHaveCount(1);
		await expect(demo.getByRole('status')).not.toBeEmpty();
		await page.setViewportSize({ width: 390, height: 844 });
		await expect(demo.locator('.ws-demo__stage')).toBeVisible();
	});
}

test('the map waits for proximity, then opens the attributed marker', async ({ page, traffic }) => {
	await page.setViewportSize({ width: 390, height: 400 });
	await page.goto('/contacts');
	const frame = page.locator('.contact-map');
	await expect(frame).not.toBeInViewport();
	expect(traffic.all.some((url) => url.includes('tile.openstreetmap.org'))).toBe(false);
	await frame.scrollIntoViewIfNeeded();
	await page.locator('.leaflet-marker-icon').click();
	await expect(page.locator('.leaflet-popup')).toContainText('Via Puccini');
	await expect(
		page.locator('.leaflet-control-attribution a[href="https://www.openstreetmap.org/copyright"]')
	).toBeVisible();
});

test('share controls use the canonical URL and the expected campaign tags', async ({ page }) => {
	await page.addInitScript(() => {
		Object.defineProperty(navigator, 'clipboard', {
			configurable: true,
			value: {
				writeText: async (/** @type {string} */ text) => {
					document.documentElement.dataset.copied = text;
				}
			}
		});
		window.open = (url) => {
			document.documentElement.dataset.shared = String(url);
			return window;
		};
	});
	await page.goto('/news/fosdem-2026?mtm_source=fixture');
	await page.getByRole('link', { name: 'Share on LinkedIn' }).click();
	await expect(page.locator('html')).toHaveAttribute(
		'data-shared',
		'https://www.linkedin.com/sharing/share-offsite/?url=https%3A%2F%2Fwebdeploy.it%2Fnews%2Ffosdem-2026'
	);
	await page.getByRole('button', { name: 'Share on Instagram' }).click();
	await expect(page.locator('html')).toHaveAttribute(
		'data-copied',
		'https://webdeploy.it/news/fosdem-2026?mtm_campaign=news-fosdem-2026&mtm_kwd=instagram'
	);
	await expect(page.getByRole('status')).toContainText('Link copied');
});

test('a failed widget stays disabled and gives the approved reload instruction', async ({
	page,
	traffic
}) => {
	await page.route('**/dist/external/altcha.min.js', (r) => r.abort());
	await page.goto('/newsletter');
	await expect(page.locator('[data-spam-error]')).toHaveText(
		'The spam check could not be loaded. Reload the page to try again.'
	);
	await expect(page.getByRole('button', { name: 'Subscribe' })).toBeDisabled();
	expect(traffic.listmonk.filter((request) => request.method === 'POST')).toHaveLength(0);
});
test('a lookalike origin cannot record a confirmation', async ({ page }) => {
	await page.goto('/newsletter/confirmed', {
		referer: 'https://newsletter.webdeploy.it.example.test/confirm'
	});
	expect(
		await page.evaluate(() => (window._paq ?? []).some((c) => c[2] === 'newsletter_confirmed'))
	).toBe(false);
});

test.describe('HTML without JavaScript', () => {
	test.use({ javaScriptEnabled: false });
	test('navigation, the error page and newsletter fallback remain usable', async ({
		page,
		traffic
	}) => {
		await page.goto('/');
		await expect(page.locator('.fallback-nav a[href="/services/backup"]')).toBeVisible();
		await page.locator('.fallback-nav a[href="/services/backup"]').click();
		await expect(page.locator('h1')).not.toBeEmpty();
		await page.goto('/newsletter');
		await expect(page.getByRole('button', { name: 'Subscribe' })).toBeDisabled();
		const note = page.locator('form noscript p');
		await expect(note).toBeVisible();
		await expect(note).toContainText('JavaScript is required to complete the spam check', {
			useInnerText: true
		});
		const response = await page.goto('/__nojs__/missing');
		expect(response?.status()).toBe(404);
		await expect(page.getByRole('link', { name: 'Return Home' })).toBeVisible();
		expect(traffic.meta).toHaveLength(0);
	});
});

test.describe('Italian browser preference', () => {
	test.use({ locale: 'it-IT' });
	test('archived locale cookies leave the English page and canonical intact', async ({
		page,
		context,
		baseURL
	}) => {
		if (!baseURL) throw new Error('Missing local nginx origin');
		await context.addCookies([{ name: 'nf_lang', value: 'it', url: baseURL }]);
		await page.goto('/news');
		await expect(page.locator('html')).toHaveAttribute('lang', 'en');
		await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute('content', 'en_US');
		await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
			'href',
			'https://webdeploy.it/news'
		);
		await expect(
			page.locator('link[hreflang],meta[property="og:locale:alternate"],.language-switcher')
		).toHaveCount(0);
		expect(
			(await context.cookies(baseURL)).find((cookie) => cookie.name === 'nf_lang')?.value
		).toBe('it');
	});
});
