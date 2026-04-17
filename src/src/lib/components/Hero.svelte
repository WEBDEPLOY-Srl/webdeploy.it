<script lang="ts">
	import { t } from '$lib/i18n';

	interface Props {
		name: string;
		text?: string;
		tagline: string;
		image?: string;
		imageAlt?: string;
		actions?: Array<{
			text: string;
			href: string;
			primary?: boolean;
		}>;
	}

	let { name, text, tagline, image, imageAlt = '', actions = [] }: Props = $props();
</script>

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
