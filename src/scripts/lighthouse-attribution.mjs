// @ts-check
// SPDX-FileCopyrightText: 2026 WEBDEPLOY S.R.L.
// SPDX-License-Identifier: AGPL-3.0-only

/** @typedef {import('./lighthouse-types.d.ts').AuditItem} AuditItem */
/** @typedef {import('./lighthouse-types.d.ts').LighthouseReport} LighthouseReport */
/** @typedef {import('./lighthouse-types.d.ts').PerformanceAttribution} PerformanceAttribution */
/** @typedef {import('./lighthouse-types.d.ts').PerformanceExpectation} PerformanceExpectation */

/** @param {unknown} value @returns {value is number} */
function positive(value) {
	return typeof value === 'number' && Number.isFinite(value) && value > 0;
}

/** @param {AuditItem} item @returns {boolean} */
function successful(item) {
	return typeof item.statusCode === 'number' && item.statusCode >= 200 && item.statusCode < 300;
}

/**
 * Match the exact content-addressed module requested by this navigation to a measured profile.
 * @param {LighthouseReport} report
 * @param {PerformanceExpectation} policy
 * @returns {{url?: string; notice?: string}}
 */
export function adapterProfile(report, policy) {
	const origin = new URL(report.requestedUrl).origin;
	/** @type {Set<string>} */
	const paths = new Set();
	for (const item of report.audits['network-requests']?.details?.items ?? []) {
		if (item.resourceType !== 'Script' || !item.url?.startsWith(origin + '/assets/build/')) continue;
		const path = item.url.slice(origin.length);
		if (/^\/assets\/build\/[a-f0-9]{16}\/js\/matomo\.mjs$/.test(path)) paths.add(path);
	}
	if (!paths.size) return {};
	const [path] = paths;
	if (paths.size === 1 && policy.profiledCallers.some((profile) => profile.path === path)) return {url:origin + path};
	return {notice:'Matomo adapter credit unavailable. Re-profile the observed build at ' + [...paths].join(', ') + '.'};
}

/**
 * Reconcile the full long-task ledger with the reported navigation TBT. Lighthouse's
 * third-party insight uses observed CPU time, so it corroborates script execution but
 * does not contribute simulated milliseconds to the blocking-time calculation.
 * @param {LighthouseReport} report
 * @param {PerformanceExpectation} policy
 * @param {string | undefined} caller
 * @returns {PerformanceAttribution | undefined}
 */
export function trackerBlocking(report, policy, caller) {
	const audits = report.audits;
	const tracker = policy.trackerScript;
	const requests = audits['network-requests']?.details?.items ?? [];
	const scriptFetched = (/** @type {string} */ url) => requests.some((item) =>
		item.url === url && item.resourceType === 'Script' && successful(item));
	const collected = requests.some((item) => item.url?.split('?')[0] === policy.collectionEndpoint && successful(item));
	const boot = audits['bootup-time']?.details?.items ?? [];
	const trackerBootupMs = boot.find((item) => item.url === tracker)?.total;
	const callerScriptingMs = caller ? boot.find((item) => item.url === caller)?.scripting ?? 0 : 0;
	const thirdParties = audits['third-parties-insight']?.details?.items ?? [];
	const thirdPartyMainThreadMs = thirdParties.flatMap((item) => item.subItems?.items ?? [])
		.find((item) => item.url === tracker)?.mainThreadTime;
	if (!scriptFetched(tracker) || !collected || !positive(trackerBootupMs) || !positive(thirdPartyMainThreadMs)) return;

	const fcp = audits['first-contentful-paint']?.numericValue;
	const tti = audits.interactive?.numericValue;
	const reportedTbtMs = audits['total-blocking-time']?.numericValue;
	const ledger = audits['long-tasks']?.details?.debugData;
	if (!positive(fcp) || !positive(tti) || tti <= fcp || !positive(reportedTbtMs) ||
		!Array.isArray(ledger?.urls) || !Array.isArray(ledger?.tasks) || !ledger.tasks.length) return;

	const callerVerified = caller !== undefined && positive(callerScriptingMs) && scriptFetched(caller);
	let trackerBlockingMs = 0, pairedCallerBlockingMs = 0, windowBlockingMs = 0;
	let previousEnd = -Infinity, previousWasTracker = false;
	// debugData includes tasks beyond the 20 longest shown in the human-readable table.
	for (const task of [...ledger.tasks].sort((a,b) => a.startTime - b.startTime)) {
		const url = ledger.urls[task.urlIndex];
		if (typeof url !== 'string' || !url || !Number.isInteger(task.urlIndex) ||
			!Number.isFinite(task.startTime) || task.startTime < 0 || !positive(task.duration) ||
			task.duration < 50 || task.startTime < previousEnd - 0.2) return;
		const end = task.startTime + task.duration;
		const blockingStart = Math.max(fcp, task.startTime) + 50;
		const blocking = Math.max(0, Math.min(end, tti) - blockingStart);
		const direct = url === tracker;
		const paired = callerVerified && url === caller && previousWasTracker && Math.abs(task.startTime - previousEnd) <= 0.2;
		windowBlockingMs += blocking;
		if (direct) trackerBlockingMs += blocking;
		if (paired) pairedCallerBlockingMs += blocking;
		previousEnd = end;
		previousWasTracker = direct && blocking > 0;
	}
	// The owner approved partial credit for Matomo's synchronous trackPageView inside a profiled caller.
	const creditedBlockingMs = trackerBlockingMs + Math.min(trackerBlockingMs, pairedCallerBlockingMs / 2);
	const reconciled = Math.abs(windowBlockingMs - reportedTbtMs) <= 1;
	const dominates = reconciled && creditedBlockingMs > Math.max(windowBlockingMs, reportedTbtMs) / 2;
	return {trackerScript:tracker, profiledCaller:caller, trackerBootupMs, callerScriptingMs, thirdPartyMainThreadMs,
		reportedTbtMs, windowBlockingMs, trackerBlockingMs, pairedCallerBlockingMs, creditedBlockingMs, dominates};
}
