<script lang="ts">
	import { pixelWindowBreak } from '$lib/actions/pixelWindowBreak';

	interface Props {
		src: string;
		alt: string;
		width: number;
		height: number;
		srcset?: string;
		sizes?: string;
		/** Side of the layout the art hangs on; its outer edge leans towards the viewer. */
		side?: 'left' | 'right';
		/** Start inside a pixel window that shatters when the art scrolls into view. */
		shatter?: boolean;
		/** Load immediately, for art above the fold. */
		eager?: boolean;
		/** Decoration behind the art: sparse pixels or nothing. */
		backdrop?: 'pixels' | 'none';
		/**
		 * Artwork continued past the image edges, drawn behind it and tilting with it. x and y are
		 * the margins it adds on each side, as percentages of the image width and height. With
		 * `front` it is drawn over the image instead, for things growing over its edges.
		 */
		extension?: { src: string; x: number; y: number; front?: boolean };
	}

	let {
		src,
		alt,
		width,
		height,
		srcset,
		sizes,
		side = 'right',
		shatter = false,
		eager = false,
		backdrop = 'pixels',
		extension
	}: Props = $props();
</script>

<figure
	class="tilted-art tilted-art--{side} tilted-art--{backdrop}"
	class:tilted-art--extended={extension}
	class:is-visible={!shatter}
>
	<div class="tilted-art__frame">
		{#if extension}
			<span
				class="tilted-art__extension"
				class:tilted-art__extension--front={extension.front}
				style="inset: -{extension.y}% -{extension.x}%; background-image: url('{extension.src}');"
				aria-hidden="true"
			></span>
		{/if}
		<img
			{src}
			{srcset}
			{sizes}
			{alt}
			{width}
			{height}
			loading={eager ? 'eager' : 'lazy'}
			fetchpriority={eager ? 'high' : undefined}
			decoding="async"
		/>
		{#if shatter}
			<canvas class="tilted-art__window" use:pixelWindowBreak aria-hidden="true"></canvas>
		{/if}
	</div>
</figure>

<style>
	.tilted-art {
		--tilt: -10deg;
		position: relative;
		margin: 0;
		padding: 1.5rem;
		perspective: 1000px;
	}

	/* Sparse logo-coloured pixels behind the art, densest at its centre. Two tile sizes keep
	   the repeat from showing. */
	.tilted-art::before {
		position: absolute;
		inset: -14% -10%;
		background-image:
			url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96' shape-rendering='crispEdges'%3E%3Crect x='56' y='68' width='4' height='4' fill='%2300f0ff' fill-opacity='1'/%3E%3Crect x='64' y='72' width='4' height='4' fill='%2300f0ff' fill-opacity='0.55'/%3E%3Crect x='64' y='60' width='4' height='4' fill='%23ff00ff' fill-opacity='0.55'/%3E%3Crect x='12' y='56' width='4' height='4' fill='%2300f0ff' fill-opacity='0.55'/%3E%3Crect x='8' y='68' width='4' height='4' fill='%23ff00ff' fill-opacity='0.35'/%3E%3Crect x='76' y='48' width='4' height='4' fill='%2300f0ff' fill-opacity='0.55'/%3E%3Crect x='76' y='0' width='4' height='4' fill='%23ff00ff' fill-opacity='0.35'/%3E%3C/svg%3E"),
			url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='152' height='152' shape-rendering='crispEdges'%3E%3Crect x='72' y='20' width='4' height='4' fill='%2300f0ff' fill-opacity='0.8'/%3E%3Crect x='108' y='96' width='4' height='4' fill='%23ff00ff' fill-opacity='0.8'/%3E%3Crect x='32' y='48' width='4' height='4' fill='%2300f0ff' fill-opacity='1'/%3E%3Crect x='0' y='56' width='4' height='4' fill='%23ff00ff' fill-opacity='1'/%3E%3Crect x='4' y='24' width='4' height='4' fill='%2300f0ff' fill-opacity='1'/%3E%3Crect x='104' y='4' width='4' height='4' fill='%23ff00ff' fill-opacity='1'/%3E%3Crect x='88' y='12' width='4' height='4' fill='%2300f0ff' fill-opacity='0.35'/%3E%3Crect x='148' y='92' width='4' height='4' fill='%23ff00ff' fill-opacity='0.55'/%3E%3Crect x='52' y='92' width='4' height='4' fill='%23ff00ff' fill-opacity='0.8'/%3E%3C/svg%3E");
		background-position: center;
		background-size:
			96px 96px,
			152px 152px;
		mask-image: radial-gradient(ellipse at center, black 25%, transparent 70%);
		content: '';
	}

	.tilted-art--none::before {
		content: none;
	}

	/* Hung back at an angle; when revealed it swings to face the viewer. With `shatter` the art
	   starts inside a pixel window like the Windows logo, which breaks as it swings; otherwise
	   it is rendered already revealed. */
	.tilted-art__frame {
		position: relative;
		transform: translateZ(-5rem) rotateY(var(--tilt)) rotateX(3deg);
		transform-style: preserve-3d;
		transition: transform 1100ms cubic-bezier(0.2, 0.8, 0.2, 1);
	}

	.tilted-art__frame img {
		display: block;
		width: 100%;
		height: auto;
		box-shadow:
			0 2rem 3rem -1.5rem rgba(0, 0, 0, 0.6),
			0 0 0 1px color-mix(in srgb, var(--color-primary) 35%, transparent);
	}

	/* Sits behind the image in the same 3D plane, so it stays aligned as the art swings. */
	.tilted-art__extension {
		position: absolute;
		background-position: center;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		image-rendering: pixelated;
	}

	.tilted-art__frame img {
		position: relative;
	}

	.tilted-art__extension--front {
		z-index: 1;
		transform: translateZ(1px);
		pointer-events: none;
	}

	/* The edge line and drop shadow would cut the art off from its continuation. */
	.tilted-art--extended .tilted-art__frame img {
		box-shadow: none;
	}

	.tilted-art__window {
		position: absolute;
		top: -0.75rem;
		left: -0.75rem;
		width: calc(100% + 1.5rem);
		height: calc(100% + 0.75rem + 3.5rem);
		transform: translateZ(1px);
		pointer-events: none;
	}

	.tilted-art:global(.is-visible) .tilted-art__frame {
		transform: translateZ(0) rotateY(calc(var(--tilt) * 0.3)) rotateX(1deg);
	}

	@media (prefers-reduced-motion: reduce) {
		.tilted-art__frame {
			transition: none;
		}
	}

	@media (min-width: 64rem) {
		.tilted-art--right {
			--tilt: -22deg;
		}

		.tilted-art--left {
			--tilt: 22deg;
		}
	}
</style>
