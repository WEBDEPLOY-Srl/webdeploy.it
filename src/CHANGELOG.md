# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
