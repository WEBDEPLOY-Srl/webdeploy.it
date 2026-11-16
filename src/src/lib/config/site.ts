/**
 * Facts about the site and the company that more than one place needs. Change
 * one here and every page, the structured data and the sitemap follow.
 *
 * `svelte.config.js` lists the analytics and map hosts in the Content-Security-Policy
 * by hand, because Node loads that file without TypeScript; a unit test keeps the
 * two in step.
 */
export const site = {
	url: 'https://webdeploy.it',
	name: 'WEBDEPLOY',
	legalName: 'WEBDEPLOY S.R.L.',
	/** Used in structured data; the page text and metadata come from the translations. */
	description:
		'Open source infrastructure and DevOps solutions. Linux migration, managed infrastructure, and interactive kiosk solutions.',
	logoPath: '/webdeploy-logo.svg',
	defaultShareImage: '/images/og/default.jpg',
	sourceUrl: 'https://github.com/WEBDEPLOY-Srl/webdeploy.it',

	contact: {
		email: 'info@webdeploy.it',
		careersEmail: 'careers@webdeploy.it',
		phone: { href: '+393398183373', display: '+39 339 8183373' }
	},

	address: {
		street: 'Via Puccini 15',
		postalCode: '43123',
		locality: 'Parma',
		region: 'PR',
		country: 'IT'
	},

	/** What the structured data says the company does. */
	services: ['DevOps', 'Linux Migration', 'Managed Infrastructure', 'Interactive Kiosk'],
	areaServed: 'Italy',

	analytics: {
		matomo: { url: 'https://analytics.inwd.org/', siteId: '3' },
		/** The Meta pixel (dataset) id is public: every visitor who consents sends it to Meta. */
		metaPixelId: '1041037201718407'
	}
} as const;

export const siteUrl = (path = '/') => new URL(path, site.url).href;
