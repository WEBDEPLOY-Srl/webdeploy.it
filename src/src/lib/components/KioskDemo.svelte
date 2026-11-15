<script lang="ts">
	import { t, tObj } from '$lib/i18n';

	type Mode = 'inwd' | 'windows';
	type View = 'home' | 'hours' | 'map' | 'events';

	const tiles: { view: Exclude<View, 'home'>; icon: string }[] = [
		{ view: 'hours', icon: 'clock' },
		{ view: 'map', icon: 'map' },
		{ view: 'events', icon: 'calendar' }
	];

	let mode = $state<Mode>('inwd');
	let view = $state<View>('home');
	let clock = $state('');
	let progress = $state(0);

	// Set after mount so the prerendered page does not freeze a build-time clock.
	$effect(() => {
		const tick = () => {
			clock = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
		};
		tick();
		const timer = setInterval(tick, 15000);
		return () => clearInterval(timer);
	});

	// The Windows screen never finishes: it creeps to 100% and starts over.
	$effect(() => {
		if (mode !== 'windows') return;
		progress = 0;
		const timer = setInterval(() => {
			progress = progress >= 100 ? 0 : Math.min(100, progress + 1 + Math.floor(Math.random() * 3));
		}, 900);
		return () => clearInterval(timer);
	});

	function setMode(next: Mode) {
		mode = next;
		view = 'home';
	}
</script>

