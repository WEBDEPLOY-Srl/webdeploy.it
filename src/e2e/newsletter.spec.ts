import { createHash } from 'node:crypto';
import AxeBuilder from '@axe-core/playwright';
import { expect, test } from './fixtures';
import { sitemapPaths } from './routes';

const LIST_NEWS = '300c28fe-d91b-4965-b247-da6e6dafdb7a';
const LIST_MARKETING = '71ca6320-90f7-4cd5-9e52-cb53ba5b84ba';
const banner = (page: import('@playwright/test').Page) =>
	page.getByRole('complementary', { name: 'Privacy & cookies' });

async function mockAltcha(page: import('@playwright/test').Page, config: Record<string, unknown>) {
	await page.locator('altcha-widget').evaluate(async (element, options) => {
		await customElements.whenDefined('altcha-widget');
		await (element as HTMLElement & { configure: (value: object) => Promise<void> }).configure(
			options
		);
	}, config);
}

async function prepareForm(page: import('@playwright/test').Page) {
	await page.goto('/newsletter');
	await page.getByLabel('Email address').fill('hello@example.com');
	await mockAltcha(page, { test: true });
}

test('solves a real ALTCHA v1 challenge with the local SHA worker', async ({
	page,
	traffic,
	cspViolations
}) => {
	const workers: string[] = [];
	let challengeOrigin: string | null = null;
	page.on('request', (request) => {
		if (request.url().includes('/workers/sha-')) workers.push(request.url());
	});
	page.on('response', async (response) => {
		if (response.url().endsWith('/api/public/captcha/altcha')) {
			challengeOrigin = await response.headerValue('access-control-allow-origin');
		}
	});
	const response = await page.goto('/newsletter');
	const serverHtml = await response?.text();
	expect(serverHtml).toMatch(/<button[^>]*type="submit"[^>]*disabled/);
	await page.getByLabel('Email address').fill('hello@example.com');
	await page.locator('input[name="l"]').first().check();
	const submit = page.getByRole('button', { name: 'Subscribe' });
	await page.evaluate(() => customElements.whenDefined('altcha-widget'));
	await expect
		.poll(() =>
			page.evaluate(() => {
				const registry = (
					globalThis as typeof globalThis & {
						$altcha?: { algorithms: { get: (name: string) => unknown } };
					}
				).$altcha;
				return typeof registry?.algorithms.get('SHA-256') === 'function';
			})
		)
		.toBe(true);
	await expect(submit).toBeEnabled();
	await submit.click();
	await expect
		.poll(() => traffic.listmonk.filter(({ method }) => method === 'POST').length)
		.toBe(1);
	const post = traffic.listmonk.find(({ method }) => method === 'POST')!;
	const altcha = new URLSearchParams(post.body ?? '').get('altcha');
	const proof = JSON.parse(Buffer.from(altcha ?? '', 'base64').toString('utf8'));
	const salt = 'abc?expires=1893456000';
	expect(proof).toMatchObject({
		algorithm: 'SHA-256',
		challenge: createHash('sha256').update(`${salt}1234`).digest('hex'),
		number: 1234,
		salt,
		signature: 'offline-signature'
	});
	expect(challengeOrigin).toBe('http://127.0.0.1:4173');
	expect(workers.some((url) => url.includes('/workers/sha-'))).toBe(true);
	expect(cspViolations).toEqual([]);
});

