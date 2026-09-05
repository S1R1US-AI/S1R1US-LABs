import { useMemo } from "react";
import { Area, Bar, CartesianGrid, Cell, ComposedChart, Line, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Panel } from "@/components/shell";
import type { DeskSnapshot, RateSeries } from "@/lib/desk/types";
import { cn } from "@/lib/utils";

function pct(n: number | null) {
  if (n == null || !Number.isFinite(n)) return "—";
  return `${n.toFixed(2)}%`;
}

function m2(n: number | null) {
  if (n == null || !Number.isFinite(n)) return "—";
  return `$${(n / 1000).toFixed(2)}T`;
}

function bn(n: number | null) {
  if (n == null || !Number.isFinite(n)) return "—";
  const sign = n < 0 ? "-" : "";
  return `${sign}$${Math.abs(n).toFixed(0)}bn`;
}

function monthLabel(t: string) {
  const d = new Date(`${t.slice(0, 10)}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return t.slice(0, 7);
  return d.toLocaleString("en-US", { month: "short", timeZone: "UTC" });
}

function ym(t: string) {
  return t.slice(0, 7);
}

function yoyByMonth(levels: { t: string; v: number }[] | undefined) {
  const by = new Map<string, number>();
  for (const p of levels ?? []) {
    const k = ym(p.t);
    if (k && Number.isFinite(p.v)) by.set(k, p.v);
  }
  const out = new Map<string, number>();
  for (const [k, v] of by) {
    const y = Number(k.slice(0, 4));
    const m = k.slice(5, 7);
    if (!y || !m) continue;
    const prev = `${y - 1}-${m}`;
    const a = by.get(prev);
    if (a && a !== 0) out.set(k, ((v - a) / a) * 100);
  }
  return out;
}

function byYearMonth(points: { t: string; v: number }[] | undefined) {
  const map = new Map<string, number>();
  for (const p of points ?? []) {
    const k = ym(p.t);
    if (k) map.set(k, p.v);
  }
  return map;
}

/** Last 12 published CPI months, oldest → newest (no blank “this month”). */
function last12Published(cpi: Map<string, number>): string[] {
  return [...cpi.keys()].sort().slice(-12);
}

function cpiFill(v: number | null) {
  if (v == null) return "var(--color-rule)";
  if (v >= 4) return "#ff1f1f";
  if (v >= 3) return "#ff8a1f";
  if (v >= 2) return "#3d7ee8";
  return "#7eb8ff";
}

const STABLE_TONE: Record<string, string> = {
  USDC: "text-hash-na",
  USDT: "text-high",
  USD1: "text-hash-eu",
};

function compactTvl(n: number | null) {
  if (n == null || !Number.isFinite(n)) return "—";
  if (n >= 1e9) return `$${(n / 1e9).toFixed(1)}B TVL`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(0)}M TVL`;
  return `$${n.toFixed(0)} TVL`;
}

const LINE: {
  key: keyof Pick<DeskSnapshot["macro"], "tbill" | "y2" | "y10" | "y30">;
  color: string;
  width: number;
  dash?: string;
}[] = [
  { key: "tbill", color: "var(--color-tbill)", width: 1.8, dash: "4 4" },
  { key: "y2", color: "var(--color-y2)", width: 1.9 },
  { key: "y10", color: "var(--color-y10)", width: 2.1 },
  { key: "y30", color: "var(--color-y30)", width: 2.4 },
];

export function MacroTape({ snap }: { snap: DeskSnapshot | null }) {
  const macro = snap?.macro;
  const curve = useMemo(() => {
    if (!macro) return [];
    const map = new Map<string, Record<string, number | string>>();
    const add = (s: RateSeries) => {
      for (const p of s.points) {
        const row = map.get(p.t) ?? { t: p.t };
        row[s.id] = p.v;
        map.set(p.t, row);
      }
    };
    add(macro.tbill);
    add(macro.y2);
    add(macro.y10);
    add(macro.y30);
    return [...map.values()].sort((a, b) => String(a.t).localeCompare(String(b.t)));
  }, [macro]);
  const m2pts = macro?.m2.points ?? [];
  const infl = useMemo(() => {
    const cpiPts = macro?.cpiYoy.points ?? [];
    const cpi = byYearMonth(cpiPts);
    const m2y = yoyByMonth(macro?.m2.points);
    const printed = byYearMonth(macro?.printed.points);
    const keys = last12Published(cpi).length >= 6 ? last12Published(cpi) : last12Published(m2y);
    return keys.map((k) => ({
      t: `${k}-01`,
      ym: k,
      label: monthLabel(`${k}-01`),
      year: k.slice(0, 4),
      cpi: cpi.get(k) ?? null,
      m2yoy: m2y.get(k) ?? null,
      printed: printed.get(k) ?? null,
    }));
  }, [macro]);
  const latestCpi = infl.filter((r) => r.cpi != null).at(-1);
  const latestM2 = infl.filter((r) => r.m2yoy != null).at(-1);
  const debaseGap =
    latestCpi?.cpi != null && latestM2?.m2yoy != null ? latestM2.m2yoy - latestCpi.cpi : null;
  const printed12 = infl.reduce((s, r) => s + (r.printed ?? 0), 0);

  return (
    <div className="mb-4 grid gap-4">
      <Panel kicker="BLS / FRED" title="Inflation vs money printed">
        <div className="mb-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Metric
            label="CPI YoY"
            value={pct(latestCpi?.cpi ?? macro?.cpiYoy.last ?? null)}
            hint={latestCpi ? `${latestCpi.label} ${latestCpi.year}` : "CPIAUCSL"}
          />
          <Metric
            label="M2 YoY"
            value={pct(latestM2?.m2yoy ?? null)}
            hint="Same months as CPI"
            tone="text-medium"
          />
          <Metric
            label="Debase gap"
            value={debaseGap == null ? "—" : `${debaseGap >= 0 ? "+" : ""}${debaseGap.toFixed(1)}pt`}
            hint="M2 YoY − CPI YoY"
            tone={debaseGap != null && debaseGap > 0 ? "text-medium" : "text-muted"}
          />
          <Metric label="Printed 12m" value={bn(printed12 || null)} hint="M2 MoM sum $bn" />
        </div>

        <ol className="mb-4 grid grid-cols-4 gap-1.5 sm:grid-cols-6">
          {infl.map((r) => (
            <li
              key={r.ym}
              className="rounded-md border border-rule px-2 py-1.5 text-center"
              style={{ background: `${cpiFill(r.cpi)}18` }}
            >
              <p className="text-[10px] font-medium tracking-[0.08em] text-muted uppercase">
                {r.label}
              </p>
              <p className="mt-0.5 font-mono text-sm tabular-nums" style={{ color: cpiFill(r.cpi) }}>
                {r.cpi == null ? "—" : `${r.cpi.toFixed(1)}%`}
              </p>
            </li>
          ))}
        </ol>

        <div className="h-52 sm:h-60">
          {infl.some((r) => r.cpi != null) ? (
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={infl} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid stroke="var(--color-rule)" vertical={false} />
                <XAxis dataKey="label" tick={{ fill: "var(--color-muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis
                  tick={{ fill: "var(--color-muted)", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `${Number(v).toFixed(0)}%`}
                  width={36}
                  domain={[0, "auto"]}
                />
                <ReferenceLine y={2} stroke="var(--color-muted)" strokeDasharray="4 4" />
                <Tooltip
                  formatter={(v, name) => [`${Number(v).toFixed(2)}%`, String(name)]}
                  labelFormatter={(_, payload) => {
                    const row = payload?.[0]?.payload as { label?: string; year?: string } | undefined;
                    return row?.label && row.year ? `${row.label} ${row.year}` : "";
                  }}
                />
                <Bar dataKey="cpi" name="CPI YoY" radius={[4, 4, 0, 0]} maxBarSize={28} fill="#3d7ee8" isAnimationActive={false}>
                  {infl.map((r) => (
                    <Cell key={r.ym} fill={cpiFill(r.cpi)} />
                  ))}
                </Bar>
                <Line
                  type="monotone"
                  dataKey="m2yoy"
                  name="M2 YoY"
                  stroke="var(--color-medium)"
                  strokeWidth={2}
                  dot={{ r: 3, fill: "var(--color-medium)" }}
                  connectNulls
                  isAnimationActive={false}
                />
              </ComposedChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-muted">Waiting for FRED CPIAUCSL / M2SL…</p>
          )}
        </div>
        <p className="mt-2 text-xs text-muted">
          Last 12 published CPI months, oldest to newest (BLS lags about six weeks — no blank
          current month). Bars: CPI-U YoY. Color: under 2% light blue, 2–3% blue, 3–4% orange,
          4%+ red. Orange line: M2 YoY on the same axis. Dashed line: Fed 2% target. Debase gap
          above zero means money is still growing faster than prices.
        </p>
      </Panel>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
      <Panel kicker="FRED" title="Treasuries + M2">
        <div className="mb-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Metric label="T-bill 3m" value={pct(macro?.tbill.last ?? null)} hint={macro?.tbill.asOf ?? undefined} tone="text-tbill" />
          <Metric label="2-year" value={pct(macro?.y2.last ?? null)} hint={macro?.y2.asOf ?? undefined} tone="text-y2" />
          <Metric label="10-year" value={pct(macro?.y10.last ?? null)} hint={macro?.y10.asOf ?? undefined} tone="text-y10" />
          <Metric label="30-year" value={pct(macro?.y30.last ?? null)} hint={macro?.y30.asOf ?? undefined} tone="text-y30" />
        </div>
        <div className="h-44 sm:h-52">
          {curve.length ? (
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={curve} margin={{ top: 8, right: 4, left: 0, bottom: 0 }}>
                <CartesianGrid stroke="var(--color-rule)" vertical={false} />
                <XAxis dataKey="t" hide />
                <YAxis
                  domain={["auto", "auto"]}
                  tick={{ fill: "var(--color-muted)", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `${Number(v).toFixed(1)}%`}
                  width={44}
                />
                <Tooltip
                  formatter={(v, name) => [`${Number(v).toFixed(2)}%`, String(name)]}
                  labelFormatter={(l) => String(l)}
                />
                {LINE.map((l) => (
                  <Line
                    key={l.key}
                    type="monotone"
                    dataKey={l.key}
                    name={macro?.[l.key].name ?? l.key}
                    stroke={l.color}
                    strokeDasharray={l.dash}
                    strokeWidth={l.width}
                    dot={false}
                    connectNulls
                  />
                ))}
              </ComposedChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-muted">Waiting for FRED…</p>
          )}
        </div>
        <p className="mt-2 text-xs text-muted">
          Daily constant-maturity yields. T-bill 3m yellow · 2y purple · 10y red · 30y blue.
        </p>
      </Panel>

      <div className="grid gap-4">
        <Panel kicker="Money supply" title="M2">
          <Metric
            label="M2 (SA)"
            value={m2(macro?.m2.last ?? null)}
            hint={
              macro?.m2.asOf
                ? `${monthLabel(macro.m2.asOf)} ${macro.m2.asOf.slice(0, 4)} · FRED M2SL`
                : "FRED M2SL"
            }
            tone="text-accum"
          />
          <div className="mt-3 h-36">
            {m2pts.length > 2 ? (
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={m2pts} margin={{ top: 4, right: 8, left: 8, bottom: 0 }}>
                  <XAxis dataKey="t" tickFormatter={monthLabel} tick={{ fill: "var(--color-muted)", fontSize: 10 }} interval="preserveStartEnd" />
                  <YAxis
                    domain={[(min: number) => min * 0.995, (max: number) => max * 1.005]}
                    tickFormatter={(v) => `$${(Number(v) / 1000).toFixed(1)}T`}
                    tick={{ fill: "var(--color-muted)", fontSize: 10 }}
                    width={52}
                  />
                  <Tooltip formatter={(v) => [m2(Number(v)), "M2"]} labelFormatter={(l) => String(l)} />
                  <Area
                    type="monotone"
                    dataKey="v"
                    stroke="var(--color-medium)"
                    strokeWidth={2}
                    fill="var(--color-accum)"
                    fillOpacity={0.35}
                    isAnimationActive={false}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-muted">Waiting for FRED M2SL…</p>
            )}
          </div>
        </Panel>
        <Panel kicker="DefiLlama" title="Stable yields">
          <ul className="grid grid-cols-3 gap-3">
            {(macro?.stables ?? []).map((s) => (
              <li key={s.symbol}>
                <p className={cn("text-xs font-medium tracking-[0.08em] uppercase", STABLE_TONE[s.symbol] || "text-muted")}>
                  {s.symbol}
                </p>
                <p className={cn("mt-1 font-mono text-lg tabular-nums", STABLE_TONE[s.symbol] || "text-fg")}>
                  {s.apy != null ? `${s.apy.toFixed(2)}%` : "—"}
                </p>
                <p className="mt-0.5 text-xs text-muted">
                  {s.protocol ?? "—"}
                  {s.tvlUsd ? ` · ${compactTvl(s.tvlUsd)}` : ""}
                </p>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-muted">
            TVL-weighted APY on single-asset, no-IL pools ≥ $5M. Not a venue recommendation.
          </p>
        </Panel>
      </div>
      </div>
    </div>
  );
}

function Metric({ label, value, hint, tone }: { label: string; value: string; hint?: string; tone?: string }) {
  return (
    <div>
      <p className={cn("text-xs font-medium tracking-[0.08em] uppercase", tone || "text-muted")}>{label}</p>
      <p className={cn("mt-1 font-mono text-lg tabular-nums tracking-tight", tone)}>{value}</p>
      {hint ? <p className="mt-0.5 text-xs text-muted">{hint}</p> : null}
    </div>
  );
}