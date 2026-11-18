// @ts-check
// SPDX-FileCopyrightText: 2026 WEBDEPLOY S.R.L.
// SPDX-License-Identifier: AGPL-3.0-only
import { element } from './dom.mjs';

/** @returns {void} */
export function initializeNavigation() {
	const header = element(document, '.site-header', HTMLElement);
	const buttons = Array.from(header.querySelectorAll('.site-nav__trigger')).filter(
		(b) => b instanceof HTMLButtonElement
	);
	let closeTimer = 0;
	/** @param {HTMLButtonElement|null} [active] */
	function expand(active = null) {
		clearTimeout(closeTimer);
		for (const button of buttons) button.setAttribute('aria-expanded', String(button === active));
	}
	for (const button of buttons) {
		const group = button.parentElement;
		if (!group) continue;
		const items = Array.from(group.querySelectorAll('a[role="menuitem"]')).filter(
			(a) => a instanceof HTMLAnchorElement
		);
		group.addEventListener('pointerenter', (event) => {
			if (event.pointerType !== 'touch') expand(button);
		});
		group.addEventListener('pointerleave', (event) => {
			if (event.pointerType !== 'touch') closeTimer = window.setTimeout(() => expand(), 150);
		});
		group.addEventListener('focusout', (event) => {
			if (!(event.relatedTarget instanceof Node) || !group.contains(event.relatedTarget)) expand();
		});
		button.addEventListener('click', () =>
			expand(button.getAttribute('aria-expanded') === 'true' ? null : button)
		);
		group.addEventListener('keydown', (event) => {
			if (event.key === 'Escape') {
				expand();
				button.focus();
				return;
			}
			if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return;
			event.preventDefault();
			expand(button);
			const index = items.findIndex((item) => item === event.target);
			const next =
				index === -1
					? event.key === 'ArrowDown'
						? 0
						: items.length - 1
					: (index + (event.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length;
			items[next]?.focus();
		});
	}
	document.addEventListener('pointerdown', (event) => {
		if (!(event.target instanceof Element) || !event.target.closest('.dropdown-container'))
			expand();
	});
	const toggle = element(header, '.site-menu-toggle', HTMLButtonElement);
	const mobile = element(header, '#mobile-navigation-template', HTMLTemplateElement);
	const icon = element(toggle, '.pixel-icon', HTMLElement);
	function closeMobile() {
		header.querySelector('#mobile-menu')?.remove();
		toggle.setAttribute('aria-expanded', 'false');
		toggle.setAttribute('aria-label', toggle.dataset.openLabel ?? '');
		icon.classList.replace('pixel-icon-close', 'pixel-icon-menu');
	}
	toggle.addEventListener('click', () => {
		if (header.querySelector('#mobile-menu')) {
			closeMobile();
			return;
		}
		header.append(mobile.content.cloneNode(true));
		toggle.setAttribute('aria-expanded', 'true');
		toggle.setAttribute('aria-label', toggle.dataset.closeLabel ?? '');
		icon.classList.replace('pixel-icon-menu', 'pixel-icon-close');
		const nav = element(header, '#mobile-menu', HTMLElement);
		const trigger = element(nav, '.mobile-nav-trigger', HTMLButtonElement);
		const services = element(nav, '#mobile-services-menu', HTMLElement);
		trigger.addEventListener('click', () => {
			services.hidden = !services.hidden;
			trigger.setAttribute('aria-expanded', String(!services.hidden));
		});
		nav.addEventListener('keydown', (event) => {
			if (event.key === 'Escape') {
				closeMobile();
				toggle.focus();
			}
		});
		nav.addEventListener('click', (event) => {
			if (event.target instanceof Element && event.target.closest('a')) closeMobile();
		});
	});
	window.addEventListener('pageshow', (event) => {
		if (event.persisted) {
			expand();
			closeMobile();
		}
	});
}
