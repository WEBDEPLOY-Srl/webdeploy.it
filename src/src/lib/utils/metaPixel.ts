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
 * Note: this is the web pixel/dataset id, not any Meta App id.
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

	// Official Meta Pixel bootstrap (fbevents.js).
	if (!window.fbq) {
		const fbq: MetaPixel = Object.assign(
			(...args: unknown[]) => {
				if (fbq.callMethod) fbq.callMethod(...args);
				else fbq.queue.push(args);
			},
			{ queue: [] as unknown[][], loaded: true, version: '2.0' }
		) as MetaPixel;
		fbq.push = fbq;
		window.fbq = fbq;
		window._fbq ??= fbq;
		const s = document.createElement('script');
		s.async = true;
		s.src = 'https://connect.facebook.net/en_US/fbevents.js';
		document.head.appendChild(s);
	}

	window.fbq?.('init', PIXEL_ID);
	window.fbq?.('track', 'PageView');
	logAnalytics.log('Meta Pixel loaded', PIXEL_ID);
}
