<script lang="ts">
	import { t, tObj } from '$lib/i18n';
	import Seo from '$lib/components/Seo.svelte';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { logPrivacy } from '$lib/utils/logger';

	// Get opt-out translations
	type OptOutSettings = {
		OptOutComplete: string;
		OptOutCompleteBis: string;
		YouMayOptOut2: string;
		YouMayOptOut3: string;
		OptOutErrorNoCookies: string;
		OptOutErrorNotHttps: string;
		YouAreNotOptedOut: string;
		UncheckToOptOut: string;
		YouAreOptedOut: string;
		CheckToOptIn: string;
	};

	// Initialize Matomo opt-out widget
	onMount(() => {
		if (!browser) return;

		const optOutStrings = tObj<OptOutSettings>('privacy.optOut');
		if (!optOutStrings) return;

		const settings = {
			showIntro: true,
			divId: 'matomo-opt-out',
			useSecureCookies: true,
			cookiePath: null as string | null,
			cookieDomain: null as string | null,
			cookieSameSite: 'Lax',
			...optOutStrings
		};

		// Define MatomoConsent on window
		(window as any).MatomoConsent = {
			cookiesDisabled: !navigator || !navigator.cookieEnabled,
			CONSENT_COOKIE_NAME: 'mtm_consent',
			CONSENT_REMOVED_COOKIE_NAME: 'mtm_consent_removed',
			cookieIsSecure: false,
			useSecureCookies: true,
			cookiePath: '',
			cookieDomain: '',
			cookieSameSite: 'Lax',
			init: function (
				useSecureCookies: boolean,
				cookiePath: string,
				cookieDomain: string,
				cookieSameSite: string
			) {
				this.useSecureCookies = useSecureCookies;
				this.cookiePath = cookiePath;
				this.cookieDomain = cookieDomain;
				this.cookieSameSite = cookieSameSite;
				if (useSecureCookies && location.protocol !== 'https:') {
					logPrivacy.log('Cannot use secure cookies on http');
				} else {
					this.cookieIsSecure = useSecureCookies;
				}
			},
			hasConsent: function () {
				const consentCookie = this.getCookie(this.CONSENT_COOKIE_NAME);
				const removedCookie = this.getCookie(this.CONSENT_REMOVED_COOKIE_NAME);
				if (!consentCookie && !removedCookie) {
					return true;
				}
				if (removedCookie && consentCookie) {
					this.setCookie(this.CONSENT_COOKIE_NAME, '', -129600000);
					return false;
				}
				return consentCookie || consentCookie !== 0;
			},
			consentGiven: function () {
				this.setCookie(this.CONSENT_REMOVED_COOKIE_NAME, '', -129600000);
				this.setCookie(this.CONSENT_COOKIE_NAME, new Date().getTime(), 946080000000);
			},
			consentRevoked: function () {
				this.setCookie(this.CONSENT_COOKIE_NAME, '', -129600000);
				this.setCookie(this.CONSENT_REMOVED_COOKIE_NAME, new Date().getTime(), 946080000000);
			},
			getCookie: function (cookieName: string) {
				const cookiePattern = new RegExp('(^|;)[ ]*' + cookieName + '=([^;]*)');
				const cookieMatch = cookiePattern.exec(document.cookie);
				return cookieMatch ? window.decodeURIComponent(cookieMatch[2]) : 0;
			},
			setCookie: function (cookieName: string, value: string | number, msToExpire: number) {
				const expiryDate = new Date();
				expiryDate.setTime(new Date().getTime() + msToExpire);
				document.cookie =
					cookieName +
					'=' +
					window.encodeURIComponent(value) +
					(msToExpire ? ';expires=' + expiryDate.toGMTString() : '') +
					';path=' +
					(this.cookiePath || '/') +
					(this.cookieDomain ? ';domain=' + this.cookieDomain : '') +
					(this.cookieIsSecure ? ';secure' : '') +
					';SameSite=' +
					this.cookieSameSite;
				if (
					(!msToExpire || msToExpire >= 0) &&
					this.getCookie(cookieName) !== String(value)
				) {
					logPrivacy.log('Error setting cookie: ' + cookieName);
				}
			}
		};

		// Show content function
		function showContent(consent: boolean, errorMessage: string | null = null) {
			const errorBlock = '<p class="text-red-500 font-bold">';
			const div = document.getElementById(settings.divId);

			if (!div) {
				logPrivacy.log('Opt-out div not found');
				return;
			}

			if (!navigator || !navigator.cookieEnabled) {
				div.innerHTML = errorBlock + settings.OptOutErrorNoCookies + '</p>';
				return;
			}
			if (location.protocol !== 'https:') {
				div.innerHTML = errorBlock + settings.OptOutErrorNotHttps + '</p>';
				return;
			}
			if (errorMessage !== null) {
				div.innerHTML = errorBlock + errorMessage + '</p>';
				return;
			}

			let content = '';
			if (consent) {
				if (settings.showIntro) {
					content += '<p>' + settings.YouMayOptOut2 + ' ' + settings.YouMayOptOut3 + '</p>';
				}
				content +=
					'<input onclick="window.MatomoConsent.consentRevoked();window.showOptOutContent(false);" id="trackVisits" type="checkbox" checked="checked" />';
				content +=
					'<label for="trackVisits"><strong><span>' +
					settings.YouAreNotOptedOut +
					' ' +
					settings.UncheckToOptOut +
					'</span></strong></label>';
			} else {
				if (settings.showIntro) {
					content += '<p>' + settings.OptOutComplete + ' ' + settings.OptOutCompleteBis + '</p>';
				}
				content +=
					'<input onclick="window.MatomoConsent.consentGiven();window.showOptOutContent(true);" id="trackVisits" type="checkbox" />';
				content +=
					'<label for="trackVisits"><strong><span>' +
					settings.YouAreOptedOut +
					' ' +
					settings.CheckToOptIn +
					'</span></strong></label>';
			}
			div.innerHTML = content;
		}

		// Expose showContent globally for onclick handlers
		(window as any).showOptOutContent = showContent;

		// Initialize
		(window as any).MatomoConsent.init(
			settings.useSecureCookies,
			settings.cookiePath,
			settings.cookieDomain,
			settings.cookieSameSite
		);
		showContent((window as any).MatomoConsent.hasConsent());

		logPrivacy.log('Matomo opt-out widget initialized');
	});
