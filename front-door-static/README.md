# Soft-launch front-door static overlay

Security path A: static soft-launch theme served **outside** Vite/Nitro `.output`.

- Ship set (live-prep / shipped pages): home (`/`), `/hello-world/`, `/discord/`
- **Roadmap** (`/roadmap/`): HOLD **draft** theme pack — `s1r1us:deploy-guard=draft`, `shipped=false`
  - Static files: `roadmap/index.html` + `roadmap/roadmap.css`
  - Brand strip = Neural Network + Studio 01–06 + gate triad + G0Dz1LLa sleeve (display marks only; not one LIVE_FUNCTION per logo)
  - Screensavers omitted on this page
  - Godzilla `images/icon-512.png` + favicons — **never replace**
  - Overlay wiring in `scripts/do-start.mjs` is **feature-flagged DEFAULT OFF**:
    - Set `S1R1US_FRONT_DOOR_ROADMAP=1` only after human **APPROVE**
    - Until then Nitro continues to own `/roadmap` (desk app)
    - Do **not** enable this flag on `main` / production without APPROVE
- Backend: **HOLD** (admin/auth/APIs unchanged; proxied to Nitro)
- Not part of `public/` or theme rebuild — `do-start.mjs` overlays these files on PORT and proxies everything else to Nitro on 8081
- Brand lock: Godzilla `images/icon-512.png` + favicons — never replace
- Desk data companion: `src/lib/desk/oss-roadmap.ts` LIVE ids `soft-launch-home`, `hello-world`, `discord` + DONE milestone `d1l` (admin-identity nondisclosure)
