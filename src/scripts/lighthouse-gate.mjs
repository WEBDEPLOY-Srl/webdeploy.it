// @ts-check
// SPDX-FileCopyrightText: 2026 WEBDEPLOY S.R.L.
// SPDX-License-Identifier: AGPL-3.0-only
import { pages } from '../data/pages.mjs';
import { site } from '../data/site.mjs';
import { trackerBlocking } from './lighthouse-attribution.mjs';

/** @typedef {import('./lighthouse-types.d.ts').AuditCell} AuditCell */
/** @typedef {import('./lighthouse-types.d.ts').Category} Category */
/** @typedef {import('./lighthouse-types.d.ts').Preset} Preset */
/** @typedef {import('./lighthouse-types.d.ts').LighthouseReport} LighthouseReport */

export const version = '13.6.0';
export const missingPath = '/__quality-check__/missing-page';
/** @type {Category[]} */
export const categories = ['performance', 'accessibility', 'best-practices', 'seo'];
/** @type {Preset[]} */
export const presets = ['mobile', 'desktop'];

/** Compare the served sitemap with the authored indexable routes before adding the two special documents.
 * @param {string} xml @returns {string[]}
 */
export function targets(xml) {
	const expected = pages.filter((page) => !page.robots).map((page) => page.path).sort();
	const paths = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, location]) => {
		const url = new URL(location);
		if (url.origin !== site.url || url.search || url.hash) throw new Error('Unexpected sitemap URL: ' + location);
		return url.pathname;
	}).sort();
	if (JSON.stringify(paths) !== JSON.stringify(expected)) throw new Error('Served sitemap differs from the route inventory');
	return [...new Set([...paths, '/newsletter', '/newsletter/confirmed', missingPath])];
}

/** @param {string} path @returns {string} */
export function reportName(path) {
	return path === '/' ? 'home' : path === missingPath ? '404' : path.slice(1).replaceAll('/', '--');
}

/** @param {string} path @param {Preset} preset @returns {AuditCell} */
export function emptyCell(path, preset) {
	return { path, preset, scores: { performance: null, accessibility: null, 'best-practices': null, seo: null },
		exceptions: [], failures: [], metrics: {}, requests: {matomo: 0, matomoScript: 0, matomoTracking: 0, meta: 0, tiles: 0} };
}

/** @param {LighthouseReport['configSettings']} settings @param {Preset} preset @returns {boolean} */
function standardPreset(settings, preset) {
	const mobile = preset === 'mobile';
	const screen = settings?.screenEmulation;
	const network = settings?.throttling;
	return settings?.formFactor === preset && settings.throttlingMethod === 'simulate' &&
		!settings.disableStorageReset && !settings.blockedUrlPatterns?.length &&
		screen?.mobile === mobile && !screen.disabled && screen.width === (mobile ? 412 : 1350) &&
		screen.height === (mobile ? 823 : 940) && screen.deviceScaleFactor === (mobile ? 1.75 : 1) &&
		network?.rttMs === (mobile ? 150 : 40) && network.throughputKbps === (mobile ? 1638.4 : 10240) &&
		network.cpuSlowdownMultiplier === (mobile ? 4 : 1);
}

/** The browser's own HTTP error for this one navigation is the entire permitted console record.
 * @param {LighthouseReport} report @param {string} url
 * @param {import('./lighthouse-types.d.ts').Console404 | undefined} expected @returns {boolean}
 */
function matchesDocument404(report, url, expected) {
	if (!expected || new URL(url).pathname !== missingPath || expected.audit !== 'errors-in-console') return false;
	const entries = report.audits?.['errors-in-console']?.details?.items ?? [];
	const entry = entries[0];
	return entries.length === 1 && entry.source === expected.source && entry.description === expected.description &&
		entry.sourceLocation?.type === 'source-location' && entry.sourceLocation.urlProvider === 'network' &&
		entry.sourceLocation.url === url;
}

/** Preserve raw scores and apply the documented release expectations.
 * @param {LighthouseReport} report @param {string} url @param {Preset} preset
 * @param {import('./lighthouse-types.d.ts').Expectations} expectations @param {boolean} strict @returns {AuditCell}
 */
