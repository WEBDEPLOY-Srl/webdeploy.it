<script lang="ts">
	import { onMount } from 'svelte';
	import { t } from '#lib/i18n/index.ts';
	import { trackNewsletterLead } from '#lib/utils/metaPixel.ts';
	import { logAnalytics } from '#lib/utils/logger.ts';

	const LISTS = {
		news: '300c28fe-d91b-4965-b247-da6e6dafdb7a',
		marketing: '71ca6320-90f7-4cd5-9e52-cb53ba5b84ba'
	} as const;
	const ACTION = 'https://newsletter.webdeploy.it/subscription/form';
	const CHALLENGE = 'https://newsletter.webdeploy.it/api/public/captcha/altcha';

	interface VerificationResult {
		payload?: string;
		verified?: boolean;
	}
	interface AltchaWidget extends HTMLElement {
		verify: () => Promise<VerificationResult | null>;
		getState: () => string;
		reset: () => void;
	}

	let form: HTMLFormElement;
	let newsBox: HTMLInputElement;
	let marketingBox: HTMLInputElement;
	let widget: AltchaWidget;
	let ready = $state(false);
	let submitAttempted = $state(false);
	let noListError = $state(true);
	let setupError = $state(false);
	let verificationError = $state(false);
	let submitting = $state(false);

	onMount(() => {
		updateListValidity();
		let cancelled = false;
		const onPageShow = (event: PageTransitionEvent) => {
			if (!event.persisted) return;
			submitting = false;
			verificationError = false;
			submitAttempted = false;
			newsBox.checked = false;
			marketingBox.checked = false;
			widget.reset();
			updateListValidity();
		};
		window.addEventListener('pageshow', onPageShow);

		void Promise.all([
			import('altcha/external'),
			import('altcha/altcha.css'),
			import('altcha/workers/sha?worker')
		])
			.then(async ([, , workerModule]) => {
				await customElements.whenDefined('altcha-widget');
				const altcha = (
					globalThis as typeof globalThis & {
						$altcha?: { algorithms: { set: (name: string, factory: () => Worker) => void } };
					}
				).$altcha;
				if (!altcha) throw new Error('ALTCHA algorithm registry did not initialize');
				altcha.algorithms.set('SHA-256', () => new workerModule.default());
				if (!cancelled) ready = true;
			})
			.catch(() => {
				if (!cancelled) setupError = true;
			});

		return () => {
			cancelled = true;
			window.removeEventListener('pageshow', onPageShow);
		};
	});

	function updateListValidity() {
		noListError = !newsBox?.checked && !marketingBox?.checked;
		newsBox?.setCustomValidity(noListError ? t('newsletter.requiredError') : '');
	}

	function revealListError() {
		submitAttempted = true;
		updateListValidity();
	}

	async function submit(event: SubmitEvent) {
		event.preventDefault();
		updateListValidity();
		if (!form.reportValidity() || submitting) return;
		submitting = true;
		verificationError = false;

		try {
			const result = await widget.verify();
			if (!result?.payload || widget.getState() !== 'verified') {
				throw new Error('ALTCHA verification failed');
			}

			(window._paq = window._paq || []).push([
				'trackEvent',
				'Newsletter',
				'newsletter_submit_initiated'
			]);
			logAnalytics.log('Newsletter submission initiated');
			trackNewsletterLead();

			// Give Matomo and the consented pixel a short chance to send before navigation.
			await new Promise((resolve) => window.setTimeout(resolve, 180));
			HTMLFormElement.prototype.submit.call(form);
		} catch {
			submitting = false;
			verificationError = true;
		}
	}
</script>

<form
	bind:this={form}
	action={ACTION}
	method="post"
	accept-charset="UTF-8"
	autocomplete="off"
	class="newsletter-form"
	onsubmit={submit}
