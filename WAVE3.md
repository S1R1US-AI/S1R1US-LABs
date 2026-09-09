# Wave 3 — URI / origin pin

Official checkpoint stays **DEPLOY #68**. This is the third set after the two folds already on `main`. Do not invent checkpoint 101.

Security dashboard ≠ URI. OAuth `redirect_uri`, WebAuthn origin, `/admin`, and phone deep links all key off which host the request claims to be.

## What this branch changes

| File | Why |
|---|---|
| `src/lib/desk/canonical-origin.ts` | Pin + `classifyRequest` + Host-swap PoC + `originAllowedPinned` |
| `src/lib/desk/canonical-origin.test.ts` | PoC pack, phone schemes, WebAuthn hole |
| `src/lib/desk/webauthn.server.ts` | Close Host-swap: origin is canonical/loopback only; Host header not XFH |
| `src/lib/desk/hunter.ts` | Finding `h-uri` |
| `package.json` | Run the new test |

Do **not** rewrite `src/lib/auth/server.ts` (Grok template). `BETTER_AUTH_URL=https://s1r1us.ai` is already in `.do/app.yaml`.

## The hole (PoC \|\| GTFO)

`originAllowed` used to return true for **any https origin whose hostname matched the request Host**, and `requestHost()` preferred `X-Forwarded-Host`. A client that set both could mint WebAuthn against a foreign origin.

Fix: `originAllowedPinned` allows only `https://s1r1us.ai`, `https://www.s1r1us.ai`, and loopback. `privilegeHostFromHeaders` reads `Host`, never XFH.

## Next steps to completion

1. **Merge this PR** into `main` (protected). Review the WebAuthn pin.
2. **Rebuild `.output`** on a machine with RAM (not the 1 GB App Platform box). Image copies `.output`.
3. **Push the rebuilt image to `main`.** Autodeploy is on (`live-production`).
4. **Confirm DigitalOcean env:** `BETTER_AUTH_URL=https://s1r1us.ai` (no trailing slash). Encrypted `BETTER_AUTH_SECRET` / `GROK_AUTH_CLIENT_SECRET` unchanged.
5. **Grok broker allow-list:** only `https://s1r1us.ai/api/auth/oauth2/callback/x` and `/google`. Do not list `*.grok-sandbox.com` on the live client.
6. **Edge:** www → apex. Load balancer must not let clients set `X-Forwarded-Host`.
7. **Phone:** set `APPLE_TEAM_ID` (10-char) and `ANDROID_SHA256` so AASA / assetlinks actually associate. Schemes `s1r1us://` and `web+s1r1us://`. `/admin` stays excluded.
8. **Optional follow-up:** call `classifyRequest()` from a Nitro hook so preview `/admin` is 403 + intrusion log. Tenancy already isolates tokens.
9. **Stay on 68** until DigitalOcean is green. Then cut the next official tag.

## Tenancy (unchanged)

- System admin `/admin` — `@_Mr_R0b0t0_` only, 3-part HMAC.
- Phone copy-admin `/app/admin` — 4-part `app.` token. Cannot mint system HMAC.
- Preview hosts (`*.grok-sandbox.com`) — public tape only.

## Verify

```
node --experimental-strip-types --test src/lib/desk/canonical-origin.test.ts
```

Hunter `h-uri` must read **PASS** on Admin → Security after deploy. Morning report Security analysis gets the same line.
