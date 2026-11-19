// @ts-check
// SPDX-FileCopyrightText: 2026 WEBDEPLOY S.R.L.
// SPDX-License-Identifier: AGPL-3.0-only
import AxeBuilder from '@axe-core/playwright';
import { expect, test } from './fixtures.mjs';
import { sitemapPaths } from './routes.mjs';
const paths = [...sitemapPaths(), '/newsletter/confirmed'];
test('the sitemap is not empty', () => {
	expect(paths.length).toBeGreaterThan(5);
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
