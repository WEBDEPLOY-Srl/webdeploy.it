import { describe, expect, it } from 'vitest';
import { en } from '$lib/i18n/en';
import { it as itTranslations } from '$lib/i18n/it';
import { footerGroups } from './footer';

const lookup = (tree: unknown, key: string) =>
	key
		.split('.')
		.reduce<unknown>(
			(node, part) =>
				node && typeof node === 'object' ? (node as Record<string, unknown>)[part] : undefined,
			tree
		);

describe('footerGroups', () => {
	const keys = footerGroups.flatMap((group) => [
		group.titleKey,
		...group.links.map((link) => link.labelKey)
	]);

	it.each([
		['en', en],
		['it', itTranslations]
	] as const)('only uses translation keys that exist in %s', (_name, tree) => {
		expect(keys.filter((key) => typeof lookup(tree, key) !== 'string')).toEqual([]);
	});

	it('links to pages that exist or to absolute addresses', () => {
		for (const link of footerGroups.flatMap((group) => group.links)) {
			if ('href' in link) expect(link.href).toMatch(/^(\/|https:\/\/|mailto:)/);
		}
	});

	it('has the cookie settings control exactly once', () => {
		const actions = footerGroups
			.flatMap((group) => group.links)
			.filter((link) => 'action' in link && link.action === 'cookieSettings');
		expect(actions).toHaveLength(1);
	});
});
