// @ts-check
// SPDX-FileCopyrightText: 2026 WEBDEPLOY S.R.L.
// SPDX-License-Identifier: AGPL-3.0-only
import { createServer, request } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { within } from './files.mjs';

/** @type {Record<string,string>} */
const types = {
	'.html': 'text/html; charset=utf-8',
	'.css': 'text/css',
	'.mjs': 'text/javascript',
	'.js': 'text/javascript',
	'.json': 'application/json',
	'.xml': 'application/xml',
	'.txt': 'text/plain',
	'.woff2': 'font/woff2',
	'.png': 'image/png',
	'.svg': 'image/svg+xml',
	'.jpg': 'image/jpeg',
	'.webp': 'image/webp'
};

/**
 * The relay forwards nginx's original status, headers and encoded body. Local
 * preview resolves clean URLs but the acceptance suite always uses real nginx.
 * @param {{root:string, upstream?:URL}} options
 * @returns {import('node:http').Server}
 */
export function previewServer({ root, upstream }) {
	return createServer(async (req, res) => {
		try {
			if (upstream) {
				const forward = request(
					{
						hostname: upstream.hostname,
						port: upstream.port || 80,
						path: req.url,
						method: req.method,
						headers: req.headers
					},
					(origin) => {
						res.writeHead(origin.statusCode ?? 502, origin.rawHeaders);
						origin.pipe(res);
					}
				);
				forward.on('error', () => {
					res.writeHead(502);
					res.end();
				});
				req.pipe(forward);
				return;
			}
			const pathname = decodeURIComponent(new URL(req.url ?? '/', 'http://localhost').pathname);
			const short = pathname.replace(/^\/+/, '');
			const candidates = short
				? [short, short + '.html', join(short, 'index.html')]
				: ['index.html'];
			for (const name of [...candidates, '404.html']) {
				const path = within(root, name);
				if (!(await stat(path, { throwIfNoEntry: false }))?.isFile()) continue;
				res.writeHead(name === '404.html' ? 404 : 200, {
					'content-type': types[extname(path)] ?? 'application/octet-stream'
				});
				res.end(req.method === 'HEAD' ? undefined : await readFile(path));
				return;
			}
			res.writeHead(404);
			res.end();
		} catch {
			if (!res.headersSent) res.writeHead(400);
			res.end();
		}
	});
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
	const server = previewServer({
		root: resolve(process.argv[2] ?? 'build'),
		upstream: process.env.NGINX_UPSTREAM ? new URL(process.env.NGINX_UPSTREAM) : undefined
	});
	server.listen(Number(process.env.PORT ?? 4173), '127.0.0.1');
}
