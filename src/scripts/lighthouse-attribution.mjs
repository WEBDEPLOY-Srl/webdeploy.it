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
 * Reconcile the full long-task ledger with the reported navigation TBT. Lighthouse's
 * third-party insight uses observed CPU time, so it corroborates script execution but
 * does not contribute simulated milliseconds to the blocking-time calculation.
 * @param {LighthouseReport} report
 * @param {PerformanceExpectation} policy
 * @returns {PerformanceAttribution | undefined}
 */
export function trackerBlocking(report, policy) {
	const audits = report.audits;
	const tracker = policy.trackerScript;
	const caller = new URL(policy.profiledCaller, report.requestedUrl).href;
	const requests = audits['network-requests']?.details?.items ?? [];
	const scriptFetched = (/** @type {string} */ url) => requests.some((item) =>
		item.url === url && item.resourceType === 'Script' && successful(item));
	const collected = requests.some((item) => item.url?.split('?')[0] === policy.collectionEndpoint && successful(item));
	const boot = audits['bootup-time']?.details?.items ?? [];
	const trackerBootupMs = boot.find((item) => item.url === tracker)?.total;
	const callerScriptingMs = boot.find((item) => item.url === caller)?.scripting ?? 0;
	const thirdParties = audits['third-parties-insight']?.details?.items ?? [];
	const thirdPartyMainThreadMs = thirdParties.flatMap((item) => item.subItems?.items ?? [])
		.find((item) => item.url === tracker)?.mainThreadTime;
	if (!scriptFetched(tracker) || !collected || !positive(trackerBootupMs) || !positive(thirdPartyMainThreadMs)) return;

	const fcp = audits['first-contentful-paint']?.numericValue;
	const tti = audits.interactive?.numericValue;
	const lcp = audits['largest-contentful-paint']?.numericValue;
	const reportedTbtMs = audits['total-blocking-time']?.numericValue;
	const ledger = audits['long-tasks']?.details?.debugData;
	if (!positive(fcp) || !positive(tti) || tti <= fcp || !positive(lcp) || !positive(reportedTbtMs) ||
		!Array.isArray(ledger?.urls) || !Array.isArray(ledger?.tasks) || !ledger.tasks.length) return;

	const callerVerified = positive(callerScriptingMs) && scriptFetched(caller);
	let trackerBlockingMs = 0, pairedCallerBlockingMs = 0, windowBlockingMs = 0;
	let previousEnd = -Infinity, previousWasTracker = false, blocksLcp = false;
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
		if ((direct || paired) && blocking > 0 && lcp >= blockingStart && lcp <= end + 0.2) blocksLcp = true;
		previousEnd = end;
		previousWasTracker = direct && blocking > 0;
	}
	// The profiled caller spent 33.3 ms in trackPageView and 1.9 ms in other calls.
	// Credit at most half of the adjacent caller's blocking and cap that credit at the direct evidence.
	const creditedBlockingMs = trackerBlockingMs + Math.min(trackerBlockingMs, pairedCallerBlockingMs / 2);
	const reconciled = Math.abs(windowBlockingMs - reportedTbtMs) <= 1;
	const dominates = reconciled && creditedBlockingMs > Math.max(windowBlockingMs, reportedTbtMs) / 2;
	return {trackerScript:tracker, profiledCaller:caller, trackerBootupMs, callerScriptingMs, thirdPartyMainThreadMs,
		reportedTbtMs, windowBlockingMs, trackerBlockingMs, pairedCallerBlockingMs, creditedBlockingMs, dominates, blocksLcp};
}
