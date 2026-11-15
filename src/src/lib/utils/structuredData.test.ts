import { describe, expect, it } from 'vitest';
import { site } from '$lib/config/site';
import { organizationJsonLd, publisherJsonLd } from './structuredData';
import { serialiseJsonLd } from './jsonLd';

describe('organizationJsonLd', () => {
	const org = organizationJsonLd();

	it('describes the company from the site data', () => {
		expect(org['@type']).toBe('Organization');
		expect(org.name).toBe(site.legalName);
		expect(org.url).toBe(site.url);
		expect(org.logo).toBe(`${site.url}${site.logoPath}`);
		expect(org.email).toBe(site.contact.email);
		expect(org.address.addressLocality).toBe(site.address.locality);
		expect(org.address.streetAddress).toBe(site.address.street);
		expect(org.serviceType).toEqual([...site.services]);
	});

	it('lists a contact point for support and one for careers', () => {
		expect(org.contactPoint.map((point) => point.email)).toEqual([
			site.contact.email,
			site.contact.careersEmail
		]);
		expect(org.telephone).toBe('+393398183373');
	});

	it('has an identifier other pages can point at', () => {
		expect(org['@id']).toBe('https://webdeploy.it/#organization');
	});

	it('serialises to valid JSON that cannot close its script element', () => {
		const out = serialiseJsonLd(org);
		expect(out).not.toContain('<');
		expect(JSON.parse(out).name).toBe(site.legalName);
	});
});

describe('publisherJsonLd', () => {
	it('is the same company, in the short form pages embed', () => {
		const publisher = publisherJsonLd();
		const { name, url, logo } = organizationJsonLd();
		expect(publisher).toEqual({ '@type': 'Organization', name, url, logo });
	});
});
