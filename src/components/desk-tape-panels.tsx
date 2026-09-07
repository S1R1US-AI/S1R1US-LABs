import { useState, type ReactNode } from "react";
import { Activity, ArrowDownRight, ArrowUpRight } from "lucide-react";
import { money } from "@/components/helios-card";
import { Panel } from "@/components/shell";
import { GOLD_TICKERS, SILVER_TICKERS } from "@/lib/desk/proxy-book";
import type { DeskSnapshot, HeliosCall, PredictionKind, PredictionMarket } from "@/lib/desk/types";
import { PRED_KIND_LABEL } from "@/lib/desk/prediction-markets";
import { cn, kimchiHex, kimchiTone } from "@/lib/utils";

export function Stat({
  label,
  labelNode,
  value,
  hint,
  up,
  valueClass,
  labelClass,
}: {
  label?: string;
  labelNode?: ReactNode;
  value: string;
  hint?: string;
  up?: boolean;
  valueClass?: string;
  labelClass?: string;
}) {
  const hot = valueClass === "rsi-below" ? "#ff1f1f" : valueClass === "rsi-above" ? "#3dff1a" : undefined;
  return (
    <div>
      <p className={cn("text-[11px] tracking-[0.14em] uppercase", !labelNode && (labelClass || "text-muted"))} style={!labelNode && hot ? { color: hot } : undefined}>
        {labelNode ?? label}
      </p>
      <p className={cn("mt-1 text-lg tabular-nums", valueClass)} style={hot ? { color: hot } : undefined}>
        {value}
      </p>
      {hint ? (
        <p className={cn("text-xs", up == null ? "text-muted" : up ? "text-up" : "text-down")}>
          {hint}
        </p>
      ) : null}
    </div>
  );
}

function asiaVenueClass(id: string) {
  if (id === "upbit") return "upbit-blue";
  if (id === "bithumb") return "asia-bithumb";
  if (id === "hashkey") return "asia-hashkey";
  if (id === "okx") return "asia-okx";
  if (id === "htx") return "asia-htx";
  return "text-fg";
}

