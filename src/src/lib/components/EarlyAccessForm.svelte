<script lang="ts">
	import { t } from '$lib/i18n';
	import { locale } from '$lib/stores/locale.svelte';
	import { browser } from '$app/environment';
	import { logEarlyAccess } from '$lib/utils/logger';
	import { fireGoogleAdsConversion } from '$lib/utils/googleAds';
	import { trackMetaEvent } from '$lib/utils/metaPixel';

	// Lead-capture webhook: a single submit kicks off email double opt-in and
	// records the signup goal server-side.
	const ENDPOINT = 'https://n8n.webdeploy.it/webhook/early-access';

	let email = $state('');
	let name = $state('');
	let company = $state('');
	let role = $state(''); // '' | 'A' | 'B' | 'C'
	let consent = $state(false);
	let website = $state(''); // honeypot: real users leave this empty
	let status = $state<'idle' | 'sending' | 'ok' | 'error'>('idle');
	let errorKind = $state<'validation' | 'submit'>('validation');

	// Element refs for focus management (WCAG 2.1 AA: status messages + focus order).
	let emailEl = $state<HTMLInputElement | null>(null);
	let consentEl = $state<HTMLInputElement | null>(null);
	let successEl = $state<HTMLElement | null>(null);

	// Move focus to the confirmation once it renders: the form that held focus is
	// unmounted on success, so without this a keyboard/screen-reader user gets no
	// signal that the signup — the primary conversion — succeeded.
	$effect(() => {
		if (status === 'ok') successEl?.focus();
	});

	function utm(): Record<string, string> {
		if (!browser) return {};
		const p = new URLSearchParams(location.search);
		return {
			utm_source: p.get('utm_source') ?? '',
			utm_medium: p.get('utm_medium') ?? '',
			utm_campaign: p.get('utm_campaign') ?? '',
			utm_content: p.get('utm_content') ?? ''
		};
	}

	async function submit(e: SubmitEvent) {
		e.preventDefault();
		// Honeypot tripped: drop silently, never reveal the trap to bots.
		if (website) {
			logEarlyAccess.warn('Honeypot tripped, submission dropped');
			return;
		}
		if (!email || !consent) {
			status = 'error';
			errorKind = 'validation';
			logEarlyAccess.warn('Client validation failed', { hasEmail: !!email, consent });
			(!email ? emailEl : consentEl)?.focus();
			return;
		}

		status = 'sending';
		const utmData = utm();
		const payload = {
			email,
			name,
			company,
			role,
			consent,
			locale: locale.current,
			...utmData,
			page: browser ? location.pathname : '/early-access'
		};
		logEarlyAccess.log('Submitting early-access signup', {
			role: role || 'unset',
			locale: locale.current,
			utm_source: utmData.utm_source || 'none'
		});

		const started = browser ? performance.now() : 0;
		try {
			const res = await fetch(ENDPOINT, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload)
			});
			const ms = browser ? Math.round(performance.now() - started) : 0;
			logEarlyAccess.log(`Webhook responded ${res.status} in ${ms}ms`);
			if (!res.ok) throw new Error(`webhook ${res.status}`);
			status = 'ok';
			if (browser) {
				// Best-effort client-side submit goal; the authoritative goal is recorded
				// server-side (this survives ad-blockers that drop the client tag).
				window._paq?.push(['trackGoal', 1]);
				// Fire the ads conversion on submit, not on the confirmation page: the
				// confirmation redirect isn't controllable and the click id is freshest
				// on this landing page. Gated/no-op until GOOGLE_ADS is set.
				fireGoogleAdsConversion();
				// Meta pixel Lead (no-op unless marketing consent granted + pixel loaded).
				trackMetaEvent('Lead', { content_name: 'early-access' });
			}
		} catch (err) {
			status = 'error';
			errorKind = 'submit';
			logEarlyAccess.error('Early-access submit failed', err);
		}
	}
</script>

