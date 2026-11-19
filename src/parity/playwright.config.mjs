// @ts-check
// SPDX-FileCopyrightText: 2026 WEBDEPLOY S.R.L.
// SPDX-License-Identifier: AGPL-3.0-only
import { homedir } from 'node:os';
import { join, resolve } from 'node:path';
import { defineConfig } from '@playwright/test';

const baseURL = process.env.E2E_BASE_URL;
if (!baseURL || new URL(baseURL).hostname !== '127.0.0.1') {
	throw new Error('E2E_BASE_URL must identify the local nginx container on 127.0.0.1');
}
const directory = resolve(process.env.PARITY_DIR ?? join(homedir(), 'work/webdeploy-oss/parity/current'));
const run = process.env.PARITY_RUN;
if (!run || !/^[a-zA-Z0-9_-]+$/.test(run)) throw new Error('Set PARITY_RUN to a unique run name');

/** @type {import('@playwright/test').Project[]} */
const projects = [];
const engines = /** @type {const} */ (['firefox', 'chromium']);
for (const browserName of engines) {
	for (const [name, width, height] of /** @type {const} */ ([
		['desktop', 1280, 900],
		['mobile', 390, 844]
	])) {
		projects.push({
			name: `${browserName}-${name}`,
			use: { browserName, viewport: { width, height }, hasTouch: name === 'mobile' }
		});
	}
}

export default defineConfig({
	testDir: '.',
	testMatch: 'parity.spec.mjs',
	projects,
	workers: 1,
	retries: 0,
	timeout: 60_000,
	reporter: [['list'], ['json', { outputFile: join(directory, run, 'results.json') }]],
	outputDir: join(directory, run, 'capture'),
	snapshotPathTemplate: join(directory, 'reference', '{projectName}', '{arg}{ext}'),
	preserveOutput: 'always',
	updateSnapshots: 'none',
	use: {
		baseURL,
		deviceScaleFactor: 1,
		colorScheme: 'dark',
		reducedMotion: 'reduce',
		locale: 'en-US',
		timezoneId: 'UTC',
		serviceWorkers: 'block'
	}
});
