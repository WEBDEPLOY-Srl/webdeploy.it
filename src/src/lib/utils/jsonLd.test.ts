import { describe, expect, it } from 'vitest';
import { jsonLdScript, serialiseJsonLd } from './jsonLd';

describe('serialiseJsonLd', () => {
	it('round-trips ordinary data', () => {
		const data = { '@type': 'Organization', name: 'WEBDEPLOY', tags: ['a', 'b'], n: 3 };
		expect(JSON.parse(serialiseJsonLd(data))).toEqual(data);
	});

	it('never lets text close the script element or open a comment', () => {
		const data = { headline: '</script><script>alert(1)</script><!-- x -->' };
		const out = serialiseJsonLd(data);
		expect(out).not.toContain('<');
		expect(JSON.parse(out)).toEqual(data);
	});

	it('escapes the JavaScript line separators', () => {
		const data = { text: 'a\u2028b\u2029c' };
		const out = serialiseJsonLd(data);
		expect(out).not.toMatch(/[\u2028\u2029]/);
		expect(JSON.parse(out)).toEqual(data);
	});
});

describe('jsonLdScript', () => {
	it('wraps the data in exactly one script element', () => {
		const html = jsonLdScript({ headline: '</script><img src=x onerror=alert(1)>' });
		expect(html.startsWith('<script type="application/ld+json">')).toBe(true);
		expect(html.endsWith('</script>')).toBe(true);
		expect(html.match(/<\/script>/g)).toHaveLength(1);
		expect(html.match(/<script/g)).toHaveLength(1);
		expect(html).not.toContain('<img');
	});
});
