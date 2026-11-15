import { browser } from '$app/environment';
import { logPrivacy } from '$lib/utils/logger';

export type ConsentValue = 'granted' | 'denied';

// Marketing (advertising) consent only. Matomo is cookieless and always on
// (no consent required); the Meta pixel sets cookies + profiles for ads, so it
// loads ONLY after explicit opt-in. Choice persisted in localStorage (the
// consent record itself is "strictly necessary" under GDPR).
const KEY = 'wd_consent_marketing';

class ConsentStore {
	/** null = not yet decided (show the banner) */
	marketing = $state<ConsentValue | null>(null);

	constructor() {
		if (browser) {
			const v = localStorage.getItem(KEY);
			if (v === 'granted' || v === 'denied') this.marketing = v;
		}
	}

	set(value: ConsentValue): void {
		this.marketing = value;
		if (browser) localStorage.setItem(KEY, value);
		logPrivacy.log('Marketing consent set to:', value);
	}
}

export const consent = new ConsentStore();
