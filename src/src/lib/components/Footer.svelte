<script lang="ts">
	import { t } from '$lib/i18n';
</script>

<footer class="bg-surface-dark border-t-2 border-primary/20 pt-12 sm:pt-16 pb-8">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 sm:gap-12 mb-12">
			<!-- Brand -->
			<div class="col-span-1 sm:col-span-2 lg:col-span-2">
				<div class="flex items-center gap-2 mb-6 group">
					<span
						class="material-symbols-outlined text-primary text-3xl group-hover:rotate-12 transition-transform"
						aria-hidden="true"
						>rocket_launch</span
					>
					<span class="text-2xl font-display font-bold text-white uppercase tracking-widest"
						>WebDeploy</span
					>
				</div>
				<p class="text-slate-500 text-sm font-mono mb-6 max-w-xs">
					<span aria-hidden="true">//</span> {t('footer.tagline')}<br />
					<span aria-hidden="true">&gt;</span> {t('footer.description')}
				</p>
				<div class="flex gap-4">
					<a
						href="mailto:info@webdeploy.it"
						class="text-slate-500 hover:text-primary transition-colors border border-slate-700 p-3 hover:border-primary min-w-[44px] min-h-[44px] flex items-center justify-center"
						aria-label="Email us at info@webdeploy.it"
					>
						<span class="material-symbols-outlined" aria-hidden="true">alternate_email</span>
					</a>
				</div>
			</div>

			<!-- Product -->
			<div>
				<h4
					class="font-display font-bold text-white uppercase tracking-wider mb-4 sm:mb-6 border-b border-slate-700 pb-2 w-fit"
				>
					{t('footer.product')}
				</h4>
				<ul class="space-y-1 text-sm font-mono text-slate-500">
					<li>
						<a
							href="/totem"
							class="block py-2 hover:text-primary hover:underline decoration-dashed underline-offset-4 min-h-[44px] flex items-center"
							>{t('nav.kiosk')}</a
						>
					</li>
					<li>
						<a
							href="/services"
							class="block py-2 hover:text-primary hover:underline decoration-dashed underline-offset-4 min-h-[44px] flex items-center"
							>{t('nav.services')}</a
						>
					</li>
					<li>
						<a
							href="/news"
							class="block py-2 hover:text-primary hover:underline decoration-dashed underline-offset-4 min-h-[44px] flex items-center"
							>{t('nav.news')}</a
						>
					</li>
				</ul>
			</div>

			<!-- Resources -->
			<div>
				<h4
					class="font-display font-bold text-white uppercase tracking-wider mb-4 sm:mb-6 border-b border-slate-700 pb-2 w-fit"
				>
					{t('footer.resources')}
				</h4>
				<ul class="space-y-1 text-sm font-mono text-slate-500">
					<li>
						<a
							href="/developer-manifesto"
							class="block py-2 hover:text-primary hover:underline decoration-dashed underline-offset-4 min-h-[44px] flex items-center"
							>{t('nav.manifesto')}</a
						>
					</li>
				</ul>
			</div>

			<!-- Company -->
			<div>
				<h4
					class="font-display font-bold text-white uppercase tracking-wider mb-4 sm:mb-6 border-b border-slate-700 pb-2 w-fit"
				>
					{t('footer.company')}
				</h4>
				<ul class="space-y-1 text-sm font-mono text-slate-500">
					<li>
						<a
							href="/contacts"
							class="block py-2 hover:text-primary hover:underline decoration-dashed underline-offset-4 min-h-[44px] flex items-center"
							>{t('nav.contacts')}</a
						>
					</li>
					<li>
						<a
							href="mailto:careers@webdeploy.it"
							class="block py-2 hover:text-primary hover:underline decoration-dashed underline-offset-4 min-h-[44px] flex items-center"
							>{t('footer.careers')}</a
						>
					</li>
					<li>
						<a
							href="/privacy"
							class="block py-2 hover:text-primary hover:underline decoration-dashed underline-offset-4 min-h-[44px] flex items-center"
							>{t('footer.privacy')}</a
						>
					</li>
				</ul>
			</div>
		</div>

		<!-- Legal Info -->
		<div
			class="border-t border-slate-800 pt-8 text-center text-xs font-mono text-slate-600 space-y-2"
		>
			<p>{t('footer.registeredOffice')}: Parma, Via Puccini 15, 43123</p>
			<p>PEC: legal@pec.webdeploy.it | P.IVA: IT02993340344 | SDI: KRRH6B9</p>
			<p>{t('footer.copyright')}</p>
		</div>
	</div>
</footer>
