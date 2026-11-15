<script lang="ts">
	import { onMount } from 'svelte';
	import { tObj } from '$lib/i18n';
	import { logPrivacy } from '$lib/utils/logger';
	import {
		browserOptOutEnvironment,
		createMatomoOptOut,
		type MatomoOptOut,
		type OptOutProblem
	} from '$lib/utils/matomoOptOut';

	type OptOutStrings = {
		OptOutComplete: string;
		OptOutCompleteBis: string;
		YouMayOptOut2: string;
		YouMayOptOut3: string;
		OptOutErrorNoCookies: string;
		OptOutErrorNotHttps: string;
		YouAreNotOptedOut: string;
		UncheckToOptOut: string;
		YouAreOptedOut: string;
		CheckToOptIn: string;
	};

	// Everything depends on the browser's cookies and protocol, so nothing renders
	// until the component is mounted; the prerendered page has an empty container.
	let optOut = $state<MatomoOptOut | null>(null);
	let problem = $state<OptOutProblem | null>(null);
	let tracked = $state(true);

	// Read per render so the text follows the locale.
	const strings = $derived(tObj<OptOutStrings>('privacy.optOut'));

	onMount(() => {
		const instance = createMatomoOptOut(browserOptOutEnvironment());
		problem = instance.problem();
		tracked = instance.hasConsent();
		optOut = instance;
		logPrivacy.log('Matomo opt-out initialized');
	});

	function toggle() {
		if (!optOut) return;
		const ok = tracked ? optOut.revokeConsent() : optOut.giveConsent();
		if (!ok) logPrivacy.log('Error setting opt-out cookie');
		tracked = optOut.hasConsent();
	}
</script>

<div id="matomo-opt-out">
	{#if optOut && strings}
		{#if problem === 'noCookies'}
			<p class="text-red-500 font-bold">{strings.OptOutErrorNoCookies}</p>
		{:else if problem === 'notHttps'}
			<p class="text-red-500 font-bold">{strings.OptOutErrorNotHttps}</p>
		{:else}
			<p>
				{#if tracked}
					{strings.YouMayOptOut2} {strings.YouMayOptOut3}
				{:else}
					{strings.OptOutComplete} {strings.OptOutCompleteBis}
				{/if}
			</p>
			<input id="trackVisits" type="checkbox" checked={tracked} onchange={toggle} />
			<label for="trackVisits">
				<strong>
					<span>
						{#if tracked}
							{strings.YouAreNotOptedOut} {strings.UncheckToOptOut}
						{:else}
							{strings.YouAreOptedOut} {strings.CheckToOptIn}
						{/if}
					</span>
				</strong>
			</label>
		{/if}
	{/if}
</div>
