// @ts-check
// SPDX-FileCopyrightText: 2026 WEBDEPLOY S.R.L.
// SPDX-License-Identifier: AGPL-3.0-only
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
	CONSENT_COOKIE,
	CONSENT_REMOVED_COOKIE,
	createMatomoOptOut
} from '../assets/js/opt-out-cookie.mjs';

/** A cookie jar modeling path-independent values and expiry for the widget.
 * @param {Partial<import('../types.d.ts').OptOutEnvironment>} [overrides]
 */
function fakeEnvironment(overrides = {}) {
	const store = new Map();
	/** @type {string[]} */
	const writes = [];
	const clock = 1_700_000_000_000;
	/** @type {import('../types.d.ts').OptOutEnvironment} */
	const env = {
		cookies: {
			read: () => [...store].map(([k, v]) => `${k}=${v}`).join('; '),
			write(cookie) {
				writes.push(cookie);
				const [pair, ...attributes] = cookie.split(';');
				const [name, ...value] = pair.split('=');
				const expires = attributes.find((a) => a.startsWith('expires='));
				const expired = expires && Date.parse(expires.slice('expires='.length)) <= clock;
				if (expired) store.delete(name);
				else store.set(name, value.join('='));
			}
		},
		cookiesEnabled: true,
		isHttps: true,
		now: () => clock,
		...overrides
	};
	return { env, store, writes };
}

describe('createMatomoOptOut', () => {
	it('treats a visitor with no cookies as not opted out', () => {
		const { env } = fakeEnvironment();
		assert.equal(createMatomoOptOut(env).hasConsent(), true);
	});

	it('revoking sets mtm_consent_removed and clears mtm_consent', () => {
		const { env, store } = fakeEnvironment();
		store.set(CONSENT_COOKIE, '123');
		const optOut = createMatomoOptOut(env);

		assert.equal(optOut.revokeConsent(), true);
		assert.equal(store.has(CONSENT_REMOVED_COOKIE), true);
		assert.equal(store.has(CONSENT_COOKIE), false);
		assert.equal(optOut.hasConsent(), false);
	});

	it('giving consent again clears mtm_consent_removed', () => {
		const { env, store } = fakeEnvironment();
		const optOut = createMatomoOptOut(env);
		optOut.revokeConsent();

		assert.equal(optOut.giveConsent(), true);
		assert.equal(store.has(CONSENT_REMOVED_COOKIE), false);
		assert.equal(store.get(CONSENT_COOKIE), '1700000000000');
		assert.equal(optOut.hasConsent(), true);
	});

	it('lets the opt-out win and drops a stale consent cookie when both exist', () => {
		const { env, store } = fakeEnvironment();
		store.set(CONSENT_COOKIE, '123');
		store.set(CONSENT_REMOVED_COOKIE, '456');

		assert.equal(createMatomoOptOut(env).hasConsent(), false);
		assert.equal(store.has(CONSENT_COOKIE), false);
	});

	it('writes path, SameSite and, on HTTPS, Secure with a long lifetime', () => {
		const { env, writes } = fakeEnvironment();
		createMatomoOptOut(env).revokeConsent();
		const removed = writes.find((w) => w.startsWith(`${CONSENT_REMOVED_COOKIE}=`));

		assert.ok(removed?.includes(';path=/'));
		assert.ok(removed?.includes(';SameSite=Lax'));
		assert.ok(removed?.includes(';secure'));
		const expires = Date.parse(/expires=([^;]+)/.exec(removed ?? '')?.[1] ?? '');
		assert.ok(expires > 1_700_000_000_000 + 900_000_000_000);
	});

	it('omits Secure over plain HTTP', () => {
		const { env, writes } = fakeEnvironment({ isHttps: false });
		createMatomoOptOut(env).revokeConsent();
		assert.equal(
			writes.every((w) => !w.includes(';secure')),
			true
		);
	});

	it('reports a refused cookie instead of claiming success', () => {
		const { env } = fakeEnvironment({ cookies: { read: () => '', write: () => {} } });
		assert.equal(createMatomoOptOut(env).revokeConsent(), false);
	});

	it('reports why the opt-out cannot work', () => {
		assert.equal(createMatomoOptOut(fakeEnvironment().env).problem(), null);
		assert.equal(createMatomoOptOut(fakeEnvironment({ isHttps: false }).env).problem(), 'notHttps');
		// Cookies being off is reported before the protocol, as the widget always did.
		assert.equal(
			createMatomoOptOut(fakeEnvironment({ cookiesEnabled: false, isHttps: false }).env).problem(),
			'noCookies'
		);
	});

	it('decodes cookie values', () => {
		const { env, store } = fakeEnvironment();
		store.set(CONSENT_REMOVED_COOKIE, encodeURIComponent('a b'));
		assert.equal(createMatomoOptOut(env).hasConsent(), false);
	});
});
