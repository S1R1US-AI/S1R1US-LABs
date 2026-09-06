import { useState } from "react";
import { Panel } from "@/components/shell";
import { money } from "@/components/helios-card";
import type { DeskSnapshot, PoolStatus, SlowPool } from "@/lib/desk/types";
import { cn, USD_TONE } from "@/lib/utils";

function fmtPct(n: number | null) {
  if (n == null || Number.isNaN(n)) return "—";
  return `${n >= 0 ? "+" : ""}${n.toFixed(2)}%`;
}

function statusTone(s: PoolStatus) {
  if (s === "holding") return "text-high";
  if (s === "law" || s === "pipe") return "text-medium";
  if (s === "bill") return "text-tab";
  return "text-muted";
}

function rotTone(n: number | null) {
  if (n == null) return "text-muted";
  if (n >= 1.2) return "text-high";
  if (n <= -1.2) return "text-down";
  return "text-muted";
}

export function SlowPoolsBoard({ snap }: { snap: DeskSnapshot | null }) {
  const pools = snap?.pools.pools ?? [];
  const holding = pools.filter((p) => p.status === "holding").length;
  const law = pools.filter((p) => p.status === "law" || p.status === "pipe").length;
  const watch = pools.filter((p) => p.status === "bill" || p.status === "watch").length;
  const [open, setOpen] = useState(false);
  return (
    <Panel
      className="mt-4"
      kicker="Slow capital · 5-year pipes"
      title="CRE · 401k · insurers · endowments · state reserves"
      kickerClass="indicator-title"
      titleClass="indicator-title"
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-baseline justify-between gap-3 rounded-md py-1 text-left hover:bg-fg/4"
      >
        <span className="font-mono text-sm text-fg">
          {holding} holding · {law} law/pipe · {watch} bill/watch
        </span>
        <span className="shrink-0 font-mono text-[11px] expand-ctl">{open ? "collapse" : "expand"}</span>
      </button>
      {open ? (
        <>
          <p className="mt-2 text-sm text-muted">
            Largest traditional alpha pools that may rotate into bitcoin. Most do not publish a live BTC
            book — this is status + a free proxy vs IBIT, not a 5-minute AUM. Does not vote unless Rotation
            sees CRE/Nasdaq leaving for IBIT.
          </p>
          <p className="mt-2 font-mono text-xs text-muted">
            {snap?.pools.reviewedAt ? `weekly hunt ${snap.pools.reviewedAt.slice(0, 10)}` : ""}
            {snap?.pools.source ? ` · ${snap.pools.source}` : ""}
          </p>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[40rem] text-left text-sm">
              <thead>
                <tr className="border-b border-rule text-[11px] font-medium tracking-[0.08em] text-muted uppercase">
                  <th className="py-2 pr-3">Pool</th>
                  <th className="py-2 pr-3">Status</th>
                  <th className="py-2 pr-3">Proxy</th>
                  <th className="py-2 pr-3 text-right">vs IBIT</th>
                  <th className={`py-2 text-right ${USD_TONE}`}>Disclosed</th>
                </tr>
              </thead>
              <tbody>
                {pools.map((p) => (
                  <PoolRow key={p.id} p={p} />
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <p className="mt-1 text-xs text-muted">Click to open CRE, 401k, insurers, endowments, state bills.</p>
      )}
    </Panel>
  );
}

function PoolRow({ p }: { p: SlowPool }) {
  return (
    <tr className="border-b border-rule/70 align-top">
      <td className="py-2 pr-3">
        <span className="text-fg">{p.name}</span>
        <span className="mt-0.5 block text-[11px] text-muted">{p.sleeve}</span>
        <span className="mt-0.5 block max-w-xl text-[11px] leading-snug text-muted">{p.note}</span>
      </td>
      <td className={cn("py-2 pr-3 font-mono text-[11px] uppercase", statusTone(p.status))}>{p.status}</td>
      <td className="py-2 pr-3 font-mono text-xs">
        {p.proxy ?? "—"}
        {p.proxyChg != null ? <span className="mt-0.5 block text-muted">{fmtPct(p.proxyChg)}</span> : null}
      </td>
      <td className={cn("py-2 pr-3 text-right font-mono text-xs tabular-nums", rotTone(p.vsIbit))}>
        {p.vsIbit == null ? "—" : fmtPct(p.vsIbit)}
      </td>
      <td className={`py-2 text-right font-mono text-xs tabular-nums ${p.disclosedUsd != null ? USD_TONE : "text-muted"}`}>
        {p.disclosedUsd != null ? money(p.disclosedUsd, 0) : "—"}
      </td>
    </tr>
  );
}
