<script lang="ts">
	import '../app.css';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import CrtEffects from '$lib/components/CrtEffects.svelte';
	import CookieConsent from '$lib/components/CookieConsent.svelte';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import { locale } from '$lib/stores/locale.svelte';
	import { consent } from '$lib/stores/consent.svelte';
	import { loadMetaPixel } from '$lib/utils/metaPixel';
	import { logI18n, logAnalytics } from '$lib/utils/logger';

	let { children } = $props();

	// Update html lang attribute when locale changes
	$effect(() => {
		if (browser) {
			document.documentElement.lang = locale.current;
			logI18n.log('HTML lang set to:', locale.current);
		}
	});

	// Matomo Analytics (privacy-friendly, cookieless)
	onMount(() => {
		if (!browser) return;

		const _paq = (window._paq = window._paq || []);

		// Privacy-friendly settings (no cookies, respect DNT)
		_paq.push(['disableCookies']);
		_paq.push(['setDoNotTrack', true]);

		_paq.push(['trackPageView']);
		_paq.push(['enableLinkTracking']);

		const u = 'https://analytics.inwd.org/';
		_paq.push(['setTrackerUrl', u + 'matomo.php']);
		_paq.push(['setSiteId', '3']);

		const script = document.createElement('script');
		script.async = true;
		script.src = u + 'matomo.js';
		document.head.appendChild(script);

		logAnalytics.log('Matomo initialized (cookieless mode)');

		// Meta Pixel loads only if the visitor granted marketing consent previously.
		if (consent.marketing === 'granted') loadMetaPixel();
	});

	// Track page views on navigation
	$effect(() => {
		if (browser && window._paq) {
			window._paq.push(['setCustomUrl', $page.url.pathname]);
			window._paq.push(['trackPageView']);
			logAnalytics.log('Page view tracked:', $page.url.pathname);
		}
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
	{@html `<script type="application/ld+json">
	{
		"@context": "https://schema.org",
		"@type": "Organization",
		"name": "WebDeploy S.R.L.",
		"alternateName": "WebDeploy",
		"url": "https://webdeploy.it",
		"logo": "https://webdeploy.it/webdeploy-logo.svg",
		"description": "Open source infrastructure and DevOps solutions. Linux migration, managed infrastructure, and interactive kiosk solutions.",
		"address": {
			"@type": "PostalAddress",
			"addressLocality": "Parma",
			"addressCountry": "IT"
		},
		"email": "info@webdeploy.it",
		"serviceType": ["DevOps", "Linux Migration", "Managed Infrastructure", "Interactive Kiosk"],
		"areaServed": {
			"@type": "Country",
			"name": "Italy"
		}
	}
	</script>`}
</svelte:head>

<div class="retro-grid bg-background-dark min-h-screen relative selection:bg-secondary selection:text-white">
	<!-- Skip to main content link for keyboard users -->
	<a href="#main-content" class="skip-link">
		Skip to main content
	</a>

	<CrtEffects />
	<Header />
	<main id="main-content" class="flex flex-col w-full relative z-10" tabindex="-1">
		{@render children()}
	</main>
	<Footer />
	<CookieConsent />
</div>