>
	<fieldset aria-describedby="newsletter-list-error" class="newsletter-lists">
		<legend>{t('newsletter.whatTitle')}</legend>
		<label class="newsletter-choice">
			<input
				bind:this={newsBox}
				type="checkbox"
				name="l"
				value={LISTS.news}
				autocomplete="off"
				onchange={updateListValidity}
				oninvalid={revealListError}
			/>
			<span><strong>{t('newsletter.generalLabel')}.</strong> {t('newsletter.generalText')}</span>
		</label>
		<label class="newsletter-choice">
			<input
				bind:this={marketingBox}
				type="checkbox"
				name="l"
				value={LISTS.marketing}
				autocomplete="off"
				onchange={updateListValidity}
			/>
			<span>
				<strong>{t('newsletter.marketingLabel')}.</strong>
				{t('newsletter.marketingText')}
			</span>
		</label>
		<p id="newsletter-list-error" class="form-error" role="alert">
			{submitAttempted && noListError ? t('newsletter.requiredError') : ''}
		</p>
	</fieldset>

	<div class="email-field">
		<label for="newsletter-email">{t('newsletter.emailLabel')}</label>
		<input
			id="newsletter-email"
			type="email"
			name="email"
			autocomplete="email"
			inputmode="email"
			placeholder={t('newsletter.emailPlaceholder')}
			required
		/>
	</div>

	<input type="hidden" name="nonce" value="" />
	<altcha-widget
		bind:this={widget}
		challenge={CHALLENGE}
		auto="off"
		configuration={JSON.stringify({ humanInteractionSignature: false })}
		display="invisible"
		name="altcha"
	></altcha-widget>

	{#if verificationError}
		<p class="form-error" role="alert">{t('newsletter.verificationError')}</p>
	{/if}
	{#if setupError}
		<p class="form-error" role="alert">{t('newsletter.setupError')}</p>
	{/if}
	<button class="newsletter-submit" type="submit" disabled={!ready || submitting}>
		{submitting ? t('newsletter.submitting') : t('newsletter.submit')}
	</button>
	<p class="newsletter-note">
		{t('newsletter.confirmationNote')}
		<a href="/privacy#newsletter">{t('newsletter.privacyLink')}</a>
	</p>
	<noscript><p class="form-error">{t('newsletter.noScript')}</p></noscript>
</form>

<style>
	.newsletter-form {
		display: grid;
		gap: 0.5rem;
	}

	.newsletter-lists {
		min-width: 0;
		margin: 0;
		padding: 0;
		border: 0;
	}

	.newsletter-lists legend {
		margin-bottom: 0.3rem;
		color: white;
		font-family: var(--font-display, system-ui, sans-serif);
		font-size: 1.05rem;
		line-height: 1.2;
	}

	.newsletter-choice {
		display: grid;
		grid-template-columns: 1.25rem minmax(0, 1fr);
		align-items: start;
		gap: 0.65rem;
		margin: 0.2rem 0;
		color: #cbd5e1;
		font-size: 0.8125rem;
		line-height: 1.28;
		cursor: pointer;
	}

	.newsletter-choice input {
		width: 1.25rem;
		height: 1.25rem;
		margin: 0.1rem 0 0;
		accent-color: var(--color-primary, #00f0ff);
	}

	.newsletter-choice input:focus-visible,
	.email-field input:focus-visible,
	.newsletter-submit:focus-visible {
		outline: 3px solid white;
		outline-offset: 3px;
	}

	.form-error {
		min-height: 1.2rem;
		margin: 0.25rem 0 0;
		color: #fca5a5;
		font-size: 0.875rem;
	}

	.email-field {
		display: grid;
		gap: 0.35rem;
	}

	.email-field label {
		color: white;
		font-family: var(--font-mono, monospace);
		font-size: 0.875rem;
	}

	.email-field input {
		width: 100%;
		min-height: 2.75rem;
		padding: 0.65rem 0.75rem;
		border: 1px solid #64748b;
		border-radius: 0;
		color: white;
		background: #101827;
		font: 16px var(--font-reading, system-ui, sans-serif);
	}

	.newsletter-submit {
		min-height: 2.75rem;
		padding: 0.7rem 1rem;
		border: 1px solid var(--color-primary, #00f0ff);
		color: #07111b;
		background: var(--color-primary, #00f0ff);
		font: 700 1rem var(--font-mono, monospace);
		cursor: pointer;
	}

	.newsletter-submit:disabled {
		cursor: wait;
		opacity: 0.75;
	}

	.newsletter-note {
		margin: 0;
		color: #cbd5e1;
		font-size: 0.8rem;
		line-height: 1.5;
	}

	.newsletter-note a {
		color: var(--color-primary, #00f0ff);
		text-decoration: underline;
		text-underline-offset: 2px;
	}

	@media (max-width: 639px) {
		.newsletter-lists legend {
			font-size: 0.9rem;
			line-height: 1.1;
		}

		.newsletter-choice {
			font-size: 0.75rem;
			line-height: 1.15;
		}
	}
</style>
