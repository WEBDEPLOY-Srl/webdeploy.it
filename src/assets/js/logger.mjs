// @ts-check
// SPDX-FileCopyrightText: 2026 WEBDEPLOY S.R.L.
// SPDX-License-Identifier: AGPL-3.0-only

/** @param {string} area @param {string} message @returns {void} */
export function debug(area, message) {
	if (location.hostname !== '127.0.0.1' && location.hostname !== 'localhost') return;
	try {
		if (sessionStorage.getItem('wd_debug') === '1') console.debug('[' + area + ']', message);
	} catch {
		/* A blocked storage API must never prevent a visitor action. */
	}
}
