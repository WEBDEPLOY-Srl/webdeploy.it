import { expect, test as base, type Page, type Request } from '@playwright/test';

/** 1×1 transparent PNG, stands in for a map tile. */
const PIXEL_PNG = Buffer.from(
	'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
	'base64'
);

const META_HOST = /(^|\.)(facebook\.com|facebook\.net)$/;

export interface ExternalTraffic {
	/** Every request that left the local server, by URL. */
	all: string[];
	/** The subset that went to a Meta host. */
	meta: string[];
}

/**
 * Every third-party host is answered locally so the suite is hermetic and no
 * test can reach analytics, advertising or map servers. A request to a host
 * that is not stubbed here aborts and fails the test that made it.
 */
async function stubExternalHosts(page: Page, traffic: ExternalTraffic, unexpected: string[]) {
	await page.route(
		(url) => url.hostname !== '127.0.0.1',
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
			if (META_HOST.test(url.hostname)) return route.fulfill({ status: 204 });
			if (url.hostname.endsWith('tile.openstreetmap.org')) {
				return route.fulfill({ contentType: 'image/png', body: PIXEL_PNG });
			}

			unexpected.push(url.href);
			return route.abort();
		}
	);
}

export const test = base.extend<{ traffic: ExternalTraffic; consoleProblems: string[] }>({
	traffic: async ({ page }, use) => {
		const traffic: ExternalTraffic = { all: [], meta: [] };
		const unexpected: string[] = [];
		await stubExternalHosts(page, traffic, unexpected);
		await use(traffic);
		expect(unexpected, 'requests to hosts the suite does not stub').toEqual([]);
	},

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
