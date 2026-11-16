import { describe, expect, it } from 'vitest';
import { localeCookie } from './locale.svelte';

describe('localeCookie', () => {
	it('is Secure and SameSite=Lax on HTTPS', () => {
		const cookie = localeCookie('nf_lang', 'en', true);
		expect(cookie).toMatch(/^nf_lang=en; /);
		expect(cookie).toContain('; SameSite=Lax');
		expect(cookie).toContain('; Secure');
		expect(cookie).toContain('; path=/');
	});

	it('drops Secure only off HTTPS, and keeps SameSite=Lax', () => {
		const cookie = localeCookie('nf_lang', 'en', false);
		expect(cookie).not.toContain('Secure');
		expect(cookie).toContain('; SameSite=Lax');
	});

	it('carries a valid expiry date', () => {
		const expires = /expires=([^;]+)/.exec(localeCookie('nf_lang', 'en', true))?.[1] ?? '';
		expect(Number.isNaN(Date.parse(expires))).toBe(false);
	});
});
