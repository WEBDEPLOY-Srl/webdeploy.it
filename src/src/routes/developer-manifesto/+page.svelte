<script lang="ts">
	import { t, tObj } from '$lib/i18n';
	import Seo from '$lib/components/Seo.svelte';
</script>

<Seo
	title={t('manifesto.title')}
	description={t('manifesto.devExp.description')}
/>

<div class="py-16 lg:py-24">
	<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
		<!-- Page Title -->
		<div class="text-center mb-16">
			<h1 class="text-5xl sm:text-6xl font-display uppercase text-white mb-4">
				<span class="text-primary">&gt;</span>
				{t('manifesto.title')}
			</h1>
		</div>

		<!-- Core Beliefs Section -->
		<section class="mb-16">
			<h2 class="text-3xl font-display uppercase text-secondary mb-8 border-b-2 border-secondary pb-4">
				{t('manifesto.coreBeliefs')}
			</h2>

			<div class="space-y-12">
				<!-- Developer Experience First -->
				<div class="card-retro bg-surface-dark p-8">
					<h3 class="text-xl font-display uppercase text-primary mb-4 flex items-center gap-2">
						<span>🚀</span>
						{t('manifesto.devExp.title')}
					</h3>
					<p class="text-slate-400 leading-relaxed">{t('manifesto.devExp.description')}</p>
				</div>

				<!-- Open Source Foundation -->
				<div class="card-retro bg-surface-dark p-8">
					<h3 class="text-xl font-display uppercase text-primary mb-4 flex items-center gap-2">
						<span>🌐</span>
						{t('manifesto.openSource.title')}
					</h3>
					<p class="text-slate-400 leading-relaxed">{t('manifesto.openSource.description')}</p>
				</div>

				<!-- Work-Life Balance -->
				<div class="card-retro bg-surface-dark p-8">
					<h3 class="text-xl font-display uppercase text-primary mb-4 flex items-center gap-2">
						<span>⚖️</span>
						{t('manifesto.workLife.title')}
					</h3>
					<p class="text-slate-400 leading-relaxed mb-6">{t('manifesto.workLife.description')}</p>
					<ul class="space-y-3 mb-6">
						{#each tObj<string[]>('manifesto.workLife.items') || [] as item}
							<li class="text-slate-400 flex items-start gap-2">
								<span class="text-secondary">•</span>
								{item}
							</li>
						{/each}
					</ul>
					<p class="text-slate-500 italic text-sm border-l-2 border-primary/30 pl-4">
						{t('manifesto.workLife.note')}
					</p>
				</div>
			</div>
		</section>

		<!-- Technical Philosophy Section -->
		<section class="mb-16">
			<h2 class="text-3xl font-display uppercase text-secondary mb-8 border-b-2 border-secondary pb-4">
				{t('manifesto.techPhilosophy')}
			</h2>

			<div class="grid md:grid-cols-2 gap-8">
				<!-- Quality -->
				<div class="card-retro bg-surface-dark p-6">
					<h3 class="text-lg font-display uppercase text-primary mb-3 flex items-center gap-2">
						<span>🛠️</span>
						{t('manifesto.quality.title')}
					</h3>
					<p class="text-slate-400 text-sm leading-relaxed">{t('manifesto.quality.description')}</p>
				</div>

				<!-- Documentation -->
				<div class="card-retro bg-surface-dark p-6">
					<h3 class="text-lg font-display uppercase text-primary mb-3 flex items-center gap-2">
						<span>📚</span>
						{t('manifesto.docs.title')}
					</h3>
					<p class="text-slate-400 text-sm leading-relaxed">{t('manifesto.docs.description')}</p>
				</div>

				<!-- Tools -->
				<div class="card-retro bg-surface-dark p-6">
					<h3 class="text-lg font-display uppercase text-secondary mb-3 flex items-center gap-2">
						<span>🔧</span>
						{t('manifesto.tools.title')}
					</h3>
					<p class="text-slate-400 text-sm leading-relaxed">{t('manifesto.tools.description')}</p>
				</div>

				<!-- Community -->
				<div class="card-retro bg-surface-dark p-6">
					<h3 class="text-lg font-display uppercase text-secondary mb-3 flex items-center gap-2">
						<span>🤝</span>
						{t('manifesto.community.title')}
					</h3>
					<p class="text-slate-400 text-sm leading-relaxed">{t('manifesto.community.description')}</p>
				</div>
			</div>
		</section>

		<!-- How We Work Section -->
		<section class="mb-16">
			<h2 class="text-3xl font-display uppercase text-secondary mb-8 border-b-2 border-secondary pb-4">
				{t('manifesto.howWeWork')}
			</h2>

			<div class="grid md:grid-cols-2 gap-8">
				<!-- Purpose -->
				<div class="card-retro bg-surface-dark p-6">
					<h3 class="text-lg font-display uppercase text-primary mb-3 flex items-center gap-2">
						<span>🎯</span>
						{t('manifesto.purpose.title')}
					</h3>
					<p class="text-slate-400 text-sm leading-relaxed">{t('manifesto.purpose.description')}</p>
				</div>

				<!-- Iterative -->
				<div class="card-retro bg-surface-dark p-6">
					<h3 class="text-lg font-display uppercase text-primary mb-3 flex items-center gap-2">
						<span>🔄</span>
						{t('manifesto.iterative.title')}
					</h3>
					<p class="text-slate-400 text-sm leading-relaxed">{t('manifesto.iterative.description')}</p>
				</div>

				<!-- Learning -->
				<div class="card-retro bg-surface-dark p-6">
					<h3 class="text-lg font-display uppercase text-secondary mb-3 flex items-center gap-2">
						<span>🧠</span>
						{t('manifesto.learning.title')}
					</h3>
					<p class="text-slate-400 text-sm leading-relaxed">{t('manifesto.learning.description')}</p>
				</div>

				<!-- Growth -->
				<div class="card-retro bg-surface-dark p-6">
					<h3 class="text-lg font-display uppercase text-secondary mb-3 flex items-center gap-2">
						<span>🌱</span>
						{t('manifesto.growth.title')}
					</h3>
					<p class="text-slate-400 text-sm leading-relaxed">{t('manifesto.growth.description')}</p>
				</div>
			</div>
		</section>

		<!-- CTA -->
		<section class="text-center bg-surface-dark border-2 border-primary p-8">
			<p class="text-xl text-white font-mono mb-6">{t('manifesto.cta')}</p>
			<a
				href="/contacts"
				class="btn-retro-primary inline-block text-lg font-bold py-3 px-8 uppercase tracking-widest"
			>
				{t('manifesto.getInTouch')} →
			</a>
		</section>
	</div>
</div>