{#if status === 'ok'}
	<div
		bind:this={successEl}
		role="status"
		tabindex="-1"
		class="card-retro bg-surface-dark p-8 text-center focus:outline-none"
	>
		<p class="text-primary font-display uppercase text-2xl mb-2">
			<span aria-hidden="true">✓</span>
			{t('earlyAccess.form.successTitle')}
		</p>
		<p class="text-slate-400 leading-relaxed">{t('earlyAccess.form.success')}</p>
	</div>
{:else}
	<form onsubmit={submit} class="space-y-6" novalidate aria-busy={status === 'sending'}>
		<div class="grid sm:grid-cols-2 gap-6">
			<label class="flex flex-col gap-2 sm:col-span-2">
				<span class="text-xs font-mono uppercase text-slate-400">
					{t('earlyAccess.form.email')} <span class="text-secondary">*</span>
				</span>
				<input
					type="email"
					bind:this={emailEl}
					bind:value={email}
					required
					autocomplete="email"
					placeholder="nome@azienda.it"
					aria-invalid={status === 'error' && errorKind === 'validation' && !email}
					aria-describedby={status === 'error' ? 'ea-form-error' : undefined}
					class="w-full bg-background-dark border-2 border-border-default text-white px-4 py-3 font-mono placeholder:text-slate-600 focus:border-primary focus:outline-none transition-colors"
				/>
			</label>

			<label class="flex flex-col gap-2">
				<span class="text-xs font-mono uppercase text-slate-400">{t('earlyAccess.form.name')}</span>
				<input
					type="text"
					bind:value={name}
					autocomplete="name"
					class="w-full bg-background-dark border-2 border-border-default text-white px-4 py-3 font-mono placeholder:text-slate-600 focus:border-primary focus:outline-none transition-colors"
				/>
			</label>

			<label class="flex flex-col gap-2">
				<span class="text-xs font-mono uppercase text-slate-400">{t('earlyAccess.form.company')}</span>
				<input
					type="text"
					bind:value={company}
					autocomplete="organization"
					class="w-full bg-background-dark border-2 border-border-default text-white px-4 py-3 font-mono placeholder:text-slate-600 focus:border-primary focus:outline-none transition-colors"
				/>
			</label>

			<label class="flex flex-col gap-2 sm:col-span-2">
				<span class="text-xs font-mono uppercase text-slate-400">{t('earlyAccess.form.rolePlaceholder')}</span>
				<select
					bind:value={role}
					class="w-full bg-background-dark border-2 border-border-default text-white px-4 py-3 font-mono focus:border-primary focus:outline-none transition-colors"
				>
					<option value="">{t('earlyAccess.form.rolePlaceholder')}</option>
					<option value="A">{t('earlyAccess.form.roleA')}</option>
					<option value="B">{t('earlyAccess.form.roleB')}</option>
					<option value="C">{t('earlyAccess.form.roleC')}</option>
				</select>
			</label>
		</div>

		<!-- Honeypot: visually hidden, off keyboard/AT flow. Bots fill it; humans don't. -->
		<div class="hidden" aria-hidden="true">
			<label>
				Website
				<input type="text" bind:value={website} tabindex="-1" autocomplete="off" />
			</label>
		</div>

		<label class="flex gap-3 items-start text-sm text-slate-400">
			<input
				type="checkbox"
				bind:this={consentEl}
				bind:checked={consent}
				required
				aria-invalid={status === 'error' && errorKind === 'validation' && !consent}
				aria-describedby={status === 'error' ? 'ea-form-error' : undefined}
				class="mt-1 accent-primary shrink-0"
			/>
			<span>{@html t('earlyAccess.form.consent')}</span>
		</label>

		{#if status === 'error'}
			<p id="ea-form-error" class="text-secondary font-mono text-sm" role="alert">
				{errorKind === 'submit'
					? t('earlyAccess.form.errorSubmit')
					: t('earlyAccess.form.error')}
			</p>
		{/if}

		<button
			type="submit"
			disabled={status === 'sending'}
			class="btn-retro-primary px-8 py-3 font-display uppercase text-lg disabled:opacity-50 disabled:cursor-not-allowed"
		>
			{status === 'sending' ? t('earlyAccess.form.sending') : t('earlyAccess.form.submit')}
		</button>

		<p class="text-xs text-slate-500 leading-relaxed">{@html t('earlyAccess.form.gdprNote')}</p>
	</form>
{/if}
