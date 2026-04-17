<script lang="ts">
	import { page } from '$app/stores';
	import { locale } from '$lib/stores/locale.svelte';

	interface Props {
		title: string;
		description: string;
		image?: string;
		type?: 'website' | 'article';
		publishedTime?: string;
		modifiedTime?: string;
	}

	let {
		title,
		description,
		image = '/webdeploy-logo.svg',
		type = 'website',
		publishedTime,
		modifiedTime
	}: Props = $props();

	const siteUrl = 'https://webdeploy.it';
	const siteName = 'WebDeploy';

	let canonicalUrl = $derived(`${siteUrl}${$page.url.pathname}`);
	let fullImageUrl = $derived(image.startsWith('http') ? image : `${siteUrl}${image}`);
	let fullTitle = $derived(`${title} - ${siteName}`);
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
	<meta property="og:site_name" content={siteName} />
	<meta property="og:locale" content={ogLocale} />
	<meta property="og:locale:alternate" content={alternateLocale} />

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
	<meta name="robots" content="index, follow" />
	<meta name="googlebot" content="index, follow, max-video-preview:-1, max-image-preview:large, max-snippet:-1" />
</svelte:head>
