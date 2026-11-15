import { logAnimation } from '$lib/utils/logger';

/**
 * Svelte action that draws a Windows-logo style window (border plus centre cross) in pixel
 * blocks, in the logo colours, over the image that precedes the canvas. When the parent figure
 * scrolls into view it gets the 'is-visible' class, the window shatters and every pixel falls,
 * fading out before it reaches the ground, leaving the bare image.
 *
 * Usage: <canvas use:pixelWindowBreak class="..."></canvas> placed after the <img>,
 * both inside the same positioned frame, inside a <figure>.
 */

type Block = {
	x: number;
	y: number;
	vx: number;
	vy: number;
	delay: number;
	startY: number;
	alpha: number;
	cross: boolean;
};

const PIXEL = 6;
const GRAVITY = 0.0022; // px per ms²
const BREAK_DELAY = 450; // lets the window swing forward before it shatters
const FADE_BEFORE_GROUND = 0.8; // share of the drop after which a pixel has vanished

export function pixelWindowBreak(canvas: HTMLCanvasElement, options: { threshold?: number } = {}) {
	const { threshold = 0.35 } = options;
	const figure = canvas.closest('figure');
	const image = canvas.parentElement?.querySelector('img');
	const ctx = canvas.getContext('2d');
	if (!figure || !image || !ctx) {
		return { destroy() {} };
	}

	const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	let blocks: Block[] = [];
	let broken = false;
	let frame = 0;
	let breakTimer = 0;
	let start = 0;
	let last = 0;

	function layout() {
		const dpr = window.devicePixelRatio || 1;
		canvas.width = Math.round(canvas.clientWidth * dpr);
		canvas.height = Math.round(canvas.clientHeight * dpr);
		ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

		// offset* ignore 3D transforms, so this is the image box in canvas coordinates.
		const x0 = image!.offsetLeft - canvas.offsetLeft;
		const y0 = image!.offsetTop - canvas.offsetTop;
		const width = image!.offsetWidth;
		const height = image!.offsetHeight;
		const cx = x0 + width / 2;
		const cy = y0 + height / 2;
		const reach = Math.hypot(width, height) / 2;

		blocks = [];
		const add = (x: number, y: number, cross: boolean) => {
			const distance = Math.hypot(x - cx, y - cy) / reach;
			blocks.push({
				x,
				y,
				vx: ((x - cx) / reach) * 0.12 + (Math.random() - 0.5) * 0.18,
				vy: -Math.random() * 0.22,
				delay: distance * 260 + Math.random() * 220,
				startY: y,
				alpha: 1,
				cross
			});
		};

		const half = PIXEL / 2;
		for (let x = x0; x <= x0 + width; x += PIXEL) {
			add(x - half, y0 - half, false);
			add(x - half, cy - half, true);
			add(x - half, y0 + height - half, false);
		}
		for (let y = y0 + PIXEL; y < y0 + height; y += PIXEL) {
			add(x0 - half, y - half, false);
			add(cx - half, y - half, true);
			add(x0 + width - half, y - half, false);
		}
	}

	function step(dt: number, elapsed: number) {
		const ground = canvas.clientHeight - PIXEL;
		let falling = false;
		for (const block of blocks) {
			if (block.alpha <= 0) continue;
			falling = true;
			if (elapsed < block.delay) continue;
			block.vy += GRAVITY * dt;
			block.x += block.vx * dt;
			block.y += block.vy * dt;
			const drop = Math.max(ground - block.startY, PIXEL) * FADE_BEFORE_GROUND;
			block.alpha = Math.min(1, 1 - (block.y - block.startY) / drop);
		}
		return falling;
	}

	function draw() {
		ctx!.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
		// Logo colours: cyan outer border, magenta centre cross.
		const style = getComputedStyle(canvas);
		const border = style.getPropertyValue('--color-primary').trim() || '#00f0ff';
		const cross = style.getPropertyValue('--color-secondary').trim() || '#ff00ff';
		for (const block of blocks) {
			if (block.alpha <= 0) continue;
			ctx!.globalAlpha = block.alpha;
			ctx!.fillStyle = block.cross ? cross : border;
			ctx!.fillRect(Math.round(block.x), Math.round(block.y), PIXEL, PIXEL);
		}
		ctx!.globalAlpha = 1;
	}

	function tick(now: number) {
		const dt = Math.min(now - last, 48);
		last = now;
		const falling = step(dt, now - start);
		draw();
		if (falling) {
			frame = requestAnimationFrame(tick);
		} else {
			blocks = [];
			logAnimation.log('Window shattered:', figure!.id || canvas.className);
		}
	}

	function shatter() {
		broken = true;
		if (prefersReducedMotion) {
			blocks = [];
			draw();
			return;
		}
		start = last = performance.now();
		frame = requestAnimationFrame(tick);
	}

	layout();
	draw();

	const resizeObserver = new ResizeObserver(() => {
		if (broken) return;
		layout();
		draw();
	});
	resizeObserver.observe(canvas);

	const intersectionObserver = new IntersectionObserver(
		(entries) => {
			if (!entries.some((entry) => entry.isIntersecting)) return;
			intersectionObserver.disconnect();
			figure.classList.add('is-visible');
			breakTimer = window.setTimeout(shatter, prefersReducedMotion ? 0 : BREAK_DELAY);
		},
		{ threshold }
	);
	intersectionObserver.observe(figure);

	return {
		destroy() {
			intersectionObserver.disconnect();
			resizeObserver.disconnect();
			clearTimeout(breakTimer);
			cancelAnimationFrame(frame);
		}
	};
}
