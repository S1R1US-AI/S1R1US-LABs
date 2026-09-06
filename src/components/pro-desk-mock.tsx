import { useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { Lock, Radio } from "lucide-react";
import { heliosCall, runBots } from "@/lib/desk/signal";
import { STARTING_CASH } from "@/lib/desk/store";
import { useDeskTape } from "@/lib/desk/tape-client";
import { LAUNCH_LIVE_TRADES } from "@/lib/launch/build";
import "@/styles-pro.css";

function money(n: number, d = 2) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: d });
}

function Spark({ candles }: { candles: { c: number }[] }) {
  const pts = candles.map((c) => c.c).filter((n) => Number.isFinite(n));
  if (pts.length < 2) return <div className="pro-chart" />;
  const min = Math.min(...pts);
  const max = Math.max(...pts);
  const span = max - min || 1;
  const w = 640;
  const h = 120;
  const d = pts
    .map((v, i) => {
      const x = (i / (pts.length - 1)) * w;
      const y = h - ((v - min) / span) * (h - 8) - 4;
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
  const up = pts[pts.length - 1]! >= pts[0]!;
  return (
    <svg className="pro-chart" viewBox={`0 0 ${w} ${h}`} aria-hidden>
      <path d={d} fill="none" stroke={up ? "var(--pro-up)" : "var(--pro-down)"} strokeWidth="1.6" />
    </svg>
  );
}

export function ProDeskMock() {
  const { snap } = useDeskTape();
  const briefs = useMemo(() => (snap ? runBots(snap) : []), [snap]);
  const call = useMemo(() => (snap ? heliosCall(snap, briefs, STARTING_CASH) : null), [snap, briefs]);
  const px = snap?.btc.price ?? null;
  const chg = snap?.btc.changePct ?? null;
  const up = chg != null && chg >= 0;
  const tradeOn = LAUNCH_LIVE_TRADES;
  const convClass = call?.conviction === "MEDIUM" ? "pro-medium" : call?.conviction === "HIGH" ? "pro-up" : "pro-down";
  const stanceClass = call?.stance === "ACCUMULATE" || call?.stance === "BUY" ? "pro-accum" : "pro-down";

  return (
    <div className="pro-desk">
      <header className="pro-top">
        <Link to="/" className="pro-mark">
          S1R1US
        </Link>
        <nav className="pro-nav" aria-label="Theme test">
          <Link to="/theme" className="is-on">
            Tape
          </Link>
          <Link to="/helios">Lab</Link>
          <Link to="/gm">GM</Link>
          <Link to="/agent">Agents</Link>
          <Link to="/compute">Compute</Link>
        </nav>
        <div className="pro-last">
          <span className="px tabular-nums">{px != null ? money(px, 2) : "—"}</span>
          <span className={up ? "pro-up" : "pro-down"}>
            {chg != null ? `${chg >= 0 ? "+" : ""}${chg.toFixed(2)}%` : ""}
          </span>
        </div>
        <span className={`pro-pill ${tradeOn ? "" : "lock"}`}>
          <Lock className="size-3" />
          {tradeOn ? "Trade on" : "Trade locked"}
        </span>
        <Link to="/login" className="pro-btn ghost compact">
          Sign in
        </Link>
      </header>

      <div className="pro-status">
        <span>
          <Radio className="mr-1 inline size-3" />
          <strong>Live tape</strong>
        </span>
        <span>
          Bot 7{" "}
          <strong className={convClass}>{call?.conviction ?? "—"}</strong>{" "}
          <strong className={stanceClass}>{call?.stance ?? "—"}</strong>
        </span>
        <span>
          Agents <strong>read-only</strong>
        </span>
        <span>
          Auto trade <strong className="pro-down">locked</strong>
        </span>
        <span>When unlocked: bots execute BTC on their Coinbase — keys never here</span>
      </div>

      <p className="pro-note">
        <strong>Theme test — current site is unchanged.</strong> Approve this chrome to restyle the live desk.
        TradingView / Coinbase Advanced density: ticker bar, watchlist, chart, ticket. CoinDesk-quiet type. Bot
        access is first-class status, not a footer FAQ. Leet names stay in copy; chrome is plain English.
      </p>

      <div className="pro-workspace">
        <aside className="pro-pane">
          <p className="pro-kicker">Bots 1–6</p>
          {briefs.map((b, i) => (
            <div key={b.id} className="pro-bot-row">
              <span className="pro-faint">{i + 1}</span>
              <span>{b.name.replace(/ Analyst$/i, "")}</span>
              <span className={b.stance === "ACCUMULATE" || b.stance === "BUY" ? "pro-accum" : "pro-muted"}>
                {b.stance}
              </span>
            </div>
          ))}
        </aside>

        <section className="pro-pane">
          <p className="pro-kicker">BTC-USD · Coinbase last</p>
          <p className={`pro-px-hero ${up ? "pro-up" : "pro-down"}`}>{px != null ? money(px, 2) : "—"}</p>
          <p className={up ? "pro-up" : "pro-down"}>
            {chg != null ? `${chg >= 0 ? "+" : ""}${chg.toFixed(2)}%` : "waiting on tape"}
          </p>
          <Spark candles={(snap?.candles ?? []).map((c) => ({ c: c.close }))} />
          <dl className="pro-metrics">
            <div className="pro-metric">
              <dt>RSI-14</dt>
              <dd>{snap?.rsi14 != null ? snap.rsi14.toFixed(1) : "—"}</dd>
            </div>
            <div className="pro-metric">
              <dt>F&G</dt>
              <dd>
                {snap?.fearGreed?.value ?? "—"} {snap?.fearGreed?.label ?? ""}
              </dd>
            </div>
            <div className="pro-metric">
              <dt>24h high</dt>
              <dd>{snap?.btc.high24h != null ? money(snap.btc.high24h, 0) : "—"}</dd>
            </div>
            <div className="pro-metric">
              <dt>24h vol</dt>
              <dd>{snap?.btc.volume24h != null ? `${(snap.btc.volume24h / 1e9).toFixed(2)}B` : "—"}</dd>
            </div>
          </dl>
        </section>

        <aside className="pro-pane pro-ticket">
          <p className="pro-kicker">Order ticket · Bot 7</p>
          <h3>
            <span className={convClass}>{call?.conviction ?? "—"}</span>{" "}
            <span className={stanceClass}>{call?.stance ?? "—"}</span>
          </h3>
          <p className="pro-thesis">
            Clip {call ? money(call.clipUsd, 0) : "—"} · preview only
          </p>
          <p className="pro-cli">{call?.cli ?? "coinbase products ticker BTC-USD"}</p>
          <div className="pro-actions">
            <button type="button" className="pro-btn primary" disabled>
              Preview buy
            </button>
            <button type="button" className="pro-btn" disabled>
              Create — locked
            </button>
            <Link to="/compute" className="pro-btn ghost">
              Ask Grok · BYO compute
            </Link>
          </div>
          <div className="pro-agent">
            <strong>Bot capability</strong>
            Other agents already read Bot 7 (poll 300s). They cannot trade on this host. When the operator
            unlocks auto trade, each bot runs Coinbase for Agents on an account it controls. Keys never sit
            here. Same call. Dry-run first.
          </div>
        </aside>
      </div>

      <div className="pro-blotter">
        <table>
          <thead>
            <tr>
              <th>Bot</th>
              <th>Stance</th>
              <th>Summary</th>
            </tr>
          </thead>
          <tbody>
            {briefs.map((b) => (
              <tr key={b.id}>
                <td>{b.name}</td>
                <td className={b.stance === "ACCUMULATE" || b.stance === "BUY" ? "pro-accum" : ""}>{b.stance}</td>
                <td className="pro-muted">{b.summary}</td>
              </tr>
            ))}
            {call ? (
              <tr>
                <td>Bot 7 · Helios</td>
                <td>
                  <span className={convClass}>{call.conviction}</span>{" "}
                  <span className={stanceClass}>{call.stance}</span>
                </td>
                <td className="pro-muted">{call.brief}</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <footer className="pro-foot">
        <span>Test theme · not indexed · not deployed chrome</span>
        <Link to="/">Return to current desk</Link>
        <Link to="/agent">Agent feed</Link>
      </footer>
    </div>
  );
}
