// @ts-check
// SPDX-FileCopyrightText: 2026 WEBDEPLOY S.R.L.
// SPDX-License-Identifier: AGPL-3.0-only
import assert from 'node:assert/strict';
import { once } from 'node:events';
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { previewServer } from '../build-tools/serve.mjs';

test('preview canonicalizes existing pages and 404s slashless directories', async (context) => {
	const root = await mkdtemp(join(tmpdir(), 'webdeploy-preview-'));
	await writeFile(join(root, 'index.html'), '<h1>Home</h1>');
	await writeFile(join(root, 'newsletter.html'), '<h1>Newsletter</h1>');
	await writeFile(join(root, 'contacts.html'), '<h1>Contacts</h1>');
	await mkdir(join(root, 'newsletter'));
	await writeFile(join(root, 'newsletter', 'confirmed.html'), '<h1>Confirmed</h1>');
	await mkdir(join(root, 'assets'));
	const server = previewServer({ root });
	const closed = once(server, 'close');
	context.after(async () => {
		server.close();
		await closed;
		await rm(root, { recursive: true, force: true });
	});
	server.listen(0, '127.0.0.1');
	await once(server, 'listening');
	const address = server.address();
	assert.ok(address && typeof address === 'object');
	const origin = `http://127.0.0.1:${address.port}`;

	const page = await fetch(origin + '/newsletter/?a=1&b=2', { redirect: 'manual' });
	assert.equal(page.status, 301);
	assert.equal(page.headers.get('location'), '/newsletter?a=1&b=2');
	const nested = await fetch(origin + '/newsletter/confirmed/', { redirect: 'manual' });
	assert.equal(nested.status, 301);
	assert.equal(nested.headers.get('location'), '/newsletter/confirmed');
	for (const path of ['//contacts/', '/%2F%2Fcontacts/']) {
		const duplicate = await fetch(origin + path, { redirect: 'manual' });
		assert.equal(duplicate.status, 301);
		assert.equal(duplicate.headers.get('location'), '/contacts');
	}
	assert.equal((await fetch(origin + '/')).status, 200);
	assert.equal((await fetch(origin + '/assets')).status, 404);
	assert.equal((await fetch(origin + '/assets/')).status, 404);
	assert.equal((await fetch(origin + '/nope/')).status, 404);
});
