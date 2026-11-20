// @ts-check
// SPDX-FileCopyrightText: 2026 WEBDEPLOY S.R.L.
// SPDX-License-Identifier: AGPL-3.0-only
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const sitemap = fileURLToPath(new URL('../build/sitemap.xml', import.meta.url));
/** Path of every page the sitemap lists, read from the production build. @returns {string[]} */
export function sitemapPaths() {
	if (!existsSync(sitemap)) {
		throw new Error('build/sitemap.xml is missing: run `npm run build` before the e2e tests.');
	}
	const xml = readFileSync(sitemap, 'utf8');
	return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => new URL(match[1]).pathname);
}