test('the newsletter is accessible and its form stays above the cookie banner on phone sizes', async ({
	page
}) => {
	for (const viewport of [
		{ width: 360, height: 640 },
		{ width: 390, height: 844 },
		{ width: 412, height: 915 }
	]) {
		await page.setViewportSize(viewport);
		await page.addInitScript(() => localStorage.removeItem('wd_consent_marketing'));
		await page.goto('/newsletter');
		await expect(banner(page)).toBeVisible();

		const bannerBox = await banner(page).boundingBox();
		const reservationBox = await page.locator('.consent-reservation').boundingBox();
		const checkboxes = await page.locator('input[name="l"]').all();
		const checkboxBoxes = await Promise.all(checkboxes.map((input) => input.boundingBox()));
		const emailBox = await page.getByLabel('Email address').boundingBox();
		const submitBox = await page.getByRole('button', { name: 'Subscribe' }).boundingBox();
		expect(bannerBox).not.toBeNull();
		expect(bannerBox!.height).toBeLessThanOrEqual(112);
		expect(reservationBox).not.toBeNull();
		expect(reservationBox!.height).toBeCloseTo(bannerBox!.height, 0);
		const copy = page.locator('.consent-copy');
		const copyBox = await copy.boundingBox();
		const copyLineHeight = await copy.evaluate((element) =>
			parseFloat(getComputedStyle(element).lineHeight)
		);
		expect(copyBox!.height).toBeLessThanOrEqual(copyLineHeight * 2);
		expect(checkboxBoxes).toHaveLength(2);
		for (const [name, box] of [
			...checkboxBoxes.map((box, index) => [`checkbox ${index + 1}`, box] as const),
			['email', emailBox] as const,
			['submit', submitBox] as const
		]) {
			expect(box).not.toBeNull();
			expect(
				box!.y + box!.height,
				`${name} bottom ${box!.y + box!.height}px must stay above banner top ${bannerBox!.y}px`
			).toBeLessThanOrEqual(bannerBox!.y);
		}

		const buttons = await banner(page).getByRole('button').all();
		const buttonWidths = await Promise.all(
			buttons.map(async (button) => (await button.boundingBox())!.width)
		);
		expect(buttons).toHaveLength(2);
		expect(buttonWidths[0]).toBeCloseTo(buttonWidths[1], 0);
		expect(await banner(page).getByRole('button', { name: 'Reject' }).count()).toBe(1);
		expect(await banner(page).getByRole('button', { name: 'Accept' }).count()).toBe(1);
		await expect(page.locator('#consent-title')).toHaveClass(/sr-only/);
	}
});

test('cookie banner hides on phone field focus and dismisses without moving the page', async ({
	page
}) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await page.goto('/newsletter');
	await expect(page.locator('.consent-reservation')).toHaveCount(1);
	const layout = () =>
		Promise.all(
			['main', 'form', '#newsletter-email', '.newsletter-submit'].map((selector) =>
				page.locator(selector).boundingBox()
			)
		);
	const before = await layout();
	await page.getByLabel('Email address').focus();
	await expect(banner(page)).toBeHidden();
	await expect(page.locator('.consent-reservation')).toHaveCount(0);
	await page.getByLabel('Email address').evaluate((input: HTMLInputElement) => input.blur());
	await expect(banner(page)).toBeVisible();
	await expect(page.locator('.consent-reservation')).toHaveCount(1);
	await banner(page).getByRole('button', { name: 'Reject' }).click();
	await expect(banner(page)).toBeHidden();
	await expect(page.locator('.consent-reservation')).toHaveCount(0);
	expect(await layout()).toEqual(before);
});

test('no list blocks submission and shows the required choice message', async ({
	page,
	traffic
}) => {
	await prepareForm(page);
	await expect(page.getByRole('alert').first()).toBeEmpty();
	await page.getByRole('button', { name: 'Subscribe' }).click();
	await expect(page.getByRole('alert').first()).toContainText('Choose at least one email list.');
	expect(traffic.listmonk.filter(({ method }) => method === 'POST')).toEqual([]);
	expect(
		await page.evaluate(() =>
			(window._paq ?? []).some((item) => item[2] === 'newsletter_submit_initiated')
		)
	).toBe(false);
});

