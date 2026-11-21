// @ts-check
// SPDX-FileCopyrightText: 2026 WEBDEPLOY S.R.L.
// SPDX-License-Identifier: AGPL-3.0-only
import AxeBuilder from '@axe-core/playwright';
import { expect, test } from './fixtures.mjs';
import { sitemapPaths } from './routes.mjs';
const paths = [...sitemapPaths(), '/newsletter/confirmed'];
test('the production sitemap is well-formed XML and lists the expected canonical locations', async ({ page, request }) => {
	const response = await request.get('/sitemap.xml');
	expect(response.status()).toBe(200);
	const parsed = await page.evaluate((text) => {
		const xml = new DOMParser().parseFromString(text, 'application/xml');
		return {
			error: xml.querySelector('parsererror')?.textContent ?? null,
			root: xml.documentElement.localName,
			namespace: xml.documentElement.namespaceURI,
			locations: Array.from(xml.getElementsByTagNameNS('*', 'loc'), (node) => node.textContent)
		};
	}, await response.text());
	expect(parsed.error).toBeNull();
	expect(parsed.root).toBe('urlset');
	expect(parsed.namespace).toBe('http://www.sitemaps.org/schemas/sitemap/0.9');
	expect(parsed.locations).toEqual(sitemapPaths().map((path) => 'https://webdeploy.it' + path));
});
for (const path of paths) {
	test.describe(path, () => {
		test.beforeEach(async ({ page }) => {
			await page.addInitScript(() => localStorage.setItem('wd_consent_marketing', 'denied'));
		});
		test('loads with one h1, a title, a canonical link and a clean console', async ({
			page,
			traffic,
			consoleProblems
		}) => {
			void traffic;
			const response = await page.goto(path);
			expect(response?.status()).toBe(200);
			await expect(page.locator('h1')).toHaveCount(1);
			await expect(page.locator('h1')).toBeVisible();
			await expect(page).toHaveTitle(/\S/);
			await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
				'href',
				`https://webdeploy.it${path}`
			);
			await expect(page.locator('html')).toHaveAttribute('lang', 'en');
			await expect(page.locator('meta[name=description]')).toHaveAttribute('content', /\S/);
			// Let enhancement modules and analytics finish before reading the console.
			await page.waitForLoadState('networkidle');
			expect(consoleProblems).toEqual([]);
		});
		test('has no accessibility violations', async ({ page, traffic }) => {
			void traffic;
			await page.goto(path);
			await page.waitForLoadState('networkidle');
			const { violations } = await new AxeBuilder({ page }).analyze();

			expect(
				violations.map((v) => `${v.id} (${v.impact}): ${v.nodes.map((n) => n.target).join(' | ')}`)
			).toEqual([]);
		});
	});
}
test('the home page with consent pending has no WCAG violations', async ({ page, traffic }) => {
	void traffic;
	// Each test starts in a fresh browser context with undecided consent.
	await page.goto('/');
	await expect(page.getByRole('complementary', { name: 'Privacy & cookies' })).toBeVisible();
	await page.waitForLoadState('networkidle');
	await page.evaluate(async () => {
		await document.fonts.ready;
	});
	// Preserve the existing whole-document WCAG checks with the banner open.
	// The newsletter test scans all default rules with this banner beside the form.
	const wholePage = await new AxeBuilder({ page })
		.withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
		.analyze();

	expect(wholePage.violations.map((v) => v.id)).toEqual([]);
});

for (const [width, dpr] of [[1280, 1], [1280, 2], [767, 2], [390, 3]]) {
	test.describe(`news thumbnails at ${width}px and DPR ${dpr}`, () => {
		test.use({ viewport: { width, height: 900 }, deviceScaleFactor: dpr });
		test('loads a 16:9 candidate up to the master width and reuses its preload', async ({ page }) => {
			const requests = new Set();
			page.on('request', request => {
				if (request.url().includes('php2shell-card-')) requests.add(request.url());
			});
			await page.goto('/news');
			const images = page.locator('.news-card__image');
			await expect(images).toHaveCount(2);
			for (const image of await images.all()) {
				await image.scrollIntoViewIfNeeded();
				const { slot, height, source, masterWidth } = await image.evaluate(async node => {
					if (!(node instanceof HTMLImageElement)) throw new Error('Expected a card image');
					await node.decode();
					return {
						slot: node.clientWidth, height: node.clientHeight, source: node.currentSrc,
						masterWidth: Number(node.getAttribute('width'))
					};
				});
				const candidate = /-card-(\d+)\.[a-f0-9]+\.avif$/.exec(source);
				expect(candidate).not.toBeNull();
				const selectedWidth = Number(candidate?.[1]);
				expect(selectedWidth).toBeLessThanOrEqual(masterWidth);
				expect(selectedWidth).toBeGreaterThanOrEqual(Math.min(slot * dpr, masterWidth));
				if (dpr > 1) expect(selectedWidth).toBe(masterWidth);
				expect(Math.abs(height - slot * 9 / 16)).toBeLessThan(1);
			}
			expect(requests.size).toBe(1);
		});
	});
}
