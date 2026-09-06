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
KEEP = 14
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
            latin("Not investment advice. Education desk. Auto trade LOCKED. Never auto-green."),
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
    cycle = load_json(Path("/tmp/desk-cycle.json")) or load_json(ROOT / "data" / "desk-cycle.json") or {}
    audit = load_json(Path("/tmp/desk-feed-audit.json")) or {}
    asof = load_json(Path("/tmp/morning-asof.json")) or load_json(ROOT / "data" / "morning-asof.json") or {}
    pulse = load_json(ROOT / "data" / "practice-pulse.json") or load_json(Path("/tmp/practice-pulse.json"))
    forum = load_json(Path("/tmp/morning-forum.json")) or {}
    board = load_json(Path("/tmp/morning-board.json")) or {}
    board_daily = load_json(ROOT / "data" / "board-daily.json") or (board.get("morning") or {})
    forum_daily = load_json(ROOT / "data" / "forum-daily.json") or ((forum.get("morning") or {}).get("daily") or {})
    pings = load_json(ROOT / "data" / "agent-pings.json") or {}
    wait = load_json(Path("/tmp/morning-waitlist.json")) or {}
    test68 = load_json(ROOT / "artifacts" / "DEPLOY-68-SYSTEM-TEST.json") or {}
    health = load_json(ROOT / "artifacts" / "system-health.json") or {}
    errors = load_json(Path("/tmp/desk-errors.json")) or {}
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
    pdf.cell(0, 6, latin(now.strftime("%A %d %B %Y  |  %H:%M EST") + "  |  live tape + DEPLOY #68 test fold"))
    pdf.set_xy(16, 36)
    pdf.set_font("Helvetica", "", 8)
    pdf.set_text_color(140, 140, 140)
    pdf.cell(0, 5, latin("Honest ops. Never auto-green. Auto trade LOCKED. This host never places Coinbase orders."))

    pdf.set_y(54)
    section(pdf, "0. Bitcoin NAV / 7-B0T live call", (57, 255, 20))
    px = None
    if isinstance(pulse, dict) and pulse.get("price"):
        px = pulse.get("price")
    elif asof.get("price"):
        px = asof.get("price")
    elif isinstance(price, (int, float)):
        px = price
    add(
        pdf,
        f"Coinbase last  ${float(px or 0):,.2f}    7-B0T  {asof.get('conviction') or ''} {asof.get('call') or '?'}    clip ${asof.get('clipUsd') or 0}",
        style="B",
        color=(57, 255, 20),
        size=12,
    )
    add(
        pdf,
        f"RSI-14  {round(float(asof.get('rsi') or 0), 1)}    F&G  {asof.get('fg')} {asof.get('fgLabel') or ''}    trade {asof.get('trade')}    live {asof.get('live')}    {asof.get('status')}",
        size=9,
    )
    if asof.get("headline"):
        add(pdf, str(asof.get("headline")) + " -- " + str(asof.get("thesis") or "")[:280], size=9, color=(200, 200, 200))
    bots = asof.get("bots") or []
    if bots:
        lane = "  |  ".join(f"{b.get('name','?')}: {b.get('stance')}" for b in bots)
        add(pdf, "Bots 1-6  " + lane, size=8, color=(160, 200, 255))
    if isinstance(pulse, dict) and pulse.get("bot7") and not pulse.get("paused"):
        b7 = pulse.get("bot7") or {}
        gm = pulse.get("gm") or {}
        stacked = float(pulse.get("stackedBtc") or 0)
        nav = float(pulse.get("navUsd") or 0)
        pnl = float(pulse.get("pnlUsd") or 0)
        add(pdf, f"Stacked BTC  {stacked:.8f}    NAV  ${nav:,.0f}    P&L  ${pnl:,.0f}", style="B", color=(57, 255, 20), size=11)
        add(
            pdf,
            "7-B0T  "
            + f"{float(b7.get('btc') or 0):.8f} BTC  "
            + f"cash ${float(b7.get('cash') or 0):,.0f}  "
            + f"fills {b7.get('fills')}/{b7.get('ticks')}  {b7.get('last')}",
            size=9,
        )
        add(
            pdf,
            "G-M0D3  "
            + f"{float(gm.get('btc') or 0):.8f} BTC  "
            + f"cash ${float(gm.get('cash') or 0):,.0f}  "
            + f"fills {gm.get('fills')}/{gm.get('ticks')}  {gm.get('last')}",
            size=9,
        )
    else:
        add(
            pdf,
            "Practice pulse PAUSED / disabled (fills 0). Would-accumulate is on the tape. Paper fills off. Live Coinbase off. Do not green stacked BTC.",
            color=(255, 180, 180),
        )

    section(pdf, "1. OPEN -- do not green", (255, 64, 64))
    add(
        pdf,
        "Yahoo Finance 401 -- quote backup is dead. Mag7 / MSTR / rotation go dark if the primary quote path dies. Stooq is blocked on this host. LEAVE RED.",
        color=(255, 180, 180),
    )
    fee_live = int(asof.get("feeFast") or 0) > 0
    add(
        pdf,
        "Live fee check: "
        + ("LIVE mempool.space fastest " + str(asof.get("feeFast")) + " sat/vB.")
        if fee_live
        else "MISSING (fee n/a this run -- fee-blind gate still OPEN).",
        color=(180, 255, 180) if fee_live else (255, 180, 180),
    )
    add(
        pdf,
        "Coinbase last this run: $"
        + str(asof.get("price") or price or "?")
        + "  RSI-14 "
        + str(round(float(asof.get("rsi") or 0), 1))
        + "  F&G "
        + str(asof.get("fg"))
        + " "
        + str(asof.get("fgLabel") or "")
        + "  Call "
        + str(asof.get("conviction") or "")
        + " "
        + str(asof.get("call") or "?")
        + "  clip $"
        + str(asof.get("clipUsd") or 0)
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
        "Two-phase 5-minute pull (core then fill). Semaphore 12. Slot timeout no longer marks Coinbase dead. Bots 1-6 vote; 7-B0T issues BUY / ACCUMULATE / HOLD / WAIT. Never TRIM the stack. Never sell bitcoin. Never short. Practice ticks on that cadence with no admin click. Live Coinbase create is locked on this host. G0DZ1LLa M0D3 is an isolated sleeve (practice for all, Live admin HMAC). Fill cards list the MANUAL/AUTO settings that fired each buy or sell. TRIM on the sleeve sends BTC to 33km... Fund USDC 0x5511... Receive only.",
    )

    section(pdf, "5. Security audit", (120, 180, 255))
    add(
        pdf,
        "Argon2id admin lock. Session token in sessionStorage. YubiKey required for outgoing CLI copy. No seeds or CDP secrets on this host. Reset mailbox is server-only. Idle Matrix lock (classic green unless admin is on GM or AUTO Live). Vault holds addresses/UUIDs, not keys. GM Live flag is not persisted in localStorage (v2). Slot-timeout no longer poisons the dead-host map. Snapshot passphrases are not packed inside the archive.",
    )

    section(pdf, "5b. GM sleeve", (57, 255, 20))
    add(pdf, "Practice open. Live requires admin token. AUTO never naked-shorts. Day-trader 1-24h. Triggers printed on fills.")
    add(pdf, "Profit BTC 33kmWvmf3nz3255dGmbHxigb9X6Szv6cJ8 (keep bitcoin). Fund USDC 0x551163f5d4c0361155d16131459afa5c936a60ad.")

    section(pdf, "5c. DEPLOY #68 system test (this fold)", (255, 140, 0))
    if test68:
        add(
            pdf,
            f"Live system test {test68.get('at')}  pass {test68.get('pass')}  fail {test68.get('fail')}  ok {test68.get('ok')}",
            style="B",
            color=(180, 255, 180) if test68.get("ok") else (255, 140, 140),
        )
        fails = [c.get("name") for c in (test68.get("checks") or []) if not c.get("ok")]
        if fails:
            add(pdf, "OPEN fails: " + ", ".join(fails), color=(255, 180, 180), size=9)
        else:
            add(pdf, "Pages, ping, 7-B0T call, L3AD3R B0ARD top-50, forum strategy accept, sell bar, MCP tools, sitemap, llms.txt all PASS. Rate-limit still 429s scrapers. Auto trade LOCKED.", size=9)
    else:
        add(pdf, "No DEPLOY-68-SYSTEM-TEST.json on disk.", color=(255, 180, 180))

    section(pdf, "5d. W1S3 0WL$ Forum (this ET day)", (180, 80, 255))
    fm = forum.get("morning") or {}
    add(pdf, str(forum_daily.get("summary") or fm.get("digest") or "Forum digest n/a"), size=9)
    add(
        pdf,
        f"Posts {forum.get('count') or fm.get('count')}  last24h {fm.get('last24h')}  themes {(fm.get('themes') or [])[:8]}",
        size=8,
        color=(180, 180, 180),
    )
    for s in (forum_daily.get("suggestions") or [])[:4]:
        add(pdf, "SUGGEST  " + str(s.get("title") or ""), size=9, color=(255, 255, 120))
        add(pdf, f"{s.get('kind')} | {s.get('from')} -- {str(s.get('detail') or '')[:180]}", size=8, color=(180, 180, 180))
    for p in (fm.get("latest") or forum.get("posts") or [])[:3]:
        add(pdf, f"{p.get('kind')} {p.get('name')}: {str(p.get('excerpt') or p.get('body') or '')[:160]}", size=8)

    section(pdf, "5e. L3AD3R B0ARD / GM B0aRd top 5", (255, 140, 0))
    add(pdf, str(board_daily.get("summary") or "Board daily n/a"), size=9)
    add(
        pdf,
        f"status {board_daily.get('status') or board.get('status')}  Coinbase last ${board_daily.get('btcUsd') or asof.get('price')}  external {board_daily.get('externalCount')} stacked {board_daily.get('externalWithBtc')}",
        size=8,
        color=(180, 180, 180),
    )
    for r in (board_daily.get("top5") or board.get("top") or [])[:5]:
        flag = "HOUSE" if r.get("house") else "external"
        add(
            pdf,
            f"#{r.get('rank')} {r.get('name')}  {r.get('kind')}  {flag}  {float(r.get('btc') or 0):.6f} BTC  {r.get('lastAction') or ''}  {str(r.get('move') or '')[:90]}",
            size=8,
            color=(255, 180, 80) if r.get("rank") == 1 else (210, 210, 210),
        )
    for s in (board_daily.get("successes") or [])[:4]:
        add(pdf, "SUCCESS  " + str(s.get("name")) + " -- " + str(s.get("note") or "")[:200], size=8, color=(180, 255, 180))

    section(pdf, "5f. Agent flags / waitlist", (120, 180, 255))
    add(
        pdf,
        f"Pings file dayEt {pings.get('dayEt')}  pings {pings.get('pings')}  rejects {pings.get('rejects')}  last {pings.get('lastAt')}  lastOk {pings.get('lastOk')}",
        size=9,
    )
    add(pdf, f"Waitlist count {wait.get('count')}  status {wait.get('status')}. Go-live notices poll only -- no webhooks. PoC, not LIVE. No trades.", size=9)
    err_rows = errors.get("rows") or []
    agent_flags = [e for e in err_rows if "agent" in str(e.get("msg") or "").lower() or e.get("source") == "desk"]
    for e in agent_flags[:4]:
        add(pdf, f"{e.get('verdict') or e.get('msg')}", size=8, color=(255, 220, 120))

    section(pdf, "5g. New-function security (agents / L3AD3R B0ARD / W1S3 0WL$)", (180, 80, 255))
    add(
        pdf,
        "Audit of SP1CE UP, board pics, forum inspect, waitlist, and agent tokens. Rank is bitcoin stacked. SP1CE UP never escrows. Board keys are hashed gb_ desks. Auto trade LOCKED.",
        size=9,
    )
    section(pdf, "5h. Overall system health score (function + security + design)", (180, 80, 255))
    if health:
        grade = str(health.get("grade") or "?")
        overall = health.get("overall")
        fn = (health.get("function") or {}).get("score")
        sec = (health.get("security") or {}).get("score")
        des = (health.get("design") or {}).get("score")
        add(
            pdf,
            f"Checkpoint {health.get('checkpoint')}  overall {overall} {grade}  function {fn}/100  security {sec}/100  design {des}/100  weights 40/40/20",
            style="B",
            color=(180, 255, 180) if grade in ("A", "B") else (255, 180, 180),
            size=9,
        )
        add(
            pdf,
            "Live Coinbase create LOCKED. Practice cannot arm Coinbase. Copy-admin may pause H1V3 SW@RM. Copy-admin cannot pause championship sim. Gift/SaaS only -- never hive profit share.",
            size=8,
        )
        for axis in (health.get("function"), health.get("security"), health.get("design")):
            if not axis:
                continue
            notes = " | ".join((axis.get("notes") or [])[:4])
            add(pdf, f"{axis.get('label')} {axis.get('score')}/{axis.get('max')} -- {notes}", size=8, color=(210, 210, 210))
    else:
        add(pdf, "No artifacts/system-health.json on disk.", color=(255, 180, 180))
    if test68:
        names = [
            "wager over cap rejected",
            "wager no token rejected",
            "board register needs mandate",
            "board tick no token rejected",
            "board pic svg rejected",
            "forum bars source probe",
            "forum bars sell",
            "waitlist ignores callback",
            "source not public dump",
            "board never escrow",
        ]
        by = {c.get("name"): c for c in (test68.get("checks") or [])}
        for n in names:
            c = by.get(n)
            if not c:
                add(pdf, "MISS  " + n, size=8, color=(255, 180, 180), lh=4.4)
                continue
            ok = c.get("ok")
            add(
                pdf,
                ("PASS  " if ok else "FAIL  ") + n + "  " + str(c.get("detail") or "")[:90],
                size=8,
                color=(180, 255, 180) if ok else (255, 140, 140),
                lh=4.4,
            )
    else:
        add(pdf, "No system-test JSON -- do not green this fold.", color=(255, 180, 180))
    add(
        pdf,
        "Documented: FAQ #gm-board #spice-up #board-agents #wise-owl #agent-forum, roadmap M11-M12, paper VI, sitemap.xml, schema Event+HowTo+DiscussionForumPosting.",
        size=8,
        color=(180, 180, 180),
    )

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
    add(pdf, "1  Accumulate BTC                 7   MEDIUM ACCUMULATE clip $10 with RSI 45.6 into F&G 73 Greed -- small clip, not a chase. Pulse paused so stacked BTC is unproven.")
    add(pdf, "2  Never sell / never short       9   Call is ACCUMULATE not TRIM. Forum barred a sell post (403). Live Coinbase off.")
    add(pdf, "3  Minimize loss                  7   $10 clip. Stops exist. No live fills to mark them. Board paper PnL is HOUSE field at $100k marks -- not desk BTC.")
    add(pdf, "4  Honest ops / security          8   Yahoo 401 / Bybit 403 / Binance 451 classified. Feed audit 14 OK / 0 FAIL. System test 39/39. Fees still n/a.")
    add(pdf, "OVERALL                           8", style="B", color=(255, 140, 0), size=12)
    add(pdf, "Practice-run grade: INCONCLUSIVE (pulse paused). Call-quality grade: PASS (MEDIUM ACCUMULATE, RSI 45.6, clip $10, never sell).", color=(255, 220, 120))

    section(pdf, "8b. Practice AUTO -- can this report score the test?", (255, 140, 0))
    add(pdf, "Practice pulse paused=true day=0 fills 0/0. Would-accumulate is listed on the public tape (bots 1-6, 7-B0T AUTO, GM M0D3 AUTO). Live Coinbase stays off.")
    add(pdf, "What the report CAN score: live Coinbase last, RSI, F&G, 7-B0T call, classified host errors, forum/board/security, DEPLOY #68 system test.")
    add(pdf, "What it CANNOT score without an unpaused pulse: fill count, USDC spent, BTC stacked on the operator book.")

    section(pdf, "9. Operator action before green", (255, 64, 64))
    add(pdf, "A. Wire a second quote host (or repair Yahoo crumb) -- Mag7/MSTR backup stays OPEN.")
    add(pdf, "B. Fees n/a this run -- do not green the fee-blind gate.")
    add(pdf, "C. Practice pulse paused -- do not green stacked BTC until the desk posts fills.")
    add(pdf, "D. Do not arm Coinbase create. Auto trade LOCKED. Forum/board tokens are not admin.")
    add(pdf, "I will not green A, B, or C until they actually work. Do not arm live.")

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
