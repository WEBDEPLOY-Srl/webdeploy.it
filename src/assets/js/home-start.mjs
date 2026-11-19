// @ts-check
// SPDX-FileCopyrightText: 2026 WEBDEPLOY S.R.L.
// SPDX-License-Identifier: AGPL-3.0-only
import { initializeConsent } from './consent.mjs';

// Consent is operable on the first frame. The rest of the page is already real HTML.
try { initializeConsent(); }
catch { void import('./logger.mjs').then(({debug}) => debug('Consent', 'The consent controls could not initialize')); }

/** @type {Promise<void> | undefined} */
let ready;
let active = false;
/** @returns {Promise<void>} */
function enhance() {
	if (ready) return ready;
	const styles = document.getElementById('home-page-styles');
	if (styles instanceof HTMLTemplateElement) styles.replaceWith(styles.content);
	ready = Promise.allSettled([import('./shell.mjs'), import('./workstation.mjs')]).then((results) => {
		if (results.some((result) => result.status === 'rejected')) {
			void import('./logger.mjs').then(({debug}) => debug('Home', 'An enhancement could not initialize'));
		}
		active = true;
		document.removeEventListener('click', forwardClick, true);
		document.removeEventListener('keydown', forwardKey, true);
	});
	return ready;
}
/** @param {EventTarget|null} target @returns {HTMLButtonElement|null} */
function earlyControl(target) {
	const button = target instanceof Element ? target.closest('button') : null;
	return button instanceof HTMLButtonElement && button.closest('.site-header,.ws-demo') ? button : null;
}
/** @param {MouseEvent} event */
function forwardClick(event) {
	const button = earlyControl(event.target);
	if (active || !button) return;
	event.preventDefault();
	event.stopImmediatePropagation();
	void enhance().then(() => button.click());
}
/** @param {KeyboardEvent} event */
function forwardKey(event) {
	const button = earlyControl(event.target);
	if (active || !button || !['ArrowUp','ArrowDown','Escape'].includes(event.key)) return;
	event.preventDefault();
	event.stopImmediatePropagation();
	void enhance().then(() => button.dispatchEvent(new KeyboardEvent('keydown',{key:event.key,bubbles:true})));
}
document.addEventListener('click', forwardClick, true);
document.addEventListener('keydown', forwardKey, true);
window.addEventListener('pagehide', enhance, {once:true});
window.addEventListener('focusin', enhance, {once:true});
window.addEventListener('pointerdown', enhance, {once:true});

// A rendering opportunity separates the essential shell from further downloads.
// Hash navigation, immediate input and a background tab take the bounded path.
if (location.hash || document.hidden) void enhance();
else requestAnimationFrame(() => requestAnimationFrame(enhance));
window.setTimeout(enhance, 150);
