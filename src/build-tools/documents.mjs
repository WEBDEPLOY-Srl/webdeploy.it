// @ts-check
// SPDX-FileCopyrightText: 2026 WEBDEPLOY S.R.L.
// SPDX-License-Identifier: AGPL-3.0-only
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { mediaUrl, stylesheetPath } from './assets.mjs';
import { escapeHtml, render, stringAt, toolImages } from './template.mjs';
import { jsonLd, organization, pageSchema } from './schema.mjs';
import { within, write } from './files.mjs';

/** @typedef {import('../types.d.ts').SiteFacts} SiteFacts */
/** @typedef {import('../types.d.ts').SitePage} SitePage */
/** @typedef {import('../types.d.ts').BuiltAssets} BuiltAssets */
/** @typedef {import('../types.d.ts').Content} Content */

/** @param {SitePage['priorityImage']} image @returns {string} */
function preloadImage(image) {
	if (!image) return '';
	// Engines without responsive link preloads discover the selected source in the picture itself.
	const attributes = { href: image.srcset ? undefined : image.href, type: image.type, media: image.media,
		imagesrcset: image.srcset, imagesizes: image.srcset ? image.sizes : undefined };
	const values = Object.entries(attributes).filter(([, value]) => value !== undefined)
		.map(([name, value]) => `${name}="${escapeHtml(String(value))}"`);
	return '<link rel="preload" as="image" fetchpriority="high" ' + values.join(' ') + '>';
}

/** @param {SitePage} page @param {SiteFacts} site @param {Content} copy @param {BuiltAssets} assets @returns {string} */
function head(page, site, copy, assets) {
	const title = stringAt(copy, page.title) + (page.path === '/404' ? ' 404' : '');
	const description = stringAt(copy, page.description);
	const fullTitle = title + ' - ' + site.name;
	const url = new URL(page.path, site.url).href;
	const imagePath = page.image ?? site.defaultShareImage;
	const image = new URL(imagePath, site.url).href;
	/** @param {string} attribute @param {string} key @param {string} value */
	const meta = (attribute, key, value) =>
		`<meta ${attribute}="${escapeHtml(key)}" content="${escapeHtml(value)}">`;
	const tags = [
		`<title>${escapeHtml(fullTitle)}</title>`,
		meta('name', 'description', description),
		meta('name', 'title', fullTitle),
		meta('name', 'robots', page.robots ?? 'index, follow')
	];
	if (!page.robots)
		tags.push(
			meta(
				'name',
				'googlebot',
				'index, follow, max-video-preview:-1, max-image-preview:large, max-snippet:-1'
			)
		);
	if (page.path !== '/404') {
		tags.push(`<link rel="canonical" href="${escapeHtml(url)}">`);
		for (const [key, value] of Object.entries({
			type: page.kind === 'article' ? 'article' : 'website',
			url,
			title: fullTitle,
			description,
			image,
			site_name: site.name,
			locale: 'en_US'
		}))
			tags.push(meta('property', 'og:' + key, value));
		for (const [key, value] of Object.entries({
			card: 'summary_large_image',
			url,
			title: fullTitle,
			description,
			image
		}))
			tags.push(meta('name', 'twitter:' + key, value));
		if (imagePath.startsWith('/images/og/'))
			tags.push(
				meta('property', 'og:image:width', '1200'),
				meta('property', 'og:image:height', '630')
			);
		if (page.published) tags.push(meta('property', 'article:published_time', page.published));
	}
	tags.push(jsonLd(organization(site)), pageSchema(page, site, title, description));
	const modules = [page.entry ?? 'shell', ...(page.modules ?? [])];
	const entries = new Set(modules.map((name) => assets.base + '/js/' + name + '.mjs'));
	const reachable = new Set(entries);
	for (const url of reachable) {
		for (const dependency of assets.imports.get(url) ?? []) reachable.add(dependency);
	}
	for (const url of reachable) {
		if (!entries.has(url)) tags.push(`<link rel="modulepreload" href="${url}">`);
	}
	for (const url of entries) tags.push(`<script type="module" src="${url}"></script>`);
	return tags.filter(Boolean).join('\n');
}

