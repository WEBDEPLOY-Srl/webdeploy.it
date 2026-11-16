/**
 * Cookie handling for the Matomo opt-out on the privacy page. It follows
 * Matomo's own opt-out script: a visitor who opts out gets the
 * `mtm_consent_removed` cookie, which the tracker honours; opting back in
 * clears it.
 */

export const CONSENT_COOKIE = 'mtm_consent';
export const CONSENT_REMOVED_COOKIE = 'mtm_consent_removed';

/** About thirty years, the lifetime Matomo gives these cookies. */
const LONG_LIFETIME_MS = 946_080_000_000;
/** A lifetime in the past, which deletes the cookie. */
const EXPIRED_MS = -129_600_000;

/** Reads and writes the `document.cookie` string, so tests can supply a fake. */
export interface CookieJar {
	read(): string;
	write(cookie: string): void;
}

export interface OptOutEnvironment {
	cookies: CookieJar;
	cookiesEnabled: boolean;
	isHttps: boolean;
	now(): number;
}

/** Why the opt-out cannot work in the current page, if it cannot. */
export type OptOutProblem = 'noCookies' | 'notHttps';

export interface MatomoOptOut {
	problem(): OptOutProblem | null;
	/** True while the visitor has not opted out. */
	hasConsent(): boolean;
	/** Opt back in. Returns false if the browser refused a cookie. */
	giveConsent(): boolean;
	/** Opt out. Returns false if the browser refused a cookie. */
	revokeConsent(): boolean;
}

export function createMatomoOptOut(env: OptOutEnvironment): MatomoOptOut {
	function readCookie(name: string): string | null {
		const match = new RegExp(`(^|;)[ ]*${name}=([^;]*)`).exec(env.cookies.read());
		return match ? decodeURIComponent(match[2]) : null;
	}

	function writeCookie(name: string, value: string, lifetimeMs: number): boolean {
		const expires = new Date(env.now() + lifetimeMs).toUTCString();
		// The cookie is only marked Secure on HTTPS; the opt-out refuses to run elsewhere anyway.
		env.cookies.write(
			`${name}=${encodeURIComponent(value)};expires=${expires};path=/;SameSite=Lax${
				env.isHttps ? ';secure' : ''
			}`
		);
		// A cookie that was meant to be deleted is gone when it reads back as absent.
		return lifetimeMs < 0 ? readCookie(name) === null : readCookie(name) === value;
	}

	function hasConsent(): boolean {
		const consent = readCookie(CONSENT_COOKIE);
		const removed = readCookie(CONSENT_REMOVED_COOKIE);
		if (!removed) return true;
		// Both present means the cookies disagree: the opt-out wins and the stale consent goes.
		if (consent) writeCookie(CONSENT_COOKIE, '', EXPIRED_MS);
		return false;
	}

	return {
		problem() {
			if (!env.cookiesEnabled) return 'noCookies';
			if (!env.isHttps) return 'notHttps';
			return null;
		},
		hasConsent,
		giveConsent() {
			const cleared = writeCookie(CONSENT_REMOVED_COOKIE, '', EXPIRED_MS);
			const set = writeCookie(CONSENT_COOKIE, String(env.now()), LONG_LIFETIME_MS);
			return cleared && set;
		},
		revokeConsent() {
			const cleared = writeCookie(CONSENT_COOKIE, '', EXPIRED_MS);
			const set = writeCookie(CONSENT_REMOVED_COOKIE, String(env.now()), LONG_LIFETIME_MS);
			return cleared && set;
		}
	};
}

/** The real page's cookies, protocol and clock. Call in the browser only. */
export function browserOptOutEnvironment(): OptOutEnvironment {
	return {
		cookies: {
			read: () => document.cookie,
			write: (cookie) => {
				document.cookie = cookie;
			}
		},
		cookiesEnabled: navigator.cookieEnabled,
		isHttps: location.protocol === 'https:',
		now: () => Date.now()
	};
}
