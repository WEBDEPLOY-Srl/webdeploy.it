// @ts-check
// SPDX-FileCopyrightText: 2026 WEBDEPLOY S.R.L.
// SPDX-License-Identifier: AGPL-3.0-only
import { element } from './dom.mjs';
import { newsletterEvent } from './matomo.mjs';
import { trackNewsletterLead } from './meta-pixel.mjs';
import { loadVendor } from './vendor-load.mjs';
import { debug } from './logger.mjs';

const form = element(document, '.newsletter-form', HTMLFormElement);
const lists = Array.from(form.querySelectorAll('input[name=l]')).filter(
	(box) => box instanceof HTMLInputElement
);
const first = element(form, 'input[name=l]', HTMLInputElement);
const button = element(form, 'button[type=submit]', HTMLButtonElement);
const listError = element(form, '#newsletter-list-error', HTMLElement);
const spamError = element(form, '[data-spam-error]', HTMLElement);
const label = button.textContent;
const widget = form.querySelector('altcha-widget');
let ready = false,
	submitting = false,
	attempted = false,
	generation = 0;
function validate() {
	const none = !lists.some((box) => box.checked);
	const message = none ? (form.dataset.required ?? '') : '';
	first.setCustomValidity(message);
	listError.textContent = attempted ? message : '';
}
function paint() {
	button.disabled = !ready || submitting;
	button.textContent = submitting ? (form.dataset.submitting ?? label) : label;
}
function clearError() {
	spamError.hidden = true;
	spamError.textContent = '';
}
validate();
form.addEventListener('change', validate);
first.addEventListener('invalid', () => {
	attempted = true;
	validate();
});
window.addEventListener('pageshow', (event) => {
	if (!event.persisted) return;
	generation++;
	submitting = false;
	attempted = false;
	for (const box of lists) box.checked = false;
	if (ready && widget) {
		widget.reset();
		clearError();
	}
	validate();
	paint();
});
form.addEventListener('submit', async (event) => {
	event.preventDefault();
	validate();
	if (!ready || submitting || !widget || !form.reportValidity()) return;
	const attempt = ++generation;
	submitting = true;
	clearError();
	paint();
	try {
		const proof = await widget.verify();
		if (attempt !== generation) return;
		if (!proof?.payload || widget.getState() !== 'verified') throw new Error('Verification failed');
		try {
			newsletterEvent('newsletter_submit_initiated');
			trackNewsletterLead();
		} catch {
			debug('Analytics', 'Tracking unavailable at signup');
		}
		await new Promise((resolve) => setTimeout(resolve, 180));
		if (attempt === generation) HTMLFormElement.prototype.submit.call(form);
	} catch {
		if (attempt !== generation) return;
		submitting = false;
		spamError.textContent = form.dataset.verificationError ?? '';
		spamError.hidden = false;
		paint();
	}
});

async function initialize() {
	try {
		await Promise.all([
			loadVendor(
				new URL('../vendor/altcha-3.6.0/dist/external/altcha.min.js', import.meta.url),
				'module'
			),
			loadVendor(
				new URL('../vendor/altcha-3.6.0/dist/external/altcha.css', import.meta.url),
				'stylesheet'
			)
		]);
		if (!widget || !customElements.get('altcha-widget') || !window.$altcha)
			throw new Error('ALTCHA did not initialize');
		await customElements.whenDefined('altcha-widget');
		window.$altcha.algorithms.set(
			'SHA-256',
			() => new Worker(new URL('../vendor/altcha-3.6.0/dist/workers/sha.js', import.meta.url))
		);
		await widget.configure({ humanInteractionSignature: false });
		ready = true;
		paint();
	} catch {
		spamError.textContent = form.dataset.setupError ?? '';
		spamError.hidden = false;
		paint();
		debug('Newsletter', 'Local spam check failed to initialize');
	}
}
void initialize();
