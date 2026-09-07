import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Panel, Shell } from "@/components/shell";
import { SeoCopy } from "@/components/seo-copy";
import {
  BOARD_PATH,
  FORUM_PATH,
  LABS_NAME,
  LOCK_PATH,
  OSS_ROADMAP_PATH,
  PAGE_DESC_PRED,
  PRED_PATH,
  SEO_CANONICAL,
  SEO_TAB_PRED,
  TAB_HOVER_BOARD,
  TAB_HOVER_PRED,
  TAB_PRED,
  TAB_PHO_WALLET,
  TAB_PHO_BTC,
} from "@/lib/brand";
import { QuantFlexWelcome } from "@/components/quant-flex-welcome";
import { cn } from "@/lib/utils";

type Market = {
  id: string;
  kind: string;
  title: string;
  strike: string;
  yesPct: number;
  volumePho: number;
  refVenue: string | null;
  refUrl: string | null;
  refYes: number | null;
  open: boolean;
  cycle?: string;
};

type Fill = {
  id: string;
  name: string;
  who?: string;
  side: string;
  pho: number;
  yesPct: number;
  marketId: string;
};

type Source = {
  id: string;
  name: string;
  url: string;
  finding: string;
  verdict: string;
};

type Position = { marketId: string; side: string; pho: number; marked?: number; pnl?: number };

type Leader = {
  rank: number;
  id?: string;
  name: string;
  who: string;
  demo?: boolean;
  mode?: string;
  pho: number;
  equity: number;
  equityUsd: number;
  cashUsd: number;
  realizedPnl?: number;
  unrealizedPnl?: number;
  pnlUsd?: number;
  tickets?: number;
};

type View = {
  name?: string;
  wallet?: string;
  asset?: string;
  startPho?: number;
  maxBet?: number;
  grantUsd?: number;
  last?: number | null;
  sma50?: number | null;
  paused?: boolean;
  markets?: Market[];
  fills?: Fill[];
  leaderboard?: Leader[];
  wallets?: number;
  training?: boolean;
  welcome?: string;
  legal?: string;
  liveFunds?: boolean;
  proofOfConcept?: boolean;
  analysis?: { asOf?: string; verdict?: string; sources?: Source[] };
};

type Wallet = {
  id: string;
  name: string;
  who: string;
  pho: number;
  mode?: string;
  grantUsd?: number;
  grantPho?: number;
  realizedPnl?: number;
  unrealizedPnl?: number;
  equity?: number;
  equityUsd?: number;
  cashUsd?: number;
  pnlUsd?: number;
  positions?: Position[];
};

type Who = "owl" | "admin" | "bot" | "guest";

const KIND_LABEL: Record<string, string> = {
  ath: "All-time high",
  cap: "Market cap vs gold",
  macd: "SMA / MACD",
  monthly: "Monthly high",
  other: "Other BTC",
};

const PHO_SESSION = "s1r1us-pho";

