// @ts-check
// SPDX-FileCopyrightText: 2026 WEBDEPLOY S.R.L.
// SPDX-License-Identifier: AGPL-3.0-only
import { createHash } from 'node:crypto';
import { createServer } from 'node:http';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import { en } from '../content/en.mjs';
import { expect, test } from './fixtures.mjs';
import { sitemapPaths } from './routes.mjs';
const LIST_NEWS = '300c28fe-d91b-4965-b247-da6e6dafdb7a';
const LIST_MARKETING = '71ca6320-90f7-4cd5-9e52-cb53ba5b84ba';
const endpoint = 'https://newsletter.webdeploy.it/subscription/form';
/** @param {import("@playwright/test").Page} page */
const banner = (page) => page.getByRole('complementary', { name: 'Privacy & cookies' });
/** @param {import("@playwright/test").Page} page @param {Record<string,unknown>} config */
async function mockAltcha(page, config) {
	await page.locator('altcha-widget').evaluate(async (element, options) => {
		await customElements.whenDefined('altcha-widget');
		if (
			element.localName !== 'altcha-widget' ||
			!('configure' in element) ||
			typeof element.configure !== 'function'
		)
			throw new Error('Widget unavailable');
		await element.configure(options);
	}, config);
}
/** @param {import("@playwright/test").Page} page */
async function prepareForm(page) {
	await page.goto('/newsletter');
	await page.getByLabel('Email address').fill('hello@example.com');
	await mockAltcha(page, { test: true });
}
test('solves a real ALTCHA v1 challenge with the local SHA worker', async ({
	page,
	traffic,
	cspViolations
}) => {
	/** @type {string[]} */
	const workers = [];
	const workerPath =
		/^\/assets\/build\/[a-f0-9]{16}\/vendor\/altcha-3\.6\.0\/dist\/workers\/sha\.js$/;
	/** @type {string|null} */
	let challengeOrigin = null;
	page.on('request', (request) => {
		if (workerPath.test(new URL(request.url()).pathname)) workers.push(request.url());
	});
	page.on('response', async (response) => {
		if (response.url().endsWith('/api/public/captcha/altcha')) {
			challengeOrigin = await response.headerValue('access-control-allow-origin');
		}
	});
	const response = await page.goto('/newsletter');
	expect(await response?.text()).toMatch(/<button[^>]*type="submit"[^>]*disabled/);
	await page.getByLabel('Email address').fill('hello@example.com');
	await page.locator('input[name="l"]').first().check();
	const submit = page.getByRole('button', { name: 'Subscribe' });
	await page.evaluate(() => customElements.whenDefined('altcha-widget'));
	await expect
		.poll(() =>
			page.evaluate(() => {
				const registry = window.$altcha;
				return typeof registry?.algorithms.get('SHA-256') === 'function';
			})
		)
		.toBe(true);
	await expect(submit).toBeEnabled();
	await submit.click();
	await expect
		.poll(() => traffic.listmonk.filter(({ method }) => method === 'POST').length)
		.toBe(1);
	const post = traffic.listmonk.find(({ method }) => method === 'POST');
	const altcha = new URLSearchParams(post?.body ?? '').get('altcha');
	const proof = JSON.parse(Buffer.from(altcha ?? '', 'base64').toString('utf8'));
	const salt = 'abc1?expires=1893456000';
	const expectedProof = {
		algorithm: 'SHA-256',
		challenge: createHash('sha256').update(`${salt}1234`).digest('hex'),
		number: 1234,
		salt,
		signature: 'offline-signature'
	};
	expect(proof).toMatchObject(expectedProof);
	await expect(page.getByRole('status')).toHaveText(en.newsletter.success);
	await expect(page.locator('altcha-widget input[name=altcha]')).toHaveValue('');
	expect(await page.evaluate(() => document.querySelector('altcha-widget')?.getState())).toBe('unverified');
	expect(challengeOrigin).toBe(new URL(page.url()).origin);
	expect(
		workers.some(
			(url) =>
				new URL(url).origin === new URL(page.url()).origin && workerPath.test(new URL(url).pathname)
		)
	).toBe(true);
	await page.evaluate(() =>
		window.dispatchEvent(new PageTransitionEvent('pageshow', { persisted: true }))
	);
	await expect(page.locator('input[name="l"]').nth(0)).not.toBeChecked();
	await expect(page.locator('input[name="l"]').nth(1)).not.toBeChecked();
	await expect(submit).toBeEnabled();
	await page.getByLabel('Email address').fill('hello@example.com');
	await page.locator('input[name="l"]').first().check();
	await submit.click();
	await expect
		.poll(() => traffic.listmonk.filter(({ method }) => method === 'POST').length)
		.toBe(2);
	const restoredBody = new URLSearchParams(
		traffic.listmonk.filter(({ method }) => method === 'POST')[1].body ?? ''
	);
	const restoredPayload = restoredBody.get('altcha');
	expect(restoredPayload).toBeTruthy();
	expect(JSON.parse(Buffer.from(restoredPayload ?? '', 'base64').toString('utf8'))).toMatchObject(
		{ ...expectedProof, salt: 'abc2?expires=1893456000',
			challenge: createHash('sha256').update('abc2?expires=18934560001234').digest('hex') }
	);
	expect(cspViolations).toEqual([]);
});
test('the story image is the preloaded LCP image without duplicate requests', { tag: '@webkit' }, async ({ page }) => {
	await page.setViewportSize({ width: 402, height: 874 });
	/** @type {string[]} */
	const imageRequests = [];
	page.on('request', (request) => {
		if (/\/newsletter-story-\d+\.[a-f0-9]{16}\.(?:avif|webp)$/.test(new URL(request.url()).pathname))
			imageRequests.push(request.url());
	});
	await page.goto('/newsletter');
	const image = page.locator('.newsletter-story img');
	await expect(image).toHaveAttribute('loading', 'eager');
	await expect(image).toHaveAttribute('fetchpriority', 'high');
	await expect(image).toHaveAttribute('width', '1080');
	await expect(image).toHaveAttribute('height', '650');
	const sources = page.locator('.newsletter-story source');
	await expect(sources).toHaveCount(2);
	const expectedSizes =
		'(min-width: 66rem) 32.75rem, (min-width: 48rem) calc(52.07vw - 1.562rem), (max-width: 639px) and (max-height: 44rem) 10rem, (max-width: 399px) and (min-height: 44.0625rem) clamp(10rem, calc(140vh - 51.35rem), min(100vw, 21rem)), (min-width: 25rem) and (max-width: 639px) and (min-height: 44.0625rem) clamp(10rem, calc(140vh - 51.35rem), 100vw), (min-width: 25rem) 100vw, (min-width: 22rem) 22rem, 100vw';
	for (const source of await sources.all()) {
		await expect(source).toHaveAttribute('sizes', expectedSizes);
		await expect(source).toHaveAttribute('srcset', /480w,.*768w,.*1080w/);
	}
	const preload = page.locator('link[rel="preload"][as="image"][fetchpriority="high"]');
	await expect(preload).toHaveCount(1);
	const avifSource = sources.first();
	const avifSrcset = await avifSource.getAttribute('srcset');
	const avifSizes = await avifSource.getAttribute('sizes');
	assert.ok(avifSrcset && avifSizes);
	await expect(preload).toHaveAttribute('imagesrcset', avifSrcset);
	await expect(preload).toHaveAttribute('imagesizes', avifSizes);
	await expect
		.poll(() =>
			image.evaluate((element) => (element instanceof HTMLImageElement ? element.naturalWidth : 0))
		)
		.toBeGreaterThan(0);
	await expect.poll(() => imageRequests.length).toBe(1);
	// WebKit advertises the LCP entry type but does not emit a passive-load entry.
	if (test.info().project.name !== 'newsletter-webkit') {
		const lcp = await page.evaluate(
			() =>
				new Promise((resolve) => {
					/** @type {{className:string,url:string}|null} */
					let latest = null;
					const observer = new PerformanceObserver((list) => {
						const entry = /** @type {(PerformanceEntry & {element?:Element|null,url?:string})|undefined} */ (
							list.getEntries().at(-1)
						);
						if (entry?.element)
							latest = {
								className:
									entry.element instanceof HTMLImageElement ? entry.element.className : '',
								url: entry.url ?? ''
							};
					});
					observer.observe({ type: 'largest-contentful-paint', buffered: true });
					window.setTimeout(() => {
						observer.disconnect();
						resolve(latest ?? null);
					}, 100);
				})
		);
		assert.ok(lcp);
		expect(lcp.className).toContain('newsletter-story__image');
		const selectedSource = await image.evaluate((element) =>
			element instanceof HTMLImageElement ? element.currentSrc : ''
		);
		if (lcp.url) expect(new URL(lcp.url).pathname).toBe(new URL(selectedSource).pathname);
	}
	expect(await page.locator('.newsletter-story').evaluate((element) => getComputedStyle(element).maskImage)).toBe('none');
	await page.setViewportSize({ width: 1280, height: 800 });
	const desktopHeading = await page.locator('.newsletter-intro h1').boundingBox();
	const desktopArt = await page.locator('.newsletter-story').boundingBox();
	assert.ok(desktopHeading && desktopArt);
	expect(desktopHeading.x).toBeGreaterThan(desktopArt.x);
	await expect
		.poll(() =>
			image.evaluate((element) => (element instanceof HTMLImageElement ? element.currentSrc : ''))
		)
		.toMatch(/newsletter-story-\d+\.[a-f0-9]{16}\.avif$/);
});

