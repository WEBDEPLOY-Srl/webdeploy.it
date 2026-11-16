FROM node:26.13.1-alpine@sha256:6bd9ab43c0ec0190ca7b2d193906cb8b7edf6e7f4afa43ddeccd6452710bffb5 AS build

WORKDIR /app
COPY src/package.json ./
COPY src/package-lock.json ./
RUN npm ci
COPY src/ ./
# The nginx policy header is built from the policy in each built page.
RUN npm run build && node scripts/nginx-csp.mjs build csp-pages.map

FROM nginx:1.31.8-alpine@sha256:fed7e14be83cbd2661a75cdc5b872d936cf155d46c327084d30b8df19ae88d72
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/csp-pages.map /etc/nginx/csp/pages.map
COPY --from=build /app/build /usr/share/nginx/html
