FROM node:22-bookworm-slim

WORKDIR /app

# Prebuilt Nitro node-server output. App Platform's 1 GB box was killing
# `npm install` / `vite build` in ~1 minute. Do not compile here.
COPY .output /app/.output
COPY scripts/do-start.mjs /app/scripts/do-start.mjs
# PGLite WASM is not inside node_modules in this image — pin the files
# Better Auth / admin lock load on first Continue with X / Unlock.
COPY .output/server/_libs/pglite.wasm /app/pglite/pglite.wasm
COPY .output/server/_libs/pglite.data /app/pglite/pglite.data

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=8080
ENV NITRO_HOST=0.0.0.0
ENV NITRO_PORT=8080
ENV PGLITE_DATA_DIR=/tmp/s1r1us-pglite
EXPOSE 8080

CMD ["node", "scripts/do-start.mjs"]
