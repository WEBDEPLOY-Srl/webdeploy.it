// @ts-check
// SPDX-FileCopyrightText: 2026 WEBDEPLOY S.R.L.
// SPDX-License-Identifier: AGPL-3.0-only
import { element } from './dom.mjs';

const kiosk = element(document, '.kiosk-demo', HTMLElement);
const screen = element(kiosk, '.kiosk-demo__screen', HTMLElement);
const app = element(screen, '.kiosk-demo__app', HTMLElement);
const home = element(app, '.kiosk-demo__body', HTMLElement);
const clock = element(app, '.kiosk-demo__status span:last-child', HTMLElement);
let progressTimer = 0,
	clockTimer = 0;
/** @param {string} name @returns {Element} */
function clonePanel(name) {
	const source = element(kiosk, 'template[data-panel="' + name + '"]', HTMLTemplateElement).content
		.firstElementChild;
	if (!source) throw new Error('Empty kiosk panel: ' + name);
	const clone = source.cloneNode(true);
	if (!(clone instanceof Element)) throw new Error('Invalid kiosk panel');
	return clone;
}
function tick() {
	clock.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
function startClock() {
	tick();
	clearInterval(clockTimer);
	clockTimer = window.setInterval(tick, 15000);
}
/** @param {boolean} windows */
function setMode(windows) {
	clearInterval(progressTimer);
	screen.classList.toggle('kiosk-demo__screen--windows', windows);
	for (const button of kiosk.querySelectorAll('.kiosk-demo__switch button'))
		button.setAttribute(
			'aria-pressed',
			String(button.getAttribute('data-mode') === (windows ? 'windows' : 'inwd'))
		);
	if (!windows) {
		screen.replaceChildren(app);
		element(app, '.kiosk-demo__body', HTMLElement).replaceWith(home);
		return;
	}
	screen.replaceChildren(clonePanel('windows'));
	const progress = element(screen, '.kiosk-demo__update-title:nth-of-type(2)', HTMLElement);
	let current = 0;
	progress.textContent = '0' + (kiosk.dataset.complete ?? '');
	progressTimer = window.setInterval(() => {
		current = current >= 100 ? 0 : Math.min(100, current + 1 + Math.floor(Math.random() * 3));
		progress.textContent = current + (kiosk.dataset.complete ?? '');
	}, 900);
}
kiosk.addEventListener('click', (event) => {
	const button = event.target instanceof Element ? event.target.closest('button') : null;
	if (!button) return;
	if (button.dataset.mode) {
		setMode(button.dataset.mode === 'windows');
		return;
	}
	if (button.matches('.kiosk-demo__back')) {
		element(app, '.kiosk-demo__body', HTMLElement).replaceWith(home);
		return;
	}
	if (button.dataset.view)
		element(app, '.kiosk-demo__body', HTMLElement).replaceWith(clonePanel(button.dataset.view));
});
startClock();
window.addEventListener('pagehide', () => {
	clearInterval(clockTimer);
	clearInterval(progressTimer);
});
window.addEventListener('pageshow', (event) => {
	if (event.persisted) {
		startClock();
		if (screen.classList.contains('kiosk-demo__screen--windows')) setMode(true);
	}
});
