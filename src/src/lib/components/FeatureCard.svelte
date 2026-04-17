<script lang="ts">
	import { scrollReveal } from '$lib/actions/scrollReveal';

	interface Props {
		title: string;
		details: string;
		icon?: string;
		iconSrc?: string;
		variant?: 'primary' | 'secondary';
		animationDelay?: number;
	}

	let { title, details, icon, iconSrc, variant = 'primary', animationDelay = 0 }: Props = $props();

	let borderColor = $derived(variant === 'primary' ? 'border-primary' : 'border-secondary');
	let textColor = $derived(variant === 'primary' ? 'text-primary' : 'text-secondary');
	let shadowClass = $derived(variant === 'primary' ? 'shadow-retro-primary-soft' : 'shadow-retro-secondary-soft');
	let hoverBg = $derived(variant === 'primary' ? 'group-hover:bg-primary' : 'group-hover:bg-secondary');
</script>

<div class="card-retro bg-surface-dark p-8 group scroll-animate" use:scrollReveal={{ delay: animationDelay }}>
	<div
		class="h-12 w-12 border-2 {borderColor} flex items-center justify-center {textColor} mb-6 {hoverBg} group-hover:text-black transition-colors {shadowClass}"
	>
		{#if iconSrc}
			<img src={iconSrc} alt="" width="28" height="28" loading="lazy" decoding="async" class="w-7 h-7" />
		{:else if icon}
			<span class="text-2xl">{icon}</span>
		{:else}
			<span class="material-symbols-outlined text-2xl">bolt</span>
		{/if}
	</div>
	<h3 class="text-xl font-bold font-display text-white mb-3 uppercase tracking-wide">{title}</h3>
	<p class="text-slate-400 text-sm leading-relaxed">{details}</p>
</div>
