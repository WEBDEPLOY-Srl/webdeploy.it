import { describe, expect, it } from 'vitest';
import config from '../../../svelte.config.js';
import { site } from './site';

describe('site data and the Content-Security-Policy', () => {
	const directives = config.kit?.csp?.directives as Record<string, string[]>;
	const hosts = (name: string) => directives[name] ?? [];

	it('allows the Matomo host that the tracker script is loaded from', () => {
		const origin = new URL(site.analytics.matomo.url).origin;
		expect(hosts('script-src')).toContain(origin);
		expect(hosts('connect-src')).toContain(origin);
	});

	it('uses https for every host it names', () => {
		const named = Object.values(directives)
			.flat()
			.filter((value) => value.includes('.'));
		expect(named.length).toBeGreaterThan(3);
		for (const host of named) expect(host).toMatch(/^https:\/\//);
	});

	it('keeps URLs free of a trailing slash and site paths absolute', () => {
		expect(site.url).not.toMatch(/\/$/);
		expect(site.logoPath).toMatch(/^\//);
		expect(site.defaultShareImage).toMatch(/^\//);
	});
});
