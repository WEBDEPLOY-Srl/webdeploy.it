/**
 * Serialises schema.org data into a JSON-LD script element for {@html}.
 *
 * `<` is escaped so text inside the data can never close the script element or
 * open a comment; U+2028 and U+2029 are escaped so the output is also valid
 * JavaScript in older parsers.
 */
export function serialiseJsonLd(data: unknown): string {
	return JSON.stringify(data)
		.replace(/</g, '\\u003c')
		.replace(/\u2028/g, '\\u2028')
		.replace(/\u2029/g, '\\u2029');
}

/** The complete `<script type="application/ld+json">` element for the given data. */
export function jsonLdScript(data: unknown): string {
	return `<script type="application/ld+json">${serialiseJsonLd(data)}</script>`;
}
