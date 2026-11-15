<script lang="ts">
	import { t, tObj } from '$lib/i18n';
	import Hero from '$lib/components/Hero.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import ContactBand from '$lib/components/ContactBand.svelte';
	import WorkstationDemo from '$lib/components/WorkstationDemo.svelte';
	import {
		siActualbudget,
		siAffine,
		siAlpinelinux,
		siAnsible,
		siArchlinux,
		siBorgbackup,
		siCaddy,
		siCollaboraonline,
		siDebian,
		siDocker,
		siFirefox,
		siForgejo,
		siGrafana,
		siJitsi,
		siKdeplasma,
		siLetsencrypt,
		siLinux,
		siListmonk,
		siMariadb,
		siMatomo,
		siMatrix,
		siN8n,
		siNextcloud,
		siNginx,
		siNtfy,
		siOpentofu,
		siOry,
		siPenpot,
		siPostgresql,
		siPrometheus,
		siSentry,
		siTemporal,
		siThunderbird,
		siTrivy,
		siWayland,
		siWireguard
	} from 'simple-icons';
	import { borgwarehouseLogo } from '$lib/assets/borgwarehouseLogo';
	import { furilabsLogo } from '$lib/assets/furilabsLogo';
	import { linkdingLogo } from '$lib/assets/linkdingLogo';

	// `side` is where the art sits on wide screens. A `cutout` is a transparent image that needs
	// an edge light; a `logo` or `icon` is shown smaller and unframed.
	type Service = {
		key: string;
		href: string;
		src: string;
		srcset?: string;
		width: number;
		height: number;
		side: 'left' | 'right';
		style: 'cutout' | 'logo' | 'icon';
		/** Shows home.serviceSections.<key>.imageCredit under the art, linked to `licence`. */
		licence?: string;
	};
	const services: Service[] = [
		{
			key: 'linux',
			href: '/services/linux-workstations',
			// Rendered as the interactive WorkstationDemo; these fields describe its frame image.
			src: '/images/linux-workstation-frame.webp',
			srcset:
				'/images/linux-workstation-frame-800.webp 800w, /images/linux-workstation-frame.webp 1113w',
			width: 1113,
			height: 1414,
			side: 'right',
			style: 'cutout'
		},
		{
			key: 'privacy',
			href: '/services/backup',
			// Official BorgBackup logo, recoloured; notices in the SVG and the licence file.
			src: '/images/borgbackup-logo.svg',
			width: 320,
			height: 133,
			side: 'left',
			style: 'logo',
			licence: '/images/borgbackup-logo-LICENSE.txt'
		},
		{
			key: 'inwd',
			href: 'https://inwd.org',
			// inWD's Trunk / Rack emblem from the inwd.org design board (the high-resolution mono
			// restoration, site/assets/logos/mono/hires/trunk-rack.png), recoloured like the Borg
			// logo: ink in cyan over a magenta offset shadow.
			src: '/images/inwd-trunk-rack.webp',
			srcset: '/images/inwd-trunk-rack-500.webp 500w, /images/inwd-trunk-rack.webp 907w',
			width: 907,
			height: 1026,
			side: 'right',
			style: 'icon'
		}
	];

	// Open source tools we run, from the company and infra repositories, each linked to its
	// project site or repository. Tools without a Simple Icons logo fall back to a pixel initial.
	type Tool = {
		name: string;
		url: string;
		icon?: { path: string; viewBox?: string; transform?: string };
	};
	const toolGroups: { key: string; tools: Tool[] }[] = [
		{
			key: 'company',
			tools: [
				{ name: 'Forgejo', url: 'https://forgejo.org', icon: siForgejo },
				{ name: 'Planka', url: 'https://planka.app' },
				{ name: 'AFFiNE', url: 'https://affine.pro', icon: siAffine },
				{ name: 'Nextcloud', url: 'https://nextcloud.com', icon: siNextcloud },
				{
					name: 'Collabora Online',
					url: 'https://www.collaboraonline.com',
					icon: siCollaboraonline
				},
				{ name: 'Penpot', url: 'https://penpot.app', icon: siPenpot },
				{ name: 'Matrix', url: 'https://matrix.org', icon: siMatrix },
				{ name: 'FluffyChat', url: 'https://fluffychat.im' },
				{ name: 'Jitsi Meet', url: 'https://jitsi.org/jitsi-meet/', icon: siJitsi },
				{ name: 'Stalwart', url: 'https://stalw.art' },
				{ name: 'listmonk', url: 'https://listmonk.app', icon: siListmonk },
				{ name: 'n8n', url: 'https://n8n.io', icon: siN8n },
				{ name: 'Matomo', url: 'https://matomo.org', icon: siMatomo },
				{ name: 'Actual Budget', url: 'https://actualbudget.org', icon: siActualbudget },
				{ name: 'linkding', url: 'https://linkding.link', icon: linkdingLogo },
				{ name: 'Thunderbird', url: 'https://www.thunderbird.net', icon: siThunderbird },
				{ name: 'Firefox', url: 'https://www.firefox.com', icon: siFirefox },
				{ name: 'Arch Linux', url: 'https://archlinux.org', icon: siArchlinux },
				{ name: 'KDE Plasma', url: 'https://kde.org/plasma-desktop/', icon: siKdeplasma },
				{ name: 'Wayland', url: 'https://wayland.freedesktop.org', icon: siWayland },
				{ name: 'FuriLabs', url: 'https://furilabs.com', icon: furilabsLogo }
			]
		},
		{
			key: 'infrastructure',
			tools: [
				{ name: 'Linux', url: 'https://kernel.org', icon: siLinux },
				{ name: 'Debian', url: 'https://www.debian.org', icon: siDebian },
				{ name: 'Alpine Linux', url: 'https://alpinelinux.org', icon: siAlpinelinux },
				{ name: 'Ansible', url: 'https://github.com/ansible/ansible', icon: siAnsible },
				{ name: 'OpenTofu', url: 'https://opentofu.org', icon: siOpentofu },
				{ name: 'Docker', url: 'https://github.com/moby/moby', icon: siDocker },
				{ name: 'Caddy', url: 'https://caddyserver.com', icon: siCaddy },
				{ name: 'Let’s Encrypt', url: 'https://letsencrypt.org', icon: siLetsencrypt },
				{ name: 'NGINX', url: 'https://nginx.org', icon: siNginx },
				{ name: 'WireGuard', url: 'https://www.wireguard.com', icon: siWireguard },
				{ name: 'PostgreSQL', url: 'https://www.postgresql.org', icon: siPostgresql },
				{ name: 'MariaDB', url: 'https://mariadb.org', icon: siMariadb },
				{ name: 'Valkey', url: 'https://valkey.io' },
				{ name: 'Ory', url: 'https://www.ory.sh', icon: siOry },
				{ name: 'SuperTokens', url: 'https://supertokens.com' },
				{ name: 'Temporal', url: 'https://temporal.io', icon: siTemporal }
			]
		},
		{
			key: 'operations',
			tools: [
				{ name: 'Grafana', url: 'https://grafana.com/oss/grafana/', icon: siGrafana },
				{ name: 'Prometheus', url: 'https://prometheus.io', icon: siPrometheus },
				{ name: 'Sentry', url: 'https://github.com/getsentry/sentry', icon: siSentry },
				{ name: 'Loki', url: 'https://grafana.com/oss/loki/' },
				{ name: 'ntfy', url: 'https://ntfy.sh', icon: siNtfy },
				{ name: 'BorgBackup', url: 'https://www.borgbackup.org', icon: siBorgbackup },
				{ name: 'BorgWarehouse', url: 'https://borgwarehouse.com', icon: borgwarehouseLogo },
				{ name: 'Woodpecker CI', url: 'https://woodpecker-ci.org' },
				{ name: 'Trivy', url: 'https://trivy.dev', icon: siTrivy },
				{ name: 'Suricata', url: 'https://suricata.io' },
				{ name: 'Fail2Ban', url: 'https://github.com/fail2ban/fail2ban' }
			]
		}
	];
