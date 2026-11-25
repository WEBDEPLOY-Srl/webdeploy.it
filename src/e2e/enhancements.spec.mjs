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
		const tile = demo.getByRole('button', { name, exact: true });
		await tile.press('Enter');
		await expect(demo.locator('.kiosk-demo__list li').first()).toBeVisible();
		const back = demo.getByRole('button', { name: 'Back', exact: true });
		await expect(back).toBeFocused();
		await back.press('Enter');
		await expect(tile).toBeFocused();
	}
	await page.clock.install();
	await demo.getByRole('button', { name: 'Windows kiosk' }).press('Enter');
	await expect(demo.getByRole('status')).toHaveText('Working on updates');
	await page.clock.runFor(1800);
	await expect(demo.getByRole('status')).toHaveText('Working on updates');
	await expect(demo.locator('.kiosk-demo__update-title').last()).not.toHaveText('0% complete');
	await page.clock.runFor(90000);
	await expect(demo.getByRole('status')).toHaveText('100% complete');
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
	await expect(page.getByRole('status')).toHaveCount(1);
	await expect(page.getByRole('status')).toHaveText('');
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
	await expect(page.locator('[data-submit-error]')).toHaveText(
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
	test('static demos and mobile navigation work without script controls or a sticky header', async ({ page }) => {
		await page.setViewportSize({ width: 390, height: 844 });
		for (const path of ['/', '/services/linux-workstations', '/totem']) {
			await page.goto(path);
			await expect(page.locator('.site-header')).toHaveCSS('position', 'relative');
			await expect(page.locator('.fallback-nav a[href="/contacts"]')).toBeVisible();
			const demo = page.locator(path === '/totem' ? '.kiosk-demo' : '.ws-demo');
			await expect(demo).toBeVisible();
			await expect(demo.locator('button:visible')).toHaveCount(0);
			if (path !== '/totem') {
				const preview = demo.locator('.ws-demo__preview');
				await preview.scrollIntoViewIfNeeded();
				await expect.poll(() => preview.evaluate((image) => image instanceof HTMLImageElement && image.naturalWidth > 0)).toBe(true);
			}
		}
	});
	test('navigation and the error page remain usable without JavaScript', async ({
		page,
		traffic
	}) => {
		await page.goto('/');
		await expect(page.locator('.fallback-nav a[href="/services/backup"]')).toBeVisible();
		await page.locator('.fallback-nav a[href="/services/backup"]').click();
		await expect(page.locator('h1')).not.toBeEmpty();
		const response = await page.goto('/__nojs__/missing');
		expect(response?.status()).toBe(404);
		await expect(page.getByRole('link', { name: 'Return Home' })).toBeVisible();
		expect(traffic.meta).toHaveLength(0);
	});
	test('newsletter shows one disabled submit button and explains the spam check', async ({ page, traffic }) => {
		await page.goto('/newsletter');
		const button = page.locator('form button');
		await expect(button).toHaveCount(1);
		await expect(button).toHaveAccessibleName('Subscribe');
		await expect(button).toBeVisible();
		await expect(button).toBeDisabled();
		const note = page.locator('form noscript p');
		await expect(note).toBeVisible();
		await expect(note).toHaveText('Turn on JavaScript to complete the spam check.', { useInnerText: true });
		await page.getByLabel('Email address').fill('reader@example.test');
		await page.locator('input[name=l]').first().check();
		await page.getByLabel('Email address').press('Enter');
		await expect(page).toHaveURL(/\/newsletter$/);
		expect(traffic.listmonk.filter(request => request.method === 'POST')).toHaveLength(0);
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

test('article text reflows on narrow phones and print omits interactive overlays', async ({ page }) => {
	await page.goto('/news/php2shell-cve-2026-109618-109619');
	const rows = page.locator('.article-body li');
	expect(await rows.count()).toBeGreaterThan(0);
	for (const width of [320, 360, 375]) {
		await page.setViewportSize({ width, height: 740 });
		expect(await rows.evaluateAll((items) => items.every((item) => item.scrollWidth <= item.clientWidth + 1))).toBe(true);
	}
	await page.getByRole('button', { name: 'Cookie settings' }).click();
	await page.emulateMedia({ media: 'print' });
	for (const selector of ['.cookie-banner', '.consent-reservation', '.share-controls', '.toast-container']) {
		await expect(page.locator(selector)).toBeHidden();
	}
});

test('a navigation initialization failure leaves consent and cookieless analytics available', async ({ page }) => {
	await page.route((url) => url.pathname === '/security', async (route) => {
		const response = await route.fetch();
		const html = (await response.text()).replace('id="mobile-navigation-template"', 'id="unavailable-navigation"');
		await route.fulfill({ response, body: html });
	});
	await page.addInitScript(() => localStorage.removeItem('wd_consent_marketing'));
	await page.goto('/security');
	await expect(page.locator('.site-footer__settings')).toBeVisible();
	await expect.poll(() => page.evaluate(() => window._paq?.some(([command]) => command === 'disableCookies'))).toBe(true);
	await page.locator('.site-footer__settings').click();
	await expect(page.getByRole('complementary', { name: 'Privacy & cookies' })).toBeVisible();
});

test('phone service headings and article introductions precede secondary content', async ({ page }) => {
	await page.setViewportSize({ width: 320, height: 640 });
	for (const path of ['/services/backup', '/services/consulting', '/services/linux-workstations']) {
		await page.goto(path);
		const heading = await page.locator('h1').boundingBox();
		const art = await page.locator('main figure').first().boundingBox();
		expect(heading && art && heading.y + heading.height < art.y, path).toBe(true);
	}
	for (const path of ['/news/fosdem-2026', '/news/php2shell-cve-2026-109618-109619']) {
		await page.goto(path);
		const intro = await page.locator('.article-intro').boundingBox();
		const share = await page.locator('.share-controls').boundingBox();
		const image = await page.locator('.article-figure').boundingBox();
		expect(intro && share && image && intro.y < share.y && share.y < image.y, path).toBe(true);
	}
});

test('small phone demos expose readable controls and results', async ({ page }) => {
	await page.setViewportSize({ width: 320, height: 640 });
	await page.emulateMedia({ reducedMotion: 'reduce' });
	await page.goto('/totem');
	await page.getByRole('button', { name: 'Opening hours', exact: true }).click();
	const back = page.getByRole('button', { name: 'Back', exact: true });
	const box = await back.boundingBox();
	await expect(back).toHaveCSS('min-block-size', '44px');
	expect(box && Math.round(box.width) >= 44 && Math.round(box.height) >= 44).toBe(true);
	await expect(back).toHaveCSS('font-size', '14px');
	await page.goto('/services/linux-workstations');
	const demo = page.locator('.ws-demo');
	await demo.locator('[data-app="files"]').click();
	const status = demo.getByRole('status');
	await expect(status).toContainText('Dolphin');
	await demo.locator('[data-print]').click();
	await expect(status).toHaveText('Test label printed');
	const result = await status.boundingBox();
	expect(result && result.width > 80 && result.height >= 20).toBe(true);
});

test('total map tile failure preserves the address and marker and clears after recovery', async ({ page }) => {
	let offline = true;
	await page.context().route('https://tile.openstreetmap.org/**', (route) => offline ? route.abort('failed') : route.fallback());
	await page.goto('/contacts');
	const map = page.locator('.contact-map');
	await map.scrollIntoViewIfNeeded();
	await expect(map.getByRole('status')).toHaveText('Unable to load map');
	await expect(page.locator('.contacts-details').first()).toContainText('Via Puccini');
	await expect(map.locator('.leaflet-control-attribution')).toBeVisible();
	offline = false;
	await map.locator('.leaflet-control-zoom-in').click();
	await expect(map.getByRole('status')).toHaveText('');
	await map.locator('.leaflet-marker-icon').click();
	await expect(map.locator('.leaflet-popup')).toContainText('Via Puccini');
});

test('the cookieless initial page view is recorded before a confirmation event', async ({ page }) => {
	await page.goto('/newsletter/confirmed', { referer: 'https://newsletter.webdeploy.it/confirm' });
	await expect.poll(() => page.evaluate(() => {
		const commands = window._paq ?? [];
		const view = commands.findIndex(([name]) => name === 'trackPageView');
		const confirmation = commands.findIndex(([name, , action]) => name === 'trackEvent' && action === 'newsletter_confirmed');
		return view !== -1 && confirmation > view &&
			commands.some(([name]) => name === 'enableLinkTracking') &&
			commands.slice(0, view).some(([name]) => name === 'disableCookies') &&
			commands.slice(0, view).some(([name, active]) => name === 'setDoNotTrack' && active === true);
	})).toBe(true);
});

test('the homepage consent controls work before optional enhancements finish loading', async ({ page }) => {
	await page.setViewportSize({width:390,height:844});
	await page.addInitScript(() => localStorage.removeItem('wd_consent_marketing'));
	/** @type {() => void} */
	let release = () => {};
	const pending = new Promise((resolve) => { release = () => resolve(undefined); });
	await page.route('**/js/shell.mjs', async (route) => { await pending; await route.continue(); });
	try {
		await page.goto('/', { waitUntil: 'domcontentloaded' });
		const banner = page.getByRole('complementary', { name: 'Privacy & cookies' });
		await expect(banner).toBeVisible();
		await banner.getByRole('button', {name:'Reject'}).click();
		await expect(banner).toHaveCount(0);
		expect(await page.evaluate(() => localStorage.getItem('wd_consent_marketing'))).toBe('denied');
		await page.locator('button[aria-controls="mobile-menu"]').click();
	} finally { release(); }
	await expect(page.locator('#mobile-menu')).toBeVisible();
	await expect(page.locator('button[aria-controls="mobile-menu"]')).toHaveAttribute('aria-expanded','true');
	await page.waitForLoadState('networkidle');
});

test('a distant newsletter form waits for proximity, then mounts its real ready widget once', async ({ page }) => {
	/** @type {string[]} */
	const widgetRequests = [];
	page.on('request',(request) => {
		if (new URL(request.url()).pathname.endsWith('/external/altcha.min.js')) widgetRequests.push(request.url());
	});
	await page.route(/\/assets\/build\/[^/]+\/css\/page-[^/]+\.css$/, async (route) => {
		const response = await route.fetch();
		await route.fulfill({response, body:(await response.text()) + '\n.newsletter-form { margin-block-start: 300vh; }'});
	});
	await page.goto('/newsletter');
	const form = page.locator('.newsletter-form');
	await expect(form).not.toBeInViewport();
	await page.waitForLoadState('networkidle');
	await expect(form.getByRole('button',{name:'Subscribe'})).toBeDisabled();
	await expect(form.locator('altcha-widget')).toHaveCount(0);
	expect(widgetRequests).toHaveLength(0);
	await form.scrollIntoViewIfNeeded();
	await expect(form.getByRole('button',{name:'Subscribe'})).toBeEnabled();
	await expect(form.locator('altcha-widget')).toHaveCount(1);
	expect(widgetRequests).toHaveLength(1);
});
