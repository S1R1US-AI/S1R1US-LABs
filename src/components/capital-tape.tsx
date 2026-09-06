import { useMemo, useState } from "react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Panel } from "@/components/shell";
import { money } from "@/components/helios-card";
import type { DatHolding, DeskSnapshot } from "@/lib/desk/types";
import { barBlue, BTC_TONE, USD_TONE } from "@/lib/utils";

function compactUsd(n: number) {
  const sign = n < 0 ? "-" : "";
  const a = Math.abs(n);
  if (a >= 1e9) return `${sign}$${(a / 1e9).toFixed(2)}B`;
  if (a >= 1e6) return `${sign}$${(a / 1e6).toFixed(1)}M`;
  if (a >= 1e3) return `${sign}$${(a / 1e3).toFixed(0)}K`;
  return `${sign}${money(a, 0)}`;
}

function SizeBar(props: unknown) {
  const p = props as {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    payload?: { color?: string };
  };
  const { x = 0, y = 0, width = 0, height = 0, payload } = p;
  if (!width || !height || height <= 0) return <g />;
  return <rect x={x} y={y} width={width} height={height} rx={5} fill={payload?.color ?? "#d0f1fc"} />;
}

function StackTable({ title, rows }: { title: string; rows: DatHolding[] }) {
  const [open, setOpen] = useState(false);
  if (!rows.length) return null;
  const btc = rows.reduce((s, d) => s + d.btc, 0);
  const usd = rows.reduce((s, d) => s + d.usd, 0);
  return (
    <div className="mt-4">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-baseline justify-between gap-3 rounded-md py-1 text-left hover:bg-fg/4"
      >
        <span className="coinbase-orange text-xs font-medium tracking-[0.08em] uppercase">{title}</span>
        <span className="font-mono text-[11px] expand-ctl">
          {rows.length} · {btc.toLocaleString("en-US", { maximumFractionDigits: 0 })} BTC · {compactUsd(usd)} ·{" "}
          {open ? "collapse" : "expand"}
        </span>
      </button>
      {open ? (
        <div className="mt-2 overflow-x-auto">
          <table className="w-full min-w-[28rem] text-left text-sm">
            <thead>
              <tr className="border-b border-rule text-xs text-muted">
                <th className="coinbase-orange py-1 pr-3 font-medium">Entity</th>
                <th className={`py-1 pr-3 text-right font-medium ${BTC_TONE}`}>BTC</th>
                <th className={`py-1 text-right font-medium ${USD_TONE}`}>USD</th>
              </tr>
            </thead>
            <tbody>
              {rows.slice(0, 12).map((d) => (
                <tr key={`${d.ticker}-${d.name}`} className="border-b border-rule/70">
                  <td className="py-1.5 pr-3">
                    <span className="coinbase-orange">{d.name}</span>
                    {d.ticker ? <span className="coinbase-orange ml-2 font-mono text-xs">{d.ticker}</span> : null}
                  </td>
                  <td className={`py-1.5 pr-3 text-right font-mono tabular-nums ${BTC_TONE}`}>
                    {d.btc.toLocaleString("en-US", { maximumFractionDigits: 0 })}
                  </td>
                  <td className={`py-1.5 text-right font-mono tabular-nums ${USD_TONE}`}>{compactUsd(d.usd)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {rows.length > 12 ? (
            <p className="mt-2 text-xs text-muted">Showing top 12 of {rows.length}. Bar is the full stack.</p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

export function CapitalTapeChart({ snap }: { snap: DeskSnapshot | null }) {
  const bars = snap?.capital.bars ?? [];
  const data = useMemo(() => {
    const rows = bars.map((b) => ({
      ...b,
      value: b.usd ?? 0,
      plot: b.usd != null && b.usd > 0 ? b.usd : null,
      missing: b.usd == null,
    }));
    const positives = rows.map((b) => b.plot).filter((v): v is number => v != null && v > 0);
    const maxUsd = positives.length ? Math.max(...positives) : 0;
    const minUsd = positives.length ? Math.min(...positives) : 0;
    return rows.map((b) => ({
      ...b,
      color: b.missing || b.plot == null ? "#243038" : barBlue(b.plot, maxUsd, minUsd),
    }));
  }, [bars]);

  return (
    <Panel className="mb-4" kicker="Capital tape" title="Where the bid is" kickerClass="indicator-title" titleClass="indicator-title">
      {data.length ? (
        <div className="h-56 sm:h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 4 }}>
              <XAxis dataKey="name" tick={{ fill: "#ff8a1f", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis
                scale="log"
                domain={[100_000, (max: number) => (Number.isFinite(max) && max > 0 ? max * 1.2 : 1e11)]}
                tickFormatter={(v) => compactUsd(Number(v))}
                tick={{ fill: "var(--color-muted)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={64}
                allowDataOverflow={false}
              />
              <Tooltip
                cursor={{ fill: "var(--color-fg)", fillOpacity: 0.04 }}
                formatter={(v, _n, item) => {
                  const row = item?.payload as { usd: number | null; note: string; missing: boolean };
                  if (row.missing) return ["—", row.note];
                  return [compactUsd(Number(v)), row.note];
                }}
              />
              <Bar dataKey="plot" shape={SizeBar} isAnimationActive={false} maxBarSize={48} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <p className="text-sm text-muted">Waiting for ETF and exchange prints…</p>
      )}
      <ul className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {data.map((b) => (
          <li key={b.id} className="flex gap-2">
            <span className="mt-1.5 size-2.5 shrink-0 rounded-sm" style={{ background: b.color }} />
            <div>
              <p className="coinbase-orange text-xs font-medium tracking-[0.08em] uppercase">{b.name}</p>
              <p className={`mt-1 font-mono text-sm tabular-nums ${b.missing ? "text-muted" : USD_TONE}`}>
                {b.missing ? "—" : compactUsd(b.value)}
              </p>
              <p className="mt-0.5 text-xs text-muted">{b.note}</p>
            </div>
          </li>
        ))}
      </ul>
      <StackTable title="ETF / ETP stack" rows={snap?.capital.etfs ?? []} />
      <StackTable title="Public DAT stack" rows={snap?.capital.dats ?? []} />
      <p className="mt-3 text-xs text-muted">
        ETF bar is Bitbo global ETF/ETP holdings (IBIT, FBTC, GBTC, and the rest), not last-session
        flow. SoSoValue US net is in the ETF note
        {snap?.capital.etfFlow != null
          ? ` (${snap.capital.etfFlow >= 0 ? "+" : ""}${compactUsd(snap.capital.etfFlow)})`
          : ""}
        . DAT is Bitbo public-company holdings. El Salv is El Salvador’s reserve. LatAm is all Latin
        American official BTC (El Salvador + Venezuela and any other free prints). Sovereign is Bhutan
        + UAE (not seized US/CN/UK).
        Axis is log so El Salvador is readable next to ETF/DAT. Bar fill is ice → navy by size.
        Coinbase and other CEX are 24h spot notional. Hyperliquid is BTC perp 24h notional.
        {snap?.capital.asOf ? ` US ETF flow as of ${snap.capital.asOf}.` : ""}
      </p>
    </Panel>
  );
}

export default CapitalTapeChart;
