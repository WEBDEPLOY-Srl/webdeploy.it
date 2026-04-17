<script lang="ts">
    import { onMount } from "svelte";
    import { browser } from "$app/environment";
    import { logMap } from "$lib/utils/logger";

    let mapContainer: HTMLDivElement;
    let isLoading = $state(true);
    let hasError = $state(false);

    onMount(async () => {
        if (!browser) return;

        logMap.log("Initializing map...");

        try {
            const L = await import("leaflet");
            await import("leaflet/dist/leaflet.css");

            const tileURL = `https://tile.openstreetmap.org/{z}/{x}/{y}.png`;
            const webdeployCoordinates: [number, number] = [
                44.794906009886205, 10.339969612796434,
            ];

            const map = L.map(mapContainer);
            map.setView(webdeployCoordinates, 13);

            L.tileLayer(tileURL, {
                maxZoom: 19,
                attribution:
                    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            }).addTo(map);

            // Custom marker icon
            const customIcon = L.divIcon({
                className: "custom-marker",
                html: `<div class="w-8 h-8 bg-primary border-2 border-black flex items-center justify-center text-black font-bold">
					<span class="material-symbols-outlined text-lg">location_on</span>
				</div>`,
                iconSize: [32, 32],
                iconAnchor: [16, 32],
            });

            L.marker(webdeployCoordinates, { icon: customIcon }).addTo(map)
                .bindPopup(`
				<div class="font-mono text-sm">
					<strong>WebDeploy S.R.L.</strong><br>
					Via Puccini, 15<br>
					43123 Parma (PR), Italy
				</div>
			`);

            isLoading = false;
            logMap.log("Map initialized successfully");

            return () => {
                map.remove();
                logMap.log("Map destroyed");
            };
        } catch (error) {
            logMap.error("Failed to initialize map:", error);
            isLoading = false;
            hasError = true;
        }
    });
</script>

<div
    class="relative w-full h-[60vh] border-2 border-primary/30 bg-surface-dark"
>
    <!-- Loading skeleton -->
    {#if isLoading}
        <div
            class="absolute inset-0 flex flex-col items-center justify-center bg-surface-dark z-10"
        >
            <div
                class="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin mb-4"
            ></div>
            <p class="text-slate-400 font-mono text-sm">Loading map...</p>
        </div>
    {/if}

    <!-- Error state -->
    {#if hasError}
        <div
            class="absolute inset-0 flex flex-col items-center justify-center bg-surface-dark z-10"
        >
            <span class="material-symbols-outlined text-4xl text-secondary mb-4"
                >error</span
            >
            <p class="text-slate-400 font-mono text-sm mb-2">
                Unable to load map
            </p>
            <p class="text-slate-500 text-xs">
                Via Puccini 15, 43123 Parma (PR), Italy
            </p>
        </div>
    {/if}

    <!-- Map container -->
    <div
        bind:this={mapContainer}
        class="w-full h-full"
        class:invisible={isLoading || hasError}
    ></div>
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
