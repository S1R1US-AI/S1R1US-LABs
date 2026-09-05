import { useEffect, useState } from "react";
import { Panel } from "@/components/shell";
import { fetchDeskErrors } from "@/lib/desk/desk-rpc";
import type { DeskError } from "@/lib/desk/error-log";
import { cn } from "@/lib/utils";

export function DeskErrorLog() {
  const [rows, setRows] = useState<DeskError[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let gone = false;
    void fetchDeskErrors().then((list) => {
      if (!gone && Array.isArray(list)) setRows(list.slice(0, 100));
    });
    const id = window.setInterval(() => {
      void fetchDeskErrors().then((list) => {
        if (!gone && Array.isArray(list)) setRows(list.slice(0, 100));
      });
    }, 60_000);
    return () => {
      gone = true;
      window.clearInterval(id);
    };
  }, []);

  const top = rows.slice(0, 5);
  const rest = rows.slice(5);
  const openCount = rows.filter((r) => r.attention || !r.resolved).length;

  return (
    <Panel className="mt-4" kicker="Run log" title="Last 100 cycle errors">
      <p className="mb-3 font-mono text-[11px] text-muted">
        {openCount} open · {rows.length} stored · top 5 always on
      </p>
      {rows.length === 0 ? (
        <p className="text-sm text-muted">No cycle errors stored yet. Autonomous pull writes them here.</p>
      ) : (
        <>
          <ErrorList rows={top} />
          {rest.length ? (
            <button
              type="button"
              className="mt-3 text-sm text-tab hover:underline"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
            >
              {open ? "Collapse" : `Expand ${rest.length} more`}
            </button>
          ) : null}
          {open ? <ErrorList rows={rest} className="mt-3" /> : null}
        </>
      )}
    </Panel>
  );
}

function ErrorList({ rows, className }: { rows: DeskError[]; className?: string }) {
  return (
    <ul className={cn("space-y-2", className)}>
      {rows.map((r) => (
        <li key={r.id} className="rounded-md border border-rule bg-surface/60 px-3 py-2">
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <span className={cn("font-mono text-[11px] font-semibold uppercase", r.resolved && !r.attention ? "text-muted" : "text-down")}>
              error
            </span>
            <span className={cn("font-mono text-[11px] font-semibold uppercase", r.resolved && !r.attention ? "text-up" : "text-muted")}>
              green
            </span>
            <span className="font-mono text-[11px] text-muted">
              {new Date(r.at).toLocaleString("en-US", { hour: "2-digit", minute: "2-digit", month: "short", day: "numeric" })}
            </span>
            <span className="font-mono text-[11px] text-tab">{r.source}</span>
          </div>
          <p className="mt-1 font-mono text-xs text-fg">{r.msg}</p>
          <p className="mt-0.5 text-xs text-muted">{r.verdict}</p>
        </li>
      ))}
    </ul>
  );
}
