<script lang="ts">
	import { t } from '#lib/i18n/index.ts';

	type App = 'files' | 'browser' | 'office';
	type Point = [number, number];
	type Screen = { key: string; w: number; h: number; quad: [Point, Point, Point, Point] };

	// Frame image size and the transparent screen openings in it (top-left, top-right,
	// bottom-right, bottom-left), measured from the alpha channel of linux-workstation-frame.webp.
	const FRAME_W = 1113;
	const FRAME_H = 1414;
	const screens: Screen[] = [
		{
			key: 'left',
			w: 480,
			h: 282,
			quad: [
				[51, 554],
				[366, 570],
				[367, 732],
				[50, 763]
			]
		},
		{
			key: 'center',
			w: 480,
			h: 250,
			quad: [
				[387, 570],
				[697, 571],
				[697, 732],
				[387, 731]
			]
		},
		{
			key: 'right',
			w: 480,
			h: 278,
			quad: [
				[717, 571],
				[1024, 555],
				[1023, 762],
				[717, 733]
			]
		},
		{
			key: 'top',
			w: 480,
			h: 283,
			quad: [
				[723, 365],
				[995, 300],
				[1012, 500],
				[737, 529]
			]
		}
	];

	// Grows each opening a few pixels so the screen content tucks under the bezel.
	function grow(quad: Screen['quad'], by = 3): Screen['quad'] {
		const cx = quad.reduce((s, p) => s + p[0], 0) / 4;
		const cy = quad.reduce((s, p) => s + p[1], 0) / 4;
		return quad.map(([x, y]) => {
			const len = Math.hypot(x - cx, y - cy);
			return [x + ((x - cx) / len) * by, y + ((y - cy) / len) * by];
		}) as Screen['quad'];
	}

	// Projective transform from a w×h box onto the quad, as a CSS matrix3d.
	function toMatrix(w: number, h: number, quad: Screen['quad']): string {
		const [[x0, y0], [x1, y1], [x2, y2], [x3, y3]] = grow(quad);
		const dx1 = x1 - x2,
			dx2 = x3 - x2,
			dx3 = x0 - x1 + x2 - x3;
		const dy1 = y1 - y2,
			dy2 = y3 - y2,
			dy3 = y0 - y1 + y2 - y3;
		const den = dx1 * dy2 - dx2 * dy1;
		const g = (dx3 * dy2 - dx2 * dy3) / den;
		const k = (dx1 * dy3 - dx3 * dy1) / den;
		const a = x1 - x0 + g * x1,
			b = x3 - x0 + k * x3;
		const d = y1 - y0 + g * y1,
			e = y3 - y0 + k * y3;
		const m = [a / w, d / w, 0, g / w, b / h, e / h, 0, k / h, 0, 0, 1, 0, x0, y0, 0, 1];
		return `matrix3d(${m.map((n) => +n.toFixed(6)).join(',')})`;
	}

	const apps: { app: App; name: string }[] = [
		{ app: 'files', name: 'Dolphin' },
		{ app: 'browser', name: 'Firefox' },
		{ app: 'office', name: 'LibreOffice Writer' }
	];

	let app = $state<App | null>(null);
	let launcher = $state(false);
	let highlighted = $state<App | null>(null);
	let printed = $state(false);
	let notice = $state(false);
	let clock = $state('');
	let scale = $state(0);
	let device: HTMLDivElement;

	const reduceMotion = () =>
		typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

	$effect(() => {
		const tick = () => {
			clock = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
		};
		tick();
		const timer = setInterval(tick, 15000);
		return () => clearInterval(timer);
	});

	// The screens are laid out in frame pixels and scaled with the image.
	$effect(() => {
		const observer = new ResizeObserver(([entry]) => {
			scale = entry.contentRect.width / FRAME_W;
		});
		observer.observe(device);
		return () => observer.disconnect();
	});

	// One pending timer set per action, so a second click replaces the first instead of racing it.
	type Timers = ReturnType<typeof setTimeout>[];
	let openTimers: Timers = [];
	let printTimers: Timers = [];
	const clear = (list: Timers) => {
		list.forEach(clearTimeout);
		list.length = 0;
	};
	$effect(() => () => {
		clear(openTimers);
		clear(printTimers);
	});

	// The button stays pressed for the app being opened while the launcher animates.
	let selected = $state<App | null>(null);

	// Like Plasma: the launcher opens, the entry lights up, then the window appears.
	function open(next: App) {
		clear(openTimers);
		selected = next;
		if (reduceMotion()) {
			launcher = false;
			highlighted = null;
			app = next;
			return;
		}
		app = null;
		launcher = true;
		highlighted = null;
		openTimers.push(
			setTimeout(() => (highlighted = next), 350),
			setTimeout(() => {
				launcher = false;
				highlighted = null;
				app = next;
			}, 900)
		);
	}

	function printLabel() {
		clear(printTimers);
		printed = false;
		notice = false;
		const delay = reduceMotion() ? 0 : 700;
		printTimers.push(
			setTimeout(() => {
				printed = true;
				notice = true;
			}, delay),
			setTimeout(() => (notice = false), delay + 6000)
		);
	}
