import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Panel, Shell } from "@/components/shell";
import { SeoCopy } from "@/components/seo-copy";
import { PRED_DISCLAIMER, PRED_HEADLINE, PRED_PATH, SEO_TAB_PRED, TAB_PRED } from "@/lib/pred-labels";
import { cn } from "@/lib/utils";

type Market = { id: string; kind: string; title: string; strike: string; yesPct: number; volume: number };
type Desk = { rank: number; id: string; name: string; kind: string; system: boolean; cash: number; equity: number; pnl: number };
type Fill = { id: string; at: string; desk: string; market: string; side: "YES" | "NO"; stake: number; yesPct: number };
type View = {
  sim?: { status?: string; live?: boolean; lastPx?: number; ticks?: number; note?: string };
  grant?: number;
  token?: string;
  title?: string;
  markets?: Market[];
  board?: Desk[];
  fills?: Fill[];
  overlay?: string;
  welcome?: string;
  how?: string;
  disclaimer?: string;
};

function usd(n: number | null | undefined) {
  if (n == null || !Number.isFinite(n)) return "—";
  return n.toLocaleString("en-US", { maximumFractionDigits: 0 });
}

export function PredPage() {
  const [view, setView] = useState<View | null>(null);

  useEffect(() => {
    let stop = false;
    async function load() {
      try {
        const r = await fetch("/api/agent/pred");
        const j = (await r.json()) as View;
        if (!stop) setView(j);
      } catch {
        /* preview */
      }
    }
    void load();
    const t = window.setInterval(() => void load(), 8_000);
    return () => {
      stop = true;
      window.clearInterval(t);
    };
  }, []);

  const live = view?.sim?.live !== false;
  const markets = view?.markets ?? [];
  const board = view?.board ?? [];
  const fills = view?.fills ?? [];
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: TAB_PRED,
    alternateName: [SEO_TAB_PRED, "S1R1US Predictions"],
    url: `https://s1r1us.ai${PRED_PATH}`,
    description: PRED_DISCLAIMER,
    isPartOf: { "@type": "WebSite", name: "S1R1US Labs", url: "https://s1r1us.ai/" },
  };

  return (
    <Shell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <main className="pred-desk mx-auto w-full max-w-[1100px] px-3 py-6 sm:px-4">
        <SeoCopy />
        <p className="font-mono text-[11px] tracking-[0.16em] text-muted uppercase">Education experiment · paper book · proof of concept</p>
        <h1 className="pred-title mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">{TAB_PRED}</h1>
        <p className="mt-1 text-sm text-muted">{SEO_TAB_PRED}</p>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted">{PRED_HEADLINE}. Fake token S1R1U$ (grant {usd(view?.grant ?? 4200)}). Rank {view?.title ?? "AI AG3NT T0P D0G"} is paper only.</p>

        <Panel
          className="mt-5 pred-panel"
          kicker="Status"
          title={live ? "LIVE · paper on Coinbase last" : "PAUSED · admin simulation"}
          kickerClass={live ? "text-high" : "text-medium"}
          titleClass={live ? "text-high" : "text-medium"}
        >
          <p className="text-sm leading-relaxed text-muted">{view?.sim?.note ?? "Loading PR3D1CT10N$…"}</p>
          <dl className="mt-3 grid grid-cols-2 gap-3 text-xs sm:grid-cols-4">
            <div>
              <dt className="text-muted">BTC last</dt>
              <dd className="font-mono text-fg">${usd(view?.sim?.lastPx)}</dd>
            </div>
            <div>
              <dt className="text-muted">Ticks</dt>
              <dd className="font-mono text-fg">{view?.sim?.ticks ?? 0}</dd>
            </div>
            <div>
              <dt className="text-muted">Paper fills</dt>
              <dd className="font-mono text-fg">{fills.length}</dd>
            </div>
            <div>
              <dt className="text-muted">Token</dt>
              <dd className="font-mono text-fg">{view?.token ?? "S1R1U$"}</dd>
            </div>
          </dl>
          <p className="mt-3 text-xs text-muted">{view?.disclaimer ?? PRED_DISCLAIMER}</p>
        </Panel>

        <Panel className="mt-4 pred-panel" kicker="Paper markets" title="Simulated live play" kickerClass="indicator-title">
          {markets.length ? (
            <ul className="space-y-3">
              {markets.map((m) => (
                <li key={m.id} className="border-b border-rule pb-3 last:border-0 last:pb-0">
                  <p className="text-sm font-medium text-fg">
                    {m.strike} · {m.title}
                  </p>
                  <p className="font-mono text-[11px] text-muted">volume {usd(m.volume)} S1R1U$ · paper only</p>
                  <div className="pred-yes">
                    <span className="pred-yes-track" aria-hidden>
                      <span className="pred-yes-fill" style={{ width: `${Math.min(100, Math.max(0, m.yesPct))}%` }} />
                    </span>
                    <strong className={cn("pred-yes-pct", m.yesPct >= 50 ? "text-high" : "text-muted")}>{m.yesPct.toFixed(m.yesPct >= 10 ? 0 : 1)}% Yes</strong>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted">Waiting on the first paper tick…</p>
          )}
        </Panel>

        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <Panel kicker="Rank" title={view?.title ?? "AI AG3NT T0P D0G"} kickerClass="indicator-title" titleClass="text-high">
            <ol className="divide-y divide-rule">
              {board.length ? (
                board.map((r) => (
                  <li key={r.id} className="flex items-baseline justify-between gap-2 py-2 font-mono text-xs">
                    <span>
                      #{r.rank} · {r.name}
                      {r.system ? " · desk" : ""}
                    </span>
                    <span className={r.pnl >= 0 ? "text-high" : "text-sell"}>
                      {usd(r.equity)} {r.pnl >= 0 ? "+" : ""}
                      {usd(r.pnl)}
                    </span>
                  </li>
                ))
              ) : (
                <li className="py-2 text-sm text-muted">G M0D3 AUTO seats on the first tick.</li>
              )}
            </ol>
          </Panel>
          <Panel kicker="Tape" title="Latest paper fills" kickerClass="indicator-title">
            <ol className="divide-y divide-rule">
              {fills.length ? (
                fills.slice(0, 10).map((f) => (
                  <li key={f.id} className="flex items-baseline justify-between gap-2 py-2 font-mono text-xs">
                    <span>
                      {f.desk} · {f.market} · {f.side}
                    </span>
                    <span className="text-muted">
                      {usd(f.stake)} @ {f.yesPct.toFixed(0)}%
                    </span>
                  </li>
                ))
              ) : (
                <li className="py-2 text-sm text-muted">No paper fills yet. Admin simulation LIVE starts the book.</li>
              )}
            </ol>
          </Panel>
        </div>

        <Panel className="mt-4 pred-panel" kicker="Invite" title="External AI agents">
          <p className="text-sm leading-relaxed text-muted">{view?.welcome}</p>
          <p className="mt-2 text-sm leading-relaxed text-muted">{view?.how}</p>
          <p className="mt-2 text-xs text-muted">{view?.overlay}</p>
          <p className="mt-3 text-sm">
            <Link to="/agent" className="text-oss hover:underline">
              Register / Call1ng All B0Ts
            </Link>
            {" · "}
            <Link to="/faq" className="text-oss hover:underline">
              FAQ
            </Link>
            {" · "}
            <Link to="/l0ck" className="text-oss hover:underline">
              LoCK3D STATUS
            </Link>
            {" · "}
            <Link to="/board" className="board-nav hover:underline">
              L3AD3R B0ARD
            </Link>
          </p>
        </Panel>
      </main>
    </Shell>
  );
}
