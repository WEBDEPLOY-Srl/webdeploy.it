import { expect, SECURE_TEST_HOST, test } from './fixtures';

const SECURE_ORIGIN = `https://${SECURE_TEST_HOST}`;

/**
 * The opt-out only runs on HTTPS, but the preview server speaks plain HTTP.
 * Serve the same build under an https:// origin by answering every request
 * for it from the preview server, so the page sees a real secure context.
 */
test.beforeEach(async ({ page, baseURL }) => {
	const localOrigin = new URL(baseURL ?? '').origin;
	await page.addInitScript(() => localStorage.setItem('wd_consent_marketing', 'denied'));
	await page.route(`${SECURE_ORIGIN}/**`, async (route) => {
		const path = route.request().url().slice(SECURE_ORIGIN.length);
		// The preview server refuses a Host header it does not know.
		const headers = { ...route.request().headers(), host: new URL(localOrigin).host };
		await route.fulfill({ response: await route.fetch({ url: localOrigin + path, headers }) });
	});
});

async function cookies(page: import('@playwright/test').Page) {
	return Object.fromEntries(
		(await page.context().cookies(SECURE_ORIGIN)).map((cookie) => [cookie.name, cookie])
	);
}

test('opting out sets mtm_consent_removed and opting back in clears it', async ({
	page,
	traffic
}) => {
	void traffic;
	await page.goto(`${SECURE_ORIGIN}/privacy`);
	const box = page.getByRole('checkbox');
	await expect(box).toBeChecked();
	expect(await cookies(page)).not.toHaveProperty('mtm_consent_removed');

	await box.uncheck();
	await expect(box).not.toBeChecked();
	let jar = await cookies(page);
	expect(jar).toHaveProperty('mtm_consent_removed');
	expect(jar.mtm_consent_removed.secure).toBe(true);
	expect(jar.mtm_consent_removed.sameSite).toBe('Lax');
	expect(jar).not.toHaveProperty('mtm_consent');
	await expect(page.locator('#matomo-opt-out')).toContainText('currently opted out');

	// The choice is read back from the cookie after a reload.
	await page.reload();
	await expect(page.getByRole('checkbox')).not.toBeChecked();

	await page.getByRole('checkbox').check();
	await expect(page.getByRole('checkbox')).toBeChecked();
	jar = await cookies(page);
	expect(jar).not.toHaveProperty('mtm_consent_removed');
	expect(jar).toHaveProperty('mtm_consent');
	await expect(page.locator('#matomo-opt-out')).toContainText('not opted out');
});

test('over plain HTTP the widget explains that it cannot work', async ({ page, traffic }) => {
	void traffic;
	await page.goto('/privacy');
	await expect(page.locator('#matomo-opt-out')).toContainText('not loaded over HTTPS');
	await expect(page.getByRole('checkbox')).toHaveCount(0);
});
