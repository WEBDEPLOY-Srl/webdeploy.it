<script lang="ts">
	import { t } from '$lib/i18n';
	import Hero from '$lib/components/Hero.svelte';
	import FeatureCard from '$lib/components/FeatureCard.svelte';
	import Seo from '$lib/components/Seo.svelte';
</script>

<Seo
	title={t('home.heroText')}
	description={t('home.heroTagline')}
	image="/webdeploy-logo.svg"
/>

<!-- Hero Section -->
<Hero
	name={t('home.heroName')}
	text={t('home.heroText')}
	tagline={t('home.heroTagline')}
	image="/webdeploy-logo.svg"
	imageAlt="WebDeploy Logo"
	actions={[
		{ text: t('home.manifestoBtn'), href: '/developer-manifesto', primary: true },
		{ text: t('home.servicesBtn'), href: '/services', primary: false }
	]}
/>

<!-- Features Section -->
<section class="py-24 bg-background-dark relative">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="text-center max-w-3xl mx-auto mb-20">
			<h2 class="text-4xl sm:text-5xl font-display uppercase text-white mb-6">
				{t('home.systemCapabilities')} <span class="text-secondary">{t('home.capabilities')}</span>
			</h2>
			<p class="text-lg text-slate-400 font-mono">
				&gt; {t('home.capabilitiesLine1')}<br />
				&gt; {t('home.capabilitiesLine2')}
			</p>
		</div>
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
			<FeatureCard
				title={t('home.features.linux.title')}
				details={t('home.features.linux.details')}
				iconSrc="/icon-linux.svg"
				variant="primary"
				animationDelay={0}
			/>
			<FeatureCard
				title={t('home.features.privacy.title')}
				details={t('home.features.privacy.details')}
				iconSrc="/icon-privacy.svg"
				variant="primary"
				animationDelay={100}
			/>
			<FeatureCard
				title={t('home.features.inwd.title')}
				details={t('home.features.inwd.details')}
				iconSrc="/icon-inwd.svg"
				variant="secondary"
				animationDelay={200}
			/>
		</div>
	</div>
</section>

<!-- Company Image Section -->
<section class="py-12 border-y-2 border-primary/20 bg-surface-dark relative">
	<div class="max-w-7xl mx-auto px-4">
		<div class="relative aspect-[21/9]">
			<img
				src="/webdeploy-hq.svg"
				alt="WebDeploy Headquarters"
				width="1200"
				height="514"
				loading="lazy"
				decoding="async"
				class="w-full h-auto border-4 border-slate-700"
			/>
		</div>
	</div>
</section>

<!-- CTA Section -->
<section class="py-20 bg-secondary relative overflow-hidden">
	<div class="absolute top-0 left-0 w-full h-2 bg-primary/50"></div>
	<div class="absolute bottom-0 left-0 w-full h-2 bg-primary/50"></div>
	<div class="max-w-4xl mx-auto px-4 text-center relative z-10">
		<h2 class="text-4xl sm:text-5xl font-display uppercase text-black mb-6">
			{t('home.ctaTitle')}
		</h2>
		<p class="text-black/80 font-bold font-mono text-lg mb-10 max-w-2xl mx-auto uppercase">
			{t('home.ctaDescription')}
		</p>
		<div class="flex flex-col sm:flex-row gap-6 justify-center">
			<a
				href="/contacts"
				class="btn-cta-primary text-lg font-bold py-4 px-10 uppercase tracking-widest"
			>
				{t('home.ctaContact')}
			</a>
			<a
				href="/services"
				class="btn-cta-secondary text-lg font-bold py-4 px-10 uppercase tracking-widest"
			>
				{t('home.ctaServices')}
			</a>
		</div>
	</div>
</section>
