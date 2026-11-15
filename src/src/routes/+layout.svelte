<script lang="ts">
	import '../app.css';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import CrtEffects from '$lib/components/CrtEffects.svelte';
	import CookieConsent from '$lib/components/CookieConsent.svelte';
	import { onMount, tick } from 'svelte';
	import { afterNavigate } from '$app/navigation';
	import { browser } from '$app/environment';
	import { page } from '$app/state';
	import { locale } from '$lib/stores/locale.svelte';
	import { t } from '$lib/i18n';
	import { consent } from '$lib/stores/consent.svelte';
	import { loadMetaPixel } from '$lib/utils/metaPixel';
	import { jsonLdScript } from '$lib/utils/jsonLd';
	import { organizationJsonLd } from '$lib/utils/structuredData';
	import { initMatomo, trackPageView } from '$lib/utils/matomo';
	import { logI18n } from '$lib/utils/logger';

	let { children } = $props();

	// Update html lang attribute when locale changes
	$effect(() => {
		if (browser) {
			document.documentElement.lang = locale.current;
			logI18n.log('HTML lang set to:', locale.current);
		}
	});

	onMount(() => {
		const stopMatomo = initMatomo();
		// Meta Pixel loads only if the visitor granted marketing consent previously.
		if (consent.marketing === 'granted') loadMetaPixel();
		return stopMatomo;
	});

	// The first load counts as a page view too. tick() waits for the new page's <title>.
	afterNavigate(async ({ from }) => {
		if (!browser) return;
		await tick();
		trackPageView(from?.url);
	});
</script>

<svelte:head>
	<link rel="icon" href="/favicon.png" />

	<!-- Preload critical fonts for faster LCP (self-hosted) -->
	<link
		rel="preload"
		href="/fonts/space-mono-400-latin.woff2"
		as="font"
		type="font/woff2"
		crossorigin="anonymous"
	/>
	<link
		rel="preload"
		href="/fonts/vt323-400-latin.woff2"
		as="font"
		type="font/woff2"
		crossorigin="anonymous"
	/>

	<!-- JSON-LD Structured Data -->
	<!-- eslint-disable-next-line svelte/no-at-html-tags -- serialised and escaped by jsonLdScript -->
	{@html jsonLdScript(organizationJsonLd())}
</svelte:head>

<div
	class="site-shell bg-background-dark min-h-screen relative selection:bg-secondary selection:text-white"
	class:home-preview={page.url.pathname === '/'}
>
	<!-- Skip to main content link for keyboard users -->
	<a href="#main-content" class="skip-link">
		{t('common.skipToContent')}
	</a>

	<CrtEffects />
	<Header />
	<main id="main-content" class="flex flex-col w-full relative z-10" tabindex="-1">
		{@render children()}
	</main>
	<Footer />
	<CookieConsent />
</div>