test('the newsletter uses the approved intro and compact magenta signup action', async ({ page }) => {
	await page.setViewportSize({ width: 1440, height: 900 });
	await page.goto('/newsletter');
	const content = page.locator('.newsletter-page');
	const intro = page.locator('.newsletter-intro');
	const heading = page.locator('.newsletter-intro h1');
	expect((await content.boundingBox())?.width).toBe(1056);
	expect((await intro.boundingBox())?.x).toBeGreaterThan(600);
	expect(await heading.evaluate((element) => getComputedStyle(element).fontSize)).toBe('76px');
	await expect(intro.locator('p')).toHaveText(en.newsletter.intro);
	const region = page.getByRole('region', { name: en.newsletter.formRegion });
	const form = region.locator('.newsletter-form');
	await expect(form).toHaveCount(1);
	await expect(page.locator('.newsletter-form')).toHaveCount(1);
	await expect(form.getByRole('group', { name: en.newsletter.whatTitle })).toBeVisible();
	await expect(form.getByRole('link', { name: en.newsletter.privacyLink })).toHaveAttribute('href', '/privacy#newsletter');
	const formOrder = await form.evaluate((element) => {
		const email = element.querySelector('.email-field');
		const lists = element.querySelector('.newsletter-lists');
		return !!email && !!lists && !!(email.compareDocumentPosition(lists) & Node.DOCUMENT_POSITION_FOLLOWING);
	});
	expect(formOrder).toBe(true);
	const cta = form.getByRole('button', { name: en.newsletter.submit });
	await expect(cta).toBeEnabled();
	await cta.focus();
	await expect(cta).toBeFocused();
	expect(await cta.evaluate((element) => getComputedStyle(element).outlineColor)).toBe('rgb(255, 255, 255)');
	expect(await cta.evaluate((element) => getComputedStyle(element).backgroundColor)).toBe('rgb(255, 0, 255)');
	await page.emulateMedia({ forcedColors: 'active' });
	await cta.focus();
	await expect(cta).toBeFocused();
	expect(await cta.evaluate(() => matchMedia('(forced-colors: active)').matches)).toBe(true);
	expect(await cta.evaluate((element) => getComputedStyle(element).outlineColor)).not.toBe(
		'rgb(0, 240, 255)'
	);
});

