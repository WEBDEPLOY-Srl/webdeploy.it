// @ts-check
// SPDX-FileCopyrightText: 2026 WEBDEPLOY S.R.L.
// SPDX-License-Identifier: AGPL-3.0-only

/**
 * Bound idle scheduling so an active page always starts the work. The returned
 * function can start it immediately on genuine input, once across all paths.
 * @param {() => void} task
 * @returns {() => void}
 */
export function onIdle(task) {
	let done = false;
	function start() {
		if (done) return;
		done = true;
		task();
	}
	if (typeof window.requestIdleCallback === 'function') window.requestIdleCallback(start, { timeout: 150 });
	else window.setTimeout(start, 0);
	return start;
}

/**
 * Prepare a visible or approaching control after layout. Keyboard and pointer
 * input take the immediate path, including when a page is restored from cache.
 * @param {HTMLElement} area
 * @param {() => void} task
 * @returns {void}
 */
export function onApproach(area, task) {
	let started = false;
	const observer = new IntersectionObserver((entries) => {
		if (entries.some((entry) => entry.isIntersecting)) {
			observer.disconnect();
			onIdle(start);
		}
	}, { rootMargin: '300px 0px' });
	function start() {
		if (started) return;
		started = true;
		observer.disconnect();
		for (const event of ['focusin', 'pointerdown', 'click']) area.removeEventListener(event, start, true);
		task();
	}
	for (const event of ['focusin', 'pointerdown', 'click']) area.addEventListener(event, start, true);
	observer.observe(area);
}
