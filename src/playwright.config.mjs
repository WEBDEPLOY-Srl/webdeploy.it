// @ts-check
// SPDX-FileCopyrightText: 2026 WEBDEPLOY S.R.L.
// SPDX-License-Identifier: AGPL-3.0-only
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
	testDir: 'e2e',
	testMatch: '**/*.spec.mjs',
	workers: 1,
	retries: 0,
	fullyParallel: false,
	forbidOnly: !!process.env.CI,
	reporter: process.env.CI ? 'list' : [['list'], ['html', { open: 'never' }]],
	use: {
		baseURL: process.env.E2E_BASE_URL ?? 'http://127.0.0.1:18080',
		trace: 'retain-on-failure'
	},
	projects: [
		{ name: 'firefox', use: { ...devices['Desktop Firefox'] } },
		{
			name: 'chromium',
			use: { ...devices['Desktop Chrome'], launchOptions: { args: ['--disable-dev-shm-usage'] } }
		}
	]
});
