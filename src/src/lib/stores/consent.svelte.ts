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

	/** True while the visitor has reopened the banner from the footer to change a decision. */
	reopened = $state(false);

	constructor() {
		if (browser) {
			const v = localStorage.getItem(KEY);
			if (v === 'granted' || v === 'denied') this.marketing = v;
		}
	}

	/** Whether the banner is on screen: before a decision, or when reopened. */
	get bannerVisible(): boolean {
		return this.marketing === null || this.reopened;
	}

	reopen(): void {
		this.reopened = true;
	}

	dismiss(): void {
		this.reopened = false;
	}

	set(value: ConsentValue): void {
		this.marketing = value;
		this.reopened = false;
		if (browser) localStorage.setItem(KEY, value);
		logPrivacy.log('Marketing consent set to:', value);
	}
}

export const consent = new ConsentStore();
