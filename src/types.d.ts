// SPDX-FileCopyrightText: 2026 WEBDEPLOY S.R.L.
// SPDX-License-Identifier: AGPL-3.0-only

export type Content = string | readonly Content[] | { readonly [key: string]: Content };

export interface SitePage {
	path: string;
	file: string;
	title: string;
	description: string;
	image?: string;
	kind?: 'article' | 'service';
	published?: string;
	serviceType?: string;
	robots?: 'noindex, follow' | 'noindex';
	styles?: string[];
	modules?: string[];
	preloadImage?: string;
}

export interface BuiltAssets {
	base: string;
	urls: Map<string, string>;
}

export interface BuildInputs {
	root: string;
	output: string;
	pages: SitePage[];
	copy: Content;
}

export interface SiteFacts {
	url: string;
	name: string;
	legalName: string;
	description: string;
	logoPath: string;
	defaultShareImage: string;
	sourceUrl: string;
	contact: { email: string; careersEmail: string; phone: { href: string; display: string } };
	address: {
		street: string;
		postalCode: string;
		locality: string;
		region: string;
		country: string;
	};
	services: readonly string[];
	areaServed: string;
}
