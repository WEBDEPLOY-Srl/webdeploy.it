<script lang="ts">
	import { t } from '$lib/i18n';
	import { consent } from '$lib/stores/consent.svelte';
	import { site } from '$lib/config/site';
	import { footerGroups } from '$lib/config/footer';

	const linkClass =
		'block py-2 hover:text-primary hover:underline decoration-dashed underline-offset-4 min-h-[44px] flex items-center';
</script>

<footer class="site-footer bg-surface-dark border-t-2 border-primary/20 pt-12 sm:pt-16 pb-8">
	<div class="site-footer__container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div
			class="site-footer__content grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 sm:gap-12 mb-12"
		>
			<!-- Brand -->
			<div class="col-span-1 sm:col-span-2 lg:col-span-2">
				<p class="text-2xl font-display font-bold text-white uppercase tracking-widest mb-6">
					WEBDEPLOY™
				</p>
				<p class="site-footer__description text-slate-400 text-sm font-mono mb-6 max-w-xs">
					<span aria-hidden="true">//</span>
					{t('footer.tagline')}<br />
					<span aria-hidden="true">&gt;</span>
					{t('footer.description')}
				</p>
				<a
					href="mailto:{site.contact.email}"
					class="inline-flex items-center min-h-[44px] px-3 text-sm font-mono text-slate-400 hover:text-primary transition-colors border border-slate-700 hover:border-primary"
				>
					{site.contact.email}
				</a>
			</div>

			{#each footerGroups as group (group.titleKey)}
				<div>
					<h2
						class="font-display font-bold text-white uppercase tracking-wider mb-4 sm:mb-6 border-b border-slate-700 pb-2 w-fit"
					>
						{t(group.titleKey)}
					</h2>
					<ul class="site-footer__links space-y-1 text-sm font-mono text-slate-400">
						{#each group.links as link (link.labelKey)}
							<li>
								{#if 'action' in link}
									<button
										type="button"
										onclick={() => consent.reopen()}
										class="{linkClass} text-left"
									>
										{t(link.labelKey)}
									</button>
								{:else}
									<a href={link.href} rel={link.external ? 'noopener' : undefined} class={linkClass}
										>{t(link.labelKey)}</a
									>
								{/if}
							</li>
						{/each}
					</ul>
				</div>
			{/each}
		</div>

		<!-- Legal Info -->
		<div
			class="site-footer__legal border-t border-slate-800 pt-8 text-center text-xs font-mono text-slate-400 space-y-2"
		>
			<p>
				{t('footer.registeredOffice')}: {site.address.locality}, {site.address.street}, {site
					.address.postalCode}
			</p>
			<p>PEC: legal@pec.webdeploy.it | P.IVA: IT02993340344 | SDI: 3RQHC04</p>
			<p>{t('footer.copyright')}</p>
			<p>{t('footer.trademarks')}</p>
		</div>
	</div>
</footer>
