<script lang="ts">
	import { t } from '#lib/i18n/index.ts';
</script>

<!-- Same call-to-action band as the inWD Kiosk page. -->
<section class="py-20 bg-secondary relative overflow-hidden" aria-labelledby="contact-band-title">
	<div class="absolute top-0 left-0 w-full h-2 bg-primary/50"></div>
	<div class="absolute bottom-0 left-0 w-full h-2 bg-primary/50"></div>
	<div class="max-w-4xl mx-auto px-4 text-center relative z-10">
		<h2 id="contact-band-title" class="text-4xl sm:text-5xl font-display uppercase text-black mb-6">
			{t('home.ctaTitle')}
		</h2>
		<p class="text-black/80 font-bold font-mono text-lg mb-10">
			{t('home.ctaDescription')}
		</p>
		<a
			href="/contacts"
			class="btn-cta-primary inline-block text-lg font-bold py-4 px-10 uppercase tracking-widest"
		>
			{t('home.ctaContact')}
		</a>
	</div>
</section>
