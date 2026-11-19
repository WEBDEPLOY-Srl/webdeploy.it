# Contributing to webdeploy.it

Thanks for your interest in the [webdeploy.it](https://webdeploy.it) website.

## Issues only

This project accepts **issues, not pull requests**. The canonical repository is private and the GitHub
repository is a read-only mirror, so a pull request opened there cannot be merged and will be closed.
The maintainers apply changes themselves; the mirror then shows the result.

Please be respectful, see [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md).

## Reporting a bug

Open an [issue](https://github.com/WEBDEPLOY-Srl/webdeploy.it/issues/new/choose) with the bug report
template. Include the page URL, what you did, what you expected, what happened, and your browser,
operating system and device. Screenshots and console output help.

## Suggesting an improvement

Open an issue with the feature request template: what problem it solves and what you would like to see.
Suggestions about wording, translations, accessibility and performance are welcome.

## Security problems

Do not open a public issue. Write to <security@webdeploy.it>, see [SECURITY.md](./SECURITY.md).

## Conventions used by the maintainers

You do not need to follow these to report an issue. They are documented so that the project is
transparent and so that forks can keep to the same style.

- **Content.** Put page markup in `src/pages/`; share components through `src/partials/`.
  Register each route once in `src/data/pages.mjs` with its title and description keys.
  Article records also supply the dated card, canonical image and NewsArticle metadata.
  Use the dictionary lookup `{{key.path}}`, the include `{{>partial-name}}`, or a documented
  build-owned slot. Content values are HTML-escaped by default. Add matching English and
  natural Italian values to `src/content/en.mjs` and `it.mjs` in the same change.
- **Design and compatibility.** Preserve artwork, typography, keyboard access, visible focus
  and reduced motion. Use flat CSS for the stated browser baseline. Page modules use explicit,
  relative native imports and `new URL(..., import.meta.url)` for local workers.
- **Social previews.** Use a stable 1200 × 630 JPEG in `src/static/images/og/` for a new
  page’s Open Graph and Twitter image. Keep the full image inside that frame if cropping
  would remove the subject. LinkedIn recommends a landscape image at this size, and Meta
  accepts JPEG for custom link images. In-page images retain their own responsive formats.
  [LinkedIn sharing guidelines](https://www.linkedin.com/help/linkedin/answer/a1322434) ·
  [Meta link images](https://developers.facebook.com/docs/graph-api/reference/page/feed/)
- **JSDoc.** Start every authored JavaScript file with `// @ts-check` and SPDX attribution.
  Document exported function parameters and return types with `@param` and `@returns`.
  Use `@typedef`, `@type` and the shared `src/types.d.ts` for contracts. Narrow DOM elements
  with their actual interfaces before calling element-specific methods. Strict
  `tsc --noEmit -p jsconfig.json` covers browser code, build scripts, preview and test helpers.
  The additional `jsconfig.browser.json` pass checks browser modules against DOM and ECMAScript globals alone.
  Published vendor bytes are verified by checksum and carry their upstream licences.
- **Checks.** In `src/`, run `npm ci --include=dev`, `npm run check`, `npm run test:unit`,
  `node build.mjs` and `npm audit --audit-level=high`. The build checks internal links,
  media, fragments, page metadata, inline executable markup and vendor integrity.
  Run the [production nginx image](./README.md#build-and-preview), then
  `E2E_BASE_URL=http://127.0.0.1:18080 npm run test:e2e`. The suite runs both configured
  browsers, including the response-header and real 404 specs. For debugging on loopback,
  `sessionStorage.setItem('wd_debug', '1')` enables the development logger.
- **Migration screenshots.** The immutable 1.x captures are in
  `~/work/webdeploy-oss/parity/reference/`. For a 2.x candidate, start its production nginx
  on loopback and run `PARITY_RUN=candidate E2E_BASE_URL=http://127.0.0.1:18080 npm run test:parity`
  from `src/` in the pinned Playwright environment. The default `PARITY_DIR` is
  `~/work/webdeploy-oss/parity/current`, which points to the documented current reference set.
  To record an intentional design change, capture into a fresh `PARITY_DIR` with
  `--update-snapshots=all`. Review every affected image against the prior baseline, preserve
  unrelated images, record the reason and rerun the complete comparison without updating snapshots.
- **Blame.** `git config blame.ignoreRevsFile .git-blame-ignore-revs` hides the historical
  mechanical formatting commits.

- **Commits.** [Conventional Commits](https://www.conventionalcommits.org/): `feat:`, `fix:`, `docs:`,
  `chore:`, `refactor:`, `test:`, `perf:`, `ci:` or `build:`, an imperative lowercase subject of at most
  72 characters with no trailing period.
- **Changelog.** User-visible changes are recorded in [CHANGELOG.md](./CHANGELOG.md) under
  `## [Unreleased]`, following [Keep a Changelog](https://keepachangelog.com/en/1.0.0/). A release moves
  them under a new version heading and bumps `version` in `src/package.json`, following
  [Semantic Versioning](https://semver.org/).

## Licence

The code is licensed under the GNU Affero General Public License v3.0 only. The WEBDEPLOY and inWD names
and logos, photographs, customer imagery and written content are © WEBDEPLOY S.R.L., all rights reserved.
See the licence section of the [README](./README.md#license).
