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

- **Translations.** Every visible string lives in `src/src/lib/i18n/en.ts` and `it.ts`. A change to one
  file is made to the other in the same commit; both must hold the same keys.
- **Design.** Let artwork and typography carry the design. No terminal or console window panels, no
  "01 / 02 / 03" stage numbering and similar decorative themes.
- **Accessibility and browsers.** Keyboard operation, visible focus and reduced-motion support are
  required. Changes are checked in Firefox and Chromium.
- **Blame.** `git config blame.ignoreRevsFile .git-blame-ignore-revs` hides the mechanical formatting commits from `git blame`.
- **Checks.** In `src/`, `npm run lint`, `npm run check`, `npm run test:unit` and, after `npm run build`, `npm run test:e2e` must pass without warnings.
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
