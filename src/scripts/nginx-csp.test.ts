import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { buildMap, extractPolicy, mapLine } from './nginx-csp.mjs';

const page = (policy: string) =>
	`<html><head><meta http-equiv="content-security-policy" content="${policy}"></head></html>`;

describe('extractPolicy', () => {
	it('reads the policy from the meta tag', () => {
		expect(extractPolicy(page("default-src 'self'; script-src 'sha256-abc='"))).toBe(
			"default-src 'self'; script-src 'sha256-abc='"
		);
	});

	it('decodes HTML entities', () => {
		expect(extractPolicy(page('img-src https://a.test/?x=1&amp;y=2'))).toBe(
			'img-src https://a.test/?x=1&y=2'
		);
	});

	it('returns null without a meta tag', () => {
		expect(extractPolicy('<html><head></head></html>')).toBeNull();
	});
});

describe('mapLine', () => {
	it('quotes the URI and the policy for nginx', () => {
		expect(mapLine('/contacts.html', "default-src 'self'")).toBe(
			`"/contacts.html" "default-src 'self'";`
		);
	});

	it('refuses characters that would break the nginx string', () => {
		expect(() => mapLine('/a.html', 'x "y"')).toThrow();
		expect(() => mapLine('/a.html', 'x $y')).toThrow();
		expect(() => mapLine('/a b.html', "default-src 'self'")).toThrow();
	});
});

describe('buildMap', () => {
	const dirs: string[] = [];
	afterEach(() => {
		for (const dir of dirs.splice(0)) rmSync(dir, { recursive: true, force: true });
	});
	const build = () => {
		const dir = mkdtempSync(join(tmpdir(), 'csp-'));
		dirs.push(dir);
		return dir;
	};

	it('maps every page, nested ones included, and ignores other files', () => {
		const dir = build();
		mkdirSync(join(dir, 'services'));
		writeFileSync(join(dir, 'index.html'), page("script-src 'sha256-a='"));
		writeFileSync(join(dir, 'services', 'backup.html'), page("script-src 'sha256-b='"));
		writeFileSync(join(dir, 'robots.txt'), 'User-agent: *');

		const map = buildMap(dir);
		expect(map).toContain(`"/index.html" "script-src 'sha256-a='";`);
		expect(map).toContain(`"/services/backup.html" "script-src 'sha256-b='";`);
		expect(map).not.toContain('robots');
	});

	it('fails when a page has no policy, so a build cannot ship without one', () => {
		const dir = build();
		writeFileSync(join(dir, 'index.html'), '<html></html>');
		expect(() => buildMap(dir)).toThrow(/index\.html has no Content-Security-Policy/);
	});

	it('fails on an empty build', () => {
		expect(() => buildMap(build())).toThrow(/no HTML pages/);
	});
});
