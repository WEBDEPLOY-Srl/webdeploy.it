<script lang="ts">
	import { t } from '$lib/i18n';
	import Seo from '$lib/components/Seo.svelte';
	import { siteUrl } from '$lib/config/site';
	import { publisherJsonLd } from '$lib/utils/structuredData';
	import ContactBand from '$lib/components/ContactBand.svelte';

	const sections = ['encrypted', 'open', 'access', 'restore'] as const;
</script>

<Seo
	title={t('services.backup.title')}
	description={t('services.backup.metaDescription')}
	image="/images/og/backup.jpg"
	jsonLd={{
		'@context': 'https://schema.org',
		'@type': 'Service',
		name: t('services.backup.title'),
		description: t('services.backup.metaDescription'),
		serviceType: 'Encrypted backup',
		url: siteUrl('/services/backup'),
		provider: publisherJsonLd()
	}}
/>

<div class="services-page">
	<section class="home-service home-service--art-right" aria-labelledby="backup-title">
		<div class="page-container home-service__layout">
			<div class="home-service__copy">
				<h1 id="backup-title" class="section-title backup-title">{t('services.backup.title')}</h1>
				<p class="home-service__subtitle">{t('services.backup.subtitle')}</p>
				<p class="section-lead">{t('services.backup.description')}</p>
			</div>
			<figure class="home-service__art">
				<!-- Official BorgBackup logo, recoloured; notices in the SVG and the licence file. -->
				<img
					class="home-service__image home-service__image--logo"
					src="/images/borgbackup-logo.svg"
					alt={t('services.backup.imageAlt')}
					width="320"
					height="133"
					fetchpriority="high"
					decoding="async"
				/>
				<figcaption class="home-service__credit">
					{t('services.backup.imageCredit')}
					<a href="/images/borgbackup-logo-LICENSE.txt">{t('services.backup.licenceLink')}</a>
				</figcaption>
			</figure>
		</div>
	</section>

	<section class="home-section backup-band">
		<div class="page-container backup-grid">
			{#each sections as key (key)}
				<div class="backup-item">
					<h2 id="backup-{key}">{t(`services.backup.sections.${key}.title`)}</h2>
					<p class="home-service__subtitle">{t(`services.backup.sections.${key}.subtitle`)}</p>
					<p class="section-lead">{t(`services.backup.sections.${key}.body`)}</p>
				</div>
			{/each}
		</div>
	</section>

	<section class="home-service home-service--art-left" aria-labelledby="backup-inwd">
		<div class="page-container home-service__layout">
			<div class="home-service__copy">
				<h2 id="backup-inwd">{t('services.backup.inwd.title')}</h2>
				<p class="section-lead">{t('services.backup.inwd.body')}</p>
				<a href="https://inwd.org" class="btn-action">
					{t('services.backup.inwd.cta')} <span aria-hidden="true">↗</span>
				</a>
			</div>
			<figure class="home-service__art">
				<img
					class="home-service__image home-service__image--logo"
					src="/images/inwd-managed-host.webp"
					srcset="/images/inwd-managed-host-600.webp 600w, /images/inwd-managed-host.webp 1248w"
					sizes="(min-width: 64rem) 40vw, 100vw"
					alt={t('services.linux.imageAlt')}
					width="1248"
					height="1014"
					loading="lazy"
					decoding="async"
				/>
			</figure>
		</div>
	</section>

	<ContactBand />
</div>

<style>
	.services-page {
		font-family: var(--font-reading, system-ui, sans-serif);
	}

	.backup-title {
		font-size: clamp(2.5rem, 6vw, 4.5rem);
	}

	.backup-band {
		border-block: 1px solid rgba(0, 240, 255, 0.18);
		background: rgba(14, 22, 33, 0.68);
	}

	.backup-grid {
		display: grid;
		gap: clamp(2.5rem, 5vw, 4rem);
	}

	.backup-item h2 {
		margin: 0;
		color: white;
		font-family: var(--font-display);
		font-size: clamp(1.5rem, 3vw, 2.25rem);
		font-weight: 400;
		line-height: 1.1;
		text-transform: uppercase;
	}

	@media (min-width: 48rem) {
		.backup-grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}
</style>
