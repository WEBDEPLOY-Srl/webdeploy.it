import { logShare } from '$lib/utils/logger';

const WIDTH = 1080;
const HEIGHT = 1920;
const MARGIN = 60;

const COLORS = {
	background: '#05080c',
	grid: 'rgba(0, 240, 255, 0.08)',
	primary: '#00f0ff',
	secondary: '#ff00ff',
	heading: '#ffffff',
	muted: '#94a3b8'
};

interface StoryImageOptions {
	title: string;
	date: string;
	image: string;
	url: string;
}

/**
 * Loads an image for drawing on a canvas. SVGs without width/height attributes
 * get them from their viewBox, because Firefox refuses to draw SVGs that have
 * no intrinsic size.
 */
async function loadImage(src: string): Promise<HTMLImageElement> {
	let objectUrl: string | null = null;
	let source = src;

	if (src.endsWith('.svg')) {
		const svg = await (await fetch(src)).text();
		const viewBox = svg.match(/viewBox="[\d.\s-]*?([\d.]+)\s+([\d.]+)"/);
		const sized =
			viewBox && !/<svg[^>]*\swidth=/.test(svg)
				? svg.replace('<svg', `<svg width="${viewBox[1]}" height="${viewBox[2]}"`)
				: svg;
		objectUrl = URL.createObjectURL(new Blob([sized], { type: 'image/svg+xml' }));
		source = objectUrl;
	}

	try {
		const img = new Image();
		img.decoding = 'async';
		img.src = source;
		await img.decode();
		return img;
	} finally {
		if (objectUrl) URL.revokeObjectURL(objectUrl);
	}
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
	const lines: string[] = [];
	let line = '';
	for (const word of text.split(/\s+/)) {
		const candidate = line ? `${line} ${word}` : word;
		if (line && ctx.measureText(candidate).width > maxWidth) {
			lines.push(line);
			line = word;
		} else {
			line = candidate;
		}
	}
	if (line) lines.push(line);
	return lines;
}

function drawGrid(ctx: CanvasRenderingContext2D) {
	ctx.strokeStyle = COLORS.grid;
	ctx.lineWidth = 1;
	for (let x = 0; x <= WIDTH; x += 40) {
		ctx.beginPath();
		ctx.moveTo(x + 0.5, 0);
		ctx.lineTo(x + 0.5, HEIGHT);
		ctx.stroke();
	}
	for (let y = 0; y <= HEIGHT; y += 40) {
		ctx.beginPath();
		ctx.moveTo(0, y + 0.5);
		ctx.lineTo(WIDTH, y + 0.5);
		ctx.stroke();
	}
}

/**
 * Draws a 1080×1920 Instagram Story card for a news post (featured image,
 * date, title, short URL) and returns it as a PNG file ready for Web Share.
 * The lower part is left empty for Instagram's link sticker.
 */
export async function createStoryImage({ title, date, image, url }: StoryImageOptions): Promise<File> {
	const started = performance.now();
	await Promise.all([
		document.fonts.load('96px "VT323"'),
		document.fonts.load('700 34px "Space Mono"')
	]);

	const canvas = document.createElement('canvas');
	canvas.width = WIDTH;
	canvas.height = HEIGHT;
	const ctx = canvas.getContext('2d');
	if (!ctx) throw new Error('Canvas 2D context not available');

	ctx.fillStyle = COLORS.background;
	ctx.fillRect(0, 0, WIDTH, HEIGHT);
	drawGrid(ctx);

	ctx.textBaseline = 'alphabetic';
	ctx.fillStyle = COLORS.primary;
	ctx.font = '80px "VT323", monospace';
	ctx.fillText('WEBDEPLOY_', MARGIN, 170);

	// Featured image, contained in a 3:2 frame
	const frame = { x: MARGIN, y: 240, w: WIDTH - MARGIN * 2, h: ((WIDTH - MARGIN * 2) * 2) / 3 };
	ctx.fillStyle = '#0a0f15';
	ctx.fillRect(frame.x, frame.y, frame.w, frame.h);
	try {
		const img = await loadImage(image);
		const scale = Math.min(frame.w / img.naturalWidth, frame.h / img.naturalHeight);
		const w = img.naturalWidth * scale;
		const h = img.naturalHeight * scale;
		ctx.drawImage(img, frame.x + (frame.w - w) / 2, frame.y + (frame.h - h) / 2, w, h);
	} catch (err) {
		logShare.warn('Story image: featured image not drawn:', err);
	}
	ctx.strokeStyle = COLORS.primary;
	ctx.lineWidth = 4;
	ctx.strokeRect(frame.x, frame.y, frame.w, frame.h);

	// Date badge
	let y = frame.y + frame.h + 80;
	ctx.font = '700 34px "Space Mono", monospace';
	const badgeWidth = ctx.measureText(date).width + 48;
	ctx.fillStyle = COLORS.secondary;
	ctx.fillRect(MARGIN, y, badgeWidth, 64);
	ctx.fillStyle = '#000000';
	ctx.fillText(date, MARGIN + 24, y + 44);

	// Title, at most six lines
	y += 64 + 110;
	ctx.font = '96px "VT323", monospace';
	ctx.fillStyle = COLORS.heading;
	const lines = wrapText(ctx, title.toUpperCase(), WIDTH - MARGIN * 2);
	for (const line of lines.slice(0, 6)) {
		ctx.fillText(line, MARGIN, y);
		y += 92;
	}

	ctx.font = '30px "Space Mono", monospace';
	ctx.fillStyle = COLORS.muted;
	ctx.fillText(url.replace(/^https?:\/\//, ''), MARGIN, HEIGHT - 90, WIDTH - MARGIN * 2);

	const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'));
	if (!blob) throw new Error('Canvas export failed');

	const slug = url.split('/').filter(Boolean).pop() ?? 'news';
	logShare.log(`Story image created in ${Math.round(performance.now() - started)} ms (${blob.size} bytes)`);
	return new File([blob], `webdeploy-${slug}-story.png`, { type: 'image/png' });
}
