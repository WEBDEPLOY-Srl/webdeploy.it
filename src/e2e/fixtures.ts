import { expect, test as base, type Page, type Request } from '@playwright/test';

/** 1×1 transparent PNG, stands in for a map tile. */
const PIXEL_PNG = Buffer.from(
	'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
	'base64'
);

/** Stands in for the site under https:// where a test needs a secure context (see optout.spec.ts). */
export const SECURE_TEST_HOST = 'webdeploy.test';

const META_HOST = /(^|\.)(facebook\.com|facebook\.net)$/;

export interface ExternalTraffic {
	/** Every request that left the local server, by URL. */
	all: string[];
	/** The subset that went to a Meta host. */
	meta: string[];
	listmonk: Array<{ method: string; url: string; body: string | null }>;
}

/**
 * Every third-party host is answered locally so the suite is hermetic and no
 * test can reach analytics, advertising or map servers. A request to a host
 * that is not stubbed here aborts and fails the test that made it.
 */
async function stubExternalHosts(page: Page, traffic: ExternalTraffic, unexpected: string[]) {
	await page.route(
		(url) => url.hostname !== '127.0.0.1' && url.hostname !== SECURE_TEST_HOST,
		async (route) => {
			const url = new URL(route.request().url());
			traffic.all.push(url.href);
			if (META_HOST.test(url.hostname)) traffic.meta.push(url.href);

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
					return route.fulfill({
						status: 200,
						contentType: 'application/json',
						body: JSON.stringify({
							algorithm: 'SHA-256',
							challenge: '0'.repeat(64),
							salt: 'test',
							signature: 'test'
						})
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

export const test = base.extend<{
	traffic: ExternalTraffic;
	consoleProblems: string[];
	cspViolations: string[];
}>({
	traffic: async ({ page }, use) => {
		const traffic: ExternalTraffic = { all: [], meta: [], listmonk: [] };
		const unexpected: string[] = [];
		await stubExternalHosts(page, traffic, unexpected);
		await use(traffic);
		expect(unexpected, 'requests to hosts the suite does not stub').toEqual([]);
	},

	// Every Content-Security-Policy violation the page reports, in every test. The
	// browser fires `securitypolicyviolation` for each blocked script, style, image,
	// request or form, so a policy that is too tight fails here, and so does code that
	// starts using something the policy does not allow. A test that provokes one on
	// purpose must empty the array itself.
	cspViolations: [
		async ({ page }, use) => {
			const violations: string[] = [];
			await page.exposeBinding('reportCspViolation', (_source, detail: string) => {
				violations.push(detail);
			});
			await page.addInitScript(() => {
				document.addEventListener('securitypolicyviolation', (event) => {
					const report = (window as unknown as Record<string, (detail: string) => void>)
						.reportCspViolation;
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
		const problems: string[] = [];
		page.on('console', (message) => {
			if (message.type() === 'error' || message.type() === 'warning') {
				problems.push(`${message.type()}: ${message.text()}`);
			}
		});
		page.on('pageerror', (error) => problems.push(`exception: ${error.message}`));
		page.on('requestfailed', (request: Request) =>
			problems.push(`request failed: ${request.url()}`)
		);
		await use(problems);
	}
});

export { expect };
