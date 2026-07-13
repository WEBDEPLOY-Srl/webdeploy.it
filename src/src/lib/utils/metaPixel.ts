import { browser } from '$app/environment';
import { logAnalytics, logPrivacy } from '$lib/utils/logger';

/**
 * Meta (Facebook/Instagram) Pixel — consent-gated.
 *
 * Loads only after explicit marketing opt-in (see $lib/stores/consent). The
 * pixel/dataset id is PUBLIC (it is visible in the fbevents init call in every
 * browser that loads the pixel), so it is a plain constant here — same pattern
 * as the hard-coded Matomo siteId in +layout.svelte. Not a secret.
 *
 * This is the WEB dataset `webdeploy.it` (Events Manager → WebDeploy Srl), NOT
 * the Meta App id REDACTED-APP-ID (that one is for an internal login app).
 */
const PIXEL_ID = '1041037201718407';
let loaded = false;

/** Load fbevents.js + init the pixel + first PageView. Idempotent, no-op on SSR. */
export function loadMetaPixel(): void {
	if (!browser || loaded || !PIXEL_ID) {
		logPrivacy.log('Meta Pixel load skipped', { browser, loaded, hasId: !!PIXEL_ID });
		return;
	}
	loaded = true;

	// Official Meta Pixel bootstrap (fbevents.js), typed loosely on purpose.
	/* eslint-disable @typescript-eslint/no-explicit-any */
	const w = window as any;
	if (!w.fbq) {
		const n: any = (w.fbq = function (...args: unknown[]) {
			n.callMethod ? n.callMethod.apply(n, args) : n.queue.push(args);
		});
		if (!w._fbq) w._fbq = n;
		n.push = n;
		n.loaded = true;
		n.version = '2.0';
		n.queue = [];
		const s = document.createElement('script');
		s.async = true;
		s.src = 'https://connect.facebook.net/en_US/fbevents.js';
		document.head.appendChild(s);
	}
	/* eslint-enable @typescript-eslint/no-explicit-any */

	window.fbq?.('init', PIXEL_ID);
	window.fbq?.('track', 'PageView');
	logAnalytics.log('Meta Pixel loaded', PIXEL_ID);
}

/** Track a standard/custom event. No-op unless the pixel was consented + loaded. */
export function trackMetaEvent(event: string, params?: Record<string, unknown>): void {
	if (!browser || !loaded || !window.fbq) {
		logPrivacy.log('Meta event skipped (no consent / not loaded):', event);
		return;
	}
	window.fbq('track', event, params);
	logAnalytics.log('Meta event:', event, params ?? '');
}

export function isMetaPixelLoaded(): boolean {
	return loaded;
}
