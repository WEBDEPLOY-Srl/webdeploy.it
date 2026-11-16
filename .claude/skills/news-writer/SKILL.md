---
name: news-writer
description: Write English-only technology news posts for WebDeploy, with a matching newsletter campaign source when the post is published.
---

Write accurate, useful English news for WebDeploy about open source, Linux, infrastructure, security, software and technology. The site currently serves English only. Do not create Italian article translations or Italian i18n strings.

## Project context

WebDeploy is an open source infrastructure company. Its values include open source advocacy, developer experience, privacy and transparency. Matomo is cookieless and self-hosted; the Meta Pixel loads only after a visitor accepts marketing cookies. Never claim that the site has no tracking.

The website uses SvelteKit, TypeScript and translation files at `src/src/lib/i18n/en.ts` and `src/src/lib/i18n/it.ts`. Add public-facing news copy to both files with the same keys: English in `en.ts`, accurate Italian in `it.ts`. The article itself is English only.

## Writing

- Use clear, professional English for technical readers.
- Explain the practical effect before implementation detail.
- Support factual claims with primary sources and link to them.
- State limitations and uncertainty plainly.
- Avoid prices, scarcity, and unsupported compliance claims.
- Give each article a specific title, a one or two sentence description, an introduction, useful section headings, and a concrete closing.

## Site implementation

1. Confirm the topic, intended readers, evidence, and useful next step.
2. Add the post's English and Italian display strings to `src/src/lib/i18n/en.ts` and `src/src/lib/i18n/it.ts` with matching structure.
3. Create `src/src/routes/news/[post-slug]/+page.svelte`. Follow the current article pattern and use `#lib` imports, for example:

   ```svelte
   <script lang="ts">
     import { t, tObj } from '#lib/i18n/index.ts';
     import Seo from '#lib/components/Seo.svelte';
     import ShareButtons from '#lib/components/ShareButtons.svelte';
   </script>
   ```

4. Set complete SEO metadata, including the title, description, image, article type and publication date.
5. Add a `NewsCard` to `src/src/routes/news/+page.svelte` and include the newsletter band at the end of the article.
6. Keep visible English and Italian strings in sync by key. Write the English article in English only.

## Newsletter campaign source

Every news post must have a matching English source file for the general newsletter in the smm repository at `newsletter/posts/<content-id>.md`. Include these fields:

- `subject`
- `preheader`
- `content_id`
- `post_url`
- `target_list`: `WEBDEPLOY news and notices`
- a short email body that stands on its own and links once to the published article

Marketing campaigns use the same source format and process with `target_list: WEBDEPLOY services and offers`; they do not link to a site post unless one is relevant.

The owner reviews the article and email source. After the site release is live, the agent runs `newsletter/push-campaign-draft.mjs` from the smm repository to create or update the Listmonk campaign draft. The script must verify the post URL and refuse to modify a campaign that is not a draft. Do not send the campaign: the owner sends a test, checks the list, messenger and From address, then starts it in Listmonk. Record the campaign ID and status in the newsletter ledger.

## Final review

- Verify technical claims and links against primary sources.
- Check spelling, accessibility text, SEO metadata and mobile layout.
- Confirm both i18n files have matching keys and well-written translations.
- Confirm the email source matches the article and links to it once.
- Never send or start a campaign; only prepare the draft for owner review.
