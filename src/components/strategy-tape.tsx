import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Panel } from "@/components/shell";
import { money } from "@/components/helios-card";
import type { DeskSnapshot, StrategyProduct } from "@/lib/desk/types";
import { cn } from "@/lib/utils";

function chgClass(n: number | null) {
  if (n == null) return "text-muted";
  if (n > 0) return "rsi-above";
  if (n < 0) return "rsi-below";
  return "text-muted";
}

function fmtChg(n: number | null) {
  if (n == null || !Number.isFinite(n)) return "—";
  return `${n >= 0 ? "+" : ""}${n.toFixed(2)}%`;
}

function chgHex(n: number | null) {
  if (n == null) return "var(--color-muted)";
  if (n > 0) return "#3dff1a";
  if (n < 0) return "#ff1f1f";
  return "var(--color-muted)";
}

function monthTick(t: number) {
  return new Date(t).toLocaleString("en-US", { month: "short" });
}

export function StrategyTape({ snap }: { snap: DeskSnapshot | null }) {
  const products = snap?.strategy.products ?? [];
  const mstr = products.find((p) => p.symbol === "MSTR");
  const prefs = products.filter((p) => p.kind === "preferred");
  const etfs = products.filter((p) => p.kind === "etf");
  const [stackOpen, setStackOpen] = useState(false);
  const spark = useMemo(
    () =>
      (mstr?.points ?? []).map((p) => ({
        t: p.t,
        v: p.v,
        label: monthTick(p.t),
      })),
    [mstr],
  );
  const ranked = useMemo(() => {
    return [...products]
      .filter((p) => p.change6m != null)
      .sort((a, b) => (b.change6m ?? 0) - (a.change6m ?? 0))
      .map((p) => ({
        symbol: p.symbol,
        name: p.name,
        v: p.change6m ?? 0,
        kind: p.kind,
      }));
  }, [products]);

  return (
    <Panel className="mb-4" kicker="Strategy Inc" title="MSTR + product stack">
      <div className="grid gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div>
          <p className="text-xs font-medium tracking-[0.08em] text-muted uppercase">MSTR</p>
          <p className="mt-1 font-mono text-3xl tabular-nums tracking-tight text-medium">
            {mstr?.last != null ? money(mstr.last, 2) : "—"}
          </p>
          <p className="mt-1 flex flex-wrap gap-3 font-mono text-sm">
            <span className={chgClass(mstr?.changePct ?? null)} style={{ color: chgHex(mstr?.changePct ?? null) }}>
              {fmtChg(mstr?.changePct ?? null)} day
            </span>
            <span className={chgClass(mstr?.change6m ?? null)} style={{ color: chgHex(mstr?.change6m ?? null) }}>
              {fmtChg(mstr?.change6m ?? null)} 6m
            </span>
          </p>
          <div className="mt-3 h-36">
            {spark.length > 2 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={spark} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid stroke="var(--color-rule)" vertical={false} />
                  <XAxis
                    dataKey="t"
                    type="number"
                    domain={["dataMin", "dataMax"]}
                    tickFormatter={(v) => monthTick(Number(v))}
                    tick={{ fill: "var(--color-muted)", fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    domain={["auto", "auto"]}
                    tickFormatter={(v) => `$${Number(v).toFixed(0)}`}
                    tick={{ fill: "var(--color-muted)", fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                    width={44}
                  />
                  <Tooltip
                    formatter={(v) => [money(Number(v), 2), "MSTR"]}
                    labelFormatter={(l) =>
                      new Date(Number(l)).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                    }
                  />
                  <Line
                    type="monotone"
                    dataKey="v"
                    stroke="#ff8a1f"
                    strokeWidth={2.2}
                    dot={false}
                    isAnimationActive={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-muted">Waiting for MSTR weekly…</p>
            )}
          </div>
          <p className="mt-1 text-xs text-muted">MSTR last 6 months, USD. Not indexed.</p>
        </div>

        <div>
          <p className="text-xs font-medium tracking-[0.08em] text-muted uppercase">6m total return</p>
          <div className="mt-2 h-56 sm:h-64">
            {ranked.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ranked} layout="vertical" margin={{ top: 4, right: 36, left: 8, bottom: 0 }}>
                  <CartesianGrid stroke="var(--color-rule)" horizontal={false} />
                  <XAxis
                    type="number"
                    tickFormatter={(v) => `${Number(v).toFixed(0)}%`}
                    tick={{ fill: "var(--color-muted)", fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    type="category"
                    dataKey="symbol"
                    width={52}
                    tick={{ fill: "var(--color-fg)", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    formatter={(v, _n, item) => {
                      const row = item?.payload as { name?: string };
                      return [fmtChg(Number(v)), row.name ?? "6m"];
                    }}
                  />
                  <Bar dataKey="v" maxBarSize={18} radius={[0, 4, 4, 0]} isAnimationActive={false}>
                    {ranked.map((r) => (
                      <Cell key={r.symbol} fill={chgHex(r.v)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-muted">Waiting for 6m returns…</p>
            )}
          </div>
          <p className="text-xs text-muted">Green = up over 6 months, red = down. Ranked, not overlapping.</p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setStackOpen((o) => !o)}
        aria-expanded={stackOpen}
        className="mt-4 flex w-full items-baseline justify-between gap-3 rounded-md py-1 text-left hover:bg-fg/4"
      >
        <span className="text-xs font-medium tracking-[0.08em] expand-ctl uppercase">
          Preferreds + vehicles
        </span>
        <span className="font-mono text-[11px] expand-ctl">
          {prefs.length} prefs · {etfs.length} ETFs · {stackOpen ? "collapse" : "expand"}
        </span>
      </button>
      {stackOpen ? (
        <>
          <ProductTable title="Preferreds (issuer)" rows={prefs} />
          <ProductTable title="MSTR vehicles" rows={etfs} className="mt-4" />
        </>
      ) : null}
      <p className="mt-3 text-xs text-muted">
        {snap?.strategy.source ?? "CNBC · Yahoo"}. Preferreds are residual claims, not bitcoin. 2x ETFs decay.
      </p>
    </Panel>
  );
}

function ProductTable({
  title,
  rows,
  className,
}: {
  title: string;
  rows: StrategyProduct[];
  className?: string;
}) {
  if (!rows.length) return null;
  return (
    <div className={className}>
      <p className="mb-2 text-xs font-medium tracking-[0.08em] text-muted uppercase">{title}</p>
      <ul className="divide-y divide-rule text-sm">
        {rows.map((p) => (
          <li key={p.symbol} className="grid grid-cols-[minmax(0,1.4fr)_auto_auto_auto] items-center gap-2 py-2">
            <div className="min-w-0">
              <p className="font-medium text-fg">
                {p.symbol}
                {p.coupon ? <span className="ml-2 font-mono text-xs text-muted">{p.coupon}</span> : null}
              </p>
              <p className="truncate text-xs text-muted">{p.name}</p>
            </div>
            <span className="font-mono tabular-nums">{p.last != null ? money(p.last, 2) : "—"}</span>
            <span className="font-mono tabular-nums" style={{ color: chgHex(p.changePct) }}>
              {fmtChg(p.changePct)}
            </span>
            <span className="font-mono tabular-nums" style={{ color: chgHex(p.change6m) }}>
              {fmtChg(p.change6m)}
            </span>
          </li>
        ))}
      </ul>
      <div className="mt-1 grid grid-cols-[1fr_auto_auto_auto] gap-2 text-xs text-muted">
        <span />
        <span className="text-right">Last</span>
        <span className="w-16 text-right">Day</span>
        <span className="w-16 text-right">6m</span>
      </div>
    </div>
  );
}
