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
	entry?: string;
	firstStylesheet?: string;
	embeddedPortrait?: string;
	priorityImage?: {type: string; sizes?: string; media?: string} &
		({srcset: string; href?: string} | {href: string; srcset?: undefined});
	card?: { date: string; description: string; image: string; sources?: string; width: number; height: number };
}

export interface BuiltAssets {
	base: string;
	urls: Map<string, string>;
	imports: Map<string, string[]>;
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
	analytics?: { matomo: { url: string; siteId: string }; metaPixelId: string };
}

export type ConsentChoice = 'granted' | 'denied';
export type AnalyticsCommand = Array<string | number | boolean>;
export interface MetaPixel {
	(...args: unknown[]): void;
	callMethod?: (...args: unknown[]) => void;
	queue: unknown[][];
	push: (...args: unknown[]) => void;
	loaded: boolean;
	version: string;
}
export interface OptOutEnvironment {
	cookies: { read(): string; write(value: string): void };
	cookiesEnabled: boolean;
	isHttps: boolean;
	now(): number;
}
export interface MatomoOptOut {
	problem(): 'noCookies' | 'notHttps' | null;
	hasConsent(): boolean;
	giveConsent(): boolean;
	revokeConsent(): boolean;
}
declare global {
	interface Window {
		_paq?: AnalyticsCommand[];
		fbq?: MetaPixel;
		_fbq?: MetaPixel;
	}
}

export interface AltchaWidget extends HTMLElement {
	verify(): Promise<{ verified?: boolean; payload?: string } | null>;
	reset(): void;
	getState(): string;
	configure(settings: Record<string, unknown>): Promise<void>;
}
export interface LeafletMap {
	setView(coordinates: [number, number], zoom: number): LeafletMap;
	remove(): void;
}
export interface LeafletTiles {
	on(event: 'loading' | 'load' | 'tileload' | 'tileerror', listener: () => void): LeafletTiles;
	addTo(map: LeafletMap): LeafletTiles;
}
export interface LeafletApi {
	map(element: HTMLElement): LeafletMap;
	tileLayer(
		url: string,
		options: { maxZoom: number; attribution: string }
	): LeafletTiles;
	divIcon(options: {
		className: string;
		html: HTMLElement;
		iconSize: [number, number];
		iconAnchor: [number, number];
	}): object;
	marker(
		point: [number, number],
		options: { icon: object; title: string }
	): {
		addTo(map: LeafletMap): { bindPopup(element: HTMLElement): unknown };
	};
}
declare global {
	interface Window {
		$altcha?: { algorithms: Map<string, () => Worker> };
		L?: LeafletApi;
	}
	interface HTMLElementTagNameMap {
		'altcha-widget': AltchaWidget;
	}
}
