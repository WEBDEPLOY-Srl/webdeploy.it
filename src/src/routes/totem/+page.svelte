<script lang="ts">
	import { t, tObj } from '$lib/i18n';
	import Hero from '$lib/components/Hero.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import KioskDemo from '$lib/components/KioskDemo.svelte';

	const features = ['linux', 'security', 'noLockIn'];
	const included = ['hardware', 'software', 'branding'];
</script>

<Seo
	title={t('totem.heroName')}
	description={t('totem.metaDescription')}
	image="/images/inwd-kiosk-photo.webp"
/>

<div class="kiosk-page">
	<Hero
		name={t('totem.heroName')}
		tagline={t('totem.heroTagline')}
		actions={[
			{ text: t('totem.learnMore'), href: '#why-linux', primary: true },
			{ text: t('totem.requestDemo'), href: 'mailto:info@webdeploy.it', primary: false }
		]}
	>
		{#snippet visual()}
			<KioskDemo />
		{/snippet}
	</Hero>

	<section class="kiosk-section kiosk-features" aria-label={t('totem.heroName')}>
		<div class="page-container kiosk-columns">
			{#each features as key (key)}
				<div class="kiosk-column">
					<h2>{t(`totem.features.${key}.title`)}</h2>
					<p class="section-lead">{t(`totem.features.${key}.details`)}</p>
				</div>
			{/each}
		</div>
	</section>

	<section
		id="why-linux"
		class="kiosk-section kiosk-section--band scroll-mt-24"
		aria-labelledby="kiosk-why-title"
	>
		<div class="page-container">
			<h2 id="kiosk-why-title" class="section-title">{t('totem.included.title')}</h2>
			<div class="kiosk-columns kiosk-columns--spaced">
				{#each included as key (key)}
					<div class="kiosk-column">
						<h3>{t(`totem.included.${key}.title`)}</h3>
						<ul class="section-points">
							{#each tObj<string[]>(`totem.included.${key}.items`) ?? [] as item}
								<li>{item}</li>
							{/each}
						</ul>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<section class="kiosk-section" aria-labelledby="kiosk-technology-title">
		<div class="page-container kiosk-split">
			<div>
				<h2 id="kiosk-technology-title" class="section-title">{t('totem.technology.title')}</h2>
				<p class="section-lead">{t('totem.technology.description')}</p>
				<p class="section-lead">{t('totem.technology.listTitle')}</p>
				<ul class="section-points">
					{#each tObj<string[]>('totem.technology.features') ?? [] as feature}
						<li>{feature}</li>
					{/each}
				</ul>
			</div>
			<div class="kiosk-panel">
				<h3>{t('totem.support.title')}</h3>
				<p class="section-lead">{t('totem.support.description')}</p>
				<ul class="section-points">
					{#each tObj<string[]>('totem.support.features') ?? [] as feature}
						<li>{feature}</li>
					{/each}
				</ul>
				<a href="https://inwd.org" class="btn-action">
					{t('totem.support.link')} <span aria-hidden="true">↗</span>
				</a>
			</div>
		</div>
	</section>

	<section class="kiosk-section kiosk-section--band" aria-labelledby="kiosk-applications-title">
		<div class="page-container">
			<h2 id="kiosk-applications-title" class="section-title">{t('totem.applications.title')}</h2>
			<p class="section-lead">{t('totem.applications.description')}</p>
			<ul class="kiosk-tiles">
				{#each tObj<string[]>('totem.applications.items') ?? [] as item}
					<li>{item}</li>
				{/each}
			</ul>
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
					<span class="sr-only">{t('common.opensInNewTab')}</span>
				</a>
			</p>
		</div>
	</section>
</div>

<style>
	.kiosk-page {
		font-family: var(--font-reading, system-ui, sans-serif);
	}

	.kiosk-section {
		padding: clamp(4rem, 8vw, 7rem) 0;
	}

	.kiosk-section--band {
		border-block: 1px solid rgba(0, 240, 255, 0.18);
		background: rgba(14, 22, 33, 0.68);
	}

	.kiosk-features {
		padding-top: 0;
	}

	.kiosk-columns {
		display: grid;
		gap: 2.5rem clamp(2rem, 4vw, 3.5rem);
	}

	.kiosk-columns--spaced {
		margin-top: clamp(2.5rem, 5vw, 3.5rem);
	}

	.kiosk-column {
		padding-top: 1.25rem;
		border-top: 2px solid var(--color-primary);
	}

	.kiosk-column h2,
	.kiosk-column h3,
	.kiosk-panel h3 {
		margin: 0;
		color: var(--color-secondary);
		font-family: var(--font-display);
		font-size: clamp(1.375rem, 2.2vw, 1.75rem);
		font-weight: 400;
		line-height: 1.2;
		text-transform: uppercase;
	}

	.kiosk-column .section-lead {
		margin-top: 0.75rem;
		font-size: 1rem;
	}

	.kiosk-split {
		display: grid;
		gap: clamp(2.5rem, 6vw, 5rem);
		align-items: start;
	}

	.kiosk-panel {
		padding: clamp(1.5rem, 3vw, 2.25rem);
		border: 1px solid rgba(0, 240, 255, 0.16);
		background: var(--color-background-dark);
	}

	.kiosk-tiles {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(16rem, 1fr));
		gap: 0.75rem;
		margin: 2rem 0 0;
		padding: 0;
		list-style: none;
	}

	.kiosk-tiles li {
		padding: 1.25rem;
		border: 1px solid rgba(0, 240, 255, 0.16);
		background: var(--color-background-dark);
		color: var(--color-text-body);
		line-height: 1.6;
	}

	@media (min-width: 48rem) {
		.kiosk-columns {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
	}

	@media (min-width: 64rem) {
		.kiosk-split {
			grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
		}
	}
</style>
