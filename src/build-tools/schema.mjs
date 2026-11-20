// @ts-check
// SPDX-FileCopyrightText: 2026 WEBDEPLOY S.R.L.
// SPDX-License-Identifier: AGPL-3.0-only

/** @typedef {import('../types.d.ts').SiteFacts} SiteFacts */
/** @typedef {import('../types.d.ts').SitePage} SitePage */

/** @param {unknown} object @returns {string} */
export function jsonLd(object) {
	const data = JSON.stringify(object)
		.replaceAll('<', '\\u003c')
		.replaceAll('\u2028', '\\u2028')
		.replaceAll('\u2029', '\\u2029');
	return `<script type="application/ld+json">${data}</script>`;
}

/** @param {SiteFacts} site @returns {{'@type':string,name:string,url:string,logo:string}} */
export function publisher(site) {
	return {
		'@type': 'Organization',
		name: site.legalName,
		url: site.url,
		logo: new URL(site.logoPath, site.url).href
	};
}

/** @param {SiteFacts} site @returns {Record<string,unknown>} */
export function organization(site) {
	const { contact, address } = site;
	return {
		'@context': 'https://schema.org',
		...publisher(site),
		'@id': site.url + '/#organization',
		alternateName: site.name,
		description: site.description,
		address: {
			'@type': 'PostalAddress',
			streetAddress: address.street,
			postalCode: address.postalCode,
			addressLocality: address.locality,
			addressRegion: address.region,
			addressCountry: address.country
		},
		email: contact.email,
		telephone: contact.phone.href,
		contactPoint: [
			{
				'@type': 'ContactPoint',
				contactType: 'customer support',
				email: contact.email,
				telephone: contact.phone.href,
				availableLanguage: ['English', 'Italian']
			},
			{ '@type': 'ContactPoint', contactType: 'human resources', email: contact.careersEmail }
		],
		sameAs: [site.sourceUrl],
		serviceType: [...site.services],
		areaServed: { '@type': 'Country', name: site.areaServed }
	};
}

/** @param {SitePage} page @param {SiteFacts} site @param {string} title @param {string} description @returns {string} */
export function pageSchema(page, site, title, description) {
	const url = new URL(page.path, site.url).href;
	if (page.kind === 'article')
		return jsonLd({
			'@context': 'https://schema.org',
			'@type': 'NewsArticle',
			headline: title,
			description,
			image: [new URL(page.image ?? site.defaultShareImage, site.url).href],
			datePublished: page.published,
			dateModified: page.published,
			mainEntityOfPage: url,
			author: publisher(site),
			publisher: publisher(site)
		});
	if (page.kind === 'service')
		return jsonLd({
			'@context': 'https://schema.org',
			'@type': 'Service',
			name: title,
			description,
			serviceType: page.serviceType,
			url,
			provider: publisher(site)
		});
	return '';
}
