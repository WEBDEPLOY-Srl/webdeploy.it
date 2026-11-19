// @ts-check
// SPDX-FileCopyrightText: 2026 WEBDEPLOY S.R.L.
// SPDX-License-Identifier: AGPL-3.0-only

/** @param {URL} url @param {'module'|'classic'|'stylesheet'} kind @returns {Promise<void>} */
export function loadVendor(url, kind) {
	return new Promise((resolve, reject) => {
		const tag =
			kind === 'stylesheet' ? document.createElement('link') : document.createElement('script');
		tag.onload = () => resolve();
		tag.onerror = () => reject(new Error('Could not load local ' + kind + ': ' + url.pathname));
		if (tag instanceof HTMLLinkElement) {
			tag.rel = 'stylesheet';
			tag.href = url.href;
		} else {
			if (kind === 'module') tag.type = 'module';
			tag.src = url.href;
		}
		document.head.append(tag);
	});
}
