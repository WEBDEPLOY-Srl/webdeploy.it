<script lang="ts">
	import { t } from '#lib/i18n/index.ts';
	import Seo from '#lib/components/Seo.svelte';
	import NewsletterForm from '#lib/components/NewsletterForm.svelte';
</script>

<Seo title={t('newsletter.title')} description={t('newsletter.metaDescription')} />

<div class="newsletter-page">
	<div class="newsletter-layout">
		<div class="newsletter-intro">
			<h1>{t('newsletter.title')}</h1>
			<p class="newsletter-lead">{t('newsletter.lead')}</p>
		</div>
		<NewsletterForm />
		<div class="newsletter-more">
			<h2>{t('newsletter.newsletterContentsTitle')}</h2>
			<p>{t('newsletter.newsletterContents')}</p>
			<a href="/news">{t('newsletter.recentNews')}</a>
		</div>
	</div>
</div>

<style>
	.newsletter-page {
		padding: 0.5rem 1rem 4rem;
	}

	.newsletter-layout {
		width: min(100%, 48rem);
		margin: 0 auto;
		padding: clamp(0.75rem, 3vw, 2rem);
		border: 1px solid rgba(0, 240, 255, 0.32);
		background: rgb(11 16 27 / 88%);
	}

	.newsletter-intro {
		margin-bottom: 0.5rem;
	}

	.newsletter-intro h1 {
		margin: 0 0 0.3rem;
		color: white;
		font-family: var(--font-display, system-ui, sans-serif);
		font-size: clamp(1.75rem, 7vw, 3.5rem);
		line-height: 1;
		text-transform: uppercase;
	}

	.newsletter-lead {
		margin: 0;
		color: #cbd5e1;
		font-size: 0.9rem;
		line-height: 1.25;
	}

	.newsletter-more {
		margin-top: 1.5rem;
		padding-top: 1rem;
		border-top: 1px solid #334155;
		color: #cbd5e1;
		font-size: 0.9rem;
	}

	.newsletter-more h2 {
		margin: 0 0 0.4rem;
		color: var(--color-secondary, #ff00ff);
		font-family: var(--font-display, system-ui, sans-serif);
		font-size: 1.25rem;
		text-transform: uppercase;
	}

	.newsletter-more p {
		margin: 0 0 0.5rem;
	}

	.newsletter-more a {
		color: var(--color-primary, #00f0ff);
		text-decoration: underline;
		text-underline-offset: 2px;
	}

	@media (max-width: 639px) {
		.newsletter-lead {
			font-size: 0.8rem;
			line-height: 1.1;
		}
	}

	@media (min-width: 640px) {
		.newsletter-page {
			padding-top: 3rem;
		}
	}
</style>
