FROM node:25-alpine AS build

WORKDIR /app
COPY src/package.json ./
COPY src/package-lock.json ./
RUN npm ci
COPY src/ ./
RUN npm run build

FROM nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html
