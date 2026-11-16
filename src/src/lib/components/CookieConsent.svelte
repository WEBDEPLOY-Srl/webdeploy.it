<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { t } from '#lib/i18n/index.ts';
	import { browser } from '$app/env';
	import { consent } from '#lib/stores/consent.svelte.ts';
	import { loadMetaPixel, withdrawMetaPixel } from '#lib/utils/metaPixel.ts';

	let banner = $state<HTMLElement>();
	let returnFocusTo: HTMLElement | null = null;
	let phone = $state(false);
	let fieldFocused = $state(false);
	let bannerHeight = $state(112);

	const hideBanner = $derived(phone && fieldFocused);

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

	function onFocusIn(event: FocusEvent) {
		fieldFocused = (event.target as Element | null)?.matches('input, select, textarea') ?? false;
	}

	function onFocusOut() {
		requestAnimationFrame(() => {
			fieldFocused = document.activeElement?.matches('input, select, textarea') ?? false;
		});
	}

	onMount(() => {
		const media = window.matchMedia(
			'(max-width: 639px), (pointer: coarse) and (max-height: 500px)'
		);
		const update = () => (phone = media.matches);
		update();
		media.addEventListener('change', update);
		return () => media.removeEventListener('change', update);
	});

	$effect(() => {
		if (!banner) return;
		const element = banner;
		const measure = () => (bannerHeight = Math.ceil(element.getBoundingClientRect().height));
		const observer = new ResizeObserver(measure);
		observer.observe(element);
		measure();
		return () => observer.disconnect();
	});
</script>

<svelte:window onkeydown={onKeydown} />
<svelte:document onfocusin={onFocusIn} onfocusout={onFocusOut} />

{#if browser && consent.bannerVisible}
	<!-- Named complementary landmark; its title is available to assistive technology only. -->
	<aside
		bind:this={banner}
		aria-labelledby="consent-title"
		aria-hidden={hideBanner || undefined}
		inert={hideBanner}
		class:hidden-for-field={hideBanner}
		tabindex="-1"
	>
		<div class="consent-panel">
			<h2 id="consent-title" class="sr-only">{t('consent.title')}</h2>
			<!-- eslint-disable-next-line svelte/no-at-html-tags -- repository-owned translation containing a link -->
			<p class="consent-copy">{@html t('consent.body')}</p>
			<div class="consent-actions">
				{#if consent.reopened}
					<button type="button" onclick={() => consent.dismiss()} class="consent-button">
						{t('consent.close')}
					</button>
				{/if}
				<button type="button" onclick={reject} class="consent-button">
					{t('consent.reject')}
				</button>
				<button type="button" onclick={accept} class="consent-button">
					{t('consent.accept')}
				</button>
			</div>
		</div>
	</aside>
	<!-- Keep space reserved through phone field focus; remove it with the dismissed banner. -->
	<div class="consent-reservation" style:height={`${bannerHeight}px`} aria-hidden="true"></div>
{/if}

<style>
	aside {
		position: fixed;
		z-index: 50;
		inset: auto 0 0;
		box-sizing: border-box;
		min-height: 7rem;
		padding: 0.5rem 0.75rem;
		border-top: 1px solid rgba(0, 240, 255, 0.38);
		background: rgb(11 16 27 / 96%);
		box-shadow: 0 -8px 24px rgb(0 0 0 / 28%);
	}

	.consent-panel {
		max-width: 64rem;
		margin: 0 auto;
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		align-items: center;
		gap: 0.75rem 1rem;
	}

	.consent-copy {
		margin: 0;
		color: #cbd5e1;
		font-family: var(--font-reading, system-ui, sans-serif);
		font-size: 0.8rem;
		line-height: 1.4;
	}

	.consent-copy :global(a) {
		color: var(--color-primary, #00f0ff);
		text-decoration: underline;
		text-underline-offset: 2px;
	}

	.consent-actions {
		display: flex;
		gap: 0.5rem;
	}

	.consent-button {
		min-height: 2.5rem;
		min-width: 7.5rem;
		padding: 0.5rem 0.8rem;
		border: 1px solid #64748b;
		color: #f8fafc;
		background: #1e293b;
		font: 600 0.875rem var(--font-mono, monospace);
		cursor: pointer;
	}

	.consent-button:focus-visible {
		outline: 3px solid #fff;
		outline-offset: 2px;
	}

	.hidden-for-field {
		visibility: hidden;
		pointer-events: none;
	}

	@media (max-width: 639px) {
		.consent-panel {
			display: flex;
			flex-direction: column;
			align-items: stretch;
			gap: 0.4rem;
		}

		.consent-copy {
			font-size: 0.75rem;
			line-height: 1.25rem;
		}

		.consent-actions {
			gap: 0.5rem;
		}

		.consent-button {
			flex: 1 1 0;
			min-width: 0;
			min-height: 2.25rem;
			padding: 0.35rem 0.5rem;
			font-size: 0.875rem;
		}
	}
</style>
