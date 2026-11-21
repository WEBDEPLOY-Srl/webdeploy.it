// @ts-check
// SPDX-FileCopyrightText: 2026 WEBDEPLOY S.R.L.
// SPDX-License-Identifier: AGPL-3.0-only
import { expect, test as base } from '@playwright/test';
import { createHash } from 'node:crypto';
/** 1×1 transparent PNG, stands in for a map tile. */
const PIXEL_PNG = Buffer.from(
	'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
	'base64'
);
/** Stands in for the site under https:// where a test needs a secure context (see optout.spec.mjs). */
export const SECURE_TEST_HOST = 'webdeploy.test';
const META_HOST = /(^|\.)(facebook\.com|facebook\.net)$/;
/**
 * Every third-party host is answered locally so the suite is hermetic and no
 * test can reach analytics, advertising or map servers. A request to a host
 * that is not stubbed here aborts and fails the test that made it.
 */
/** @param {import("@playwright/test").Page} page @param {import("./types.d.ts").ExternalTraffic} traffic @param {string[]} unexpected @returns {Promise<void>} */
async function stubExternalHosts(page, traffic, unexpected) {
	await page.context().route(
		(url) => url.hostname !== '127.0.0.1' && url.hostname !== SECURE_TEST_HOST,
		async (route) => {
			const url = new URL(route.request().url());
			traffic.all.push(url.href);
			if (META_HOST.test(url.hostname)) traffic.meta.push(url.href);
			if (url.hostname === 'www.facebook.com' && url.pathname === '/tr') {
				traffic.metaRequests.push(url.href);
			}
			if (url.hostname === 'analytics.inwd.org') {
				if (url.pathname.endsWith('.js')) {
					return route.fulfill({
						contentType: 'application/javascript',
						body: '/* matomo stub */'
					});
				}
				return route.fulfill({ status: 204 });
			}
			if (url.hostname === 'connect.facebook.net') {
				return route.fulfill({ contentType: 'application/javascript', body: '/* meta stub */' });
			}
			if (url.hostname === 'newsletter.webdeploy.it') {
				traffic.listmonk.push({
					method: route.request().method(),
					url: url.href,
					body: route.request().postData()
				});
				if (url.pathname === '/api/public/captcha/altcha') {
					const challengeNumber = traffic.listmonk.filter((request) => request.url === url.href).length;
					const salt = `abc${challengeNumber}?expires=1893456000`;
					const origin = route.request().headers().origin ?? new URL(page.url()).origin;
					return route.fulfill({
						status: 200,
						contentType: 'application/json',
						headers: {
							'access-control-allow-origin': origin,
							'access-control-allow-methods': 'GET',
							vary: 'Origin'
						},
						body: JSON.stringify({
							algorithm: 'SHA-256',
							challenge: createHash('sha256').update(`${salt}1234`).digest('hex'),
							maxnumber: 2048,
							salt,
							signature: 'offline-signature'
						})
					});
				}
				if (url.pathname === '/subscription/form' && route.request().method() === 'POST') {
					return route.fulfill({
						status: 200,
						contentType: 'text/html; charset=utf-8',
						headers: { 'access-control-allow-origin': new URL(page.url()).origin, vary: 'Origin' },
						body: '<p>An e-mail has been sent to you to confirm your subscription(s).</p>'
					});
				}
				return route.fulfill({ status: 204 });
			}
			if (META_HOST.test(url.hostname)) return route.fulfill({ status: 204 });
			if (url.hostname.endsWith('tile.openstreetmap.org')) {
				return route.fulfill({ contentType: 'image/png', body: PIXEL_PNG });
			}
			unexpected.push(url.href);
			return route.abort();
		}
	);
}
/** @type {import('@playwright/test').Fixtures<import('./types.d.ts').SiteFixtures, {}, import('@playwright/test').PlaywrightTestArgs & import('@playwright/test').PlaywrightTestOptions, import('@playwright/test').PlaywrightWorkerArgs & import('@playwright/test').PlaywrightWorkerOptions>} */
const fixtures = {
	traffic: [
		async ({ page }, use) => {
			/** @type {import("./types.d.ts").ExternalTraffic} */
			const traffic = { all: [], meta: [], metaRequests: [], listmonk: [] };
			/** @type {string[]} */
			const unexpected = [];
			await stubExternalHosts(page, traffic, unexpected);
			await use(traffic);
			expect(unexpected, 'requests to hosts the suite does not stub').toEqual([]);
		},
		{ auto: true }
	],
	// Every Content-Security-Policy violation the page reports, in every test. The
	// browser fires `securitypolicyviolation` for each blocked script, style, image,
	// request or form, so a policy that is too tight fails here, and so does code that
	// starts using something the policy does not allow. A test that provokes one on
	// purpose must empty the array itself.
	cspViolations: [
		async ({ page }, use) => {
			/** @type {string[]} */
			const violations = [];
			await page.exposeBinding('reportCspViolation', (_source, detail) => {
				violations.push(String(detail));
			});
			await page.addInitScript(() => {
				document.addEventListener('securitypolicyviolation', (event) => {
					const report = window.reportCspViolation;
					report(
						`${event.effectiveDirective}: blocked ${event.blockedURI || 'inline'} at ${event.sourceFile || location.pathname}:${event.lineNumber}`
					);
				});
			});
			await use(violations);
			expect(violations, 'Content-Security-Policy violations').toEqual([]);
		},
		{ auto: true }
	],
	// Warnings and errors the page prints, plus uncaught exceptions. Reading the
	// fixture in a test is what turns the collection on.
	consoleProblems: async ({ page }, use) => {
		/** @type {string[]} */
		const problems = [];
		page.on('console', (message) => {
			if (message.type() === 'error' || message.type() === 'warning') {
				problems.push(`${message.type()}: ${message.text()}`);
			}
		});
		page.on('pageerror', (error) => problems.push(`exception: ${error.message}`));
		page.on('requestfailed', (request) => problems.push(`request failed: ${request.url()}`));
		await use(problems);
	}
};
export const test = base.extend(fixtures);
export { expect };
