FROM node:22-bookworm-slim

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

ENV NODE_ENV=production
ENV NITRO_PRESET=node-server
ENV VITE_AUTH_ENABLED=true

RUN npm run build:do

ENV HOST=0.0.0.0
ENV PORT=8080
ENV NITRO_HOST=0.0.0.0
ENV NITRO_PORT=8080
EXPOSE 8080

CMD ["node", "scripts/do-start.mjs"]
