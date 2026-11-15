import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const sitemap = fileURLToPath(new URL('../build/sitemap.xml', import.meta.url));

/** Path of every page the sitemap lists, read from the production build. */
export function sitemapPaths(): string[] {
	if (!existsSync(sitemap)) {
		throw new Error('build/sitemap.xml is missing: run `npm run build` before the e2e tests.');
	}
	const xml = readFileSync(sitemap, 'utf8');
	return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => new URL(match[1]).pathname);
}
