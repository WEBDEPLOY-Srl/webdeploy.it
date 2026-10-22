<script lang="ts">
	import { t } from '$lib/i18n';
	import Seo from '$lib/components/Seo.svelte';
	import ShareButtons from '$lib/components/ShareButtons.svelte';
</script>

<Seo
	title={t('news.fosdem2026.title')}
	description={t('news.fosdem2026.description')}
	image="/fosdem-2026.jpg"
	type="article"
	publishedTime="2026-02-04"
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
				{t('news.fosdem2026.date')}
			</div>
			<h1 class="text-4xl sm:text-5xl font-display uppercase text-white mb-6">
				{t('news.fosdem2026.title')}
			</h1>

			<ShareButtons
				url="https://webdeploy.it/news/fosdem-2026"
				title={t('news.fosdem2026.title')}
				date={t('news.fosdem2026.date')}
				image="/fosdem-2026.jpg"
			/>
		</div>

		<!-- Featured Image -->
		<div class="w-full border-4 border-slate-700 mb-8 bg-surface-dark">
			<img
				src="/fosdem-2026.jpg"
				alt={t('news.fosdem2026.imageAlt')}
				width="1200"
				height="800"
				loading="eager"
				decoding="async"
				fetchpriority="high"
				class="w-full"
			/>
		</div>

		<!-- Article Content -->
		<article class="prose prose-invert max-w-none">
			<div class="card-retro bg-surface-dark p-8">
				<p class="text-slate-400 leading-relaxed text-lg mb-6">
					{t('news.fosdem2026.descriptionBeforeLink')}<a
						href="https://metal-stack.io"
						target="_blank"
						rel="noopener noreferrer"
						class="text-primary hover:underline"
					>metal-stack.io<span class="sr-only"> {t('common.opensInNewTab')}</span></a>{t('news.fosdem2026.descriptionAfterLink')}
				</p>

				<p class="text-slate-400 leading-relaxed mb-8">
					{t('news.fosdem2026.intro')}
				</p>

				<!-- What is FOSDEM -->
				<h2 class="text-xl font-display uppercase text-primary mb-4">
					{t('news.fosdem2026.whatIsFosdem')}
				</h2>
				<p class="text-slate-400 leading-relaxed mb-8">
					{t('news.fosdem2026.whatIsFosdemDescription')}
				</p>

				<!-- CRA Devroom -->
				<h2 class="text-xl font-display uppercase text-secondary mb-4">
					{t('news.fosdem2026.craRoom')}
				</h2>
				<p class="text-slate-400 leading-relaxed mb-8">
					{t('news.fosdem2026.craRoomDescription')}
				</p>

				<!-- SBOM Room -->
				<h2 class="text-xl font-display uppercase text-primary mb-4">
					{t('news.fosdem2026.sbomRoom')}
				</h2>
				<p class="text-slate-400 leading-relaxed mb-8">
					{t('news.fosdem2026.sbomRoomDescription')}
				</p>

				<!-- Community -->
				<h2 class="text-xl font-display uppercase text-primary mb-4">
					{t('news.fosdem2026.community')}
				</h2>
				<p class="text-slate-400 leading-relaxed mb-6">
					{t('news.fosdem2026.communityDescription')}
				</p>

				<!-- External Link -->
				<div class="border-t border-slate-700 pt-6 mt-6">
					<div class="flex flex-col sm:flex-row items-center justify-center gap-4">
						<a
							href="https://fosdem.org"
							target="_blank"
							rel="noopener noreferrer"
							class="btn-retro-primary inline-flex items-center gap-2 text-lg font-bold py-3 px-8 uppercase tracking-widest"
						>
							{t('news.fosdem2026.visitFosdem')}
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
