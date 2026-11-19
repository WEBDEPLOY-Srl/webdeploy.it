// @ts-check
// SPDX-FileCopyrightText: 2026 WEBDEPLOY S.R.L.
// SPDX-License-Identifier: AGPL-3.0-only
import { element } from './dom.mjs';
import { loadVendor } from './vendor-load.mjs';
import { debug } from './logger.mjs';

const frame = element(document, '.contact-map', HTMLElement);
const canvas = element(frame, '.contact-map__canvas', HTMLElement);
const overlay = element(frame, '.contact-map__overlay', HTMLElement);
let started = false;
async function initialize() {
	if (started) return;
	started = true;
	observer.disconnect();
	try {
		await Promise.all([
			loadVendor(new URL('../vendor/leaflet-1.9.4/dist/leaflet.js', import.meta.url), 'classic'),
			loadVendor(new URL('../vendor/leaflet-1.9.4/dist/leaflet.css', import.meta.url), 'stylesheet')
		]);
		const leaflet = window.L;
		if (!leaflet) throw new Error('Leaflet did not initialize');
		/** @type {[number,number]} */
		const point = [44.794906009886205, 10.339969612796434];
		const map = leaflet.map(canvas).setView(point, 13);
		leaflet
			.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
				maxZoom: 19,
				attribution:
					'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
			})
			.addTo(map);
		const marker = document.createElement('div');
		marker.className = 'map-pin';
		const icon = document.createElement('span');
		icon.className = 'pixel-icon pixel-icon-map-pin';
		icon.setAttribute('aria-hidden', 'true');
		marker.append(icon);
		const popup = element(
			frame,
			'template',
			HTMLTemplateElement
		).content.firstElementChild?.cloneNode(true);
		if (!(popup instanceof HTMLElement)) throw new Error('Missing map popup');
		leaflet
			.marker(point, {
				title: 'WEBDEPLOY S.R.L.',
				icon: leaflet.divIcon({
					className: 'custom-marker',
					html: marker,
					iconSize: [32, 32],
					iconAnchor: [16, 32]
				})
			})
			.addTo(map)
			.bindPopup(popup);
		overlay.hidden = true;
		debug('Map', 'Initialized contact map');
	} catch {
		canvas.hidden = true;
		overlay.textContent = frame.dataset.error ?? '';
		debug('Map', 'Local map unavailable');
	}
}
const observer = new IntersectionObserver(
	(entries) => {
		if (entries.some((entry) => entry.isIntersecting)) void initialize();
	},
	{ rootMargin: '100px' }
);
observer.observe(frame);
frame.closest('section')?.addEventListener('focusin', () => {
	void initialize();
});
