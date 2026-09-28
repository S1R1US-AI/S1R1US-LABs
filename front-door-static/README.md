# Soft-launch front-door static overlay

Security path A: static soft-launch theme served **outside** Vite/Nitro `.output`.

- Ship set includes home (`/`), `/hello-world/`, `/discord/`, `/roadmap/`, and DRAFT live-test Research (`/WEB-3-and-ai-future`)
- **Roadmap** (`/roadmap/`): soft-launch theme pack — `s1r1us:deploy-guard=shipped`
  - Static files: `roadmap/index.html` + `roadmap/roadmap.css`
  - Brand strip = Neural Network + Studio 01–06 + gate triad + G0Dz1LLa sleeve (display marks only; not one LIVE_FUNCTION per logo)
  - Classic Matrix screensaver (click-idle 5 min) via shared `/js/rain-engine.js` + `/js/screensavers.js` — system-wide with all other non-GM pages
  - Godzilla `images/icon-512.png` + favicons — **never replace**
  - Overlay wiring in `scripts/do-start.mjs` always includes `/roadmap` (same as home / hello-world / discord — no env gate)
- Backend: **HOLD** (admin/auth/APIs unchanged; proxied to Nitro)
- Not part of `public/` or theme rebuild — `do-start.mjs` overlays these files on PORT and proxies everything else to Nitro on 8081
- Brand lock: Godzilla `images/icon-512.png` + favicons — never replace
- Desk data companion: `src/lib/desk/oss-roadmap.ts` LIVE ids `soft-launch-home`, `hello-world`, `discord` + DONE milestone `d1l` (admin-identity nondisclosure)

- **Research** (`/WEB-3-and-ai-future`): reachable DRAFT live soft-launch test; `noindex,nofollow`; Soft-launch HOLD / Lab 3 HOLD and paper locks remain visible. Source FAQ is linked at `/WEB-3-and-ai-future/FAQ.md`.


## Matrix screensavers (system-wide)

Shared idle overlay (no auth / no saver-lock):

| Asset | Role |
|-------|------|
| `/js/rain-engine.js` | Paint engine (`S1R1USRain`) — classic green + GM rainbow |
| `/js/screensavers.js` | Idle arm + overlay; **5 min no mouse click** resets timer (move does not) |
| `/js/matrix-rain.js` | Optional low-opacity **ghost** only (home / hello-world / discord) — not the screensaver |
| `/css/theme.css` `.screensaver-overlay` | Fullscreen overlay styles |

- **All non-GM pages:** classic Matrix screensaver after 5 min click-idle.
- **`/gm`:** Godzilla Mode rainbow rain (path-forced `inGmContext`); ghost canvases stay stripped (`matrix-mistake`).
- Home `#gm` / `.tier-gm` in view also selects GM rain while that section is visible.
- QA: `?saverDemo=1` → 3s idle.

