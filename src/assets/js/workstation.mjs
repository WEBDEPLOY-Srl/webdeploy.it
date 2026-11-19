// @ts-check
// SPDX-FileCopyrightText: 2026 WEBDEPLOY S.R.L.
// SPDX-License-Identifier: AGPL-3.0-only
import { element } from './dom.mjs';

const machine = element(document, '.ws-demo', HTMLElement);
const device = element(machine, '.ws-demo__device', HTMLElement);
const stage = element(device, '.ws-demo__stage', HTMLElement);
const desktop = element(stage, '.desk', HTMLElement);
const panel = element(desktop, '.panel', HTMLElement);
const status = element(machine, '[role="status"]', HTMLElement);
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
/** @type {number[]} */
const opening = [];
/** @type {number[]} */
const printing = [];
/** @param {number[]} timers @returns {void} */
function cancel(timers) {
	for (const timer of timers.splice(0)) clearTimeout(timer);
}
/** @param {string} name @returns {DocumentFragment} */
function view(name) {
	const template = element(machine, 'template[data-view="' + name + '"]', HTMLTemplateElement);
	const fragment = template.content.cloneNode(true);
	if (!(fragment instanceof DocumentFragment)) throw new Error('Invalid workstation view: ' + name);
	return fragment;
}
function resize() {
	stage.style.transform = `scale(${device.getBoundingClientRect().width / 1113})`;
	stage.style.visibility = 'visible';
}
const observer = new ResizeObserver(resize);
observer.observe(device);
resize();
const clock = element(panel, '.panel__tray', HTMLElement);
let timer = 0;
function startClock() {
	const tick = () => {
		clock.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
	};
	tick();
	clearInterval(timer);
	timer = window.setInterval(tick, 15000);
}
/** @param {string} name */
function openApp(name) {
	cancel(opening);
	desktop.querySelector('.win--float')?.remove();
	desktop.querySelector('.kickoff')?.remove();
	const launcher = element(panel, '.panel__launcher', HTMLElement);
	const buttons = Array.from(machine.querySelectorAll('button[data-app]'));
	for (const button of buttons)
		button.setAttribute('aria-pressed', String(button.getAttribute('data-app') === name));
	const index = buttons.findIndex((button) => button.getAttribute('data-app') === name);
	const tasks = Array.from(panel.querySelectorAll('.panel__task'));
	for (const task of tasks) task.classList.remove('on');
	function show() {
		desktop.querySelector('.kickoff')?.remove();
		launcher.classList.remove('on');
		panel.before(view(name));
		tasks[index]?.classList.add('on');
		status.textContent = element(desktop, '.win--float .win__title', HTMLElement).textContent;
	}
	if (reduceMotion.matches) {
		show();
		return;
	}
	launcher.classList.add('on');
	panel.before(view('launcher'));
	opening.push(
		window.setTimeout(
			() => desktop.querySelectorAll('.kickoff__item')[index]?.classList.add('hl'),
			350
		)
	);
	opening.push(window.setTimeout(show, 900));
}
function print() {
	cancel(printing);
	machine.querySelector('[data-test-label]')?.remove();
	desktop.querySelector('.toast')?.remove();
	status.textContent = '';
	const delay = reduceMotion.matches ? 0 : 700;
	printing.push(
		window.setTimeout(() => {
			element(stage, '.queue__job', HTMLElement).before(view('print'));
			panel.before(view('notice'));
			status.textContent = machine.dataset.notice ?? '';
		}, delay)
	);
	printing.push(
		window.setTimeout(() => {
			desktop.querySelector('.toast')?.remove();
		}, delay + 6000)
	);
}
machine.addEventListener('click', (event) => {
	const button = event.target instanceof Element ? event.target.closest('button') : null;
	if (button?.dataset.app) openApp(button.dataset.app);
	else if (button?.hasAttribute('data-print')) print();
});
startClock();
window.addEventListener('pagehide', () => {
	cancel(opening);
	cancel(printing);
	clearInterval(timer);
});
window.addEventListener('pageshow', (event) => {
	if (event.persisted) {
		startClock();
		resize();
	}
});
