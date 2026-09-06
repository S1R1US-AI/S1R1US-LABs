import { useState } from "react";
import { GO_LIVE, GO_LIVE_HEADLINE, GO_LIVE_START } from "@/lib/desk/go-live";

const tone: Record<string, string> = {
  STARTED: "text-high",
  NEXT: "text-tab",
  QUEUED: "text-muted",
  LOCKED: "text-sell",
};

export function GoLivePanel() {
  const [open, setOpen] = useState(false);
  return (
    <section className="min-w-0 max-w-full rounded-lg border border-rule bg-surface p-4 shadow-[var(--shadow-border)] sm:p-5">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="block w-full rounded-md text-left hover:bg-fg/4"
      >
        <p className="text-xs font-medium tracking-[0.08em] text-tab uppercase">Started {GO_LIVE_START}</p>
        <h2 className="text-sm font-semibold tracking-tight text-medium sm:text-base">Go-live path</h2>
      </button>
      {open ? (
        <div className="mt-3">
          <p className="font-mono text-xs text-high">{GO_LIVE_HEADLINE}</p>
          <p className="mt-2 text-sm text-muted">
            Baseline: N3W Web App Installation Build (new theme) DEPLOY #68. Grok, Claude, GPT, and Coinbase for
            Agents: start at /agent and /llms.txt. Auto GM practice next. Auto AI agent access queued. Auto trade
            LOCKED — this host never creates Coinbase orders. Copycats get a dashboard and a formula, not the BTC book.
          </p>
          <ol className="mt-3 space-y-2">
            {GO_LIVE.map((p) => (
              <li key={p.id} className="text-sm">
                <span className={`font-mono text-xs ${tone[p.status] ?? "text-muted"}`}>{p.status}</span>
                <span className="ml-2 font-medium text-fg">
                  {p.n}. {p.name}
                </span>
                <span className="ml-2 text-muted">{p.when}</span>
                <p className="mt-0.5 text-xs leading-relaxed text-muted">{p.goal}</p>
              </li>
            ))}
          </ol>
        </div>
      ) : null}
    </section>
  );
}
