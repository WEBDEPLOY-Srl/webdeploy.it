// @ts-check
// SPDX-FileCopyrightText: 2026 WEBDEPLOY S.R.L.
// SPDX-License-Identifier: AGPL-3.0-only

/** @type {import("../types.d.ts").SitePage[]} */
export const pages = [
	{
		path: '/',
		file: 'index.html',
		title: 'home.metaTitle',
		description: 'home.metaDescription',
		styles: ['components/hero', 'components/workstation', 'pages/home'],
		preloadImage: '/images/neon-cafe-workshop.webp'
	},
	{
		path: '/contacts',
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
			width: 1200,
			height: 1600
		}
	},
	{
		path: '/news/php2shell-cve-2026-109618-109619',
		file: 'news/php2shell-cve-2026-109618-109619.html',
		title: 'news.php2shell.title',
		description: 'news.php2shell.metaDescription',
		styles: ['components/newsletter-band'],
		kind: 'article',
		published: '2026-10-22',
		image: '/news-php2shell.webp',
		card: {
			date: 'news.php2shell.date',
			description: 'news.php2shell.description',
			image: '/news-php2shell.webp',
			width: 1122,
			height: 748
		}
	},
	{
		path: '/newsletter',
		file: 'newsletter.html',
		title: 'newsletter.title',
		description: 'newsletter.metaDescription',
		styles: ['components/newsletter-form', 'pages/newsletter']
	},
	{
		path: '/newsletter/confirmed',
		file: 'newsletter/confirmed.html',
		title: 'newsletter.confirmedTitle',
		description: 'newsletter.confirmedText',
		styles: ['pages/newsletter-confirmed'],
		robots: 'noindex, follow'
	},
	{
		path: '/privacy',
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
		file: 'totem.html',
		title: 'totem.heroName',
		description: 'totem.metaDescription',
		styles: ['components/hero', 'components/kiosk', 'pages/totem'],
		image: '/images/inwd-kiosk-photo.webp'
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
