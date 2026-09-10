<script lang="ts">
	import { t } from '$lib/i18n';
	import Hero from '$lib/components/Hero.svelte';
	import FeatureCard from '$lib/components/FeatureCard.svelte';
	import Seo from '$lib/components/Seo.svelte';
</script>

<Seo title={t('home.heroText')} description={t('home.heroTagline')} image="/webdeploy-logo.svg" />

<div class="home-page">
	<Hero
		name={t('home.heroName')}
		text={t('home.heroText')}
		tagline={t('home.heroTagline')}
		eyebrow={t('home.heroEyebrow')}
		image="/webdeploy-logo.svg"
		imageAlt={t('home.heroImageAlt')}
		readable={true}
		actions={[
			{ text: t('home.servicesBtn'), href: '/services', primary: true },
			{ text: t('home.manifestoBtn'), href: '/developer-manifesto', primary: false }
		]}
	/>

	<section class="home-section home-services" aria-labelledby="home-services-title">
		<div class="home-container">
			<div class="home-section__intro">
				<p class="home-eyebrow">{t('home.servicesEyebrow')}</p>
				<h2 id="home-services-title">{t('home.servicesTitle')}</h2>
				<p>{t('home.servicesDescription')}</p>
			</div>
			<div class="home-features">
				<FeatureCard
					title={t('home.features.linux.title')}
					details={t('home.features.linux.details')}
					iconSrc="/icon-linux.svg"
					readable={true}
					href="/services#linux"
					linkLabel={t('home.features.linux.linkLabel')}
				/>
				<FeatureCard
					title={t('home.features.privacy.title')}
					details={t('home.features.privacy.details')}
					iconSrc="/icon-privacy.svg"
					readable={true}
				/>
				<FeatureCard
					title={t('home.features.inwd.title')}
					details={t('home.features.inwd.details')}
					iconSrc="/icon-inwd.svg"
					readable={true}
					href="/services#inwd"
					linkLabel={t('home.features.inwd.linkLabel')}
				/>
			</div>
		</div>
	</section>

	<section class="home-section home-about" aria-labelledby="home-about-title">
		<div class="home-container home-about__content">
			<figure class="home-about__image">
				<img
					src="/webdeploy-hq.svg"
					alt={t('home.aboutImageAlt')}
					width="1200"
					height="514"
					loading="lazy"
					decoding="async"
				/>
			</figure>
			<div class="home-about__copy">
				<p class="home-eyebrow">{t('home.aboutEyebrow')}</p>
				<h2 id="home-about-title">{t('home.aboutTitle')}</h2>
				<p>{t('home.aboutDescription')}</p>
				<a href="/developer-manifesto">
					{t('home.aboutLink')} <span aria-hidden="true">→</span>
				</a>
			</div>
		</div>
	</section>

	<section class="home-section home-contact" aria-labelledby="home-contact-title">
		<div class="home-container home-contact__content">
			<div>
				<p class="home-eyebrow">{t('home.ctaEyebrow')}</p>
				<h2 id="home-contact-title">{t('home.ctaTitle')}</h2>
				<p>{t('home.ctaDescription')}</p>
			</div>
			<a href="/contacts" class="home-contact__action">{t('home.ctaContact')}</a>
		</div>
	</section>
</div>

<style>
	.home-page {
		font-family: var(--font-reading, system-ui, sans-serif);
	}

	.home-container {
		width: 100%;
		max-width: 80rem;
		margin-inline: auto;
		padding-inline: 1rem;
	}

	.home-section {
		padding: clamp(4rem, 8vw, 7rem) 0;
	}

	.home-section__intro {
		max-width: 42rem;
	}

	.home-eyebrow {
		margin: 0 0 1rem;
		color: var(--color-primary);
		font-family: var(--font-mono);
		font-size: 0.75rem;
		font-weight: 700;
		letter-spacing: 0.12em;
		line-height: 1.5;
		text-transform: uppercase;
	}

	.home-section h2 {
		margin: 0;
		color: white;
		font-family: var(--font-display);
		font-size: clamp(2rem, 4.5vw, 3.25rem);
		font-weight: 400;
		letter-spacing: normal;
		line-height: 1.08;
		text-transform: uppercase;
	}

	.home-section__intro > p:last-child,
	.home-about__copy > p:not(.home-eyebrow),
	.home-contact p:not(.home-eyebrow) {
		max-width: 37rem;
		margin: 1.25rem 0 0;
		color: var(--color-text-body);
		font-size: clamp(1.0625rem, 1.5vw, 1.1875rem);
		line-height: 1.7;
	}

	.home-features {
		display: grid;
		gap: 2.5rem;
		margin-top: clamp(2.5rem, 5vw, 4rem);
	}

	.home-about {
		border-block: 1px solid rgba(0, 240, 255, 0.18);
		background: rgba(14, 22, 33, 0.68);
	}

	.home-about__content {
		display: grid;
		gap: clamp(2rem, 6vw, 6rem);
		align-items: center;
	}

	.home-about__image {
		width: min(100%, 31rem);
		margin: 0;
		padding: 0.75rem;
		border: 1px solid rgba(0, 240, 255, 0.32);
		background: var(--color-background-dark);
	}

	.home-about__image img {
		display: block;
		width: 100%;
		height: auto;
	}

	.home-about__copy > a {
		display: inline-flex;
		align-items: center;
		min-height: 2.75rem;
		margin-top: 1.25rem;
		color: var(--color-primary);
		font-family: var(--font-mono);
		font-size: 0.875rem;
		font-weight: 700;
		letter-spacing: 0.04em;
		text-decoration: none;
	}

	.home-about__copy > a:hover {
		color: white;
		text-decoration: underline;
		text-underline-offset: 0.25rem;
	}

	.home-about__copy > a:focus-visible,
	.home-contact__action:focus-visible {
		outline: 2px solid var(--color-primary);
		outline-offset: 3px;
	}

	.home-contact {
		position: relative;
		overflow: hidden;
	}

	.home-contact::after {
		position: absolute;
		top: 1.5rem;
		right: max(1rem, calc((100% - 80rem) / 2));
		width: clamp(3rem, 11vw, 9rem);
		height: 3px;
		background: var(--color-secondary);
		content: '';
	}

	.home-contact__content {
		display: flex;
		flex-direction: column;
		gap: 2rem;
		align-items: flex-start;
	}

	.home-contact__action {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-height: 3rem;
		padding: 0.75rem 1.25rem;
		background: var(--color-primary);
		color: var(--color-background-dark);
		font-family: var(--font-mono);
		font-size: 0.875rem;
		font-weight: 700;
		letter-spacing: 0.04em;
		text-decoration: none;
	}

	.home-contact__action:hover {
		background: white;
	}

	@media (min-width: 40rem) {
		.home-container {
			padding-inline: 1.5rem;
		}
	}

	@media (min-width: 48rem) {
		.home-features {
			grid-template-columns: repeat(3, minmax(0, 1fr));
			gap: 2rem;
		}

		.home-contact__content {
			flex-direction: row;
			align-items: end;
			justify-content: space-between;
		}
	}

	@media (min-width: 64rem) {
		.home-container {
			padding-inline: 2rem;
		}

		.home-about__content {
			grid-template-columns: minmax(16rem, 0.8fr) minmax(0, 1fr);
		}
	}
</style>
