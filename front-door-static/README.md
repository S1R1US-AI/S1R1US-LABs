# Soft-launch front-door static overlay

Security path A: static soft-launch theme served **outside** Vite/Nitro `.output`.

- Tip: `ed1999ec4fa423d722151efb0c9c2edacdee3ab0` (lab3 live-prep)
- Ship set: home (`/`), `/hello-world/`, `/discord/`
- Backend: **HOLD** (admin/auth/APIs unchanged; proxied to Nitro)
- Not part of `public/` or theme rebuild — `do-start.mjs` overlays these files on PORT and proxies everything else to Nitro on 8081
- Brand lock: Godzilla `images/icon-512.png` + favicons — never replace
