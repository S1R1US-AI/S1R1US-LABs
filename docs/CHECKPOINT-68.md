# DEPLOY #68 — system align (2026-09-07)

Baseline stays **68**. This fold records SEO / sitemap / schema / roadmap / source alignment before the next prebuilt `.output` rebuild.

## Source of truth

- GitHub `main`: `S1R1US-AI/S1R1US-LABs`
- Live host: DigitalOcean App Platform `s1r1us-labs` → `s1r1us.ai`
- Spec: `.do/app.yaml` `deploy_on_push: true` on `main`
- Image: `Dockerfile` copies **prebuilt** `.output` (no compile on the 1 GB box)
- Checkpoint: `src/lib/launch/checkpoint.ts` `CHECKPOINT_BUILD_N = 68`

## Mandate rails (must stay green)

- Accumulate bitcoin. Never sell. Never short.
- `LAUNCH_LIVE_TRADES = false`
- `PATH_A_LOCKED = true`
- MCP has no `orders_create`, `hive_withdraw`, `hive_pause`, `lock_set`
- Alignment Score module: `src/lib/desk/alignment.ts` — score 90+ / fail 0 when rails hold

## SEO + discovery (live 200)

| URL | HTTP |
| --- | --- |
| `/` `/roadmap` `/faq` `/pr3d` `/h1v3` | 200 |
| `/sitemap.xml` `/sitemap-index.xml` `/video-sitemap.xml` | 200 |
| `/llms.txt` `/.well-known/llms.txt` `/entity.json` `/robots.txt` | 200 |
| GitHub `S1R1US-AI/S1R1US-LABs` | 200 |
| X `https://x.com/S1R1US_AI` | 200 |

Live sitemap page locs include home, gm, board, bowl, w0rld, h1v3, pr3d, l0ck, roadmap, agent, forum, compute, app, ios, play, media, search, legal, and agent discovery endpoints.

## Title / copy alignment (source vs live bundle)

Source on `main` (this fold):

- Rank-1 title string: **AI AG3NT T0P D0G** (not GR@Nd M@$T3R)
- H3LL0 W0RLD comment: `payload` → `/pr3d`, `SW@RM-worm` → `/h1v3`, `ROBOTS ACTIVATE` → `/r0b0ts`
- Red CSS: `geek greeting only / not a shell`, `BYO C0MPUT3`
- Top menu: grey `@S1R1US_AI` tab removed from `shell.tsx`; far-right X chip + login stay
- Hide CSS: `/hide-x-tab.css` + `__root.tsx` stylesheet link

Live DigitalOcean bundle is still an older hashed `.output`:

- `/pr3d` HTML still advertises retired Ph0 W@ll3t / ph0 BTC copy in some crawlers
- Greeting JS still the pre-payload / pre-red-BYO line
- Grey handle tab still in live `shell-*.js` until rebuild

**Rebuild gate (required for 100% live match):**

```bash
npm run build:do
# commit .output
# push main → App Platform deploy_on_push
```

Do not treat a source-only push as a live theme deploy.

## PR3D1CT10N$ posture

- Education / proof-of-concept game. Fake token **S1R1U$**. `$` cannot mint a real token.
- 7-B0T may read Polymarket / Kalshi as a **sub-analyst overlay only**
- Alignment check `s-pred-paper`: no `pred_bet` / `pred_arm` / `orders_create` MCP
- Old paper book / fake wallet must not return in the next `.output`

## Ready / not ready

| Item | Status |
| --- | --- |
| Checkpoint number 68 | ready |
| Mandate + alignment rails in source | ready |
| Live sitemap + robots + entity + llms | ready (200) |
| Outbound GitHub + X | ready (200) |
| Source greeting / menu / hide-x-tab | ready on GitHub |
| Live `.output` matches GitHub source | **not ready** — rebuild required |
| DigitalOcean compile-on-box | never — by design |

## Save

Fold stamp: `CHECKPOINT_FOLD = 2026-09-07T17:20:00.000Z`
Label: `DEPLOY #68`
Next operator action: `npm run build:do` then push `.output` to `main`.
