// @ts-check
// SPDX-FileCopyrightText: 2026 WEBDEPLOY S.R.L.
// SPDX-License-Identifier: AGPL-3.0-only
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { mediaUrl } from './assets.mjs';
import { escapeHtml, render, stringAt } from './template.mjs';
import { jsonLd, organization, pageSchema } from './schema.mjs';
import { within, write } from './files.mjs';

/** @typedef {import('../types.d.ts').SiteFacts} SiteFacts */
/** @typedef {import('../types.d.ts').SitePage} SitePage */
/** @typedef {import('../types.d.ts').BuiltAssets} BuiltAssets */
/** @typedef {import('../types.d.ts').Content} Content */

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
	for (const css of ['site', ...(page.styles ?? [])])
		tags.push(`<link rel="stylesheet" href="${assets.base}/css/${css}.css">`);
	for (const name of new Set(['shell', ...(page.modules ?? [])])) {
		if (name === 'shell' || name === 'newsletter')
			tags.push(`<link rel="modulepreload" href="${assets.base}/js/${name}.mjs">`);
		tags.push(`<script type="module" src="${assets.base}/js/${name}.mjs"></script>`);
	}
	if (page.preloadImage)
		tags.push(
			`<link rel="preload" as="image" fetchpriority="high" href="${escapeHtml(page.preloadImage)}">`
		);
	return tags.filter(Boolean).join('\n');
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

/** @param {SitePage[]} pages @param {Content} copy @param {Map<string,string>} partials @returns {string} */
function newsCards(pages, copy, partials) {
	const card = partials.get('news-card');
	if (!card) throw new Error('Missing news-card partial');
	return pages
		.filter((page) => page.card)
		.sort((a, b) => (b.published ?? '').localeCompare(a.published ?? ''))
		.map((page) => {
			const fields = page.card;
			if (!fields) throw new Error('Missing card data: ' + page.path);
			return render(card, copy, partials, {
				url: escapeHtml(page.path),
				title: escapeHtml(stringAt(copy, page.title)),
				description: escapeHtml(stringAt(copy, fields.description)),
				image: escapeHtml(fields.image),
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
	const template = await readFile(within(join(source, 'pages'), page.file), 'utf8');
	const slots = {
		head: head(page, site, copy, assets),
		newsCards: template.includes('{{@newsCards}}') ? newsCards(pages, copy, partials) : '',
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
			page.path === '/' ? 'home-preview' : page.path === '/newsletter' ? 'newsletterLanding' : '',
		body: ''
	};
	slots.body = render(template, copy, partials, slots);
	const html = rewriteMedia(render(shell, copy, partials, slots), assets.urls);
	const filename = page.path === '/' ? 'index.html' : page.path.slice(1) + '.html';
	await write(within(stage, filename), html);
	return html;
}
