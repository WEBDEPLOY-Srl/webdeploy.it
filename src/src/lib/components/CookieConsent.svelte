<script lang="ts">
	import { t } from '$lib/i18n';
	import { browser } from '$app/environment';
	import { consent } from '$lib/stores/consent.svelte';
	import { loadMetaPixel } from '$lib/utils/metaPixel';

	function accept() {
		consent.set('granted');
		loadMetaPixel();
	}
	function reject() {
		consent.set('denied');
	}
</script>

{#if browser && consent.marketing === null}
	<div
		class="fixed inset-x-0 bottom-0 z-50 p-4 sm:p-6"
		role="dialog"
		aria-live="polite"
		aria-label={t('consent.title')}
	>
		<div
			class="card-retro bg-surface-dark max-w-4xl mx-auto p-6 flex flex-col md:flex-row md:items-center gap-4"
		>
			<div class="flex-1">
				<p class="text-sm font-display uppercase text-primary mb-1">{t('consent.title')}</p>
				<p class="text-sm text-slate-400 leading-relaxed">{@html t('consent.body')}</p>
			</div>
			<div class="flex gap-3 shrink-0">
				<button type="button" onclick={reject} class="btn-retro-secondary px-4 py-2 text-sm font-mono">
					{t('consent.reject')}
				</button>
				<button type="button" onclick={accept} class="btn-retro-primary px-4 py-2 text-sm font-mono">
					{t('consent.accept')}
				</button>
			</div>
		</div>
	</div>
{/if}
