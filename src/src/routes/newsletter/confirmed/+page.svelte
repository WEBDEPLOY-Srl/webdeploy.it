<script lang="ts">
	import { onMount } from 'svelte';
	import { t } from '#lib/i18n/index.ts';
	import Seo from '#lib/components/Seo.svelte';

	onMount(() => {
		let fromListmonk: boolean;
		try {
			fromListmonk = new URL(document.referrer).origin === 'https://newsletter.webdeploy.it';
		} catch {
			return;
		}
		if (!fromListmonk) return;
		(window._paq = window._paq || []).push(['trackEvent', 'Newsletter', 'newsletter_confirmed']);
	});
</script>

<Seo title={t('newsletter.confirmedTitle')} description={t('newsletter.confirmedText')} noindex />

<div class="confirmed-page">
	<section class="confirmed-card" aria-labelledby="confirmed-title">
		<p class="section-eyebrow">WEBDEPLOY</p>
		<h1 id="confirmed-title">{t('newsletter.confirmedTitle')}</h1>
		<p>{t('newsletter.confirmedText')}</p>
		<a href="/news">{t('newsletter.confirmedNews')}</a>
	</section>
</div>

<style>
	.confirmed-page {
		min-height: 50vh;
		display: grid;
		place-items: center;
		padding: 3rem 1rem;
	}

	.confirmed-card {
		width: min(100%, 42rem);
		padding: clamp(1.5rem, 5vw, 3rem);
		border: 1px solid rgba(0, 240, 255, 0.35);
		background: #0b101b;
	}

	.confirmed-card h1 {
		margin: 0.5rem 0 1rem;
		color: white;
		font-family: var(--font-display, system-ui, sans-serif);
		font-size: clamp(2rem, 7vw, 3.5rem);
		text-transform: uppercase;
	}

	.confirmed-card p:not(.section-eyebrow) {
		color: #cbd5e1;
		line-height: 1.6;
	}

	.confirmed-card a {
		color: var(--color-primary, #00f0ff);
		text-decoration: underline;
		text-underline-offset: 3px;
	}
</style>