export function AsiaPanel({ snap }: { snap: DeskSnapshot | null }) {
  const a = snap?.asia;
  const [open, setOpen] = useState(false);
  const fmtPrem = (n: number | null | undefined) =>
    n == null ? "\u2014" : `${n >= 0 ? "+" : ""}${n.toFixed(2)}%`;
  return (
    <Panel className="mt-4" kicker="KR \u00b7 HK \u00b7 CN  \u00b7  Binance blocked" title="Asia bitcoin tape" kickerClass="indicator-title" titleClass="indicator-title">
      <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} className="flex w-full flex-wrap items-baseline justify-between gap-x-6 gap-y-2 rounded-md py-1 text-left hover:bg-fg/4">
        <span className="font-mono text-sm">
          <span className="text-muted">{a?.session ?? "\u2014"}</span>
          <span className="mx-2 text-muted">\u00b7</span>
          <span className={kimchiTone(a?.kimchiPct)} style={{ color: kimchiHex(a?.kimchiPct) }}>kimchi {fmtPrem(a?.kimchiPct)}</span>
          <span className="mx-2 text-muted">\u00b7</span>
          <span className={kimchiTone(a?.hkPremiumPct)} style={{ color: kimchiHex(a?.hkPremiumPct) }}>HK {fmtPrem(a?.hkPremiumPct)}</span>
          <span className="mx-2 text-muted">\u00b7</span>
          <span className={kimchiTone(a?.cnyOtc.premiumPct)} style={{ color: kimchiHex(a?.cnyOtc.premiumPct) }}>CNY {fmtPrem(a?.cnyOtc.premiumPct)}</span>
        </span>
        <span className="shrink-0 font-mono text-[11px] expand-ctl">{open ? "collapse" : "expand"}</span>
      </button>
      {open ? (
        <>
          <div className="mb-4 mt-3 flex flex-wrap gap-6 font-mono text-sm">
            <div><p className="text-[11px] text-muted">Session</p><p className="mt-1">{a?.session ?? "\u2014"}</p></div>
            <div>
              <p className="text-[11px] text-muted"><span className="upbit-blue">Upbit</span><span> vs </span><span className="coinbase-orange">Coinbase</span></p>
              <p className={cn("mt-1", kimchiTone(a?.kimchiPct))} style={{ color: kimchiHex(a?.kimchiPct) }}>{fmtPrem(a?.kimchiPct)}</p>
            </div>
            <div>
              <p className="text-[11px] asia-hashkey">HashKey HK</p>
              <p className={cn("mt-1", kimchiTone(a?.hkPremiumPct))} style={{ color: kimchiHex(a?.hkPremiumPct) }}>{fmtPrem(a?.hkPremiumPct)}</p>
            </div>
            <div>
              <p className="text-[11px] asia-cny">CNY OTC USDT</p>
              <p className="mt-1 tabular-nums">{a?.cnyOtc.usdtCny != null ? a.cnyOtc.usdtCny.toFixed(3) : "\u2014"}{" "}
                <span className={kimchiTone(a?.cnyOtc.premiumPct)} style={{ color: kimchiHex(a?.cnyOtc.premiumPct) }}>{fmtPrem(a?.cnyOtc.premiumPct)}</span>
              </p>
            </div>
          </div>
          <ul className="space-y-2 font-mono text-sm">
            {(a?.venues ?? []).map((v) => (
              <li key={v.id} className="flex items-baseline justify-between gap-3">
                <span className="w-8 shrink-0 text-muted">{v.region}</span>
                <span className={cn("min-w-0 flex-1 truncate", asiaVenueClass(v.id))}>{v.name}</span>
                <span className="tabular-nums">{v.lastUsd != null ? money(v.lastUsd, 0) : "\u2014"}</span>
                <span className={cn("w-16 shrink-0 text-right tabular-nums", kimchiTone(v.premiumPct))} style={{ color: kimchiHex(v.premiumPct) }}>{fmtPrem(v.premiumPct)}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-muted">Premiums vs Coinbase USD. Korea is KRW converted at Frankfurter FX. China onshore trading is banned \u2014 HTX is the offshore proxy, CNY OTC is OKX P2P USDT/CNY. HashKey is the SFC-licensed Hong Kong book. No Binance key, no Binance host.</p>
        </>
      ) : null}
    </Panel>
  );
}

const FLOW_IN = "text-high";
const FLOW_OUT = "text-[#8a918c]";
const FLOW_FLAT = "text-tbill";
function flowClass(flow: string) {
  if (flow === "INFLOW") return FLOW_IN;
  if (flow === "OUTFLOW") return FLOW_OUT;
  return FLOW_FLAT;
}
function premClass(n: number | null | undefined) {
  if (n == null) return FLOW_OUT;
  if (n >= 1.5) return FLOW_IN;
  if (n <= -1.5) return FLOW_OUT;
  return FLOW_FLAT;
}

export function EmFlowPanel({ snap }: { snap: DeskSnapshot | null }) {
  const em = snap?.em;
  const fmtPrem = (n: number | null | undefined) => n == null ? "\u2014" : `${n >= 0 ? "+" : ""}${n.toFixed(2)}%`;
  return (
    <Panel className="mt-4" kicker="UAE \u00b7 ME \u00b7 RU \u00b7 AF \u00b7 SA  \u00b7  free public books" title="EM bitcoin flow" kickerClass="indicator-title" titleClass="indicator-title">
      <div className="mb-4 flex flex-wrap gap-6 font-mono text-sm">
        <div><p className={cn("text-[11px]", FLOW_IN)}>Inflow</p><p className={cn("mt-1 tabular-nums", FLOW_IN)}>{em?.net.inflow ?? "\u2014"}</p></div>
        <div><p className={cn("text-[11px]", FLOW_OUT)}>Outflow</p><p className={cn("mt-1 tabular-nums", FLOW_OUT)}>{em?.net.outflow ?? "\u2014"}</p></div>
        <div><p className={cn("text-[11px]", FLOW_FLAT)}>Flat</p><p className={cn("mt-1 tabular-nums", FLOW_FLAT)}>{em?.net.flat ?? "\u2014"}</p></div>
      </div>
      <ul className="space-y-3">
        {(em?.regions ?? []).map((r) => (
          <li key={r.id} className="border-t border-line/60 pt-3 first:border-0 first:pt-0">
            <div className="flex items-baseline justify-between gap-3 font-mono text-sm">
              <span className={flowClass(r.flow)}>{r.name}</span>
              <span className={cn("uppercase tracking-wide", flowClass(r.flow))}>{r.flow}</span>
              <span className={cn("tabular-nums", flowClass(r.flow))}>{fmtPrem(r.premiumPct)}</span>
            </div>
            <ul className="mt-1 space-y-1 font-mono text-xs">
              {r.venues.map((v) => (
                <li key={v.id} className="flex items-baseline justify-between gap-3">
                  <span className="min-w-0 truncate text-muted">{v.name}</span>
                  <span className={cn("tabular-nums", premClass(v.premiumPct))}>{fmtPrem(v.premiumPct)}</span>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs text-muted">INFLOW = local BTC or USDT trading rich vs USD (demand / capital into bitcoin). OUTFLOW = trading cheap (selling). Spot: BitOasis AED, Luno ZAR/NGN, Mercado BRL, Buda CLP/COP vs Coinbase. P2P: OKX USDT vs open.er-api FX; Russia is Rapira USDT/RUB. Threshold \u00b11.5%. Binance is not used.</p>
    </Panel>
  );
}

export function Quotes({ snap }: { snap: DeskSnapshot | null }) {
  const rows = snap?.quotes ?? [];
  const [open, setOpen] = useState(false);
  const top = rows.slice(0, 5);
  const rest = rows.slice(5);
  return (
    <Panel kicker="Sector / proxy" title="Public quotes" kickerClass="indicator-title" titleClass="indicator-title">
      <QuoteList rows={top} />
      {rest.length ? (
        <>
          <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} className="mt-2 flex w-full items-baseline justify-between gap-3 rounded-md py-1 text-left hover:bg-fg/4">
            <span className="font-mono text-sm text-high">Top 5 shown \u00b7 {rows.length} quotes</span>
            <span className="shrink-0 font-mono text-[11px] expand-ctl">{open ? "collapse" : `expand ${rest.length} more`}</span>
          </button>
          {open ? <QuoteList rows={rest} /> : null}
        </>
      ) : null}
    </Panel>
  );
}

function QuoteList({ rows }: { rows: NonNullable<DeskSnapshot["quotes"]> }) {
  const gold = new Set<string>(GOLD_TICKERS);
  const silver = new Set<string>(SILVER_TICKERS);
  return (
    <ul className="space-y-2 font-mono text-sm">
      {rows.map((q) => (
        <li key={q.symbol} className="flex items-center justify-between gap-2">
          <span className={silver.has(q.symbol) ? "silver-css" : gold.has(q.symbol) ? "gold-css" : "coinbase-orange"}>{q.symbol}</span>
          <span className="tabular-nums">{q.last != null ? money(q.last, 2) : "\u2014"}</span>
          <span className={cn("flex items-center gap-0.5 tabular-nums", (q.changePct ?? 0) >= 0 ? "text-up" : "text-down")}>
            {(q.changePct ?? 0) >= 0 ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
            {q.changePct != null ? `${q.changePct.toFixed(2)}%` : "\u2014"}
          </span>
        </li>
      ))}
    </ul>
  );
}

export function WirePanel({ snap }: { snap: DeskSnapshot | null }) {
  const filings = snap?.filings ?? [];
  const headlines = snap?.headlines ?? [];
  const preds = snap?.predictionMarkets ?? [];
  const [open, setOpen] = useState(true);
  return (
    <Panel kicker="EDGAR \u00b7 Free wire" title="Filings & headlines" kickerClass="indicator-title" titleClass="indicator-title">
      <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} className="flex w-full items-baseline justify-between gap-3 rounded-md py-1 text-left hover:bg-fg/4">
        <span className="font-mono text-sm text-fg">{filings.length} filings \u00b7 {headlines.length} wire \u00b7 {preds.length} BTC bets</span>
        <span className="shrink-0 font-mono text-[11px] expand-ctl">{open ? "collapse" : "expand"}</span>
      </button>
      {open ? (
        <>
          <div className="mt-3 grid gap-6 sm:grid-cols-2">
            <div>
              <p className="mb-2 font-mono text-[11px] tracking-[0.12em] text-muted uppercase">SEC</p>
              <ul className="space-y-2 text-sm">
                {filings.slice(0, 6).map((f, i) => (
                  <li key={`${f.cik}-${f.filed}-${i}`}>
                    <p className="font-mono text-[11px] text-muted">{f.name} \u00b7 {f.form} \u00b7 {f.filed}</p>
                    <p className="truncate">{f.title}</p>
                  </li>
                ))}
                {!filings.length ? <li className="text-muted">No filings this cycle.</li> : null}
              </ul>
            </div>
            <div>
              <p className="mb-2 font-mono text-[11px] tracking-[0.12em] text-muted uppercase">Wire</p>
              <ul className="space-y-2 text-sm">
                {headlines.slice(0, 6).map((h) => (
                  <li key={h.url}>
                    <p className="font-mono text-[11px] text-muted">{h.source}</p>
                    <a href={h.url} target="_blank" rel="noreferrer" className="line-clamp-2 hover:underline">{h.title}</a>
                  </li>
                ))}
                {!headlines.length ? <li className="text-muted">No headlines this cycle.</li> : null}
              </ul>
            </div>
          </div>
          <PredictionTape rows={preds} />
        </>
      ) : null}
    </Panel>
  );
}

function volShort(n: number | null) {
  if (n == null || !Number.isFinite(n)) return "\u2014";
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}k`;
  return `$${n.toFixed(0)}`;
}

function PredictionTape({ rows }: { rows: PredictionMarket[] }) {
  const groups: PredictionKind[] = ["ath", "monthly", "other"];
  return (
    <div className="pred-tape mt-6">
      <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
        <p className="font-mono text-[11px] tracking-[0.12em] text-muted uppercase">BTC prediction markets</p>
        <p className="text-xs text-muted">Polymarket \u00b7 Kalshi \u00b7 display only \u00b7 this host never takes bets</p>
      </div>
      {rows.length ? (
        <div className="grid gap-4 lg:grid-cols-3">
          {groups.map((kind) => {
            const list = rows.filter((r) => r.kind === kind);
            return (
              <div key={kind} className="pred-col">
                <p className="pred-col-h">{PRED_KIND_LABEL[kind]}</p>
                <ul className="space-y-2.5 text-sm">
                  {list.length ? list.map((r) => (
                    <li key={r.id} className="pred-row">
                      <a href={r.url} target="_blank" rel="noreferrer" className="pred-title hover:underline">{r.strike ? `${r.strike}` : r.title}</a>
                      <p className="font-mono text-[11px] text-muted">{r.venue} \u00b7 {volShort(r.volumeUsd)}</p>
                      <div className="pred-yes">
                        <span className="pred-yes-track" aria-hidden>
                          <span className="pred-yes-fill" style={{ width: `${Math.min(100, Math.max(0, r.yesPct ?? 0))}%` }} />
                        </span>
                        <strong className={cn("pred-yes-pct", (r.yesPct ?? 0) >= 50 ? "text-high" : "text-muted")}>
                          {r.yesPct != null ? `${r.yesPct.toFixed(r.yesPct >= 10 ? 0 : 1)}% Yes` : "\u2014"}
                        </strong>
                      </div>
                    </li>
                  )) : (
                    <li className="text-muted">No {PRED_KIND_LABEL[kind].toLowerCase()} markets this cycle.</li>
                  )}
                </ul>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-sm text-muted">No BTC prediction markets this cycle.</p>
      )}
    </div>
  );
}

export function CoinbasePanel({ call }: { call: HeliosCall | null }) {
  return (
    <Panel className="mt-4" kicker="Execution" title="Coinbase for Agents" kickerClass="indicator-title" titleClass="indicator-title">
      <p className="text-sm leading-relaxed text-muted">
        S1R1US.ai never holds your CDP secret. Preview here, then run the CLI or connect MCP at{" "}
        <a className="text-fg underline-offset-2 hover:underline" href="https://agents.coinbase.com/mcp" target="_blank" rel="noreferrer">agents.coinbase.com/mcp</a>
        . Docs:{" "}
        <a className="text-fg underline-offset-2 hover:underline" href="https://docs.cdp.coinbase.com/coinbase-for-agents/overview" target="_blank" rel="noreferrer">Coinbase for Agents</a>
        .
      </p>
      {call ? (
        <pre className="mt-3 overflow-x-auto rounded-md bg-bg px-3 py-2 font-mono text-[11px]">{JSON.stringify(call.preview, null, 2)}</pre>
      ) : null}
      <p className="mt-3 flex items-center gap-2 text-xs text-muted">
        <Activity className="size-3.5" /> Isolated portfolio \u00b7 Trade + Transfer \u00b7 always <span className="font-mono">orders preview</span> before create.
      </p>
    </Panel>
  );
}
