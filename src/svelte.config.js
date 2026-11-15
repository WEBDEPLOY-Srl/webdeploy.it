import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),

	kit: {
		// Prerendered pages carry this policy in a <meta> tag, with a hash for each
		// inline script SvelteKit writes. nginx sends the same policy as a header;
		// see scripts/nginx-csp.mjs. Only the hosts the site really talks to are
		// listed: the Matomo server, the OpenStreetMap tile server and, after the
		// visitor accepts marketing cookies, the Meta pixel.
		csp: {
			mode: 'hash',
			directives: {
				'default-src': ['self'],
				'script-src': ['self', 'https://analytics.inwd.org', 'https://connect.facebook.net'],
				'connect-src': [
					'self',
					'https://analytics.inwd.org',
					'https://www.facebook.com',
					'https://connect.facebook.net'
				],
				'img-src': [
					'self',
					'data:',
					'https://tile.openstreetmap.org',
					'https://analytics.inwd.org',
					'https://www.facebook.com'
				],
				'style-src': ['self'],
				// Pages are rendered with style attributes (layout values, the demos).
				// Attributes only: <style> elements and stylesheets stay restricted.
				'style-src-attr': ['unsafe-inline'],
				'font-src': ['self'],
				'object-src': ['none'],
				'base-uri': ['self'],
				'form-action': ['self']
			}
		},
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: '404.html',
			precompress: true,
			strict: true
		})
	}
};

export default config;
