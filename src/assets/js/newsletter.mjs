// @ts-check
// SPDX-FileCopyrightText: 2026 WEBDEPLOY S.R.L.
// SPDX-License-Identifier: AGPL-3.0-only
import { element } from './dom.mjs';
import { onApproach } from './activation.mjs';
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
const submitError = element(form, '[data-submit-error]', HTMLElement);
const status = element(form, '.newsletter-status', HTMLElement);
const choices = element(form, 'fieldset', HTMLFieldSetElement);
const email = element(form, 'input[type=email]', HTMLInputElement);
const label = button.textContent;
const widgetTemplate = element(form, '[data-spam-widget]', HTMLTemplateElement);
let widget = form.querySelector('altcha-widget');
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
	choices.inert = submitting;
	email.readOnly = submitting;
	button.disabled = !ready || submitting;
	button.textContent = submitting ? (form.dataset.submitting ?? label) : label;
}
/** @param {string} [message] */
function setError(message = '') {
	submitError.textContent = message;
	submitError.hidden = !message;
}
function trackSubmission() {
	try {
		newsletterEvent('newsletter_submit_initiated');
		trackNewsletterLead();
	} catch {
		debug('Analytics', 'Tracking unavailable at signup');
	}
}
/** @param {import('../../types.d.ts').AltchaWidget} instance @returns {Promise<string>} */
async function verify(instance) {
	const proof = await instance.verify();
	if (!proof?.payload || instance.getState() !== 'verified') throw new Error('Verification failed');
	return proof.payload;
}
validate();
paint();
form.addEventListener('input', () => { status.textContent = ''; });
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
		setError();
	}
	status.textContent = '';
	validate();
	paint();
});
form.addEventListener('submit', async (event) => {
	event.preventDefault();
	validate();
	if (!ready || submitting || !widget || !form.reportValidity()) return;
	const attempt = ++generation;
	const instance = widget;
	submitting = true;
	setError();
	status.textContent = '';
	paint();
	let payload;
	try {
		payload = await verify(instance);
	} catch {
		if (attempt !== generation) return;
		submitting = false;
		setError(form.dataset.verificationError);
		paint();
		return;
	}
	if (attempt !== generation) return;
	if (typeof window.fetch !== 'function') {
		// Choose the native transport only before dispatching any signup request.
		trackSubmission();
		await new Promise((resolve) => setTimeout(resolve, 180));
		if (attempt === generation) HTMLFormElement.prototype.submit.call(form);
		return;
	}

	const body = new URLSearchParams();
	for (const [name, value] of new FormData(form)) {
		if (typeof value === 'string') body.append(name, value);
	}
	body.set('altcha', payload);
	const start = performance.now();
	debug('Newsletter', 'Posting verified signup');
	let response;
	try {
		response = await fetch(form.action, { method: 'POST', mode: 'cors', credentials: 'omit', body });
	} catch {
		// A missing CORS header can hide a completed POST. Reposting can send a second opt-in.
		debug('Newsletter', 'Signup outcome unavailable');
	}
	if (attempt !== generation) return;
	if (response) debug('Newsletter', `Signup HTTP ${response.status} in ${Math.round(performance.now() - start)} ms`);
	submitting = false;
	paint();
	instance.reset();
	if (!response?.ok) {
		const message = response?.status === 429 ? form.dataset.rateLimitError : form.dataset.requestError;
		setError(response ? message : form.dataset.unknownResult);
		submitError.focus();
		submitError.scrollIntoView({ block: 'nearest' });
		return;
	}
	trackSubmission();
	form.reset();
	attempted = false;
	validate();
	status.textContent = form.dataset.success ?? '';
	status.focus();
	status.scrollIntoView({ block: 'nearest' });
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
		if (!customElements.get('altcha-widget') || !window.$altcha)
			throw new Error('ALTCHA did not initialize');
		await customElements.whenDefined('altcha-widget');
		window.$altcha.algorithms.set(
			'SHA-256',
			() => new Worker(new URL('../vendor/altcha-3.6.0/dist/workers/sha.js', import.meta.url))
		);
		// Let the browser finish defining the vendor element before attaching a live instance.
		await new Promise((resolve) => window.setTimeout(resolve, 0));
		const fragment = document.importNode(widgetTemplate.content, true);
		const instance = fragment.querySelector('altcha-widget');
		if (!instance) throw new Error('Missing signup widget');
		// ALTCHA 3 exposes its instance methods on its own load event. The registry
		// can already contain the definition while the connected instance is mounting.
		const mounted = new Promise((resolve, reject) => {
			const timeout = window.setTimeout(() => reject(new Error('Widget did not finish mounting')), 10_000);
			instance.addEventListener('load', () => {
				clearTimeout(timeout);
				resolve(undefined);
			}, { once: true });
		});
		widget = instance;
		widgetTemplate.replaceWith(fragment);
		await mounted;
		await instance.configure({ humanInteractionSignature: false });
		ready = true;
		paint();
	} catch {
		setError(form.dataset.setupError);
		paint();
		debug('Newsletter', 'Local spam check failed to initialize');
	}
}
onApproach(form, () => { void initialize(); });
