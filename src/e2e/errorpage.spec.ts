import { expect, test } from './fixtures';

// The status code comes from nginx, so this needs the container:
//   E2E_BASE_URL=http://127.0.0.1:18080 npx playwright test errorpage
test.skip(!process.env.E2E_BASE_URL, 'needs the nginx container (E2E_BASE_URL)');

test('an unknown path answers 404 with the site error page', async ({ page, traffic }) => {
	void traffic;
	const response = await page.goto('/this-page-does-not-exist');
	expect(response?.status()).toBe(404);
	await expect(page.locator('h1')).toHaveText('Page Not Found');
	await expect(page.getByRole('link', { name: 'Return Home' })).toBeVisible();
	await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex');
	// The header and footer of the site are around it.
	await expect(page.getByRole('contentinfo')).toBeVisible();
});
