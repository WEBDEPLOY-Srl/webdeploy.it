<script lang="ts">
	import { scrollReveal } from '$lib/actions/scrollReveal';
	import { t } from '$lib/i18n';

	interface Props {
		title: string;
		details: string;
		icon?: string;
		iconSrc?: string;
		variant?: 'primary' | 'secondary';
		animationDelay?: number;
		readable?: boolean;
		href?: string;
		linkLabel?: string;
	}

	let {
		title,
		details,
		icon,
		iconSrc,
		variant = 'primary',
		animationDelay = 0,
		readable = false,
		href,
		linkLabel
	}: Props = $props();

	let borderColor = $derived(variant === 'primary' ? 'border-primary' : 'border-secondary');
	let textColor = $derived(variant === 'primary' ? 'text-primary' : 'text-secondary');
	let shadowClass = $derived(variant === 'primary' ? 'shadow-retro-primary-soft' : 'shadow-retro-secondary-soft');
	let hoverBg = $derived(variant === 'primary' ? 'group-hover:bg-primary' : 'group-hover:bg-secondary');
</script>

{#if readable}
	<article class="readable-feature">
		{#if iconSrc}
			<img src={iconSrc} alt="" width="32" height="32" loading="lazy" decoding="async" />
		{:else if icon}
			<span class="readable-feature__icon" aria-hidden="true">{icon}</span>
		{/if}
		<h3>{title}</h3>
		<p>{details}</p>
		{#if href}
			<a href={href}>{linkLabel ?? t('home.exploreService')} <span aria-hidden="true">→</span></a>
		{/if}
	</article>
{:else}
	<div class="card-retro bg-surface-dark p-8 group scroll-animate" use:scrollReveal={{ delay: animationDelay }}>
		<div
			class="h-12 w-12 border-2 {borderColor} flex items-center justify-center {textColor} mb-6 {hoverBg} group-hover:text-black transition-colors {shadowClass}"
		>
			{#if iconSrc}
				<img src={iconSrc} alt="" width="28" height="28" loading="lazy" decoding="async" class="w-7 h-7" />
			{:else if icon}
				<span class="text-2xl">{icon}</span>
			{:else}
				<span class="material-symbols-outlined text-2xl" aria-hidden="true">bolt</span>
			{/if}
		</div>
		<h3 class="text-xl font-bold font-display text-white mb-3 uppercase tracking-wide">{title}</h3>
		<p class="text-slate-400 text-sm leading-relaxed">{details}</p>
	</div>
{/if}

<style>
	.readable-feature {
		min-width: 0;
		padding: 1.75rem 0.25rem 0.25rem;
		border-top: 1px solid rgba(0, 240, 255, 0.35);
	}

	.readable-feature > img,
	.readable-feature__icon {
		display: block;
		width: 2rem;
		height: 2rem;
		margin-bottom: 1.5rem;
	}

	.readable-feature__icon {
		color: var(--color-primary);
		font-size: 1.75rem;
		line-height: 1;
	}

	.readable-feature h3 {
		margin: 0;
		color: white;
		font-family: var(--font-display);
		font-size: 1.75rem;
		font-weight: 400;
		line-height: 1.25;
		text-transform: uppercase;
	}

	.readable-feature p {
		max-width: 34rem;
		margin: 0.875rem 0 0;
		color: var(--color-text-body);
		font-family: var(--font-reading, system-ui, sans-serif);
		font-size: 1.0625rem;
		line-height: 1.65;
	}

	.readable-feature a {
		display: inline-flex;
		align-items: center;
		min-height: 2.75rem;
		margin-top: 1rem;
		color: var(--color-primary);
		font-family: var(--font-mono);
		font-size: 0.875rem;
		font-weight: 700;
		letter-spacing: 0.04em;
		text-decoration: none;
	}

	.readable-feature a:hover {
		color: white;
		text-decoration: underline;
		text-underline-offset: 0.25rem;
	}

	.readable-feature a:focus-visible {
		outline: 2px solid var(--color-primary);
		outline-offset: 3px;
	}
</style>
