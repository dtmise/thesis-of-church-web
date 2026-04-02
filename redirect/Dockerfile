FROM node:24-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY redirect-server.js ./

EXPOSE 8080

CMD ["node", "redirect-server.js"]