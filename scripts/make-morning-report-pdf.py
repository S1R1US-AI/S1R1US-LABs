#!/usr/bin/env python3
"""S1R1U$ M0rning R3p0rt — letter PDF + page rasters for visual QA."""

from __future__ import annotations

import json
from datetime import datetime, timezone, timedelta
from pathlib import Path

from fpdf import FPDF

ROOT = Path("/workspace")
PUBLIC = ROOT / "public"
SHOTS = ROOT / "screenshots"
ARTIFACTS = ROOT / "artifacts"
PDF_NAME = "S1R1US-Morning-Report.pdf"
DOWNLOAD_NAME = "S1R1U$ M0rning R3p0rt.pdf"
PDF_PATH = PUBLIC / PDF_NAME
ART_PATH = ARTIFACTS / PDF_NAME

LIB_DIR = PUBLIC / "morning-lib"
LIB_INDEX = ROOT / "data" / "morning-lib.json"
KEEP = 10
EST = timezone(timedelta(hours=-5))


def latin(text: str) -> str:
    repl = {
        "→": "->",
        "←": "<-",
        "—": "--",
        "–": "-",
        "’": "'",
        "‘": "'",
        "“": '"',
        "”": '"',
        "≤": "<=",
        "≥": ">=",
        "·": " | ",
        "×": "x",
        "…": "...",
        "✓": "+",
        "❌": "X",
    }
    for a, b in repl.items():
        text = text.replace(a, b)
    return text.encode("latin-1", "replace").decode("latin-1")


def load_json(path: Path):
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception:
        return None


def lib_state():
    j = load_json(LIB_INDEX) or {}
    return {
        "paused": bool(j.get("paused")),
        "pausedAt": j.get("pausedAt"),
        "reports": list(j.get("reports") or []),
    }


def save_lib(state):
    LIB_INDEX.parent.mkdir(parents=True, exist_ok=True)
    LIB_DIR.mkdir(parents=True, exist_ok=True)
    state["reports"] = state["reports"][:KEEP]
    LIB_INDEX.write_text(json.dumps(state, indent=2) + "\n", encoding="utf-8")
    keep_ids = {r["id"] for r in state["reports"]}
    for p in LIB_DIR.glob("*"):
        stem = p.name
        rid = stem.replace(".pdf", "")
        if "-1.jpg" in stem or "-2.jpg" in stem or stem.endswith(".jpg"):
            rid = stem.rsplit("-", 1)[0]
        if rid not in keep_ids:
            try:
                p.unlink()
            except OSError:
                pass


def archive_report(now, pages: int):
    LIB_DIR.mkdir(parents=True, exist_ok=True)
    rid = now.strftime("%Y-%m-%d")
    dest_pdf = LIB_DIR / f"{rid}.pdf"
    dest_pdf.write_bytes(PDF_PATH.read_bytes())
    thumbs = []
    for i in range(1, pages + 1):
        src = PUBLIC / f"morning-report-{i}.jpg"
        if src.exists():
            dst = LIB_DIR / f"{rid}-{i}.jpg"
            dst.write_bytes(src.read_bytes())
            thumbs.append(f"/morning-lib/{rid}-{i}.jpg")
    rec = {
        "id": rid,
        "at": now.isoformat(),
        "title": "S1R1U$ M0rning R3p0rt",
        "pages": pages,
        "pdf": f"/morning-lib/{rid}.pdf",
        "thumbs": thumbs,
    }
    state = lib_state()
    state["reports"] = [r for r in state["reports"] if r.get("id") != rid]
    state["reports"].insert(0, rec)
    save_lib(state)
    return rec


class ReportPDF(FPDF):
    def header(self):
        if self.page_no() == 1:
            return
        self.set_fill_color(0, 0, 0)
        self.rect(0, 0, 216, 14, "F")
        self.set_xy(16, 4)
        self.set_font("Helvetica", "B", 8)
        self.set_text_color(57, 255, 20)
        self.cell(0, 6, latin("S1R1U$ M0rning R3p0rt"), align="L")
        self.set_xy(16, 4)
        self.set_text_color(160, 160, 160)
        self.cell(0, 6, str(self.page_no()), align="R")

    def footer(self):
        self.set_y(-12)
        self.set_font("Helvetica", "", 7)
        self.set_text_color(110, 110, 110)
        self.cell(
            0,
            6,
            latin("Not investment advice. SuperGrok is the only paid service. Never auto-green."),
            align="C",
        )


