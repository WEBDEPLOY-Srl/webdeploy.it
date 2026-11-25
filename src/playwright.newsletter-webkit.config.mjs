// @ts-check
// SPDX-FileCopyrightText: 2026 WEBDEPLOY S.R.L.
// SPDX-License-Identifier: AGPL-3.0-only
import { defineConfig, devices } from '@playwright/test';
import base from './playwright.config.mjs';

export default defineConfig({
	...base,
	projects: [{
		name: 'newsletter-webkit',
		testMatch: '**/newsletter.spec.mjs',
		grep: /@webkit/,
		use: devices['Desktop Safari']
	}]
});
