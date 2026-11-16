import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import svelte from 'eslint-plugin-svelte';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import ts from 'typescript-eslint';
import { loadConfig } from '@sveltejs/load-config';

const svelteConfig = (await loadConfig('./', { traverse: false }))?.config;

export default defineConfig(
	globalIgnores(['build/', '.svelte-kit/', 'node_modules/', 'test-results/', 'playwright-report/']),
	js.configs.recommended,
	ts.configs.recommended,
	svelte.configs.recommended,
	prettier,
	svelte.configs.prettier,
	{
		languageOptions: { globals: { ...globals.browser, ...globals.node } },
		rules: {
			// TypeScript already reports undefined identifiers, and the rule
			// does not know SvelteKit's ambient types.
			'no-undef': 'off',
			// `{#each Array(n) as _}` and `(_, i)` mark a deliberately unused binding.
			'@typescript-eslint/no-unused-vars': [
				'error',
				{ argsIgnorePattern: '^_', varsIgnorePattern: '^_' }
			],
			// The site is served from the domain root with no base path, so plain
			// hrefs are correct and resolve() would only add noise.
			'svelte/no-navigation-without-resolve': 'off',
			// Every {#each} renders a static translated or constant list that is
			// never reordered, so keys would add nothing.
			'svelte/require-each-key': 'off'
		}
	},
	{
		files: ['**/*.svelte', '**/*.svelte.ts', '**/*.svelte.js'],
		languageOptions: {
			parserOptions: {
				projectService: true,
				extraFileExtensions: ['.svelte'],
				parser: ts.parser,
				svelteConfig
			}
		}
	}
);
