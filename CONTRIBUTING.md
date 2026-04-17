# Contributing to webdeploy.it

Thanks for your interest in contributing. This repository contains the source
code for the [webdeploy.it](https://webdeploy.it) company website.

## Ground rules

- Be respectful. See [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md).
- By contributing, you agree that your contributions will be licensed under the
  same license as the project — the GNU Affero General Public License v3.0
  ([LICENSE.md](./LICENSE.md)).

## Getting started

1. Fork the repository.
2. Clone your fork and install dependencies:

   ```sh
   cd src
   npm install
   ```

3. Start the dev server:

   ```sh
   npm run dev
   ```

## Making changes

- Work on a topic branch off of `main` (for example, `fix/contact-form-focus`
  or `feat/news-rss`).
- Keep changes focused. One logical change per pull request is easier to review
  and merge.
- Run type checks before pushing:

   ```sh
   cd src
   npm run check
   ```

- Bump the version in `src/package.json` and add a note to `src/CHANGELOG.md`
  following [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) and
  [Semantic Versioning](https://semver.org/).

## Commit messages

Use a conventional prefix that describes the change:

- `feat:` — new feature
- `fix:` — bug fix
- `refactor:` — non-behavioural code change
- `docs:` — documentation only
- `perf:` — performance improvement
- `chore:` — build, CI, tooling, or housekeeping

Keep the subject line concise (under ~72 characters) and write the commit body
to explain the *why* rather than the *what*.

## Opening a pull request

1. Push your branch to your fork.
2. Open a pull request against `main`.
3. Describe what you changed and why. Link any related issue.
4. A maintainer will review and may request changes.

## Reporting bugs or requesting features

Please open an issue using the templates provided in `.github/ISSUE_TEMPLATE/`.
Include reproduction steps, expected behaviour, and actual behaviour for bugs.