/**
 * Preserve the distinct source attributions in one notice per published document.
 * @param {string} html
 * @returns {string}
 */
function collectNotices(html) {
	const notices = new Set();
	const body = html.replace(/<!-- (SPDX-FileCopyrightText: [^\n]+?) -->\s*<!-- (SPDX-License-Identifier: [^\n]+?) -->\s*/g, (_, owner, license) => {
		notices.add(owner + '\n' + license);
		return '';
	});
	return notices.size ? '<!--\n' + [...notices].join('\n\n') + '\n-->\n' + body : body;
}

/** @param {string} html @param {Map<string,string>} urls @returns {string} */
export function rewriteMedia(html, urls) {
	return html.replace(
		/\b(src|href|srcset|imagesrcset|data-image)="([^"]*)"/g,
		(whole, attr, raw) => {
			if (attr === 'srcset' || attr === 'imagesrcset') {
				const value = String(raw).replace(
					/(^\s*|,\s*)(\/[^,\s]+)/g,
					(_, separator, url) => separator + mediaUrl(url, urls)
				);
				return `${attr}="${value}"`;
			}
			// Licence hyperlinks, page links and all canonical URLs keep their public paths.
			if (!String(raw).startsWith('/')) return whole;
			return `${attr}="${mediaUrl(raw, urls)}"`;
		}
	);
}

/** @param {SitePage[]} pages @param {string} url @returns {string} */
export function sitemap(pages, url) {
	const locs = pages
		.filter((p) => !p.robots)
		.map((p) => new URL(p.path, url).href)
		.sort();
	return (
		'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
		locs.map((loc) => `  <url><loc>${escapeHtml(loc)}</loc></url>`).join('\n') +
		'\n</urlset>\n'
	);
}

/** @param {string} text @returns {string} */
function privacyLink(text) {
	const match = /^([^<>]*)<a href="\/privacy"(?: class="[^"]*")?>([^<>]+)<\/a>([^<>]*)$/.exec(text);
	if (!match) throw new Error('Expected the privacy notice link in consent.body');
	return (
		escapeHtml(match[1]) +
		'<a href="/privacy" class="prose-link">' +
		escapeHtml(match[2]) +
		'</a>' +
		escapeHtml(match[3])
	);
}

// Match .reading-wide padding, the two-column gap and each card's two 2px borders.
const cardSizes = [
	'(min-width: 80rem) calc(37rem - 4px)',
	'(min-width: 64rem) calc(50vw - 3rem - 4px)',
	'(min-width: 48rem) calc(50vw - 2.5rem - 4px)',
	'(min-width: 40rem) calc(100vw - 3rem - 4px)',
	'calc(100vw - 2rem - 4px)'
].join(', ');

/** @param {string} type @param {string} srcset @returns {string} */
function cardSource(type, srcset) {
	return `<source type="${type}" width="672" height="378" srcset="${escapeHtml(srcset)}" sizes="${cardSizes}">`;
}

/** @param {SitePage[]} pages @returns {SitePage[]} */
function articlesByDate(pages) {
	return pages.filter((page) => page.card).sort((a, b) => (b.published ?? '').localeCompare(a.published ?? ''));
}

/** @param {SitePage[]} pages @param {Content} copy @param {Map<string,string>} partials @returns {string} */
function newsCards(pages, copy, partials) {
	const card = partials.get('news-card');
	if (!card) throw new Error('Missing news-card partial');
	return pages.map((page, index) => {
			const fields = page.card;
			if (!fields) throw new Error('Missing card data: ' + page.path);
			return render(card, copy, partials, {
				url: escapeHtml(page.path),
				title: escapeHtml(stringAt(copy, page.title)),
				description: escapeHtml(stringAt(copy, fields.description)),
				image: escapeHtml(fields.image),
				cardLoading: index === 0 ? 'loading="eager" fetchpriority="high"' : 'loading="lazy"',
				cardSource: [
					fields.sources ? cardSource('image/avif', fields.sources) : '',
					fields.fallback ? cardSource(fields.fallback.type, fields.fallback.srcset) : ''
				].join('\n'),
				width: String(fields.width),
				height: String(fields.height),
				date: escapeHtml(stringAt(copy, fields.date))
			});
		})
		.join('\n');
}

