FROM node:22-bookworm-slim

WORKDIR /app

# Do not set NODE_OPTIONS heap above the 1 GB App Platform box — V8 will
# exit immediately. Do not install Playwright / lint (omit=dev).
ENV PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1
ENV PUPPETEER_SKIP_DOWNLOAD=1
ENV NPM_CONFIG_UPDATE_NOTIFIER=false
ENV NPM_CONFIG_FUND=false
ENV NPM_CONFIG_AUDIT=false
ENV NPM_CONFIG_PROGRESS=false

COPY package.json package-lock.json ./
RUN echo "[s1r1us] npm install" \
 && npm install --omit=dev --ignore-scripts --no-audit --no-fund \
 && echo "[s1r1us] npm install ok"

COPY . .

ENV NITRO_PRESET=node-server
ENV VITE_AUTH_ENABLED=true

RUN echo "[s1r1us] vite build" \
 && node scripts/with-app-env.mjs vite build \
 && node scripts/migrate.mjs \
 && echo "[s1r1us] vite build ok" \
 && test -f .output/server/index.mjs

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=8080
ENV NITRO_HOST=0.0.0.0
ENV NITRO_PORT=8080
EXPOSE 8080

CMD ["node", "scripts/do-start.mjs"]
