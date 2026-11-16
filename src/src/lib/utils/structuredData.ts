import { site, siteUrl } from '$lib/config/site';

/** The company as the publisher or provider of a page's own structured data. */
export function publisherJsonLd() {
	return {
		'@type': 'Organization',
		name: site.legalName,
		url: site.url,
		logo: siteUrl(site.logoPath)
	};
}

/** The site-wide Organization, built from the site data. */
export function organizationJsonLd() {
	const { address, contact } = site;
	return {
		'@context': 'https://schema.org',
		...publisherJsonLd(),
		'@id': `${site.url}/#organization`,
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
		telephone: `+${contact.phone.href.replace(/^\+/, '')}`,
		contactPoint: [
			{
				'@type': 'ContactPoint',
				contactType: 'customer support',
				email: contact.email,
				telephone: contact.phone.href,
				availableLanguage: ['English', 'Italian']
			},
			{
				'@type': 'ContactPoint',
				contactType: 'human resources',
				email: contact.careersEmail
			}
		],
		sameAs: [site.sourceUrl],
		serviceType: [...site.services],
		areaServed: { '@type': 'Country', name: site.areaServed }
	};
}
