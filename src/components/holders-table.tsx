import { useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Panel } from "@/components/shell";
import { money } from "@/components/helios-card";
import { TROY_OZ_PER_TONNE } from "@/lib/desk/gold-sovereign";
import type { DeskSnapshot, MetalHolding } from "@/lib/desk/types";
import { cn, BTC_TONE, USD_TONE } from "@/lib/utils";

function btcFmt(n: number) {
  return n.toLocaleString("en-US", { maximumFractionDigits: n >= 1000 ? 0 : 1 });
}

function ozFmt(n: number | null) {
  if (n == null || !Number.isFinite(n)) return "—";
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M oz`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(0)}K oz`;
  return `${n.toFixed(0)} oz`;
}

function chgHex(n: number | null) {
  if (n == null) return "var(--color-muted)";
  if (n > 0) return "#3dff1a";
  if (n < 0) return "#ff1f1f";
  return "var(--color-muted)";
}

export function HoldersTable({ snap }: { snap: DeskSnapshot | null }) {
  return (
    <>
      <BtcHoldersTable snap={snap} />
      <MetalBoards snap={snap} />
    </>
  );
}

export function BtcHoldersTable({ snap }: { snap: DeskSnapshot | null }) {
  const rows = snap?.holders.holders ?? [];
  const btcRegions = snap?.holders.btcRegions ?? [];
  const btcPx = snap?.btc.price ?? null;
  const [open, setOpen] = useState(false);
  const shown = open ? rows : rows.slice(0, 5);
  const hidden = Math.max(0, rows.length - 5);
  return (
    <>
      <Panel className="mb-4" kicker="Who holds it" title="Top 20 bitcoin holders" kickerClass="text-medium" titleClass="text-medium">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="mb-2 flex w-full items-baseline justify-between gap-3 rounded-md py-1 text-left hover:bg-fg/4"
        >
          <span className="font-mono text-sm text-high">
            Top 5 shown
            {rows[0] ? ` · #1 ${rows[0].name}` : ""}
            {hidden ? ` · +${hidden} more` : ""}
          </span>
          <span className="shrink-0 font-mono text-[11px] expand-ctl">{open ? "collapse" : "expand top 20"}</span>
        </button>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[40rem] text-left text-sm">
            <thead>
              <tr className="border-b border-rule text-xs font-medium tracking-[0.08em] text-muted uppercase">
                <th className="py-2 pr-3">#</th>
                <th className="py-2 pr-3">Holder</th>
                <th className={`py-2 pr-3 text-right ${BTC_TONE}`}>BTC</th>
                <th className={`py-2 pr-3 text-right ${USD_TONE}`}>USD</th>
                <th className="py-2 pr-3">How it is held</th>
              </tr>
            </thead>
            <tbody>
              {shown.map((h) => (
                <tr key={`${h.rank}-${h.name}`} className="border-b border-rule/70">
                  <td className="py-2 pr-3 font-mono tabular-nums text-muted">{h.rank}</td>
                  <td className="py-2 pr-3">
                    <a href={h.url} className="text-fg hover:text-brand" target="_blank" rel="noreferrer">
                      {h.name}
                    </a>
                    <p className="text-xs text-muted">
                      {h.country ?? "—"}
                      {h.sharePct != null ? ` · ${h.sharePct.toFixed(2)}% of 21m` : ""}
                    </p>
                  </td>
                  <td className={`py-2 pr-3 text-right font-mono tabular-nums ${BTC_TONE}`}>{btcFmt(h.btc)}</td>
                  <td className={`py-2 pr-3 text-right font-mono tabular-nums ${USD_TONE}`}>
                    {h.usd != null ? money(h.usd, 0) : "—"}
                  </td>
                  <td className="py-2 pr-3 text-muted">{h.held}</td>
                </tr>
              ))}
              {!rows.length ? (
                <tr>
                  <td colSpan={5} className="py-3 text-muted">
                    Waiting for Bitbo treasuries…
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-muted">
          Bitbo tracked entities. “How it is held” is the vehicle (ETF, treasury,
          government, wrap) — not a wallet-level audit. Exchange customer coins are custody, not treasury.
        </p>
      </Panel>

      <SlicePie
        className="mb-4"
        kicker="Sovereign bitcoin"
        title="Bitcoin by region"
        slices={btcRegions.map((r) => ({
          id: r.id,
          name: r.name,
          value: r.btc,
          estimate: r.estimate,
          note: r.note,
          fill: r.fill,
        }))}
        format={(n) => btcAmt(n)}
        usdOf={(n) => (btcPx != null && btcPx > 0 ? n * btcPx : null)}
        caption="Government / seized BTC only — not ETFs or DATs. China, NK, Iran, Pakistan, Saudi are estimates (Grok max ceiling where no public print). Label only — does not vote."
        wide
      />
    </>
  );
}

export function MetalBoards({ snap }: { snap: DeskSnapshot | null }) {
  const gold = snap?.holders.gold ?? [];
  const silver = snap?.holders.silver ?? [];
  const goldRegions = snap?.holders.goldRegions ?? [];
  const goldBanks = snap?.holders.goldBanks ?? [];
  const gld = snap?.quotes.find((q) => q.symbol === "GLD") ?? gold.find((r) => r.symbol === "GLD");
  const slv = snap?.quotes.find((q) => q.symbol === "SLV") ?? silver.find((r) => r.symbol === "SLV");
  const gcf = snap?.quotes.find((q) => q.symbol === "GC=F" || q.symbol === "GC%3DF");
  const sif = snap?.quotes.find((q) => q.symbol === "SI=F" || q.symbol === "SI%3DF");
  const goldPx = gcf?.last ?? (gld?.last != null ? gld.last / 0.095 : null);
  const silverPx = sif?.last ?? (slv?.last != null ? slv.last / 1 : null);
  const [goldBreakOpen, setGoldBreakOpen] = useState(false);
  return (
    <>
      <Panel className="mb-4" kicker="Official gold" title="Region · central bank" kickerClass="text-[#ffd24a]" titleClass="text-[#ffd24a]">
        <div className="grid gap-6 lg:grid-cols-2">
          <SlicePie
            bare
            compact
            legend={false}
            kicker="Sovereign metal"
            title="By region"
            slices={goldRegions.map((r) => ({
              id: r.id,
              name: r.name,
              value: r.tonnes,
              estimate: r.estimate,
              note: r.note,
              fill: r.fill,
            }))}
            format={(n) => tFmt(n)}
            usdOf={(n) => (goldPx != null && goldPx > 0 ? n * TROY_OZ_PER_TONNE * goldPx : null)}
            caption=""
          />
          <SlicePie
            bare
            compact
            legend={false}
            kicker="Central banks"
            title="By bank"
            slices={goldBanks.map((r) => ({
              id: r.id,
              name: r.name,
              value: r.tonnes,
              estimate: r.estimate,
              note: r.note,
              fill: r.fill,
            }))}
            format={(n) => tFmt(n)}
            usdOf={(n) => (goldPx != null && goldPx > 0 ? n * TROY_OZ_PER_TONNE * goldPx : null)}
            caption=""
          />
        </div>
        <button
          type="button"
          onClick={() => setGoldBreakOpen((o) => !o)}
          aria-expanded={goldBreakOpen}
          className="mt-3 flex w-full items-baseline justify-between gap-3 rounded-md py-1 text-left hover:bg-fg/4"
        >
          <span className="text-xs font-medium tracking-[0.08em] expand-ctl uppercase">
            Region · central bank breakdown
          </span>
          <span className="font-mono text-[11px] expand-ctl">
            {goldRegions.length} regions · {goldBanks.length} banks · {goldBreakOpen ? "collapse" : "expand"}
          </span>
        </button>
        {goldBreakOpen ? (
          <div className="mt-3 grid gap-6 lg:grid-cols-2">
            <SliceLegend
              slices={goldRegions.map((r) => ({
                id: r.id,
                name: r.name,
                value: r.tonnes,
                estimate: r.estimate,
                note: r.note,
                fill: r.fill,
              }))}
              format={tFmt}
              compact
            />
            <SliceLegend
              slices={goldBanks.map((r) => ({
                id: r.id,
                name: r.name,
                value: r.tonnes,
                estimate: r.estimate,
                note: r.note,
                fill: r.fill,
              }))}
              format={tFmt}
              compact
            />
          </div>
        ) : null}
        <p className="mt-3 text-xs text-muted">
          IMF / WGC official tonnes. Region groups the book; bank is the same tonnes one slice per holder.
          EU = national CBs + ECB, UK excluded. Iran and NK estimated. Canada 0 t. Pink = euro-area. Labels
          only — do not vote.
        </p>
      </Panel>

      <div className="mb-4 grid gap-4 lg:grid-cols-2">
        <MetalPanel
          kicker="Store of value"
          title="Gold holdings"
          kickerClass="text-[#ffd24a]"
          titleClass="text-[#ffd24a]"
          rows={gold}
          metal="Gold"
          spot={goldPx}
          empty="Waiting for GLD / IAU / PHYS…"
          note="Spot from GC=F, else GLD / 0.095 oz. Miners (GDX, NEM, Barrick) are equity, not allocated bars."
        />
        <MetalPanel
          kicker="Store of value"
          title="Silver holdings"
          kickerClass="text-[#c5d0dc]"
          titleClass="text-[#c5d0dc]"
          rows={silver}
          metal="Silver"
          spot={silverPx}
          empty="Waiting for SLV / PSLV / miners…"
          note="Spot from SI=F, else SLV ~1 oz/share. PAAS / WPM / SIL are equity claims on production."
        />
      </div>
    </>
  );
}

function MetalPanel({
  kicker,
  title,
  kickerClass,
  titleClass,
  rows,
  metal,
  spot,
  empty,
  note,
}: {
  kicker: string;
  title: string;
  kickerClass?: string;
  titleClass?: string;
  rows: MetalHolding[];
  metal: string;
  spot: number | null;
  empty: string;
  note: string;
}) {
  return (
    <Panel kicker={kicker} title={title} kickerClass={kickerClass} titleClass={titleClass}>
      <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
        <p className="text-xs font-medium tracking-[0.08em] text-muted uppercase">Spot {metal} / oz</p>
        <p className={cn("font-mono text-2xl tabular-nums", USD_TONE)}>
          {spot != null ? money(spot, 2) : "—"}
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[28rem] text-left text-sm">
          <thead>
            <tr className="border-b border-rule text-xs font-medium tracking-[0.08em] text-muted uppercase">
              <th className="py-2 pr-3">Vehicle</th>
              <th className="py-2 pr-3 text-right">Last</th>
              <th className="py-2 pr-3 text-right">Day</th>
              <th className={`py-2 pr-3 text-right ${USD_TONE}`}>AUM</th>
              <th className="py-2 pr-3 text-right">{metal}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((s) => (
              <tr key={s.symbol} className="border-b border-rule/70">
                <td className="py-2 pr-3">
                  <p className="font-medium text-fg">{s.symbol}</p>
                  <p className="text-xs text-muted">{s.name}</p>
                  <p className="text-[11px] text-muted">{s.held}</p>
                </td>
                <td className="py-2 pr-3 text-right font-mono tabular-nums">{s.last != null ? money(s.last, 2) : "—"}</td>
                <td className="py-2 pr-3 text-right font-mono tabular-nums" style={{ color: chgHex(s.changePct) }}>
                  {s.changePct == null ? "—" : `${s.changePct >= 0 ? "+" : ""}${s.changePct.toFixed(2)}%`}
                </td>
                <td className={cn("py-2 pr-3 text-right font-mono tabular-nums", USD_TONE)}>
                  {s.aumUsd != null ? money(s.aumUsd, 0) : "—"}
                </td>
                <td className="py-2 pr-3 text-right font-mono tabular-nums">{s.kind === "miner" ? "—" : ozFmt(s.oz)}</td>
              </tr>
            ))}
            {!rows.length ? (
              <tr>
                <td colSpan={5} className="py-3 text-muted">
                  {empty}
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-muted">{note}</p>
    </Panel>
  );
}

function tFmt(n: number) {
  if (n <= 0) return "0 t";
  return `${n.toLocaleString("en-US", { maximumFractionDigits: n >= 100 ? 0 : 1 })} t`;
}

function btcAmt(n: number) {
  if (n <= 0) return "0 BTC";
  return `${n.toLocaleString("en-US", { maximumFractionDigits: n >= 100 ? 0 : 1 })} BTC`;
}

type Slice = {
  id: string;
  name: string;
  value: number;
  estimate: boolean;
  note: string;
  fill: string;
};

function SliceLegend({
  slices,
  format,
  compact,
}: {
  slices: Slice[];
  format: (n: number) => string;
  compact?: boolean;
}) {
  const total = slices.reduce((s, r) => s + r.value, 0);
  return (
    <ul className={cn("grid gap-1", compact ? "grid-cols-2" : "sm:grid-cols-1")}>
      {slices.map((r) => {
        const share = total > 0 ? (r.value / total) * 100 : 0;
        return (
          <li
            key={r.id}
            className={cn(
              "flex items-start justify-between gap-2 rounded-md border border-rule/70 px-2",
              compact ? "py-1" : "py-1.5",
            )}
          >
            <span className="flex min-w-0 items-start gap-2">
              <span className="mt-1 size-2.5 shrink-0 rounded-full" style={{ background: r.fill }} />
              <span className="min-w-0">
                <span className="text-sm text-fg">{r.name}</span>
                {r.estimate ? <span className="ml-1 text-[10px] tracking-wide text-muted uppercase">est.</span> : null}
                {compact ? null : <p className="text-[11px] text-muted">{r.note}</p>}
              </span>
            </span>
            <span className="shrink-0 text-right font-mono text-xs tabular-nums">
              <span className="block text-fg">{format(r.value)}</span>
              <span className="text-muted">{r.value > 0 ? `${share.toFixed(1)}%` : "—"}</span>
            </span>
          </li>
        );
      })}
    </ul>
  );
}

function SlicePie({
  kicker,
  title,
  slices,
  format,
  usdOf,
  caption,
  className,
  wide,
  bare,
  compact,
  legend = true,
}: {
  kicker: string;
  title: string;
  slices: Slice[];
  format: (n: number) => string;
  usdOf: (n: number) => number | null;
  caption: string;
  className?: string;
  wide?: boolean;
  bare?: boolean;
  compact?: boolean;
  legend?: boolean;
}) {
  const total = slices.reduce((s, r) => s + r.value, 0);
  const pie = slices.filter((r) => r.value > 0);
  const inner = (
    <>
      {bare ? (
        <p className="mb-2">
          <span className="block font-mono text-[11px] tracking-[0.12em] text-muted uppercase">{kicker}</span>
          <span className="text-sm font-medium text-fg">{title}</span>
        </p>
      ) : null}
      <div
        className={cn(
          "grid items-center gap-3",
          compact || !legend
            ? "grid-cols-1"
            : wide
              ? "lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)]"
              : "lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]",
        )}
      >
        <div className={compact ? "h-44" : wide ? "h-72" : "h-64"}>
          {pie.length ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pie}
                  dataKey="value"
                  nameKey="name"
                  innerRadius="46%"
                  outerRadius="78%"
                  paddingAngle={1.5}
                  stroke="var(--color-bg)"
                >
                  {pie.map((r) => (
                    <Cell key={r.id} fill={r.fill} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(_v, _n, item) => {
                    const row = item?.payload as Slice;
                    const share = total > 0 ? (row.value / total) * 100 : 0;
                    const u = usdOf(row.value);
                    return [`${format(row.value)} · ${share.toFixed(1)}% of book${u != null ? ` · ${money(u, 0)}` : ""}`, row.name];
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-muted">Waiting for book…</p>
          )}
        </div>
        {legend ? <SliceLegend slices={slices} format={format} compact={compact} /> : null}
      </div>
      {caption ? <p className="mt-3 text-xs text-muted">{caption}</p> : null}
    </>
  );
  if (bare) return <div className={className}>{inner}</div>;
  return (
    <Panel className={className} kicker={kicker} title={title}>
      {inner}
    </Panel>
  );
}
