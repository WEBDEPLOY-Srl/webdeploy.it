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

	/** The Meta Pixel queue function, as installed by the fbevents.js bootstrap. */
	interface MetaPixel {
		(...args: unknown[]): void;
		/** Set by fbevents.js once it has loaded; until then calls are queued. */
		callMethod?: (...args: unknown[]) => void;
		queue: unknown[][];
		push: MetaPixel;
		loaded: boolean;
		version: string;
	}

	// Matomo analytics + Meta Pixel (consent-gated)
	interface Window {
		_paq: Array<Array<string | number | boolean>>;
		fbq?: MetaPixel;
		_fbq?: MetaPixel;
	}
}

export {};