</script>

<Seo title={t('privacy.title')} description={t('privacy.intro')} />

<div class="py-16 lg:py-24">
	<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
		<!-- Page Title -->
		<div class="text-center mb-16">
			<h1 class="text-5xl sm:text-6xl font-display uppercase text-white mb-4">
				<span class="text-primary">&gt;</span>
				{t('privacy.title')}
			</h1>
		</div>

		<div class="space-y-12">
			<!-- Intro -->
			<div class="card-retro bg-surface-dark p-8">
				<p class="text-slate-400 leading-relaxed">{t('privacy.intro')}</p>
			</div>

			<!-- Analytics Section -->
			<div class="card-retro bg-surface-dark p-8">
				<h2 class="text-2xl font-display uppercase text-primary mb-6 flex items-center gap-2">
					<span class="material-symbols-outlined">analytics</span>
					{t('privacy.analyticsTitle')}
				</h2>

				<p class="text-slate-400 mb-6 leading-relaxed">{t('privacy.analyticsText')}</p>

				<ul class="space-y-2 mb-6">
					{#each tObj<string[]>('privacy.analyticsFeatures') ?? [] as feature}
						<li class="text-slate-400 flex items-start gap-2">
							<span class="text-primary">&#10003;</span>
							{feature}
						</li>
					{/each}
				</ul>
			</div>

			<!-- Opt-out Section -->
			<div class="card-retro bg-surface-dark p-8">
				<h2 class="text-2xl font-display uppercase text-secondary mb-6 flex items-center gap-2">
					<span class="material-symbols-outlined">visibility_off</span>
					{t('privacy.optOutTitle')}
				</h2>

				<p class="text-slate-400 mb-6 leading-relaxed">{t('privacy.optOutText')}</p>

				<!-- Matomo Opt-out Widget -->
				<div id="matomo-opt-out"></div>
			</div>

			<!-- Data Collection Section -->
			<div class="card-retro bg-surface-dark p-8">
				<h2 class="text-2xl font-display uppercase text-primary mb-6 flex items-center gap-2">
					<span class="material-symbols-outlined">database</span>
					{t('privacy.dataTitle')}
				</h2>

				<p class="text-slate-400 mb-6 leading-relaxed">{t('privacy.dataText')}</p>

				<ul class="space-y-2">
					{#each tObj<string[]>('privacy.dataItems') ?? [] as item}
						<li class="text-slate-400 flex items-start gap-2">
							<span class="text-slate-600">&bull;</span>
							{item}
						</li>
					{/each}
				</ul>
			</div>

			<!-- Marketing Section -->
			<div class="card-retro bg-surface-dark p-8">
				<h2 class="text-2xl font-display uppercase text-secondary mb-6 flex items-center gap-2">
					<span class="material-symbols-outlined">ads_click</span>
					{t('privacy.marketingTitle')}
				</h2>

				<p class="text-slate-400 leading-relaxed">{t('privacy.marketingText')}</p>
			</div>

			<!-- DPA Section -->
			<div id="dpa" class="card-retro bg-surface-dark p-8 scroll-mt-24">
				<h2 class="text-2xl font-display uppercase text-secondary mb-6 flex items-center gap-2">
					<span class="material-symbols-outlined">contract</span>
					{t('privacy.dpaTitle')}
				</h2>

				<p class="text-slate-400 leading-relaxed">{t('privacy.dpaText')}</p>
			</div>

			<!-- Contact Section -->
			<div class="card-retro bg-surface-dark p-8">
				<h2 class="text-2xl font-display uppercase text-primary mb-6 flex items-center gap-2">
					<span class="material-symbols-outlined">mail</span>
					{t('privacy.contactTitle')}
				</h2>

				<p class="text-slate-400 mb-4 leading-relaxed">{t('privacy.contactText')}</p>

				<a href="mailto:info@webdeploy.it" class="text-primary hover:underline font-mono">
					info@webdeploy.it
				</a>
			</div>
		</div>
	</div>
</div>
