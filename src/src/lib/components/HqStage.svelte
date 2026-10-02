<script lang="ts">
	import { onMount } from 'svelte';
	import { t } from '$lib/i18n';

	// The interactive HQ scene is a self-contained Three.js page (static/hq/), embedded
	// in an iframe so its renderer, audio and key bindings stay isolated from the site.
	// Visitors who prefer reduced motion get the still poster instead.
	let animate = $state(false);

	onMount(() => {
		animate = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	});
</script>

<section class="hq-stage" aria-labelledby="hq-stage-title">
	<h2 id="hq-stage-title" class="hq-stage__sr">{t('home.hqTitle')}</h2>
	<div class="hq-stage__frame">
		<img
			class="hq-stage__poster"
			src="/hq/poster.webp"
			alt={t('home.aboutImageAlt')}
			width="1600"
			height="800"
			decoding="async"
		/>
		{#if animate}
			<iframe src="/hq/index.html" title={t('home.hqFrameTitle')} allow="fullscreen; autoplay" allowfullscreen
			></iframe>
		{/if}
	</div>
	<p class="hq-stage__hint">{t('home.hqHint')}</p>
</section>

<style>
	.hq-stage {
		width: 100%;
		max-width: 80rem;
		margin-inline: auto;
		padding-inline: 1rem;
	}

	.hq-stage__sr {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip: rect(0 0 0 0);
		white-space: nowrap;
	}

	.hq-stage__frame {
		position: relative;
		aspect-ratio: 2 / 1;
		border: 1px solid rgba(0, 240, 255, 0.32);
		background: #050a10;
		overflow: hidden;
	}

	.hq-stage__poster,
	.hq-stage__frame iframe {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		border: 0;
		display: block;
	}

	.hq-stage__hint {
		margin: 0.5rem 0 0;
		font-family: 'Space Mono', monospace;
		font-size: 0.8rem;
		color: rgb(148 163 184);
	}

	@media (min-width: 40rem) {
		.hq-stage {
			padding-inline: 1.5rem;
		}
	}
</style>
