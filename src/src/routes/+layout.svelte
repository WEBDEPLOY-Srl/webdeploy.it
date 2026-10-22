<script lang="ts">
	import '../app.css';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import CrtEffects from '$lib/components/CrtEffects.svelte';
	import CookieConsent from '$lib/components/CookieConsent.svelte';
	import { onMount, tick } from 'svelte';
	import { afterNavigate } from '$app/navigation';
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import { locale } from '$lib/stores/locale.svelte';
	import { t } from '$lib/i18n';
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

		// Page views are tracked in afterNavigate, which also runs for the first load
		_paq.push(['enableLinkTracking']);

		const u = 'https://analytics.inwd.org/';
		_paq.push(['setTrackerUrl', u + 'matomo.php']);
		_paq.push(['setSiteId', '3']);

		const script = document.createElement('script');
		script.async = true;
		script.src = u + 'matomo.js';
		document.head.appendChild(script);

		logAnalytics.log('Matomo initialized (cookieless mode)');

		// Contact intent: email and phone link clicks, wherever they appear (contacts page, footer)
		const onContactClick = (event: MouseEvent) => {
			const link = (event.target as Element | null)?.closest<HTMLAnchorElement>('a[href^="mailto:"], a[href^="tel:"]');
			if (!link) return;
			const channel = link.protocol === 'tel:' ? 'phone' : 'email';
			window._paq?.push(['trackEvent', 'Contact', channel, location.pathname]);
			logAnalytics.log('Contact event tracked:', channel);
		};
		document.addEventListener('click', onContactClick);

		// Meta Pixel loads only if the visitor granted marketing consent previously.
		if (consent.marketing === 'granted') loadMetaPixel();

		return () => document.removeEventListener('click', onContactClick);
	});

	// Track page views, including the first load. The full URL keeps campaign
	// parameters (mtm_*); tick() waits for the new page's <title>.
	afterNavigate(async ({ from }) => {
		if (!browser) return;
		await tick();
		const _paq = (window._paq = window._paq || []);
		if (from?.url) _paq.push(['setReferrerUrl', from.url.href]);
		_paq.push(['setCustomUrl', location.href]);
		_paq.push(['setDocumentTitle', document.title]);
		_paq.push(['trackPageView']);
		logAnalytics.log('Page view tracked:', location.pathname);
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

<div
	class="retro-grid bg-background-dark min-h-screen relative selection:bg-secondary selection:text-white"
	class:home-preview={$page.url.pathname === '/'}
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