for (const selected of [[LIST_NEWS], [LIST_NEWS, LIST_MARKETING]]) {
	test(`${selected.length} selected list${selected.length === 1 ? '' : 's'} posts one repeated l field per choice`, async ({
		page,
		traffic
	}) => {
		await prepareForm(page);
		for (const list of selected) await page.locator(`input[name="l"][value="${list}"]`).check();
		await page.getByRole('button', { name: 'Subscribe' }).click();
		await expect
			.poll(() => traffic.listmonk.filter(({ method }) => method === 'POST').length)
			.toBe(1);
		const request = traffic.listmonk.find(({ method }) => method === 'POST')!;
		expect(request.url).toBe('https://newsletter.webdeploy.it/subscription/form');
		const data = new URLSearchParams(request.body ?? '');
		expect(data.getAll('l')).toEqual(selected);
		expect(data.get('email')).toBe('hello@example.com');
		expect(data.get('nonce')).toBe('');
		expect(data.get('name')).toBeNull();
		expect(data.get('altcha')).toBeTruthy();
	});
}

test('ALTCHA failure sends no events and does not post', async ({ page, traffic }) => {
	await prepareForm(page);
	await page.locator('input[name="l"]').first().check();
	await mockAltcha(page, { mockError: 'verification failure' });
	await page.getByRole('button', { name: 'Subscribe' }).click();
	await expect(page.getByRole('alert').last()).toContainText(
		'The spam check could not be completed.'
	);
	expect(traffic.listmonk.filter(({ method }) => method === 'POST')).toEqual([]);
	expect(
		await page.evaluate(() =>
			(window._paq ?? []).some((item) => item[2] === 'newsletter_submit_initiated')
		)
	).toBe(false);
	expect(
		await page.evaluate(() => (window.fbq?.queue ?? []).some((item) => item[1] === 'Lead'))
	).toBe(false);
});

