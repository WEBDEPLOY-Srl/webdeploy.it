<script lang="ts">
	import {
		siArchlinux,
		siDebian,
		siFirefox,
		siForgejo,
		siKdeplasma,
		siLibreoffice,
		siNextcloud,
		siThunderbird,
		siWireguard
	} from 'simple-icons';

	let { label }: { label: string } = $props();
	const id = $props.id();

	// A short pick of the tools on the homepage, for pages that need a compact open source visual.
	const tools = [
		{ name: 'Debian', url: 'https://www.debian.org', icon: siDebian },
		{ name: 'Arch Linux', url: 'https://archlinux.org', icon: siArchlinux },
		{ name: 'KDE Plasma', url: 'https://kde.org/plasma-desktop/', icon: siKdeplasma },
		{ name: 'LibreOffice', url: 'https://www.libreoffice.org', icon: siLibreoffice },
		{ name: 'Firefox', url: 'https://www.firefox.com', icon: siFirefox },
		{ name: 'Thunderbird', url: 'https://www.thunderbird.net', icon: siThunderbird },
		{ name: 'Nextcloud', url: 'https://nextcloud.com', icon: siNextcloud },
		{ name: 'Forgejo', url: 'https://forgejo.org', icon: siForgejo },
		{ name: 'WireGuard', url: 'https://www.wireguard.com', icon: siWireguard }
	];
</script>

<div class="home-tools tool-tiles">
	<p class="tool-tiles__label" id="{id}-label">{label}</p>
	<ul class="home-tools__grid" aria-labelledby="{id}-label">
		{#each tools as tool (tool.name)}
			<li>
				<a class="home-tools__tile" href={tool.url} target="_blank" rel="noopener noreferrer">
					<svg viewBox="0 0 24 24" aria-hidden="true"><path d={tool.icon.path} /></svg>
					<span>{tool.name}</span>
				</a>
			</li>
		{/each}
	</ul>
</div>

<style>
	.tool-tiles {
		max-width: 28rem;
		margin-inline: auto;
	}

	/* Styled like the homepage tool group headings, but not a heading: it labels a decorative list. */
	.tool-tiles__label {
		margin: 0 0 0.75rem;
		color: var(--color-secondary);
		font-family: var(--font-mono);
		font-size: 0.75rem;
		font-weight: 700;
		letter-spacing: 0.12em;
		text-transform: uppercase;
	}

	.tool-tiles :global(.home-tools__grid) {
		grid-template-columns: repeat(3, minmax(0, 1fr));
	}
</style>
