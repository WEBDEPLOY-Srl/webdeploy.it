// @ts-check
// SPDX-FileCopyrightText: 2026 WEBDEPLOY S.R.L.
// SPDX-License-Identifier: AGPL-3.0-only
import { element } from './dom.mjs';
import { marketingChoice, setMarketing } from './marketing.mjs';
import { grantPixel, revokePixel } from './meta-pixel.mjs';

/** @returns {void} */
export function initializeConsent() {
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
	const observer = new ResizeObserver(measure);
	function measure() {
		if (!banner.isConnected) return;
		const height = Math.ceil(banner.getBoundingClientRect().height) + 'px';
		reservation.style.height = height;
		document.documentElement.style.setProperty('--consent-height', height);
	}
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
				template.after(banner, reservation);
				observer.observe(banner);
			}
			measure();
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
	control.hidden = false;
	control.addEventListener('click', () => {
		reopened = true;
		synchronize();
		banner.focus();
	});
	banner.addEventListener('click', (event) => {
		if (!(event.target instanceof Element)) return;
		const button = event.target.closest('button');
		if (!button) return;
		const choice = button.dataset.choice;
		if (choice === 'granted' || choice === 'denied') {
			const before = marketingChoice();
			setMarketing(choice);
			previous = choice;
			if (choice === 'granted') grantPixel();
			else if (before === 'granted') revokePixel();
		}
		dismiss();
	});
	window.addEventListener('keydown', (event) => {
		if (event.key === 'Escape' && reopened) dismiss();
	});
	document.addEventListener('focusin', focusState);
	document.addEventListener('focusout', () => requestAnimationFrame(focusState));
	phone.addEventListener('change', focusState);
	function restore() {
		const choice = marketingChoice();
		if (choice === 'granted') grantPixel();
		else if (previous === 'granted') revokePixel();
		previous = choice;
		synchronize();
	}
	window.addEventListener('pagehide', () => {
		previous = marketingChoice();
	});
	window.addEventListener('pageshow', (event) => {
		if (event.persisted) restore();
	});
	window.addEventListener('storage', (event) => {
		if (event.key === 'wd_consent_marketing' || event.key === null) restore();
	});
	restore();
}