<div class="kiosk-demo" role="group" aria-label={t('totem.demo.label')}>
	<div class="kiosk-demo__device">
		<div class="kiosk-demo__screen" class:kiosk-demo__screen--windows={mode === 'windows'}>
			{#if mode === 'windows'}
				<div class="kiosk-demo__update" role="status">
					<span class="kiosk-demo__spinner" aria-hidden="true">
						{#each Array(5) as _, index (index)}
							<span style="--dot: {index}"></span>
						{/each}
					</span>
					<p class="kiosk-demo__update-title">{t('totem.demo.updating')}</p>
					<p class="kiosk-demo__update-title">{progress}{t('totem.demo.complete')}</p>
					<p class="kiosk-demo__update-note">{t('totem.demo.dontTurnOff')}</p>
				</div>
			{:else}
				<div class="kiosk-demo__app">
					<div class="kiosk-demo__status">
						<span>{t('totem.demo.brand')}</span>
						<span>{clock}</span>
					</div>

					{#if view === 'home'}
						<div class="kiosk-demo__body">
							<p class="kiosk-demo__title">{t('totem.demo.welcome')}</p>
							<p class="kiosk-demo__prompt">{t('totem.demo.prompt')}</p>
							<div class="kiosk-demo__tiles">
								{#each tiles as tile (tile.view)}
									<button type="button" class="kiosk-demo__tile" onclick={() => (view = tile.view)}>
										<span class="pixel-icon pixel-icon-{tile.icon}" aria-hidden="true"></span>
										{t(`totem.demo.${tile.view}.title`)}
									</button>
								{/each}
							</div>
						</div>
					{:else}
						<div class="kiosk-demo__body">
							<button type="button" class="kiosk-demo__back" onclick={() => (view = 'home')}>
								<span class="pixel-icon pixel-icon-arrow-left" aria-hidden="true"></span>
								{t('totem.demo.back')}
							</button>
							<p class="kiosk-demo__title">{t(`totem.demo.${view}.title`)}</p>
							<ul class="kiosk-demo__list">
								{#each tObj<string[]>(`totem.demo.${view}.items`) ?? [] as item}
									<li>{item}</li>
								{/each}
							</ul>
						</div>
					{/if}

					<p class="kiosk-demo__footer">{t('totem.demo.footer')}</p>
				</div>
			{/if}
		</div>
		<img
			class="kiosk-demo__frame"
			src="/images/inwd-kiosk-frame.webp"
			alt={t('totem.diagramAlt')}
			width="898"
			height="1752"
			fetchpriority="high"
			decoding="async"
		/>
		<div class="kiosk-demo__switch" role="group" aria-label={t('totem.demo.switchLabel')}>
			<button type="button" aria-pressed={mode === 'windows'} onclick={() => setMode('windows')}>
				{t('totem.demo.windows')}
			</button>
			<button type="button" aria-pressed={mode === 'inwd'} onclick={() => setMode('inwd')}>
				{t('totem.demo.inwd')}
			</button>
		</div>
	</div>
	<p class="kiosk-demo__caption">{t('totem.demo.caption')}</p>
</div>

<style>
	.kiosk-demo {
		display: grid;
		justify-items: center;
	}

	.kiosk-demo__caption {
		max-width: 22rem;
		margin: 1rem 0 0;
		color: var(--color-text-body);
		font-family: var(--font-mono);
		font-size: 0.75rem;
		line-height: 1.6;
		text-align: center;
	}

	.kiosk-demo__device {
		position: relative;
		height: clamp(26rem, 72vh, 40rem);
		aspect-ratio: 898 / 1752;
		container-type: inline-size;
	}

	/* Matches the transparent screen opening in the frame image (x 176-725, y 88-1092 of
	   898x1752). The frame sits on top, so its bezel covers the screen edges. */
	.kiosk-demo__screen {
		position: absolute;
		top: 5.02%;
		left: 19.6%;
		width: 61.25%;
		height: 57.36%;
		overflow: hidden;
		background: var(--color-background-dark);
		box-shadow: 0 0 3rem rgba(0, 240, 255, 0.22);
		color: white;
		container-type: inline-size;
		font-family: var(--font-mono);
		transition: box-shadow 300ms;
	}

	.kiosk-demo__screen--windows {
		background: #10307a;
		box-shadow: 0 0 3rem rgba(60, 110, 230, 0.35);
	}

	.kiosk-demo__frame {
		position: relative;
		display: block;
		width: 100%;
		height: 100%;
		filter: drop-shadow(0 0 1px rgba(0, 240, 255, 0.55));
		pointer-events: none;
	}

	.kiosk-demo__app {
		position: relative;
		display: flex;
		flex-direction: column;
		height: 100%;
	}

	.kiosk-demo__status {
		display: flex;
		justify-content: space-between;
		padding: 4cqw 5cqw;
		border-bottom: 1px solid rgba(0, 240, 255, 0.2);
		color: var(--color-primary);
		font-size: 4cqw;
		font-weight: 700;
	}

	.kiosk-demo__body {
		padding: 6cqw 5cqw;
	}

	.kiosk-demo__title {
		margin: 0;
		font-family: var(--font-display);
		font-size: 11cqw;
		line-height: 1;
		text-transform: uppercase;
	}

	.kiosk-demo__prompt {
		margin: 2cqw 0 0;
		color: var(--color-text-body);
		font-size: 4.5cqw;
	}

	.kiosk-demo__tiles {
		display: grid;
		gap: 3cqw;
		margin-top: 6cqw;
	}

	.kiosk-demo__tile,
	.kiosk-demo__back {
		display: flex;
		gap: 4cqw;
		align-items: center;
		border: 1px solid rgba(0, 240, 255, 0.3);
		background: var(--color-surface-dark);
		color: white;
		font: inherit;
		text-align: left;
		cursor: pointer;
	}

	.kiosk-demo__tile {
		width: 100%;
		padding: 5cqw;
		font-size: 5cqw;
	}

	.kiosk-demo__back {
		margin-bottom: 6cqw;
		padding: 2.5cqw 4cqw;
		font-size: 4cqw;
	}

	.kiosk-demo__tile .pixel-icon,
	.kiosk-demo__back .pixel-icon {
		color: var(--color-primary);
		font-size: 8cqw;
	}

	.kiosk-demo__back .pixel-icon {
		font-size: 5cqw;
	}

	.kiosk-demo__tile:hover,
	.kiosk-demo__back:hover {
		border-color: var(--color-secondary);
	}

	.kiosk-demo__tile:focus-visible,
	.kiosk-demo__back:focus-visible {
		outline: 2px solid var(--color-secondary);
		outline-offset: -2px;
	}

	.kiosk-demo__list {
		display: grid;
		gap: 4cqw;
		margin: 6cqw 0 0;
		padding: 0;
		list-style: none;
	}

	.kiosk-demo__list li {
		position: relative;
		padding-left: 5cqw;
		color: var(--color-text-body);
		font-size: 4.5cqw;
		line-height: 1.4;
	}

	.kiosk-demo__list li::before {
		position: absolute;
		top: 0.5em;
		left: 0;
		width: 2cqw;
		height: 2cqw;
		background: var(--color-primary);
		content: '';
	}

	.kiosk-demo__footer {
		margin: auto 0 0;
		padding: 4cqw 5cqw;
		color: rgba(203, 213, 225, 0.6);
		font-size: 3.5cqw;
	}

	.kiosk-demo__update {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100%;
		padding: 8cqw;
		text-align: center;
	}

	.kiosk-demo__update-title {
		margin: 0;
		font-family: var(--font-reading, system-ui, sans-serif);
		font-size: 6.5cqw;
		line-height: 1.35;
	}

	.kiosk-demo__update-note {
		margin: 6cqw 0 0;
		font-family: var(--font-reading, system-ui, sans-serif);
		font-size: 4.5cqw;
		line-height: 1.4;
		opacity: 0.85;
	}

	.kiosk-demo__spinner {
		position: relative;
		width: 12cqw;
		height: 12cqw;
		margin-bottom: 8cqw;
	}

	.kiosk-demo__spinner span {
		position: absolute;
		inset: 0;
		animation: kiosk-demo-orbit 2.4s cubic-bezier(0.5, 0.1, 0.5, 0.9) infinite;
		animation-delay: calc(var(--dot) * -0.18s);
	}

	.kiosk-demo__spinner span::before {
		position: absolute;
		top: 0;
		left: 50%;
		width: 1.8cqw;
		height: 1.8cqw;
		border-radius: 50%;
		background: white;
		content: '';
	}

	@keyframes kiosk-demo-orbit {
		to {
			transform: rotate(360deg);
		}
	}

	/* Sits in the open bay between the legs (x 203-696, y 1133-1568 of the frame image). */
	.kiosk-demo__switch {
		position: absolute;
		top: 64.7%;
		left: 22.6%;
		display: flex;
		flex-direction: column;
		gap: 3cqw;
		justify-content: center;
		width: 55%;
		height: 24.8%;
		padding: 0 5cqw;
	}

	.kiosk-demo__switch button {
		min-height: 2.75rem;
		padding: 0.5rem;
		border: 1px solid rgba(0, 240, 255, 0.35);
		background: transparent;
		color: var(--color-text-body);
		font-family: var(--font-mono);
		font-size: max(0.75rem, 3.6cqw);
		font-weight: 700;
		letter-spacing: 0.04em;
		cursor: pointer;
	}

	.kiosk-demo__switch button[aria-pressed='true'] {
		background: var(--color-primary);
		color: var(--color-background-dark);
	}

	.kiosk-demo__switch button:focus-visible {
		outline: 2px solid var(--color-secondary);
		outline-offset: 2px;
	}

	@media (prefers-reduced-motion: reduce) {
		.kiosk-demo__spinner span {
			animation: none;
		}

		.kiosk-demo__screen {
			transition: none;
		}
	}
</style>
