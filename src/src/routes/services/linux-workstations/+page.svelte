<script lang="ts">
	import { t, tObj } from '$lib/i18n';
	import Seo from '$lib/components/Seo.svelte';
	import { siteUrl } from '$lib/config/site';
	import { publisherJsonLd } from '$lib/utils/structuredData';
	import ContactBand from '$lib/components/ContactBand.svelte';
	import WorkstationDemo from '$lib/components/WorkstationDemo.svelte';

	type Example = { item: string; result: string };
</script>

<Seo
	title={t('services.linux.title')}
	description={t('services.linux.metaDescription')}
	image="/images/og/linux.jpg"
	jsonLd={{
		'@context': 'https://schema.org',
		'@type': 'Service',
		name: t('services.linux.title'),
		description: t('services.linux.metaDescription'),
		serviceType: 'Linux workstation migration',
		url: siteUrl('/services/linux-workstations'),
		provider: publisherJsonLd()
	}}
/>

<div class="services-page">
	<section class="home-service home-service--art-right linux-intro" aria-labelledby="linux-title">
		<div class="page-container home-service__layout">
			<div class="home-service__copy">
				<h1 id="linux-title" class="section-title">{t('services.linux.title')}</h1>
				<p class="home-service__subtitle linux-intro__subtitle">{t('services.linux.subtitle')}</p>
				<p class="section-lead">{t('services.linux.description')}</p>
			</div>
			<figure class="home-service__art">
				<!-- inWD's Managed Host illustration from the inwd.org design board, redrawn at high
				     resolution from its 212 × 172 original and recoloured like the Trunk / Rack: ink in cyan,
				     status lights in magenta, over a magenta offset shadow. -->
				<img
					class="home-service__image home-service__image--logo"
					src="/images/inwd-managed-host.webp"
					srcset="/images/inwd-managed-host-600.webp 600w, /images/inwd-managed-host.webp 1248w"
					sizes="(min-width: 64rem) 40vw, 100vw"
					alt={t('services.linux.imageAlt')}
					width="1248"
					height="1014"
					fetchpriority="high"
					decoding="async"
				/>
			</figure>
		</div>
	</section>

	<section class="home-service home-service--art-left" aria-labelledby="linux-inventory">
		<div class="page-container home-service__layout">
			<div class="home-service__copy">
				<h2 id="linux-inventory">{t('services.linux.inventory.title')}</h2>
				<p class="home-service__subtitle">{t('services.linux.inventory.subtitle')}</p>
				<p class="section-lead">{t('services.linux.inventory.body')}</p>
			</div>
			<figure class="home-service__art inventory">
				<figcaption class="inventory__label">
					{t('services.linux.inventory.examplesLabel')}
				</figcaption>
				<dl class="inventory__list">
					{#each tObj<Example[]>('services.linux.inventory.examples') ?? [] as row (row.item)}
						<div class="inventory__row">
							<dt>{row.item}</dt>
							<dd>{row.result}</dd>
						</div>
					{/each}
				</dl>
				<p class="inventory__note">{t('services.linux.inventory.examplesNote')}</p>
			</figure>
		</div>
	</section>

	<section class="home-section linux-band" aria-labelledby="linux-testing">
		<div class="page-container linux-band__layout">
			<div>
				<h2 id="linux-testing" class="section-title">{t('services.linux.testing.title')}</h2>
				<p class="home-service__subtitle">{t('services.linux.testing.subtitle')}</p>
				<p class="section-lead">{t('services.linux.testing.body')}</p>
			</div>
			<ul class="section-points">
				{#each tObj<string[]>('services.linux.testing.points') ?? [] as point}
					<li>{point}</li>
				{/each}
			</ul>
		</div>
	</section>

	<section class="home-service home-service--art-right" aria-labelledby="linux-test-machine">
		<div class="page-container home-service__layout">
			<div class="home-service__copy">
				<h2 id="linux-test-machine">{t('services.linux.testMachine.title')}</h2>
				<p class="home-service__subtitle">{t('services.linux.testMachine.subtitle')}</p>
				<p class="section-lead">{t('services.linux.testMachine.body')}</p>
			</div>
			<figure class="home-service__art">
				<WorkstationDemo />
				<figcaption class="home-service__credit">
					{t('services.linux.testMachine.imageCaption')}
				</figcaption>
			</figure>
		</div>
	</section>

	<section class="home-service home-service--art-left" aria-labelledby="linux-support">
		<div class="page-container home-service__layout">
			<div class="home-service__copy">
				<h2 id="linux-support">{t('services.linux.support.title')}</h2>
				<p class="home-service__subtitle">{t('services.linux.support.subtitle')}</p>
				<p class="section-lead">{t('services.linux.support.body')}</p>
				<a href="https://inwd.org" class="btn-action">
					{t('services.linux.support.link')} <span aria-hidden="true">↗</span>
				</a>
			</div>
			<figure class="home-service__art">
				<img
					class="home-service__image home-service__image--icon"
					src="/images/inwd-trunk-rack.webp"
					srcset="/images/inwd-trunk-rack-500.webp 500w, /images/inwd-trunk-rack.webp 907w"
					sizes="(min-width: 64rem) 40vw, 100vw"
					alt={t('services.linux.support.imageAlt')}
					width="907"
					height="1026"
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

	.linux-intro .section-title {
		max-width: 48rem;
		font-size: clamp(2.5rem, 6vw, 4.5rem);
	}

	.linux-intro__subtitle {
		margin-top: 1.25rem;
	}

	.inventory {
		width: 100%;
		max-width: 34rem;
		margin-inline: auto;
	}

	.inventory__label,
	.inventory__note {
		color: var(--color-text-body);
		font-family: var(--font-mono);
		font-size: 0.75rem;
		letter-spacing: 0.08em;
		line-height: 1.6;
	}

	.inventory__label {
		margin-bottom: 0.75rem;
		color: var(--color-secondary);
		font-weight: 700;
		text-transform: uppercase;
	}

	.inventory__note {
		margin-top: 0.75rem;
		letter-spacing: normal;
	}

	.inventory__list {
		margin: 0;
		border-top: 1px solid rgba(0, 240, 255, 0.35);
	}

	.inventory__row {
		display: grid;
		gap: 0.25rem 1.5rem;
		padding: 1rem 0;
		border-bottom: 1px solid var(--home-rule, rgba(148, 163, 184, 0.34));
	}

	.inventory__row dt {
		color: white;
		font-family: var(--font-display);
		font-size: 1.125rem;
		text-transform: uppercase;
	}

	.inventory__row dd {
		margin: 0;
		color: var(--color-text-body);
		font-size: 0.9375rem;
		line-height: 1.5;
	}

	.linux-band {
		border-block: 1px solid rgba(0, 240, 255, 0.18);
		background: rgba(14, 22, 33, 0.68);
	}

	.linux-band__layout {
		display: grid;
		gap: 2.5rem;
		align-items: center;
	}

	/* The example list explains the copy, so on small screens it follows it instead of leading. */
	@media (max-width: 63.99rem) {
		.inventory {
			order: 0;
		}
	}

	@media (min-width: 40rem) {
		.inventory__row {
			grid-template-columns: minmax(9rem, 0.8fr) minmax(0, 1.2fr);
			align-items: baseline;
		}
	}

	@media (min-width: 64rem) {
		.linux-band__layout {
			grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
		}
	}
</style>
