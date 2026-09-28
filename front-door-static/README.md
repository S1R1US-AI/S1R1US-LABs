# Soft-launch front-door static overlay

Security path A: static soft-launch theme served **outside** Vite/Nitro `.output`.

- Ship set includes home (`/`), `/hello-world/`, `/discord/`, `/roadmap/`, and DRAFT live-test Research (`/WEB-3-and-ai-future`)
- **Roadmap** (`/roadmap/`): soft-launch theme pack — `s1r1us:deploy-guard=shipped`
  - Static files: `roadmap/index.html` + `roadmap/roadmap.css`
  - Brand strip = Neural Network + Studio 01–06 + gate triad + G0Dz1LLa sleeve (display marks only; not one LIVE_FUNCTION per logo)
  - Screensavers omitted on this page
  - Godzilla `images/icon-512.png` + favicons — **never replace**
  - Overlay wiring in `scripts/do-start.mjs` always includes `/roadmap` (same as home / hello-world / discord — no env gate)
- Backend: **HOLD** (admin/auth/APIs unchanged; proxied to Nitro)
- Not part of `public/` or theme rebuild — `do-start.mjs` overlays these files on PORT and proxies everything else to Nitro on 8081
- Brand lock: Godzilla `images/icon-512.png` + favicons — never replace
- Desk data companion: `src/lib/desk/oss-roadmap.ts` LIVE ids `soft-launch-home`, `hello-world`, `discord` + DONE milestone `d1l` (admin-identity nondisclosure)

- **Research** (`/WEB-3-and-ai-future`): reachable DRAFT live soft-launch test; `noindex,nofollow`; Soft-launch HOLD / Lab 3 HOLD and paper locks remain visible. Source FAQ is linked at `/WEB-3-and-ai-future/FAQ.md`.
