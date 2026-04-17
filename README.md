# webdeploy.it

Source code for [webdeploy.it](https://webdeploy.it) — the WebDeploy S.R.L. company website.

Built with [SvelteKit](https://kit.svelte.dev/), [Tailwind CSS](https://tailwindcss.com/) and [Leaflet](https://leafletjs.com/) (OpenStreetMap tiles).

> **On the choice of frameworks.** SvelteKit and Tailwind CSS were picked
> primarily because their documentation is clear, consistent, and easy for
> large language models to work with. In an AI-assisted workflow this matters
> a lot: well-structured reference docs translate directly into fewer
> hallucinations, fewer wrong suggestions, and less manual correction when
> pairing with a coding agent.

> **On Leaflet and the map.** Leaflet was chosen for its small footprint,
> permissive licensing, and seamless integration with OpenStreetMap tiles —
> giving the site a fully open, keyless map stack with no proprietary
> provider dependency.

## Development

```sh
cd src
npm install
npm run dev
```

## Build

```sh
cd src
npm run build
```

The static output is emitted to `src/build/`.

Alternatively, build a production container image with:

```sh
docker build -t webdeploy.it .
```

## Contributing

Contributions are welcome. Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for
guidelines and [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md) for the community
standards that apply to this project.

## Internal tooling

A few files in the repository exist for the maintainer's private deployment
pipeline and are not meant to be used by external contributors:

- `.woodpecker/` — Woodpecker CI configuration that builds and pushes
  container images to the maintainer's private registry.
- `docker-compose.build.yml`, `docker-compose.prod.yml` — Compose files that
  reference the same private registry used for production deployment.

External contributors can ignore these files. Local development only requires
`src/` (the SvelteKit app) and, optionally, the root `Dockerfile`.

## License

Licensed under the GNU Affero General Public License v3.0 (AGPL-3.0). See
[LICENSE.md](./LICENSE.md) for the full text.
