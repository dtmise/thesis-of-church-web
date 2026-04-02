FROM node:24-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY src ./src

EXPOSE 1904

CMD ["node", "--experimental-vm-modules", "src/server.js"]