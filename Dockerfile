FROM node:22-bookworm-slim

WORKDIR /app

# Playwright browsers and lint tools are not needed to compile the desk.
# App Platform also injects NODE_ENV=production at build — omit=dev still
# works because vite/nitro live in dependencies.
ENV PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1
ENV PUPPETEER_SKIP_DOWNLOAD=1
ENV NPM_CONFIG_UPDATE_NOTIFIER=false
ENV NPM_CONFIG_FUND=false
ENV NPM_CONFIG_AUDIT=false
ENV NPM_CONFIG_PROGRESS=false
ENV NODE_OPTIONS=--max-old-space-size=1536

COPY package.json package-lock.json ./
RUN echo "[s1r1us] npm install (no playwright)" \
 && npm install --omit=dev \
 && echo "[s1r1us] npm install ok"

COPY . .

ENV NITRO_PRESET=node-server
ENV VITE_AUTH_ENABLED=true

RUN echo "[s1r1us] vite build" \
 && npm run build:do \
 && echo "[s1r1us] vite build ok"

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=8080
ENV NITRO_HOST=0.0.0.0
ENV NITRO_PORT=8080
EXPOSE 8080

CMD ["node", "scripts/do-start.mjs"]
