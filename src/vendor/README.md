<!-- SPDX-FileCopyrightText: 2026 WEBDEPLOY S.R.L. -->
<!-- SPDX-License-Identifier: AGPL-3.0-only -->

# Browser libraries

Use the published files without modifying or rebuilding them. The static build checks every deployed file against the SHA-256 digest in `manifest.json`. To update a library, verify the package archive integrity, extract the selected paths, refresh the checksums and notices, and run the real-browser tests. Review the upstream security advisories for both pins.

## altcha-3.6.0

Published npm archive: <https://registry.npmjs.org/altcha/-/altcha-3.6.0.tgz>.

Archive integrity: `sha512-Q219oO6EbpXm6yZv5E1aprDaiYea76tQFTc/IqlzRgdCyWhyGPR5x/PcEeOyp2fR8sCMON/FTnhwb9tjVYmpAA==`. Licence: MIT.

- `LICENSE.txt`
- `dist/external/altcha.min.js`
- `dist/external/altcha.css`
- `dist/workers/sha.js`

## leaflet-1.9.4

Published npm archive: <https://registry.npmjs.org/leaflet/-/leaflet-1.9.4.tgz>.

Archive integrity: `sha512-nxS1ynzJOmOlHp+iL3FyWqK89GtNL8U8rvlMOsQdTTssxZwCXh8N2NB3GDQOL+YR3XnWyZAxwQixURb+FA74PA==`. Licence: BSD-2-Clause.

- `LICENSE`
- `dist/leaflet.js`
- `dist/leaflet.js.map`
- `dist/leaflet.css`
- `dist/images/layers.png`
- `dist/images/layers-2x.png`
- `dist/images/marker-icon.png`
- `dist/images/marker-icon-2x.png`
- `dist/images/marker-shadow.png`

ALTCHA’s prebuilt custom element contains compiled Svelte runtime code. Its upstream MIT notice accompanies the original widget licence. Leaflet is the UMD classic distribution. The contact map retains OpenStreetMap attribution and only loads tile data when the map approaches the viewport.
