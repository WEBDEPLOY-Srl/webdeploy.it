import { readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { GET } from './+server';

const routesRoot = fileURLToPath(new URL('..', import.meta.url));

/** Public path of every page on disk, found independently of the sitemap code. */
const pagesOnDisk = readdirSync(routesRoot, { recursive: true, encoding: 'utf8' })
	.filter((file) => file.endsWith('+page.svelte') && !file.includes('['))
	.map((file) => '/' + file.replace(/\/?\+page\.svelte$/, ''))
	.filter((path) => path !== '/newsletter/confirmed')
	.sort();

/** Throws unless the text is well-formed XML made of tags, text and entity references. */
function assertWellFormed(xml: string) {
	const stack: string[] = [];
	const token =
		/<\?xml[^>]*\?>|<\/([A-Za-z][\w:.-]*)\s*>|<([A-Za-z][\w:.-]*)((?:\s+[\w:.-]+="[^"<&]*")*)\s*(\/?)>|([^<]+)/g;
	let consumed = 0;
	for (const match of xml.matchAll(token)) {
		if (match.index !== consumed) throw new Error(`Unexpected markup at offset ${consumed}`);
		consumed += match[0].length;
		const [, closing, opening, , selfClosing, text] = match;
		if (closing) {
			if (stack.pop() !== closing) throw new Error(`Unbalanced </${closing}>`);
		} else if (opening && !selfClosing) {
			stack.push(opening);
		} else if (text && /&(?!(amp|lt|gt|quot|apos|#\d+|#x[0-9a-f]+);)/i.test(text)) {
			throw new Error('Unescaped ampersand in text');
		}
	}
	if (consumed !== xml.length) throw new Error(`Unparsed trailing markup at offset ${consumed}`);
	if (stack.length) throw new Error(`Unclosed <${stack.at(-1)}>`);
}

describe('sitemap.xml', async () => {
	const response = GET();
	const xml = await response.text();
	const locs = [...xml.matchAll(/<loc>([^<]*)<\/loc>/g)].map((match) => match[1]);

	it('is served as XML', () => {
		expect(response.headers.get('content-type')).toContain('application/xml');
	});

	it('is well-formed with the sitemap namespace', () => {
		expect(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true);
		expect(xml).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
		expect(() => assertWellFormed(xml)).not.toThrow();
	});

	it('detects malformed XML', () => {
		expect(() => assertWellFormed('<a><b></a>')).toThrow();
		expect(() => assertWellFormed('<a>fish & chips</a>')).toThrow();
	});

	it('lists every page exactly once and nothing else', () => {
		expect(pagesOnDisk.length).toBeGreaterThan(5);
		const paths = locs.map((loc) => new URL(loc).pathname);
		expect([...paths].sort()).toEqual(pagesOnDisk);
		expect(new Set(locs).size).toBe(locs.length);
	});

	it('uses canonical absolute https URLs', () => {
		for (const loc of locs) {
			const url = new URL(loc);
			expect(url.origin).toBe('https://webdeploy.it');
			expect(url.search + url.hash).toBe('');
		}
	});
});
