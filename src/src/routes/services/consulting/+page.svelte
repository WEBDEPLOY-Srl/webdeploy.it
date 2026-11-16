<script lang="ts">
	import { t, tObj } from '$lib/i18n';
	import Seo from '$lib/components/Seo.svelte';
	import { siteUrl } from '$lib/config/site';
	import { publisherJsonLd } from '$lib/utils/structuredData';
	import ContactBand from '$lib/components/ContactBand.svelte';
	import ToolTiles from '$lib/components/ToolTiles.svelte';
</script>

<Seo
	title={t('services.consulting.title')}
	description={t('services.consulting.metaDescription')}
	image="/images/og/consulting.jpg"
	jsonLd={{
		'@context': 'https://schema.org',
		'@type': 'Service',
		name: t('services.consulting.title'),
		description: t('services.consulting.metaDescription'),
		serviceType: 'Open source consulting',
		url: siteUrl('/services/consulting'),
		provider: publisherJsonLd()
	}}
/>

<div class="services-page">
	<section class="home-service home-service--art-right" aria-labelledby="consulting-title">
		<div class="page-container home-service__layout">
			<div class="home-service__copy">
				<h1 id="consulting-title">{t('services.consulting.title')}</h1>
				<p class="home-service__subtitle">{t('services.consulting.subtitle')}</p>
				<ul class="section-points">
					{#each tObj<string[]>('services.consulting.items') ?? [] as item}
						<li>{item}</li>
					{/each}
				</ul>
			</div>
			<figure class="home-service__art">
				<ToolTiles label={t('services.cards.consulting.toolsLabel')} />
			</figure>
		</div>
	</section>

	<ContactBand />
</div>

<style>
	.services-page {
		font-family: var(--font-reading, system-ui, sans-serif);
	}

	h1 {
		margin: 0;
		color: white;
		font-family: var(--font-display);
		font-size: clamp(2.5rem, 5vw, 4rem);
		font-weight: 400;
		line-height: 1.05;
		text-transform: uppercase;
	}
</style>
