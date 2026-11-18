// @ts-check
// SPDX-FileCopyrightText: 2026 WEBDEPLOY S.R.L.
// SPDX-License-Identifier: AGPL-3.0-only
/** @typedef {import('../../types.d.ts').ConsentChoice} ConsentChoice */
const key = 'wd_consent_marketing';
/** @type {ConsentChoice|null} */
let sessionChoice = null;
let memoryOnly = false;

/** @returns {ConsentChoice|null} */
export function marketingChoice() {
	if (memoryOnly) return sessionChoice;
	try {
		const saved = localStorage.getItem(key);
		return saved === 'granted' || saved === 'denied' ? saved : null;
	} catch {
		return sessionChoice;
	}
}

/** @param {ConsentChoice} choice @returns {void} */
export function setMarketing(choice) {
	sessionChoice = choice;
	try {
		localStorage.setItem(key, choice);
	} catch {
		memoryOnly = true;
	}
}
