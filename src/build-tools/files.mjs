// @ts-check
// SPDX-FileCopyrightText: 2026 WEBDEPLOY S.R.L.
// SPDX-License-Identifier: AGPL-3.0-only
import { mkdir, readdir, writeFile } from 'node:fs/promises';
import { dirname, join, resolve, sep } from 'node:path';
import { createHash } from 'node:crypto';

/** @param {string} root @param {string} child @returns {string} */
export function within(root, child) {
	const target = resolve(root, child);
	if (!target.startsWith(resolve(root) + sep))
		throw new Error(`Path outside input directory: ${child}`);
	return target;
}

/** @param {string} root @param {string} [dir] @returns {Promise<string[]>} */
export async function files(root, dir = '') {
	const result = [];
	for (const entry of await readdir(join(root, dir), { withFileTypes: true })) {
		const name = join(dir, entry.name);
		if (entry.isDirectory()) result.push(...(await files(root, name)));
		else if (entry.isFile()) result.push(name);
		else throw new Error(`Unsupported build input: ${name}`);
	}
	return result.sort();
}

/** @param {string | Uint8Array} bytes @returns {string} */
export function digest(bytes) {
	return createHash('sha256').update(bytes).digest('hex');
}

/** @param {string} path @param {string | Uint8Array} bytes @returns {Promise<void>} */
export async function write(path, bytes) {
	await mkdir(dirname(path), { recursive: true });
	await writeFile(path, bytes);
}
