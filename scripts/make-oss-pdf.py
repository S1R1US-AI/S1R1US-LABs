#!/usr/bin/env python3
from pathlib import Path
from shutil import copy2
from PIL import Image
import pymupdf

COVER_PNG = Path("/workspace/artifacts/s1rius-oss-cover.png")
COVER_JPG = Path("/workspace/artifacts/s1rius-oss-cover.jpg")
OUT = Path("/workspace/artifacts/S1R1US-LAB-open-source.pdf")

W, H = 595, 842
MARGIN = 50
GREEN = (0.08, 0.35, 0.11)
INK = (0.08, 0.09, 0.08)

im = Image.open(COVER_PNG).convert("RGB")
im.save(COVER_JPG, "JPEG", quality=88, optimize=True)

title = "[ S1R1U$ <<L@B$>> ]"
subtitle = "Open source brief - seven-bot bitcoin accumulator"
meta = "1 September 2026  |  Security analysis v3  |  MIT license recommended"

sections = [
    (
        "Disclaimer",
        "Not investment advice. Bitcoin is volatile. Operators authorize every live Coinbase order. SuperGrok / xAI is the only paid dependency. This brief is for publishing the desk as free software and forming a small engineering team. It is not a fund prospectus.",
    ),
    (
        "1. Two products, never mixed",
        "Public: the desk source, Paper v2.0, free market adapters, Wallet dry-run rails, security design.\n\nPrivate: CDP API secret, YubiKeys, admin password, seeds, portfolio UUIDs, encrypted backup passphrases.\n\nA public repo that contains a Coinbase key is a failed open-source attempt.",
    ),
    (
        "2. Strip before GitHub",
        "- Rotate the factory admin name and password. Do not commit the known factory hash.\n"
        "- Do not commit .gpg / .enc backups, session tokens, or vault ciphertext from a live database.\n"
        "- Do not commit CDP JSON, mnemonic, WIF, xprv, or 64-hex keys.\n"
        "- USDC 0x and profit BTC receive addresses are not spend keys, but keep live UUIDs out of git.\n"
        "- Set your own YUBICO_CLIENT_ID in production. Do not rely on Yubico demo client id 1.",
    ),
    (
        "3. Recommended license: MIT",
        "Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the Software), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software.\n\n"
        "The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.\n\n"
        "THE SOFTWARE IS PROVIDED AS IS, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.\n\n"
        "Copyright (c) 2026 Mr. R0b0t0 / [ S1R1U$ <<L@B$>> ]. Alternative: Apache-2.0 for a patent grant; AGPL-3.0 if hosted forks must share source.",
    ),
    (
        "4. Repository layout",
        "- GitHub org owned by @_Mr_R0b0t0_. Default branch protected. You own access, treasury, and Yubi files.\n"
        "- SECURITY.md - report vulns privately. Never paste CDP keys or seeds in issues.\n"
        "- CONTRIBUTING.md - Node 22, typecheck + build must pass, no live orders.create from the web app.\n"
        "- CI: typecheck and production build only. No secrets in Actions.",
    ),
    (
        "5. Software team (four seats)",
        "- Operator (you) - mandate, Yubi, Coinbase, what merges.\n"
        "- Desk engineer - UI, tapes, bot-7 signals, Paper.\n"
        "- Security - auth, vault, no-secrets invariant, Yubi path.\n"
        "- Data - free feeds (Coinbase, OKX, SEC, FRED). No paid Bloomberg / CoinGlass keys.\n\n"
        "Contributors never receive production CDP or hardware keys. SuperGrok stays the only paid brain.",
    ),
    (
        "6. Security model (analysis v3)",
        "- No CDP secret and no wallet seed on the web host. PASS.\n"
        "- No live Coinbase orders from the app. Dry-run preview only. PASS.\n"
        "- Admin token in sessionStorage with epoch on password rotate / idle lock. PASS.\n"
        "- Two Yubico OTP keys required before outgoing BTC/USDC CLI copy. PASS.\n"
        "- Treasury vault AES-256-GCM (profit BTC, USDC 0x, Sparrow, UUIDs). PASS.\n"
        "- Public dashboard / desk user / admin Wallet split. PASS.\n"
        "- 5-minute Matrix idle lock re-auth. PASS.\n"
        "- FIXED: unauthenticated session+Yubi wipe now requires admin token and does not delete hardware keys.\n"
        "- OPERATOR: rotate factory password; IP-allowlist CDP key; Coinbase account 2FA; protect the database.\n\n"
        "Stolen admin tab can read vault addresses until idle/lock. It cannot spend without a Yubi tap and the operator CLI/MCP.",
    ),
    (
        "7. What the desk is",
        "[ S1R1U$ <<L@B$>> ] is a seven-bot bitcoin accumulator. Bots 1-6 are research (filings, earnings, sector, sentiment, insider, coordinator). Bot 7 - S1R1U$ Analyst - sees them live, owns BTC tape (Coinbase, OKX, Asia, EM flow, hash, ETF/DAT/sovereign, Hyperliquid), and issues CALLS: BUY / ACCUMULATE / HOLD / WAIT / TRIM. Mandate: accumulate bitcoin. Never short. Never leverage.\n\n"
        "Startup test book: 100 USDC. Clips: 2% NAV on BUY, 1% on ACCUMULATE. HIGH conviction copies a Coinbase agent preview after Yubi. You run create on CLI or MCP. Take-profit BTC is a Coinbase Send - MCP Transfer cannot withdraw off-exchange.",
    ),
    (
        "8. How a fork should run",
        "- Node 22. Install dependencies, run the production build, deploy to a Node host.\n"
        "- Database for admin lock, Yubi slots, vault, desk users. Auth for optional X bind to one allowlisted account.\n"
        "- xAI key server-only if Ask Grok is enabled. Cap remains 6 calls / 10 minutes.\n"
        "- Do not put a CDP secret in the web app. Coinbase execution stays on a locked operator machine.\n"
        "- First boot: choose admin name + long password, enroll two YubiKeys, paste Coinbase USDC deposit 0x, save agent/main portfolio UUIDs.",
    ),
    (
        "9. Contribution rules",
        "- No orders create from the browser. Preview dry-run only.\n"
        "- No Google 2FA. X bind is optional and locked to the operator account.\n"
        "- No Binance. Free public books only.\n"
        "- Stance colors and risk rules stay in Paper v2.0 unless the operator changes the mandate.\n"
        "- PRs that add paid data vendors are out of scope.",
    ),
    (
        "10. Disclaimer",
        "This software is a research desk and a rehearsal book. It is not a broker, not a custodian, and not investment advice. Anyone who runs it live is solely responsible for reviewing and authorizing Coinbase trades. Coinbase does not guarantee agent actions.\n\n"
        "End of brief. Cover: Matrix idle lock of [ S1R1U$ <<L@B$>> ].",
    ),
]