</script>

<Seo title={t('home.metaTitle')} description={t('home.metaDescription')} />

<svelte:head>
	<link rel="preload" as="image" href="/images/neon-cafe-workshop.webp" fetchpriority="high" />
</svelte:head>

<div class="home-page">
	<div class="home-hero">
		<Hero
			name={t('home.heroName')}
			text={t('home.heroText')}
			tagline={t('home.heroTagline')}
			subtitle={t('home.heroSubtitle')}
			actions={[
				{ text: t('home.servicesBtn'), href: '/#services', primary: true },
				{ text: t('home.manifestoBtn'), href: '/developer-manifesto', primary: false }
			]}
		/>
	</div>

	<section id="services" class="home-section home-services" aria-labelledby="home-services-title">
		<div class="page-container">
			<div class="home-section__intro">
				<p class="section-eyebrow">{t('home.servicesEyebrow')}</p>
				<h2 id="home-services-title" class="section-title">{t('home.servicesTitle')}</h2>
				<p class="section-lead">{t('home.servicesDescription')}</p>
			</div>
		</div>
	</section>

	{#each services as service (service.key)}
		<section
			id="home-service-{service.key}"
			class="home-service home-service--art-{service.side}"
			aria-labelledby="home-service-{service.key}-title"
		>
			<div class="page-container home-service__layout">
				<div class="home-service__copy">
					<h3 id="home-service-{service.key}-title">
						{t(`home.serviceSections.${service.key}.title`)}
					</h3>
					<p class="home-service__subtitle">{t(`home.serviceSections.${service.key}.subtitle`)}</p>
					<p class="section-lead">{t(`home.serviceSections.${service.key}.lead`)}</p>
					<ul class="section-points">
						{#each tObj<string[]>(`home.serviceSections.${service.key}.points`) ?? [] as point}
							<li>{point}</li>
						{/each}
					</ul>
					<a href={service.href} class="btn-action">
						{t(`home.serviceSections.${service.key}.linkLabel`)} <span aria-hidden="true">→</span>
					</a>
				</div>
				<figure class="home-service__art">
					{#if service.key === 'linux'}
						<WorkstationDemo />
					{:else}
						<img
							class="home-service__image home-service__image--{service.style}"
							src={service.src}
							srcset={service.srcset}
							sizes={service.srcset ? '(min-width: 64rem) 40vw, 100vw' : undefined}
							alt={t(`home.serviceSections.${service.key}.imageAlt`)}
							width={service.width}
							height={service.height}
							loading="lazy"
							decoding="async"
						/>
					{/if}
					{#if service.licence}
						<figcaption class="home-service__credit">
							{t(`home.serviceSections.${service.key}.imageCredit`)}
							<a href={service.licence}>{t('home.licenceLink')}</a>
						</figcaption>
					{/if}
				</figure>
			</div>
		</section>
	{/each}

	<section class="home-section home-about" aria-labelledby="home-about-title">
		<div class="page-container home-about__content">
			<div class="home-about__copy">
				<p class="section-eyebrow">{t('home.aboutEyebrow')}</p>
				<h2 id="home-about-title" class="section-title">{t('home.aboutTitle')}</h2>
				<p class="section-lead">{t('home.aboutDescription')}</p>
				<a href="/developer-manifesto" class="btn-action">
					{t('home.aboutLink')} <span aria-hidden="true">→</span>
				</a>
			</div>
			<div class="home-tools">
				{#each toolGroups as group (group.key)}
					<div class="home-tools__group">
						<h3 id="home-tools-{group.key}">{t(`home.toolGroups.${group.key}`)}</h3>
						<ul class="home-tools__grid" aria-labelledby="home-tools-{group.key}">
							{#each group.tools as tool (tool.name)}
								<li>
									<a
										class="home-tools__tile"
										href={tool.url}
										target="_blank"
										rel="noopener noreferrer"
									>
										{#if tool.icon}
											<svg viewBox={tool.icon.viewBox ?? '0 0 24 24'} aria-hidden="true">
												<path d={tool.icon.path} transform={tool.icon.transform} />
											</svg>
										{:else}
											<span class="home-tools__initial" aria-hidden="true">{tool.name[0]}</span>
										{/if}
										<span>{tool.name}</span>
									</a>
								</li>
							{/each}
						</ul>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<ContactBand />
</div>

<style>
	.home-page {
		font-family: var(--font-reading, system-ui, sans-serif);
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

	@media (min-width: 64rem) {
		.home-about__content {
			grid-template-columns: minmax(16rem, 0.7fr) minmax(0, 1.3fr);
			align-items: start;
		}

		.home-about__copy {
			position: sticky;
			top: 6rem;
		}
	}
</style>
