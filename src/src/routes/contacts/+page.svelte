<script lang="ts">
	import { t } from '$lib/i18n';
	import LeafletMap from '$lib/components/LeafletMap.svelte';
	import Seo from '$lib/components/Seo.svelte';
</script>

<Seo
	title={t('contacts.title')}
	description={t('contacts.business.description')}
/>

<div class="py-16 lg:py-24">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<!-- Page Title -->
		<div class="text-center mb-16">
			<h1 class="text-5xl sm:text-6xl font-display uppercase text-white mb-4">
				<span class="text-primary">&gt;</span>
				{t('contacts.title')}
			</h1>
		</div>

		<div class="grid lg:grid-cols-2 gap-12 mb-16">
			<!-- Business Inquiries -->
			<div class="card-retro bg-surface-dark p-8">
				<h2 class="text-2xl font-display uppercase text-primary mb-6 flex items-center gap-2">
					<span aria-hidden="true">💼</span>
					{t('contacts.business.title')}
				</h2>

				<div class="space-y-4 mb-8">
					<p class="text-slate-400 flex items-start gap-3">
						<span class="text-primary font-bold">{t('common.email')}:</span>
						<a href="mailto:info@webdeploy.it" class="text-primary hover:underline"
							>info@webdeploy.it</a
						>
					</p>
					<p class="text-slate-400 flex items-start gap-3">
						<span class="text-primary font-bold">{t('contacts.business.location')}:</span>
						<span>Via Puccini 15, Parma (PR), 43123, Italy</span>
					</p>
					<p class="text-slate-400 flex items-start gap-3">
						<span class="text-primary font-bold">{t('common.phone')}:</span>
						<a href="tel:+393398183373" class="text-primary hover:underline">+39 339 8183373</a>
					</p>
				</div>

				<p class="text-slate-400 leading-relaxed border-l-2 border-primary/30 pl-4">
					{t('contacts.business.description')}
				</p>
			</div>

			<!-- Careers -->
			<div class="card-retro bg-surface-dark p-8">
				<h2 class="text-2xl font-display uppercase text-secondary mb-6 flex items-center gap-2">
					<span aria-hidden="true">🚀</span>
					{t('contacts.careers.title')}
				</h2>

				<p class="text-slate-400 mb-6 leading-relaxed">{t('contacts.careers.description')}</p>

				<p class="text-slate-400 flex items-start gap-3 mb-8">
					<span class="text-secondary font-bold">{t('common.email')}:</span>
					<a href="mailto:careers@webdeploy.it" class="text-secondary hover:underline"
						>careers@webdeploy.it</a
					>
				</p>

				<p class="text-slate-500 italic text-sm border-l-2 border-secondary/30 pl-4">
					{t('contacts.careers.perks')}
				</p>
			</div>
		</div>

		<!-- Map Section -->
		<div class="card-retro overflow-hidden">
			<LeafletMap />
		</div>
	</div>
</div>
