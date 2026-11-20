// @ts-check
// SPDX-FileCopyrightText: 2026 WEBDEPLOY S.R.L.
// SPDX-License-Identifier: AGPL-3.0-only
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { watchSite } from '../build.mjs';
import { previewServer } from './serve.mjs';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const output = join(root, 'build');
await watchSite(root, output);
const port = Number(process.env.PORT ?? 5173);
previewServer({ root: output }).listen(port, '127.0.0.1', () => {
	process.stdout.write(`Development preview: http://127.0.0.1:${port}/\n`);
});
