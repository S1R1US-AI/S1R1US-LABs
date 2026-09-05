import { Panel } from "@/components/shell";
import { money } from "@/components/helios-card";
import type { DeskSnapshot, WhalePrint } from "@/lib/desk/types";
import { cn, BTC_TONE, USD_TONE } from "@/lib/utils";

function ago(t: number) {
  const s = Math.max(0, Math.round((Date.now() - t) / 1000));
  if (s < 60) return `${s}s`;
  if (s < 3600) return `${Math.round(s / 60)}m`;
  return `${Math.round(s / 3600)}h`;
}

function compact(n: number) {
  const a = Math.abs(n);
  if (a >= 1e9) return `$${(a / 1e9).toFixed(2)}B`;
  if (a >= 1e6) return `$${(a / 1e6).toFixed(1)}M`;
  if (a >= 1e3) return `$${(a / 1e3).toFixed(0)}K`;
  return money(a, 0);
}

function sideClass(side: WhalePrint["side"]) {
  if (side === "buy") return "text-high";
  if (side === "sell") return "text-sell";
  return "text-medium";
}

export function WhaleTape({ snap }: { snap: DeskSnapshot | null }) {
  const rows = [...(snap?.whales ?? [])].sort((a, b) => b.t - a.t || Number(b.side === "buy") - Number(a.side === "buy"));
  const cutoff = Date.now() - 24 * 60 * 60 * 1000;
  const day = rows.filter((w) => w.t >= cutoff);
  const buyUsd = day.filter((w) => w.side === "buy").reduce((s, w) => s + w.usd, 0);
  const sellUsd = day.filter((w) => w.side === "sell").reduce((s, w) => s + w.usd, 0);
  const moveUsd = day.filter((w) => w.side === "move").reduce((s, w) => s + w.usd, 0);
  const flow = buyUsd + sellUsd;
  const buyPct = flow > 0 ? (buyUsd / flow) * 100 : 50;
  const volUsd = buyUsd + sellUsd + moveUsd;
  const volBtc = day.reduce((s, w) => s + w.btc, 0);
  const avgUsdHr = volUsd / 24;
  const avgBtcHr = volBtc / 24;
  const avgPrintUsd = day.length ? volUsd / day.length : 0;
  const avgPrintBtc = day.length ? volBtc / day.length : 0;
  const book24 = snap?.btc.volume24h;

  return (
    <Panel kicker="BTC WHALES" title="Large BTC Prints" className="h-full" kickerClass="text-medium">
      <div className="mb-3">
        <div className="flex h-2 overflow-hidden rounded-sm">
          <div className="bg-high" style={{ width: `${buyPct}%` }} />
          <div className="bg-sell" style={{ width: `${100 - buyPct}%` }} />
        </div>
        <p className="mt-2 font-mono text-xs text-muted">
          Newest first · FILO
          {day.length ? ` · ${day.length} prints / 24h` : rows.length ? ` · ${rows.length} prints` : null}
        </p>
      </div>
      {rows.length ? (
        <ul className="min-h-[60dvh] space-y-1">
          {rows.map((w, i) => (
            <li key={`${w.id}-${i}`} className="flex items-baseline justify-between gap-2 font-mono text-xs">
              <span className="w-8 shrink-0 text-muted">{ago(w.t)}</span>
              <span className="w-20 shrink-0 text-muted">{w.venue}</span>
              <span className={cn("w-10 shrink-0 uppercase", sideClass(w.side))}>{w.side}</span>
              <span className={cn("min-w-0 flex-1 text-right tabular-nums", BTC_TONE)}>
                {w.btc.toLocaleString("en-US", { maximumFractionDigits: w.btc >= 10 ? 0 : 2 })} BTC
              </span>
              <span className={cn("w-16 shrink-0 text-right tabular-nums", USD_TONE)}>{compact(w.usd)}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="min-h-[60dvh] text-sm text-muted">Waiting for Coinbase / Hyperliquid / OKX prints or ≥5 BTC on-chain outs.</p>
      )}
      <div className="mt-4 -mx-4 border-t border-rule px-4 pt-4 sm:-mx-5 sm:px-5">
        <p className="text-[11px] font-medium tracking-[0.14em] text-medium uppercase">24h whale print volume</p>
        <div className="mt-1 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
          <span className={cn("font-mono text-2xl font-semibold tabular-nums sm:text-3xl", BTC_TONE)}>
            {volBtc ? volBtc.toLocaleString("en-US", { maximumFractionDigits: volBtc >= 100 ? 0 : 2 }) : "—"} BTC
          </span>
          <span className={cn("font-mono text-2xl font-semibold tabular-nums sm:text-3xl", USD_TONE)}>
            {volUsd ? compact(volUsd) : "—"}
          </span>
        </div>
        <p className="mt-3 text-[11px] font-medium tracking-[0.14em] text-medium uppercase">24h average</p>
        <div className="mt-1 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
          <span className={cn("font-mono text-xl font-semibold tabular-nums sm:text-2xl", BTC_TONE)}>
            {avgBtcHr ? avgBtcHr.toLocaleString("en-US", { maximumFractionDigits: 2 }) : "—"} BTC/hr
          </span>
          <span className={cn("font-mono text-xl font-semibold tabular-nums sm:text-2xl", USD_TONE)}>
            {avgUsdHr ? `${compact(avgUsdHr)}/hr` : "—"}
          </span>
        </div>
        <p className="mt-1 font-mono text-xs text-muted">
          Avg print {avgPrintBtc ? `${avgPrintBtc.toLocaleString("en-US", { maximumFractionDigits: 3 })} BTC` : "—"} ·{" "}
          <span className={USD_TONE}>{avgPrintUsd ? compact(avgPrintUsd) : "—"}</span>
          {" · "}buy <span className={USD_TONE}>{compact(buyUsd)}</span> · sell{" "}
          <span className={USD_TONE}>{compact(sellUsd)}</span>
          {book24 != null ? (
            <>
              {" "}
              · Coinbase book {book24.toLocaleString("en-US", { maximumFractionDigits: 0 })} BTC / 24h
            </>
          ) : null}
        </p>
      </div>
      <p className="mt-3 text-xs text-muted">
        Most recent print first (FILO). Volume and average are this tape’s last 24 hours
        (Coinbase / Hyperliquid / OKX + mempool ≥5 BTC), not every whale in the market.
      </p>
    </Panel>
  );
}
