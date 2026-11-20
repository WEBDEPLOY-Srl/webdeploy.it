// @ts-check
// SPDX-FileCopyrightText: 2026 WEBDEPLOY S.R.L.
// SPDX-License-Identifier: AGPL-3.0-only
const previous = document.querySelector('[data-history-back]');
if (previous instanceof HTMLButtonElement) {
	previous.hidden = false;
	previous.addEventListener('click', () => {
		if (history.length > 1) history.back();
		else location.assign('/');
	});
}
