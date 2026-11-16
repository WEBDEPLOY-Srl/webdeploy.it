<script lang="ts">
	import { tick } from 'svelte';
	import { t } from '#lib/i18n/index.ts';
	import { browser } from '$app/env';
	import { consent } from '#lib/stores/consent.svelte.ts';
	import { loadMetaPixel, withdrawMetaPixel } from '#lib/utils/metaPixel.ts';

	let banner = $state<HTMLElement>();
	let returnFocusTo: HTMLElement | null = null;

	function accept() {
		consent.set('granted');
		loadMetaPixel();
	}
	function reject() {
		const wasGranted = consent.marketing === 'granted';
		consent.set('denied');
		if (wasGranted) withdrawMetaPixel();
	}

	// Reopened from the footer: move focus into the banner, and back to the
	// control that opened it once it closes. Before a first decision the banner
	// does not take focus away from the page.
	$effect(() => {
		if (consent.reopened) {
			returnFocusTo = document.activeElement as HTMLElement | null;
			void tick().then(() => banner?.focus());
		} else if (returnFocusTo) {
			if (returnFocusTo.isConnected) returnFocusTo.focus();
			returnFocusTo = null;
		}
	});

	function onKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape' && consent.reopened) consent.dismiss();
	}
</script>

<svelte:window onkeydown={onKeydown} />

{#if browser && consent.bannerVisible}
	<!-- A named complementary landmark rather than role="region": Firefox crashes while axe's ARIA rules read a region landmark here. -->
	<aside bind:this={banner} aria-label={t('consent.title')} tabindex="-1">
		<div
			class="home-consent card-retro bg-surface-dark max-w-4xl mx-auto p-6 flex flex-col md:flex-row md:items-center gap-4"
		>
			<div class="flex-1">
				<h2 class="text-sm font-display uppercase text-primary mb-1">
					{t('consent.title')}
				</h2>
				<!-- eslint-disable-next-line svelte/no-at-html-tags -- repository-owned translation containing a link -->
				<p class="text-sm text-slate-400 leading-relaxed">{@html t('consent.body')}</p>
			</div>
			<div class="flex gap-3 shrink-0">
				{#if consent.reopened}
					<button
						type="button"
						onclick={() => consent.dismiss()}
						class="btn-retro-secondary px-4 py-2 text-sm font-mono"
					>
						{t('consent.close')}
					</button>
				{/if}
				<button
					type="button"
					onclick={reject}
					class="btn-retro-secondary px-4 py-2 text-sm font-mono"
				>
					{t('consent.reject')}
				</button>
				<button
					type="button"
					onclick={accept}
					class="btn-retro-primary px-4 py-2 text-sm font-mono"
				>
					{t('consent.accept')}
				</button>
			</div>
		</div>
	</aside>
{/if}
