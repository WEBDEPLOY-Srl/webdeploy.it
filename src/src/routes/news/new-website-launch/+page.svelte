<script lang="ts">
	import { t, tObj } from '$lib/i18n';
	import Seo from '$lib/components/Seo.svelte';
	import ShareButtons from '$lib/components/ShareButtons.svelte';
</script>

<Seo
	title={t('news.websiteLaunch.title')}
	description={t('news.websiteLaunch.description')}
	image="/webdeploy-logo.svg"
	type="article"
	publishedTime="2025-12-31"
/>

<div class="py-16 lg:py-24">
	<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
		<!-- Back link -->
		<a
			href="/news"
			class="inline-block text-primary font-mono text-sm mb-8 hover:underline"
		>
			&lt; {t('news.backToNews')}
		</a>

		<!-- Article Header -->
		<div class="mb-8">
			<div
				class="inline-block bg-secondary text-black px-4 py-2 text-sm font-mono font-bold uppercase mb-4"
			>
				{t('news.websiteLaunch.date')}
			</div>
			<h1 class="text-4xl sm:text-5xl font-display uppercase text-white mb-6">
				{t('news.websiteLaunch.title')}
			</h1>

			<ShareButtons
				url="https://webdeploy.it/news/new-website-launch"
				title={t('news.websiteLaunch.title')}
				date={t('news.websiteLaunch.date')}
				image="/webdeploy-logo.svg"
			/>
		</div>

		<!-- Featured Image -->
		<div class="w-full border-4 border-slate-700 mb-8 bg-surface-dark p-8">
			<img
				src="/webdeploy-logo.svg"
				alt={t('news.websiteLaunch.imageAlt')}
				width="400"
				height="400"
				loading="lazy"
				decoding="async"
				class="w-full max-w-md mx-auto"
			/>
		</div>

		<!-- Article Content -->
		<article class="prose prose-invert max-w-none">
			<div class="card-retro bg-surface-dark p-8">
				<p class="text-slate-400 leading-relaxed text-lg mb-6">
					{t('news.websiteLaunch.description')}
				</p>

				<p class="text-slate-400 leading-relaxed mb-8">
					{t('news.websiteLaunch.intro')}
				</p>

				<!-- What's New -->
				<h2 class="text-xl font-display uppercase text-primary mb-4">
					{t('news.websiteLaunch.whatsNew')}
				</h2>
				<ul class="space-y-2 text-slate-400 mb-8">
					{#each tObj<string[]>('news.websiteLaunch.features') || [] as feature}
						<li class="flex items-start gap-2">
							<span class="text-primary">•</span>
							{feature}
						</li>
					{/each}
				</ul>

				<!-- Tech Stack -->
				<h2 class="text-xl font-display uppercase text-secondary mb-4">
					{t('news.websiteLaunch.techStack')}
				</h2>
				<p class="text-slate-400 leading-relaxed mb-4">
					{t('news.websiteLaunch.techDescription')}
				</p>
				<div class="space-y-4 text-slate-400 mb-8 border-l-2 border-secondary/30 pl-6">
					{#each tObj<string[]>('news.websiteLaunch.technologies') || [] as paragraph}
						<p class="leading-relaxed">{paragraph}</p>
					{/each}
				</div>

				<!-- Design Philosophy -->
				<h2 class="text-xl font-display uppercase text-primary mb-4">
					{t('news.websiteLaunch.designPhilosophy')}
				</h2>
				<p class="text-slate-400 leading-relaxed mb-8">
					{t('news.websiteLaunch.designDescription')}
				</p>

				<!-- What's Next -->
				<h2 class="text-xl font-display uppercase text-secondary mb-4">
					{t('news.websiteLaunch.whatsNext')}
				</h2>
				<p class="text-slate-400 leading-relaxed mb-8">
					{t('news.websiteLaunch.whatsNextDescription')}
				</p>

				<!-- Thanks -->
				<div class="border-t border-slate-700 pt-6 mt-6">
					<p class="text-primary font-mono text-center text-lg">
						{t('news.websiteLaunch.thanks')}
					</p>
				</div>
			</div>
		</article>

		<!-- CTA -->
		<div class="mt-12 text-center">
			<a
				href="/contacts"
				class="btn-retro-primary inline-block text-lg font-bold py-3 px-8 uppercase tracking-widest"
			>
				{t('news.contactUs')}
			</a>
		</div>
	</div>
</div>
