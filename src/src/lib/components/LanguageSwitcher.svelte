<script lang="ts">
	import { locale } from '$lib/i18n';
</script>

<button
	class="flex items-center gap-2 px-3 py-2 text-sm font-mono uppercase tracking-wider border-2 border-primary/50 text-primary hover:bg-primary hover:text-black transition-colors"
	onclick={() => locale.toggle()}
	aria-label="Switch language"
>
	<span class="material-symbols-outlined text-sm">language</span>
	<span>{locale.current.toUpperCase()}</span>
</button>
