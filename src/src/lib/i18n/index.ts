import { en } from './en';
import { it } from './it';
import { locale, type Locale } from '$lib/stores/locale.svelte';
import { logI18n } from '$lib/utils/logger';

export type Translations = typeof en;

const translations: Record<Locale, Translations> = {
	en,
	it
};

/**
 * Get a nested value from an object using a dot-separated path
 */
function getNestedValue(obj: Record<string, unknown>, path: string): unknown {
	return path.split('.').reduce((current, key) => {
		if (current && typeof current === 'object' && key in current) {
			return (current as Record<string, unknown>)[key];
		}
		return undefined;
	}, obj as unknown);
}

/**
 * Get a translation for the current locale
 * @param key - Dot-separated path to the translation (e.g., 'home.heroName')
 * @returns The translated string or the key if not found
 */
export function t(key: string): string {
	const translation = getNestedValue(translations[locale.current], key);

	if (typeof translation === 'string') {
		return translation;
	}

	// Fallback to English if not found in current locale
	const fallback = getNestedValue(translations.en, key);
	if (typeof fallback === 'string') {
		logI18n.warn(`Missing translation for key "${key}" in locale "${locale.current}"`);
		return fallback;
	}

	logI18n.error(`Translation not found for key: ${key}`);
	return key;
}

/**
 * Get a translation object (for arrays or nested objects)
 * @param key - Dot-separated path to the translation
 * @returns The translation object or undefined if not found
 */
export function tObj<T = unknown>(key: string): T | undefined {
	const translation = getNestedValue(translations[locale.current], key);
	if (translation !== undefined) {
		return translation as T;
	}

	// Fallback to English
	const fallback = getNestedValue(translations.en, key);
	if (fallback !== undefined) {
		logI18n.warn(`Missing translation for key "${key}" in locale "${locale.current}"`);
		return fallback as T;
	}

	logI18n.error(`Translation not found for key: ${key}`);
	return undefined;
}

/**
 * Get all translations for the current locale
 */
export function getTranslations(): Translations {
	return translations[locale.current];
}

export { locale } from '$lib/stores/locale.svelte';
