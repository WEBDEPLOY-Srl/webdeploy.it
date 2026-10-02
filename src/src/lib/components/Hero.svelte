<script lang="ts">
	import { t } from '$lib/i18n';

	interface Props {
		name: string;
		text?: string;
		tagline: string;
		subtitle?: string;
		eyebrow?: string;
		image?: string;
		imageAlt?: string;
		readable?: boolean;
		actions?: Array<{
			text: string;
			href: string;
			primary?: boolean;
		}>;
	}

	let {
		name,
		text,
		tagline,
		subtitle,
		eyebrow,
		image,
		imageAlt = '',
		readable = false,
		actions = []
	}: Props = $props();
</script>

{#if readable}
	<section class="readable-hero">
		<div class="readable-hero__content">
			<div class="readable-hero__copy">
				{#if eyebrow}
					<p class="readable-hero__eyebrow">{eyebrow}</p>
				{/if}
				<h1 class="readable-hero__title">
					<span>{name}</span>
					{#if text}
						<span class="readable-hero__title-accent">{text}</span>
					{/if}
				</h1>
				{#if subtitle}
					<p class="readable-hero__subtitle">{subtitle}</p>
				{/if}
				<p class="readable-hero__tagline">{tagline}</p>
				{#if actions.length > 0}
					<div class="readable-hero__actions">
						{#each actions as action}
							<a href={action.href} class:readable-hero__primary={action.primary}>
								{action.text}
							</a>
						{/each}
					</div>
				{/if}
			</div>

			{#if image}
				<div class="readable-hero__mark">
					<img
						src={image}
						alt={imageAlt}
						width="400"
						height="400"
						fetchpriority="high"
						decoding="async"
					/>
				</div>
			{/if}
		</div>
	</section>
{:else}
	<section class="relative overflow-hidden pt-16 pb-20 lg:pt-32 lg:pb-28">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
			<div class="grid lg:grid-cols-2 gap-16 items-center">
			<div class="flex flex-col gap-8 max-w-2xl">
				<!-- Status badge -->
				<div
					class="inline-flex items-center border border-secondary/50 bg-secondary/10 px-4 py-2 text-sm font-mono text-secondary w-fit uppercase tracking-wider animate-fade-in-up delay-1"
				>
					<span class="w-2 h-2 bg-secondary mr-3 animate-pulse"></span>
					{t('home.systemOnline')}
				</div>

				<!-- Title -->
				<h1 class="text-6xl sm:text-7xl font-display font-normal uppercase leading-[0.9] text-white animate-fade-in-up delay-2">
					<span class="text-primary title-glow">{name}</span>
					{#if text}
						<br /><span class="text-secondary title-glow">{text}</span>
					{/if}
				</h1>

				<!-- Tagline -->
				<p
					class="text-lg text-slate-400 leading-relaxed max-w-lg font-mono border-l-2 border-primary/30 pl-6 animate-fade-in-up delay-3"
				>
					{tagline}
				</p>

				<!-- Actions -->
				{#if actions.length > 0}
					<div class="flex flex-wrap gap-6 mt-4 animate-fade-in-up delay-4">
						{#each actions as action}
							<a
								href={action.href}
								class="{action.primary
									? 'btn-retro-primary'
									: 'btn-retro-secondary'} text-lg font-bold py-3 px-8 uppercase tracking-widest"
							>
								{action.text}
							</a>
						{/each}
					</div>
				{/if}
			</div>

			<!-- Image -->
			{#if image}
				<div class="relative lg:h-[500px] w-full flex items-center justify-center animate-fade-in-up delay-5">
					<div
						class="absolute inset-0 bg-gradient-to-tr from-primary/10 to-secondary/10 opacity-50 blur-xl"
					></div>
					<div class="relative w-full h-full bg-black border-4 border-slate-700 shadow-2xl p-2">
						<div
							class="w-full h-full border-2 border-slate-800 bg-surface-dark relative overflow-hidden"
						>
							<div
								class="h-8 bg-primary text-black flex items-center justify-between px-2 font-mono text-xs uppercase font-bold"
							>
								<span>inwd.sh</span>
								<div class="flex gap-1">
									<div class="w-3 h-3 border border-black bg-white"></div>
									<div class="w-3 h-3 border border-black bg-white"></div>
									<div class="w-3 h-3 border border-black bg-black"></div>
								</div>
							</div>
							<div class="p-4 flex-1">
								<img
									src={image}
									alt={imageAlt}
									width="400"
									height="400"
									fetchpriority="high"
									decoding="async"
									class="w-full h-auto object-contain"
								/>
							</div>
						</div>
					</div>
				</div>
			{/if}
			</div>
		</div>
	</section>
{/if}

<style>
	.readable-hero {
		padding: clamp(4.5rem, 8vw, 7.5rem) 0 clamp(4rem, 7vw, 6.5rem);
	}

	.readable-hero__content {
		width: 100%;
		max-width: 80rem;
		margin-inline: auto;
		padding-inline: 1rem;
		display: grid;
		gap: clamp(2.5rem, 7vw, 7rem);
		align-items: center;
	}

	.readable-hero__copy {
		max-width: 38rem;
	}

	.readable-hero__eyebrow {
		margin: 0 0 1.25rem;
		color: var(--color-primary);
		font-family: var(--font-mono);
		font-size: 0.75rem;
		font-weight: 700;
		letter-spacing: 0.12em;
		line-height: 1.5;
		text-transform: uppercase;
	}

	.readable-hero__title {
		margin: 0;
		color: white;
		font-family: var(--font-display);
		font-size: 60px;
		font-weight: 400;
		line-height: 0.9;
		text-transform: uppercase;
		text-shadow: 2px 2px var(--color-secondary);
	}

	.readable-hero__title span {
		display: block;
		color: var(--color-primary);
	}

	.readable-hero__title-accent {
		color: var(--color-secondary) !important;
	}

	.readable-hero__subtitle {
		margin: 1.25rem 0 0;
		color: var(--color-primary, #00f0ff);
		font-family: 'VT323', monospace;
		font-size: clamp(1.5rem, 2.6vw, 2rem);
		letter-spacing: 0.02em;
	}

	.readable-hero__tagline {
		max-width: 34rem;
		margin: 2rem 0 0;
		color: var(--color-text-body);
		font-family: var(--font-reading, system-ui, sans-serif);
		font-size: clamp(1.0625rem, 1.5vw, 1.1875rem);
		line-height: 1.7;
	}

	.readable-hero__actions {
		display: flex;
		flex-wrap: wrap;
		gap: 0.875rem 1.5rem;
		margin-top: 2rem;
	}

	.readable-hero__actions a {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-height: 2.75rem;
		padding: 0.625rem 1rem;
		color: var(--color-text-body);
		font-family: var(--font-mono);
		font-size: 0.875rem;
		font-weight: 700;
		letter-spacing: 0.04em;
		line-height: 1.25;
		text-decoration: none;
	}

	.readable-hero__actions a:hover {
		color: white;
		text-decoration: underline;
		text-underline-offset: 0.25rem;
	}

	.readable-hero__actions a:focus-visible {
		outline: 2px solid var(--color-primary);
		outline-offset: 3px;
	}

	.readable-hero__actions .readable-hero__primary {
		background: var(--color-primary);
		color: #050a10;
	}

	.readable-hero__actions .readable-hero__primary:hover {
		background: white;
		color: #050a10;
		text-decoration: none;
	}

	.readable-hero__mark {
		width: min(100%, 24rem);
		justify-self: center;
		padding: clamp(1rem, 3vw, 1.75rem);
		border: 1px solid rgba(0, 240, 255, 0.35);
		background: rgba(14, 22, 33, 0.55);
	}

	.readable-hero__mark img {
		display: block;
		width: 100%;
		height: auto;
	}

	@media (min-width: 40rem) {
		.readable-hero__content {
			padding-inline: 1.5rem;
		}

		.readable-hero__mark {
			justify-self: end;
		}

		.readable-hero__title {
			font-size: 72px;
		}
	}

	@media (min-width: 64rem) {
		.readable-hero__content {
			grid-template-columns: minmax(0, 1.15fr) minmax(15rem, 0.85fr);
			padding-inline: 2rem;
		}
	}
</style>
