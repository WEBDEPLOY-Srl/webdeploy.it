// @ts-check
// SPDX-FileCopyrightText: 2026 WEBDEPLOY S.R.L.
// SPDX-License-Identifier: AGPL-3.0-only
export const CONSENT_COOKIE = 'mtm_consent';
export const CONSENT_REMOVED_COOKIE = 'mtm_consent_removed';
const lifetime = 946_080_000_000;
const expired = -129_600_000;

/** @param {import('../../types.d.ts').OptOutEnvironment} env @returns {import('../../types.d.ts').MatomoOptOut} */
export function createMatomoOptOut(env) {
	/** @param {string} name @returns {string|null} */
	function read(name) {
		const cookie = env.cookies
			.read()
			.split(/;\s*/)
			.find((item) => item.startsWith(name + '='));
		return cookie ? decodeURIComponent(cookie.slice(name.length + 1)) : null;
	}
	/** @param {string} name @param {string} value @param {number} age @returns {boolean} */
	function write(name, value, age) {
		try {
			env.cookies.write(
				`${name}=${encodeURIComponent(value)};expires=${new Date(env.now() + age).toUTCString()};path=/;SameSite=Lax${env.isHttps ? ';secure' : ''}`
			);
			return age < 0 ? read(name) === null : read(name) === value;
		} catch {
			return false;
		}
	}
	return {
		problem() {
			return !env.cookiesEnabled ? 'noCookies' : !env.isHttps ? 'notHttps' : null;
		},
		hasConsent() {
			if (!read(CONSENT_REMOVED_COOKIE)) return true;
			if (read(CONSENT_COOKIE)) write(CONSENT_COOKIE, '', expired);
			return false;
		},
		giveConsent() {
			const cleared = write(CONSENT_REMOVED_COOKIE, '', expired);
			return write(CONSENT_COOKIE, String(env.now()), lifetime) && cleared;
		},
		revokeConsent() {
			const cleared = write(CONSENT_COOKIE, '', expired);
			return write(CONSENT_REMOVED_COOKIE, String(env.now()), lifetime) && cleared;
		}
	};
}
