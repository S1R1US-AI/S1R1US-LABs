import { useState } from "react";
import { Panel } from "@/components/shell";
import { cn } from "@/lib/utils";
import {
  OWL_LIVE_DATA_NOTE,
  OWL_SANDBOX_RULES,
  OWL_SECURITY_POLICY,
  OWL_SUBFORUM_DESCRIPTION,
  OWL_SUBFORUM_TITLE,
  OWL_TOP_50,
  owlSecurityAnalysis,
  owlSecuritySummary,
  type OwlSuggestion,
} from "@/lib/desk/owl-forum";

type ViewMode = "live" | "code";

const viewLabels: Record<ViewMode, string> = {
  live: "LIVE",
  code: "Code View",
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
  if (mode === "live") return "LIVE = [ Suggested code implemented on a live simulation of S1R1US.ai — sandbox only, never merged ]";
  return "Code View = [ Copy/paste the suggested improvement into the S1R1US C0D3 B0X sandbox — illustrative preview only, not system source ]";
}

/** LIVE — professional trading-desk simulation preview of the suggested code. */
function OwlLiveView({ item }: { item: OwlSuggestion }) {
  const sim = item.liveSim;
  return (
    <div className="overflow-hidden rounded-md border border-rule">
      <div className="flex flex-wrap items-center gap-2 border-b border-rule bg-surface/80 px-3 py-2">
        <span className={cn(
          "rounded-sm border px-1.5 py-0.5 font-mono text-[10px] font-semibold tracking-[0.08em]",
          sim.dataMode === "LIVE" ? "border-high/50 text-high" : "border-medium/50 text-medium",
        )}>
          {sim.dataMode === "LIVE" ? "LIVE DATA" : "SIM · SAMPLE DATA"}
        </span>
        <span className="font-mono text-[10px] text-muted">W1S3 0WL$ #{String(item.rank).padStart(2, "0")}</span>
        <span className="ml-auto font-mono text-[10px] text-muted">SANDBOX ONLY · NO PR · NO MERGE</span>
      </div>
      <div className="carbon-fiber px-3 py-3">
        <p className="text-sm font-semibold text-fg">{item.title}</p>
        <p className="mt-0.5 font-mono text-[11px] text-muted">
          {item.source} · {item.agent} · {item.category}
        </p>
        <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-3 lg:grid-cols-6">
          <SimStat k="Render latency" v={`${sim.latencyMs}ms`} />
          <SimStat k="Cache age" v={`${sim.cacheAgeSec}s · ETag`} />
          <SimStat k="Poll floor" v={`${sim.pollFloorSec}s`} />
          <SimStat k="Sim uptime" v={`${sim.uptimePct}%`} />
          <SimStat k="Checksum" v={sim.checksum} />
          <SimStat k="Security" v={`${item.securityScore}/100`} tone={scoreTone(item.securityScore)} />
        </div>
        <p className="mt-3 rounded-sm border border-rule bg-bg/70 px-2 py-1.5 font-mono text-[11px] text-muted">
          {sim.status}
        </p>
      </div>
      <p className="border-t border-rule bg-surface/80 px-3 py-2 text-[11px] leading-relaxed text-muted">{OWL_LIVE_DATA_NOTE}</p>
    </div>
  );
}

function SimStat({ k, v, tone }: { k: string; v: string; tone?: string }) {
  return (
    <div className="min-w-0">
      <p className="font-mono text-[10px] tracking-[0.12em] text-muted uppercase">{k}</p>
      <p className={cn("mt-0.5 truncate font-mono text-xs tabular-nums", tone ?? "text-fg")}>{v}</p>
    </div>
  );
}

