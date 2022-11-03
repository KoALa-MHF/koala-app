FROM node:18-bullseye-slim AS build
RUN apt-get update && apt-get install -y --no-install-recommends dumb-init python3 make g++
WORKDIR /usr/src/app
COPY ./ /usr/src/app/
#RUN npm ci --only=production
RUN npm ci
RUN npx nx build api
RUN npm prune --production

FROM node:18-bullseye-slim

ENV NODE_ENV production
COPY --from=build /usr/bin/dumb-init /usr/bin/dumb-init
USER node
WORKDIR /usr/src/app
COPY --chown=node:node --from=build /usr/src/app/node_modules /usr/src/app/node_modules
COPY --chown=node:node --from=build /usr/src/app/dist/apps/api /usr/src/app

CMD ["dumb-init", "node", "main.js"]
