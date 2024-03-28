FROM node:18.8-alpine as base

FROM base as builder

ENV NODE_ENV=build

WORKDIR /home/node/app
COPY package*.json ./

COPY . .
RUN npm ci --ignore-scripts --legacy-peer-deps
RUN npm install sharp --legacy-peer-deps
RUN npm run build

FROM base as runtime

ENV NODE_ENV=production
ENV PAYLOAD_CONFIG_PATH=dist/payload.config.js

WORKDIR /home/node/app
COPY package*.json  ./

RUN npm ci --ignore-scripts --legacy-peer-deps
RUN npm install sharp --legacy-peer-deps
COPY --from=builder /home/node/app/dist ./dist
COPY --from=builder /home/node/app/build ./build

EXPOSE 3000

CMD ["node", "dist/server.js"]
