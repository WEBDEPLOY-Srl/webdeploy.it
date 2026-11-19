# Third-party notices

The source code of this repository is licensed under the GNU Affero General
Public License v3.0 only (`AGPL-3.0-only`), see [LICENSE.md](./LICENSE.md). The
WEBDEPLOY and inWD names and logos, photographs, customer imagery and the
written content of the website are © WEBDEPLOY S.R.L., all rights reserved,
see [LICENSES/LicenseRef-WEBDEPLOY-Reserved.txt](./LICENSES/LicenseRef-WEBDEPLOY-Reserved.txt).

Third-party material keeps its own licence. Per-file licensing is declared in
[REUSE.toml](./REUSE.toml) and checked with `reuse lint`. This file lists what
is bundled in the repository or in the built site.

## Fonts

| Font | Files | Licence | Licence text |
|---|---|---|---|
| Space Mono, © 2016 The Space Mono Project Authors (<https://github.com/googlefonts/spacemono>) | `src/static/fonts/space-mono-*.woff2` | SIL Open Font License 1.1 | [space-mono-OFL.txt](./src/static/fonts/space-mono-OFL.txt) |
| VT323, © 2011 The VT323 Project Authors (<peter.hull@oikoi.com>) | `src/static/fonts/vt323-*.woff2` | SIL Open Font License 1.1 | [vt323-OFL.txt](./src/static/fonts/vt323-OFL.txt) |
| Pixelarticons, © 2019 Gerrit Halfmann (<https://github.com/halfmage/pixelarticons>) | `src/static/fonts/pixelarticons.woff2` | MIT | [pixelarticons-LICENSE.txt](./src/static/fonts/pixelarticons-LICENSE.txt) |

The fonts are subsets in WOFF2 format, served from the site's own host.

## Browser libraries and icon data

| Library | Licence | Notes |
|---|---|---|
| [ALTCHA](https://altcha.org/) 3.6.0 | MIT | The newsletter ships the published minified external custom element, its stylesheet and its SHA worker locally. The included Svelte runtime retains its MIT notice. |
| [Leaflet](https://leafletjs.com/) 1.9.4, © 2010-2023 Volodymyr Agafonkin, © 2010-2011 CloudMade | BSD-2-Clause | Contact map. Its stylesheet and marker images are bundled. |
| [Simple Icons](https://simpleicons.org/) 16.38.0 | CC0-1.0 (the icon data) | The native site stores the selected SVG paths in `src/partials/marks/`. The marks themselves are trademarks of their owners, see below. |
| [Svelte](https://svelte.dev/), [SvelteKit](https://svelte.dev/docs/kit), [Tailwind CSS](https://tailwindcss.com/) and the other npm dependencies | MIT and similar | Listed with their versions in [src/package-lock.json](./src/package-lock.json); each ships its own licence file. |

The pinned browser distributions, original archive integrity values and file checksums are documented in [the vendor inventory](./src/vendor/README.md).

## Map data

The contact map shows tiles and data from [OpenStreetMap](https://www.openstreetmap.org/copyright),
© OpenStreetMap contributors, available under the Open Database Licence. The map
carries the required attribution. Tiles are requested from `tile.openstreetmap.org`
when a visitor approaches or focuses the map on the contact page.

## Logos and trademarks of other parties

These appear only to identify the products or organisations they belong to.
They are not licensed by WEBDEPLOY S.R.L., are not covered by this repository's
licence, and their use implies no affiliation or endorsement.

- **Simple Icons brand marks**, from the `simple-icons` project: ActualBudget, AFFiNE,
  Alpine Linux, Ansible, Arch Linux, BorgBackup, Caddy, Collabora Online, Debian, Docker,
  Firefox, Forgejo, Grafana, Jitsi, KDE Plasma, Let's Encrypt, Libreoffice, Linux, Listmonk,
  MariaDB, Matomo, Matrix, n8n, Nextcloud, nginx, ntfy, OpenTofu, Ory, Penpot, PostgreSQL,
  Prometheus, Sentry, Temporal, Thunderbird, Trivy, Wayland and WireGuard.
- **BorgBackup logo**, `src/static/images/borgbackup-logo.svg`. Source:
  <https://github.com/borgbackup/borg/blob/master/docs/_static/logo.svg>. Recoloured to the
  WEBDEPLOY palette in 2026, shapes unchanged. Distributed under the BorgBackup licence
  (BSD-3-Clause), reproduced in
  [borgbackup-logo-LICENSE.txt](./src/static/images/borgbackup-logo-LICENSE.txt).
  WEBDEPLOY is not affiliated with and is not endorsed by the BorgBackup project.
- **BorgWarehouse mascot**, `src/partials/marks/borgwarehouse-com.html`. The leftmost paths of
  `public/borgwarehouse-logo-white.svg` in <https://github.com/Ravinou/borgwarehouse>, without
  the wordmark, as an SVG path. Simple Icons has no BorgWarehouse icon.
- **FuriLabs wordmark**, `src/partials/marks/furilabs-com.html`. Traced with potrace from the
  white logo on <https://furilabs.com>. Simple Icons has no FuriLabs icon.
- **linkding logo**, `src/partials/marks/linkding-link.html`. The `assets/logo.svg` of
  <https://github.com/sissbruecker/linkding> as a single colour, traced with potrace.
  Simple Icons has no linkding icon.

If you own one of these marks and want it removed or credited differently, write to
<info@webdeploy.it>.
