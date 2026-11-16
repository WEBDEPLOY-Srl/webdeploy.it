<script lang="ts">
	import { t, locale } from '#lib/i18n/index.ts';
</script>

<button
	class="language-switcher header-control"
	onclick={() => locale.toggle()}
	aria-label={t('nav.switchLanguage')}
>
	<span>{locale.current.toUpperCase()}</span>
</button>
