// @ts-check
// SPDX-FileCopyrightText: 2026 WEBDEPLOY S.R.L.
// SPDX-License-Identifier: AGPL-3.0-only
import { element } from './dom.mjs';
import { debug } from './logger.mjs';

const controls = element(document, '.share-controls', HTMLElement);
const linkedIn = element(controls, '.btn-social-linkedin', HTMLAnchorElement);
const instagram = element(controls, '.btn-social-instagram', HTMLButtonElement);
const url = element(document, 'link[rel=canonical]', HTMLLinkElement).href;
const title = element(document, '.article-title', HTMLElement).textContent;
const toast = element(document, '.toast-container', HTMLElement);
const message = element(toast, '.toast', HTMLElement);
const mobile =
	/Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ||
	(/Macintosh/.test(navigator.userAgent) && navigator.maxTouchPoints > 1);
let timer = 0;
/** @type {File|null} */
let story = null;

/** @param {string | undefined} text */
function announce(text) {
	clearTimeout(timer);
	message.textContent = text ?? '';
	toast.hidden = false;
	timer = window.setTimeout(() => {
		toast.hidden = true;
		message.textContent = '';
	}, 3000);
}
/** @param {string} placement @returns {string} */
function campaign(placement) {
	const target = new URL(url);
	target.searchParams.set(
		'mtm_campaign',
		'news-' + target.pathname.split('/').filter(Boolean).at(-1)
	);
	target.searchParams.set('mtm_kwd', placement);
	return target.href;
}
/** @param {string} value @returns {Promise<boolean>} */
async function copy(value) {
	try {
		if (navigator.clipboard) {
			await navigator.clipboard.writeText(value);
			return true;
		}
	} catch {
		debug('Share', 'Clipboard access unavailable');
	}
	const field = document.createElement('textarea');
	field.className = 'clipboard-fallback';
	field.value = value;
	const focus = document.activeElement;
	try {
		document.body.append(field);
		field.select();
		return document.execCommand('copy');
	} catch {
		return false;
	} finally {
		field.remove();
		if (focus instanceof HTMLElement) focus.focus({ preventScroll: true });
	}
}

if (mobile && typeof navigator.canShare === 'function') {
	// Prepare the file before the click. Waiting for canvas encoding inside the
	// click handler would consume the user activation needed by navigator.share.
	void import('./story-image.mjs')
		.then(async ({ createStoryImage }) => {
			const image = element(document, '.article-image', HTMLImageElement);
			const date = element(document, '.article-date', HTMLElement).textContent;
			const file = await createStoryImage({
				title,
				date,
				image: image.currentSrc || image.src,
				url
			});
			if (navigator.canShare({ files: [file] })) story = file;
		})
		.catch(() => debug('Share', 'Story preparation unavailable'));
}
linkedIn.addEventListener('click', (event) => {
	event.preventDefault();
	const left = Math.round((innerWidth - 600) / 2 + screenX),
		top = Math.round((innerHeight - 600) / 2 + screenY);
	const popup = window.open(
		linkedIn.href,
		'linkedin-share',
		`width=600,height=600,left=${left},top=${top},menubar=no,toolbar=no,location=no,status=no,resizable=yes,scrollbars=yes`
	);
	if (popup) popup.opener = null;
	else {
		window.open(linkedIn.href, '_blank', 'noopener,noreferrer');
		announce(controls.dataset.popupBlocked);
	}
});
instagram.addEventListener('click', async () => {
	const target = campaign(mobile ? 'instagram-story' : 'instagram');
	const copying = copy(target);
	if (!mobile) {
		announce((await copying) ? controls.dataset.desktop : controls.dataset.copyFailed);
		return;
	}
	try {
		if (story) await navigator.share({ files: [story] });
		else if (typeof navigator.share === 'function')
			await navigator.share({ title, text: controls.dataset.shareText, url: target });
	} catch (error) {
		if (error instanceof Error && error.name === 'AbortError') return;
	}
	announce(
		(await copying)
			? story
				? controls.dataset.storyCopied
				: controls.dataset.linkCopied
			: controls.dataset.copyFailed
	);
});