def wrap(text: str, size: float, maxw: float) -> list[str]:
    font = pymupdf.Font("helv")
    words = text.split()
    lines: list[str] = []
    cur = ""
    for w in words:
        trial = (cur + " " + w).strip()
        if font.text_length(trial, fontsize=size) <= maxw:
            cur = trial
        else:
            if cur:
                lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    return lines or [""]


doc = pymupdf.open()
cover = doc.new_page(width=W, height=H)
cover.insert_image(cover.rect, filename=str(COVER_JPG))


def add_body():
    p = doc.new_page(width=W, height=H)
    p.draw_rect(p.rect, color=(0.97, 0.98, 0.96), fill=(0.97, 0.98, 0.96))
    p.draw_rect(pymupdf.Rect(0, 0, W, 10), color=GREEN, fill=GREEN)
    p.insert_text(
        (MARGIN, H - 20),
        "[ S1R1U$ <<L@B$>> ]   Open source brief",
        fontsize=8,
        fontname="helv",
        color=(0.25, 0.4, 0.28),
    )
    return p


page = add_body()
y = 32
maxw = W - MARGIN * 2


def ensure(hgt: float):
    global page, y
    if y + hgt > H - 36:
        page = add_body()
        y = 32


def write_heading(text: str):
    global y
    ensure(24)
    page.insert_text((MARGIN, y + 12), text, fontsize=13, fontname="helv", color=GREEN)
    y += 20


def write_para(text: str, size: float = 10.5, leading: float = 14):
    global y
    lines = wrap(text, size, maxw)
    ensure(leading * len(lines) + 6)
    for line in lines:
        page.insert_text((MARGIN, y + size), line, fontsize=size, fontname="helv", color=INK)
        y += leading
    y += 5


page.insert_text((MARGIN, y + 18), title, fontsize=18, fontname="helv", color=GREEN)
y += 28
write_para(subtitle, size=11, leading=15)
write_para(meta, size=9, leading=13)
y += 6

for heading, body in sections:
    write_heading(heading)
    for para in body.split("\n"):
        if not para.strip():
            y += 5
            continue
        write_para(para.strip())

doc.set_metadata(
    {
        "title": "[ S1R1U$ <<L@B$>> ] Open Source Brief",
        "author": "Mr. R0b0t0",
        "creator": "S1R1U$ L@B",
    }
)
doc.save(str(OUT), garbage=4, deflate=True)
doc.close()

copy2(OUT, "/workspace/public/S1R1US-LAB-open-source.pdf")
copy2(OUT, "/workspace/public/s1rius-oss.pdf")
copy2(OUT, "/workspace/artifacts/s1rius-oss.pdf")
print("wrote", OUT, OUT.stat().st_size)
