---
name: news-writer
description: Write English-only technology news posts for WebDeploy, with a matching newsletter campaign source when the post is published.
---

Write accurate, useful English news for WebDeploy about open source, Linux, infrastructure, security, software and technology. News articles and newsletter sources are English only. Do not create Italian article routes or Italian newsletter sources.

## Project context

WebDeploy is an open source infrastructure company. Its values include open source advocacy, developer experience, privacy and transparency. Matomo is cookieless and self-hosted; the Meta Pixel loads only after a visitor accepts marketing cookies. Never claim that the site has no tracking.

The website uses SvelteKit, TypeScript and translation files at `src/src/lib/i18n/en.ts` and `src/src/lib/i18n/it.ts`. For every new news key, put the English value in `en.ts` and its natural Italian translation in `it.ts`; keep keys and structure identical. The article page, newsletter source and campaign remain English only. Do not revive or translate archived Italian posts; the owner decides how archived Italian content is handled.

## Writing

- Use clear, professional English for technical readers.
- Explain the practical effect before implementation detail.
- Support factual claims with primary sources and link to them.
- State limitations and uncertainty plainly.
- Avoid prices, scarcity, and unsupported compliance claims.
- Give each article a specific title, a one or two sentence description, an introduction, useful section headings, and a concrete closing.

## Site implementation

1. Confirm the topic, intended readers, evidence, and useful next step.
2. Add the post's English display strings to `src/src/lib/i18n/en.ts` and natural Italian translations of those strings to `src/src/lib/i18n/it.ts`, with matching keys and structure. Do not create an Italian article page.
3. Create `src/src/routes/news/<post-slug>/+page.svelte`. Follow the current article pattern and use `#lib` imports, for example:

   ```svelte
   <script lang="ts">
     import { t, tObj } from '#lib/i18n/index.ts';
     import Seo from '#lib/components/Seo.svelte';
     import ShareButtons from '#lib/components/ShareButtons.svelte';
   </script>
   ```

4. Set complete SEO metadata, including the title, description, image, article type and publication date.
5. Add a `NewsCard` to `src/src/routes/news/+page.svelte` and include the newsletter band at the end of the article.
6. Keep the i18n keys and shape in sync. Write the article in English only; `it.ts` contains Italian translations of its display strings for shape parity.

## Newsletter campaign source

Every news post must have a matching English campaign source in the smm repository at `newsletter/posts/<yyyy-mm-dd>-<slug>.md`. Use Markdown front matter followed by an HTML body. Front matter fields:

- `subject`
- `preheader`
- `content_id`
- `target_list: general`
- `post_url`: the article's `https://webdeploy.it/news/<slug>` URL

The post's HTML body must stand on its own and contain `{{ post_url }}` exactly once. The draft script replaces that placeholder with the post URL and its `mtm_` campaign parameters.

Marketing sources use `newsletter/marketing/<yyyy-mm-dd>-<slug>.md`, the same front matter and HTML-body format, `target_list: marketing`, and no `post_url`.

The owner reviews the article and campaign source. First run `node newsletter/push-campaign-draft.mjs --dry-run newsletter/posts/<yyyy-mm-dd>-<slug>.md`. After the site release is live and the draft is approved, run the script with `--base-url http://127.0.0.1:<forwarded-port>` through WireGuard or the documented loopback SSH tunnel. The script checks a post URL once, creates or updates one Listmonk draft, and refuses to modify a campaign that is not a draft. Never send, schedule or start it: the owner sends a test, checks the list, messenger and From address, then starts the campaign. Record the campaign ID and status in `newsletter/ledger.csv`.

## Final review

- Verify technical claims and links against primary sources.
- Check spelling, accessibility text, SEO metadata and mobile layout.
- Confirm both i18n files have matching keys and well-written Italian translations; keep article pages and newsletter sources English only.
- Confirm the email source matches the article and links to it once.
- Never send or start a campaign; only prepare the draft for owner review.
