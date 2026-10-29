<script lang="ts">
	import { t, tObj } from '$lib/i18n';
	import Seo from '$lib/components/Seo.svelte';
</script>

<Seo title={t('security.title')} description={t('security.metaDescription')} />

<div class="py-16 lg:py-24">
	<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
		<!-- Page Title -->
		<div class="text-center mb-16">
			<h1 class="text-5xl sm:text-6xl font-display uppercase text-white mb-4">
				<span class="text-primary">&gt;</span>
				{t('security.heading')}
			</h1>
		</div>

		<div class="space-y-12">
			<!-- Who is responsible -->
			<section class="card-retro bg-surface-dark p-8" aria-labelledby="security-responsible">
				<h2 id="security-responsible" class="text-2xl font-display uppercase text-primary mb-6">
					{t('security.responsibleTitle')}
				</h2>
				<p class="text-slate-400 leading-relaxed">{t('security.responsibleText')}</p>
			</section>

			<!-- Reporting a vulnerability -->
			<section class="card-retro bg-surface-dark p-8" aria-labelledby="security-reporting">
				<h2 id="security-reporting" class="text-2xl font-display uppercase text-secondary mb-6">
					{t('security.reportingTitle')}
				</h2>

				<p class="text-slate-400 mb-6 leading-relaxed">
					{t('security.reportingIntro')}
					<a
						href="mailto:security@webdeploy.it"
						class="text-primary underline underline-offset-4 hover:text-white">security@webdeploy.it</a
					>.
				</p>

				<p class="text-slate-400 mb-4 leading-relaxed">{t('security.includeTitle')}</p>
				<ul class="space-y-2 mb-6">
					{#each tObj<string[]>('security.includeItems') ?? [] as item}
						<li class="text-slate-400 flex items-start gap-2">
							<span class="text-primary" aria-hidden="true">•</span>
							{item}
						</li>
					{/each}
				</ul>

				<p class="text-slate-400 mb-6 leading-relaxed">{t('security.acknowledgement')}</p>
				<p class="text-slate-400 mb-6 leading-relaxed">{t('security.disclosure')}</p>
				<p class="text-slate-400 leading-relaxed">{t('security.safeHarbour')}</p>
			</section>

			<!-- Our approach -->
			<section class="card-retro bg-surface-dark p-8" aria-labelledby="security-approach">
				<h2 id="security-approach" class="text-2xl font-display uppercase text-primary mb-6">
					{t('security.approachTitle')}
				</h2>
				<ul class="space-y-2">
					{#each tObj<string[]>('security.approachItems') ?? [] as item}
						<li class="text-slate-400 flex items-start gap-2">
							<span class="text-primary" aria-hidden="true">•</span>
							{item}
						</li>
					{/each}
				</ul>
			</section>

			<!-- Company details -->
			<section class="text-center text-sm font-mono text-slate-500" aria-label={t('security.companyLabel')}>
				<p>WEBDEPLOY SRL · P.IVA 02993340344 · Parma, Italy</p>
			</section>
		</div>
	</div>
</div>
