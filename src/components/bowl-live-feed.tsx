import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Panel } from "@/components/shell";
import {
  CallOutLabel,
  LeaderBoardLabel,
  ManualKingLabel,
  RoundKingLabel,
  SuperBowlLabel,
} from "@/components/godzilla-mark";
import { MENU_BOARD, TAB_BOWL } from "@/lib/brand";
import { GO_LIVE_DEADLINE_LABEL } from "@/lib/desk/go-live";
import { cn } from "@/lib/utils";

type King = { id: string; name: string; btc?: number; wins?: number; rank?: number } | null;
type Fight = {
  status?: string;
  challenger?: { name: string; btc: number };
  target?: { name: string; btc: number };
  round?: number;
  hoursLeft?: number;
} | null;
type Row = { id: string; name: string; kindLabel?: string; official?: { btc: number; pnlUsd?: number } };

type Feed = {
  status?: string;
  btcUsd?: number | null;
  count?: number;
  leader?: { name: string; official?: { btc: number } } | null;
  top?: Row[];
  callout?: {
    roundKing?: King;
    liveFights?: Fight[];
  };
};

function btc(n: number | undefined) {
  if (n == null || !Number.isFinite(n)) return "—";
  return n.toFixed(6);
}
function usd(n: number | null | undefined) {
  if (n == null || !Number.isFinite(n)) return "—";
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

/** Public Super Bowl / AI-agent stats. Paper live until the go-live deadline. */
export function BowlLiveFeed({ compact = false }: { compact?: boolean }) {
  const [feed, setFeed] = useState<Feed | null>(null);

  useEffect(() => {
    let gone = false;
    async function load() {
      try {
        const r = await fetch("/api/agent/board", { headers: { accept: "application/json" } });
        const j = (await r.json()) as Feed;
        if (!gone) setFeed(j);
      } catch {
        /* keep last */
      }
    }
    void load();
    const id = window.setInterval(() => void load(), 20_000);
    return () => {
      gone = true;
      window.clearInterval(id);
    };
  }, []);

  const live = feed?.status === "LIVE";
  const fight = feed?.callout?.liveFights?.[0] ?? null;
  const rows = (feed?.top ?? []).slice(0, compact ? 3 : 5);
  const statusLabel = !feed ? "…" : live ? "PAPER LIVE" : "PAUSED";

  return (
    <Panel
      kicker="Live feed"
      title={<SuperBowlLabel className="text-base font-semibold" />}
      kickerClass="indicator-title"
      titleClass="indicator-title"
    >
      <p className="font-mono text-[11px] leading-relaxed text-muted">
        <span className={cn("font-semibold", !feed ? "text-muted" : live ? "text-high" : "text-medium")}>
          {statusLabel}
        </span>
        {" · AI agent trading stats as-if-live until GO-LIVE "}
        {GO_LIVE_DEADLINE_LABEL}
        {" · Coinbase create LOCKED"}
      </p>
      <p className="mt-2 font-mono text-xs text-fg">
        Coinbase last {usd(feed?.btcUsd ?? null)} · {feed?.count ?? 0} desks ·{" "}
        <Link to="/board" className="text-tab hover:underline">
          {MENU_BOARD}
        </Link>
        {" · "}
        <Link to="/bowl" className="text-tab hover:underline">
          {TAB_BOWL}
        </Link>
      </p>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <p className="font-mono text-xs">
          <ManualKingLabel className="text-xs" /> · {feed?.leader?.name ?? "—"} · {btc(feed?.leader?.official?.btc)} BTC
        </p>
        <p className="font-mono text-xs">
          <RoundKingLabel className="text-xs" /> · {feed?.callout?.roundKing?.name ?? "—"} ·{" "}
          {feed?.callout?.roundKing?.wins ?? 0} wins
        </p>
      </div>
      {fight ? (
        <p className="mt-2 font-mono text-xs text-fg">
          <CallOutLabel className="text-xs" /> live · r{fight.round ?? 1}/5 · {fight.challenger?.name} vs {fight.target?.name}
          {fight.hoursLeft != null ? ` · ~${fight.hoursLeft}h` : ""}
        </p>
      ) : (
        <p className="mt-2 font-mono text-xs text-muted">
          <CallOutLabel className="text-xs" /> · no live bout — paper sleeve waiting
        </p>
      )}
      <ol className="mt-3 space-y-1 font-mono text-[11px]">
        {rows.map((r, i) => (
          <li key={r.id} className="flex justify-between gap-2">
            <span>
              {i + 1}. {r.name}
              <span className="text-muted"> · {r.kindLabel ?? ""}</span>
            </span>
            <span className={cn((r.official?.pnlUsd ?? 0) >= 0 ? "text-high" : "text-sell")}>
              {btc(r.official?.btc)} BTC
            </span>
          </li>
        ))}
      </ol>
      <p className="mt-3 text-xs leading-relaxed text-muted">
        Education only. 100 percent at your own risk. Not financial advice. Seek a licensed professional.
        <span className="px-1">·</span>
        <LeaderBoardLabel className="text-xs" /> is paper. This host never places Coinbase orders.
      </p>
    </Panel>
  );
}
