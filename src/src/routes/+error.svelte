<script lang="ts">
	import { page } from '$app/stores';
	import { t } from '$lib/i18n';
</script>

<svelte:head>
	<title>Error {$page.status} - WebDeploy</title>
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
					<span aria-hidden="true">&gt;</span> ERROR_CODE: {$page.status}
				</p>
				<p class="text-slate-400 mb-4">
					<span aria-hidden="true">&gt;</span> {$page.error?.message || 'Page not found'}
				</p>
				<p class="text-secondary">
					<span aria-hidden="true">&gt;</span> STATUS: SYSTEM_RECOVERY_AVAILABLE
				</p>
			</div>
		</div>

		<!-- Error Message -->
		<h1 class="text-3xl sm:text-4xl font-display uppercase text-white mb-4">
			{#if $page.status === 404}
				Page Not Found
			{:else if $page.status === 500}
				Internal Server Error
			{:else if $page.status === 403}
				Access Forbidden
			{:else}
				Something Went Wrong
			{/if}
		</h1>

		<p class="text-slate-400 mb-8 font-mono max-w-md mx-auto">
			{#if $page.status === 404}
				The page you're looking for doesn't exist or has been moved.
			{:else if $page.status === 500}
				Our servers encountered an unexpected error. Please try again later.
			{:else if $page.status === 403}
				You don't have permission to access this resource.
			{:else}
				An unexpected error occurred. Please try again.
			{/if}
		</p>

		<!-- Action Buttons -->
		<div class="flex flex-col sm:flex-row gap-4 justify-center">
			<a
				href="/"
				class="btn-retro-primary py-3 px-8 font-bold uppercase tracking-widest"
			>
				<span aria-hidden="true">&gt;</span> Return Home
			</a>
			<button
				onclick={() => history.back()}
				class="btn-retro-secondary py-3 px-8 font-bold uppercase tracking-widest"
			>
				<span aria-hidden="true">&lt;</span> Go Back
			</button>
		</div>

		<!-- Additional Help -->
		<p class="mt-12 text-slate-500 text-sm font-mono">
			Need help? Contact us at
			<a href="mailto:info@webdeploy.it" class="text-primary hover:underline">
				info@webdeploy.it
			</a>
		</p>
	</div>
</div>
