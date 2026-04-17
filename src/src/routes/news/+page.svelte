<script lang="ts">
	import { t } from '$lib/i18n';
	import NewsCard from '$lib/components/NewsCard.svelte';
	import Seo from '$lib/components/Seo.svelte';
</script>

<Seo
	title={t('news.title')}
	description={t('news.pageDescription')}
/>

<div class="py-16 lg:py-24">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<!-- Page Title -->
		<div class="text-center mb-16">
			<h1 class="text-5xl sm:text-6xl font-display uppercase text-white mb-4">
				<span class="text-primary">&gt;</span>
				{t('news.title')}
			</h1>
		</div>

		<!-- News Grid -->
		<div class="grid md:grid-cols-2 gap-8">
			<NewsCard
				title={t('news.fosdem2026.title')}
				date={t('news.fosdem2026.date')}
				image="/fosdem-2026.jpg"
				href="/news/fosdem-2026"
				description={t('news.fosdem2026.description')}
			/>

			<NewsCard
				title={t('news.impeccable.title')}
				date={t('news.impeccable.date')}
				image="/news-impeccable.svg"
				href="/news/impeccable-style-website-transformation"
				description={t('news.impeccable.description')}
			/>

			<NewsCard
				title={t('news.websiteLaunch.title')}
				date={t('news.websiteLaunch.date')}
				image="/webdeploy-logo.svg"
				href="/news/new-website-launch"
				description={t('news.websiteLaunch.description')}
			/>

			<!-- Hidden for future publication plan - old projects showcase
			<NewsCard
				title={t('news.galleriaPilotta.title')}
				date={t('news.galleriaPilotta.date')}
				image="/galleria-pilotta.png"
				href="/news/galleria-pilotta-interactive-table"
				description={t('news.galleriaPilotta.description')}
			/>

			<NewsCard
				title={t('news.rimini.title')}
				date={t('news.rimini.date')}
				image="/rimini.png"
				href="/news/visit-rimini-with-rimini-xperience"
				description={t('news.rimini.description')}
			/>
			-->
		</div>
	</div>
</div>
