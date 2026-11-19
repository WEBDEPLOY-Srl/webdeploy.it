// @ts-check
// SPDX-FileCopyrightText: 2026 WEBDEPLOY S.R.L.
// SPDX-License-Identifier: AGPL-3.0-only
import { spawnSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { files } from './files.mjs';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const sources = ['build.mjs', 'playwright.config.mjs'];
for (const dir of ['build-tools', 'content', 'data', 'assets/js', 'e2e', 'test', 'parity']) {
	for (const file of await files(join(root, dir)))
		if (file.endsWith('.mjs')) sources.push(join(dir, file));
}
for (const file of sources) {
	const result = spawnSync(process.execPath, ['--check', join(root, file)], { stdio: 'inherit' });
	if (result.error) throw result.error;
	if (result.status !== 0) process.exit(result.status ?? 1);
}
process.stdout.write(`Syntax checked ${sources.length} modules.\n`);
