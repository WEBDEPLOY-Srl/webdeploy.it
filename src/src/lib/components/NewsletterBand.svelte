<script lang="ts">
	import { t } from '#lib/i18n/index.ts';
</script>

<aside class="newsletter-band" aria-labelledby="newsletter-band-title">
	<div>
		<h2 id="newsletter-band-title">{t('news.newsletterBandTitle')}</h2>
		<p>{t('news.newsletterBandText')}</p>
	</div>
	<a href="/newsletter">{t('news.newsletterBandLink')}</a>
</aside>

<style>
	.newsletter-band {
		margin-top: 2.5rem;
		padding: clamp(1rem, 3vw, 1.5rem);
		border: 1px solid rgba(0, 240, 255, 0.38);
		background: #0b101b;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
	}

	.newsletter-band h2 {
		margin: 0 0 0.25rem;
		color: white;
		font-family: var(--font-display, system-ui, sans-serif);
		font-size: 1.25rem;
		text-transform: uppercase;
	}

	.newsletter-band p {
		margin: 0;
		color: #cbd5e1;
		font-size: 0.9rem;
	}

	.newsletter-band a {
		flex: 0 0 auto;
		min-height: 2.75rem;
		display: inline-flex;
		align-items: center;
		padding: 0.5rem 0.8rem;
		color: #07111b;
		background: var(--color-primary, #00f0ff);
		font-family: var(--font-mono, monospace);
		font-weight: 700;
	}

	@media (max-width: 639px) {
		.newsletter-band {
			align-items: flex-start;
			flex-direction: column;
		}
	}
</style>
