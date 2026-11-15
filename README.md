# webdeploy.it

Source code of [webdeploy.it](https://webdeploy.it), the website of WEBDEPLOY S.R.L.: a static
site about open source infrastructure, Linux workstations, backup and the inWD kiosk.

![The webdeploy.it home page](./docs/screenshot.webp)

Built with [SvelteKit](https://svelte.dev/docs/kit) (static adapter), [Svelte 5](https://svelte.dev),
[Tailwind CSS 4](https://tailwindcss.com) and [Leaflet](https://leafletjs.com) with OpenStreetMap tiles.
SvelteKit and Tailwind were chosen largely because their documentation is clear and consistent, which
also makes them easy to work with in an AI-assisted workflow.

## Repository and contributions

- The canonical repository is private, on WEBDEPLOY's own Forgejo instance. This GitHub repository,
  <https://github.com/WEBDEPLOY-Srl/webdeploy.it>, is a read-only mirror of it.
- **Contributions are accepted as issues only.** Pull requests are not accepted: changes made on the
  mirror would diverge from the canonical repository. Report bugs and suggest improvements through
  [GitHub issues](https://github.com/WEBDEPLOY-Srl/webdeploy.it/issues); see
  [CONTRIBUTING.md](./CONTRIBUTING.md).
- Security problems are not reported in public issues, see [Security](#security).

## Requirements

- Node.js 24 or newer (`.nvmrc` pins 26, the current LTS) and npm.
- Docker, only to build the container image.

## Quick start

```sh
git clone https://github.com/WEBDEPLOY-Srl/webdeploy.it.git
cd webdeploy.it/src
npm ci
npm run dev
```

The dev server listens on <http://localhost:5173>.

## Scripts

Run from `src/`:

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Build the static site into `src/build/` |
| `npm run preview` | Serve the production build locally |
| `npm run check` | Type check and Svelte diagnostics (`svelte-check`) |
| `npm run lint` | Prettier format check and ESLint |
| `npm run format` | Rewrite files with Prettier |

To build and run the production image (nginx serving the static build) on <http://localhost:8080>, run from the repository root, not `src/`:

```sh
docker build -t webdeploy.it .
docker run --rm -p 127.0.0.1:8080:80 webdeploy.it
```

## Structure

```
.
├── src/                  The npm project (package.json, lockfile, SvelteKit config)
│   ├── src/              SvelteKit source: routes/, lib/ (components, i18n, stores, utils), app.css
│   └── static/           Files served as they are: fonts, images, robots.txt, security.txt
├── Dockerfile            Multi-stage build: Node builds the site, nginx serves it
├── nginx.conf            nginx configuration used by the image
├── docker-compose.*.yml  Compose files for the CI build and for running the image by hand
├── .woodpecker/          CI pipeline
├── CHANGELOG.md          Release notes (Keep a Changelog)
└── REUSE.toml, LICENSES/ Per-file licensing
```

`src/src` looks odd but is deliberate: the repository root carries the container, CI and policy files,
the `src/` directory is the npm project, and SvelteKit keeps its own sources in a `src/` directory
inside it.

## Translations

All visible text lives in `src/src/lib/i18n/en.ts` and `src/src/lib/i18n/it.ts` and is read with
`t('some.key')`. Both files must contain exactly the same keys. The site currently serves English only
(`availableLocales` in `src/src/lib/stores/locale.svelte.ts`); the Italian file is kept up to date so
the language can come back by adding `'it'` to that list.

## Deployment

CI builds the container image on `main` and pushes it to a private registry; the production host pulls
that image and runs it behind a TLS-terminating reverse proxy. The image is a static nginx container, so
it can run anywhere. `docker-compose.prod.yml` shows how to run it by hand.

## Security

Report vulnerabilities privately to <security@webdeploy.it>, see [SECURITY.md](./SECURITY.md) and
<https://webdeploy.it/security>.

## License

The source code is licensed under the [GNU Affero General Public License v3.0 only](./LICENSE.md)
(`AGPL-3.0-only`).

The WEBDEPLOY and inWD names and logos, photographs, customer imagery and the written content of the
website are © WEBDEPLOY S.R.L., all rights reserved. They are not covered by the AGPL. If you fork this
repository, replace them with your own.

Third-party material (fonts, icons, logos and libraries) keeps its own licence; see
[THIRD-PARTY-NOTICES.md](./THIRD-PARTY-NOTICES.md). Licensing is declared per file in
[REUSE.toml](./REUSE.toml) and can be checked with `reuse lint`.

Copies of this repository obtained under the earlier blanket AGPL-3.0 statement keep the grant they were
received under.

See also the [Code of Conduct](./CODE_OF_CONDUCT.md).
