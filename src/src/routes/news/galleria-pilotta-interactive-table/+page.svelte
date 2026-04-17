<script lang="ts">
	import { t, tObj } from '$lib/i18n';
	import Seo from '$lib/components/Seo.svelte';
</script>

<Seo
	title={t('news.galleriaPilotta.title')}
	description={t('news.galleriaPilotta.description')}
	image="/galleria-pilotta.png"
	type="article"
	publishedTime="2023-11-10"
/>

<div class="py-16 lg:py-24">
	<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
		<!-- Back link -->
		<a
			href="/news"
			class="inline-flex items-center gap-2 text-primary font-mono text-sm mb-8 hover:underline"
		>
			<span class="material-symbols-outlined text-sm">arrow_back</span>
			&lt; {t('news.backToNews')}
		</a>

		<!-- Article Header -->
		<div class="mb-8">
			<div
				class="inline-block bg-secondary text-black px-4 py-2 text-sm font-mono font-bold uppercase mb-4"
			>
				{t('news.galleriaPilotta.date')}
			</div>
			<h1 class="text-4xl sm:text-5xl font-display uppercase text-white">
				{t('news.galleriaPilotta.title')}
			</h1>
		</div>

		<!-- Featured Image -->
		<img
			src="/galleria-pilotta.png"
			alt={t('news.galleriaPilotta.title')}
			width="800"
			height="600"
			loading="lazy"
			decoding="async"
			class="w-full border-4 border-slate-700 mb-8"
		/>

		<!-- Article Content -->
		<article class="prose prose-invert max-w-none">
			<div class="card-retro bg-surface-dark p-8">
				<p class="text-slate-400 leading-relaxed text-lg mb-6">
					{t('news.galleriaPilotta.description')}
				</p>

				<p class="text-slate-400 leading-relaxed mb-6">
					{t('news.galleriaPilotta.intro')}
				</p>

				<h2 class="text-xl font-display uppercase text-primary mb-4">
					{t('news.galleriaPilotta.keyFeatures')}
				</h2>
				<ul class="space-y-2 text-slate-400 mb-6">
					{#each tObj<string[]>('news.galleriaPilotta.features') || [] as feature}
						<li class="flex items-start gap-2">
							<span class="text-primary">✓</span>
							{feature}
						</li>
					{/each}
				</ul>

				<div class="border-t border-slate-700 pt-6 mt-6">
					<p class="text-slate-500 text-sm font-mono">
						{t('news.galleriaPilotta.collaboration')}
					</p>
				</div>
			</div>
		</article>

		<!-- CTA -->
		<div class="mt-12 text-center">
			<p class="text-slate-400 mb-4">{t('news.interestedSimilar')}</p>
			<a
				href="mailto:info@webdeploy.it"
				class="btn-retro-primary inline-block text-lg font-bold py-3 px-8 uppercase tracking-widest"
			>
				{t('news.contactUs')}
			</a>
		</div>
	</div>
</div>
