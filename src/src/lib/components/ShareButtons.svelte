<script lang="ts">
	import { onMount } from 'svelte';
	import { t } from '$lib/i18n';
	import { browser } from '$app/environment';
	import { logShare } from '$lib/utils/logger';
	import { createStoryImage } from '$lib/utils/storyImage';

	interface Props {
		/** Canonical URL of the article */
		url: string;
		title: string;
		date: string;
		/** Featured image path, used for the Instagram Story card */
		image: string;
	}

	let { url, title, date, image }: Props = $props();

	// Toast state for clipboard fallback messages
	let toastMessage = $state('');
	let toastVisible = $state(false);
	let toastTimeout: ReturnType<typeof setTimeout> | null = null;

	// Story card prepared ahead of time: the share sheet must open within the click's user activation
	let storyFile: File | null = null;

	/**
	 * Phones and tablets only: Instagram Stories can't be created from a computer
	 */
	function isMobileDevice(): boolean {
		if (!browser) return false;
		const ua = navigator.userAgent;
		// iPadOS reports itself as Macintosh
		return (
			/Android|iPhone|iPad|iPod/i.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1)
		);
	}

	onMount(() => {
		if (!isMobileDevice() || !navigator.canShare) {
			logShare.log('Story card skipped: not a mobile device or no Web Share');
			return;
		}
		createStoryImage({ title, date, image, url })
			.then((file) => {
				if (navigator.canShare({ files: [file] })) {
					storyFile = file;
					logShare.log('Story card ready for sharing');
				} else {
					logShare.log('Story card not shareable on this browser');
				}
			})
			.catch((err) => logShare.error('Story card generation failed:', err));
	});

	/**
	 * Shows a toast notification that auto-dismisses after 3 seconds
	 */
	function showToast(message: string) {
		if (toastTimeout) {
			clearTimeout(toastTimeout);
		}
		toastMessage = message;
		toastVisible = true;
		logShare.log('Toast shown:', message);

		toastTimeout = setTimeout(() => {
			toastVisible = false;
			toastMessage = '';
		}, 3000);
	}

	/**
	 * Copies text to clipboard with fallback for older browsers
	 */
	async function copyToClipboard(text: string): Promise<boolean> {
		if (!browser) return false;

		try {
			if (navigator.clipboard && navigator.clipboard.writeText) {
				await navigator.clipboard.writeText(text);
				logShare.log('Copied to clipboard via Clipboard API');
				return true;
			}

			const textArea = document.createElement('textarea');
			textArea.value = text;
			textArea.style.position = 'fixed';
			textArea.style.left = '-9999px';
			textArea.style.top = '-9999px';
			document.body.appendChild(textArea);
			textArea.focus();
			textArea.select();

			const successful = document.execCommand('copy');
			document.body.removeChild(textArea);

			if (successful) {
				logShare.log('Copied to clipboard via execCommand fallback');
				return true;
			}
			return false;
		} catch (err) {
			logShare.log('Clipboard copy failed:', err);
			return false;
		}
	}

	/**
	 * Gets the canonical URL, falling back to current location
	 */
	function getArticleUrl(): string {
		if (!browser) return url;

		const canonicalLink = document.querySelector('link[rel="canonical"]');
		if (canonicalLink) {
			const href = canonicalLink.getAttribute('href');
			if (href) return href;
		}
		return window.location.href;
	}

	/**
	 * Adds Matomo campaign parameters, so visits from Instagram are attributed even
	 * when the in-app browser sends no referrer: campaign news-<slug>, keyword = placement.
	 */
	function campaignUrl(articleUrl: string, keyword: string): string {
		const tagged = new URL(articleUrl);
		const slug = tagged.pathname.split('/').filter(Boolean).pop() ?? 'news';
		tagged.searchParams.set('mtm_campaign', `news-${slug}`);
		tagged.searchParams.set('mtm_kwd', keyword);
		return tagged.toString();
	}

	/**
	 * Opens a centered popup window for sharing
	 */
	function openSharePopup(
		shareUrl: string,
		name: string,
		width: number,
		height: number
	): Window | null {
		if (!browser) return null;

		const left = Math.round((window.innerWidth - width) / 2 + window.screenX);
		const top = Math.round((window.innerHeight - height) / 2 + window.screenY);

		const features = [
			`width=${width}`,
			`height=${height}`,
			`left=${left}`,
			`top=${top}`,
			'menubar=no',
			'toolbar=no',
			'location=no',
			'status=no',
			'resizable=yes',
			'scrollbars=yes'
		].join(',');

		return window.open(shareUrl, name, features);
	}

	/**
	 * Handles LinkedIn share via popup window
	 */
	function shareOnLinkedIn() {
		const articleUrl = getArticleUrl();
		const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(articleUrl)}`;

		const popup = openSharePopup(linkedInUrl, 'linkedin-share', 600, 600);

		if (popup) {
			logShare.log('LinkedIn share dialog opened');
		} else {
			logShare.log('LinkedIn popup blocked, falling back to new tab');
			window.open(linkedInUrl, '_blank', 'noopener,noreferrer');
			showToast(t('news.popupBlocked'));
		}
	}

	/**
	 * Instagram: on mobile, copies the link and opens the system share sheet with the
	 * story card, so the user picks Instagram › Story and adds the link sticker.
	 * On a computer it only copies the link.
	 */
	async function shareOnInstagram() {
		if (!isMobileDevice()) {
			const articleUrl = campaignUrl(getArticleUrl(), 'instagram');
			logShare.log('Instagram share on desktop: copying link only');
			const copied = await copyToClipboard(articleUrl);
			showToast(copied ? t('news.instagramDesktop') : t('news.copyFailed'));
			return;
		}

		const articleUrl = campaignUrl(getArticleUrl(), 'instagram-story');

		// Start the copy inside the click, before the share sheet takes focus
		const copying = copyToClipboard(articleUrl);

		try {
			if (storyFile) {
				await navigator.share({ files: [storyFile] });
				logShare.log('Story card shared via Web Share API');
			} else if (navigator.share) {
				await navigator.share({ title, text: t('news.shareText'), url: articleUrl });
				logShare.log('Story card unavailable, shared the link via Web Share API');
			} else {
				logShare.log('Web Share API not available, link copied only');
			}
		} catch (err: unknown) {
			if (err instanceof Error && err.name === 'AbortError') {
				logShare.log('User cancelled share dialog');
				return;
			}
			logShare.log('Web Share failed, link copied only:', err);
		}

		const copied = await copying;
		if (!copied) {
			showToast(t('news.copyFailed'));
		} else {
			showToast(storyFile ? t('news.instagramStoryLinkCopied') : t('news.linkCopied'));
		}
	}
</script>

<div class="flex items-center gap-4 flex-wrap">
	<span class="text-slate-400 font-mono text-sm">{t('news.share')}:</span>
	<button
		onclick={shareOnLinkedIn}
		class="btn-social-linkedin inline-flex items-center gap-2 px-4 py-2 font-mono text-sm"
		aria-label={t('news.shareOnLinkedIn')}
	>
		<span class="pixel-icon pixel-icon-linkedin" aria-hidden="true"></span>
		LinkedIn
	</button>
	<button
		onclick={shareOnInstagram}
		class="btn-social-instagram inline-flex items-center gap-2 px-4 py-2 font-mono text-sm"
		aria-label={t('news.shareOnInstagram')}
	>
		<span class="pixel-icon pixel-icon-instagram" aria-hidden="true"></span>
		Instagram
	</button>
</div>

<!-- Toast Notification -->
{#if toastVisible}
	<div class="toast-container" role="alert" aria-live="polite">
		<div class="toast">
			{toastMessage}
		</div>
	</div>
{/if}
