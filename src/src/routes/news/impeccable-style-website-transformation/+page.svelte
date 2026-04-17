<script lang="ts">
	import { t, tObj } from '$lib/i18n';
	import Seo from '$lib/components/Seo.svelte';
	import { browser } from '$app/environment';
	import { logShare } from '$lib/utils/logger';

	// Toast state for clipboard fallback messages
	let toastMessage = $state('');
	let toastVisible = $state(false);
	let toastTimeout: ReturnType<typeof setTimeout> | null = null;

	// Share configuration
	const shareText = 'Read this article:';
	const pageUrl = 'https://webdeploy.it/news/impeccable-style-website-transformation';
	const pageTitle = 'How Impeccable.style Transformed Our Website';

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
		if (!browser) return pageUrl;

		const canonicalLink = document.querySelector('link[rel="canonical"]');
		if (canonicalLink) {
			const href = canonicalLink.getAttribute('href');
			if (href) return href;
		}
		return window.location.href;
	}

	/**
	 * Gets the article title from document or h1
	 */
	function getArticleTitle(): string {
		if (!browser) return pageTitle;

		const h1 = document.querySelector('h1');
		if (h1 && h1.textContent) {
			return h1.textContent.trim();
		}
		return document.title || pageTitle;
	}

	/**
	 * Opens a centered popup window for sharing
	 */
	function openSharePopup(url: string, name: string, width: number, height: number): Window | null {
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

		return window.open(url, name, features);
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
	 * Handles Instagram share with Web Share API and clipboard fallback
	 */
	async function shareOnInstagram() {
		const articleUrl = getArticleUrl();
		const articleTitle = getArticleTitle();

		if (browser && navigator.share) {
			try {
				await navigator.share({
					title: articleTitle,
					text: shareText,
					url: articleUrl
				});
				logShare.log('Web Share API used successfully');
			} catch (err: unknown) {
				if (err instanceof Error && err.name === 'AbortError') {
					logShare.log('User cancelled share dialog');
					return;
				}
				logShare.log('Web Share failed, falling back to clipboard:', err);
				await fallbackToClipboard(articleUrl);
			}
		} else {
			logShare.log('Web Share API not available, using clipboard fallback');
			await fallbackToClipboard(articleUrl);
		}
	}

	/**
	 * Fallback: copies URL to clipboard and shows appropriate toast message
	 */
	async function fallbackToClipboard(url: string) {
		const success = await copyToClipboard(url);

		if (success) {
			showToast(t('news.linkCopied'));
		} else {
			showToast(t('news.copyFailed'));
		}
	}

	// Type for command objects
	interface Command {
		name: string;
		description: string;
		details: string;
	}
</script>

<Seo
	title={t('news.impeccable.title')}
	description={t('news.impeccable.description')}
	image="/news-impeccable.svg"
	type="article"
	publishedTime="2026-01-28"
/>

<div class="py-16 lg:py-24">
	<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
		<!-- Back link -->
		<a
			href="/news"
			class="inline-flex items-center gap-2 text-primary font-mono text-sm mb-8 hover:underline"
		>
			<span class="material-symbols-outlined text-sm">arrow_back</span>
			&lt; {t('news.backToNews')}
		</a>

		<!-- Article Header -->
		<div class="mb-8">
			<div
				class="inline-block bg-secondary text-black px-4 py-2 text-sm font-mono font-bold uppercase mb-4"
			>
				{t('news.impeccable.date')}
			</div>
			<h1 class="text-4xl sm:text-5xl font-display uppercase text-white mb-6">
				{t('news.impeccable.title')}
			</h1>

			<!-- Share Buttons -->
			<div class="flex items-center gap-4 flex-wrap">
				<span class="text-text-muted font-mono text-sm">{t('news.share')}:</span>
				<button
					onclick={shareOnLinkedIn}
					class="btn-social-linkedin inline-flex items-center gap-2 px-4 py-2 font-mono text-sm"
					aria-label={t('news.shareOnLinkedIn')}
				>
					<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
						<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
					</svg>
					LinkedIn
				</button>
				<button
					onclick={shareOnInstagram}
					class="btn-social-instagram inline-flex items-center gap-2 px-4 py-2 font-mono text-sm"
					aria-label={t('news.shareOnInstagram')}
				>
					<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
						<path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"/>
					</svg>
					Instagram
				</button>
			</div>
		</div>

		<!-- Featured Image -->
		<div class="w-full border-4 border-slate-700 mb-8 bg-surface-dark p-4">
			<img
				src="/news-impeccable.svg"
				alt={t('news.impeccable.title')}
				width="600"
				height="400"
				loading="lazy"
				decoding="async"
				class="w-full"
			/>
		</div>

		<!-- Article Content -->
		<article class="prose prose-invert max-w-none">
			<div class="card-retro bg-surface-dark p-8">
				<p class="text-slate-400 leading-relaxed text-lg mb-6">
					{t('news.impeccable.description')}
				</p>

				<p class="text-slate-400 leading-relaxed mb-8">
					{t('news.impeccable.intro')}
				</p>

				<!-- What is Impeccable -->
				<h2 class="text-xl font-display uppercase text-primary mb-4">
					{t('news.impeccable.whatIsImpeccable')}
				</h2>
				<p class="text-slate-400 leading-relaxed mb-8">
					{t('news.impeccable.whatIsImpeccableDescription')}
				</p>

				<!-- Commands Used -->
				<h2 class="text-xl font-display uppercase text-secondary mb-4">
					{t('news.impeccable.commandsUsed')}
				</h2>
				<div class="space-y-6 mb-8">
					{#each tObj<Command[]>('news.impeccable.commands') || [] as command}
						<div class="border-l-2 border-primary/30 pl-6">
							<h3 class="text-lg font-mono text-primary mb-1">{command.name}</h3>
							<p class="text-secondary text-sm font-mono mb-2">{command.description}</p>
							<p class="text-slate-400 leading-relaxed">{command.details}</p>
						</div>
					{/each}
				</div>

				<!-- Results -->
				<h2 class="text-xl font-display uppercase text-primary mb-4">
					{t('news.impeccable.results')}
				</h2>
				<p class="text-slate-400 leading-relaxed mb-4">
					{t('news.impeccable.resultsIntro')}
				</p>
				<ul class="space-y-2 text-slate-400 mb-8">
					{#each tObj<string[]>('news.impeccable.resultsList') || [] as result}
						<li class="flex items-start gap-2">
							<span class="text-primary">✓</span>
							{result}
						</li>
					{/each}
				</ul>

				<!-- Philosophy -->
				<h2 class="text-xl font-display uppercase text-secondary mb-4">
					{t('news.impeccable.philosophy')}
				</h2>
				<p class="text-slate-400 leading-relaxed mb-8">
					{t('news.impeccable.philosophyDescription')}
				</p>

				<!-- Call to Action -->
				<h2 class="text-xl font-display uppercase text-primary mb-4">
					{t('news.impeccable.callToAction')}
				</h2>
				<p class="text-slate-400 leading-relaxed mb-6">
					{t('news.impeccable.callToActionDescription')}
				</p>

				<!-- External Link -->
				<div class="border-t border-slate-700 pt-6 mt-6">
					<div class="flex flex-col sm:flex-row items-center justify-center gap-4">
						<span class="text-text-muted font-mono text-sm">{t('news.impeccable.learnMore')}:</span>
						<a
							href="https://impeccable.style"
							target="_blank"
							rel="noopener noreferrer"
							class="btn-retro-primary inline-flex items-center gap-2 text-lg font-bold py-3 px-8 uppercase tracking-widest"
						>
							{t('news.impeccable.visitImpeccable')}
							<span class="text-sm" aria-hidden="true">↗</span>
							<span class="sr-only">(opens in new tab)</span>
						</a>
					</div>
				</div>
			</div>
		</article>

		<!-- CTA -->
		<div class="mt-12 text-center">
			<a
				href="/contacts"
				class="btn-retro-secondary inline-block text-lg font-bold py-3 px-8 uppercase tracking-widest"
			>
				{t('news.contactUs')}
			</a>
		</div>
	</div>
</div>

<!-- Toast Notification -->
{#if toastVisible}
	<div
		class="toast-container"
		role="alert"
		aria-live="polite"
	>
		<div class="toast">
			{toastMessage}
		</div>
	</div>
{/if}