/** @param {SitePage} page @param {SiteFacts} site @param {Content} copy @param {BuiltAssets} assets @param {Map<string,string>} partials @param {string} source @param {string} stage @param {SitePage[]} pages @returns {Promise<string>} */
export async function emitPage(page, site, copy, assets, partials, source, stage, pages) {
	const shell = partials.get('shell');
	if (!shell) throw new Error('Missing partial: shell');
	const template = await toolImages(await readFile(within(join(source, 'pages'), page.file), 'utf8'), partials, stage);
	const articles = template.includes('{{@newsCards}}') ? articlesByDate(pages) : [];
	const card = articles[0]?.card;
	const leadCard = card?.sources ? {
		type: 'image/avif', srcset: card.sources, sizes: cardSizes
	} : undefined;
	const fullSheet = assets.base + '/' + stylesheetPath(page.styles);
	const stylesheet = `<link rel="stylesheet" href="${fullSheet}">`;
	let styles = stylesheet;
	let portraitImage = '';
	if (page.embeddedPortrait) {
		const url = assets.urls.get(page.embeddedPortrait);
		if (!url || !url.endsWith('.avif')) throw new Error('Missing critical AVIF portrait: ' + page.embeddedPortrait);
		// The real portrait is small enough to travel with the first HTML response.
		// Wide displays and the WebP fallback keep their independently cached sources.
		portraitImage = 'data:image/avif;base64,' + (await readFile(join(stage, url))).toString('base64');
	}
	if (page.firstStylesheet) {
		styles = [
			`<link rel="stylesheet" href="${assets.base}/css/${escapeHtml(page.firstStylesheet)}.css">`,
			`<template id="home-page-styles">${stylesheet}</template>`,
			`<noscript>${stylesheet}</noscript>`
		].join('\n');
	}
	const slots = {
		head: (shell.includes('{{@styles}}') ? '' : styles + '\n') + head(page, site, copy, assets),
		styles,
		portraitImage,
		newsletterBrand: page.path === '/newsletter'
			? render('{{>newsletter-brand}}', copy, partials, {})
			: '',
		imagePreload: preloadImage(page.priorityImage ?? leadCard),
		prioritySources: escapeHtml(page.priorityImage?.srcset ?? ''),
		prioritySizes: escapeHtml(page.priorityImage?.sizes ?? ''),
		newsCards: articles.length ? newsCards(articles, copy, partials) : '',
		assetBase: assets.base,
		linkedIn:
			'https://www.linkedin.com/sharing/share-offsite/?url=' +
			encodeURIComponent(new URL(page.path, site.url).href),
		matomoUrl: escapeHtml(site.analytics?.matomo.url ?? ''),
		matomoSite: escapeHtml(site.analytics?.matomo.siteId ?? ''),
		pixelId: escapeHtml(site.analytics?.metaPixelId ?? ''),
		consentBody: partials.has('consent') ? privacyLink(stringAt(copy, 'consent.body')) : '',
		email: escapeHtml(site.contact.email),
		careersEmail: escapeHtml(site.contact.careersEmail),
		phoneHref: escapeHtml(site.contact.phone.href),
		phoneDisplay: escapeHtml(site.contact.phone.display),
		office: escapeHtml(
			[site.address.locality, site.address.street, site.address.postalCode].join(', ')
		),
		sourceUrl: escapeHtml(site.sourceUrl),
		shellClass:
			page.path === '/' ? 'home-preview' : page.path === '/newsletter' ? 'newsletter-landing' : '',
		body: ''
	};
	slots.body = render(template, copy, partials, slots);
	const html = collectNotices(rewriteMedia(render(shell, copy, partials, slots), assets.urls));
	const filename = page.path === '/' ? 'index.html' : page.path.slice(1) + '.html';
	await write(within(stage, filename), html);
	return html;
}
