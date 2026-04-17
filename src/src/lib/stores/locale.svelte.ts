import { browser } from '$app/environment';
import { logI18n } from '$lib/utils/logger';

export type Locale = 'en' | 'it';

const COOKIE_NAME = 'nf_lang';
const COOKIE_EXPIRY = new Date('2030-01-01');

function getCookie(name: string): string | null {
	if (!browser) return null;
	const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
	return match ? match[2] : null;
}

function setCookie(name: string, value: string): void {
	if (!browser) return;
	document.cookie = `${name}=${value}; expires=${COOKIE_EXPIRY.toUTCString()}; path=/`;
}

function detectLocale(): Locale {
	if (!browser) return 'en';

	// 1. Check cookie first
	const cookieLocale = getCookie(COOKIE_NAME);
	if (cookieLocale === 'en' || cookieLocale === 'it') {
		return cookieLocale;
	}

	// 2. Check browser language
	const browserLang = navigator.language.toLowerCase();
	if (browserLang.startsWith('it')) {
		return 'it';
	}

	// 3. Default to English
	return 'en';
}

class LocaleStore {
	current: Locale = $state('en');

	constructor() {
		if (browser) {
			this.current = detectLocale();
		}
	}

	setLocale(locale: Locale) {
		this.current = locale;
		setCookie(COOKIE_NAME, locale);
		logI18n.log(`Locale changed to: ${locale}`);
	}

	toggle() {
		const newLocale = this.current === 'en' ? 'it' : 'en';
		this.setLocale(newLocale);
	}
}

export const locale = new LocaleStore();
