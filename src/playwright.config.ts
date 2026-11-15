import { defineConfig, devices } from '@playwright/test';

const port = 4173;

export default defineConfig({
	testDir: 'e2e',
	// One worker keeps memory use low on small CI hosts and removes ordering effects.
	workers: 1,
	// A failing test must fail: a retry would hide flakiness instead of exposing it.
	retries: 0,
	fullyParallel: false,
	forbidOnly: !!process.env.CI,
	reporter: process.env.CI ? 'list' : [['list'], ['html', { open: 'never' }]],
	use: {
		baseURL: `http://127.0.0.1:${port}`,
		trace: 'retain-on-failure'
	},
	projects: [
		{ name: 'firefox', use: { ...devices['Desktop Firefox'] } },
		{
			name: 'chromium',
			// Containers give Chromium a 64 MB /dev/shm by default, which it outgrows.
			use: { ...devices['Desktop Chrome'], launchOptions: { args: ['--disable-dev-shm-usage'] } }
		}
	],
	// Serves the production build (`npm run build` first), as nginx does in the image.
	webServer: {
		command: `npm run preview -- --host 127.0.0.1 --port ${port} --strictPort`,
		url: `http://127.0.0.1:${port}/`,
		reuseExistingServer: !process.env.CI,
		timeout: 60_000
	}
});
