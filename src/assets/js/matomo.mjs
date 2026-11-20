// @ts-check
// SPDX-FileCopyrightText: 2026 WEBDEPLOY S.R.L.
// SPDX-License-Identifier: AGPL-3.0-only
import { debug } from './logger.mjs';

/** @param {import('../../types.d.ts').AnalyticsCommand} command @returns {void} */
function enqueue(command) {
	(window._paq ??= []).push(command);
}

/** @type {import('../../types.d.ts').AnalyticsCommand[]} */
const pending = [];
let started = false;

/** @param {import('../../types.d.ts').AnalyticsCommand} command @returns {void} */
function record(command) {
	if (started) enqueue(command);
	else pending.push(command);
}

function flush() {
	if (started) return;
	started = true;
	for (const command of pending.splice(0)) {
		try {
			enqueue(command);
		} catch {
			debug('Analytics', 'Tracker could not record a queued command');
		}
	}
}

/** @param {'newsletter_submit_initiated'|'newsletter_confirmed'} action @returns {void} */
export function newsletterEvent(action) {
	record(['trackEvent', 'Newsletter', action]);
}

/** @returns {void} */
export function initializeMatomo() {
	const { matomoUrl, matomoSite } = document.body.dataset;
	if (!matomoUrl || !matomoSite) {
		flush();
		return;
	}
	enqueue(['disableCookies']);
	enqueue(['setDoNotTrack', true]);
	enqueue(['setTrackerUrl', new URL('matomo.php', matomoUrl).href]);
	enqueue(['setSiteId', matomoSite]);
	const script = document.createElement('script');
	script.async = true;
	script.fetchPriority = 'low';
	script.src = new URL('matomo.js', matomoUrl).href;
	let trackingLinks = false;
	function enableLinks() {
		if (trackingLinks) return;
		trackingLinks = true;
		enqueue(['enableLinkTracking']);
	}
	function flushOnInteraction() {
		enableLinks();
		flush();
	}
	// Starting the tracker, installing link listeners and recording the first visit
	// are separate tasks. Actual input or departure immediately drains the queue.
	script.addEventListener('load', () => {
		window.setTimeout(() => {
			enableLinks();
			window.setTimeout(flush, 0);
		}, 0);
	}, { once: true });
	for (const event of ['pointerdown', 'keydown', 'click', 'pagehide'])
		window.addEventListener(event, flushOnInteraction, { capture: true, once: true });
	document.head.append(script);
	/** @param {boolean} [initial] */
	function pageView(initial = false) {
		/** @type {import('../../types.d.ts').AnalyticsCommand[]} */
		const commands = [];
		if (document.referrer) commands.push(['setReferrerUrl', document.referrer]);
		commands.push(['setCustomUrl', location.href], ['setDocumentTitle', document.title], ['trackPageView']);
		// A page-specific entry can enqueue an event before the shared tracker is ready.
		if (initial && !started) pending.unshift(...commands);
		else for (const command of commands) record(command);
	}
	pageView(true);
	window.addEventListener('pageshow', (event) => {
		if (event.persisted) pageView();
	});
	document.addEventListener('click', (event) => {
		const link =
			event.target instanceof Element
				? event.target.closest('a[href^="mailto:"],a[href^="tel:"]')
				: null;
		if (link instanceof HTMLAnchorElement)
			record([
				'trackEvent',
				'Contact',
				link.protocol === 'tel:' ? 'phone' : 'email',
				location.pathname
			]);
	});
	debug('Analytics', 'Initialized cookieless Matomo');
}
