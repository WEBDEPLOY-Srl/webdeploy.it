<script lang="ts">
	import { t, tObj } from '$lib/i18n';
	import Seo from '$lib/components/Seo.svelte';
</script>

<Seo
	title={t('services.title')}
	description={t('services.inwd.description')}
	image="/inwd-infra.svg"
/>

<div class="py-16 lg:py-24">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<!-- Page Title -->
		<div class="text-center mb-16">
			<h1 class="text-5xl sm:text-6xl font-display uppercase text-white mb-4">
				<span class="text-primary">&gt;</span>
				{t('services.title')}
			</h1>
		</div>

		<!-- inwd Section -->
		<section id="inwd" class="mb-20 scroll-mt-24">
			<div class="card-retro bg-surface-dark p-8 lg:p-12">
				<div class="flex items-center gap-4 mb-6">
					<span class="text-4xl" aria-hidden="true">🏗️</span>
					<h2 class="text-3xl font-display uppercase text-white">{t('services.inwd.title')}</h2>
				</div>

				<img
					src="/inwd-infra.svg"
					alt="inwd infrastructure diagram"
					width="800"
					height="400"
					loading="lazy"
					decoding="async"
					class="w-full h-auto border-2 border-primary/30 mb-8"
				/>

				<p class="text-xl font-mono text-primary mb-4">{t('services.inwd.subtitle')}</p>
				<p class="text-slate-400 mb-8 leading-relaxed">{t('services.inwd.description')}</p>

				<h3 class="text-xl font-display uppercase text-secondary mb-4">
					{t('services.inwd.whatMakesDifferent')}
				</h3>
				<ul class="space-y-2 mb-8">
					{#each tObj<string[]>('services.inwd.features') || [] as feature}
						<li class="text-slate-400 font-mono text-sm flex items-start gap-2">
							<span class="text-primary" aria-hidden="true">✅</span>
							{feature}
						</li>
					{/each}
				</ul>

				<div class="grid md:grid-cols-2 gap-8">
					<!-- GitOps -->
					<div class="border-2 border-primary/30 p-6">
						<h4 class="text-lg font-display uppercase text-primary mb-4 flex items-center gap-2">
							<span aria-hidden="true">🚀</span>
							{t('services.inwd.gitops.title')}
						</h4>
						<ul class="space-y-2">
							{#each tObj<string[]>('services.inwd.gitops.items') || [] as item}
								<li class="text-slate-400 text-sm">• {item}</li>
							{/each}
						</ul>
					</div>

					<!-- Security -->
					<div class="border-2 border-primary/30 p-6">
						<h4 class="text-lg font-display uppercase text-primary mb-4 flex items-center gap-2">
							<span aria-hidden="true">🔒</span>
							{t('services.inwd.security.title')}
						</h4>
						<ul class="space-y-2">
							{#each tObj<string[]>('services.inwd.security.items') || [] as item}
								<li class="text-slate-400 text-sm">• {item}</li>
							{/each}
						</ul>
					</div>

					<!-- Observability -->
					<div class="border-2 border-secondary/30 p-6">
						<h4 class="text-lg font-display uppercase text-secondary mb-4 flex items-center gap-2">
							<span aria-hidden="true">📊</span>
							{t('services.inwd.observability.title')}
						</h4>
						<ul class="space-y-2">
							{#each tObj<string[]>('services.inwd.observability.items') || [] as item}
								<li class="text-slate-400 text-sm">• {item}</li>
							{/each}
						</ul>
					</div>

					<!-- Multi-Cloud -->
					<div class="border-2 border-secondary/30 p-6">
						<h4 class="text-lg font-display uppercase text-secondary mb-4 flex items-center gap-2">
							<span aria-hidden="true">🔄</span>
							{t('services.inwd.multiCloud.title')}
						</h4>
						<ul class="space-y-2">
							{#each tObj<string[]>('services.inwd.multiCloud.items') || [] as item}
								<li class="text-slate-400 text-sm">• {item}</li>
							{/each}
						</ul>
					</div>
				</div>
			</div>
		</section>

		<!-- Linux Migration Section -->
		<section id="linux" class="mb-20 scroll-mt-24">
			<div class="card-retro bg-surface-dark p-8 lg:p-12">
				<div class="flex items-center gap-4 mb-6">
					<span class="text-4xl" aria-hidden="true">🐧</span>
					<h2 class="text-3xl font-display uppercase text-white">{t('services.linux.title')}</h2>
				</div>

				<p class="text-xl font-mono text-primary mb-4">{t('services.linux.subtitle')}</p>
				<p class="text-slate-400 mb-8 leading-relaxed">{t('services.linux.description')}</p>

				<div class="grid md:grid-cols-3 gap-8">
					<!-- Assessment -->
					<div class="border-2 border-primary/30 p-6">
						<h4 class="text-lg font-display uppercase text-primary mb-4 flex items-center gap-2">
							<span aria-hidden="true">📋</span>
							{t('services.linux.assessment.title')}
						</h4>
						<ul class="space-y-2">
							{#each tObj<string[]>('services.linux.assessment.items') || [] as item}
								<li class="text-slate-400 text-sm">• {item}</li>
							{/each}
						</ul>
					</div>

					<!-- Transition -->
					<div class="border-2 border-primary/30 p-6">
						<h4 class="text-lg font-display uppercase text-primary mb-4 flex items-center gap-2">
							<span aria-hidden="true">🔄</span>
							{t('services.linux.transition.title')}
						</h4>
						<ul class="space-y-2">
							{#each tObj<string[]>('services.linux.transition.items') || [] as item}
								<li class="text-slate-400 text-sm">• {item}</li>
							{/each}
						</ul>
					</div>

					<!-- Training -->
					<div class="border-2 border-secondary/30 p-6">
						<h4 class="text-lg font-display uppercase text-secondary mb-4 flex items-center gap-2">
							<span aria-hidden="true">🎓</span>
							{t('services.linux.training.title')}
						</h4>
						<ul class="space-y-2">
							{#each tObj<string[]>('services.linux.training.items') || [] as item}
								<li class="text-slate-400 text-sm">• {item}</li>
							{/each}
						</ul>
					</div>
				</div>
			</div>
		</section>

		<!-- Kiosk Section -->
		<section id="kiosk" class="mb-20 scroll-mt-24">
			<div class="card-retro bg-surface-dark p-8 lg:p-12">
				<div class="flex items-center gap-4 mb-6">
					<span class="text-4xl" aria-hidden="true">🖥️</span>
					<h2 class="text-3xl font-display uppercase text-white">{t('services.kiosk.title')}</h2>
				</div>

				<p class="text-xl font-mono text-primary mb-4">{t('services.kiosk.subtitle')}</p>
				<p class="text-slate-400 mb-8 leading-relaxed">{t('services.kiosk.description')}</p>

				<a
					href="/totem"
					class="btn-retro-primary inline-block text-lg font-bold py-3 px-8 uppercase tracking-widest"
				>
					{t('services.kiosk.learnMore')} →
				</a>
			</div>
		</section>

		<!-- Consulting Section -->
		<section id="consulting" class="mb-20 scroll-mt-24">
			<div class="card-retro bg-surface-dark p-8 lg:p-12">
				<div class="flex items-center gap-4 mb-6">
					<span class="text-4xl" aria-hidden="true">💡</span>
					<h2 class="text-3xl font-display uppercase text-white">
						{t('services.consulting.title')}
					</h2>
				</div>

				<p class="text-xl font-mono text-secondary mb-8">{t('services.consulting.subtitle')}</p>

				<ul class="space-y-4">
					{#each tObj<string[]>('services.consulting.items') || [] as item}
						<li class="text-slate-400 flex items-start gap-2">
							<span class="text-primary">•</span>
							{item}
						</li>
					{/each}
				</ul>
			</div>
		</section>

		<!-- CTA Section -->
		<section class="text-center bg-surface-dark border-2 border-primary p-8 lg:p-12">
			<h2 class="text-3xl font-display uppercase text-white mb-4">{t('services.cta.title')}</h2>
			<p class="text-slate-400 mb-8 max-w-2xl mx-auto">{t('services.cta.description')}</p>

			<div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
				<a href="mailto:info@webdeploy.it" class="btn-retro-primary py-3 px-8 font-bold uppercase">
					{t('services.cta.contactUs')} info@webdeploy.it
				</a>
				<a
					href="mailto:careers@webdeploy.it"
					class="btn-retro-secondary py-3 px-8 font-bold uppercase"
				>
					{t('services.cta.careers')} careers@webdeploy.it
				</a>
			</div>
		</section>
	</div>
</div>
