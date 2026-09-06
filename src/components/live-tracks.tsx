import { Panel } from "@/components/shell";
import { stanceClass } from "@/components/helios-card";
import type { BotBrief } from "@/lib/desk/types";
import { cn } from "@/lib/utils";

const ORDER = ["filings", "earnings", "sector", "sentiment", "rotation", "coordinator"] as const;

export function LiveTracks({
  briefs,
  kicker = "B0TS 1–6",
  title = "Live Hedge Fund analysts",
  note = "Visual summary of bots 1–6. Each stance is an independent lane Bot 7 reads.",
}: {
  briefs: BotBrief[];
  kicker?: string;
  title?: string;
  note?: string;
}) {
  const six = ORDER.map((id) => briefs.find((b) => b.id === id)).filter(Boolean) as BotBrief[];
  return (
    <Panel className="mt-4" kicker={kicker} title={title} kickerClass="bots-1-6" titleClass="text-medium">
      <p className="mb-3 text-xs text-muted">{note}</p>
      {six.length ? (
        <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {six.map((b, i) => (
            <li key={b.id} className="rounded-md border border-rule bg-bg/60 p-3">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-medium">
                  <span className="mr-1.5 font-mono text-[11px] text-muted">{i + 1}</span>
                  {b.name}
                </p>
                <span className={cn("shrink-0 font-mono text-[11px] uppercase", stanceClass(b.stance))}>
                  {b.stance}
                </span>
              </div>
              <p className="mt-1 text-[11px] tracking-[0.08em] text-muted uppercase">{b.layer}</p>
              <p className="mt-1 flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.08em] text-muted">
                <span className={cn("inline-block size-1.5 rounded-full", b.status === "live" ? "bg-high" : "bg-muted")} />
                {b.status} · {b.sources.join(" · ")}
              </p>
              <p className="mt-2 text-sm leading-relaxed">{b.summary}</p>
              {b.bullets[0] ? <p className="mt-1 truncate text-xs text-muted">{b.bullets[0]}</p> : null}
            </li>
          ))}
        </ol>
      ) : (
        <p className="text-sm text-muted">Waiting for the first cycle from bots 1–6…</p>
      )}
    </Panel>
  );
}
