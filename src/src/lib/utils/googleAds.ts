import { browser } from '$app/environment';
import { logEarlyAccess } from './logger';

/**
 * Google Ads conversion wiring for the early-access funnel.
 *
 * Inert by design: `GOOGLE_ADS` is null until the the paid-search test
 * (see the private ads spec) is set up and a conversion action exists. Once
 * the conversion action is created in Google Ads, fill in the tag id + label and
 * every helper below activates. Kept out of the global layout so gtag/gclid
 * cookies are only ever set on the funnel pages, preserving the site's
 * cookieless-by-default posture everywhere else.
 */
type GoogleAdsConfig = {
	/** Conversion tag id, e.g. 'AW-1234567890' */
	tagId: string;
	/** Conversion label from the Google Ads conversion action, e.g. 'AbC-D_efG' */
	conversionLabel: string;
};

// TODO(pre-launch): set from the Google Ads conversion action before enabling paid search.
export const GOOGLE_ADS: GoogleAdsConfig | null = null;

type GtagWindow = Window & {
	dataLayer?: unknown[];
	gtag?: (...args: unknown[]) => void;
};

let loaded = false;

/**
 * Load gtag.js and configure the Google Ads tag. Safe to call on every funnel
 * page: it captures the GCLID from the Google click into a first-party cookie
 * so a later conversion attributes correctly. No-op when unconfigured or SSR.
 */
export function initGoogleAds(): void {
	if (!browser || !GOOGLE_ADS || loaded) return;
	loaded = true;

	const w = window as GtagWindow;
	w.dataLayer = w.dataLayer || [];
	w.gtag = function gtag() {
		// eslint-disable-next-line prefer-rest-params
		w.dataLayer!.push(arguments);
	};
	w.gtag('js', new Date());
	w.gtag('config', GOOGLE_ADS.tagId);

	const s = document.createElement('script');
	s.async = true;
	s.src = `https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS.tagId}`;
	document.head.appendChild(s);

	logEarlyAccess.log('Google Ads gtag loaded', GOOGLE_ADS.tagId);
}

/**
 * Fire the early-access conversion. Called once on the confirmation page after
 * double opt-in completes. No-op when unconfigured or SSR.
 */
export function fireGoogleAdsConversion(): void {
	if (!browser || !GOOGLE_ADS) return;
	initGoogleAds();

	const w = window as GtagWindow;
	w.gtag?.('event', 'conversion', {
		send_to: `${GOOGLE_ADS.tagId}/${GOOGLE_ADS.conversionLabel}`
	});
	logEarlyAccess.log('Google Ads conversion fired');
}