test('the first phone view shows every signup control above the cookie banner', { tag: '@webkit' }, async ({
	page
}) => {
	for (const viewport of [
		{ width: 360, height: 640 },
		{ width: 375, height: 620 },
		{ width: 375, height: 704 },
		{ width: 375, height: 705 },
		{ width: 375, height: 667 },
		{ width: 390, height: 844 },
		{ width: 402, height: 700 },
		{ width: 402, height: 704 },
		{ width: 402, height: 705 },
		{ width: 402, height: 720 },
		{ width: 402, height: 721 },
		{ width: 402, height: 832 },
		{ width: 402, height: 833 },
		{ width: 402, height: 874 },
		{ width: 412, height: 915 }
	]) {
		await page.setViewportSize(viewport);
		await page.addInitScript(() => localStorage.removeItem('wd_consent_marketing'));
		await page.goto('/newsletter');
		await expect(banner(page)).toBeVisible();
		const bannerBox = await banner(page).boundingBox();
		const story = await page.locator('.newsletter-story').boundingBox();
		assert.ok(story);
		const expectedStoryWidth =
			viewport.height <= 44 * 16
				? Math.min(viewport.width, 160)
				: Math.max(
						160,
						Math.min(
							viewport.width < 400 ? Math.min(viewport.width, 336) : viewport.width,
							viewport.height * 1.4 - 821.6
						)
					);
		expect(story.width).toBeCloseTo(expectedStoryWidth, 1);
		expect(story.height).toBeCloseTo((expectedStoryWidth * 650) / 1080, 0);
		const header = page.locator('.site-header');
		await expect(header).toBeInViewport({ ratio: 1 });
		expect((await header.boundingBox())?.y).toBe(0);
		await expect(header.getByRole('link', { name: 'WEBDEPLOY', exact: true })).toBeInViewport({ ratio: 1 });
		await expect(header.locator('.site-menu-toggle')).toBeInViewport({ ratio: 1 });
		await expect(header.getByText(/^webdeploy$/i)).toBeVisible();
		await expect(header.getByText(/^newsletter$/i)).toBeVisible();
		const reservationBox = await page.locator('.consent-reservation').boundingBox();
		const checkboxes = await page.locator('input[name="l"]').all();
		const choiceBoxes = await Promise.all((await page.locator('.newsletter-choice').all()).map(label => label.boundingBox()));
		const emailBox = await page.getByLabel('Email address').boundingBox();
		const emailBorder = await page.getByLabel('Email address').evaluate((element) => getComputedStyle(element).borderTopColor);
		const choiceBorder = await page.locator('input[name="l"]').first().evaluate((element) => getComputedStyle(element).borderTopColor);
		expect(emailBorder).toBe('rgb(100, 116, 139)');
		expect(choiceBorder).toBe('rgb(100, 116, 139)');
		const submitBox = await page.getByRole('button', { name: 'Subscribe' }).boundingBox();
		assert.ok(emailBox && submitBox);
		expect(emailBox.width).toBeGreaterThan(160);
		expect(emailBox.width).toBeCloseTo(submitBox.width, 0);
		expect(submitBox.height).toBeGreaterThanOrEqual(44);
		const placeholderFits = await page.getByLabel('Email address').evaluate((element) => {
			if (!(element instanceof HTMLInputElement)) return false;
			const style = getComputedStyle(element);
			const context = document.createElement('canvas').getContext('2d');
			if (!context) return false;
			context.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
			const padding = parseFloat(style.paddingInlineStart) + parseFloat(style.paddingInlineEnd);
			return context.measureText(element.placeholder).width <= element.clientWidth - padding;
		});
		expect(placeholderFits).toBe(true);
		expect(await page.evaluate(() => window.scrollY)).toBe(0);
		assert.ok(bannerBox);
		expect(bannerBox.height).toBeLessThanOrEqual(112);
		assert.ok(reservationBox);
		expect(reservationBox.height).toBeCloseTo(bannerBox.height, 0);
		const copy = page.locator('.consent-copy');
		const copyBox = await copy.boundingBox();
		const copyLineHeight = await copy.evaluate((element) =>
			parseFloat(getComputedStyle(element).lineHeight)
		);
		assert.ok(copyBox);
		expect(copyBox.height).toBeLessThanOrEqual(copyLineHeight * 2);
		expect(checkboxes).toHaveLength(2);
		expect(choiceBoxes).toHaveLength(2);
		for (const [name, box] of /** @type {const} */ ([
			...choiceBoxes.map((box, index) => /** @type {const} */ ([`checkbox ${index + 1}`, box])),
			['email', emailBox],
			['submit', submitBox]
		])) {
			assert.ok(box);
			expect(box.x).toBeGreaterThanOrEqual(0);
			expect(box.x + box.width).toBeLessThanOrEqual(viewport.width);
			expect(box.y).toBeGreaterThanOrEqual(0);
			expect(box.y + box.height, name).toBeLessThanOrEqual(bannerBox.y);
			expect(await page.evaluate(({x,y}) => {
				const target = document.elementFromPoint(x,y);
				return !!target?.closest('.newsletter-choice, #newsletter-email, .newsletter-submit');
			}, {x:box.x + box.width / 2, y:box.y + box.height / 2})).toBe(true);
		}
		const buttons = await banner(page).getByRole('button').all();
		const buttonWidths = await Promise.all(
			buttons.map(async (button) => (await button.boundingBox())?.width ?? NaN)
		);
		expect(buttons).toHaveLength(2);
		expect(buttonWidths[0]).toBeCloseTo(buttonWidths[1], 0);
		expect(await banner(page).getByRole('button', { name: 'Reject' }).count()).toBe(1);
		expect(await banner(page).getByRole('button', { name: 'Accept' }).count()).toBe(1);
		await expect(banner(page)).toHaveAccessibleName('Privacy & cookies');
		await expect(banner(page).getByRole('heading', { name: 'Privacy & cookies', level: 2 })).toHaveCount(1);
		await page.getByLabel('Email address').focus();
		await expect(banner(page)).toBeHidden();
		await page.getByRole('button', { name: 'Subscribe' }).scrollIntoViewIfNeeded();
		const reachableSubmit = await page.getByRole('button', { name: 'Subscribe' }).boundingBox();
		assert.ok(reachableSubmit);
		expect(reachableSubmit.y).toBeGreaterThanOrEqual(0);
		expect(reachableSubmit.y + reachableSubmit.height).toBeLessThanOrEqual(viewport.height);
		expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
			viewport.width
		);
	}
});
test('the phone menu keeps its last link above the consent banner and restores focus', { tag: '@webkit' }, async ({ page }) => {
	await page.setViewportSize({ width: 360, height: 640 });
	await page.goto('/newsletter');
	await expect(banner(page)).toBeVisible();
	const toggle = page.locator('.site-menu-toggle');
	await toggle.click();
	await expect(toggle).toHaveAttribute('aria-expanded', 'true');
	const menu = page.locator('#mobile-menu');
	await expect(menu).toBeVisible();
	await menu.getByRole('button', { name: 'Services' }).click();
	const last = menu.getByRole('link').last();
	await last.focus();
	await expect(last).toBeFocused();
	await last.click({ trial: true });
	const linkBox = await last.boundingBox();
	const bannerBox = await banner(page).boundingBox();
	assert.ok(linkBox && bannerBox);
	expect(linkBox.y + linkBox.height).toBeLessThanOrEqual(bannerBox.y);
	await last.press('Escape');
	await expect(menu).toBeHidden();
	await expect(toggle).toHaveAttribute('aria-expanded', 'false');
	await expect(toggle).toBeFocused();
});

