FROM node:18.1-alpine AS build
WORKDIR /srv
COPY package*.json /srv/
RUN npm ci
COPY tsconfig.json /srv/
COPY src /srv/src
RUN npm run build
RUN npm ci --production
FROM alpine:3
RUN apk add --no-cache nodejs

WORKDIR /srv
COPY --from=build /srv/node_modules /srv/node_modules
COPY --from=build /srv/dist /srv/
COPY table.csv /srv/
CMD ["node", "Bot.js"]
