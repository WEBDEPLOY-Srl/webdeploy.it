<script lang="ts">
	import { t, tObj } from '$lib/i18n';
	import Seo from '$lib/components/Seo.svelte';
	import { onMount } from 'svelte';
	import { logEarlyAccess } from '$lib/utils/logger';
	import { fireGoogleAdsConversion } from '$lib/utils/googleAds';

	// Matomo goal for a *confirmed* signup (double opt-in complete), distinct from
	// the submit goal id 1 fired by the n8n workflow. Create this goal in Matomo
	// (the funnel spec); keep this id in sync with it.
	const MATOMO_SIGNUP_CONFIRMED_GOAL_ID = 2;

	// This page is the the email provider double-opt-in redirect target. On load, fire the
	// confirmed-signup goal + the Google Ads conversion (the ads test counts
	// this page as a confirmed lead). Deferred to a macrotask because this child
	// onMount runs before the root layout's Matomo bootstrap; the timeout lets the
	// layout queue setTrackerUrl/setSiteId ahead of our trackGoal.
	onMount(() => {
		const id = setTimeout(() => {
			window._paq = window._paq || [];
			window._paq.push(['trackGoal', MATOMO_SIGNUP_CONFIRMED_GOAL_ID]);
			logEarlyAccess.log('Matomo signup-confirmed goal fired', MATOMO_SIGNUP_CONFIRMED_GOAL_ID);
			fireGoogleAdsConversion();
		}, 0);
		return () => clearTimeout(id);
	});
</script>

<Seo title={t('earlyAccess.confirmed.title')} description={t('earlyAccess.confirmed.subtitle')} />

<div class="py-16 lg:py-24">
	<div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="text-center mb-12">
			<div class="text-6xl mb-6" aria-hidden="true">✅</div>
			<h1 class="text-4xl sm:text-5xl font-display uppercase text-white mb-4">
				<span class="text-primary">&gt;</span>
				{t('earlyAccess.confirmed.title')}
			</h1>
			<p class="text-lg text-slate-400 leading-relaxed">
				{t('earlyAccess.confirmed.subtitle')}
			</p>
		</div>

		<div class="card-retro bg-surface-dark p-8 mb-8">
			<h2 class="text-xl font-display uppercase text-primary mb-6">
				{t('earlyAccess.confirmed.nextTitle')}
			</h2>
			<ul class="space-y-3">
				{#each tObj<string[]>('earlyAccess.confirmed.next') ?? [] as step}
					<li class="text-slate-400 flex items-start gap-2 leading-relaxed">
						<span class="text-primary shrink-0">&rarr;</span>
						{step}
					</li>
				{/each}
			</ul>
		</div>

		<div class="text-center">
			<a href="/services#inwd" class="btn-retro-primary inline-block px-8 py-3 font-display uppercase">
				{t('earlyAccess.confirmed.cta')}
			</a>
			<p class="text-xs text-slate-500 mt-6">
				{t('earlyAccess.confirmed.tagline')}
			</p>
		</div>
	</div>
</div>
