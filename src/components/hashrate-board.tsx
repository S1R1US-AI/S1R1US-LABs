import { useMemo, useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Panel } from "@/components/shell";
import type { DeskSnapshot, HashRegion } from "@/lib/desk/types";
import { cn, BTC_TONE } from "@/lib/utils";

const SUBSIDY = 3.125;
const BLOCKS_DAY = 144;

const FILL: Record<string, string> = {
  na: "#2563eb",
  cn: "var(--color-accum)",
  jp: "var(--color-hash-jp)",
  eu: "var(--color-hash-eu)",
  ru: "var(--color-medium)",
  ot: "var(--color-hash-ot)",
};

type Unit = "TH" | "PH" | "EH";

function toEh(qty: number, unit: Unit) {
  if (unit === "TH") return qty / 1e6;
  if (unit === "PH") return qty / 1e3;
  return qty;
}

function fmtEh(n: number | null) {
  if (n == null || !Number.isFinite(n)) return "—";
  if (n >= 1000) return `${(n / 1000).toFixed(2)} ZH/s`;
  return `${n.toFixed(1)} EH/s`;
}

function fmtDiff(n: number | null) {
  if (n == null || !Number.isFinite(n)) return "—";
  if (n >= 1e12) return `${(n / 1e12).toFixed(2)} T`;
  return n.toExponential(2);
}

function fmtShare(n: number) {
  if (!(n > 0)) return "—";
  const pct = n * 100;
  if (pct >= 1) return `${pct.toFixed(2)}%`;
  if (pct >= 0.001) return `${pct.toFixed(4)}%`;
  return `${pct.toExponential(1)}%`;
}

function fmtBtcDay(n: number) {
  if (!(n > 0)) return "—";
  if (n >= 1) return n.toFixed(3);
  if (n >= 0.0001) return n.toFixed(6);
  return n.toPrecision(3);
}

export function HashrateBoard({ snap }: { snap: DeskSnapshot | null }) {
  const [qty, setQty] = useState("100");
  const [unit, setUnit] = useState<Unit>("TH");
  const network = snap?.onchain.hashrateEh ?? null;
  const regions = snap?.onchain.regions ?? [];
  const mineEh = toEh(Number(qty) || 0, unit);
  const share = network && network > 0 ? mineEh / network : 0;
  const btcDay = share * SUBSIDY * BLOCKS_DAY;
  const pie = useMemo(() => {
    const rows = regions.map((r) => ({ ...r, pct: r.share * 100 }));
    if (rows.length > 0 && !rows.some((r) => r.id === "na")) {
      rows.unshift({ id: "na", name: "North America", share: 0, eh: 0, pct: 0 });
    }
    return rows.sort((a, b) => (a.id === "na" ? -1 : b.id === "na" ? 1 : b.share - a.share));
  }, [regions]);

  return (
    <div className="mb-4 grid gap-4 lg:grid-cols-2">
      <Panel kicker="Network" title="Bitcoin hashpower" kickerClass="text-medium" titleClass="text-medium">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <Metric label="Hashrate" value={fmtEh(network)} hint={snap?.onchain.source ?? "mempool.space"} />
          <Metric label="Difficulty" value={fmtDiff(snap?.onchain.difficulty ?? null)} hint="Current" />
          <Metric
            label="Height"
            value={snap?.onchain.height != null ? snap.onchain.height.toLocaleString("en-US") : "—"}
            hint="Tip"
          />
          <Metric
            label="Fast fee"
            value={snap?.onchain.feeFast != null ? `${snap.onchain.feeFast} sat/vB` : "—"}
            hint={snap?.onchain.feeEcon != null ? `econ ${snap.onchain.feeEcon}` : "mempool.space"}
          />
        </div>
        <form className="mt-3 rounded-md border border-rule bg-bg/50 p-3" onSubmit={(e) => e.preventDefault()}>
          <div className="flex flex-wrap items-end gap-2">
            <label className="min-w-[8rem] flex-1 text-xs font-medium tracking-[0.08em] text-muted uppercase">
              Your hash
              <input
                type="number"
                min={0}
                step="any"
                value={qty}
                onChange={(e) => setQty(e.target.value)}
                className="mt-1 h-10 w-full rounded-md border border-rule bg-bg px-3 font-mono text-sm text-fg"
              />
            </label>
            <fieldset className="flex shrink-0 gap-1">
              <legend className="sr-only">Unit</legend>
              {(["TH", "PH", "EH"] as const).map((u) => (
                <button
                  key={u}
                  type="button"
                  aria-pressed={unit === u}
                  onClick={() => setUnit(u)}
                  className={cn(
                    "h-10 min-h-10 rounded-md px-2.5 text-xs font-medium",
                    unit === u ? "bg-brand text-accent-fg" : "border border-rule bg-bg text-muted",
                  )}
                >
                  {u}/s
                </button>
              ))}
            </fieldset>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <Metric label="Share" value={fmtShare(share)} hint={fmtEh(mineEh)} />
            <Metric label="BTC / day" value={fmtBtcDay(btcDay)} hint={`${fmtShare(share)} of subsidy`} tone={BTC_TONE} />
          </div>
        </form>
        <p className="mt-2 text-xs text-muted">
          Subsidy {SUBSIDY} BTC × {BLOCKS_DAY} blocks/day, no fees. Not a forecast.
        </p>
      </Panel>

      <Panel kicker="Geography" title="Where the hash is" kickerClass="text-medium" titleClass="text-medium">
        {pie.length ? (
          <div className="grid items-center gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pie}
                    dataKey="share"
                    nameKey="name"
                    innerRadius="48%"
                    outerRadius="78%"
                    paddingAngle={2}
                    stroke="var(--color-bg)"
                  >
                    {pie.map((r) => (
                      <Cell key={r.id} fill={FILL[r.id] ?? "var(--color-muted)"} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v, _n, item) => {
                      const row = item?.payload as HashRegion & { pct?: number };
                      return [`${(row.pct ?? 0).toFixed(1)}% · ${fmtEh(row.eh)}`, row.name];
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <ul className="space-y-1.5 text-sm">
              {pie.map((r) => (
                <li key={r.id} className="flex items-center justify-between gap-2">
                  <span className="flex items-center gap-2">
                    <span
                      className="size-2.5 shrink-0 rounded-full"
                      style={{ background: FILL[r.id] ?? "var(--color-muted)" }}
                    />
                    {r.name}
                  </span>
                  <span className="font-mono tabular-nums text-muted">
                    {(r.share * 100).toFixed(1)}%
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-sm text-muted">Waiting for pool geography…</p>
        )}
        <p className="mt-3 text-xs text-muted">
          Live pool share (1w). Foundry USA, MARA, Luxor, OCEAN, CKPool roll up as North America. Not miner IP
          (Cambridge map is not a free live feed).
        </p>
      </Panel>
    </div>
  );
}

function Metric({ label, value, hint, tone }: { label: string; value: string; hint?: string; tone?: string }) {
  return (
    <div className="min-w-0">
      <p className={cn("text-[10px] font-medium tracking-[0.08em] uppercase leading-tight", tone || "text-muted")}>
        {label}
      </p>
      <p className={cn("mt-0.5 truncate font-mono text-base tabular-nums tracking-tight sm:text-lg", tone)}>{value}</p>
      {hint ? <p className="mt-0.5 truncate text-[11px] text-muted">{hint}</p> : null}
    </div>
  );
}
