import { useMemo } from "react";
import { money, stanceClass } from "@/components/helios-card";
import { Panel } from "@/components/shell";
import { useDeskTape } from "@/lib/desk/tape-client";
import type { HeliosCall, PaperFill, Stance } from "@/lib/desk/types";
import { cn, BTC_TONE, USD_TONE } from "@/lib/utils";

function compact(n: number) {
  if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`;
  if (n >= 1e3) return `$${(n / 1e3).toFixed(0)}K`;
  return money(n, 0);
}

export function OrderBookPanel({
  stance,
  conviction,
  fills,
  mode,
}: {
  stance: Stance | null;
  conviction: HeliosCall["conviction"] | null;
  fills: PaperFill[];
  mode: "practice" | "live";
}) {
  const { snap } = useDeskTape();
  const book = snap?.heatmap ?? [];
  const last = snap?.btc.price ?? null;

  const maxUsd = useMemo(() => Math.max(1, ...book.map((b) => b.bidUsd + b.askUsd)), [book]);
  const bidUsd = book.reduce((s, b) => s + b.bidUsd, 0);
  const askUsd = book.reduce((s, b) => s + b.askUsd, 0);
  const buyBias = bidUsd + askUsd > 0 ? bidUsd / (bidUsd + askUsd) : 0.5;
  const buys = fills.filter((f) => f.side === "BUY");
  const sells = fills.filter((f) => f.side === "SELL");

  return (
    <div className="mt-4 grid gap-4 lg:grid-cols-2">
      <Panel kicker="Coinbase L2" title="Order book · buy / sell conviction">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-[11px] font-medium tracking-[0.08em] text-muted uppercase">Last</p>
            <p className={`font-mono text-lg tabular-nums ${BTC_TONE}`}>{last ? money(last, 0) : "—"}</p>
          </div>
          <div className="text-right">
            <p className="text-[11px] font-medium tracking-[0.08em] text-muted uppercase">7-B0T</p>
            <p className={cn("font-mono text-sm", stance ? stanceClass(stance) : "text-muted")}>
              {conviction ?? "—"} {stance ?? "WAITING"}
            </p>
          </div>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-[11px] uppercase tracking-[0.08em] rsi-above" style={{ color: "#3dff1a" }}>
              Buy (bids)
            </p>
            <p className={`font-mono tabular-nums ${USD_TONE}`}>{compact(bidUsd)}</p>
          </div>
          <div className="text-right">
            <p className="text-[11px] uppercase tracking-[0.08em]" style={{ color: "#ff1f1f" }}>
              Sell (asks)
            </p>
            <p className="font-mono tabular-nums" style={{ color: "#ff1f1f" }}>
              {compact(askUsd)}
            </p>
          </div>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-sm bg-rule">
          <div className="h-full" style={{ width: `${Math.round(buyBias * 100)}%`, background: "#3dff1a" }} />
        </div>
        <p className="mt-1 font-mono text-[11px] text-muted">{Math.round(buyBias * 100)}% bid notional in ±1.2% of last</p>
        {snap?.errors.length ? (
          <p className="mt-2 text-xs text-down">{snap.errors.join(" · ")}</p>
        ) : null}
        <ul className="mt-3 max-h-56 space-y-1 overflow-auto">
          {[...book].reverse().map((b) => (
            <li key={b.price} className="grid grid-cols-[1fr_auto_1fr] items-center gap-1 text-[11px]">
              <div className="flex justify-end">
                <span
                  className="h-3 rounded-sm"
                  style={{
                    width: `${Math.max(2, (b.bidUsd / maxUsd) * 100)}%`,
                    background: "#3dff1a",
                    opacity: 0.85,
                  }}
                />
              </div>
              <span className="w-16 text-center font-mono tabular-nums text-muted">{money(b.price, 0)}</span>
              <div className="flex justify-start">
                <span
                  className="h-3 rounded-sm"
                  style={{
                    width: `${Math.max(2, (b.askUsd / maxUsd) * 100)}%`,
                    background: "#ff1f1f",
                    opacity: 0.85,
                  }}
                />
              </div>
            </li>
          ))}
        </ul>
        {!book.length ? <p className="mt-2 text-sm text-muted">Pulling Coinbase L2…</p> : null}
      </Panel>

      <Panel kicker={mode === "live" ? "Live book" : "Practice book"} title="Buy / sell history">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <p>
            Buys <span className={USD_TONE}>{buys.length}</span>
          </p>
          <p className="text-right">
            Sells <span style={{ color: "#ff1f1f" }}>{sells.length}</span>
          </p>
        </div>
        {mode === "live" ? (
          <p className="mt-2 text-xs text-muted">
            Live execution is locked. This ledger stays empty until Live is unlocked. Coinbase is not
            contacted for fills.
          </p>
        ) : (
          <p className="mt-2 text-xs text-muted">Paper fills at Coinbase last. HIGH BUY / ACCUMULATE / TRIM only.</p>
        )}
        <ul className="mt-3 max-h-72 space-y-2 overflow-auto font-mono text-xs">
          {fills.length ? (
            fills.map((f) => (
              <li key={f.id} className="rounded-sm border border-rule/70 px-2 py-1.5">
                <p className="flex flex-wrap justify-between gap-2">
                  <span className={f.side === "BUY" ? USD_TONE : "text-sell"}>{f.side}</span>
                  <span className="text-muted">
                    {new Date(f.at).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </span>
                </p>
                <p className="mt-0.5">
                  <span className={USD_TONE}>{money(f.usd, 2)}</span>
                  {" · "}
                  <span className={BTC_TONE}>{f.btc.toFixed(6)} BTC</span>
                  {" @ "}
                  {money(f.price, 0)}
                </p>
                <p className="mt-0.5 line-clamp-2 text-muted">{f.note}</p>
              </li>
            ))
          ) : (
            <li className="text-muted">{mode === "live" ? "No live purchases yet." : "No practice purchases yet."}</li>
          )}
        </ul>
      </Panel>
    </div>
  );
}
