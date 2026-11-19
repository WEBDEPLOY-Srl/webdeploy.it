// @ts-check
// SPDX-FileCopyrightText: 2026 WEBDEPLOY S.R.L.
// SPDX-License-Identifier: AGPL-3.0-only
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { files } from '../build-tools/files.mjs';

/**
 * Identify blocks inside a style rule without treating braces in strings, URLs,
 * selectors or comments as block boundaries. Top-level grouping rules may nest.
 * @param {string} css
 * @returns {string[]}
 */
function nestedRules(css) {
	const text = css.replace(/\/\*[\s\S]*?\*\/|"(?:\\[\s\S]|[^"\\])*"|'(?:\\[\s\S]|[^'\\])*'|\\[\s\S]/g, ' ');
	const parents = [];
	const nested = [];
	let start = 0;
	let brackets = 0;
	for (let index = 0; index < text.length; index++) {
		const char = text[index];
		if (char === '(' || char === '[') brackets++;
		if (char === ')' || char === ']') brackets--;
		if (brackets || !'{};'.includes(char)) continue;
		if (char === '{') {
			const prelude = text.slice(start, index).trim();
			if (parents.at(-1) === 'style') nested.push(prelude);
			parents.push(prelude.startsWith('@') ? 'at-rule' : 'style');
		}
		if (char === '}') parents.pop();
		start = index + 1;
	}
	return nested;
}

test('authored CSS uses flat rules within the supported browser baseline', async () => {
	assert.deepEqual(nestedRules('@layer base { @media print { p::before { content: "{"; } } }'), []);
	assert.deepEqual(nestedRules('p { color: red; &:hover { color: blue } }'), ['&:hover']);
	assert.deepEqual(nestedRules('p { @media print { color: black } }'), ['@media print']);
	const root = fileURLToPath(new URL('../assets/css/', import.meta.url));
	for (const path of await files(root)) {
		if (path.endsWith('.css')) assert.deepEqual(nestedRules(await readFile(join(root, path), 'utf8')), [], path);
	}
});