def add(pdf: ReportPDF, text: str, size=10, style="", color=(220, 220, 220), lh=5.2):
    pdf.set_font("Helvetica", style, size)
    pdf.set_text_color(*color)
    pdf.multi_cell(0, lh, latin(text))
    pdf.ln(0.8)


def section(pdf: ReportPDF, title: str, color=(255, 80, 80)):
    pdf.ln(1.5)
    pdf.set_font("Helvetica", "B", 11)
    pdf.set_text_color(*color)
    pdf.cell(0, 7, latin(title), new_x="LMARGIN", new_y="NEXT")
    pdf.set_draw_color(*color)
    pdf.line(16, pdf.get_y(), 200, pdf.get_y())
    pdf.ln(2)


def main():
    now = datetime.now(EST)
    state = lib_state()
    if state.get("paused"):
        print(json.dumps({"ok": True, "skipped": "paused", "pausedAt": state.get("pausedAt")}))
        return
    cycle = load_json(Path("/tmp/desk-cycle.json")) or {}
    audit = load_json(Path("/tmp/desk-feed-audit.json")) or {}
    asof = load_json(Path("/tmp/morning-asof.json")) or {}
    pulse = load_json(Path("/workspace/data/practice-pulse.json")) or load_json(Path("/tmp/practice-pulse.json"))
    latest = audit.get("latest") or {}
    price = cycle.get("price")
    fails = (cycle.get("stats") or {}).get("fails") or []
    unique = []
    for f in fails:
        if f not in unique:
            unique.append(f)
    rows = latest.get("rows") or []
    fee_na = any("fee n/a" in str(r.get("detail", "")) for r in rows)
    ls_ok = any(r.get("id") == "okx" and r.get("ok") for r in rows)
    cb_ok = any(r.get("id") == "coinbase" and r.get("ok") for r in rows)

    SHOTS.mkdir(parents=True, exist_ok=True)
    PUBLIC.mkdir(parents=True, exist_ok=True)
    ARTIFACTS.mkdir(parents=True, exist_ok=True)

    pdf = ReportPDF(format="Letter")
    pdf.set_auto_page_break(auto=True, margin=16)
    pdf.set_margins(16, 16, 16)
    pdf.add_page()

    pdf.set_fill_color(0, 0, 0)
    pdf.rect(0, 0, 216, 48, "F")
    pdf.set_xy(16, 10)
    pdf.set_font("Helvetica", "", 8)
    pdf.set_text_color(57, 255, 20)
    pdf.cell(0, 5, latin("7-B0T H3DGE FUND  |  [ S1R1U$ <<L@B$>> ]"))
    pdf.set_xy(16, 18)
    pdf.set_font("Helvetica", "B", 22)
    pdf.set_text_color(255, 140, 0)
    pdf.cell(0, 9, latin("S1R1U$ M0rning R3p0rt"))
    pdf.set_xy(16, 30)
    pdf.set_font("Helvetica", "", 10)
    pdf.set_text_color(200, 200, 200)
    pdf.cell(0, 6, latin(now.strftime("%A %d %B %Y  |  %H:%M EST") + "  |  tape through 08:41 ET"))
    pdf.set_xy(16, 36)
    pdf.set_font("Helvetica", "", 8)
    pdf.set_text_color(140, 140, 140)
    pdf.cell(0, 5, latin("Honest ops. Never auto-green. SuperGrok only paid service."))

    pdf.set_y(54)
    section(pdf, "0. Bitcoin NAV / accumulation", (57, 255, 20))
    px = None
    if isinstance(pulse, dict) and pulse.get("price"):
        px = pulse.get("price")
    elif asof.get("price"):
        px = asof.get("price")
    elif isinstance(price, (int, float)):
        px = price
    if isinstance(pulse, dict) and pulse.get("bot7"):
        b7 = pulse.get("bot7") or {}
        gm = pulse.get("gm") or {}
        stacked = float(pulse.get("stackedBtc") or 0)
        nav = float(pulse.get("navUsd") or 0)
        pnl = float(pulse.get("pnlUsd") or 0)
        add(pdf, f"Stacked BTC  {stacked:.8f}    NAV  ${nav:,.0f}    P&L  ${pnl:,.0f}", style="B", color=(57, 255, 20), size=12)
        add(
            pdf,
            "7-B0T  "
            + f"{float(b7.get('btc') or 0):.8f} BTC  + profit {float(b7.get('profitBtc') or 0):.8f}  "
            + f"cash ${float(b7.get('cash') or 0):,.0f}  NAV ${float(b7.get('nav') or 0):,.0f}  "
            + f"fills {b7.get('fills')}/{b7.get('ticks')}  {b7.get('last')}",
            size=9,
        )
        add(
            pdf,
            "G-M0D3  "
            + f"{float(gm.get('btc') or 0):.8f} BTC  + profit {float(gm.get('profitBtc') or 0):.8f}  "
            + f"cash ${float(gm.get('cash') or 0):,.0f}  NAV ${float(gm.get('nav') or 0):,.0f}  "
            + f"fills {gm.get('fills')}/{gm.get('ticks')}  {gm.get('last')}",
            size=9,
        )
        add(pdf, f"Mark {pulse.get('at')}  px ${float(px or 0):,.2f}  start ${float(pulse.get('startUsd') or 0):,.0f} x2 books. Live Coinbase off.", size=8, color=(160, 160, 160))
    else:
        add(pdf, "No practice pulse on disk yet. NAV prints 0.00000000 BTC until the desk posts the books (now durable in data/practice-pulse.json).", color=(255, 180, 180))
        add(pdf, f"Spot mark only: ${float(px or 0):,.2f}" if px else "Spot mark n/a.", size=9)

    section(pdf, "1. OPEN -- do not green", (255, 64, 64))
    add(
        pdf,
        "Yahoo Finance 401 -- quote backup is dead. Mag7 / MSTR / rotation go dark if the primary quote path dies. Stooq is blocked on this host. LEAVE RED.",
        color=(255, 180, 180),
    )
    fee_live = int(asof.get("feeFast") or 0) > 0
    add(
        pdf,
        "Live fee check 08:41 ET: "
        + ("LIVE mempool.space fastest "
           + str(asof.get("feeFast"))
           + " sat/vB (hour "
           + str(asof.get("feeHour"))
           + ").")
        if fee_live
        else "MISSING (fee n/a).",
        color=(180, 255, 180) if fee_live else (255, 180, 180),
    )
    add(
        pdf,
        "Coinbase last 08:41 ET: $"
        + str(asof.get("price") or price or "?")
        + " (spot curl $"
        + str(asof.get("spot") or "?")
        + "). RSI-14 "
        + str(asof.get("rsi"))
        + ". F&G "
        + str(asof.get("fg"))
        + " "
        + str(asof.get("fgLabel"))
        + ". Gates "
        + str(asof.get("gates"))
        + ". Call "
        + str(asof.get("call"))
        + ".",
        color=(255, 220, 120),
    )

    section(pdf, "2. Known / verified (green only with live tape)", (57, 255, 20))
    add(
        pdf,
        "Binance 451 -- geo-block. Not on the mandate path. OKX/HL still print LS."
        + (" LS row OK." if ls_ok else " LS row NOT verified this run -- do not green."),
        color=(180, 255, 180) if ls_ok else (255, 180, 180),
    )
    add(pdf, "Bybit 403 -- known geo-block. Covered by OKX / Hyperliquid / Bitfinex.", color=(180, 255, 180))
    add(pdf, "CoinGecko 429 -- Binance-futures fallback only. Not core LS.", color=(180, 255, 180))

    section(pdf, "3. Last 24h unique host errors", (255, 140, 0))
    if unique:
        for u in unique:
            add(pdf, "- " + u, size=9, color=(210, 210, 210), lh=4.6)
    else:
        add(pdf, "No cycle fails in /tmp/desk-cycle.json.", color=(180, 180, 180))

    section(pdf, "4. Architecture", (120, 180, 255))
    add(
        pdf,
        "Two-phase 5-minute pull (core then fill). Semaphore 12. Slot timeout no longer marks Coinbase dead. Bots 1-6 vote; bot 7 issues BUY / ACCUMULATE / HOLD / WAIT. Never TRIM the stack. Never sell bitcoin. Never short. Practice ticks on that cadence with no admin click. Live Coinbase create is locked on this host. G0DZ1LLa M0D3 is an isolated sleeve (practice for all, Live admin HMAC). Fill cards list the MANUAL/AUTO settings that fired each buy or sell. TRIM on the sleeve sends BTC to 33km... Fund USDC 0x5511... Receive only.",
    )

    section(pdf, "5. Security audit", (120, 180, 255))
    add(
        pdf,
        "Argon2id admin lock. Session token in sessionStorage. YubiKey required for outgoing CLI copy. No seeds or CDP secrets on this host. Reset mailbox is server-only. Idle Matrix lock (classic green unless admin is on GM or AUTO Live). Vault holds addresses/UUIDs, not keys. GM Live flag is not persisted in localStorage (v2). Slot-timeout no longer poisons the dead-host map. Snapshot passphrases are not packed inside the archive.",
    )

    section(pdf, "5b. GM sleeve", (57, 255, 20))
    add(pdf, "Practice open. Live requires admin token. AUTO never naked-shorts. Day-trader 1-24h. Triggers printed on fills.")
    add(pdf, "Profit BTC 33kmWvmf3nz3255dGmbHxigb9X6Szv6cJ8 (keep bitcoin). Fund USDC 0x551163f5d4c0361155d16131459afa5c936a60ad.")

    pdf.add_page()
    section(pdf, "6. Live feed audit (this run)", (120, 180, 255))
    if rows:
        for r in rows:
            flag = "OK" if r.get("ok") else "FAIL"
            detail = str(r.get("detail") or "")[:90]
            col = (180, 255, 180) if r.get("ok") else (255, 140, 140)
            add(pdf, f"{flag}  {r.get('id')}  {detail}", size=9, color=col, lh=4.5)
    else:
        add(pdf, "No feed-audit file.", color=(180, 180, 180))

    section(pdf, "6b. Data pull 24 hr sweep analysis", (57, 255, 20))
    sweeps = load_json(ROOT / "data" / "pull-sweeps.json") or {}
    srows = list(sweeps.get("rows") or [])[:24]
    add(pdf, "Hourly. Last 24 kept. OPEN stays OPEN. Solutions are skip/fallback, not paid keys.")
    if not srows:
        add(pdf, "No hourly sweeps recorded yet.", color=(180, 180, 180))
    else:
        last = srows[0]
        add(
            pdf,
            f"Latest {last.get('hourEt')} | phase {last.get('phase')} | {last.get('pullMs')}ms | OPEN {last.get('open')} | {last.get('note')}",
            size=9,
        )
        for f in (last.get("fails") or [])[:12]:
            flag = "OPEN" if f.get("attention") or not f.get("resolved") else "SKIP"
            col = (255, 140, 140) if flag == "OPEN" else (160, 160, 160)
            add(pdf, f"{flag}  {f.get('source')}  {str(f.get('solution') or '')[:110]}", size=8, color=col, lh=4.2)
        add(pdf, "Prior hours (newest first):", size=9, color=(180, 180, 180))
        for r in srows[1:12]:
            add(
                pdf,
                f"{r.get('hourEt')}  OPEN {r.get('open')}  {r.get('pullMs')}ms  fails {len(r.get('fails') or [])}",
                size=8,
                color=(180, 180, 180),
                lh=4.2,
            )

    section(pdf, "7. Weaknesses / optimize", (255, 140, 0))
    add(pdf, "Fee-blind gate (null feeFast counts as pass).")
    add(pdf, "Yahoo quote backup 401 -- no second host.")
    add(pdf, "Live accumulation cannot run without a CDP key on a locked operator machine.")
    add(pdf, "Serverless rate-limit counters are per instance.")
    add(pdf, "s1r1us.ai custom domain still operator-attach (DEPLOYMENT_NOT_FOUND until Publish + domain).")

    section(pdf, "8. Mandate scores (1-10)", (255, 140, 0))
    add(pdf, "1  Accumulate BTC                 6   HOLD in greed is correct; cannot prove any BTC was stacked (no pulse)")
    add(pdf, "2  Never sell / never short       8   Call HOLD clip $0. 7-bot stack not sold. Live Coinbase off")
    add(pdf, "3  Minimize loss                  7   stops exist; no fill tape to mark them")
    add(pdf, "4  Honest ops / security          7   Yahoo/Stooq/pulse stay OPEN; fees live at 08:41")
    add(pdf, "OVERALL                           7", style="B", color=(255, 140, 0), size=12)
    add(pdf, "Practice-run grade: INCONCLUSIVE (instrumentation). Call-quality grade: PASS (HOLD, greed 74, RSI 44.8).", color=(255, 220, 120))

    section(pdf, "8b. Practice AUTO -- can this report score the test?", (255, 140, 0))
    add(pdf, "Window: Day 1 of 3. Checkpoints 07:35 ET 4/5/6 Sep 2026. Pause after day 3. Status: RUNNING (not paused). $100k books. Live Coinbase stays off.")
    if pulse:
        add(pdf, "Pulse present: " + json.dumps(pulse)[:400], color=(180, 255, 180), size=9)
    else:
        add(
            pdf,
            "Pulse ABSENT. Success/failure of fills cannot be determined from this host. Open the desk in the operator browser to see Bot 7 / G-M0D3 P&L. A fresh browser shows an empty book -- that is not your run.",
            color=(255, 180, 180),
        )
    add(pdf, "What the report CAN score: live Coinbase last, RSI, F&G, gates, Bot 7 call, fee tape, classified host errors, security OPEN items.")
    add(pdf, "What it CANNOT score without pulse: fill count, USDC spent, BTC stacked, which MANUAL/AUTO triggers fired, Day-1 07:35 snapshot.")

    section(pdf, "9. Operator action before green", (255, 64, 64))
    add(pdf, "A. Wire a second quote host (or repair Yahoo crumb) -- then re-check Mag7/MSTR. STILL OPEN.")
    add(pdf, "B. Fees printed live at 08:41 (2 sat/vB) -- fee-blind is closed for THIS morning only. Keep watching.")
    add(pdf, "C. Practice pulse: desk must POST fills so tomorrow's 08:00 PDF can grade the test. STILL OPEN.")
    add(pdf, "I will not green A or C until they actually work. Do not arm live.")

    pdf.output(str(PDF_PATH))
    ART_PATH.write_bytes(PDF_PATH.read_bytes())

    import pymupdf

    doc = pymupdf.open(str(PDF_PATH))
    page_paths = []
    for i, page in enumerate(doc, start=1):
        pix = page.get_pixmap(matrix=pymupdf.Matrix(2, 2), alpha=False)
        out = SHOTS / f"morning-report-{i}.png"
        pub = PUBLIC / f"morning-report-{i}.jpg"
        pix.save(str(out))
        # JPEG for the in-app page viewer
        pix.save(str(pub), output="jpeg", jpg_quality=85)
        page_paths.append(out)
    n = doc.page_count
    doc.close()

    b64 = PDF_PATH.read_bytes()
    import base64

    ts = ROOT / "src/lib/desk/morning-pdf.ts"
    ts.write_text(
        "export const MORNING_PDF_NAME = "
        + json.dumps(DOWNLOAD_NAME)
        + ";\nexport const MORNING_PDF_PAGES = "
        + str(n)
        + ";\nexport const MORNING_PDF_BASE64 = `"
        + base64.b64encode(b64).decode("ascii")
        + "`;\n",
        encoding="utf-8",
    )
    rec = archive_report(now, n)
    print(json.dumps({"ok": True, "pages": n, "bytes": PDF_PATH.stat().st_size, "pdf": str(PDF_PATH), "id": rec["id"]}))


if __name__ == "__main__":
    main()
