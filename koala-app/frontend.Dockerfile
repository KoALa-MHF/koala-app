FROM node:18-bullseye-slim AS build
RUN apt-get update && apt-get install -y --no-install-recommends dumb-init python3 make g++
WORKDIR /usr/src/app
COPY package.json package-lock.json nx.json decorate-angular-cli.js tsconfig.base.json ./
RUN npm ci
COPY ./apps/koala-frontend /usr/src/app/apps/koala-frontend
COPY ./libs /usr/src/app/libs
RUN npx nx build koala-frontend
RUN npm prune --production

FROM nginx:1.17.1-alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /usr/src/app/dist/apps/koala-frontend /usr/share/nginx/html