for (const { width, height } of [{ width: 360, height: 640 }, { width: 375, height: 620 }]) {
	test(`Subscribe stays above the banner at ${width}x${height} while web fonts load`, { tag: '@webkit' }, async ({ page }) => {
		await page.setViewportSize({ width, height });
		let releaseFonts = () => {};
		/** @type {Promise<void>} */
		const held = new Promise((resolve) => { releaseFonts = resolve; });
		await page.route(/\.woff2$/, async (route) => {
			await held;
			await route.continue();
		});
		const submit = page.getByRole('button', { name: 'Subscribe' });
		let before;
		try {
			await page.goto('/newsletter', { waitUntil: 'domcontentloaded' });
			await expect(banner(page)).toBeVisible();
			before = await submit.boundingBox();
			assert.ok(before);
			const bannerBox = await banner(page).boundingBox();
			assert.ok(bannerBox);
			expect(await page.evaluate(() => scrollY)).toBe(0);
			expect(before.y).toBeGreaterThanOrEqual(0);
			expect(before.y + before.height).toBeLessThanOrEqual(bannerBox.y);
		} finally {
			releaseFonts();
		}
		await page.evaluate(async () => { await document.fonts.ready; });
		const documentTop = async (/** @type {{ y: number }} */ box) =>
			box.y + (await page.evaluate(() => window.scrollY));
		const beforeTop = await documentTop(before);
		const after = await submit.boundingBox();
		assert.ok(after);
		expect(await documentTop(after)).toBeCloseTo(beforeTop, 0);
		await page.getByLabel('Email address').focus();
		await expect(banner(page)).toBeHidden();
		await submit.scrollIntoViewIfNeeded();
		const reachable = await submit.boundingBox();
		assert.ok(reachable);
		expect(reachable.y).toBeGreaterThanOrEqual(0);
		expect(reachable.y + reachable.height).toBeLessThanOrEqual(height);
	});
}
test('each card labels one independent checkbox and signup details open by keyboard', { tag: '@webkit' }, async ({ page }) => {
	await page.goto('/newsletter');
	const copy = en.newsletter;
	const submit = page.getByRole('button', { name: copy.submit });
	await expect(submit).toBeEnabled();
	const group = page.getByRole('group', { name: copy.whatTitle });
	const news = group.getByRole('checkbox', { name: copy.generalText, exact: true });
	const services = group.getByRole('checkbox', { name: copy.marketingText, exact: true });
	await expect(news).toHaveCSS('appearance', 'none');
	await expect(news).not.toBeChecked();
	await expect(services).not.toBeChecked();
	await group.getByText(copy.generalText, { exact: true }).click();
	await expect(news).toBeChecked();
	const newsLabel = group.getByText(copy.generalText, { exact: true });
	await newsLabel.hover();
	await expect(news).toHaveCSS('border-top-color', 'rgb(0, 240, 255)');
	await expect(services).not.toBeChecked();
	const email = page.getByLabel(copy.emailLabel);
	await email.focus();
	await email.press('Tab');
	await expect(news).toBeFocused();
	await expect(news).toHaveCSS('outline-style', 'solid');
	await news.press('Tab');
	await expect(services).toBeFocused();
	await services.press('Space');
	await expect(services).toBeChecked();
	expect(await services.evaluate(el => getComputedStyle(el, '::after').borderBottomColor)).toBe('rgb(0, 240, 255)');
	await expect(news).toBeChecked();
	await services.press('Tab');
	await expect(submit).toBeFocused();

	const form = page.locator('form');
	const confirmation = form.getByText(copy.confirmationNote, { exact: true });
	await expect(confirmation).toBeHidden();
	await expect(form.getByRole('link', { name: copy.privacyLink })).toHaveAttribute('href', '/privacy#newsletter');
	const summary = form.locator('summary');
	await summary.press('Enter');
	for (const note of [copy.confirmationNote, copy.servicesNote, copy.withdrawalNote, copy.controllerNote])
		await expect(form.getByText(note, { exact: true })).toBeVisible();
	await expect(form.getByText(copy.newsNote, { exact: false })).toBeVisible();
	await summary.press('Space');
	await expect(confirmation).toBeHidden();

	await news.evaluate(input => { input.setAttribute('disabled', ''); });
	await expect(news).toBeDisabled();
	await expect(news).toHaveCSS('cursor', 'not-allowed');
});
test('forced colors restore native checkboxes', { tag: '@webkit' }, async ({ page }) => {
	await page.emulateMedia({ forcedColors: 'active' });
	test.skip(
		!await page.evaluate(() => matchMedia('(forced-colors: active)').matches),
		'This browser does not emulate forced colors.'
	);
	await page.goto('/newsletter');
	const services = page.getByRole('checkbox', { name: en.newsletter.marketingText });
	await expect(services).toHaveCSS('appearance', 'auto');
	await services.check();
	await expect(services).toBeChecked();
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
				page.locator(selector).evaluate((element) => {
					const rect = element.getBoundingClientRect();
					const round = (/** @type {number} */ value) => Math.round(value * 100) / 100;
					return {
						x: round(rect.x),
						y: round(rect.y + window.scrollY),
						width: round(rect.width),
						height: round(rect.height)
					};
				})
			)
		);
	const before = await layout();
	await page.getByLabel('Email address').focus();
	await expect(banner(page)).toBeHidden();
	await expect(page.locator('.consent-reservation')).toHaveCount(1);
	await page.getByLabel('Email address').evaluate((input) => input.blur());
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
for (const selected of [[LIST_NEWS], [LIST_MARKETING], [LIST_NEWS, LIST_MARKETING]]) {
	test(`${selected.join('+')} selected list${selected.length === 1 ? '' : 's'} posts one repeated l field per choice`, async ({
		page,
		traffic
	}) => {
		await prepareForm(page);
		for (const list of selected) await page.locator(`input[name="l"][value="${list}"]`).check();
		await page.getByRole('button', { name: 'Subscribe' }).click();
		await expect
			.poll(() => traffic.listmonk.filter(({ method }) => method === 'POST').length)
			.toBe(1);
		const request = traffic.listmonk.find(({ method }) => method === 'POST');
		assert.ok(request);
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
test('Matomo counts an accepted signup and Meta Lead requires marketing consent', async ({
	page,
	traffic
}) => {
	await prepareForm(page);
	await page.locator('input[name="l"]').first().check();
	await banner(page).getByRole('button', { name: 'Reject' }).click();
	await page.getByRole('button', { name: 'Subscribe' }).click();
	await expect(page.getByRole('status')).toHaveText(en.newsletter.success);
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
	await expect(page.getByRole('status')).toHaveText(en.newsletter.success);
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
		/** @type {import("../types.d.ts").AnalyticsCommand[]} */
		const calls = [];
		window._paq = [];
		window._paq.push = (...items) => {
			calls.push(...items);
			localStorage.setItem('test-matomo-queue', JSON.stringify(calls));
			return Array.prototype.push.apply(window._paq, items);
		};
	});
	await page.goto('/newsletter/confirmed');
	await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, follow');
	const confirmedEvent = () =>
		page.evaluate(() =>
			/** @type {unknown[][]} */ (
				JSON.parse(localStorage.getItem('test-matomo-queue') ?? '[]')
			).some((item) => item[0] === 'trackEvent' && item[2] === 'newsletter_confirmed')
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
/** @param {import('axe-core').AxeResults} results @returns {string[]} */
function evaluatedRuleIds(results) {
	const rules = [
		...results.passes,
		...results.violations,
		...results.incomplete,
		...results.inapplicable
	];
	return [...new Set(rules.map((rule) => rule.id))].sort();
}

test('newsletter page and visible consent banner have no axe violations', async ({ page }, info) => {
	test.setTimeout(60_000);
	await page.goto('/newsletter');
	await expect(page.getByRole('button', { name: 'Subscribe' })).toBeEnabled();
	await expect(banner(page)).toBeVisible();
	await page.evaluate(async () => {
		await document.fonts.ready;
	});

	const pending = await new AxeBuilder({ page }).analyze();
	expect(pending.violations).toEqual([]);
	expect(pending.incomplete.filter((rule) => rule.id === 'color-contrast')).toEqual([]);
	await expect(banner(page)).toBeVisible();
	expect(await page.evaluate(() => localStorage.getItem('wd_consent_marketing'))).toBeNull();

	await banner(page).getByRole('button', { name: 'Reject' }).click();
	await expect(banner(page)).toBeHidden();
	await page.locator('form summary').click();
	const dismissed = await new AxeBuilder({ page }).analyze();
	expect(dismissed.violations).toEqual([]);
	const rules = evaluatedRuleIds(pending);
	expect(pending.passes.map((rule) => rule.id)).toContain('color-contrast');
	expect(rules).toEqual(evaluatedRuleIds(dismissed));
	await info.attach('axe-rule-coverage', {
		body: JSON.stringify({ engine: pending.testEngine, defaultRulesInBothStates: rules }),
		contentType: 'application/json'
	});
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
		await expect(page.locator('.site-header .newsletter-brand')).toHaveCount(0);
	}
});
test('accepted POST announces success, moves focus, clears the form and tracks exactly once', async ({ page }) => {
	await prepareForm(page);
	const bothLists = page.locator('input[name=l]');
	await bothLists.nth(0).check();
	await bothLists.nth(1).check();
	const pixel = page.waitForResponse(/connect\.facebook\.net\/en_US\/fbevents\.js/);
	await banner(page).getByRole('button', { name: 'Accept' }).click();
	await pixel;
	await page.waitForLoadState('networkidle');
	const counts = () => page.evaluate(() => ({
		matomo: (window._paq ?? []).filter((row) => row[2] === 'newsletter_submit_initiated').length,
		meta: (window.fbq?.queue ?? []).filter((row) => row[1] === 'Lead').length
	}));
	let release = () => {};
	const hold = new Promise(resolve => { release = () => resolve(undefined); });
	let posts = 0;
	await page.route(endpoint, async (route) => {
		posts++;
		await hold;
		await route.fulfill({
			status: 200, contentType: 'text/html', headers: {
				'access-control-allow-origin': new URL(page.url()).origin, vary: 'Origin'
			}, body: '<p>An e-mail has been sent to you to confirm your subscription(s).</p>'
		});
	});
	const post = page.waitForRequest(endpoint);
	const submit = page.locator('button[type=submit]');
	await submit.click();
	try {
		const request = await post;
		expect(request.method()).toBe('POST');
		expect(request.resourceType()).toBe('fetch');
		expect(request.headers()['content-type']).toMatch(/^application\/x-www-form-urlencoded/i);
		expect(request.headers()['cookie']).toBeUndefined();
		await expect(submit).toBeDisabled();
		await page.evaluate(() => document.forms[0].requestSubmit());
		expect(await counts()).toEqual({ matomo: 0, meta: 0 });
	} finally {
		release();
	}
	const status = page.getByRole('status');
	await expect(status).toHaveText(en.newsletter.success);
	await expect(status).toBeFocused();
	await expect(page).toHaveURL(/\/newsletter$/);
	await expect(page.getByLabel('Email address')).toHaveValue('');
	await expect(bothLists.nth(0)).not.toBeChecked();
	await expect(bothLists.nth(1)).not.toBeChecked();
	await expect(page.locator('input[type=hidden][name=altcha]')).toHaveValue('');
	await expect(submit).toBeEnabled();
	expect(posts).toBe(1);
	expect(await counts()).toEqual({ matomo: 1, meta: 1 });
	expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
});

for (const [status, message] of /** @type {const} */ ([
	[400, 'No valid lists selected to subscribe.'], [400, 'Invalid CAPTCHA.'], [400, 'Invalid email.'],
	[400, 'E-mail domain is blocklisted.'],
	[404, 'Public subscription disabled.'], [429, 'Too Many Requests'],
	[500, 'Error processing request.'], [502, 'Invalid feature.']
])) {
	test(`HTTP ${status} (${message}) keeps the form and permits retry`, async ({ page }) => {
		await prepareForm(page);
		const boxes = page.locator('input[name=l]');
		await boxes.nth(0).check();
		await boxes.nth(1).check();
		let posts = 0;
		await page.route(endpoint, route => route.fulfill({
			status: ++posts === 1 ? status : 200,
			contentType: 'text/html',
			headers: { 'access-control-allow-origin': new URL(page.url()).origin, vary: 'Origin' },
			body: posts === 1 ? '<p>' + message + '</p>' : '<p>Subscribed successfully.</p>'
		}));
		const submit = page.getByRole('button', { name: 'Subscribe' });
		await submit.click();
		const error = page.locator('[data-submit-error]');
		await expect(error).toHaveText(status === 429 ? en.newsletter.rateLimitError : en.newsletter.requestError);
		await expect(error).toBeFocused();
		await expect(page.getByRole('status')).toBeEmpty();
		await expect(page.getByLabel('Email address')).toHaveValue('hello@example.com');
		await expect(boxes.nth(0)).toBeChecked();
		await expect(boxes.nth(1)).toBeChecked();
		await expect(page.locator('input[name=altcha]')).toHaveValue('');
		await expect(submit).toBeEnabled();
		expect(await page.evaluate(() => (window._paq ?? []).some(row => row[2] === 'newsletter_submit_initiated'))).toBe(false);
		if (status === 429) expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
		await submit.click();
		await expect(page.getByRole('status')).toHaveText(en.newsletter.success);
		await expect(page.locator('[data-submit-error]')).toBeHidden();
		expect(posts).toBe(2);
	});
}

for (const upstreamStatus of [200, 502]) {
	test(`HTTP ${upstreamStatus} without CORS leaves the result unknown after exactly one POST`, async ({ page, browserName, context, baseURL }) => {
		// Playwright supplies ACAO on cross-origin route.fulfill responses. Let the browser
		// contact a loopback server so the POST arrives but its response is unreadable.
		/** @type {URLSearchParams[]} */
		const bodies = [];
		const server = createServer(async (req, res) => {
			const chunks = [];
			for await (const chunk of req) chunks.push(chunk);
			bodies.push(new URLSearchParams(Buffer.concat(chunks).toString()));
			res.writeHead(upstreamStatus, { 'content-type': 'text/html' }).end('<strong>Remote service message</strong>');
		});
		await new Promise((resolve, reject) => server.once('error', reject).listen(0, '127.0.0.1', () => resolve(undefined)));
		const address = server.address();
		assert.ok(address && typeof address === 'object');
		const standIn = `http://127.0.0.1:${address.port}`;
		try {
			if (browserName === 'chromium') {
				// Chromium assigns a fulfilled test document the public address space.
				await context.grantPermissions(['local-network-access'], { origin: new URL(baseURL ?? '').origin });
			}
			await page.route('**/newsletter', async route => {
				const response = await route.fetch();
				const headers = response.headers();
				headers['content-security-policy'] = headers['content-security-policy'].replaceAll(
					new URL(endpoint).origin, new URL(endpoint).origin + ' ' + standIn
				);
				await route.fulfill({ response, headers });
			});
			await prepareForm(page);
			const action = standIn + '/subscription/form';
			await page.evaluate((url) => { document.forms[0].action = url; }, action);
			const boxes = page.locator('input[name=l]');
			await boxes.nth(0).check();
			await boxes.nth(1).check();
			const pixel = page.waitForResponse(/connect\.facebook\.net\/en_US\/fbevents\.js/);
			await banner(page).getByRole('button', {name:'Accept'}).click();
			await pixel;
			await page.waitForLoadState('networkidle');
			/** @type {string[]} */
			const modes = [];
			await page.route(action, route => {
				modes.push(route.request().resourceType());
				return route.continue();
			});
			const submit = page.getByRole('button', {name:'Subscribe'});
			await submit.click();
			await expect(page.locator('[data-submit-error]')).toHaveText(en.newsletter.unknownResult);
			await expect(page.locator('[data-submit-error]')).toBeFocused();
			await page.waitForLoadState('networkidle');
			await expect(page).toHaveURL(/\/newsletter$/);
			expect(modes).toEqual(['fetch']);
			expect(bodies).toHaveLength(1);
			expect(bodies[0].get('email')).toBe('hello@example.com');
			expect(bodies[0].getAll('l')).toEqual([LIST_NEWS, LIST_MARKETING]);
			expect(bodies[0].get('nonce')).toBe('');
			expect(bodies[0].get('altcha')).toBeTruthy();
			await expect(page.getByText('Remote service message')).toHaveCount(0);
			await expect(page.getByLabel('Email address')).toHaveValue('hello@example.com');
			await expect(boxes.nth(0)).toBeChecked();
			await expect(boxes.nth(1)).toBeChecked();
			await expect(submit).toBeEnabled();
			expect(await page.evaluate(() => ({
				matomo: (window._paq ?? []).filter(row => row[2] === 'newsletter_submit_initiated'),
				leads: (window.fbq?.queue ?? []).filter(row => row[1] === 'Lead')
			}))).toEqual({ matomo: [], leads: [] });
		} finally {
			await new Promise(resolve => server.close(resolve));
		}
	});
}

test('a lost connection permits another POST only after an explicit retry', async ({ page }) => {
	await prepareForm(page);
	await page.locator('input[name=l]').first().check();
	let posts = 0;
	await page.route(endpoint, route => {
		if (++posts === 1) return route.abort();
		return route.fulfill({
			status: 200, contentType: 'text/html',
			headers: { 'access-control-allow-origin': new URL(page.url()).origin, vary: 'Origin' },
			body: '<p>Remote service message</p>'
		});
	});
	const submit = page.getByRole('button', {name:'Subscribe'});
	await submit.click();
	const error = page.locator('[data-submit-error]');
	await expect(error).toHaveText(en.newsletter.unknownResult);
	await expect(error).toBeFocused();
	await expect(page.getByLabel('Email address')).toHaveValue('hello@example.com');
	await page.waitForLoadState('networkidle');
	expect(posts).toBe(1);
	await submit.click();
	await expect(page.getByRole('status')).toHaveText(en.newsletter.success);
	await expect(page.getByText('Remote service message')).toHaveCount(0);
	expect(posts).toBe(2);
});

test('a held signup POST times out after 20 seconds and keeps the form without reposting', async ({ page }) => {
	test.setTimeout(45_000);
	await prepareForm(page);
	const choice = page.locator('input[name=l]').first();
	await choice.check();
	/** @type {string[]} */
	const requests = [];
	await page.route(endpoint, route => {
		// Leave the real fetch pending until its own signal aborts it.
		requests.push(route.request().resourceType());
	});
	const started = page.waitForRequest(endpoint);
	const submit = page.locator('button[type=submit]');
	await submit.click();
	await started;
	const start = performance.now();
	await expect(submit).toBeDisabled();
	const error = page.locator('[data-submit-error]');
	await expect(error).toHaveText(en.newsletter.unknownResult, { timeout: 28_000 });
	expect(performance.now() - start).toBeGreaterThanOrEqual(19_000);
	await expect(error).toBeFocused();
	await expect(page.getByLabel('Email address')).toHaveValue('hello@example.com');
	await expect(choice).toBeChecked();
	await expect(page.locator('input[name=altcha]')).toHaveValue('');
	await expect(submit).toBeEnabled();
	await expect(page).toHaveURL(/\/newsletter$/);
	expect(requests).toEqual(['fetch']);
	expect(await page.evaluate(() => (window._paq ?? []).some(row => row[2] === 'newsletter_submit_initiated'))).toBe(false);
});

test('native transport chosen before dispatch posts once, records events and restores choices on Back', async ({ page }) => {
	await prepareForm(page);
	const boxes = page.locator('input[name=l]');
	await boxes.nth(0).check();
	await boxes.nth(1).check();
	const pixel = page.waitForResponse(/connect\.facebook\.net\/en_US\/fbevents\.js/);
	await banner(page).getByRole('button', {name:'Accept'}).click();
	await pixel;
	await page.waitForLoadState('networkidle');
	await page.evaluate(() => {
		Object.defineProperty(window, 'fetch', { configurable: true, value: undefined });
		document.forms[0].addEventListener('formdata', () => {
			sessionStorage.setItem('native-signup-events', JSON.stringify({
				matomo: (window._paq ?? []).filter(row => row[2] === 'newsletter_submit_initiated'),
				meta: (window.fbq?.queue ?? []).filter(row => row[1] === 'Lead')
			}));
		});
	});
	let posts = 0;
	await page.route(endpoint, route => {
		posts++;
		expect(route.request().method()).toBe('POST');
		expect(route.request().isNavigationRequest()).toBe(true);
		const data = new URLSearchParams(route.request().postData() ?? '');
		expect(data.getAll('l')).toEqual([LIST_NEWS, LIST_MARKETING]);
		expect(data.get('email')).toBe('hello@example.com');
		expect(data.get('nonce')).toBe('');
		expect(data.get('altcha')).toBeTruthy();
		return route.fulfill({ contentType:'text/html', body:'<p>Check your inbox</p>' });
	});
	await page.getByRole('button', {name:'Subscribe'}).click();
	await expect(page).toHaveURL(endpoint);
	expect(posts).toBe(1);
	await page.goBack();
	await expect(page).toHaveURL(/\/newsletter$/);
	expect(await page.evaluate(() => JSON.parse(sessionStorage.getItem('native-signup-events') ?? 'null'))).toEqual({
		matomo:[['trackEvent','Newsletter','newsletter_submit_initiated']],
		meta:[['track','Lead',{content_name:'newsletter'}]]
	});
	await expect(page.getByRole('button', {name:'Subscribe'})).toBeEnabled();
	await expect(boxes.nth(0)).not.toBeChecked();
	await expect(boxes.nth(1)).not.toBeChecked();
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
	await expect(notice).toContainText('legal@pec.webdeploy.it');
	await expect(notice).toContainText('EU-US Data Privacy Framework');
	await expect(page.locator('body')).toContainText('does not use it for retargeting');
	for (const placeholder of [
		'counsel',
		'to be confirmed',
		'Draft for review',
		'not been approved'
	]) {
		await expect(page.locator('body')).not.toContainText(placeholder);
	}
});
