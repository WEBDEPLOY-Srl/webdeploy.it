// Built from the page files at build time, so a new page is listed without editing anything here.
import { site } from '$lib/config/site';

export const prerender = true;

export function GET() {
	const pages = Object.keys(import.meta.glob('/src/routes/**/+page.svelte'))
		.map((file) => file.replace('/src/routes', '').replace(/\/\+page\.svelte$/, '') || '/')
		.filter((path) => !path.includes('['))
		.sort();

	const urls = pages
		.map((path) => `\t<url>\n\t\t<loc>${site.url}${path}</loc>\n\t</url>`)
		.join('\n');

	const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;

	return new Response(body, { headers: { 'Content-Type': 'application/xml' } });
}
