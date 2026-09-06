# Official checkpoint — N3W Web App Installation Build (new theme) — DEPLOY #68

Verified live on https://s1r1us.ai (2026-09-06). Use this to repair or rebuild.

| | |
|---|---|
| Name | N3W Web App Installation Build (new theme) — DEPLOY #68 |
| Git tag | `n3w-web-app-install-deploy-68` |
| Git branch | `checkpoint/n3w-web-app-install-deploy-68` |
| Commit | `415e5650ee66c3ce1d2a0c10f4ce170c545f1421` |
| Repo | https://github.com/S1R1US-AI/S1R1US-LABs |
| Release | https://github.com/S1R1US-AI/S1R1US-LABs/releases/tag/n3w-web-app-install-deploy-68 |
| Runtime | prebuilt `.output` · `NITRO_PRESET=node-server` |
| Host | DigitalOcean App Platform · Dockerfile · HTTP 8080 · 1 GB · autodeploy **off** |

## Repair / rebuild

1. On GitHub, open tag **`n3w-web-app-install-deploy-68`** (or branch `checkpoint/n3w-web-app-install-deploy-68`).
2. On DigitalOcean, deploy that tag or branch. Do not compile on the 1 GB box — the image copies `.output`.
3. Keep encrypted env (`BETTER_AUTH_SECRET`, `GROK_AUTH_CLIENT_SECRET`). `BETTER_AUTH_URL` = `https://s1r1us.ai`.
4. Autodeploy stays **off**.

See [LAUNCH.md](LAUNCH.md) and [DEPLOY.md](DEPLOY.md).
