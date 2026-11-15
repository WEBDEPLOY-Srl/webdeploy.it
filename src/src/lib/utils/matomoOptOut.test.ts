import { describe, expect, it } from 'vitest';
import {
	CONSENT_COOKIE,
	CONSENT_REMOVED_COOKIE,
	createMatomoOptOut,
	type OptOutEnvironment
} from './matomoOptOut';

/** A cookie jar with just enough browser behaviour: attributes, expiry and deletion. */
function fakeEnvironment(overrides: Partial<OptOutEnvironment> = {}) {
	const store = new Map<string, string>();
	const writes: string[] = [];
	let clock = 1_700_000_000_000;
	const env: OptOutEnvironment = {
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
	return { env, store, writes, advance: (ms: number) => (clock += ms) };
}

describe('createMatomoOptOut', () => {
	it('treats a visitor with no cookies as not opted out', () => {
		const { env } = fakeEnvironment();
		expect(createMatomoOptOut(env).hasConsent()).toBe(true);
	});

	it('revoking sets mtm_consent_removed and clears mtm_consent', () => {
		const { env, store } = fakeEnvironment();
		store.set(CONSENT_COOKIE, '123');
		const optOut = createMatomoOptOut(env);

		expect(optOut.revokeConsent()).toBe(true);
		expect(store.has(CONSENT_REMOVED_COOKIE)).toBe(true);
		expect(store.has(CONSENT_COOKIE)).toBe(false);
		expect(optOut.hasConsent()).toBe(false);
	});

	it('giving consent again clears mtm_consent_removed', () => {
		const { env, store } = fakeEnvironment();
		const optOut = createMatomoOptOut(env);
		optOut.revokeConsent();

		expect(optOut.giveConsent()).toBe(true);
		expect(store.has(CONSENT_REMOVED_COOKIE)).toBe(false);
		expect(store.get(CONSENT_COOKIE)).toBe('1700000000000');
		expect(optOut.hasConsent()).toBe(true);
	});

	it('lets the opt-out win and drops a stale consent cookie when both exist', () => {
		const { env, store } = fakeEnvironment();
		store.set(CONSENT_COOKIE, '123');
		store.set(CONSENT_REMOVED_COOKIE, '456');

		expect(createMatomoOptOut(env).hasConsent()).toBe(false);
		expect(store.has(CONSENT_COOKIE)).toBe(false);
	});

	it('writes path, SameSite and, on HTTPS, Secure with a long lifetime', () => {
		const { env, writes } = fakeEnvironment();
		createMatomoOptOut(env).revokeConsent();
		const removed = writes.find((w) => w.startsWith(`${CONSENT_REMOVED_COOKIE}=`));

		expect(removed).toContain(';path=/');
		expect(removed).toContain(';SameSite=Lax');
		expect(removed).toContain(';secure');
		const expires = Date.parse(/expires=([^;]+)/.exec(removed ?? '')?.[1] ?? '');
		expect(expires).toBeGreaterThan(1_700_000_000_000 + 900_000_000_000);
	});

	it('omits Secure over plain HTTP', () => {
		const { env, writes } = fakeEnvironment({ isHttps: false });
		createMatomoOptOut(env).revokeConsent();
		expect(writes.every((w) => !w.includes(';secure'))).toBe(true);
	});

	it('reports a refused cookie instead of claiming success', () => {
		const { env } = fakeEnvironment({ cookies: { read: () => '', write: () => {} } });
		expect(createMatomoOptOut(env).revokeConsent()).toBe(false);
	});

	it('reports why the opt-out cannot work', () => {
		expect(createMatomoOptOut(fakeEnvironment().env).problem()).toBeNull();
		expect(createMatomoOptOut(fakeEnvironment({ isHttps: false }).env).problem()).toBe('notHttps');
		// Cookies being off is reported before the protocol, as the widget always did.
		expect(
			createMatomoOptOut(fakeEnvironment({ cookiesEnabled: false, isHttps: false }).env).problem()
		).toBe('noCookies');
	});

	it('decodes cookie values', () => {
		const { env, store } = fakeEnvironment();
		store.set(CONSENT_REMOVED_COOKIE, encodeURIComponent('a b'));
		expect(createMatomoOptOut(env).hasConsent()).toBe(false);
	});
});