</script>

<div class="ws-demo" role="group" aria-label={t('services.linux.testMachine.demo.label')}>
	<div class="ws-demo__device" bind:this={device} style="aspect-ratio: {FRAME_W} / {FRAME_H}">
		<div
			class="ws-demo__stage"
			style="transform: scale({scale}); visibility: {scale ? 'visible' : 'hidden'}"
		>
			{#each screens as s (s.key)}
				<div
					class="ws-screen ws-screen--{s.key}"
					style="width: {s.w}px; height: {s.h}px; transform: {toMatrix(s.w, s.h, s.quad)}"
					aria-hidden="true"
				>
					{#if s.key === 'left'}
						<div class="win">
							<div class="win__title">Thunderbird</div>
							<div class="mail">
								<div class="mail__folders">
									<span class="active">Inbox</span><span>Sent</span><span>Archive</span>
								</div>
								<div class="mail__list">
									{#each [1, 1, 0, 1, 0, 0, 1, 0] as unread, i (i)}
										<div class="mail__row" class:unread>
											<i></i><b style="width: {38 + ((i * 17) % 40)}%"></b>
										</div>
									{/each}
								</div>
							</div>
						</div>
					{:else if s.key === 'right'}
						<div class="win">
							<div class="win__title">LibreOffice Calc</div>
							<div class="sheet">
								{#each Array(9) as _, r (r)}
									<div class="sheet__row" class:head={r === 0}>
										{#each Array(6) as _, c (c)}
											<span class:num={r > 0 && c > 1}
												>{r > 0 && c > 1 ? ((r * 37 + c * 11) % 90) + 10 : ''}</span
											>
										{/each}
									</div>
								{/each}
							</div>
						</div>
					{:else if s.key === 'top'}
						<div class="win">
							<div class="win__title">{t('services.linux.testMachine.demo.printQueue')}</div>
							<div class="queue">
								<div class="queue__printer">
									<span class="queue__dot"></span>{t('services.linux.testMachine.demo.printer')}
									<em>{t('services.linux.testMachine.demo.ready')}</em>
								</div>
								{#if printed}
									<div class="queue__job">
										test-label.pdf <em>{t('services.linux.testMachine.demo.completed')}</em>
									</div>
								{/if}
								<div class="queue__job">
									invoice-2026-114.pdf <em>{t('services.linux.testMachine.demo.completed')}</em>
								</div>
								<div class="queue__job">
									delivery-note.odt <em>{t('services.linux.testMachine.demo.completed')}</em>
								</div>
							</div>
						</div>
					{:else}
						<div class="desk">
							{#if app === 'files'}
								<div class="win win--float">
									<div class="win__title">Dolphin</div>
									<div class="files">
										<div class="files__side">
											<span class="active">Home</span><span>Documents</span><span>Network</span>
										</div>
										<div class="files__grid">
											{#each ['Documents', 'Invoices', 'Labels', 'Scans', 'Templates', 'Shared'] as f (f)}
												<span><i></i>{f}</span>
											{/each}
										</div>
									</div>
								</div>
							{:else if app === 'browser'}
								<div class="win win--float">
									<div class="win__title">Firefox</div>
									<div class="browser">
										<div class="browser__bar"><span></span></div>
										<div class="browser__page"><b></b><i></i><i></i><i class="short"></i></div>
									</div>
								</div>
							{:else if app === 'office'}
								<div class="win win--float">
									<div class="win__title">LibreOffice Writer</div>
									<div class="writer">
										<div class="writer__tools"></div>
										<div class="writer__page">
											<b></b><i></i><i></i><i></i><i class="short"></i>
										</div>
									</div>
								</div>
							{/if}

							{#if launcher}
								<div class="kickoff">
									<div class="kickoff__search"></div>
									{#each apps as a (a.app)}
										<div class="kickoff__item" class:hl={highlighted === a.app}>
											<i></i>{a.name}
										</div>
									{/each}
								</div>
							{/if}

							{#if notice}
								<div class="toast">
									<b>{t('services.linux.testMachine.demo.noticeTitle')}</b>
									<span>{t('services.linux.testMachine.demo.noticeBody')}</span>
								</div>
							{/if}

							<div class="panel">
								<span class="panel__launcher" class:on={launcher}></span>
								{#each apps as a (a.app)}
									<span class="panel__task" class:on={app === a.app}><i></i></span>
								{/each}
								<span class="panel__tray">{clock}</span>
							</div>
						</div>
					{/if}
				</div>
			{/each}
		</div>
		<img
			class="ws-demo__frame"
			src="/images/linux-workstation-frame-800.webp"
			srcset="/images/linux-workstation-frame-800.webp 800w, /images/linux-workstation-frame.webp 1113w"
			sizes="min(34rem, 100vw)"
			alt={t('services.linux.testMachine.imageAlt')}
			width={FRAME_W}
			height={FRAME_H}
			loading="lazy"
			decoding="async"
		/>
	</div>

	<div
		class="ws-demo__controls"
		role="group"
		aria-label={t('services.linux.testMachine.demo.controls')}
	>
		{#each apps as a (a.app)}
			<button type="button" aria-pressed={selected === a.app} onclick={() => open(a.app)}>
				{t(`services.linux.testMachine.demo.${a.app}`)}
			</button>
		{/each}
		<button type="button" onclick={printLabel}>{t('services.linux.testMachine.demo.print')}</button>
	</div>
	<p class="sr-only" role="status">
		{notice ? t('services.linux.testMachine.demo.noticeTitle') : ''}
	</p>
</div>

<style>
	.ws-demo {
		display: grid;
		gap: 1.25rem;
		justify-items: center;
		width: min(100%, 34rem);
		margin-inline: auto;
	}

	.ws-demo__device {
		position: relative;
		width: 100%;
	}

	.ws-demo__frame {
		position: relative;
		display: block;
		width: 100%;
		height: auto;
		filter: drop-shadow(0 0 1px rgba(0, 240, 255, 0.55))
			drop-shadow(0 1.5rem 2rem rgba(0, 0, 0, 0.6));
		pointer-events: none;
	}

	.ws-demo__stage {
		position: absolute;
		top: 0;
		left: 0;
		width: 1113px;
		height: 1414px;
		transform-origin: 0 0;
	}

	/* Breeze Dark colours; text is decorative at this size, so it stays small and aria-hidden. */
	.ws-screen {
		--bg: #1b1e20;
		--win: #292c30;
		--line: #3b4045;
		--text: #fcfcfc;
		--dim: #a1a9b1;
		--accent: #3daee9;
		position: absolute;
		top: 0;
		left: 0;
		overflow: hidden;
		background: var(--bg);
		color: var(--text);
		font-family: 'Noto Sans', system-ui, sans-serif;
		font-size: 14px;
		line-height: 1.3;
		transform-origin: 0 0;
	}

	.win {
		display: flex;
		flex-direction: column;
		height: 100%;
		background: var(--win);
	}

	.win__title {
		padding: 6px 10px;
		background: #31363b;
		color: var(--dim);
		font-size: 13px;
		text-align: center;
	}

	.win--float {
		position: absolute;
		inset: 14px 30px 46px;
		height: auto;
		border: 1px solid var(--line);
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
		animation: pop 220ms ease-out;
	}

	/* Thunderbird */
	.mail {
		display: flex;
		flex: 1;
	}

	.mail__folders {
		display: grid;
		align-content: start;
		gap: 8px;
		width: 30%;
		padding: 10px;
		border-right: 1px solid var(--line);
		color: var(--dim);
	}

	.active {
		color: var(--text);
		border-left: 3px solid var(--accent);
		padding-left: 6px;
	}

	.mail__list {
		flex: 1;
	}

	.mail__row {
		display: flex;
		gap: 10px;
		align-items: center;
		padding: 9px 12px;
		border-bottom: 1px solid var(--line);
	}

	.mail__row i {
		width: 8px;
		height: 8px;
		border-radius: 50%;
	}

	.mail__row b {
		height: 7px;
		background: var(--line);
	}

	.mail__row.unread i {
		background: var(--accent);
	}

	.mail__row.unread b {
		background: var(--dim);
	}

	/* LibreOffice Calc */
	.sheet {
		flex: 1;
		background: #fff;
		color: #222;
	}

	.sheet__row {
		display: grid;
		grid-template-columns: 0.5fr 1.6fr repeat(4, 1fr);
		height: 11%;
		border-bottom: 1px solid #d6d6d6;
		font-size: 12px;
	}

	.sheet__row span {
		padding: 4px 6px;
		border-right: 1px solid #d6d6d6;
	}

	.sheet__row .num {
		text-align: right;
	}

	.sheet__row.head {
		background: #e8eaed;
	}

	.sheet__row:nth-child(4) {
		background: rgba(61, 174, 233, 0.18);
	}

	/* Print queue */
	.queue {
		display: grid;
		align-content: start;
		gap: 10px;
		padding: 14px;
		color: var(--dim);
	}

	.queue__printer {
		display: flex;
		gap: 10px;
		align-items: center;
		padding-bottom: 10px;
		border-bottom: 1px solid var(--line);
		color: var(--text);
		font-size: 16px;
	}

	.queue__dot {
		width: 10px;
		height: 10px;
		border-radius: 50%;
		background: #27ae60;
	}

	.queue em {
		margin-left: auto;
		color: #27ae60;
		font-style: normal;
	}

	.queue__job {
		display: flex;
		animation: pop 220ms ease-out;
	}

	/* Plasma desktop on the primary screen */
	.desk {
		position: absolute;
		inset: 0;
		background:
			radial-gradient(circle at 70% 30%, rgba(61, 174, 233, 0.45), transparent 55%),
			radial-gradient(circle at 20% 80%, rgba(155, 89, 182, 0.5), transparent 60%),
			linear-gradient(160deg, #13233a, #1b1e20);
	}

	.panel {
		position: absolute;
		right: 0;
		bottom: 0;
		left: 0;
		display: flex;
		gap: 8px;
		align-items: center;
		height: 34px;
		padding: 0 10px;
		background: rgba(32, 35, 38, 0.95);
		border-top: 1px solid var(--line);
	}

	.panel__launcher {
		width: 20px;
		height: 20px;
		border-radius: 50%;
		background: var(--accent);
		box-shadow: 0 0 0 3px transparent;
	}

	.panel__launcher.on {
		box-shadow: 0 0 0 3px rgba(61, 174, 233, 0.4);
	}

	.panel__task {
		display: grid;
		place-items: center;
		width: 28px;
		height: 28px;
		border-bottom: 2px solid transparent;
	}

	.panel__task i {
		width: 16px;
		height: 16px;
		border-radius: 3px;
		background: var(--dim);
	}

	.panel__task.on {
		border-color: var(--accent);
		background: rgba(61, 174, 233, 0.15);
	}

	.panel__tray {
		margin-left: auto;
		color: var(--text);
		font-size: 13px;
	}

	.kickoff {
		position: absolute;
		bottom: 34px;
		left: 0;
		display: grid;
		gap: 4px;
		width: 52%;
		padding: 10px;
		background: rgba(41, 44, 48, 0.97);
		border: 1px solid var(--line);
		animation: rise 200ms ease-out;
	}

	.kickoff__search {
		height: 20px;
		margin-bottom: 6px;
		background: var(--bg);
		border: 1px solid var(--line);
	}

	.kickoff__item {
		display: flex;
		gap: 8px;
		align-items: center;
		padding: 5px 6px;
		font-size: 13px;
	}

	.kickoff__item i {
		width: 14px;
		height: 14px;
		border-radius: 3px;
		background: var(--dim);
	}

	.kickoff__item.hl {
		background: rgba(61, 174, 233, 0.3);
		outline: 1px solid var(--accent);
	}

	.files {
		display: flex;
		flex: 1;
	}

	.files__side {
		display: grid;
		align-content: start;
		gap: 8px;
		width: 28%;
		padding: 10px;
		border-right: 1px solid var(--line);
		color: var(--dim);
		font-size: 12px;
	}

	.files__grid {
		display: grid;
		flex: 1;
		grid-template-columns: repeat(3, 1fr);
		gap: 10px;
		padding: 12px;
		font-size: 11px;
		text-align: center;
	}

	.files__grid i {
		display: block;
		width: 34px;
		height: 26px;
		margin: 0 auto 4px;
		border-radius: 3px;
		background: var(--accent);
	}

	.browser,
	.writer {
		display: flex;
		flex: 1;
		flex-direction: column;
	}

	.browser__bar {
		padding: 6px 10px;
		border-bottom: 1px solid var(--line);
	}

	.browser__bar span {
		display: block;
		height: 14px;
		border-radius: 7px;
		background: var(--bg);
	}

	.browser__page,
	.writer__page {
		display: grid;
		flex: 1;
		align-content: start;
		gap: 9px;
		padding: 16px;
		background: #f5f5f5;
	}

	.writer__tools {
		height: 18px;
		border-bottom: 1px solid var(--line);
	}

	.writer__page {
		margin: 8px 50px 0;
		background: #fff;
	}

	.browser__page b,
	.writer__page b {
		width: 45%;
		height: 14px;
		background: #2c3e50;
	}

	.browser__page i,
	.writer__page i {
		height: 7px;
		background: #c8ccd0;
	}

	.browser__page .short,
	.writer__page .short {
		width: 60%;
	}

	.toast {
		position: absolute;
		right: 10px;
		bottom: 44px;
		display: grid;
		gap: 3px;
		width: 46%;
		padding: 10px 12px;
		background: rgba(41, 44, 48, 0.97);
		border: 1px solid var(--line);
		border-left: 3px solid #27ae60;
		font-size: 12px;
		animation: rise 220ms ease-out;
	}

	.toast span {
		color: var(--dim);
	}

	.ws-demo__controls {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		justify-content: center;
	}

	.ws-demo__controls button {
		min-height: 2.75rem;
		padding: 0.5rem 0.9rem;
		border: 1px solid rgba(0, 240, 255, 0.4);
		background: var(--color-background-dark);
		color: var(--color-text-body);
		font-family: var(--font-mono);
		font-size: 0.8125rem;
		cursor: pointer;
		transition:
			border-color 150ms,
			color 150ms;
	}

	.ws-demo__controls button:hover,
	.ws-demo__controls button[aria-pressed='true'] {
		border-color: var(--color-primary);
		color: white;
	}

	.ws-demo__controls button:focus-visible {
		outline: 2px solid var(--color-primary);
		outline-offset: 2px;
	}

	@keyframes pop {
		from {
			opacity: 0;
			transform: scale(0.96);
		}
	}

	@keyframes rise {
		from {
			opacity: 0;
			transform: translateY(8px);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.win--float,
		.kickoff,
		.toast,
		.queue__job {
			animation: none;
		}
	}
</style>
