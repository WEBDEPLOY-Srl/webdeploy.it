<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/env';
	import { logMap } from '#lib/utils/logger.ts';
	import { t } from '#lib/i18n/index.ts';
	import type { Map as LeafletMapInstance, Marker } from 'leaflet';

	let mapContainer: HTMLDivElement;
	let isLoading = $state(true);
	let hasError = $state(false);
	let marker = $state.raw<Marker | null>(null);

	function popupContent(): string {
		return `
				<div class="font-mono text-sm">
					<strong>WEBDEPLOY S.R.L.</strong><br>
					Via Puccini, 15<br>
					${t('contacts.map.popupCity')}
				</div>
			`;
	}

	// The popup HTML is built outside Svelte's template, so refresh it when the locale changes.
	$effect(() => {
		const content = popupContent();
		marker?.setPopupContent(content);
	});

	onMount(() => {
		if (!browser) return;

		// onMount must return its cleanup synchronously: an async callback would
		// hand Svelte a Promise, so map.remove() would never run on navigation.
		let destroyed = false;
		let map: LeafletMapInstance | undefined;

		async function initMap() {
			logMap.log('Initializing map...');

			try {
				const L = await import('leaflet');
				await import('leaflet/dist/leaflet.css');
				if (destroyed) return;

				const tileURL = `https://tile.openstreetmap.org/{z}/{x}/{y}.png`;
				const webdeployCoordinates: [number, number] = [44.794906009886205, 10.339969612796434];

				map = L.map(mapContainer);
				map.setView(webdeployCoordinates, 13);

				L.tileLayer(tileURL, {
					maxZoom: 19,
					attribution:
						'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
				}).addTo(map);

				// Custom marker icon
				const customIcon = L.divIcon({
					className: 'custom-marker',
					html: `<div class="w-8 h-8 bg-primary border-2 border-black flex items-center justify-center text-black font-bold">
    					<span class="pixel-icon pixel-icon-map-pin" aria-hidden="true"></span>
    				</div>`,
					iconSize: [32, 32],
					iconAnchor: [16, 32]
				});

				marker = L.marker(webdeployCoordinates, { icon: customIcon, title: 'WEBDEPLOY S.R.L.' })
					.addTo(map)
					.bindPopup(popupContent());

				isLoading = false;
				logMap.log('Map initialized successfully');
			} catch (error) {
				logMap.error('Failed to initialize map:', error);
				isLoading = false;
				hasError = true;
			}
		}

		void initMap();

		return () => {
			destroyed = true;
			if (map) {
				map.remove();
				map = undefined;
				logMap.log('Map destroyed');
			}
			marker = null;
		};
	});
</script>

<div class="relative w-full h-[60vh] border-2 border-primary/30 bg-surface-dark">
	<!-- Loading skeleton -->
	{#if isLoading}
		<div class="absolute inset-0 flex flex-col items-center justify-center bg-surface-dark z-10">
			<div
				class="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin mb-4"
			></div>
			<p class="text-slate-400 font-mono text-sm">{t('contacts.map.loading')}</p>
		</div>
	{/if}

	<!-- Error state -->
	{#if hasError}
		<div class="absolute inset-0 flex flex-col items-center justify-center bg-surface-dark z-10">
			<p class="text-slate-400 font-mono text-sm mb-2">
				{t('contacts.map.error')}
			</p>
			<p class="text-slate-400 text-xs">
				{t('contacts.address')}
			</p>
		</div>
	{/if}

	<!-- Map container -->
	<div bind:this={mapContainer} class="w-full h-full" class:invisible={isLoading || hasError}></div>
</div>

<style>
	:global(.custom-marker) {
		background: transparent;
		border: none;
	}

	:global(.leaflet-popup-content-wrapper) {
		background: var(--color-surface-dark);
		color: var(--color-text-body);
		border: 2px solid var(--color-primary);
		border-radius: 0;
	}

	:global(.leaflet-popup-tip) {
		background: var(--color-surface-dark);
		border: 1px solid var(--color-primary);
	}

	:global(.leaflet-popup-close-button) {
		color: var(--color-primary) !important;
	}
</style>
