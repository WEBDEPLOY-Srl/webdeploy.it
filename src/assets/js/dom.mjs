// @ts-check
// SPDX-FileCopyrightText: 2026 WEBDEPLOY S.R.L.
// SPDX-License-Identifier: AGPL-3.0-only

/**
 * Look up a required control and verify its DOM interface at initialization.
 * @template {Element} T
 * @param {ParentNode} root
 * @param {string} selector
 * @param {{new(): T}} type
 * @returns {T}
 */
export function element(root, selector, type) {
	const result = root.querySelector(selector);
	if (!(result instanceof type)) throw new Error('Missing page element: ' + selector);
	return result;
}
