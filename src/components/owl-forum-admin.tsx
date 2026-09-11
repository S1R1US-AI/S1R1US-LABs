import { useState } from "react";
import { Panel } from "@/components/shell";
import { cn } from "@/lib/utils";
import {
  OWL_SECURITY_POLICY,
  OWL_SUBFORUM_DESCRIPTION,
  OWL_SUBFORUM_TITLE,
  OWL_TOP_50,
  owlSecuritySummary,
  type OwlSuggestion,
} from "@/lib/desk/owl-forum";

type ViewMode = "code" | "live" | "source";

const viewLabels: Record<ViewMode, string> = {
  code: "Code View",
  live: "LIVE",
  source: "SOURCE",
};

function sourceTone(source: OwlSuggestion["source"]) {
  if (source === "External AI agent") return "border-medium/40 text-medium";
  if (source === "W1S3 0WL$ sub-forum") return "border-high/40 text-high";
  return "border-fg/20 text-fg";
}

function scoreTone(score: number) {
  if (score >= 99) return "text-high";
  if (score >= 95) return "text-medium";
  return "text-muted";
}

function viewHeading(mode: ViewMode) {
  if (mode === "live") return "LIVE = [ Preview of Source Code (if implemented and live in admin simulation) ]";
  if (mode === "source") return 'SOURCE = [ Preview of "System Source Code" (if implemented and live in admin simulation) ]';
  return "Code View = [ Illustrative preview only — not system source ]";
}

export function OwlForumAdmin() {
  const [expandedId, setExpandedId] = useState<string | null>(OWL_TOP_50[0]?.id ?? null);
  const [detailId, setDetailId] = useState<string | null>(null);
  const [viewById, setViewById] = useState<Record<string, ViewMode>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const security = owlSecuritySummary();

  async function copyForClaude(item: OwlSuggestion) {
    const preamble = [
      "Claude review request:",
      "Verify 100% adherence to the S1R1US system mandate, security policies, and game rules.",
      "Treat the following as illustrative preview code only, not system source.",
      "Confirm no source access, admin access, write path, betting path, order path, or proprietary data exposure is implied.",
    ].join("\n");
    await navigator.clipboard.writeText(`${preamble}\n\n${item.codeView}`);
    setCopiedId(item.id);
  }

  return (
    <div className="mt-6 space-y-4">
      <Panel
        kicker="W1S3 0WL$ / ADMIN FORUM"
        title={OWL_SUBFORUM_TITLE}
        className="carbon-fiber border-rule bg-bg/95"
        kickerClass="text-high"
        titleClass="text-fg"
      >
        <div className="space-y-3">
          <p className="text-sm leading-relaxed text-muted">{OWL_SUBFORUM_DESCRIPTION}</p>
          <p className="rounded-md border border-rule bg-surface/80 px-3 py-2 font-mono text-xs text-medium">
            Admin only — not visible to phone app users. Static client-side review surface; no network calls, no external write path.
          </p>
        </div>
      </Panel>

      <Panel kicker="RANKED REVIEW QUEUE" title="Top 50 W1S3 0WL$" className="bg-bg/95">
        <div className="space-y-2">
          {OWL_TOP_50.map((item) => {
            const expanded = expandedId === item.id;
            const detailOpen = detailId === item.id;
            const mode = viewById[item.id] ?? "code";
            const content = mode === "code" ? item.codeView : mode === "live" ? item.liveView : item.sourceView;
            return (
              <article key={item.id} className="overflow-hidden rounded-md border border-rule bg-surface/70">
                <button
                  type="button"
                  className="grid w-full gap-2 px-3 py-3 text-left sm:grid-cols-[3.5rem_1fr_auto] sm:items-center"
                  onClick={() => setExpandedId(expanded ? null : item.id)}
                  aria-expanded={expanded}
                >
                  <span className="font-mono text-xs text-muted">#{String(item.rank).padStart(2, "0")}</span>
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold text-fg">{item.title}</span>
                    <span className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted">
                      <span className={cn("rounded-full border px-2 py-0.5 font-mono", sourceTone(item.source))}>{item.source}</span>
                      <span>{item.agent}</span>
                      <span>{item.category}</span>
                    </span>
                  </span>
                  <span className={cn("font-mono text-xs font-semibold", scoreTone(item.securityScore))}>
                    SEC {item.securityScore}/100
                  </span>
                </button>

                {expanded ? (
                  <div className="border-t border-rule px-3 pb-3">
                    <p className="mt-3 text-sm leading-relaxed text-muted">{item.summary}</p>
                    <button
                      type="button"
                      className="mt-2 text-xs font-semibold text-high underline decoration-dotted underline-offset-4"
                      onClick={() => setDetailId(detailOpen ? null : item.id)}
                    >
                      Detailed summary {detailOpen ? "−" : "+"}
                    </button>
                    {detailOpen ? <p className="mt-2 text-sm leading-relaxed text-fg">{item.detail}</p> : null}

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      {(Object.keys(viewLabels) as ViewMode[]).map((nextMode) => (
                        <button
                          key={nextMode}
                          type="button"
                          className={cn(
                            "rounded-md border border-rule px-3 py-1.5 font-mono text-xs transition",
                            mode === nextMode ? "bg-fg text-bg" : "bg-bg text-muted hover:text-fg",
                          )}
                          onClick={() => setViewById((prev) => ({ ...prev, [item.id]: nextMode }))}
                        >
                          {viewLabels[nextMode]}
                        </button>
                      ))}
                      {mode === "code" ? (
                        <button
                          type="button"
                          className="rounded-md border border-high/40 px-3 py-1.5 font-mono text-xs text-high hover:bg-high/10"
                          onClick={() => void copyForClaude(item)}
                        >
                          {copiedId === item.id ? "Copied" : "Copy for Claude review"}
                        </button>
                      ) : null}
                    </div>

                    <div className="mt-3 rounded-md border border-rule bg-bg p-3">
                      <p className="mb-2 font-mono text-[11px] tracking-[0.08em] text-muted uppercase">{viewHeading(mode)}</p>
                      <pre className="max-h-72 overflow-auto whitespace-pre-wrap break-words font-mono text-xs leading-relaxed text-fg">
                        {content}
                      </pre>
                    </div>
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>
      </Panel>

      <Panel kicker="SECURITY POLICY" title="External AI agent hard rules" className="bg-bg/95">
        <div className="grid gap-4 lg:grid-cols-[1fr_14rem]">
          <ul className="space-y-2 text-sm leading-relaxed text-muted">
            {OWL_SECURITY_POLICY.map((rule) => (
              <li key={rule} className="flex gap-2">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-high" />
                <span>{rule}</span>
              </li>
            ))}
          </ul>
          <div className="rounded-md border border-rule bg-surface/80 p-3">
            <p className={cn("font-mono text-3xl font-semibold", scoreTone(security.score))}>{security.score}/100</p>
            <p className="mt-2 text-sm leading-relaxed text-muted">{security.note}</p>
          </div>
        </div>
      </Panel>
    </div>
  );
}
