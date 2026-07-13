<script lang="ts">
	import { t, tObj } from '$lib/i18n';
	import Seo from '$lib/components/Seo.svelte';
	import EarlyAccessForm from '$lib/components/EarlyAccessForm.svelte';
	import { onMount } from 'svelte';
	import { initGoogleAds } from '$lib/utils/googleAds';
	import { trackMetaEvent } from '$lib/utils/metaPixel';

	// On landing: capture the GCLID (Google) into a first-party cookie, and fire
	// the Meta ViewContent event. Both no-op until configured / consented.
	onMount(() => {
		initGoogleAds();
		trackMetaEvent('ViewContent', { content_name: 'early-access', content_category: 'lead-magnet' });
	});
</script>

<Seo title={t('earlyAccess.title')} description={t('earlyAccess.subtitle')} />

<div class="py-16 lg:py-24">
	<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
		<!-- Page Title -->
		<div class="text-center mb-12">
			<h1 class="text-5xl sm:text-6xl font-display uppercase text-white mb-4">
				<span class="text-primary">&gt;</span>
				{t('earlyAccess.title')}
			</h1>
			<p class="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
				{t('earlyAccess.subtitle')}
			</p>
		</div>

		<div class="grid lg:grid-cols-5 gap-8 lg:gap-12 items-start">
			<!-- What you get -->
			<div class="lg:col-span-2 card-retro bg-surface-dark p-8">
				<h2 class="text-xl font-display uppercase text-primary mb-6 flex items-center gap-2">
					<span aria-hidden="true">🛡️</span>
					{t('earlyAccess.benefitsTitle')}
				</h2>
				<ul class="space-y-3">
					{#each tObj<string[]>('earlyAccess.benefits') ?? [] as benefit}
						<li class="text-slate-400 flex items-start gap-2 leading-relaxed">
							<span class="text-primary shrink-0">&#10003;</span>
							{benefit}
						</li>
					{/each}
				</ul>
			</div>

			<!-- Form -->
			<div class="lg:col-span-3">
				<EarlyAccessForm />
			</div>
		</div>
	</div>
</div>