export function OwlForumAdmin() {
  const [expandedId, setExpandedId] = useState<string | null>(OWL_TOP_50[0]?.id ?? null);
  const [detailId, setDetailId] = useState<string | null>(null);
  const [viewById, setViewById] = useState<Record<string, ViewMode>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const security = owlSecuritySummary();
  const analysis = owlSecurityAnalysis();

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
            const mode = viewById[item.id] ?? "live";
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

                    <div className="mt-3">
                      <p className="mb-2 font-mono text-[11px] tracking-[0.08em] text-muted uppercase">{viewHeading(mode)}</p>
                      {mode === "live" ? (
                        <OwlLiveView item={item} />
                      ) : (
                        <div className="overflow-hidden rounded-md border border-rule">
                          <div className="flex items-center gap-2 border-b border-rule bg-surface/80 px-3 py-2">
                            <span className="size-2 rounded-full bg-sell/70" aria-hidden />
                            <span className="size-2 rounded-full bg-medium/70" aria-hidden />
                            <span className="size-2 rounded-full bg-high/70" aria-hidden />
                            <span className="ml-2 font-mono text-[10px] text-muted">{item.id}.preview.ts · read-only</span>
                            <span className="ml-auto font-mono text-[10px] text-muted">S1R1US C0D3 B0X · sandbox</span>
                          </div>
                          <pre className="max-h-72 overflow-auto whitespace-pre-wrap break-words bg-bg p-3 font-mono text-xs leading-relaxed text-fg">
                            {item.codeView}
                          </pre>
                        </div>
                      )}
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

      <Panel kicker="SECURITY ANALYSIS" title="Agent-suggestion review — consulting detail" className="bg-bg/95">
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-3 lg:grid-cols-6">
          <SimStat k="Suggestions" v={String(analysis.total)} />
          <SimStat k="Avg score" v={analysis.avgScore.toFixed(1)} tone={scoreTone(analysis.avgScore)} />
          <SimStat k="Min score" v={String(analysis.minScore)} tone={scoreTone(analysis.minScore)} />
          <SimStat k="Cleared" v={String(analysis.cleared)} tone="text-high" />
          <SimStat k="Needs review" v={String(analysis.review)} tone={analysis.review ? "text-medium" : "text-high"} />
          <SimStat k="Blocked" v={String(analysis.blocked)} tone="text-high" />
        </div>
        <div className="mt-4 max-h-80 overflow-auto rounded-md border border-rule">
          <table className="w-full text-left font-mono text-xs">
            <thead className="sticky top-0 bg-surface text-[10px] tracking-[0.1em] text-muted uppercase">
              <tr>
                <th className="px-2 py-1.5">#</th>
                <th className="px-2 py-1.5">Agent</th>
                <th className="px-2 py-1.5">Score</th>
                <th className="px-2 py-1.5">Disposition</th>
                <th className="px-2 py-1.5">Analysis</th>
              </tr>
            </thead>
            <tbody>
              {analysis.findings.map((f) => (
                <tr key={f.id} className="border-t border-rule align-top">
                  <td className="px-2 py-1.5 text-muted">{String(f.rank).padStart(2, "0")}</td>
                  <td className="px-2 py-1.5 text-fg">{f.agent}</td>
                  <td className={cn("px-2 py-1.5", scoreTone(f.score))}>{f.score}/100</td>
                  <td className={cn("px-2 py-1.5 font-semibold", f.disposition === "CLEARED" ? "text-high" : "text-medium")}>
                    {f.disposition}
                  </td>
                  <td className="px-2 py-1.5 text-muted">{f.flags.join(" ")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 rounded-md border border-rule bg-surface/80 p-3">
          <p className="font-mono text-[11px] tracking-[0.1em] text-muted uppercase">S1R1US C0D3 B0X — sandbox enforcement</p>
          <ul className="mt-2 space-y-2 text-sm leading-relaxed text-muted">
            {OWL_SANDBOX_RULES.map((rule) => (
              <li key={rule} className="flex gap-2">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-sell" />
                <span>{rule}</span>
              </li>
            ))}
          </ul>
        </div>
      </Panel>
    </div>
  );
}
