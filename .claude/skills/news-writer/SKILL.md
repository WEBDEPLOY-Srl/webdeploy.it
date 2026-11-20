---
name: news-writer
description: Write English-only technology news posts for WebDeploy, with a matching newsletter campaign source when the post is published.
---

Write accurate, useful English news for WebDeploy about open source, Linux, infrastructure, security, software and technology. News articles and newsletter sources are English only. Do not create Italian article routes or Italian newsletter sources.

## Project context

WebDeploy is an open source infrastructure company. Its values include open source advocacy, developer experience, privacy and transparency. Matomo is cookieless and self-hosted; the Meta Pixel loads only after a visitor accepts marketing cookies. Never claim that the site has no tracking.

The website uses HTML templates, native CSS and JSDoc-typed browser modules. The dictionaries are `src/content/en.mjs` and `src/content/it.mjs`. For every new news key, put the English value in `en.mjs` and its natural Italian translation in `it.mjs`; keep keys and structure identical. The article page, newsletter source and campaign remain English only. Do not revive or translate archived Italian posts; the owner decides how archived Italian content is handled.

## Writing

- Use clear, professional English for technical readers.
- Explain the practical effect before implementation detail.
- Support factual claims with primary sources and link to them.
- State limitations and uncertainty plainly.
- Avoid prices, scarcity, and unsupported compliance claims.
- Give each article a specific title, a one or two sentence description, an introduction, useful section headings, and a concrete closing.

## Site implementation

1. Confirm the topic, intended readers, evidence, and useful next step.
2. Add English text to `src/content/en.mjs` and the corresponding natural Italian strings to
   `src/content/it.mjs`. Keep key structure and list lengths identical. Publish only the English article.
3. Create `src/pages/news/<slug>.html` with the existing semantic article pattern, including the
   accessible return link, featured image dimensions and alt text, `{{>share}}` and `{{>newsletter-band}}`.
   Add the source SPDX comment at the top. Reference text through escaped `{{news.<key>}}` lookups.
4. Add an article record in `src/data/pages.mjs` with the clean path, template, title and description
   keys, publication date, stable social image, share module, newsletter band CSS and card data
   (date key, description key, image, width and height). An optional `sources` field supplies responsive AVIF card thumbnails. The build emits the news index card,
   sitemap entry, canonical/OG/Twitter tags and NewsArticle structured data from that record.
5. Build from `src/` with `node build.mjs`. Verify the index, full article and share links in Firefox
   and Chromium. Keep both dictionaries in sync and check the matching email source below.

## Newsletter campaign source

Every news post must have a matching English campaign source in the smm repository at `newsletter/posts/<yyyy-mm-dd>-<slug>.md`. Use Markdown front matter followed by an HTML body. Front matter fields:

- `subject`
- `preheader`
- `content_id`
- `target_list: general`
- `post_url`: the article's `https://webdeploy.it/news/<slug>` URL

The post's HTML body must stand on its own and contain `{{ post_url }}` exactly once. The draft script replaces that placeholder with the post URL and its `mtm_` campaign parameters.

Marketing sources use `newsletter/marketing/<yyyy-mm-dd>-<slug>.md`, the same front matter and HTML-body format, `target_list: marketing`, and no `post_url`.

The owner reviews the article and campaign source. First run `node newsletter/push-campaign-draft.mjs --dry-run newsletter/posts/<yyyy-mm-dd>-<slug>.md`. After the site release is live and the draft is approved, run the script with `--base-url http://127.0.0.1:<forwarded-port>` through WireGuard or the documented loopback SSH tunnel. The script checks a post URL once, creates or updates one Listmonk draft, and refuses to modify a campaign that is not a draft. Never send, schedule or start it: the owner sends a test, checks the list, messenger and From address, then starts the campaign. The draft script writes the campaign ID and status to `newsletter/ledger.csv`. Commit its ledger update.

## Final review

- Verify technical claims and links against primary sources.
- Check spelling, accessibility text, SEO metadata and mobile layout.
- Confirm both content dictionaries have matching keys and well-written Italian translations; keep article pages and newsletter sources English only.
- Confirm the email source matches the article and links to it once.
- Never send or start a campaign; only prepare the draft for owner review.
