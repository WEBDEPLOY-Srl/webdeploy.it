import { loadConfig } from '@sveltejs/load-config';
import { beforeAll, describe, expect, it } from 'vitest';
import { site } from './site';

describe('site data and the Content-Security-Policy', () => {
	let directives: Record<string, string[]>;
	const hosts = (name: string) => directives[name] ?? [];

	beforeAll(async () => {
		const loaded = await loadConfig('./', { traverse: false });
		if (!loaded || !('config' in loaded)) throw new Error('Could not load SvelteKit configuration');
		directives =
			(loaded.config.csp as { directives?: Record<string, string[]> } | undefined)?.directives ??
			{};
	});

	it('allows the Matomo host that the tracker script is loaded from', () => {
		const origin = new URL(site.analytics.matomo.url).origin;
		expect(hosts('script-src')).toContain(origin);
		expect(hosts('connect-src')).toContain(origin);
	});

	it('uses https for every host it names', () => {
		const named = Object.values(directives)
			.flatMap((values) => (Array.isArray(values) ? values : []))
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