export function assess(report, url, preset, expectations, strict) {
	const path = new URL(url).pathname;
	const cell = emptyCell(path, preset);
	if (report.lighthouseVersion !== version) cell.failures.push('Wrong Lighthouse version');
	if (report.requestedUrl !== url || report.finalDisplayedUrl !== url) cell.failures.push('Wrong requested or displayed URL');
	if (!standardPreset(report.configSettings, preset))
		cell.failures.push('Unexpected preset or throttling');
	if (report.runtimeError) cell.failures.push(report.runtimeError.code + ': ' + report.runtimeError.message);
	for (const id of categories) {
		const category = report.categories?.[id];
		if (!category || typeof category.score !== 'number' || !Number.isFinite(category.score) ||
			category.score < 0 || category.score > 1 || !Array.isArray(category.auditRefs)) {
			cell.failures.push('Unscorable category: ' + id);
			continue;
		}
		// Shift the decimal point for display without rounding a near-pass up to 100.
		const [mantissa, exponent = '0'] = String(category.score).split('e');
		cell.scores[id] = Number(mantissa + 'e' + (Number(exponent) + 2));
		if (category.score === 1) continue;
		const weighted = category.auditRefs.filter((ref) => ref.weight > 0);
		const failed = weighted.filter((ref) => {
			const audit = report.audits?.[ref.id];
			return !audit || (audit.score !== 1 && !['notApplicable', 'manual', 'informative'].includes(audit.scoreDisplayMode ?? ''));
		}).map((ref) => ref.id);
		if (id === 'performance' && category.score === 0.99) {
			const attribution = trackerBlocking(report, expectations.performance99);
			cell.performanceAttribution = attribution;
			const completeMetrics = ['first-contentful-paint','largest-contentful-paint','total-blocking-time','speed-index','cumulative-layout-shift']
				.every((metric) => weighted.some((ref) => ref.id === metric)) && weighted.every(({id}) => {
				const score = report.audits?.[id]?.score;
				return typeof score === 'number' && Number.isFinite(score) && score >= 0 && score <= 1 &&
					report.audits[id].scoreDisplayMode === 'numeric';
			});
			if (!strict && completeMetrics && attribution?.dominates && failed.length &&
				failed.every((audit) => expectations.performance99.audits.includes(audit)) &&
				(!failed.includes('largest-contentful-paint') || attribution.blocksLcp)) {
				cell.exceptions.push('Matomo Performance 99 (' + failed.join(', ') + ')');
				continue;
			}
		}
		const expected = expectations.pages[path];
		const allowed = id === 'seo' ? expected?.seo ?? [] :
			id === 'best-practices' && matchesDocument404(report, url, expected?.mainDocument404) ? ['errors-in-console'] : [];
		if (!strict && failed.length && failed.every((audit) => allowed.includes(audit))) cell.exceptions.push(...failed);
		else cell.failures.push(id + ': ' + (failed.join(', ') || 'category below 100'));
	}
	for (const metric of ['first-contentful-paint','largest-contentful-paint','total-blocking-time','cumulative-layout-shift','speed-index'])
		cell.metrics[metric] = report.audits?.[metric]?.numericValue ?? null;
	const requests = report.audits?.['network-requests']?.details?.items;
	if (!Array.isArray(requests) || !requests.some((item) => item.url === url && item.resourceType === 'Document' && item.statusCode === (path === missingPath ? 404 : 200)))
		cell.failures.push('Missing or unexpected main-document network status');
	for (const item of requests ?? []) {
		if (!item.url) continue;
		const request = new URL(item.url);
		const host = request.hostname;
		if (host === 'analytics.inwd.org') {
			cell.requests.matomo++;
			if (request.pathname.endsWith('/matomo.js')) cell.requests.matomoScript++;
			if (request.pathname.endsWith('/matomo.php')) cell.requests.matomoTracking++;
		}
		if (host === 'tile.openstreetmap.org') cell.requests.tiles++;
		if (host === 'www.facebook.com' || host === 'connect.facebook.net') cell.requests.meta++;
	}
	const consoleError = report.audits?.['errors-in-console'];
	if (consoleError?.score === 0 && !cell.exceptions.includes('errors-in-console') &&
		!cell.failures.some((reason) => reason.includes('errors-in-console')))
		cell.failures.push('Unexpected console error: errors-in-console');
	if (cell.requests.meta) cell.failures.push('Marketing request before consent');
	return cell;
}
