<script lang="ts">
	import { t, tObj } from '$lib/i18n';
	import Seo from '$lib/components/Seo.svelte';
	import ShareButtons from '$lib/components/ShareButtons.svelte';

	// Type for command objects
	interface Command {
		name: string;
		description: string;
		details: string;
	}
</script>

<Seo
	title={t('news.impeccable.title')}
	description={t('news.impeccable.description')}
	image="/news-impeccable.svg"
	type="article"
	publishedTime="2026-01-28"
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
				{t('news.impeccable.date')}
			</div>
			<h1 class="text-4xl sm:text-5xl font-display uppercase text-white mb-6">
				{t('news.impeccable.title')}
			</h1>

			<ShareButtons
				url="https://webdeploy.it/news/impeccable-style-website-transformation"
				title={t('news.impeccable.title')}
				date={t('news.impeccable.date')}
				image="/news-impeccable.svg"
			/>
		</div>

		<!-- Featured Image -->
		<div class="w-full border-4 border-slate-700 mb-8 bg-surface-dark p-4">
			<img
				src="/news-impeccable.svg"
				alt={t('news.impeccable.title')}
				width="600"
				height="400"
				loading="lazy"
				decoding="async"
				class="w-full"
			/>
		</div>

		<!-- Article Content -->
		<article class="prose prose-invert max-w-none">
			<div class="card-retro bg-surface-dark p-8">
				<p class="text-slate-400 leading-relaxed text-lg mb-6">
					{t('news.impeccable.description')}
				</p>

				<p class="text-slate-400 leading-relaxed mb-8">
					{t('news.impeccable.intro')}
				</p>

				<!-- What is Impeccable -->
				<h2 class="text-xl font-display uppercase text-primary mb-4">
					{t('news.impeccable.whatIsImpeccable')}
				</h2>
				<p class="text-slate-400 leading-relaxed mb-8">
					{t('news.impeccable.whatIsImpeccableDescription')}
				</p>

				<!-- Commands Used -->
				<h2 class="text-xl font-display uppercase text-secondary mb-4">
					{t('news.impeccable.commandsUsed')}
				</h2>
				<div class="space-y-6 mb-8">
					{#each tObj<Command[]>('news.impeccable.commands') || [] as command}
						<div class="border-l-2 border-primary/30 pl-6">
							<h3 class="text-lg font-mono text-primary mb-1">{command.name}</h3>
							<p class="text-secondary text-sm font-mono mb-2">{command.description}</p>
							<p class="text-slate-400 leading-relaxed">{command.details}</p>
						</div>
					{/each}
				</div>

				<!-- Results -->
				<h2 class="text-xl font-display uppercase text-primary mb-4">
					{t('news.impeccable.results')}
				</h2>
				<p class="text-slate-400 leading-relaxed mb-4">
					{t('news.impeccable.resultsIntro')}
				</p>
				<ul class="space-y-2 text-slate-400 mb-8">
					{#each tObj<string[]>('news.impeccable.resultsList') || [] as result}
						<li class="flex items-start gap-2">
							<span class="text-primary">•</span>
							{result}
						</li>
					{/each}
				</ul>

				<!-- Philosophy -->
				<h2 class="text-xl font-display uppercase text-secondary mb-4">
					{t('news.impeccable.philosophy')}
				</h2>
				<p class="text-slate-400 leading-relaxed mb-8">
					{t('news.impeccable.philosophyDescription')}
				</p>

				<!-- Call to Action -->
				<h2 class="text-xl font-display uppercase text-primary mb-4">
					{t('news.impeccable.callToAction')}
				</h2>
				<p class="text-slate-400 leading-relaxed mb-6">
					{t('news.impeccable.callToActionDescription')}
				</p>

				<!-- External Link -->
				<div class="border-t border-slate-700 pt-6 mt-6">
					<div class="flex flex-col sm:flex-row items-center justify-center gap-4">
						<span class="text-text-muted font-mono text-sm">{t('news.impeccable.learnMore')}:</span>
						<a
							href="https://impeccable.style"
							target="_blank"
							rel="noopener noreferrer"
							class="btn-retro-primary inline-flex items-center gap-2 text-lg font-bold py-3 px-8 uppercase tracking-widest"
						>
							{t('news.impeccable.visitImpeccable')}
							<span class="text-sm" aria-hidden="true">↗</span>
							<span class="sr-only">{t('common.opensInNewTab')}</span>
						</a>
					</div>
				</div>
			</div>
		</article>

		<!-- CTA -->
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
