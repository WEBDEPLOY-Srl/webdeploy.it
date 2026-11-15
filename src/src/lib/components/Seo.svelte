<script lang="ts">
	import { page } from '$app/stores';
	import { locale, availableLocales } from '$lib/stores/locale.svelte';

	interface Props {
		title: string;
		description: string;
		image?: string;
		type?: 'website' | 'article';
		publishedTime?: string;
		modifiedTime?: string;
		/** Keeps the page out of search results, e.g. a confirmation page reached from an email. */
		noindex?: boolean;
		/** Page-level schema.org data, rendered as JSON-LD next to the site-wide Organization. */
		jsonLd?: Record<string, unknown>;
	}

	let {
		title,
		description,
		image = '/images/og/default.jpg',
		type = 'website',
		publishedTime,
		modifiedTime,
		noindex = false,
		jsonLd
	}: Props = $props();

	const siteUrl = 'https://webdeploy.it';
	const siteName = 'WEBDEPLOY';

	let canonicalUrl = $derived(`${siteUrl}${$page.url.pathname}`);
	let fullImageUrl = $derived(image.startsWith('http') ? image : `${siteUrl}${image}`);
	let fullTitle = $derived(`${title} - ${siteName}`);

	const publisher = {
		'@type': 'Organization',
		name: 'WEBDEPLOY S.R.L.',
		url: siteUrl,
		logo: `${siteUrl}/webdeploy-logo.svg`
	};

	// Articles describe themselves; other pages pass their own data.
	let pageLd = $derived(
		jsonLd ??
			(type === 'article'
				? {
						'@context': 'https://schema.org',
						'@type': 'NewsArticle',
						headline: title,
						description,
						image: [fullImageUrl],
						datePublished: publishedTime,
						dateModified: modifiedTime ?? publishedTime,
						mainEntityOfPage: canonicalUrl,
						author: publisher,
						publisher
					}
				: undefined)
	);
	// `<` is escaped so page text can never close the script element.
	let pageLdJson = $derived(pageLd ? JSON.stringify(pageLd).replace(/</g, '\\u003c') : '');
	let ogLocale = $derived(locale.current === 'it' ? 'it_IT' : 'en_US');
	let alternateLocale = $derived(locale.current === 'it' ? 'en_US' : 'it_IT');
</script>

<svelte:head>
	<!-- Primary Meta Tags -->
	<title>{fullTitle}</title>
	<meta name="title" content={fullTitle} />
	<meta name="description" content={description} />

	<!-- Canonical URL -->
	<link rel="canonical" href={canonicalUrl} />

	<!-- Open Graph / Facebook -->
	<meta property="og:type" content={type} />
	<meta property="og:url" content={canonicalUrl} />
	<meta property="og:title" content={fullTitle} />
	<meta property="og:description" content={description} />
	<meta property="og:image" content={fullImageUrl} />
	{#if image.startsWith('/images/og/')}
		<meta property="og:image:width" content="1200" />
		<meta property="og:image:height" content="630" />
	{/if}
	<meta property="og:site_name" content={siteName} />
	<meta property="og:locale" content={ogLocale} />
	{#if availableLocales.length > 1}
		<meta property="og:locale:alternate" content={alternateLocale} />
	{/if}

	{#if type === 'article' && publishedTime}
		<meta property="article:published_time" content={publishedTime} />
	{/if}
	{#if type === 'article' && modifiedTime}
		<meta property="article:modified_time" content={modifiedTime} />
	{/if}

	<!-- Twitter -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:url" content={canonicalUrl} />
	<meta name="twitter:title" content={fullTitle} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={fullImageUrl} />

	<!-- Additional SEO -->
	{#if noindex}
		<meta name="robots" content="noindex, follow" />
	{:else}
		<meta name="robots" content="index, follow" />
		<meta name="googlebot" content="index, follow, max-video-preview:-1, max-image-preview:large, max-snippet:-1" />
	{/if}

	{#if pageLdJson}
		{@html `<script type="application/ld+json">${pageLdJson}</script>`}
	{/if}
</svelte:head>
