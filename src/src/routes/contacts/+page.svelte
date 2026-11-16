<script lang="ts">
	import { t } from '$lib/i18n';
	import LeafletMap from '$lib/components/LeafletMap.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import { site } from '$lib/config/site';
</script>

<Seo title={t('contacts.title')} description={t('contacts.business.description')} />

<div class="contacts-page">
	<section class="home-section contacts-intro" aria-labelledby="contacts-title">
		<div class="page-container">
			<p class="section-eyebrow">{t('contacts.eyebrow')}</p>
			<h1 id="contacts-title" class="section-title contacts-intro__title">{t('contacts.title')}</h1>
			<p class="section-lead">{t('contacts.lead')}</p>
		</div>
	</section>

	<section class="contacts-columns">
		<div class="page-container contacts-columns__layout">
			<div class="contacts-column">
				<h2 class="contacts-column__title">{t('contacts.business.title')}</h2>
				<a href="mailto:{site.contact.email}" class="btn-action">{site.contact.email}</a>
				<p class="section-lead">{t('contacts.business.description')}</p>
				<dl class="contacts-details">
					<div>
						<dt>{t('contacts.business.location')}</dt>
						<dd>{t('contacts.address')}</dd>
					</div>
					<div>
						<dt>{t('common.phone')}</dt>
						<dd><a href="tel:{site.contact.phone.href}">{site.contact.phone.display}</a></dd>
					</div>
				</dl>
			</div>

			<div class="contacts-column">
				<h2 class="contacts-column__title contacts-column__title--careers">
					{t('contacts.careers.title')}
				</h2>
				<a href="mailto:{site.contact.careersEmail}" class="btn-action btn-action--secondary"
					>{site.contact.careersEmail}</a
				>
				<p class="section-lead">{t('contacts.careers.description')}</p>
				<p class="contacts-note">{t('contacts.careers.perks')}</p>
			</div>
		</div>
	</section>

	<section class="contacts-map" aria-label={t('contacts.business.location')}>
		<div class="page-container">
			<div class="contacts-map__frame">
				<LeafletMap />
			</div>
		</div>
	</section>
</div>

<style>
	.contacts-page {
		font-family: var(--font-reading, system-ui, sans-serif);
	}

	.contacts-intro {
		padding-bottom: clamp(2rem, 4vw, 3rem);
	}

	.contacts-intro__title {
		font-size: clamp(2.75rem, 7vw, 5rem);
	}

	.contacts-columns__layout {
		display: grid;
		gap: clamp(3rem, 6vw, 5rem);
	}

	.contacts-column {
		padding-top: 2rem;
		border-top: 1px solid rgba(0, 240, 255, 0.35);
	}

	.contacts-column__title {
		margin: 0;
		color: white;
		font-family: var(--font-display);
		font-size: clamp(1.75rem, 3.5vw, 2.5rem);
		font-weight: 400;
		line-height: 1.1;
		text-transform: uppercase;
	}

	.contacts-column__title--careers {
		color: var(--color-secondary);
	}

	.contacts-column .btn-action {
		text-transform: none;
	}

	.btn-action--secondary {
		background: var(--color-secondary);
	}

	.contacts-details {
		display: grid;
		gap: 1rem;
		margin: 1.75rem 0 0;
	}

	.contacts-details dt {
		color: var(--color-primary);
		font-family: var(--font-mono);
		font-size: 0.75rem;
		font-weight: 700;
		letter-spacing: 0.12em;
		text-transform: uppercase;
	}

	.contacts-details dd {
		margin: 0.25rem 0 0;
		color: var(--color-text-body);
		font-size: 1rem;
		line-height: 1.6;
	}

	.contacts-details a {
		color: white;
		text-underline-offset: 0.2rem;
	}

	.contacts-details a:hover {
		color: var(--color-primary);
	}

	.contacts-note {
		margin: 1.5rem 0 0;
		color: var(--color-text-body);
		font-family: var(--font-mono);
		font-size: 0.8125rem;
		line-height: 1.6;
	}

	.contacts-map {
		padding: clamp(3rem, 6vw, 5rem) 0 clamp(4rem, 8vw, 7rem);
	}

	.contacts-map__frame {
		overflow: hidden;
		border: 1px solid rgba(0, 240, 255, 0.35);
	}

	@media (min-width: 64rem) {
		.contacts-columns__layout {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}
</style>
