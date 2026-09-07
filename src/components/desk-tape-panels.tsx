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

export function AsiaPanel({ snap }: { snap: DeskSnapshot | null }) {
  return null;
}
export function EmFlowPanel({ snap }: { snap: DeskSnapshot | null }) {
  return null;
}
export function Quotes({ snap }: { snap: DeskSnapshot | null }) {
  return null;
}
export function WirePanel({ snap }: { snap: DeskSnapshot | null }) {
  return null;
}
export function CoinbasePanel({ call }: { call: HeliosCall | null }) {
  return (
    <Panel className="mt-4" kicker="Execution" title="Coinbase for Agents" kickerClass="indicator-title" titleClass="indicator-title">
      <p className="text-sm leading-relaxed text-muted">
        S1R1US.ai never holds your CDP secret. Preview here, then run the CLI or connect MCP at{" "}
        <a className="text-fg underline-offset-2 hover:underline" href="https://agents.coinbase.com/mcp" target="_blank" rel="noreferrer">
          agents.coinbase.com/mcp
        </a>
        . Docs:{" "}
        <a className="text-fg underline-offset-2 hover:underline" href="https://docs.cdp.coinbase.com/coinbase-for-agents/overview" target="_blank" rel="noreferrer">
          Coinbase for Agents
        </a>
        .
      </p>
      {call ? (
        <pre className="mt-3 overflow-x-auto rounded-md bg-bg px-3 py-2 font-mono text-[11px]">{JSON.stringify(call.preview, null, 2)}</pre>
      ) : null}
      <p className="mt-3 flex items-center gap-2 text-xs text-muted">
        <Activity className="size-3.5" /> Isolated portfolio · Trade + Transfer · always <span className="font-mono">orders preview</span> before create.
      </p>
    </Panel>
  );
}
