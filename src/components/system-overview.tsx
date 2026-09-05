import { Panel } from "@/components/shell";
import { APP_NAME, BOT7_NAME, TAB_DESK, TAB_GM, TAB_LAB } from "@/lib/brand";
import { MANDATE, systemView } from "@/lib/desk/system-logic";
import { useDeskTape } from "@/lib/desk/tape-client";
import { stanceClass } from "@/components/helios-card";
import { cn } from "@/lib/utils";

function ago(iso: string | null) {
  if (!iso) return "waiting";
  const ms = Date.now() - new Date(iso).getTime();
  if (!Number.isFinite(ms) || ms < 0) return "live";
  const m = Math.round(ms / 60000);
  if (m < 1) return "just now";
  if (m === 1) return "1 min ago";
  return `${m} min ago`;
}

export function SystemOverview({ showRoadmap = false }: { showRoadmap?: boolean }) {
  const { snap } = useDeskTape();
  const view = systemView(snap);
  const six = view.roster.filter((b) => b.id !== "helios");
  const helios = view.roster.find((b) => b.id === "helios");
  const stops = view.stops.filter((r) => ["clip", "stop", "short", "live"].includes(r.id));
  return (
    <Panel
      className="mt-4"
      kicker="7-B0T H3DGE FUND"
      title={`${APP_NAME} system logic`}
      kickerClass="text-high"
      titleClass="text-high"
    >
      <p className="text-sm text-muted">
        {helios?.name ?? BOT7_NAME} is the overseer. Bots 1–6 vote orthogonal lanes. Two agreeing
        lanes are required for HIGH conviction. SuperGrok is the only paid feed. Tape paints in two
        beats — core ({view.cycle.coreMs / 1000}s: price, RSI, F&G, leverage, Asia, ETF flow) then
        fill (holders, news, filings, EM, macro). Same roster as {TAB_DESK}. {TAB_LAB} overlays that
        tape. {TAB_GM} is an isolated sleeve (practice for all, Live admin-only) and does not vote
        bots 1–7. This block rebuilds on every 5-minute pull.
      </p>
      <p className="mt-2 font-mono text-[11px] text-muted">
        logic {view.reviewed} · {view.launch} · {view.cycle.name} · tape {ago(view.fetchedAt)}
        {showRoadmap ? ` · admin roadmap ${view.roadmap.length} steps` : ""}
      </p>
      <ol className="mt-3 space-y-1.5 text-sm text-fg">
        {MANDATE.map((line, i) => (
          <li key={line}>
            <span className="font-mono text-xs text-muted">{i + 1}.</span> {line}
          </li>
        ))}
      </ol>
      <ul className="mt-4 divide-y divide-rule text-sm">
        {six.map((b, i) => {
          const live = view.briefs.find((x) => x.id === b.id);
          return (
            <li key={b.id} className="flex items-baseline gap-3 py-2">
              <span className="w-4 shrink-0 font-mono text-xs text-muted">{i + 1}</span>
              <span className="min-w-0 flex-1">
                <span className="text-fg">{live?.name ?? b.name}</span>
                <span className="mt-0.5 block text-xs text-muted">
                  {b.layer} · {live?.summary ?? b.feed}
                </span>
              </span>
              {live ? (
                <span className={cn("shrink-0 font-mono text-xs uppercase", stanceClass(live.stance))}>
                  {live.stance}
                </span>
              ) : null}
            </li>
          );
        })}
        {helios ? (
          <li className="flex items-baseline gap-3 py-2">
            <span className="w-4 shrink-0 font-mono text-xs text-muted">7</span>
            <span className="min-w-0 flex-1">
              <span className="text-high">{helios.name}</span>
              <span className="mt-0.5 block text-xs text-muted">
                {view.call
                  ? `${view.call.stance} ${view.call.conviction} · ${view.call.thesis.slice(0, 180)}${view.call.thesis.length > 180 ? "…" : ""}`
                  : helios.feed}
              </span>
            </span>
            {view.call ? (
              <span className={cn("shrink-0 font-mono text-xs uppercase", stanceClass(view.call.stance))}>
                {view.call.stance}
              </span>
            ) : null}
          </li>
        ) : null}
      </ul>
      <ul className="mt-4 space-y-1 text-xs text-muted">
        {stops.map((r) => (
          <li key={r.id}>
            <span className="text-fg">{r.label}.</span> {r.value}
          </li>
        ))}
      </ul>
    </Panel>
  );
}
