// @ts-check
// SPDX-FileCopyrightText: 2026 WEBDEPLOY S.R.L.
// SPDX-License-Identifier: AGPL-3.0-only
import { marketingChoice } from './marketing.mjs';
import { debug } from './logger.mjs';
/** @typedef {import('../../types.d.ts').MetaPixel} MetaPixel */
let initialized = false,
	ready = false,
	revoked = false;

/** @returns {void} */
export function grantPixel() {
	const id = document.body.dataset.pixelId;
	if (!id || marketingChoice() !== 'granted') return;
	if (initialized) {
		if (revoked) window.fbq?.('consent', 'grant');
		revoked = false;
		return;
	}
	initialized = true;
	if (!window.fbq) {
		/** @param {...unknown} args @returns {void} */
		function enqueue(...args) {
			if (fbq.callMethod) fbq.callMethod(...args);
			else fbq.queue.push(args);
		}
		/** @type {MetaPixel} */
		const fbq = Object.assign(enqueue, {
			push: enqueue,
			queue: /** @type {unknown[][]} */ ([]),
			loaded: true,
			version: '2.0'
		});
		window.fbq = fbq;
		window._fbq ??= fbq;
		const script = document.createElement('script');
		script.async = true;
		script.src = 'https://connect.facebook.net/en_US/fbevents.js';
		script.onload = () => {
			ready = true;
			debug('Analytics', 'Consent-gated pixel ready');
		};
		document.head.append(script);
	}
	window.fbq('set', 'autoConfig', false, id);
	window.fbq('init', id);
	window.fbq('track', 'PageView');
}

/** @returns {void} */
export function revokePixel() {
	if (initialized && !revoked) {
		revoked = true;
		window.fbq?.('consent', 'revoke');
	}
	const labels = location.hostname.split('.');
	const scopes = [''];
	for (let i = 0; i < labels.length - 1; i++) scopes.push(';domain=' + labels.slice(i).join('.'));
	for (const name of ['_fbp', '_fbc'])
		for (const scope of scopes)
			document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/' + scope;
	debug('Privacy', 'Withdrew marketing consent');
}

/** @returns {void} */
export function trackNewsletterLead() {
	if (initialized && ready && !revoked && marketingChoice() === 'granted')
		window.fbq?.('track', 'Lead', { content_name: 'newsletter' });
}
