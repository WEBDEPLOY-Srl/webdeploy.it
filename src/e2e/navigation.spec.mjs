// @ts-check
// SPDX-FileCopyrightText: 2026 WEBDEPLOY S.R.L.
// SPDX-License-Identifier: AGPL-3.0-only
import { expect, test } from './fixtures.mjs';
test.beforeEach(async ({ page }) => {
	await page.addInitScript(() => localStorage.setItem('wd_consent_marketing', 'denied'));
});
test.describe('desktop menus by keyboard', () => {
	test.use({ viewport: { width: 1440, height: 900 } });
	for (const [name, controls, items] of /** @type {const} */ ([
		['Products', 'products-menu', 1],
		['Services', 'services-menu', 4]
	])) {
		test(`${name} menu opens, moves and closes with the keyboard`, async ({ page, traffic }) => {
			void traffic;
			await page.goto('/');
			const trigger = page.locator(`button[aria-controls="${controls}"]`);
			const menuItems = page.locator(`#${controls} [role="menuitem"]`);
			await expect(menuItems).toHaveCount(items);
			await expect(trigger).toHaveAttribute('aria-expanded', 'false');
			// ArrowDown on the trigger opens the menu and lands on the first item.
			await trigger.focus();
			await page.keyboard.press('ArrowDown');
			await expect(trigger).toHaveAttribute('aria-expanded', 'true');
			await expect(menuItems.first()).toBeFocused();
			// ArrowDown and ArrowUp move between items and wrap around.
			await page.keyboard.press('ArrowDown');
			await expect(items > 1 ? menuItems.nth(1) : menuItems.first()).toBeFocused();
			await page.keyboard.press('ArrowUp');
			await page.keyboard.press('ArrowUp');
			await expect(menuItems.last()).toBeFocused();
			// Escape closes the menu and returns focus to its trigger.
			await page.keyboard.press('Escape');
			await expect(trigger).toHaveAttribute('aria-expanded', 'false');
			await expect(trigger).toBeFocused();
		});
	}
	test('tabbing out of an open menu closes it', async ({ page, traffic }) => {
		void traffic;
		await page.goto('/');
		const trigger = page.locator('button[aria-controls="services-menu"]');
		await trigger.focus();
		await page.keyboard.press('ArrowDown');
		await expect(trigger).toHaveAttribute('aria-expanded', 'true');
		// Leave the menu through the last item, then the page's next focusable element.
		await page.locator('#services-menu [role="menuitem"]').last().focus();
		await page.keyboard.press('Tab');
		await expect(trigger).toHaveAttribute('aria-expanded', 'false');
	});
	test('a menu item navigates with Enter', async ({ page, traffic }) => {
		void traffic;
		await page.goto('/');
		const trigger = page.locator('button[aria-controls="services-menu"]');
		await trigger.focus();
		await page.keyboard.press('ArrowDown');
		// The first item leaves the site; the next one is a page of this one.
		await expect(page.locator('#services-menu [role="menuitem"]').first()).toBeFocused();
		await page.keyboard.press('ArrowDown');
		await expect(
			page.locator('#services-menu [href="/services/linux-workstations"]')
		).toBeFocused();
		await page.keyboard.press('Enter');
		await expect(page).toHaveURL(/\/services\/linux-workstations\/?$/);
	});
});
test.describe('mobile menu', () => {
	test.use({ viewport: { width: 390, height: 844 }, hasTouch: true });
	test('opens, discloses services, navigates and closes', async ({ page, traffic }) => {
		void traffic;
		await page.goto('/');
		const toggle = page.locator('button[aria-controls="mobile-menu"]');
		const menu = page.locator('#mobile-menu');
		await expect(page.locator('nav.site-nav')).toBeHidden();
		await expect(menu).toHaveCount(0);
		await toggle.click();
		await expect(toggle).toHaveAttribute('aria-expanded', 'true');
		await expect(menu).toBeVisible();
		const services = page.locator('button[aria-controls="mobile-services-menu"]');
		await expect(services).toHaveAttribute('aria-expanded', 'false');
		await services.click();
		await expect(services).toHaveAttribute('aria-expanded', 'true');
		const link = page.locator('#mobile-services-menu a[href="/services/backup"]');
		await expect(link).toBeVisible();
		// Following a link closes the menu on the new page.
		await link.click();
		await expect(page).toHaveURL(/\/services\/backup\/?$/);
		await expect(menu).toHaveCount(0);
		await expect(toggle).toHaveAttribute('aria-expanded', 'false');
		// The hamburger closes the menu again, and works from the keyboard.
		await toggle.focus();
		await page.keyboard.press('Enter');
		await expect(menu).toBeVisible();
		await page.keyboard.press('Enter');
		await expect(menu).toHaveCount(0);
	});
});
