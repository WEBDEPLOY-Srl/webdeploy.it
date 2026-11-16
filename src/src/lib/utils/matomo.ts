import { site } from '#lib/config/site.ts';
import { logAnalytics } from '#lib/utils/logger.ts';

/**
 * Matomo, set up for a visitor who has not been asked for anything: cookieless,
 * honouring Do Not Track. Page views are reported by `trackPageView` from the
 * layout, which also covers the first load.
 */

function queue() {
	return (window._paq = window._paq || []);
}

/** Start Matomo in the browser. Returns a function that stops the click tracking. */
export function initMatomo(): () => void {
	const _paq = queue();
	const { url, siteId } = site.analytics.matomo;

	_paq.push(['disableCookies']);
	_paq.push(['setDoNotTrack', true]);
	_paq.push(['enableLinkTracking']);
	_paq.push(['setTrackerUrl', url + 'matomo.php']);
	_paq.push(['setSiteId', siteId]);

	const script = document.createElement('script');
	script.async = true;
	script.src = url + 'matomo.js';
	document.head.appendChild(script);
	logAnalytics.log('Matomo initialized (cookieless mode)');

	// Contact intent: email and phone link clicks, wherever they appear.
	function onContactClick(event: MouseEvent) {
		const link = (event.target as Element | null)?.closest<HTMLAnchorElement>(
			'a[href^="mailto:"], a[href^="tel:"]'
		);
		if (!link) return;
		const channel = link.protocol === 'tel:' ? 'phone' : 'email';
		queue().push(['trackEvent', 'Contact', channel, location.pathname]);
		logAnalytics.log('Contact event tracked:', channel);
	}
	document.addEventListener('click', onContactClick);

	return () => document.removeEventListener('click', onContactClick);
}

/**
 * Report the page the visitor is on. The full URL keeps campaign parameters
 * (mtm_*); call it after the new page's <title> has rendered.
 */
export function trackPageView(from?: URL | null): void {
	const _paq = queue();
	if (from) _paq.push(['setReferrerUrl', from.href]);
	_paq.push(['setCustomUrl', location.href]);
	_paq.push(['setDocumentTitle', document.title]);
	_paq.push(['trackPageView']);
	logAnalytics.log('Page view tracked:', location.pathname);
}
