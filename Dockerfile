FROM node:22-bookworm-slim

WORKDIR /app

# App Platform injects NODE_ENV=production for the whole image build.
# Vite + Nitro are devDependencies — they must still be installed to compile.
# Playwright's browser download would OOM a 1 GB box; skip it.
ENV NODE_ENV=development
ENV PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1
ENV NPM_CONFIG_UPDATE_NOTIFIER=false
ENV NPM_CONFIG_FUND=false
ENV NPM_CONFIG_AUDIT=false

COPY package.json package-lock.json ./
RUN npm install --include=dev

COPY . .

ENV NITRO_PRESET=node-server
ENV VITE_AUTH_ENABLED=true
ENV NODE_OPTIONS=--max-old-space-size=1536

RUN npm run build:do

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=8080
ENV NITRO_HOST=0.0.0.0
ENV NITRO_PORT=8080
EXPOSE 8080

CMD ["node", "scripts/do-start.mjs"]
