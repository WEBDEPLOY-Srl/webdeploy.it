<script lang="ts">
	import { t, tObj } from '#lib/i18n/index.ts';
	import Seo from '#lib/components/Seo.svelte';
	import ContactBand from '#lib/components/ContactBand.svelte';

	const groups = [
		{ key: 'coreBeliefs', items: ['devExp', 'openSource', 'workLife'], band: false },
		{ key: 'techPhilosophy', items: ['quality', 'docs', 'tools', 'community'], band: true },
		{ key: 'howWeWork', items: ['purpose', 'iterative', 'learning', 'growth'], band: false }
	];
</script>

<Seo title={t('manifesto.title')} description={t('manifesto.devExp.description')} />

<div class="manifesto-page">
	<section class="home-section manifesto-intro" aria-labelledby="manifesto-title">
		<div class="page-container">
			<p class="section-eyebrow">{t('manifesto.eyebrow')}</p>
			<h1 id="manifesto-title" class="section-title manifesto-intro__title">
				{t('manifesto.title')}
			</h1>
		</div>
	</section>

	{#each groups as group (group.key)}
		<section
			class="home-section manifesto-group"
			class:manifesto-group--band={group.band}
			aria-labelledby="manifesto-{group.key}"
		>
			<div class="page-container manifesto-group__layout">
				<h2 id="manifesto-{group.key}" class="section-title manifesto-group__title">
					{t(`manifesto.${group.key}`)}
				</h2>
				<div class="manifesto-items">
					{#each group.items as key (key)}
						<article class="manifesto-item">
							<h3>{t(`manifesto.${key}.title`)}</h3>
							<p class="section-lead">{t(`manifesto.${key}.description`)}</p>
							{#if key === 'workLife'}
								<ul class="section-points">
									{#each tObj<string[]>('manifesto.workLife.items') ?? [] as item}
										<li>{item}</li>
									{/each}
								</ul>
								<p class="manifesto-item__note">{t('manifesto.workLife.note')}</p>
							{/if}
						</article>
					{/each}
				</div>
			</div>
		</section>
	{/each}

	<ContactBand />
</div>

<style>
	.manifesto-page {
		font-family: var(--font-reading, system-ui, sans-serif);
	}

	.manifesto-intro {
		padding-bottom: 0;
	}

	.manifesto-intro__title {
		font-size: clamp(2.75rem, 7vw, 5rem);
	}

	.manifesto-group--band {
		border-block: 1px solid rgba(0, 240, 255, 0.18);
		background: rgba(14, 22, 33, 0.68);
	}

	.manifesto-group__layout {
		display: grid;
		gap: 2rem;
	}

	.manifesto-group__title {
		color: var(--color-secondary);
		font-size: clamp(1.75rem, 3.5vw, 2.5rem);
	}

	.manifesto-items {
		display: grid;
	}

	.manifesto-item {
		padding: 2rem 0;
		border-top: 1px solid var(--home-rule, rgba(148, 163, 184, 0.34));
	}

	.manifesto-item:first-child {
		padding-top: 0;
		border-top: 0;
	}

	.manifesto-item h3 {
		margin: 0;
		color: white;
		font-family: var(--font-display);
		font-size: clamp(1.375rem, 2.6vw, 1.875rem);
		font-weight: 400;
		line-height: 1.15;
		text-transform: uppercase;
	}

	.manifesto-item .section-lead {
		margin-top: 0.875rem;
		max-width: 40rem;
	}

	.manifesto-item__note {
		max-width: 40rem;
		margin: 1.25rem 0 0;
		color: var(--color-text-body);
		font-family: var(--font-mono);
		font-size: 0.8125rem;
		line-height: 1.6;
	}

	@media (min-width: 64rem) {
		.manifesto-group__layout {
			grid-template-columns: minmax(14rem, 0.7fr) minmax(0, 1.3fr);
			gap: clamp(2rem, 6vw, 6rem);
			align-items: start;
		}

		.manifesto-group__title {
			position: sticky;
			top: 6rem;
		}
	}
</style>
