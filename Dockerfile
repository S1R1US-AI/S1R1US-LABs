FROM node:22-bookworm-slim

WORKDIR /app

# Lockfile is optional — `npm install` from package.json is enough to build.
COPY package.json package-lock.json* ./
RUN npm install

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
