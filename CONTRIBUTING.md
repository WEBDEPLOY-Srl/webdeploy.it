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
- **Responsive media.** Keep the existing full-resolution file as a fallback. Generate and
  commit display-sized versions offline. The current AVIF, WebP and PNG derivatives were
  produced with ImageMagick 7.1.2-34. Crop the original workshop image to 760 × 941 at offset (711, 0),
  then resize it to 660 × 817 for the shipped portrait. Its AVIF and WebP versions
  both include a 60% sRGB veil of `#050a10`, paired with the portrait gradient in `base/layout.css`.
  Rebuild both formats together to retain the same appearance. The homepage embeds the small
  AVIF portrait in its initial HTML so mobile visitors can paint the real artwork without a
  separate request. Wide and fallback variants use their immutable URLs. Run
  `scripts/news-card-images.sh` from the repository root to regenerate the 16:9 news crops with
  ImageMagick 7 and avifenc 1.4. The script reads the shipped article masters, preserves the
  centre of each image and produces AVIF plus WebP for the illustration or JPEG for the photograph.
  The optional news-card `sources` field accepts a width-described AVIF srcset of 16:9 crops.
  The `fallback` field supplies the alternate MIME type and srcset.
  The news grid and its preload share the same slot sizes, including padding, gap and borders.
  For high-density displays, the largest crop uses the master’s native width of 1122 pixels
  for the illustration or 1200 pixels for the photograph. Keep the AVIF and fallback
  candidates at the same widths when adding an article.
  Responsive image preloads use `imagesrcset` and
  `imagesizes` without a fixed `href`. Safari 16.4–17.1 can then fetch the image selected by
  `<picture>` once. Safari 17.2 added responsive preload support. Check the result on desktop
  and phone layouts. The icon font subset contains the codepoints mapped in `base/fonts.css`.
  [WebKit release notes](https://webkit.org/blog/14787/webkit-features-in-safari-17-2/)
- **First paint.** The home route's `firstStylesheet` uses the same reset, shell and hero
  sources as the complete page. Consent initializes immediately. The complete stylesheet
  and optional modules start after a rendering opportunity, on early input or on the bounded
  fallback. Script-free visitors receive the complete native stylesheet. The static workstation
  preview is a transparent render of the original screen layer at 1113 × 1414, scaled to 800px.
  The live screens mount on approach or input. The signup uses ALTCHA's instance `load` event
  to verify readiness after the form first approaches the viewport.
- **Tool marks.** The build writes a small content-hashed SVG for each mark. Native lazy images
  keep the original viewBox, attributable paths and cyan/magenta treatment without loading a
  site-wide sprite before the visible artwork. A visible text label names each link.
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

## Updating the CI builder image pin

The `build_frontend` step in `.woodpecker/.build.yml` uses the `webdeploy/alpine` image. Its builder
workflow publishes a dated tag in `YYYY-MM-DD-<CI_PIPELINE_NUMBER>` form for each build. Pin a dated
tag, never `latest`, and keep every tag referenced by a pin in the Forgejo cleanup rule.

After the builder workflow succeeds, inspect the dated tag and copy its manifest digest:

```sh
docker buildx imagetools inspect \
  git.webdeploy.it/webdeploy/alpine:<dated-tag>
```

Update the `build_frontend` image in `.woodpecker/.build.yml` to
`git.webdeploy.it/webdeploy/alpine:<dated-tag>@sha256:<digest>`. Keep both the dated tag and digest;
verify the tag exists and is retained by the Forgejo package cleanup rule before committing the pin.

## Licence

The code is licensed under the GNU Affero General Public License v3.0 only. The WEBDEPLOY and inWD names
and logos, photographs, customer imagery and written content are © WEBDEPLOY S.R.L., all rights reserved.
See the licence section of the [README](./README.md#license).

## Lighthouse production gate

Run the manual release gate against the production nginx image on loopback as described in
the README. Lighthouse uses Chromium. The Firefox and Chromium interaction tests remain a
separate gate. The ordinary measurement starts with undecided consent and fetches the same
resources as a first-time visitor, including cookieless Matomo and map tiles when needed.

The release command performs two independent matrices and writes both expectation-aware and
strict results for each. This is a manual release check on the production image. The per-push
Woodpecker pipeline continues to verify building, licensing, types, dependencies and real browsers.

The CLI is pinned to Lighthouse 13.6.0 in an external npm project. Its `package.json` and
`package-lock.json` are stored in `~/work/webdeploy-oss/lighthouse/runner/`. Install it with
`npm ci --prefix "$HOME/work/webdeploy-oss/lighthouse/runner" --ignore-scripts`. For a new
workstation, copy those two records from the verified runner first. The archived runner lock
has SHA-256 `6a0c4d525a5b555e08ea814a10413f0de3aa962178faf913b9f595bdd61fd67b`. The website's
npm lock remains independent.

Use Chrome for Testing 157.0.8103.78, the full-browser revision declared by the runner's
locked Puppeteer 25.18.1. The initial Playwright Chromium 159.0.8154.6 pairing intermittently
omitted the navigation trace; those unscorable reports are preserved. Install the exact
browser into the same external evidence directory. The measured Linux binary has SHA-256
`f60cb86024464df9740504a1584b605c2b3cf107625ff11e1da22c875c1627e8`:

```sh
quality_dir="$HOME/work/webdeploy-oss/lighthouse"
node "$quality_dir/runner/node_modules/@puppeteer/browsers/lib/main-cli.js" install \
  chrome@157.0.8103.78 --platform linux --path "$quality_dir/chrome-for-testing"
```

From the repository root, with the candidate already served at `http://127.0.0.1:18080`, run:

```sh
quality_dir="$HOME/work/webdeploy-oss/lighthouse"
quality_image="mcr.microsoft.com/playwright:v1.65.1-noble@sha256:1507cbfc550a63a6b7396791ca4f00df17beb56342d2447b3f106c306f525579"
docker run --rm --network=host --cap-drop=ALL --security-opt=no-new-privileges \
  --user "$(id -u):$(id -g)" --shm-size=1g \
  --mount "type=bind,source=$PWD/src,target=/repo/src,readonly" \
  --mount "type=bind,source=$quality_dir,target=/reports" \
  --mount "type=bind,source=$quality_dir/runner,target=/reports/runner,readonly" \
  --mount "type=bind,source=$quality_dir/chrome-for-testing,target=/reports/chrome-for-testing,readonly" \
  --workdir /repo/src -e LIGHTHOUSE_CONTAINER=1 \
  -e QUALITY_BROWSER_IMAGE="$quality_image" \
  -e CHROME_PATH=/reports/chrome-for-testing/chrome/linux-157.0.8103.78/chrome-linux64/chrome \
  "$quality_image" node scripts/lighthouse.mjs --gate --runs=2 \
    --base-url http://127.0.0.1:18080 --output /reports --runner /reports/runner \
    --commit "$(git rev-parse HEAD)"
```

The pair shares a bounded quiet-wait budget of four hours (14,400 seconds). It first requires
one minute with load below 3 and CPU idle above 70%. Before **each attempt** it requires 20
continuous seconds with the same limits. Linux idle ticks exclude I/O wait. Five-second samples
are saved. If the budget expires the gate fails and reports which measurements are unavailable.

Every attempt starts a new Chromium profile. A Lighthouse runtime error such as `NO_NAVSTART`,
an unreadable report or another unscorable navigation can have two retries. A benchmark index
below 1000 marks an attempt **host-degraded**. The approved measurement policy grants exactly
one quiet remeasurement based on that benchmark alone, including when the original score is 100.
Both attempts stay in the ledger. A second degraded measurement fails the cell. The first qualified numerical
result is final, including scores below 100. The ordinary 404 navigation's expected
`ERRORED_DOCUMENT_REQUEST` is retained as evidence before the scored 404 collection.

Each run contains `attempts.md` and per-attempt raw JSON, logs, quiet intervals, host load,
idle percentage and benchmark index under `attempts/{mobile,desktop}/<page>/`. The canonical
`mobile/` and `desktop/` reports link to the selected attempt. For a failed cell the ledger
identifies the unusable attempt. Each accepted report has a corresponding `conditions/` record.
The two-run receipt is under `releases/<start-time>/release.json`.

The driver checks the served sitemap against the route inventory, verifies the index policy
and HTTP status of every target, and generates a cold mobile and desktop report for each of
the 15 page designs. It starts a fresh Chromium process for every measurement and keeps default
network/CPU throttling. The real 404 additionally gets an ordinary navigation report before
the supplementary `--ignore-status-code` run gathers the remaining categories on that same
error response. The release gate requires both full matrices to pass. For an uncommitted
image, pass `--working-tree` with its full `QUALITY_IMAGE_ID`. Diagnostic results are then grouped
by image under `working-tree/`; the recorded Git revision is the base of that work.

Read the raw LHR files under `<commit>/<run-id>/{mobile,desktop}/` and the adjacent manifest and
gate table. `src/scripts/lighthouse-expectations.json` lists the noindex and HTTP 404 SEO
expectations. The 404 may also produce one network console entry with the exact message and URL
of the missing main document. Every other console error fails.

Each non-404 report must contain exactly one script request for `https://analytics.inwd.org/matomo.js`,
a successful response to that request, and at least one successful collection at the configured
`matomo.php` endpoint. These requirements also apply to a page with four raw 100s.

On 2026-11-20 the owner accepted an exact raw **mobile** Performance 99 when the sole failing weighted
audit is `total-blocking-time` and the tracker at
`https://analytics.inwd.org/matomo.js` accounts for a majority of total blocking time (TBT).
The category scores and established exceptions for other categories are evaluated independently.
The original two production matrices contained four such mobile cells on the confirmation,
privacy, security and backup pages. All four lost points solely on TBT.

For each 99 the gate checks successful script and collection requests, positive tracker CPU
in both `bootup-time` and `third-parties-insight`, and the complete `long-tasks` debug ledger.
It clips each task to the first-contentful-paint to interactive interval and counts time above
50 ms. The sum must reproduce the raw TBT within 1 ms. Unknown scripts and unattributed tasks
count towards the denominator. The credited share must exceed half of both the reconstructed
and reported totals. A failing LCP still fails the gate outside the `/news` mobile exception below.
Desktop Performance below 100 always fails.

On 2026-11-22 the owner accepted the q80 lead-card image quality and its larger mobile transfer. Only
`/news` mobile Performance may use a minimum raw score of 97, and only when every failing weighted
performance audit is `largest-contentful-paint` and/or `total-blocking-time`. Missing or non-numeric
audits, any other failing audit, other categories, routes, or presets still fail. `--strict` still
requires raw 100. The applied exception appears in the gate table and stdout.
The second owner decision on 2026-11-22 lowered the original 98 minimum to 97.

The hosted script receives direct credit. The owner explicitly retained partial credit for
Matomo's own synchronous `trackPageView` when it runs inside the first-party adapter. A profiled
same-origin build path can receive that credit only when its script and scripting CPU appear
in the same report and its task immediately follows the tracker's task (within 0.2 ms of the
rounded boundary). In a separate fourfold-CPU profile, the synchronous `trackPageView` call
took 33.3 ms and all other measured calls took 1.9 ms. The gate credits at most half the
adapter's blocking, capped at the directly attributed tracker time. The external evidence root
contains the profiles referenced in the expectation and a per-cell breakdown in `gate.json`.

**Release step.** Re-profile the Matomo adapter whenever its build ID changes. On the production
nginx image, use a fresh, passive Chromium visit to `/newsletter/confirmed` with fourfold CPU
throttling. Time the live tracker's individual queue commands and verify successful collection.
Record the exact adapter URL, command timings and response status in the external evidence
directory. Add the verified path and its receipt to `profiledCallers` if the profile supports
the existing credit. Retain earlier entries for archived runs. The gate reports an unprofiled
build ID and counts only direct tracker blocking until that evidence exists.

`profiledCallers` matches the exact `/assets/build/<id>/js/matomo.mjs` URL. The ID hashes the shared
JavaScript and CSS asset set, not only `matomo.mjs`; a CSS change can invalidate a caller profile
even when the adapter source hash is unchanged. Version 2.0.2 retained profiles for its recorded
build IDs and used direct tracker credit only for any new ID until re-profiling.

`--strict` requires all four raw 100s on every page. Both modes exit nonzero on uncovered
failures. To apply either mode to existing reports without launching a browser, pass `--read-run`.

```sh
node src/scripts/lighthouse.mjs --strict --read-run "$quality_dir/<commit>/<run-id>"
```
