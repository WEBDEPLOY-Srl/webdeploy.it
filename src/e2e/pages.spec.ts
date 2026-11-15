import AxeBuilder from '@axe-core/playwright';
import { expect, test } from './fixtures';
import { sitemapPaths } from './routes';

const paths = sitemapPaths();

test('the sitemap is not empty', () => {
	expect(paths.length).toBeGreaterThan(5);
});

// A returning visitor who already answered the banner, so it does not cover the page.
test.beforeEach(async ({ page }) => {
	await page.addInitScript(() => localStorage.setItem('wd_consent_marketing', 'denied'));
});

for (const path of paths) {
	test.describe(path, () => {
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
			await expect(page.locator('html')).toHaveAttribute('lang', /^[a-z]{2}$/);
			// Let hydration, the map and analytics finish before reading the console.
			await page.waitForLoadState('networkidle');
			expect(consoleProblems).toEqual([]);
		});

		test('has no serious or critical accessibility violations', async ({ page, traffic }) => {
			void traffic;
			await page.goto(path);
			await page.waitForLoadState('networkidle');
			const { violations } = await new AxeBuilder({ page })
				.withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
				.analyze();
			const blocking = violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
			expect(
				blocking.map((v) => `${v.id} (${v.impact}): ${v.nodes.map((n) => n.target).join(' | ')}`)
			).toEqual([]);
		});
	});
}

test('the cookie banner has no serious or critical accessibility violations', async ({
	page,
	traffic
}) => {
	void traffic;
	await page.addInitScript(() => localStorage.removeItem('wd_consent_marketing'));
	await page.goto('/');
	await expect(page.getByRole('dialog')).toBeVisible();
	const { violations } = await new AxeBuilder({ page })
		.withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
		.analyze();
	const blocking = violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
	expect(
		blocking.map((v) => `${v.id} (${v.impact}): ${v.nodes.map((n) => n.target).join(' | ')}`)
	).toEqual([]);
});