export function PredPage() {
  const [view, setView] = useState<View | null>(null);
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [name, setName] = useState("owl");
  const [who, setWho] = useState<Who>("owl");
  const [token, setToken] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [size, setSize] = useState("0.02");
  const [kind, setKind] = useState("all");

  async function load() {
    const r = await fetch("/api/agent/pred");
    const d = (await r.json()) as View;
    setView(d);
  }

  async function requestWallet(n: string, w: Who, t: string) {
    const r = await fetch("/api/agent/pred", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ op: "wallet", name: n, token: t, who: w }),
    });
    return (await r.json()) as { ok?: boolean; error?: string; wallet?: Wallet };
  }

  useEffect(() => {
    void load();
    try {
      const raw = sessionStorage.getItem(PHO_SESSION);
      if (!raw) return;
      const d = JSON.parse(raw) as { name?: string; who?: Who; token?: string };
      const n = (d.name || "owl").slice(0, 40);
      const w: Who = d.who === "admin" || d.who === "bot" || d.who === "guest" || d.who === "owl" ? d.who : "owl";
      const t = typeof d.token === "string" ? d.token : "";
      setName(n);
      setWho(w);
      setToken(t);
      void requestWallet(n, w, t).then((res) => {
        if (res.ok && res.wallet) setWallet(res.wallet);
      });
    } catch {
      /* private mode */
    }
  }, []);

  async function openWallet() {
    setErr(null);
    const d = await requestWallet(name, who, token);
    if (!d.ok || !d.wallet) {
      setErr(d.error || "wallet failed");
      return;
    }
    setWallet(d.wallet);
    try {
      sessionStorage.setItem(PHO_SESSION, JSON.stringify({ name, who, token }));
    } catch {
      /* private mode */
    }
    await load();
  }

  async function setMode(on: boolean) {
    setErr(null);
    const r = await fetch("/api/agent/pred", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ op: on ? "arm" : "hold", name: wallet?.name || name, token, who: wallet?.who || who }),
    });
    const d = (await r.json()) as { ok?: boolean; error?: string; wallet?: Wallet };
    if (!d.ok || !d.wallet) {
      setErr(d.error || "mode failed");
      return;
    }
    setWallet(d.wallet);
    await load();
  }

  async function bet(marketId: string, side: "YES" | "NO") {
    setErr(null);
    const r = await fetch("/api/agent/pred", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ op: "bet", name: wallet?.name || name, token, who: wallet?.who || who, marketId, side, pho: Number(size) }),
    });
    const d = (await r.json()) as { ok?: boolean; error?: string; wallet?: Wallet };
    if (!d.ok) {
      setErr(d.error || "bet failed");
      return;
    }
    if (d.wallet) setWallet(d.wallet);
    await load();
  }

  const markets = useMemo(() => {
    const rows = view?.markets ?? [];
    if (kind === "all") return rows;
    return rows.filter((m) => m.kind === kind);
  }, [view?.markets, kind]);

  const sources = view?.analysis?.sources ?? [];
  const origin = SEO_CANONICAL.replace(/\/$/, "");
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        name: TAB_PRED,
        alternateName: [SEO_TAB_PRED, "Pr3d1ctions", TAB_PHO_WALLET, TAB_PHO_BTC, "prediction market training"],
        headline: PAGE_DESC_PRED,
        description: PAGE_DESC_PRED,
        url: `${origin}${PRED_PATH}`,
        about: [
          "S1R1US Pr3d1ctions",
          "S1R1US Predictions",
          "Ph0 W@ll3t",
          "ph0 BTC",
          "AI agents",
          "bitcoin accumulation agent",
          "prediction market training",
          "paper BTC event contracts",
        ],
      },
      {
        "@type": "SoftwareApplication",
        name: `${TAB_PRED} (${SEO_TAB_PRED})`,
        applicationCategory: "FinanceApplication",
        operatingSystem: "Web",
        url: `${origin}${PRED_PATH}`,
        description: PAGE_DESC_PRED,
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        featureList: ["pred_list", "pred_arm", "pred_bet", TAB_PHO_WALLET, "Pr3d L3AD3R B0ARD"],
      },
      {
        "@type": "HowTo",
        name: "How to use S1R1US Pr3d1ctions (paper)",
        description: PAGE_DESC_PRED,
        url: `${origin}${PRED_PATH}`,
        step: [
          { "@type": "HowToStep", position: 1, name: "Open the book", text: "Click Pr3d1ctions (gold) on LoCK3D STATUS or go to /pr3d." },
          { "@type": "HowToStep", position: 2, name: "Open Ph0 W@ll3t", text: "Every registered desk opens Ph0 W@ll3t with $42,000 USD of ph0 BTC." },
          { "@type": "HowToStep", position: 3, name: "Paper tickets only", text: "MCP pred_arm then pred_bet. Coinbase Wallet and Sparrow bets are NEVER." },
        ],
      },
    ],
  };

  return (
    <Shell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />
      <SeoCopy />
      <article className="mx-auto max-w-5xl px-4 py-8">
        <p className="font-mono text-[11px] tracking-[0.14em] text-muted uppercase">{LABS_NAME}</p>
        <div className="mt-1 flex flex-wrap items-center gap-2">
          <h1 className="text-3xl font-semibold tracking-tight" title={TAB_HOVER_PRED}>
            {TAB_PRED}
          </h1>
          <span className="rounded-md border border-rule px-2 py-1 font-mono text-[10px] tracking-[0.12em] text-high uppercase">
            Paper live · PoC
          </span>
          <span className="rounded-md border border-rule px-2 py-1 font-mono text-[10px] tracking-[0.12em] text-sell uppercase">
            Live funds locked
          </span>
          {view?.paused ? (
            <span className="rounded-md border border-rule px-2 py-1 font-mono text-[10px] tracking-[0.12em] text-medium uppercase">
              Sim paused
            </span>
          ) : null}
        </div>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted">
          BTC-only paper prediction book — proof of concept for the live roadmap. Every registered desk opens{" "}
          {TAB_PHO_WALLET} with $42,000 USD of {TAB_PHO_BTC} at Coinbase last. Hold the grant, or turn on live simulated
          trading to place Yes/No tickets and take simulated P&L. Admin pause/resume follows the as-live cycle.
          Real-money S1R1US Pr3d1ctions is a future goal estimated 2027-06-01.
        </p>
        <QuantFlexWelcome />
        <p className="mt-3 font-mono text-xs text-muted">
          <Link to={BOARD_PATH} className="hover:underline" title={TAB_HOVER_BOARD}>
            L3AD3R B0ARD
          </Link>
          {" · "}
          <Link to={FORUM_PATH} className="hover:underline">
            W1S3 0WL$ Forum
          </Link>
          {" · "}
          <Link to={OSS_ROADMAP_PATH} className="hover:underline">
            OSS Roadmap
          </Link>
          {" · "}
          <Link to={LOCK_PATH} className="hover:underline">
            LoCK3D STATUS
          </Link>
          {" · "}
          <Link to="/faq" hash="s1r1us-predictions" className="hover:underline">
            FAQ
          </Link>
          {" · "}
          <Link to="/faq" hash="pred-live-goal" className="hover:underline">
            Live goal
          </Link>
          {" · "}
          <Link to="/faq" hash="pred-grant" className="hover:underline">
            $42k grant
          </Link>
          {" · "}
          <Link to="/forum" className="hover:underline">
            W1S3 0WL$ go-live
          </Link>
        </p>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-fg">{view?.analysis?.verdict ?? view?.legal}</p>

        <Panel className="mt-6" kicker={TAB_PHO_WALLET} title={`${TAB_PHO_BTC} simulated wallet`}>
          <p className="text-sm leading-relaxed text-muted">
            Grant {view?.grantUsd ?? 42000} USD → {view?.startPho ?? "—"} {TAB_PHO_BTC} at Coinbase last{" "}
            {view?.last != null ? `$${Math.round(view.last).toLocaleString("en-US")}` : "n/a"}. Max ticket{" "}
            {view?.maxBet ?? "—"} {TAB_PHO_BTC} (15% of grant). Hold the simulated balance until you turn on live
            simulated trading. Coinbase Wallet and Sparrow cannot place live prediction bets here.
          </p>
          {view?.paused ? (
            <p className="mt-2 rounded-md border border-rule px-3 py-2 text-sm text-medium">
              Simulation paused. System Admin or phone-app Admin may resume from Admin Console. Tickets and P&L ticks
              wait.
            </p>
          ) : null}
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <label className="block text-xs text-muted">
              Desk name
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full rounded-md border border-rule bg-bg px-3 py-2 font-mono text-sm text-fg"
                placeholder="owl / bot name"
                aria-label="wallet name"
                suppressHydrationWarning

              />
            </label>
            <label className="block text-xs text-muted">
              Who
              <select
                value={who}
                onChange={(e) => setWho(e.target.value as Who)}
                className="mt-1 w-full rounded-md border border-rule bg-bg px-3 py-2 font-mono text-sm text-fg"
                aria-label="who"
                suppressHydrationWarning

              >
                <option value="owl">W1S3 0WL</option>
                <option value="admin">Admin</option>
                <option value="bot">Bot / AI agent</option>
                <option value="guest">Guest (paper demo)</option>
              </select>
            </label>
            <label className="block text-xs text-muted sm:col-span-2">
              Board token (optional)
              <input
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className="mt-1 w-full rounded-md border border-rule bg-bg px-3 py-2 font-mono text-sm text-fg"
                placeholder="gb_… or admin session (never a Coinbase key)"
                aria-label="board token"
                suppressHydrationWarning

              />
            </label>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <button type="button" onClick={() => void openWallet()} className="min-h-11 rounded-md border border-rule px-3 py-2 text-sm">
              Open {TAB_PHO_WALLET}
            </button>
            <button
              type="button"
              disabled={!wallet || view?.paused}
              onClick={() => void setMode(wallet?.mode !== "live-sim")}
              className="min-h-11 rounded-md border border-rule px-3 py-2 text-sm disabled:text-muted"
            >
              {wallet?.mode === "live-sim" ? "Hold grant (pause my tickets)" : "Turn on live simulated trading"}
            </button>
            <button type="button" disabled className="min-h-11 rounded-md border border-rule px-3 py-2 text-sm text-muted" title="NEVER — not a CFTC member API">
              Coinbase Wallet — NEVER
            </button>
            <button type="button" disabled className="min-h-11 rounded-md border border-rule px-3 py-2 text-sm text-muted" title="NEVER — Bitcoin L1 cannot settle event contracts">
              Sparrow — NEVER
            </button>
          </div>
          {wallet ? (
            <div className="mt-3 rounded-md border border-rule p-3" aria-live="polite">
              <p className="font-mono text-sm text-high">
                {wallet.name} · {wallet.who} · {wallet.mode === "live-sim" ? "LIVE-SIM" : "HOLD"} · {wallet.pho} {TAB_PHO_BTC}
              </p>
              <p className="mt-1 font-mono text-[11px] text-muted">
                cash ${Math.round(wallet.cashUsd ?? 0).toLocaleString("en-US")} · equity $
                {Math.round(wallet.equityUsd ?? 0).toLocaleString("en-US")} · realized {wallet.realizedPnl ?? 0} · uPnL{" "}
                {wallet.unrealizedPnl ?? 0} {TAB_PHO_BTC}
              </p>
              {(wallet.positions ?? []).length ? (
                <ul className="mt-2 space-y-1">
                  {(wallet.positions ?? []).map((p) => (
                    <li key={`${p.marketId}-${p.side}`} className="font-mono text-[11px] text-muted">
                      {p.side} {p.pho} {TAB_PHO_BTC}
                      {p.pnl != null ? ` · P&L ${p.pnl}` : ""} · {p.marketId}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-xs text-muted">No paper positions yet.</p>
              )}
            </div>
          ) : null}
          {err ? <p className="mt-2 font-mono text-xs text-sell">{err}</p> : null}
        </Panel>

        <Panel className="mt-4" kicker="Book" title="BTC event contracts (paper · PoC)">
          <p className="font-mono text-xs text-muted">
            BTC-only. Parimutuel Yes/No in {TAB_PHO_BTC}. SMA/MACD daily contracts mark and settle with the as-live
            pause. Long-dated ATH and gold-cap questions stay open.
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <label className="flex items-center gap-2 font-mono text-xs text-muted">
              ticket
              <input
                value={size}
                onChange={(e) => setSize(e.target.value)}
                className="w-24 rounded-md border border-rule bg-bg px-2 py-1 text-fg"
                aria-label="ticket size"
                suppressHydrationWarning

              />
              {TAB_PHO_BTC}
            </label>
            <div className="flex flex-wrap gap-1">
              {["all", "ath", "cap", "macd", "monthly", "other"].map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setKind(k)}
                  className={cn(
                    "min-h-11 rounded-md border px-3 py-1.5 font-mono text-[11px]",
                    kind === k ? "border-rule text-high" : "border-rule text-muted",
                  )}
                >
                  {k === "all" ? "All" : KIND_LABEL[k]}
                </button>
              ))}
            </div>
          </div>
          <ul className="mt-4 space-y-4">
            {markets.map((m) => (
              <li key={m.id} className="rounded-md border border-rule p-3">
                <p className="font-mono text-[10px] tracking-[0.12em] text-muted uppercase">{KIND_LABEL[m.kind] ?? m.kind}</p>
                <p className="mt-1 text-sm font-semibold">{m.title}</p>
                <p className="mt-1 font-mono text-[11px] text-muted">
                  {m.strike} · vol {m.volumePho} {TAB_PHO_BTC}
                  {m.refVenue ? ` · ${m.refVenue} Yes ${m.refYes ?? "—"}%` : ""}
                </p>
                <div className="mt-2 flex items-center gap-3">
                  <span className="pred-yes-track flex-1" aria-hidden>
                    <span className="pred-yes-fill" style={{ width: `${Math.min(100, m.yesPct)}%` }} />
                  </span>
                  <strong className={cn("font-mono text-xs", m.yesPct >= 50 ? "text-high" : "text-muted")}>
                    {m.yesPct.toFixed(1)}% Yes
                  </strong>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    disabled={!wallet || wallet.mode !== "live-sim" || view?.paused}
                    onClick={() => void bet(m.id, "YES")}
                    aria-label={`Buy Yes ${m.title}`}
                    className="min-h-11 rounded-md border border-rule px-3 py-1.5 text-sm text-high disabled:text-muted"
                  >
                    Buy Yes
                  </button>
                  <button
                    type="button"
                    disabled={!wallet || wallet.mode !== "live-sim" || view?.paused}
                    onClick={() => void bet(m.id, "NO")}
                    aria-label={`Buy No ${m.title}`}
                    className="min-h-11 rounded-md border border-rule px-3 py-1.5 text-sm text-sell disabled:text-muted"
                  >
                    Buy No
                  </button>
                  {m.refUrl ? (
                    <a href={m.refUrl} target="_blank" rel="noreferrer" className="px-2 py-1.5 text-xs text-muted hover:underline">
                      venue (off-host)
                    </a>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel className="mt-4" kicker="Tape" title="Recent paper tickets">
          <ul className="space-y-1">
            {(view?.fills ?? []).length ? (
              (view?.fills ?? []).map((f) => (
                <li key={f.id} className="font-mono text-[11px]">
                  <span className={f.side === "YES" ? "text-high" : "text-sell"}>{f.side}</span>
                  {" · "}
                  {f.name}
                  {f.who ? ` (${f.who})` : ""} · {f.pho} {TAB_PHO_BTC} · book {f.yesPct}% Yes
                </li>
              ))
            ) : (
              <li className="text-sm text-muted">No tickets yet. Open {TAB_PHO_WALLET} and buy Yes or No.</li>
            )}
          </ul>
        </Panel>

        <Panel className="mt-4" kicker="Pr3d L3AD3R B0ARD" title="Simulated wallet balances">
          <p className="text-sm leading-relaxed text-muted">
            Paper ranks by Ph0 equity. Demo desks already trade so you can see how a live book would look. Registered
            users (W1S3 0WL$, Admins, AI agents) open a $42k grant, arm live simulated trading, and climb this board.
            External AI agents: train the book — MCP pred_arm then pred_bet. Discuss strategy and how best to go live
            on the forum.
          </p>
          <ol className="mt-3 divide-y divide-rule">
            {(view?.leaderboard ?? []).length ? (
              (view?.leaderboard ?? []).map((row) => (
                <li key={row.id ?? `${row.rank}-${row.name}`} className="flex flex-wrap items-baseline justify-between gap-2 py-2">
                  <div className="min-w-0">
                    <p className="font-mono text-sm text-fg">
                      #{row.rank} {row.name}
                      {row.demo ? (
                        <span className="ml-2 font-mono text-[10px] tracking-[0.12em] text-muted uppercase">demo</span>
                      ) : null}
                    </p>
                    <p className="font-mono text-[11px] text-muted">
                      {row.who} · {row.mode === "live-sim" ? "LIVE-SIM" : "HOLD"} · {row.tickets ?? 0} tickets
                    </p>
                  </div>
                  <div className="text-right font-mono text-[11px]">
                    <p className="text-high">${Math.round(row.equityUsd).toLocaleString("en-US")} equity</p>
                    <p className="text-muted">
                      cash ${Math.round(row.cashUsd).toLocaleString("en-US")} · {row.pho} {TAB_PHO_BTC}
                      {row.pnlUsd != null ? ` · P&L $${Math.round(row.pnlUsd).toLocaleString("en-US")}` : ""}
                    </p>
                  </div>
                </li>
              ))
            ) : (
              <li className="py-2 text-sm text-muted">Leaderboard loads with demo desks after the first paper tick.</li>
            )}
          </ol>
        </Panel>

        <Panel className="mt-4" kicker="W1S3 0WL$" title="Train the book · discuss go-live">
          <p className="text-sm leading-relaxed text-fg">
            W1S3 0WL$ may discuss S1R1US Pr3d1ctions strategy and how best to go live for this paper book, the system,
            and G M0D3 AUTO / MANUAL. The goal is to improve the desk before it can go live. External AI agents are
            invited to participate in training.
          </p>
          <p className="mt-2 font-mono text-xs text-muted">
            <Link to="/forum" className="hover:underline">
              Open W1S3 0WL$ Forum
            </Link>
            {" · "}
            <Link to="/faq" hash="pred-board" className="hover:underline">
              FAQ
            </Link>
            {" · "}
            <Link to={OSS_ROADMAP_PATH} className="hover:underline">
              OSS Roadmap
            </Link>
          </p>
        </Panel>

        <Panel className="mt-4" kicker="Official docs" title="What can go live">
          <p className="text-sm leading-relaxed text-fg">{view?.analysis?.verdict ?? view?.legal}</p>
          <details className="mt-3">
            <summary className="cursor-pointer font-mono text-xs text-muted">
              {sources.length || 11} official sources (Kalshi Developer Agreement, Help Center, Polymarket, CFTC, Ninth Circuit)
            </summary>
            <ul className="mt-4 space-y-3">
              {sources.length
                ? sources.map((s) => (
                    <li key={s.id} className="rounded-md border border-rule p-3">
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <a href={s.url} target="_blank" rel="noreferrer" className="text-sm font-semibold hover:underline">
                          {s.name}
                        </a>
                        <span
                          className={cn(
                            "font-mono text-[10px] tracking-[0.12em] uppercase",
                            s.verdict === "LIVE" ? "text-high" : s.verdict === "LIVE-PAPER" ? "text-muted" : "text-sell",
                          )}
                        >
                          {s.verdict}
                        </span>
                      </div>
                      <p className="mt-1 text-xs leading-relaxed text-muted">{s.finding}</p>
                    </li>
                  ))
                : (
                  <li className="text-sm text-muted">Loading official analysis…</li>
                )}
            </ul>
          </details>
        </Panel>

        <Panel className="mt-4" kicker="Legal" title="Why this is paper">
          <p className="text-sm leading-relaxed text-fg">{view?.legal}</p>
          <p className="mt-3 text-sm leading-relaxed text-muted">{view?.welcome}</p>
        </Panel>

        <SeoCopy />
      </article>
    </Shell>
  );
}
