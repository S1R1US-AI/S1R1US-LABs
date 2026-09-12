import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  Bar,
  CartesianGrid,
  Cell,
  ComposedChart,
  Customized,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Panel } from "@/components/shell";
import { overlayBars, type OverlayBar } from "@/lib/desk/indicators";
import type { Candle, DeskSnapshot } from "@/lib/desk/types";
import { money } from "@/components/helios-card";
import { barBlue, cn, BTC_TONE, rsiHex, rsiTone } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const UP = "var(--color-high)";
const DN = "var(--color-sell)";

function hourLabel(t: number) {
  return new Date(t * 1000).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

type Axis = {
  scale: ((v: unknown) => number) & { bandwidth?: () => number };
  yAxisId?: string;
};

function CandleLayer({
  xAxisMap,
  yAxisMap,
  rows,
}: {
  xAxisMap?: Record<string, Axis>;
  yAxisMap?: Record<string, Axis>;
  rows: OverlayBar[];
}) {
  const xAxis = xAxisMap ? Object.values(xAxisMap)[0] : undefined;
  const yAxis = yAxisMap?.px ?? (yAxisMap ? Object.values(yAxisMap)[0] : undefined);
  if (!xAxis?.scale || !yAxis?.scale) return null;
  const bw = xAxis.scale.bandwidth?.() ?? 7;
  const bodyW = Math.max(3, Math.min(14, bw * 0.72));
  return (
    <g>
      {rows.map((d) => {
        const x = xAxis.scale(d.t);
        if (!Number.isFinite(x)) return null;
        const cx = x + bw / 2;
        const yH = yAxis.scale(d.high);
        const yL = yAxis.scale(d.low);
        const yO = yAxis.scale(d.open);
        const yC = yAxis.scale(d.close);
        if (![yH, yL, yO, yC].every(Number.isFinite)) return null;
        const color = d.up ? UP : DN;
        const top = Math.min(yO, yC);
        const h = Math.max(1.2, Math.abs(yC - yO));
        return (
          <g key={d.t}>
            <line x1={cx} x2={cx} y1={yH} y2={yL} stroke={color} strokeWidth={1.15} />
            <rect
              x={cx - bodyW / 2}
              y={top}
              width={bodyW}
              height={h}
              fill={d.up ? UP : DN}
              fillOpacity={d.up ? 0.92 : 1}
              stroke={color}
              strokeWidth={0.8}
            />
          </g>
        );
      })}
    </g>
  );
}

const RANGES = ["24 HR", "7-DAY", "365-DAY"] as const;
type RangeKey = (typeof RANGES)[number];
const RANGE_SPEC: Record<RangeKey, { granularity: number; days: number }> = {
  "24 HR": { granularity: 3600, days: 1 },
  "7-DAY": { granularity: 21600, days: 7 },
  "365-DAY": { granularity: 86400, days: 365 },
};

/** Coinbase public candles for a range button. Max 300 rows per request — chunked. */
async function fetchRangeCandles(range: RangeKey): Promise<Candle[]> {
  const { granularity, days } = RANGE_SPEC[range];
  const endMs = Date.now();
  const startMs = endMs - days * 86400 * 1000;
  const stepMs = 290 * granularity * 1000;
  const out: Candle[] = [];
  for (let from = startMs; from < endMs; from += stepMs) {
    const to = Math.min(from + stepMs, endMs);
    const url = `https://api.exchange.coinbase.com/products/BTC-USD/candles?granularity=${granularity}&start=${new Date(from).toISOString()}&end=${new Date(to).toISOString()}`;
    const res = await fetch(url, { headers: { accept: "application/json" } });
    if (!res.ok) throw new Error(`coinbase ${res.status}`);
    const rows = (await res.json()) as number[][];
    for (const row of rows ?? []) {
      const c = {
        t: Number(row[0]),
        low: Number(row[1]),
        high: Number(row[2]),
        open: Number(row[3]),
        close: Number(row[4]),
        volume: Number(row[5]),
      };
      if (c.t > 0 && Number.isFinite(c.close) && c.close > 0) out.push(c);
    }
  }
  const seen = new Set<number>();
  return out
    .filter((c) => (seen.has(c.t) ? false : (seen.add(c.t), true)))
    .sort((a, b) => a.t - b.t);
}

/** Overlay assets selectable next to the BTC last price. GOLD uses Coinbase PAXG-USD (1 token = 1 oz gold). */
const TAPE_ASSETS = ["GOLD", "SOL", "ICP", "ETH", "USDC"] as const;
type TapeAsset = (typeof TAPE_ASSETS)[number];
const ASSET_PRODUCT: Record<TapeAsset, string> = {
  GOLD: "PAXG-USD",
  SOL: "SOL-USD",
  ICP: "ICP-USD",
  ETH: "ETH-USD",
  USDC: "USDC-USD",
};
type AssetQuote = { last: number; open: number | null };

/** Ratio semantics per pair. GOLD charts BTC needed for 1 oz gold; the rest chart units per 1 BTC. */
const RATIO_LABEL: Record<Exclude<TapeAsset, "USDC">, string> = {
  GOLD: "GOLD:BTC",
  SOL: "BTC:SOL",
  ICP: "BTC:ICP",
  ETH: "BTC:ETH",
};

/** Coinbase public hourly candles for an overlay pair product — feeds the ratio chart. */
async function fetchAssetCandles(asset: TapeAsset): Promise<Candle[]> {
  const product = ASSET_PRODUCT[asset];
  const res = await fetch(`https://api.exchange.coinbase.com/products/${product}/candles?granularity=3600`, {
    headers: { accept: "application/json" },
  });
  if (!res.ok) throw new Error(`coinbase ${res.status}`);
  const rows = (await res.json()) as number[][];
  const out: Candle[] = [];
  for (const row of rows ?? []) {
    const c = {
      t: Number(row[0]),
      low: Number(row[1]),
      high: Number(row[2]),
      open: Number(row[3]),
      close: Number(row[4]),
      volume: Number(row[5]),
    };
    if (c.t > 0 && Number.isFinite(c.close) && c.close > 0) out.push(c);
  }
  const seen = new Set<number>();
  return out
    .filter((c) => (seen.has(c.t) ? false : (seen.add(c.t), true)))
    .sort((a, b) => a.t - b.t);
}

/** Coinbase public 24h stats with a v2 spot fallback. Read-only, no keys. */
async function fetchAssetQuote(asset: TapeAsset): Promise<AssetQuote | null> {
  const product = ASSET_PRODUCT[asset];
  try {
    const res = await fetch(`https://api.exchange.coinbase.com/products/${product}/stats`, {
      headers: { accept: "application/json" },
    });
    if (res.ok) {
      const j = (await res.json()) as { last?: string; open?: string };
      const lastPx = Number(j.last);
      const openPx = Number(j.open);
      if (Number.isFinite(lastPx) && lastPx > 0) {
        return { last: lastPx, open: Number.isFinite(openPx) && openPx > 0 ? openPx : null };
      }
    }
  } catch {
    /* fall through to v2 spot */
  }
  try {
    const res = await fetch(`https://api.coinbase.com/v2/prices/${product}/spot`, {
      headers: { accept: "application/json" },
    });
    if (!res.ok) return null;
    const j = (await res.json()) as { data?: { amount?: string } };
    const lastPx = Number(j.data?.amount);
    return Number.isFinite(lastPx) && lastPx > 0 ? { last: lastPx, open: null } : null;
  } catch {
    return null;
  }
}

function IndicatorBtn({ on, onClick, label }: { on: boolean; onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className={cn(
        "indicator-title h-7 rounded-sm border px-2 text-[10px] font-semibold tracking-[0.08em] uppercase",
        on ? "border-tab bg-tab/20" : "border-rule",
      )}
    >
      {label}
    </button>
  );
}

/** Bitcoin Current Market tape — Coinbase data with clickable graph overlays. */
export function WorkspaceTape({ snap }: { snap: DeskSnapshot | null }) {
  const [showCandle, setShowCandle] = useState(true);
  const [showRsi, setShowRsi] = useState(true);
  const [showVol, setShowVol] = useState(true);
  const [showMacd50, setShowMacd50] = useState(false);
  const [showMacd200, setShowMacd200] = useState(false);
  const [showBb, setShowBb] = useState(false);
  const [showEma, setShowEma] = useState(false);
  const [showSma, setShowSma] = useState(false);
  const [range, setRange] = useState<RangeKey | null>(null);
  const [rangeCandles, setRangeCandles] = useState<Candle[] | null>(null);
  const [rangeErr, setRangeErr] = useState<string | null>(null);

  useEffect(() => {
    if (!range) {
      setRangeCandles(null);
      setRangeErr(null);
      return;
    }
    let live = true;
    setRangeErr(null);
    fetchRangeCandles(range)
      .then((c) => {
        if (live) setRangeCandles(c);
      })
      .catch(() => {
        if (live) setRangeErr("Coinbase range pull failed — showing live hourly tape.");
      });
    return () => {
      live = false;
    };
  }, [range]);

  const data = useMemo(() => {
    const candles = range && rangeCandles?.length ? rangeCandles : (snap?.candles ?? []);
    return overlayBars(candles);
  }, [range, rangeCandles, snap?.candles]);
  const last = data[data.length - 1];
  const maxVol = Math.max(0, ...data.map((d) => d.volume));
  const pxDomain = useMemo((): [number, number] | [string, string] => {
    if (!data.length) return ["auto", "auto"];
    let lo = Infinity;
    let hi = -Infinity;
    for (const d of data) {
      lo = Math.min(lo, d.low, showBb ? (d.bbLower ?? d.low) : d.low, showEma ? (d.ema12 ?? d.low) : d.low);
      hi = Math.max(hi, d.high, showBb ? (d.bbUpper ?? d.high) : d.high, showEma ? (d.ema12 ?? d.high) : d.high);
    }
    const pad = (hi - lo) * 0.06 || 50;
    return [lo - pad, hi + pad];
  }, [data, showBb, showEma]);

  const tickLabel = (v: number) =>
    range === "365-DAY" || range === "7-DAY"
      ? new Date(v * 1000).toLocaleDateString("en-US", { month: "short", day: "numeric" })
      : new Date(v * 1000).toLocaleTimeString("en-US", { hour: "numeric" });

  return (
    <div className="mt-3 min-w-0">
      <div className="mb-2 flex flex-wrap items-center gap-1">
        <IndicatorBtn on={showCandle} onClick={() => setShowCandle((v) => !v)} label="Candle" />
        <IndicatorBtn on={showRsi} onClick={() => setShowRsi((v) => !v)} label="RSI" />
        <IndicatorBtn on={showVol} onClick={() => setShowVol((v) => !v)} label="24-Vol" />
        <IndicatorBtn on={showMacd50} onClick={() => setShowMacd50((v) => !v)} label="MACD 50" />
        <IndicatorBtn on={showMacd200} onClick={() => setShowMacd200((v) => !v)} label="MACD 200" />
        <IndicatorBtn on={showBb} onClick={() => setShowBb((v) => !v)} label="BB" />
        <IndicatorBtn on={showEma} onClick={() => setShowEma((v) => !v)} label="EMA" />
        <IndicatorBtn on={showSma} onClick={() => setShowSma((v) => !v)} label="SMA" />
        {RANGES.map((r) => (
          <IndicatorBtn key={r} on={range === r} onClick={() => setRange((cur) => (cur === r ? null : r))} label={r} />
        ))}
      </div>
      {rangeErr ? <p className="mb-1 text-[10px] text-down">{rangeErr}</p> : null}
      <div className="tape-compact">
        {!data.length ? (
          <p className="text-xs text-muted">Waiting for Coinbase candles.</p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid stroke="var(--color-rule)" vertical={false} strokeOpacity={0.7} />
              <XAxis
                dataKey="t"
                tickFormatter={(v) => tickLabel(Number(v))}
                tick={{ fill: "var(--color-muted)", fontSize: 9 }}
                axisLine={false}
                tickLine={false}
                minTickGap={36}
                height={18}
              />
              <YAxis
                yAxisId="px"
                domain={pxDomain}
                tickFormatter={(v) => `$${Math.round(Number(v) / 1000)}k`}
                tick={{ fill: "var(--color-muted)", fontSize: 9 }}
                axisLine={false}
                tickLine={false}
                width={36}
                orientation="right"
              />
              <YAxis yAxisId="vol" orientation="left" domain={[0, Math.max(1, maxVol) * 3.8]} hide />
              <YAxis yAxisId="rsi" domain={[0, 400]} hide />
              <YAxis yAxisId="macd" domain={["auto", "auto"]} hide />
              <Tooltip
                contentStyle={{
                  background: "var(--color-surface)",
                  border: "1px solid var(--color-rule)",
                  borderRadius: 6,
                  fontSize: 11,
                  color: "var(--color-fg)",
                }}
                labelFormatter={(l) => hourLabel(Number(l))}
                formatter={(value, name) => {
                  const n = typeof value === "number" ? value : Number(value);
                  if (name === "volume") return [`${n.toFixed(1)} BTC`, "24-Vol"];
                  if (name === "RSI-14") return [n.toFixed(1), "RSI-14"];
                  if (String(name).startsWith("MACD")) return [n.toFixed(1), String(name)];
                  return [money(n, 0), String(name)];
                }}
              />
              {showVol ? (
                <Bar yAxisId="vol" dataKey="volume" name="volume" maxBarSize={8} isAnimationActive={false}>
                  {data.map((d) => (
                    <Cell key={d.t} fill={d.up ? UP : DN} fillOpacity={0.35} />
                  ))}
                </Bar>
              ) : null}
              {showMacd50 ? (
                <Bar yAxisId="macd" dataKey="macd50Hist" name="MACD 50" maxBarSize={6} isAnimationActive={false}>
                  {data.map((d) => (
                    <Cell key={d.t} fill={(d.macd50Hist ?? 0) >= 0 ? UP : DN} fillOpacity={0.55} />
                  ))}
                </Bar>
              ) : null}
              {showMacd200 ? (
                <Bar yAxisId="macd" dataKey="macd200Hist" name="MACD 200" maxBarSize={6} isAnimationActive={false}>
                  {data.map((d) => (
                    <Cell key={d.t} fill={(d.macd200Hist ?? 0) >= 0 ? "var(--color-tab)" : DN} fillOpacity={0.45} />
                  ))}
                </Bar>
              ) : null}
              {showRsi ? (
                <Line yAxisId="rsi" type="monotone" dataKey="rsi" name="RSI-14" stroke="var(--color-expand, #a855f7)" strokeWidth={1.2} strokeOpacity={0.85} dot={false} isAnimationActive={false} />
              ) : null}
              {showBb ? (
                <Line yAxisId="px" type="monotone" dataKey="bbUpper" stroke="var(--color-muted)" strokeOpacity={0.5} strokeDasharray="3 3" dot={false} name="BB upper" isAnimationActive={false} />
              ) : null}
              {showBb ? (
                <Line yAxisId="px" type="monotone" dataKey="bbLower" stroke="var(--color-muted)" strokeOpacity={0.5} strokeDasharray="3 3" dot={false} name="BB lower" isAnimationActive={false} />
              ) : null}
              {showEma ? (
                <Line yAxisId="px" type="monotone" dataKey="ema12" stroke="var(--color-tab)" strokeWidth={1.4} dot={false} name="EMA12" isAnimationActive={false} />
              ) : null}
              {showEma ? (
                <Line yAxisId="px" type="monotone" dataKey="ema26" stroke="var(--color-tab)" strokeOpacity={0.65} strokeDasharray="4 3" strokeWidth={1.2} dot={false} name="EMA26" isAnimationActive={false} />
              ) : null}
              {showSma ? (
                <Line yAxisId="px" type="monotone" dataKey="sma20" stroke={UP} strokeWidth={1.3} dot={false} name="SMA20" isAnimationActive={false} />
              ) : null}
              {showSma ? (
                <Line yAxisId="px" type="monotone" dataKey="sma50" stroke={UP} strokeOpacity={0.6} strokeDasharray="4 3" strokeWidth={1.1} dot={false} name="SMA50" isAnimationActive={false} />
              ) : null}
              {!showCandle ? (
                <Line yAxisId="px" type="monotone" dataKey="close" stroke={BTC_TONE} strokeWidth={1.5} dot={false} name="Close" isAnimationActive={false} />
              ) : null}
              {showCandle ? (
                <Customized
                  component={(props: { xAxisMap?: Record<string, Axis>; yAxisMap?: Record<string, Axis> }) => (
                    <CandleLayer xAxisMap={props.xAxisMap} yAxisMap={props.yAxisMap} rows={data} />
                  )}
                />
              ) : null}
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </div>
      {last ? (
        <p className="mt-1 font-mono text-[10px] text-muted">
          <span className={last.up ? "text-high" : "text-sell"}>{last.up ? "▲" : "▼"}</span>
          {" · "}
          {range ?? "live hourly"}
          {" · toggles: Candle RSI 24-Vol MACD BB EMA SMA · "}
          {snap?.btc.source ?? "Coinbase"}
        </p>
      ) : null}
    </div>
  );
}

export function TapeChart({ snap }: { snap: DeskSnapshot | null }) {
  const [showEma, setShowEma] = useState(true);
  const [showBb, setShowBb] = useState(true);
  const [showVol, setShowVol] = useState(true);
  const [showMacd50, setShowMacd50] = useState(false);
  const [showMacd200, setShowMacd200] = useState(false);
  const [asset, setAsset] = useState<TapeAsset>("USDC");
  const [assetOpen, setAssetOpen] = useState(false);
  const [quotes, setQuotes] = useState<Partial<Record<TapeAsset, AssetQuote>>>({});
  const [pairCandles, setPairCandles] = useState<Candle[] | null>(null);
  const [pairErr, setPairErr] = useState<string | null>(null);

  useEffect(() => {
    setPairCandles(null);
    setPairErr(null);
    if (asset === "USDC") return;
    let live = true;
    fetchAssetCandles(asset)
      .then((c) => {
        if (live) setPairCandles(c);
      })
      .catch(() => {
        if (live) setPairErr(`Coinbase ${ASSET_PRODUCT[asset]} pull failed — showing the BTC tape.`);
      });
    return () => {
      live = false;
    };
  }, [asset]);

  useEffect(() => {
    let live = true;
    const load = () => {
      for (const a of TAPE_ASSETS) {
        void fetchAssetQuote(a).then((q) => {
          if (live && q) setQuotes((prev) => ({ ...prev, [a]: q }));
        });
      }
    };
    load();
    const timer = setInterval(load, 300_000);
    return () => {
      live = false;
      clearInterval(timer);
    };
  }, []);
  const data = useMemo(() => overlayBars(snap?.candles ?? []), [snap?.candles]);

  /** Independent ratio series for the selected pair — one dropdown value at a time, never overlaid. */
  const ratioData = useMemo(() => {
    if (asset === "USDC" || !pairCandles?.length) return null;
    const byT = new Map(pairCandles.map((c) => [c.t, c.close]));
    const rows: { t: number; ratio: number }[] = [];
    for (const d of data) {
      const px = byT.get(d.t);
      if (!px || px <= 0 || d.close <= 0) continue;
      rows.push({ t: d.t, ratio: asset === "GOLD" ? px / d.close : d.close / px });
    }
    return rows.length ? rows : null;
  }, [asset, pairCandles, data]);
  const ratioLast = ratioData?.[ratioData.length - 1];
  const ratioFirst = ratioData?.[0];
  const ratioPct =
    ratioLast && ratioFirst && ratioFirst.ratio > 0
      ? ((ratioLast.ratio - ratioFirst.ratio) / ratioFirst.ratio) * 100
      : null;
  const rsiData = data.filter((d) => d.rsi != null);
  const last = data[data.length - 1];
  const maxVol = Math.max(0, ...data.map((d) => d.volume));
  const pxDomain = useMemo((): [number, number] | [string, string] => {
    if (!data.length) return ["auto", "auto"];
    let lo = Infinity;
    let hi = -Infinity;
    for (const d of data) {
      lo = Math.min(lo, d.low, d.bbLower ?? d.low, d.ema50 ?? d.low, d.ema200 ?? d.low);
      hi = Math.max(hi, d.high, d.bbUpper ?? d.high, d.ema50 ?? d.high, d.ema200 ?? d.high);
    }
    const pad = (hi - lo) * 0.06 || 50;
    return [lo - pad, hi + pad];
  }, [data]);

  return (
    <Panel kicker="Coinbase hourly" title="BTC tape + overlays" className="flex w-full min-h-0 flex-col" kickerClass="coinbase-orange" titleClass="text-high">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-2">
          {ratioData ? null : (
            <>
              <Toggle on={showEma} onClick={() => setShowEma((v) => !v)} label="EMA 12/26" />
              <Toggle on={showBb} onClick={() => setShowBb((v) => !v)} label="Bollinger" />
              <Toggle on={showVol} onClick={() => setShowVol((v) => !v)} label="Volume" />
              <Toggle on={showMacd50} onClick={() => setShowMacd50((v) => !v)} label="MACD 50" />
              <Toggle on={showMacd200} onClick={() => setShowMacd200((v) => !v)} label="MACD 200" />
            </>
          )}
        </div>
        {last ? (
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            {ratioData && ratioLast ? (
              <p
                className={cn(
                  "font-mono text-base tabular-nums sm:text-lg",
                  ratioPct == null || ratioPct >= 0 ? "text-high" : "text-sell",
                )}
              >
                {asset === "GOLD"
                  ? `${fmtRatio(ratioLast.ratio)} BTC = 1 oz gold`
                  : `1 BTC = ${fmtRatio(ratioLast.ratio)} ${asset}`}
                {ratioPct != null ? (
                  <>
                    {" "}
                    {ratioPct >= 0 ? "▲" : "▼"} {ratioPct >= 0 ? "+" : ""}
                    {ratioPct.toFixed(2)}%
                  </>
                ) : null}
              </p>
            ) : (
              <p className={cn("font-mono text-base tabular-nums sm:text-lg", last.up ? "text-high" : "text-sell")}>
                {money(last.close, 0)} {last.up ? "▲" : "▼"} {last.close >= last.open ? "+" : ""}
                {(((last.close - last.open) / last.open) * 100).toFixed(2)}%
              </p>
            )}
            <div className="relative">
              <button
                type="button"
                aria-haspopup="listbox"
                aria-expanded={assetOpen}
                aria-label="Select overlay asset"
                onClick={() => setAssetOpen((v) => !v)}
                className="indicator-title h-8 rounded-sm border border-rule px-2 font-mono text-xs font-semibold tracking-[0.08em]"
              >
                {asset} ▾
              </button>
              {assetOpen ? (
                <ul
                  role="listbox"
                  aria-label="Overlay asset"
                  className="absolute right-0 z-20 mt-1 w-24 rounded-md border border-rule bg-surface p-1 shadow-lg"
                >
                  {TAPE_ASSETS.map((a) => (
                    <li key={a}>
                      <button
                        type="button"
                        role="option"
                        aria-selected={a === asset}
                        onClick={() => {
                          setAsset(a);
                          setAssetOpen(false);
                        }}
                        className={cn(
                          "w-full rounded-sm px-2 py-1 text-left font-mono text-xs",
                          a === asset ? "bg-tab/20 text-fg" : "text-muted hover:text-fg",
                        )}
                      >
                        {a}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
            <AssetQuoteChip asset={asset} quote={quotes[asset]} />
            <PairRatioChip asset={asset} btc={last.close} px={quotes[asset]?.last} />
          </div>
        ) : null}
      </div>
      {pairErr ? <p className="mb-1 text-[10px] text-down">{pairErr}</p> : null}
      <div className="tape-main">
        {ratioData ? (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={ratioData} margin={{ top: 6, right: 12, left: 0, bottom: 0 }}>
              <CartesianGrid stroke="var(--color-rule)" vertical={false} strokeOpacity={0.9} />
              <XAxis
                dataKey="t"
                tickFormatter={(v) =>
                  new Date(Number(v) * 1000).toLocaleTimeString("en-US", { hour: "numeric" })
                }
                tick={{ fill: "var(--color-muted)", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                minTickGap={28}
                height={22}
              />
              <YAxis
                domain={["auto", "auto"]}
                tickFormatter={(v) => fmtRatio(Number(v))}
                tick={{ fill: "var(--color-muted)", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                width={56}
                orientation="right"
              />
              <Tooltip
                contentStyle={{
                  background: "var(--color-surface)",
                  border: "1px solid var(--color-rule)",
                  borderRadius: 8,
                  fontSize: 12,
                  color: "var(--color-fg)",
                }}
                labelFormatter={(l) => hourLabel(Number(l))}
                formatter={(value) => [
                  fmtRatio(typeof value === "number" ? value : Number(value)),
                  asset === "USDC" ? "ratio" : RATIO_LABEL[asset],
                ]}
              />
              <Line
                type="monotone"
                dataKey="ratio"
                stroke="var(--color-medium)"
                strokeWidth={1.8}
                dot={false}
                name={asset === "USDC" ? "ratio" : RATIO_LABEL[asset]}
                isAnimationActive={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        ) : data.length ? (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data} margin={{ top: 6, right: 12, left: 0, bottom: 0 }}>
              <CartesianGrid stroke="var(--color-rule)" vertical={false} strokeOpacity={0.9} />
              <XAxis
                dataKey="t"
                tickFormatter={(v) =>
                  new Date(Number(v) * 1000).toLocaleTimeString("en-US", { hour: "numeric" })
                }
                tick={{ fill: "var(--color-muted)", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                minTickGap={28}
                height={22}
              />
              <YAxis
                yAxisId="px"
                domain={pxDomain}
                tickFormatter={(v) =>
                  Number(v) >= 1000 ? `$${Math.round(Number(v) / 1000)}k` : money(Number(v), 0)
                }
                tick={{ fill: "var(--color-muted)", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                width={46}
                orientation="right"
              />
              <YAxis yAxisId="vol" orientation="left" domain={[0, (max: number) => max * 3.6]} hide />
              <Tooltip
                contentStyle={{
                  background: "var(--color-surface)",
                  border: "1px solid var(--color-rule)",
                  borderRadius: 8,
                  fontSize: 12,
                  color: "var(--color-fg)",
                }}
                labelFormatter={(l) => hourLabel(Number(l))}
                formatter={(value, name) => {
                  const n = typeof value === "number" ? value : Number(value);
                  if (name === "volume") return [n.toFixed(1) + " BTC", "Vol"];
                  if (
                    name === "EMA12" ||
                    name === "EMA26" ||
                    name === "EMA50" ||
                    name === "EMA200" ||
                    name === "BB upper" ||
                    name === "BB lower"
                  ) {
                    return [money(n, 0), String(name)];
                  }
                  return [money(n, 0), String(name)];
                }}
              />
              {showVol ? (
                <Bar yAxisId="vol" dataKey="volume" name="volume" maxBarSize={10} isAnimationActive={false}>
                  {data.map((d) => (
                    <Cell key={d.t} fill={barBlue(d.volume, maxVol)} />
                  ))}
                </Bar>
              ) : null}
              {showBb ? (
                <Line
                  yAxisId="px"
                  type="monotone"
                  dataKey="bbUpper"
                  stroke="var(--color-muted)"
                  strokeOpacity={0.55}
                  strokeDasharray="4 4"
                  dot={false}
                  name="BB upper"
                  isAnimationActive={false}
                />
              ) : null}
              {showBb ? (
                <Line
                  yAxisId="px"
                  type="monotone"
                  dataKey="bbLower"
                  stroke="var(--color-muted)"
                  strokeOpacity={0.55}
                  strokeDasharray="4 4"
                  dot={false}
                  name="BB lower"
                  isAnimationActive={false}
                />
              ) : null}
              {showEma ? (
                <Line
                  yAxisId="px"
                  type="monotone"
                  dataKey="ema12"
                  stroke="var(--color-medium)"
                  strokeWidth={1.6}
                  dot={false}
                  name="EMA12"
                  isAnimationActive={false}
                />
              ) : null}
              {showEma ? (
                <Line
                  yAxisId="px"
                  type="monotone"
                  dataKey="ema26"
                  stroke="var(--color-medium)"
                  strokeOpacity={0.7}
                  strokeDasharray="5 4"
                  strokeWidth={1.5}
                  dot={false}
                  name="EMA26"
                  isAnimationActive={false}
                />
              ) : null}
              {showMacd50 ? (
                <Line
                  yAxisId="px"
                  type="monotone"
                  dataKey="ema50"
                  stroke="var(--color-accent)"
                  strokeWidth={1.5}
                  dot={false}
                  name="EMA50"
                  isAnimationActive={false}
                />
              ) : null}
              {showMacd200 ? (
                <Line
                  yAxisId="px"
                  type="monotone"
                  dataKey="ema200"
                  stroke="var(--color-high)"
                  strokeWidth={1.7}
                  dot={false}
                  name="EMA200"
                  isAnimationActive={false}
                />
              ) : null}
              <Customized
                component={(props: { xAxisMap?: Record<string, Axis>; yAxisMap?: Record<string, Axis> }) => (
                  <CandleLayer xAxisMap={props.xAxisMap} yAxisMap={props.yAxisMap} rows={data} />
                )}
              />
            </ComposedChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-sm text-muted">Waiting for candles.</p>
        )}
      </div>
      <div className="mt-1 grid grid-cols-1 gap-1">
        <OscPane label="RSI-14" tone={rsiHex(snap?.rsi14, snap?.rsiAvg)}>
          {rsiData.length ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={rsiData} margin={{ top: 2, right: 12, left: 0, bottom: 0 }}>
                <YAxis domain={[0, 100]} hide />
                <ReferenceLine y={70} stroke={DN} strokeOpacity={0.45} strokeDasharray="3 3" />
                <ReferenceLine y={50} stroke="var(--color-muted)" strokeOpacity={0.35} />
                <ReferenceLine y={30} stroke={UP} strokeOpacity={0.45} strokeDasharray="3 3" />
                <Line type="monotone" dataKey="rsi" stroke="var(--color-medium)" strokeWidth={1.8} dot={false} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          ) : null}
        </OscPane>
        <OscPane label="MACD hist" tone={snap?.macd ? ((snap.macd.hist >= 0 ? UP : DN)) : undefined}>
          {data.some((d) => d.macdHist != null) ? (
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={data} margin={{ top: 2, right: 12, left: 0, bottom: 0 }}>
                <YAxis hide domain={["auto", "auto"]} />
                <ReferenceLine y={0} stroke="var(--color-muted)" strokeOpacity={0.4} />
                <Bar dataKey="macdHist" maxBarSize={6} isAnimationActive={false}>
                  {data.map((d) => (
                    <Cell key={d.t} fill={(d.macdHist ?? 0) >= 0 ? UP : DN} />
                  ))}
                </Bar>
              </ComposedChart>
            </ResponsiveContainer>
          ) : null}
        </OscPane>
        {showMacd50 ? (
          <OscPane label="MACD 50">
            {data.some((d) => d.macd50Hist != null) ? (
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={data} margin={{ top: 2, right: 12, left: 0, bottom: 0 }}>
                  <YAxis hide domain={["auto", "auto"]} />
                  <ReferenceLine y={0} stroke="var(--color-muted)" strokeOpacity={0.4} />
                  <Bar dataKey="macd50Hist" maxBarSize={6} isAnimationActive={false}>
                    {data.map((d) => (
                      <Cell key={`m50-${d.t}`} fill={(d.macd50Hist ?? 0) >= 0 ? UP : DN} />
                    ))}
                  </Bar>
                </ComposedChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-[10px] text-muted">
                Coinbase hours {data.length}/109 — filling live
              </p>
            )}
          </OscPane>
        ) : null}
        {showMacd200 ? (
          <OscPane label="MACD 200">
            {data.some((d) => d.macd200Hist != null) ? (
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={data} margin={{ top: 2, right: 12, left: 0, bottom: 0 }}>
                  <YAxis hide domain={["auto", "auto"]} />
                  <ReferenceLine y={0} stroke="var(--color-muted)" strokeOpacity={0.4} />
                  <Bar dataKey="macd200Hist" maxBarSize={6} isAnimationActive={false}>
                    {data.map((d) => (
                      <Cell key={`m200-${d.t}`} fill={(d.macd200Hist ?? 0) >= 0 ? UP : DN} />
                    ))}
                  </Bar>
                </ComposedChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-[10px] text-muted">
                Coinbase hours {data.length}/209 — filling live
              </p>
            )}
          </OscPane>
        ) : null}
      </div>
      <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-4 lg:grid-cols-8">
        <TapeStat
          k="24h high / low"
          v={
            data.length
              ? `${money(Math.max(...data.map((d) => d.high)), 0)} / ${money(Math.min(...data.map((d) => d.low)), 0)}`
              : "—"
          }
        />
        <TapeStat
          k="EMA-21"
          v={snap?.ema21 != null ? money(snap.ema21, 0) : "—"}
          tone={
            last && snap?.ema21 != null ? (last.close >= snap.ema21 ? "rsi-above" : "rsi-below") : undefined
          }
        />
        <TapeStat
          k="SMA-50"
          v={snap?.sma50 != null ? money(snap.sma50, 0) : "—"}
          tone={
            last && snap?.sma50 != null ? (last.close >= snap.sma50 ? "rsi-above" : "rsi-below") : undefined
          }
        />
        <TapeStat
          k="BB %B"
          v={snap?.bbPct != null ? snap.bbPct.toFixed(2) : "—"}
          tone={
            snap?.bbPct == null ? undefined : snap.bbPct <= 0.3 ? "rsi-above" : snap.bbPct >= 0.7 ? "rsi-below" : undefined
          }
        />
        <TapeStat k="ATR-14" v={snap?.atr != null ? money(snap.atr, 0) : "—"} />
        <TapeStat
          k="MACD hist"
          v={
            snap?.macd
              ? `${snap.macd.hist >= 0 ? "+" : ""}${Math.abs(snap.macd.hist) >= 10 ? snap.macd.hist.toFixed(0) : snap.macd.hist.toFixed(1)}`
              : "—"
          }
          tone={snap?.macd ? (snap.macd.hist >= 0 ? "rsi-above" : "rsi-below") : undefined}
        />
        <TapeStat
          k="MACD 50"
          v={
            snap?.macd50
              ? `${snap.macd50.hist >= 0 ? "+" : ""}${Math.abs(snap.macd50.hist) >= 10 ? snap.macd50.hist.toFixed(0) : snap.macd50.hist.toFixed(1)}`
              : data.length
                ? `${data.length}/109h`
                : "—"
          }
          tone={snap?.macd50 ? (snap.macd50.hist >= 0 ? "rsi-above" : "rsi-below") : undefined}
        />
        <TapeStat
          k="MACD 200"
          v={
            snap?.macd200
              ? `${snap.macd200.hist >= 0 ? "+" : ""}${Math.abs(snap.macd200.hist) >= 10 ? snap.macd200.hist.toFixed(0) : snap.macd200.hist.toFixed(1)}`
              : data.length
                ? `${data.length}/209h`
                : "—"
          }
          tone={snap?.macd200 ? (snap.macd200.hist >= 0 ? "rsi-above" : "rsi-below") : undefined}
        />
        <TapeStat
          k="Vol vs 20h"
          v={snap?.volRatio != null ? `${snap.volRatio.toFixed(2)}×` : "—"}
          tone={snap?.volRatio != null && snap.volRatio >= 1 ? "rsi-above" : snap?.volRatio != null ? "rsi-below" : undefined}
        />
        <TapeStat
          k="Funding"
          v={
            snap?.positioning.fundingRate != null
              ? `${(snap.positioning.fundingRate * 100).toFixed(4)}%`
              : "—"
          }
        />
      </div>
      <p className="mt-2 font-mono text-xs text-muted">
        RSI(14){" "}
        <span className={rsiTone(snap?.rsi14, snap?.rsiAvg)} style={{ color: rsiHex(snap?.rsi14, snap?.rsiAvg) }}>
          {snap?.rsi14 != null ? snap.rsi14.toFixed(1) : "—"}
        </span>
        {snap?.rsiAvg != null ? <span className="text-muted"> vs avg {snap.rsiAvg.toFixed(1)}</span> : null}
        {" · "}
        Vol 24h{" "}
        <span className={BTC_TONE}>
          {snap?.btc.volume24h != null ? snap.btc.volume24h.toFixed(0) : "—"} BTC
        </span>
        {snap?.btc.volumeAvg24h != null ? (
          <span className="text-muted">
            {" "}
            vs Coinbase avg {snap.btc.volumeAvg24h.toFixed(0)} BTC
          </span>
        ) : null}{" "}
        · {snap?.btc.source}
      </p>
    </Panel>
  );
}

function OscPane({
  label,
  tone,
  children,
}: {
  label: string;
  tone?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex h-10 min-h-10 items-stretch gap-2 sm:h-14">
      <p
        className="w-16 shrink-0 self-center font-mono text-[10px] tracking-[0.12em] text-muted uppercase sm:w-20"
        style={tone ? { color: tone } : undefined}
      >
        {label}
      </p>
      <div className="min-h-0 min-w-0 flex-1">{children}</div>
    </div>
  );
}

function assetMoney(v: number) {
  return money(v, v >= 100 ? 0 : v >= 2 ? 2 : 4);
}

/** Selected overlay asset quote: last price plus 24h change when Coinbase stats are available. */
function AssetQuoteChip({ asset, quote }: { asset: TapeAsset; quote?: AssetQuote }) {
  if (!quote) {
    return (
      <p className="font-mono text-xs text-muted">
        {asset} <span className="tabular-nums">—</span>
      </p>
    );
  }
  const pct = quote.open != null ? ((quote.last - quote.open) / quote.open) * 100 : null;
  const up = pct != null ? pct >= 0 : null;
  return (
    <p className="font-mono text-xs tabular-nums text-fg">
      <span className="text-muted">{asset} </span>
      {assetMoney(quote.last)}
      {pct != null ? (
        <span className={up ? "text-high" : "text-sell"}>
          {" "}
          {up ? "▲" : "▼"} {up ? "+" : ""}
          {pct.toFixed(2)}%
        </span>
      ) : null}
    </p>
  );
}

/** Ratio display: 34.4k / 512 / 15.2 / 2.05 / 0.0291 depending on magnitude. */
function fmtRatio(v: number) {
  if (!Number.isFinite(v)) return "—";
  if (v >= 100_000) return `${Math.round(v / 1000)}k`;
  if (v >= 1000) return `${(v / 1000).toFixed(1)}k`;
  if (v >= 100) return v.toFixed(0);
  if (v >= 10) return v.toFixed(1);
  if (v >= 1) return v.toFixed(2);
  return v.toFixed(4);
}

/** Selected-pair BTC ratio chip — only the dropdown pick shows, never all pairs at once.
    GOLD = BTC required for 1 oz gold (Coinbase PAXG-USD, 1 PAXG = 1 oz). Others = units per 1 BTC. */
function PairRatioChip({ asset, btc, px }: { asset: TapeAsset; btc: number; px?: number }) {
  if (asset === "USDC" || !px || px <= 0 || !Number.isFinite(btc) || btc <= 0) return null;
  const label = RATIO_LABEL[asset];
  if (asset === "GOLD") {
    return (
      <p
        className="rounded-sm border border-rule px-2 py-0.5 font-mono text-xs tabular-nums text-muted"
        title="Gold to BTC ratio — BTC required to purchase 1 oz of gold (Coinbase PAXG-USD, 1 PAXG = 1 oz gold)"
      >
        <span className="gold-css">{label}</span> {(px / btc).toFixed(4)} · 1 BTC = {(btc / px).toFixed(1)} oz
      </p>
    );
  }
  return (
    <p
      className="rounded-sm border border-rule px-2 py-0.5 font-mono text-xs tabular-nums text-muted"
      title={`${asset} to BTC ratio — how many ${asset} one bitcoin purchases (Coinbase ${ASSET_PRODUCT[asset]})`}
    >
      <span className="text-fg">{label}</span> 1 BTC = {fmtRatio(btc / px)} {asset}
    </p>
  );
}

function TapeStat({ k, v, tone }: { k: string; v: string; tone?: string }) {
  return (
    <div className="min-w-0">
      <p className="font-mono text-[10px] tracking-[0.12em] text-muted uppercase">{k}</p>
      <p className={cn("mt-0.5 truncate font-mono text-sm tabular-nums", tone ?? "text-fg")}>{v}</p>
    </div>
  );
}

function Toggle({ on, onClick, label }: { on: boolean; onClick: () => void; label: string }) {
  return (
    <Button
      size="sm"
      variant="outline"
      aria-pressed={on}
      onClick={onClick}
      className={cn("indicator-title h-10 min-h-10 px-3 text-xs", on && "border-tab")}
    >
      {label}
    </Button>
  );
}

export function LiqHeatmap({ snap }: { snap: DeskSnapshot | null }) {
  const rows = [...(snap?.liqMap ?? [])].reverse();
  const last = snap?.btc.price;
  const max = Math.max(1, ...rows.flatMap((r) => [r.longUsd, r.shortUsd]));
  const pos = snap?.positioning;
  const ls = pos?.longShort;
  const longPct = ls != null ? (ls / (1 + ls)) * 100 : null;
  const shortPct = longPct != null ? 100 - longPct : null;
  const spark = pos?.lsHistory ?? [];
  const venues = pos?.venues ?? [];
  const sellW = pos?.sellWallUsd;
  const buyW = pos?.buyWallUsd;
  const nearest = last
    ? rows.reduce(
        (best, r) => (Math.abs(r.price - last) < Math.abs(best.price - last) ? r : best),
        rows[0] ?? { price: last, longUsd: 0, shortUsd: 0 },
      )
    : null;

  return (
    <Panel kicker="Public leverage · no CoinGlass" title="Long / short heatmap" kickerClass="indicator-title" titleClass="indicator-title">
      <div className="mb-3">
        <div className="flex h-2 overflow-hidden rounded-sm">
          <div className="bg-up" style={{ width: `${longPct ?? 50}%` }} />
          <div className="bg-down" style={{ width: `${shortPct ?? 50}%` }} />
        </div>
        <p className="mt-2 font-mono text-xs text-muted">
          Longs {longPct != null ? `${longPct.toFixed(0)}%` : "—"} · shorts{" "}
          {shortPct != null ? `${shortPct.toFixed(0)}%` : "—"} · LS {ls?.toFixed(2) ?? "—"} · OI{" "}
          {pos?.openInterestUsd != null ? money(pos.openInterestUsd, 0) : "—"}
        </p>
        <p className="mt-1 font-mono text-xs">
          <span className="text-down">Sell wall {sellW != null ? money(sellW, 0) : "—"}</span>
          {" · "}
          <span className="text-up">Buy wall {buyW != null ? money(buyW, 0) : "—"}</span>
          {" · "}
          <span className={pos?.wallBias === "SELL" ? "text-down" : pos?.wallBias === "BUY" ? "text-up" : "text-muted"}>
            {pos?.wallBias ?? "FLAT"}
          </span>
        </p>
      </div>
      <div className="flex h-52 gap-2 sm:h-60">
        <div className="flex min-w-0 flex-1 flex-col justify-between">
          {rows.map((r) => {
            const isLast = nearest != null && r.price === nearest.price;
            return (
              <div key={r.price} className="flex flex-1 items-center gap-1">
                <span className={cn("w-12 shrink-0 font-mono text-xs tabular-nums", isLast ? "text-fg" : "text-muted")}>
                  {r.price.toFixed(0)}
                </span>
                <div className="flex h-2 min-w-0 flex-1 items-center">
                  <div
                    className="h-2 rounded-sm bg-down"
                    style={{
                      width: r.longUsd > 0 ? `${Math.max(4, (r.longUsd / max) * 48)}%` : "0%",
                    }}
                  />
                  <div className={cn("mx-0.5 h-2 w-px shrink-0", isLast ? "bg-fg" : "bg-rule")} />
                  <div
                    className="h-2 rounded-sm bg-up"
                    style={{
                      width: r.shortUsd > 0 ? `${Math.max(4, (r.shortUsd / max) * 48)}%` : "0%",
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="mt-3 h-12">
        {spark.length ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={spark}>
              <YAxis domain={["auto", "auto"]} hide />
              <Line type="monotone" dataKey="ratio" stroke="var(--color-medium)" strokeWidth={1.25} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        ) : null}
      </div>
      <p className="mt-2 text-xs text-muted">
        Brick = long liquidations (below). Sage = short liquidations (above). Magnets from OI at
        10–100× plus OKX fills. Midline is last. Spark is 48h OKX long/short.
      </p>
      {venues.length ? (
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[28rem] text-left text-xs">
            <thead>
              <tr className="border-b border-rule text-muted uppercase tracking-[0.08em]">
                <th className="py-1 pr-2">Venue</th>
                <th className="py-1 pr-2 text-right">L/S</th>
                <th className="py-1 pr-2 text-right">Fund</th>
                <th className="py-1 pr-2 text-right">OI</th>
                <th className="py-1 pr-2 text-right">Buy wall</th>
                <th className="py-1 text-right">Sell wall</th>
              </tr>
            </thead>
            <tbody>
              {venues.map((v) => (
                <tr key={v.id} className="border-b border-rule/60">
                  <td className="py-1 pr-2 text-fg">{v.name}</td>
                  <td className={cn("py-1 pr-2 text-right font-mono", v.longShort != null && v.longShort > 1.6 ? "text-down" : "tabular-nums")}>
                    {v.longShort != null ? v.longShort.toFixed(2) : "—"}
                  </td>
                  <td className={cn("py-1 pr-2 text-right font-mono", v.fundingRate != null && v.fundingRate > 0.0005 ? "text-down" : v.fundingRate != null && v.fundingRate < 0 ? "text-up" : "tabular-nums")}>
                    {v.fundingRate != null ? `${(v.fundingRate * 100).toFixed(4)}%` : "—"}
                  </td>
                  <td className="py-1 pr-2 text-right font-mono tabular-nums">{v.openInterestUsd != null ? money(v.openInterestUsd, 0) : "—"}</td>
                  <td className="py-1 pr-2 text-right font-mono text-up">{v.buyWallUsd != null ? money(v.buyWallUsd, 0) : "—"}</td>
                  <td className="py-1 text-right font-mono text-down">{v.sellWallUsd != null ? money(v.sellWallUsd, 0) : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
      <p className="mt-2 text-[11px] text-muted">{pos?.source}</p>
    </Panel>
  );
}