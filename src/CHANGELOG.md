# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.22.3] - 2026-08-20

### Changed
- The site now runs on **gp-wd** (157.180.17.117) instead of the `webdeploy`
  host. Nothing about the application changed: the same image, the same nginx
  config, the same 106 files under `/usr/share/nginx/html`, verified
  byte-identical on both hosts before the DNS record moved. The deployment is
  rendered by `webdeploy/monitor` from now on, so `docker-compose.prod.yml` is
  no longer what runs in production.
- CI **builds once and tags twice.** `docker-compose.build.yml` declared a
  second `version_tag` service that `extends: frontend` and differed only in
  its image tag; compose treats that as two builds of the same context, so
  `:latest` and `:<version>` were separate images with no guarantee of being
  the same bytes. The pipeline now builds `:<version>` and applies `:latest`
  with `docker tag`, which makes the version tag actually name what is running.
- Manual pipeline runs are pinned to `main`. Woodpecker's `manual` event
  carries no branch restriction of its own, so a hand-triggered build from any
  branch would have pushed that branch to `:latest` — the tag the live host
  pulls.

## [1.22.2] - 2026-08-13

### Fixed
- Header submenus were unreachable with the pointer: the 8px gap between a
  nav trigger and its submenu belonged to no element inside
  `.dropdown-container`, so crossing it fired the container's `mouseleave` and
  dismissed the menu before the cursor arrived. A transparent bridge
  (`.dropdown-menu::before`) now spans that gap, plus a 150ms grace period
  before closing.
- Keyboard access to the same submenus: `ArrowDown` on a trigger looked for the
  menu *inside* the button, so it never focused anything. It now opens the
  submenu and moves focus to the first item; `Escape` returns focus to the
  trigger, and moving focus out of a dropdown closes it.
- Tapping a nav trigger on a touch device at `lg` width did nothing — the
  tap's compatibility hover event opened the submenu and the click that
  followed toggled it straight back shut. Hover now opens only for non-touch
  pointers, and a press outside closes an open submenu.

## [1.22.1] - 2026-07-15

### Changed
- Early-access page copy: retire the campaign slogan in favour of the
  site-wide "developing greatness" tagline, describe the subtitle as
  audit-ready evidence, and update the guide's reading-time claim
  (25 minutes, page count dropped). Refresh the served gap-analysis PDF
  to the current edition (supplier playbook, board one-pager, coverage
  table, same brand line).

## [1.22.0] - 2026-07-15

### Added
- Serve the NIS2/CRA gap-analysis guide (PDF, Italian) at
  `/uploads/nis2-cra-gap-analysis.pdf` — the document delivered to
  early-access subscribers after double opt-in.

## [1.21.1] - 2026-07-13

### Fixed
- Meta pixel pointed at the wrong id (an app id) instead of the web dataset id,
  so browser events never landed ("event never received"). Point `metaPixel.ts`
  at the correct web dataset id.

## [1.21.0] - 2026-07-13

### Added
- Consent-gated Meta (Facebook/Instagram) pixel for the ad campaigns: a
  `CookieConsent` banner (IT/EN) gates all marketing scripts behind explicit
  opt-in; the pixel (`metaPixel.ts`) loads only after consent and fires
  `PageView`, `ViewContent` on `/early-access`, and `Lead` on form submit.
  Consent is persisted in `localStorage` (`consent.svelte` store). Matomo stays
  cookieless and always-on. Added a Marketing section to the Privacy page
  disclosing the pixel.

## [1.20.1] - 2026-07-13

### Changed
- The early-access Google Ads conversion now fires on form submit (on
  `/early-access`, where the gclid is freshest) instead of on
  `/early-access/confermato`: the confirmation redirect isn't controllable, so
  submit is the conversion signal. `/confermato` keeps the confirmed-signup
  analytics goal. Still gated/no-op until the Google Ads tag is set.

## [1.20.0] - 2026-07-11

### Added
- Early-access funnel for the NIS2/CRA campaign: `/early-access` landing page
  with `EarlyAccessForm` (email, name, company, role, GDPR consent, honeypot,
  UTM capture) that POSTs to a lead-capture webhook, and a
  `/early-access/confermato` thank-you page that fires the confirmed-signup
  analytics goal and the Google Ads conversion (gated, inert until the tag is
  configured).
- Data Processing Agreement (DPA) section on the Privacy page (`/privacy#dpa`),
  linked from the early-access consent copy. English and Italian.

## [1.19.1] - 2026-06-12

### Fixed
- Moving dots in the header illustrations (data packets and orbiting
  satellites) could drift off their guide lines in some browsers; they now
  use SMIL `animateMotion`, which follows path geometry exactly. Dots park on
  their lines when animations are unavailable and are hidden under
  `prefers-reduced-motion`.

## [1.19.0] - 2026-06-12

### Changed
- Redesigned the four page-header illustrations (`webdeploy-logo.svg`,
  `inwd-kiosk.svg`, `inwd-infra.svg`, `news-impeccable.svg`): richer scenes,
  layered neon glows, CRT vignette and scanlines, and retro hard offset
  shadows matching the site's design language.
- Replaced SMIL animations with CSS animations that honor
  `prefers-reduced-motion`, with a fully-rendered static fallback.
- Added accessibility metadata (`role="img"`, `<title>`, `<desc>`) and
  per-file namespaced ids to every header illustration.

### Fixed
- Geometry issues in the header illustrations: connection lines now terminate
  on their target nodes, the infrastructure diagram no longer routes a link
  through a server rack, and the logo terminal fits inside its hexagonal
  frame.

## [1.18.0] - 2026-04-17

### Added
- News post announcing the open-source release of webdeploy.it, available in
  English and Italian at `/news/open-source-release`, linked from the news
  index and referenced in the sitemap.

## [1.17.1] - 2026-04-17

### Added
- README notes explaining the tech-stack choices: SvelteKit and Tailwind CSS
  were picked for their LLM-friendly documentation; Leaflet was picked for its
  small footprint and first-class OpenStreetMap integration.

## [1.17.0] - 2026-04-17

### Added
- Public open-source release of the webdeploy.it website source code under the
  GNU Affero General Public License v3.0.
