// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}

	// Matomo analytics + Meta Pixel (consent-gated)
	interface Window {
		_paq: Array<Array<string | number>>;
		fbq?: (...args: unknown[]) => void;
		_fbq?: unknown;
	}
}

export {};
