<script lang="ts">
	import { t } from '$lib/i18n';

	interface Props {
		title: string;
		date: string;
		image: string;
		href: string;
		description?: string;
	}

	let { title, date, image, href, description }: Props = $props();
</script>

<article class="card-retro bg-surface-dark overflow-hidden group">
	<a {href} class="block">
		<div class="relative overflow-hidden aspect-[16/9]">
			<img
				src={image}
				alt={title}
				loading="lazy"
				decoding="async"
				class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
			/>
			<div
				class="absolute top-4 right-4 bg-secondary text-black px-3 py-1 text-xs font-mono font-bold uppercase"
			>
				{date}
			</div>
		</div>
		<div class="p-6">
			<h3 class="text-xl font-display font-bold text-white mb-3 uppercase tracking-wide group-hover:text-primary transition-colors line-clamp-2">
				{title}
			</h3>
			{#if description}
				<p class="text-slate-400 text-sm leading-relaxed mb-4 line-clamp-3">{description}</p>
			{/if}
			<span class="text-primary font-mono text-sm uppercase tracking-wider hover:underline">
				&gt; {t('news.readMore')}
			</span>
		</div>
	</a>
</article>