test('Matomo records submission initiation and Meta Lead only after marketing consent', async ({
	page,
	traffic
}) => {
	await prepareForm(page);
	await page.locator('input[name="l"]').first().check();
	await banner(page).getByRole('button', { name: 'Reject' }).click();
	await page.getByRole('button', { name: 'Subscribe' }).click();
	await expect
		.poll(() => traffic.listmonk.filter(({ method }) => method === 'POST').length)
		.toBe(1);
	const matomoEvents = await page.evaluate(() =>
		(window._paq ?? []).filter((item) => item[0] === 'trackEvent')
	);
	expect(matomoEvents).toContainEqual(['trackEvent', 'Newsletter', 'newsletter_submit_initiated']);
	expect(
		await page.evaluate(() => (window.fbq?.queue ?? []).some((item) => item[1] === 'Lead'))
	).toBe(false);

	await page.goto('/newsletter');
	await page.getByLabel('Email address').fill('hello@example.com');
	await page.locator('input[name="l"]').nth(1).check();
	await mockAltcha(page, { test: true });
	const pixelRequest = page.waitForRequest(/connect\.facebook\.net\/en_US\/fbevents\.js/);
	await page.getByRole('contentinfo').getByRole('button', { name: 'Cookie settings' }).click();
	await banner(page).getByRole('button', { name: 'Accept' }).click();
	await pixelRequest;
	await page.waitForLoadState('networkidle');
	const pixelQueue = await page.evaluate(() => window.fbq?.queue ?? []);
	const autoConfigIndex = pixelQueue.findIndex(
		(item) => item[0] === 'set' && item[1] === 'autoConfig'
	);
	const initIndex = pixelQueue.findIndex((item) => item[0] === 'init');
	expect(pixelQueue[autoConfigIndex]).toEqual([
		'set',
		'autoConfig',
		false,
		pixelQueue[initIndex]?.[1]
	]);
	expect(autoConfigIndex).toBeGreaterThanOrEqual(0);
	expect(initIndex).toBeGreaterThan(autoConfigIndex);
	await page.getByRole('button', { name: 'Subscribe' }).click();
	await expect
		.poll(() => traffic.listmonk.filter(({ method }) => method === 'POST').length)
		.toBe(2);
	const lead = await page.evaluate(() =>
		(window.fbq?.queue ?? []).filter((item) => item[1] === 'Lead')
	);
	expect(lead).toHaveLength(1);
	expect(lead[0]).toEqual(['track', 'Lead', { content_name: 'newsletter' }]);
	expect(
		traffic.metaRequests.every(
			(url) => !/[?&]ud(?:%5B|\[)/i.test(url) && !/SubscribedButtonClick/.test(url)
		)
	).toBe(true);
	expect(
		await page.evaluate(() =>
			(window.fbq?.queue ?? []).some((item) => item[1] === 'SubscribedButtonClick')
		)
	).toBe(false);
});

test('confirmed page is noindex, excluded from sitemap and accessible', async ({ page }) => {
	await page.addInitScript(() => {
		const calls: unknown[][] = [];
		window._paq = [];
		window._paq.push = (...items) => {
			calls.push(...(items as unknown[][]));
			localStorage.setItem('test-matomo-queue', JSON.stringify(calls));
			return Array.prototype.push.apply(window._paq, items);
		};
	});
	await page.goto('/newsletter/confirmed');
	await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, follow');
	const confirmedEvent = () =>
		page.evaluate(() =>
			(JSON.parse(localStorage.getItem('test-matomo-queue') ?? '[]') as unknown[][]).some(
				(item) => item[0] === 'trackEvent' && item[2] === 'newsletter_confirmed'
			)
		);
	await expect(confirmedEvent()).resolves.toBe(false);
	await page.goto('/newsletter/confirmed', { referer: 'https://newsletter.webdeploy.it/confirm' });
	await expect.poll(confirmedEvent).toBe(true);
	const axe = await new AxeBuilder({ page }).analyze();
	expect(axe.violations).toEqual([]);
	const response = await page.request.get('/sitemap.xml');
	const sitemap = await response.text();
	expect(response.status()).toBe(200);
	expect(sitemap).not.toContain('/newsletter/confirmed');
});

test('newsletter page has no axe violations', async ({ page }) => {
	await page.goto('/newsletter');
	const axe = await new AxeBuilder({ page }).analyze();
	expect(axe.violations).toEqual([]);
});

test('newsletter is the only page with a form', async ({ page }) => {
	await page.goto('/newsletter');
	expect(await page.locator('form').count(), '/newsletter').toBe(1);
	for (const path of [
		...sitemapPaths().filter((path) => path !== '/newsletter'),
		'/newsletter/confirmed'
	]) {
		await page.goto(path);
		expect(await page.locator('form').count(), path).toBe(0);
	}
});

test('form returns from Listmonk with enabled submit and unticked lists', async ({ page }) => {
	await prepareForm(page);
	await page.locator('input[name="l"]').first().check();
	await page.route('https://newsletter.webdeploy.it/subscription/form', (route) =>
		route.fulfill({
			status: 200,
			contentType: 'text/html; charset=utf-8',
			body: '<!doctype html><html><body>Check your inbox</body></html>'
		})
	);
	await page.getByRole('button', { name: 'Subscribe' }).click();
	await expect(page).toHaveURL('https://newsletter.webdeploy.it/subscription/form');
	await page.goBack();
	await expect(page).toHaveURL(/\/newsletter$/);
	await expect(page.getByRole('button', { name: 'Subscribe' })).toBeEnabled();
	await expect(page.locator('input[name="l"]').nth(0)).not.toBeChecked();
	await expect(page.locator('input[name="l"]').nth(1)).not.toBeChecked();
});

test('privacy notice reflects live newsletter retention, links and per-visit analytics', async ({
	page
}) => {
	await page.goto('/privacy#newsletter');
	const notice = page.locator('#newsletter');
	await expect(notice).toContainText('each subscriber receives one welcome email');
	await expect(notice).toContainText('manage-subscriptions link');
	await expect(notice).toContainText('no unsubscribe headers');
	await expect(notice).toContainText('Matomo analytics, which retains per-visit records');
	await expect(notice).toContainText('content_name: newsletter');
	await expect(notice).toContainText('never your email address or list choice');
	await expect(page.locator('body')).not.toContainText(
		'We only collect anonymous, aggregated data'
	);
});
