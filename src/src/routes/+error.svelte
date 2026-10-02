<script lang="ts">
	import { page } from '$app/stores';
	import { t } from '$lib/i18n';

	// Raw error messages are not localized, so show the translated status copy instead.
	const statusKey = $derived(
		$page.status === 404
			? 'notFound'
			: $page.status === 500
				? 'serverError'
				: $page.status === 403
					? 'forbidden'
					: 'generic'
	);
	const statusTitle = $derived(t(`error.${statusKey}Title`));
	const statusText = $derived(t(`error.${statusKey}Text`));
</script>

<svelte:head>
	<title>{t('error.pageTitle')} {$page.status} - WebDeploy</title>
</svelte:head>

<div class="min-h-[70vh] flex items-center justify-center py-16 px-4">
	<div class="max-w-2xl mx-auto text-center">
		<!-- Error Code Display -->
		<div class="mb-8">
			<span class="text-8xl sm:text-9xl font-display text-primary title-glow">
				{$page.status}
			</span>
		</div>

		<!-- Error Terminal Box -->
		<div class="card-retro bg-surface-dark p-8 mb-8">
			<div class="font-mono text-left">
				<p class="text-primary mb-2">
					<span aria-hidden="true">&gt;</span> {t('error.codeLabel')}: {$page.status}
				</p>
				<p class="text-slate-400 mb-4">
					<span aria-hidden="true">&gt;</span> {statusTitle}
				</p>
				<p class="text-secondary">
					<span aria-hidden="true">&gt;</span> {t('error.statusLine')}
				</p>
			</div>
		</div>

		<!-- Error Message -->
		<h1 class="text-3xl sm:text-4xl font-display uppercase text-white mb-4">
			{statusTitle}
		</h1>

		<p class="text-slate-400 mb-8 font-mono max-w-md mx-auto">
			{statusText}
		</p>

		<!-- Action Buttons -->
		<div class="flex flex-col sm:flex-row gap-4 justify-center">
			<a
				href="/"
				class="btn-retro-primary py-3 px-8 font-bold uppercase tracking-widest"
			>
				<span aria-hidden="true">&gt;</span> {t('error.returnHome')}
			</a>
			<button
				onclick={() => history.back()}
				class="btn-retro-secondary py-3 px-8 font-bold uppercase tracking-widest"
			>
				<span aria-hidden="true">&lt;</span> {t('error.goBack')}
			</button>
		</div>

		<!-- Additional Help -->
		<p class="mt-12 text-slate-500 text-sm font-mono">
			{t('error.needHelp')}
			<a href="mailto:info@webdeploy.it" class="text-primary hover:underline">
				info@webdeploy.it
			</a>
		</p>
	</div>
</div>
