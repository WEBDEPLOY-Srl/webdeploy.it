# SPDX-FileCopyrightText: 2026 WEBDEPLOY S.R.L.
# SPDX-License-Identifier: AGPL-3.0-only
FROM node:26.13.1-alpine@sha256:6bd9ab43c0ec0190ca7b2d193906cb8b7edf6e7f4afa43ddeccd6452710bffb5 AS build
WORKDIR /site
COPY src/build.mjs ./
COPY src/build-tools/ build-tools/
COPY src/data/ data/
COPY src/content/ content/
COPY src/partials/ partials/
COPY src/pages/ pages/
COPY src/assets/ assets/
COPY src/static/ static/
COPY src/vendor/ vendor/
RUN node build.mjs && mkdir /public && cp -a build/. /public/

FROM nginx:1.31.8-alpine@sha256:fed7e14be83cbd2661a75cdc5b872d936cf155d46c327084d30b8df19ae88d72
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /public/ /usr/share/nginx/html/
