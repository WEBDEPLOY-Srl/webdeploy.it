// @ts-check
// SPDX-FileCopyrightText: 2026 WEBDEPLOY S.R.L.
// SPDX-License-Identifier: AGPL-3.0-only

const cardMasterWidths = { fosdem: 1200, php2shell: 1122 };
const stampWidths = [400, 592, 672, 800, 960];

/** @param {string} extension @returns {string} */
function stampSources(extension) {
	return stampWidths
		.map((width) => `/images/neon-cafe-stamp-${width}.${extension} ${width}w`)
		.join(', ');
}

const stampSizes =
	'(max-width: 639px) and (max-height: 44rem) min(15rem, calc(100vw - 2rem)), (min-width: 83.333rem) 31rem, (min-width: 64rem) calc(40vw - 1.5rem), (min-width: 48rem) calc(40vw - 1.5rem), calc(100vw - 2rem)';

/** @param {keyof typeof cardMasterWidths} image @param {string} extension @returns {string} */
function cardSources(image, extension) {
	return [400, 592, 672, 800, cardMasterWidths[image]]
		.map((width) => `/images/${image}-card-${width}.${extension} ${width}w`)
		.join(', ');
}

/** @type {import("../types.d.ts").SitePage[]} */
export const pages = [
	{
		path: '/',
		entry: 'home-start',
		firstStylesheet: 'home-first',
		embeddedPortrait: '/images/neon-cafe-portrait.avif',
		file: 'index.html',
		title: 'home.metaTitle',
		description: 'home.metaDescription',
		styles: ['components/hero', 'components/workstation', 'pages/home']
	},
	{
		path: '/contacts',
		modules: ['map'],
		file: 'contacts.html',
		title: 'contacts.title',
		description: 'contacts.business.description',
		styles: ['components/map', 'pages/contacts']
	},
	{
		path: '/developer-manifesto',
		file: 'developer-manifesto.html',
		title: 'manifesto.title',
		description: 'manifesto.devExp.description',
		styles: ['pages/developer-manifesto']
	},
	{
		path: '/news',
		file: 'news.html',
		title: 'news.title',
		description: 'news.metaDescription',
		styles: ['components/newsletter-band']
	},
	{
		path: '/news/fosdem-2026',
		priorityImage: {
			type: 'image/avif',
			srcset: '/images/fosdem-article-480.avif 480w, /images/fosdem-article-672.avif 672w, /images/fosdem-article-800.avif 800w, /images/fosdem-article-1200.avif 1200w',
			sizes: '(min-width: 56rem) 53.5rem, calc(100vw - 2.5rem)'
		},
		modules: ['share'],
		file: 'news/fosdem-2026.html',
		title: 'news.fosdem2026.title',
		description: 'news.fosdem2026.description',
		styles: ['components/newsletter-band'],
		kind: 'article',
		published: '2026-02-04',
		image: '/images/og/fosdem-2026.jpg',
		card: {
			date: 'news.fosdem2026.date',
			description: 'news.fosdem2026.description',
			image: '/fosdem-2026.jpg',
			sources: cardSources('fosdem', 'avif'),
			fallback: { type: 'image/jpeg', srcset: cardSources('fosdem', 'jpg') },
			width: cardMasterWidths.fosdem,
			height: 1600
		}
	},
	{
		path: '/news/php2shell-cve-2026-109618-109619',
		modules: ['share'],
		file: 'news/php2shell-cve-2026-109618-109619.html',
		title: 'news.php2shell.title',
		description: 'news.php2shell.metaDescription',
		styles: ['components/newsletter-band'],
		kind: 'article',
		published: '2026-10-22',
		image: '/images/og/php2shell.jpg',
		card: {
			date: 'news.php2shell.date',
			description: 'news.php2shell.description',
			image: '/news-php2shell.webp',
			sources: cardSources('php2shell', 'avif'),
			fallback: { type: 'image/webp', srcset: cardSources('php2shell', 'webp') },
			width: cardMasterWidths.php2shell,
			height: 748
		}
	},
	{
		path: '/newsletter',
		priorityImage: { type: 'image/avif', srcset: stampSources('avif'), sizes: stampSizes },
		modules: ['newsletter'],
		file: 'newsletter.html',
		title: 'newsletter.title',
		description: 'newsletter.metaDescription',
		styles: ['components/newsletter-form', 'pages/newsletter']
	},
	{
		path: '/newsletter/confirmed',
		modules: ['confirmed'],
		file: 'newsletter/confirmed.html',
		title: 'newsletter.confirmedTitle',
		description: 'newsletter.confirmedText',
		styles: ['pages/newsletter-confirmed'],
		robots: 'noindex, follow'
	},
	{
		path: '/privacy',
		modules: ['opt-out'],
		file: 'privacy.html',
		title: 'privacy.title',
		description: 'privacy.intro'
	},
	{
		path: '/security',
		file: 'security.html',
		title: 'security.title',
		description: 'security.metaDescription'
	},
	{
		path: '/services/backup',
		file: 'services/backup.html',
		title: 'services.backup.title',
		description: 'services.backup.metaDescription',
		styles: ['pages/services-backup'],
		kind: 'service',
		serviceType: 'Encrypted backup',
		image: '/images/og/backup.jpg'
	},
	{
		path: '/services/consulting',
		file: 'services/consulting.html',
		title: 'services.consulting.title',
		description: 'services.consulting.metaDescription',
		styles: ['components/tools', 'pages/services-consulting'],
		kind: 'service',
		serviceType: 'Open source consulting',
		image: '/images/og/consulting.jpg'
	},
	{
		path: '/services/linux-workstations',
		priorityImage: {
			type: 'image/avif',
			srcset: '/images/inwd-managed-480.avif 480w, /images/inwd-managed-672.avif 672w, /images/inwd-managed-760.avif 760w, /images/inwd-managed-1000.avif 1000w',
			sizes: '(min-width: 30rem) 28rem, calc(100vw - 2rem)'
		},
		modules: ['workstation'],
		file: 'services/linux-workstations.html',
		title: 'services.linux.title',
		description: 'services.linux.metaDescription',
		styles: ['components/workstation', 'pages/services-linux-workstations'],
		kind: 'service',
		serviceType: 'Linux workstation migration',
		image: '/images/og/linux.jpg'
	},
	{
		path: '/totem',
		priorityImage: {
			type: 'image/avif',
			srcset: '/images/inwd-kiosk-frame-320.avif 320w, /images/inwd-kiosk-frame-576.avif 576w, /images/inwd-kiosk-frame-898.avif 898w',
			sizes: '(max-width: 352px) calc(100vw - 2rem), 320px'
		},
		modules: ['kiosk'],
		file: 'totem.html',
		title: 'totem.heroName',
		description: 'totem.metaDescription',
		styles: ['components/hero', 'components/kiosk', 'pages/totem'],
		image: '/images/og/totem.jpg'
	},
	{
		path: '/404',
		modules: ['back'],
		file: '404.html',
		title: 'error.pageTitle',
		description: 'error.notFoundText',
		robots: 'noindex'
	}
];
