<script lang="ts">
	import { t, tObj } from '$lib/i18n';
	import Seo from '$lib/components/Seo.svelte';
	import ShareButtons from '$lib/components/ShareButtons.svelte';

	const stack = $derived(tObj<string[]>('news.openSourceRelease.stack') ?? []);

</script>

<Seo
	title={t('news.openSourceRelease.title')}
	description={t('news.openSourceRelease.description')}
	image="/open-source-release.jpg"
	type="article"
	publishedTime="2026-04-17"
/>

<div class="py-16 lg:py-24">
	<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
		<a
			href="/news"
			class="inline-block text-primary font-mono text-sm mb-8 hover:underline"
		>
			&lt; {t('news.backToNews')}
		</a>

		<div class="mb-8">
			<div
				class="inline-block bg-secondary text-black px-4 py-2 text-sm font-mono font-bold uppercase mb-4"
			>
				{t('news.openSourceRelease.date')}
			</div>
			<h1 class="text-4xl sm:text-5xl font-display uppercase text-white mb-6">
				{t('news.openSourceRelease.title')}
			</h1>

			<ShareButtons
				url="https://webdeploy.it/news/open-source-release"
				title={t('news.openSourceRelease.title')}
				date={t('news.openSourceRelease.date')}
				image="/open-source-release.jpg"
			/>
		</div>

		<div class="w-full border-4 border-slate-700 mb-8 bg-surface-dark">
			<img
				src="/open-source-release.jpg"
				alt={t('news.openSourceRelease.imageAlt')}
				width="1080"
				height="1350"
				loading="eager"
				decoding="async"
				fetchpriority="high"
				class="w-full"
			/>
		</div>

		<article class="prose prose-invert max-w-none">
			<div class="card-retro bg-surface-dark p-8">
				<p class="text-slate-400 leading-relaxed text-lg mb-8">
					{t('news.openSourceRelease.intro')}
				</p>

				<h2 class="text-xl font-display uppercase text-primary mb-4">
					{t('news.openSourceRelease.whatHappened')}
				</h2>
				<p class="text-slate-400 leading-relaxed mb-8">
					{t('news.openSourceRelease.whatHappenedDescription')}
				</p>

				<h2 class="text-xl font-display uppercase text-secondary mb-4">
					{t('news.openSourceRelease.stackTitle')}
				</h2>
				<p class="text-slate-400 leading-relaxed mb-4">
					{t('news.openSourceRelease.stackIntro')}
				</p>
				<ul class="list-disc list-inside text-slate-400 leading-relaxed mb-8 space-y-2">
					{#each stack as item}
						<li>{item}</li>
					{/each}
				</ul>

				<h2 class="text-xl font-display uppercase text-primary mb-4">
					{t('news.openSourceRelease.whyFrameworks')}
				</h2>
				<p class="text-slate-400 leading-relaxed mb-8">
					{t('news.openSourceRelease.whyFrameworksDescription')}
				</p>

				<h2 class="text-xl font-display uppercase text-secondary mb-4">
					{t('news.openSourceRelease.whyLicense')}
				</h2>
				<p class="text-slate-400 leading-relaxed mb-8">
					{t('news.openSourceRelease.whyLicenseDescription')}
				</p>

				<h2 class="text-xl font-display uppercase text-primary mb-4">
					{t('news.openSourceRelease.howToContribute')}
				</h2>
				<p class="text-slate-400 leading-relaxed mb-8">
					{t('news.openSourceRelease.howToContributeDescription')}
				</p>

				<h2 class="text-xl font-display uppercase text-primary mb-4">
					{t('news.openSourceRelease.callToAction')}
				</h2>
				<p class="text-slate-400 leading-relaxed mb-6">
					{t('news.openSourceRelease.callToActionDescription')}
				</p>

				<div class="border-t border-slate-700 pt-6 mt-6">
					<div class="flex flex-col sm:flex-row items-center justify-center gap-4">
						<a
							href="https://webdeploy.it"
							target="_blank"
							rel="noopener noreferrer"
							class="btn-retro-primary inline-flex items-center gap-2 text-lg font-bold py-3 px-8 uppercase tracking-widest"
						>
							{t('news.openSourceRelease.visitRepo')}
							<span class="text-sm" aria-hidden="true">↗</span>
							<span class="sr-only">{t('common.opensInNewTab')}</span>
						</a>
					</div>
				</div>
			</div>
		</article>

		<div class="mt-12 text-center">
			<a
				href="/contacts"
				class="btn-retro-secondary inline-block text-lg font-bold py-3 px-8 uppercase tracking-widest"
			>
				{t('news.contactUs')}
			</a>
		</div>
	</div>
</div>
