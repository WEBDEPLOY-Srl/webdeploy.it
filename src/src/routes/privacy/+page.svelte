<script lang="ts">
	import { t, tObj } from '#lib/i18n/index.ts';
	import Seo from '#lib/components/Seo.svelte';
	import { site } from '#lib/config/site.ts';
	import MatomoOptOut from '#lib/components/MatomoOptOut.svelte';
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
				<h2 class="text-2xl font-display uppercase text-primary mb-6">
					{t('privacy.analyticsTitle')}
				</h2>

				<p class="text-slate-400 mb-6 leading-relaxed">{t('privacy.analyticsText')}</p>

				<ul class="space-y-2 mb-6">
					{#each tObj<string[]>('privacy.analyticsFeatures') ?? [] as feature}
						<li class="text-slate-400 flex items-start gap-2">
							<span class="text-primary">•</span>
							{feature}
						</li>
					{/each}
				</ul>
			</div>

			<!-- Opt-out Section -->
			<div class="card-retro bg-surface-dark p-8">
				<h2 class="text-2xl font-display uppercase text-secondary mb-6">
					{t('privacy.optOutTitle')}
				</h2>

				<p class="text-slate-400 mb-6 leading-relaxed">{t('privacy.optOutText')}</p>

				<MatomoOptOut />
			</div>

			<!-- Data Collection Section -->
			<div class="card-retro bg-surface-dark p-8">
				<h2 class="text-2xl font-display uppercase text-primary mb-6">
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

				<p class="text-slate-400 mt-6 leading-relaxed">{t('privacy.mapText')}</p>
			</div>

			<!-- Marketing Section -->
			<div class="card-retro bg-surface-dark p-8">
				<h2 class="text-2xl font-display uppercase text-secondary mb-6">
					{t('privacy.marketingTitle')}
				</h2>

				<p class="text-slate-400 leading-relaxed">{t('privacy.marketingText')}</p>
			</div>

			<!-- DPA Section -->
			<div id="dpa" class="card-retro bg-surface-dark p-8 scroll-mt-24">
				<h2 class="text-2xl font-display uppercase text-secondary mb-6">
					{t('privacy.dpaTitle')}
				</h2>

				<p class="text-slate-400 leading-relaxed">{t('privacy.dpaText')}</p>
			</div>

			<!-- Contact Section -->
			<div class="card-retro bg-surface-dark p-8">
				<h2 class="text-2xl font-display uppercase text-primary mb-6">
					{t('privacy.contactTitle')}
				</h2>

				<p class="text-slate-400 mb-4 leading-relaxed">{t('privacy.contactText')}</p>

				<a href="mailto:{site.contact.email}" class="text-primary hover:underline font-mono">
					{site.contact.email}
				</a>
			</div>
		</div>
	</div>
</div>
