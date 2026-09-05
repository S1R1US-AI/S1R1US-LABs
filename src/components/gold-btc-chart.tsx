import { useMemo } from "react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Panel } from "@/components/shell";
import { money } from "@/components/helios-card";
import type { DeskSnapshot } from "@/lib/desk/types";
import { BTC_TONE } from "@/lib/utils";

const GOLD = "#ffd24a";
const GOLD_TEXT = "text-[#ffd24a]";

function monthTick(t: number) {
  return new Date(t).toLocaleString("en-US", { month: "short" });
}

export function GoldBtcChart({ snap }: { snap: DeskSnapshot | null }) {
  const tape = snap?.goldBtc;
  const gcf = snap?.quotes.find((q) => q.symbol === "GC=F" || q.symbol === "GC%3DF");
  const btcUsd = snap?.btc.price ?? tape?.btcUsd ?? null;
  const goldUsd = gcf?.last ?? tape?.goldUsd ?? null;
  const oz = btcUsd != null && goldUsd != null && goldUsd > 0 ? btcUsd / goldUsd : tape?.ozPerBtc ?? null;
  const btcPerOz = oz != null && oz > 0 ? 1 / oz : tape?.btcPerOz ?? null;
  const rows = useMemo(
    () =>
      (tape?.series ?? []).map((p) => ({
        t: p.t,
        oz: p.ozPerBtc,
        label: monthTick(p.t),
      })),
    [tape?.series],
  );

  return (
    <Panel className="mb-4" kicker="XAU / BTC · gold spot" title="Gold to bitcoin" titleClass={GOLD_TEXT} kickerClass={GOLD_TEXT}>
      <div className="mb-3 flex flex-wrap items-end gap-x-6 gap-y-2">
        <div>
          <p className={`font-mono text-[11px] tracking-[0.08em] uppercase ${GOLD_TEXT}`}>Oz gold / BTC</p>
          <p className={`font-mono text-2xl tabular-nums ${GOLD_TEXT}`}>
            {oz != null ? oz.toFixed(2) : "—"}
          </p>
        </div>
        <div>
          <p className={`font-mono text-[11px] tracking-[0.08em] uppercase ${BTC_TONE}`}>BTC / oz</p>
          <p className={`font-mono text-lg tabular-nums ${BTC_TONE}`}>
            {btcPerOz != null ? btcPerOz.toFixed(5) : "—"}
          </p>
        </div>
        <div>
          <p className={`font-mono text-[11px] tracking-[0.08em] uppercase ${GOLD_TEXT}`}>Gold</p>
          <p className={`font-mono text-sm tabular-nums ${GOLD_TEXT}`}>{goldUsd != null ? money(goldUsd, 0) : "—"}</p>
        </div>
        <div>
          <p className={`font-mono text-[11px] tracking-[0.08em] uppercase ${BTC_TONE}`}>Bitcoin</p>
          <p className={`font-mono text-sm tabular-nums ${BTC_TONE}`}>{btcUsd != null ? money(btcUsd, 0) : "—"}</p>
        </div>
      </div>
      <div className="h-44 sm:h-52">
        {rows.length ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={rows} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid stroke="var(--color-rule)" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="label" tick={{ fill: "var(--color-muted)", fontSize: 11 }} interval="preserveStartEnd" />
              <YAxis
                domain={["auto", "auto"]}
                tick={{ fill: "var(--color-muted)", fontSize: 11 }}
                width={42}
                tickFormatter={(v) => Number(v).toFixed(1)}
              />
              <Tooltip
                contentStyle={{ background: "var(--color-bg)", border: "1px solid var(--color-rule)", fontSize: 12 }}
                formatter={(v) => [`${Number(v).toFixed(2)} oz`, "Gold / BTC"]}
              />
              <Line type="monotone" dataKey="oz" stroke={GOLD} strokeWidth={2.25} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-sm text-muted">Waiting on Yahoo GC=F / BTC-USD weekly spark.</p>
        )}
      </div>
      <p className="mt-2 text-xs text-muted">
        Ounces of gold that equal one bitcoin (BTC-USD ÷ COMEX gold). Weekly, 1 year. {tape?.source ?? ""}
      </p>
    </Panel>
  );
}
