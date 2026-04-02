FROM node:24-alpine AS client-builder

WORKDIR /build/vue-app

COPY vue-app/package*.json ./
RUN npm ci

COPY vue-app/ ./
RUN npm run build

FROM node:24-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY server.js ./
COPY --from=client-builder /build/frontend-dist ./frontend-dist

EXPOSE 3000

CMD ["node", "server.js"]