// @ts-check
// SPDX-FileCopyrightText: 2026 WEBDEPLOY S.R.L.
// SPDX-License-Identifier: AGPL-3.0-only
import { element } from './dom.mjs';
import { marketingChoice, setMarketing } from './marketing.mjs';
let initialized = false;

/** @returns {void} */
function synchronizePixel() {
	void import('./meta-pixel.mjs').then(({ grantPixel, revokePixel }) => {
		if (marketingChoice() === 'granted') grantPixel();
		else revokePixel();
	}).catch(() => import('./logger.mjs').then(({ debug }) => debug('Marketing', 'Pixel preference could not be applied')).catch(() => {}));
}

/** @returns {void} */
export function initializeConsent() {
	if (initialized) return;
	const template = element(document, '#consent-template', HTMLTemplateElement);
	const control = element(document, '.site-footer__settings', HTMLButtonElement);
	const phone = matchMedia('(max-width: 639px), (pointer: coarse) and (max-height: 500px)');
	const clone = element(template.content, '.cookie-banner', HTMLElement).cloneNode(true);
	if (!(clone instanceof HTMLElement)) return;
	const banner = clone;
	const close = element(banner, '[data-choice="close"]', HTMLButtonElement);
	const reservation = document.createElement('div');
	reservation.className = 'consent-reservation';
	reservation.setAttribute('aria-hidden', 'true');
	let reopened = false;
	let previous = marketingChoice();
	const observer = new ResizeObserver(([entry]) => {
		if (!banner.isConnected) return;
		const size = entry.borderBoxSize?.[0];
		const height = size?.blockSize ?? banner.getBoundingClientRect().height;
		document.documentElement.style.setProperty('--consent-height', Math.ceil(height) + 'px');
	});
	function focusState() {
		const hidden =
			phone.matches && Boolean(document.activeElement?.matches('input,select,textarea'));
		banner.classList.toggle('hidden-for-field', hidden);
		banner.inert = hidden;
		if (hidden) banner.setAttribute('aria-hidden', 'true');
		else banner.removeAttribute('aria-hidden');
	}
	function synchronize() {
		if (marketingChoice() === null || reopened) {
			close.hidden = !reopened;
			if (!banner.isConnected) {
				document.documentElement.style.setProperty('--consent-height', '7rem');
				template.after(banner, reservation);
				observer.observe(banner, { box: 'border-box' });
			}
			focusState();
		} else {
			observer.disconnect();
			banner.remove();
			reservation.remove();
			document.documentElement.style.removeProperty('--consent-height');
		}
	}
	function dismiss() {
		const returnFocus = reopened;
		reopened = false;
		synchronize();
		if (returnFocus) control.focus();
	}
	function openSettings() {
		reopened = true;
		synchronize();
		banner.focus();
	}
	/** @param {MouseEvent} event @returns {void} */
	function choose(event) {
		if (!(event.target instanceof Element)) return;
		const button = event.target.closest('button');
		if (!button) return;
		const choice = button.dataset.choice;
		if (choice === 'granted' || choice === 'denied') {
			const before = marketingChoice();
			setMarketing(choice);
			previous = choice;
			if (choice === 'granted' || before === 'granted') synchronizePixel();
		}
		dismiss();
	}
	function restore() {
		const choice = marketingChoice();
		if (choice === 'granted' || previous === 'granted') synchronizePixel();
		previous = choice;
		synchronize();
	}
	const listeners = new AbortController();
	const options = { signal: listeners.signal };
	// Home and the shared shell can both initialize consent. A failed attempt must be safe to retry.
	initialized = true;
	try {
		control.addEventListener('click', openSettings, options);
		banner.addEventListener('click', choose, options);
		window.addEventListener('keydown', (event) => {
			if (event.key === 'Escape' && reopened) dismiss();
		}, options);
		document.addEventListener('focusin', focusState, options);
		document.addEventListener('focusout', () => requestAnimationFrame(focusState), options);
		phone.addEventListener('change', focusState, options);
		window.addEventListener('pagehide', () => {
			previous = marketingChoice();
		}, options);
		window.addEventListener('pageshow', (event) => {
			if (event.persisted) restore();
		}, options);
		window.addEventListener('storage', (event) => {
			if (event.key === 'wd_consent_marketing' || event.key === null) restore();
		}, options);
		restore();
		control.hidden = false;
	} catch (error) {
		listeners.abort();
		observer.disconnect();
		banner.remove();
		reservation.remove();
		document.documentElement.style.removeProperty('--consent-height');
		initialized = false;
		throw error;
	}
}
