// @ts-check
// SPDX-FileCopyrightText: 2026 WEBDEPLOY S.R.L.
// SPDX-License-Identifier: AGPL-3.0-only
import { createMatomoOptOut } from './opt-out-cookie.mjs';
import { element } from './dom.mjs';
import { debug } from './logger.mjs';

const area = element(document, '#matomo-opt-out', HTMLElement);
const state = createMatomoOptOut({
	cookies: {
		read: () => document.cookie,
		write: (value) => {
			document.cookie = value;
		}
	},
	cookiesEnabled: navigator.cookieEnabled,
	isHttps: location.protocol === 'https:',
	now: Date.now
});
const checkbox = element(area, 'input', HTMLInputElement);
const controls = element(area, '[data-opt-out-controls]', HTMLElement);
const error = element(area, '[role=alert]', HTMLElement);
function update() {
	const problem = state.problem();
	controls.hidden = Boolean(problem);
	error.hidden = !problem;
	if (problem) {
		error.textContent =
			(problem === 'notHttps' ? area.dataset.notHttps : area.dataset.noCookies) ?? '';
		return;
	}
	checkbox.checked = state.hasConsent();
	for (const node of area.querySelectorAll('[data-tracked]'))
		if (node instanceof HTMLElement)
			node.hidden = node.dataset.tracked !== String(checkbox.checked);
}
checkbox.addEventListener('change', () => {
	if (!(checkbox.checked ? state.giveConsent() : state.revokeConsent()))
		debug('Privacy', 'Browser refused a preference cookie');
	update();
});
update();
window.addEventListener('pageshow', (event) => {
	if (event.persisted) update();
});
