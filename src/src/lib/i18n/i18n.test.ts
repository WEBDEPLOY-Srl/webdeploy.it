import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { en } from './en';
import { it as itTranslations } from './it';

type Node = string | Node[] | { [key: string]: Node };

const kind = (value: unknown) =>
	Array.isArray(value) ? 'array' : value === null ? 'null' : typeof value;

/** Every difference in shape between two translation trees, as readable lines. */
function compare(reference: unknown, other: unknown, path: string, out: string[]) {
	if (kind(reference) !== kind(other)) {
		out.push(`${path}: ${kind(reference)} in en, ${kind(other)} in it`);
		return;
	}
	if (Array.isArray(reference) && Array.isArray(other)) {
		if (reference.length !== other.length) {
			out.push(`${path}: list of ${reference.length} in en, ${other.length} in it`);
		}
		const length = Math.min(reference.length, other.length);
		for (let index = 0; index < length; index += 1) {
			compare(reference[index], other[index], `${path}[${index}]`, out);
		}
		return;
	}
	if (reference && typeof reference === 'object' && other && typeof other === 'object') {
		const a = reference as Record<string, unknown>;
		const b = other as Record<string, unknown>;
		for (const key of Object.keys(a)) {
			if (!(key in b)) out.push(`${path}${path ? '.' : ''}${key}: missing in it`);
			else compare(a[key], b[key], `${path}${path ? '.' : ''}${key}`, out);
		}
		for (const key of Object.keys(b)) {
			if (!(key in a)) out.push(`${path}${path ? '.' : ''}${key}: missing in en`);
		}
	}
}

/** Dot-separated paths of every string leaf, lists addressed by index. */
function leaves(value: Node, path = '', out = new Map<string, string>()) {
	if (typeof value === 'string') out.set(path, value);
	else if (Array.isArray(value)) value.forEach((item, i) => leaves(item, `${path}.${i}`, out));
	else
		for (const [key, child] of Object.entries(value))
			leaves(child, path ? `${path}.${key}` : key, out);
	return out;
}

describe('translations', () => {
	it('en and it have the same keys, types and list lengths', () => {
		const differences: string[] = [];
		compare(en, itTranslations, '', differences);
		expect(differences).toEqual([]);
	});

	it('has no empty strings', () => {
		for (const [name, tree] of [
			['en', en],
			['it', itTranslations]
		] as const) {
			const empty = [...leaves(tree as Node)].filter(([, text]) => text.trim() === '');
			expect(empty.map(([path]) => `${name}:${path}`)).toEqual([]);
		}
	});
});

describe('translation keys used in the source', () => {
	const sourceRoot = fileURLToPath(new URL('../..', import.meta.url));

	const files = readdirSync(sourceRoot, { recursive: true, encoding: 'utf8' })
		.filter((file) => /\.(svelte|ts)$/.test(file) && !/\.test\.ts$/.test(file))
		.filter((file) => !file.startsWith('lib/i18n/'));

	// t('a.b'), tObj('a.b') and tObj<Type>('a.b') with a plain string literal.
	const call = /\b(?:t|tObj)(?:<[^>()]*>)?\(\s*(['"])([A-Za-z0-9_.]+)\1/g;
	// t(`a.${x}.b`): the key is built at run time, so only its shape can be checked.
	const templateCall = /\b(?:t|tObj)(?:<[^>()]*>)?\(\s*`([^`]*\$\{[^`]*)`/g;

	const used = new Map<string, string>();
	const templates = new Map<string, string>();
	for (const file of files) {
		const text = readFileSync(`${sourceRoot}/${file}`, 'utf8');
		for (const match of text.matchAll(call)) used.set(match[2], file);
		for (const match of text.matchAll(templateCall)) templates.set(match[1], file);
	}

	/** Every path in a tree, intermediate objects and lists included. */
	function paths(value: unknown, prefix = '', out: string[] = []) {
		if (value && typeof value === 'object') {
			for (const [key, child] of Object.entries(value)) {
				const path = prefix ? `${prefix}.${key}` : key;
				out.push(path);
				paths(child, path, out);
			}
		}
		return out;
	}

	/**
	 * A template such as `home.${key}.title` becomes a pattern in which each
	 * interpolation matches one run of non-dot characters, so `error.${s}Text`
	 * matches `error.notFoundText`.
	 */
	function templatePattern(template: string) {
		const escaped = template
			.split(/\$\{[^}]*\}/)
			.map((part) => part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
			.join('[^.]+');
		return new RegExp(`^${escaped}$`);
	}

	const lookup = (tree: unknown, key: string) =>
		key
			.split('.')
			.reduce<unknown>(
				(node, part) =>
					node && typeof node === 'object' ? (node as Record<string, unknown>)[part] : undefined,
				tree
			);

	it('finds the translation calls it is meant to check', () => {
		expect(files.length).toBeGreaterThan(20);
		expect(used.size).toBeGreaterThan(100);
		expect(templates.size).toBeGreaterThan(10);
	});

	it.each([
		['en', en],
		['it', itTranslations]
	] as const)('every literal key exists in %s', (_name, tree) => {
		const missing = [...used]
			.filter(([key]) => lookup(tree, key) === undefined)
			.map(([key, file]) => `${key} (used in ${file})`);
		expect(missing).toEqual([]);
	});

	it.each([
		['en', en],
		['it', itTranslations]
	] as const)('every template key matches at least one key in %s', (_name, tree) => {
		const known = paths(tree);
		const unmatched = [...templates]
			.filter(([template]) => {
				const pattern = templatePattern(template);
				return !known.some((path) => pattern.test(path));
			})
			.map(([template, file]) => `\`${template}\` (used in ${file})`);
		expect(unmatched).toEqual([]);
	});
});
