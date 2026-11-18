// @ts-check
// SPDX-FileCopyrightText: 2026 WEBDEPLOY S.R.L.
// SPDX-License-Identifier: AGPL-3.0-only
import { debug } from './logger.mjs';

/** @param {import('../../types.d.ts').AnalyticsCommand} command @returns {void} */
function enqueue(command) {
	(window._paq ??= []).push(command);
}

/** @param {'newsletter_submit_initiated'|'newsletter_confirmed'} action @returns {void} */
export function newsletterEvent(action) {
	enqueue(['trackEvent', 'Newsletter', action]);
}

/** @returns {void} */
export function initializeMatomo() {
	const { matomoUrl, matomoSite } = document.body.dataset;
	if (!matomoUrl || !matomoSite) return;
	enqueue(['disableCookies']);
	enqueue(['setDoNotTrack', true]);
	enqueue(['enableLinkTracking']);
	enqueue(['setTrackerUrl', new URL('matomo.php', matomoUrl).href]);
	enqueue(['setSiteId', matomoSite]);
	const script = document.createElement('script');
	script.async = true;
	script.src = new URL('matomo.js', matomoUrl).href;
	document.head.append(script);
	function pageView() {
		if (document.referrer) enqueue(['setReferrerUrl', document.referrer]);
		enqueue(['setCustomUrl', location.href]);
		enqueue(['setDocumentTitle', document.title]);
		enqueue(['trackPageView']);
	}
	pageView();
	window.addEventListener('pageshow', (event) => {
		if (event.persisted) pageView();
	});
	document.addEventListener('click', (event) => {
		const link =
			event.target instanceof Element
				? event.target.closest('a[href^="mailto:"],a[href^="tel:"]')
				: null;
		if (link instanceof HTMLAnchorElement)
			enqueue([
				'trackEvent',
				'Contact',
				link.protocol === 'tel:' ? 'phone' : 'email',
				location.pathname
			]);
	});
	debug('Analytics', 'Initialized cookieless Matomo');
}
