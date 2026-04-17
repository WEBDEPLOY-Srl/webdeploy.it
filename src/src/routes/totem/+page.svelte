<script lang="ts">
	import { t, tObj } from '$lib/i18n';
	import Hero from '$lib/components/Hero.svelte';
	import FeatureCard from '$lib/components/FeatureCard.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import { scrollReveal } from '$lib/actions/scrollReveal';
</script>

<Seo
	title={t('totem.heroName')}
	description={t('totem.heroTagline')}
	image="/inwd-kiosk.svg"
/>

<!-- Hero Section -->
<Hero
	name={t('totem.heroName')}
	tagline={t('totem.heroTagline')}
	image="/inwd-kiosk.svg"
	imageAlt="inWD Kiosk diagram"
	actions={[
		{ text: t('totem.requestDemo'), href: 'mailto:info@webdeploy.it', primary: false },
		{ text: t('totem.learnMore'), href: '#why-linux', primary: true }
	]}
/>

<!-- Features Section -->
<section class="py-24 bg-background-dark relative">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="grid grid-cols-1 md:grid-cols-3 gap-8">
			<FeatureCard
				title={t('totem.features.openSource.title')}
				details={t('totem.features.openSource.details')}
				icon="🐧"
				variant="primary"
				animationDelay={0}
			/>
			<FeatureCard
				title={t('totem.features.windowsFree.title')}
				details={t('totem.features.windowsFree.details')}
				icon="🚫"
				variant="primary"
				animationDelay={100}
			/>
			<FeatureCard
				title={t('totem.features.developer.title')}
				details={t('totem.features.developer.details')}
				icon="🛠️"
				variant="secondary"
				animationDelay={200}
			/>
		</div>
	</div>
</section>

<!-- Why Linux Section -->
<section id="why-linux" class="py-24 bg-surface-dark border-y-2 border-primary/20 scroll-mt-24">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<h2 class="text-4xl font-display uppercase text-white text-center mb-16">
			{t('totem.whyLinux.title')}
		</h2>

		<div class="grid md:grid-cols-3 gap-8">
			<!-- Freedom -->
			<div class="card-retro bg-background-dark p-8 scroll-animate" use:scrollReveal={{ delay: 0 }}>
				<h3 class="text-xl font-display uppercase text-primary mb-4 flex items-center gap-2">
					<span aria-hidden="true">🔓</span>
					{t('totem.whyLinux.freedom.title')}
				</h3>
				<ul class="space-y-3">
					{#each tObj<string[]>('totem.whyLinux.freedom.items') || [] as item}
						<li class="text-slate-400 text-sm flex items-start gap-2">
							<span class="text-primary">•</span>
							{item}
						</li>
					{/each}
				</ul>
			</div>

			<!-- Security -->
			<div class="card-retro bg-background-dark p-8 scroll-animate" use:scrollReveal={{ delay: 100 }}>
				<h3 class="text-xl font-display uppercase text-primary mb-4 flex items-center gap-2">
					<span aria-hidden="true">🔒</span>
					{t('totem.whyLinux.security.title')}
				</h3>
				<ul class="space-y-3">
					{#each tObj<string[]>('totem.whyLinux.security.items') || [] as item}
						<li class="text-slate-400 text-sm flex items-start gap-2">
							<span class="text-primary">•</span>
							{item}
						</li>
					{/each}
				</ul>
			</div>

			<!-- Performance -->
			<div class="card-retro bg-background-dark p-8 scroll-animate" use:scrollReveal={{ delay: 200 }}>
				<h3 class="text-xl font-display uppercase text-secondary mb-4 flex items-center gap-2">
					<span aria-hidden="true">⚡</span>
					{t('totem.whyLinux.performance.title')}
				</h3>
				<ul class="space-y-3">
					{#each tObj<string[]>('totem.whyLinux.performance.items') || [] as item}
						<li class="text-slate-400 text-sm flex items-start gap-2">
							<span class="text-secondary">•</span>
							{item}
						</li>
					{/each}
				</ul>
			</div>
		</div>
	</div>
</section>

<!-- Sonmi Partnership Section -->
<section class="py-24 bg-background-dark">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="grid lg:grid-cols-2 gap-16 items-center">
			<div>
				<h2 class="text-3xl font-display uppercase text-white mb-6">{t('totem.sonmi.title')}</h2>
				<p class="text-slate-400 mb-8">{t('totem.sonmi.description')}</p>
				<ul class="space-y-4">
					{#each tObj<string[]>('totem.sonmi.features') || [] as feature}
						<li class="text-slate-400 flex items-start gap-2">
							<span class="text-primary">•</span>
							{feature}
						</li>
					{/each}
				</ul>
			</div>

			<div class="card-retro bg-surface-dark p-8">
				<h3 class="text-2xl font-display uppercase text-primary mb-6">{t('totem.iac.title')}</h3>
				<p class="text-slate-400 mb-6">{t('totem.iac.description')}</p>
				<ul class="space-y-3">
					{#each tObj<string[]>('totem.iac.features') || [] as feature}
						<li class="text-slate-400 text-sm flex items-start gap-2">
							<span class="text-secondary">✅</span>
							{feature}
						</li>
					{/each}
				</ul>
			</div>
		</div>
	</div>
</section>

<!-- Applications Section -->
<section class="py-24 bg-surface-dark border-y-2 border-primary/20">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<h2 class="text-4xl font-display uppercase text-white text-center mb-6">
			{t('totem.applications.title')}
		</h2>
		<p class="text-slate-400 text-center mb-12">{t('totem.applications.description')}</p>

		<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
			{#each tObj<string[]>('totem.applications.items') || [] as item}
				<div class="bg-background-dark border-2 border-primary/30 p-6 hover:border-primary transition-colors">
					<p class="text-slate-400 flex items-start gap-2">
						<span class="text-primary">✔️</span>
						{item}
					</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- CTA Section -->
<section class="py-20 bg-secondary relative overflow-hidden">
	<div class="absolute top-0 left-0 w-full h-2 bg-primary/50"></div>
	<div class="absolute bottom-0 left-0 w-full h-2 bg-primary/50"></div>
	<div class="max-w-4xl mx-auto px-4 text-center relative z-10">
		<h2 class="text-4xl sm:text-5xl font-display uppercase text-black mb-6">
			{t('totem.cta.title')}
		</h2>
		<p class="text-black/80 font-bold font-mono text-lg mb-10">
			{t('totem.cta.description')}
		</p>
		<a
			href="mailto:info@webdeploy.it"
			class="btn-cta-primary inline-block text-lg font-bold py-4 px-10 uppercase tracking-widest"
		>
			{t('totem.cta.button')}
		</a>

		<p class="mt-8 text-black font-mono">
			<strong>{t('totem.cta.email')}:</strong> info@webdeploy.it<br />
			<strong>{t('totem.cta.partnership')}:</strong> {t('totem.cta.poweredBy')}
			<a href="https://m4ss.net" target="_blank" rel="noopener noreferrer" class="underline">
				m4ss.net
				<span class="sr-only">(opens in new tab)</span>
			</a> Sonmi OS
		</p>
	</div>
</section>
