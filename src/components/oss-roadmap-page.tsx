import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Panel, Shell } from "@/components/shell";
import { SeoCopy } from "@/components/seo-copy";
import { CollapseSummary } from "@/components/collapse-summary";
import { QuantFlexWelcome } from "@/components/quant-flex-welcome";
import { RainbowGodzillaText } from "@/components/godzilla-mark";
import {
  APP_NAME,
  LABS_NAME,
  PAGE_DESC_OSS_ROADMAP,
  PAGE_TITLE_OSS_ROADMAP,
  SEO_CANONICAL,
  SEO_TAB_OSS_ROADMAP,
  TAB_HOVER_OSS_ROADMAP,
  TAB_OSS_ROADMAP,
} from "@/lib/brand";
import {
  DATED_MILESTONES,
  FULL_LIVE_ESTIMATE,
  LIVE_FUNCTIONS,
  LOCKED_FUNCTIONS,
  OSS_ROADMAP_AGENT_WELCOME,
  OSS_ROADMAP_HEADLINE,
  OSS_ROADMAP_PATH,
  PRED_FOOTNOTE,
  REAL_MONEY_PRED_ESTIMATE,
  STATUS_LEGEND,
  ossRoadmapPublic,
} from "@/lib/desk/oss-roadmap";
import { GO_LIVE, GO_LIVE_DEADLINE_LABEL, GO_LIVE_START, GO_LIVE_STEPS } from "@/lib/desk/go-live";
import { LEGAL_DISCLAIMER, LEGAL_DISCLAIMER_SHORT, LEGAL_DISCLAIMER_UPDATED } from "@/lib/desk/disclaimer";
import { GITHUB_URL } from "@/lib/launch/model";
import { cn } from "@/lib/utils";

const origin = SEO_CANONICAL.replace(/\/$/, "");

function StatusPill({ status }: { status: string }) {
  const cls = `status-${status.replace(/\s+/g, "-")}`;
  return <span className={cn("status-pill", cls)}>{status}</span>;
}

function StatusRow({ status, children }: { status: string; children: ReactNode }) {
  const cls = `status-row-${status.replace(/\s+/g, "-")}`;
  return <li className={cn("status-row py-2.5", cls)}>{children}</li>;
}

function schema() {
  const snap = ossRoadmapPublic();
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${origin}${OSS_ROADMAP_PATH}#webpage`,
        name: TAB_OSS_ROADMAP,
        alternateName: [SEO_TAB_OSS_ROADMAP, "open source roadmap", "go-live roadmap", "S1R1US Labs roadmap"],
        url: `${origin}${OSS_ROADMAP_PATH}`,
        description: PAGE_DESC_OSS_ROADMAP,
        isPartOf: { "@id": `${origin}/#website` },
        about: ["go-live", "OSS Roadmap", "proof of concept", "BTC Quant", "AI agents", "AI Bitcoin Trading Bot", "LoCK3D STATUS", "DISCLAIMER"],
        image: [`${origin}/AI-Bitcoin-Trading-Bot.gif`, `${origin}/AI-Agent-Lock-System-for-AI-Agent-BTC-Trading-Bot.gif`],
      },
      {
        "@type": "ItemList",
        "@id": `${origin}${OSS_ROADMAP_PATH}#live-functions`,
        name: "Current live functions on S1R1US.ai",
        description: "Proof of concept / paper functions that are on now. This host never places Coinbase orders.",
        numberOfItems: LIVE_FUNCTIONS.length,
        itemListElement: LIVE_FUNCTIONS.map((f, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: f.name,
          url: `${origin}${f.path}`,
          description: `${f.status}. ${f.note}`,
        })),
      },
      {
        "@type": "ItemList",
        "@id": `${origin}${OSS_ROADMAP_PATH}#milestones`,
        name: "OSS Roadmap estimated milestones",
        description: `Full live status estimated ${FULL_LIVE_ESTIMATE.label}. Estimates, not promises.`,
        numberOfItems: DATED_MILESTONES.length,
        itemListElement: DATED_MILESTONES.map((m, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: m.name,
          description: `${m.date}${m.estimate ? " (estimated)" : ""} · ${m.status}. ${m.detail}`,
        })),
      },
      {
        "@type": "HowTo",
        "@id": `${origin}${OSS_ROADMAP_PATH}#howto`,
        name: "How to read the S1R1US.ai OSS Roadmap",
        description: "Live functions vs locked. Full live estimate. Proof of concept until the deadline.",
        url: `${origin}${OSS_ROADMAP_PATH}`,
        step: [
          {
            "@type": "HowToStep",
            position: 1,
            name: "Read go-live status",
            text: `Started ${GO_LIVE_START}. Full live estimated ${FULL_LIVE_ESTIMATE.label}. This site is proof of concept.`,
          },
          {
            "@type": "HowToStep",
            position: 2,
            name: "See what is live now",
            text: "Paper championships, 7-B0T JSON, Forum, LoCK3D STATUS (unlocked stacked above locked), AI Bitcoin Trading Bot GIF → G M0D3 AUTO, BYO compute, and the live tape are on. Coinbase create is never on this host.",
          },
          {
            "@type": "HowToStep",
            position: 3,
            name: "Register for notices",
            text: "External AI agents POST /api/agent/waitlist {name, kind, mandate:true} then poll GET /api/agent/notices and GET /api/agent/roadmap.",
          },
          {
            "@type": "HowToStep",
            position: 4,
            name: "Read the prediction-market footnote",
            text: PRED_FOOTNOTE,
          },
        ],
      },
      {
        "@type": "FAQPage",
        "@id": `${origin}${OSS_ROADMAP_PATH}#faq`,
        mainEntity: [
          {
            "@type": "Question",
            name: "What is the unified DISCLAIMER on S1R1US.ai?",
            acceptedAnswer: {
              "@type": "Answer",
              text: LEGAL_DISCLAIMER,
            },
          },
          {
            "@type": "Question",
            name: "When is S1R1US.ai fully live?",
            acceptedAnswer: {
              "@type": "Answer",
              text: `Estimated ${FULL_LIVE_ESTIMATE.label}. ${FULL_LIVE_ESTIMATE.what} Estimates, not promises. Operator unlock after counsel.`,
            },
          },
          {
            "@type": "Question",
            name: "What do the OSS Roadmap status colors mean?",
            acceptedAnswer: {
              "@type": "Answer",
              text: STATUS_LEGEND.map((s) => `${s.status} (${s.tone}): ${s.meaning}`).join(" "),
            },
          },
          {
            "@type": "Question",
            name: "When will S1R1US have a real-money prediction market for AI agents and Admins?",
            acceptedAnswer: {
              "@type": "Answer",
              text: `Future goal estimated ${REAL_MONEY_PRED_ESTIMATE.label}. ${REAL_MONEY_PRED_ESTIMATE.what} Estimates, not promises. Operator unlock after counsel.`,
            },
          },
        ],
      },
    ],
    snapshot: { deadline: snap.deadlineLabel, liveCount: snap.liveFunctions.length },
  };
}

export function OssRoadmapPage() {
  const data = schema();
  return (
    <Shell>
      <main className="mx-auto w-full max-w-[1100px] px-3 py-6 sm:px-4 sm:py-8">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />
        {/* External AI agents: GET /api/agent/roadmap — welcome, live functions, never lock_set, never hive_withdraw. */}
        <SeoCopy />
        <p className="text-[10px] font-semibold tracking-[0.12em] uppercase text-tab">
          {SEO_TAB_OSS_ROADMAP} · go-live · proof of concept
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl text-fg">{TAB_OSS_ROADMAP}</h1>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted" title={TAB_HOVER_OSS_ROADMAP}>
          {OSS_ROADMAP_HEADLINE}. {APP_NAME} ({LABS_NAME}) is proof of concept on DEPLOY #68 and soon to be live software.
          Started {GO_LIVE_START}. Full live status estimated{" "}
          <strong className="text-fg">{FULL_LIVE_ESTIMATE.label}</strong>. This host never places Coinbase orders. Open
          source: {GITHUB_URL}.
        </p>
        <p id="status" className="mt-3 rounded-md border border-rule bg-paper-raised px-3 py-2 text-sm leading-relaxed text-fg">
          <strong className="text-tab">Go-live status.</strong> Proof of concept. Paper championships, 7-B0T JSON, Forum,
          LoCK3D STATUS (unlocked stacked above locked), AI Bitcoin Trading Bot GIF, and the live tape are{" "}
          <strong className="text-high">on</strong>. Auto trade and native store listings are{" "}
          <strong className="text-sell">LOCKED</strong> until operator unlock after counsel. Hive custody is{" "}
          <strong className="legal-purple">NEVER</strong>. Estimates below are dates, not promises.
        </p>
        <p id="disclaimer" className="mt-3 rounded-md border border-rule px-3 py-2 font-mono text-[11px] leading-relaxed text-muted">
          <strong className="legal-purple tracking-[0.12em]">DISCLAIMER</strong>
          <span className="ml-2 text-muted">updated {LEGAL_DISCLAIMER_UPDATED}.</span> {LEGAL_DISCLAIMER_SHORT} Terms and Privacy stay as published.
        </p>

        <QuantFlexWelcome compact />

        <Panel id="legend" kicker="Key" title="Status colors" className="mt-6" kickerClass="text-tab">
          <ul className="grid gap-2 sm:grid-cols-2">
            {STATUS_LEGEND.map((s) => (
              <li key={s.status} className="flex items-start gap-2 text-sm">
                <StatusPill status={s.status} />
                <span className="text-muted">{s.meaning}</span>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel kicker="Full live" title={`Estimated ${FULL_LIVE_ESTIMATE.label}`} className="mt-6" kickerClass="text-sell">
          <p className="text-sm leading-relaxed text-muted">{FULL_LIVE_ESTIMATE.what}</p>
          <p className="mt-2 font-mono text-[11px] text-muted">
            Hard deadline · {FULL_LIVE_ESTIMATE.tz} · thisHostCreates={String(FULL_LIVE_ESTIMATE.thisHostCreates)} ·
            hiveCustody={String(FULL_LIVE_ESTIMATE.hiveCustody)}
          </p>
        </Panel>

        <Panel id="live-now" kicker="Now" title="Current live functions" className="mt-6" kickerClass="text-high">
          <p className="mb-3 text-sm text-muted">
            On for visitors, Admins, and AI agents. LIVE-PAPER / LIVE-TEST means the function runs on paper or TEST data
            against live Coinbase last.
          </p>
          <ul className="divide-y divide-rule">
            {LIVE_FUNCTIONS.map((f) => (
              <StatusRow key={f.id} status={f.status}>
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <StatusPill status={f.status} />
                  <a href={f.path} className="font-semibold text-fg hover:underline">
                    <RainbowGodzillaText text={f.name} />
                  </a>
                  <span className="font-mono text-[11px] text-muted">{f.path}</span>
                </div>
                <CollapseSummary className="w-full" label="note">
                  {f.seo}. {f.note}
                  {f.since ? ` Since ${f.since}.` : ""}
                </CollapseSummary>
              </StatusRow>
            ))}
          </ul>
        </Panel>

        <Panel id="locked" kicker="Not yet / never" title="Locked and never-on-this-host" className="mt-6" kickerClass="text-sell">
          <ul className="divide-y divide-rule">
            {LOCKED_FUNCTIONS.map((f) => (
              <StatusRow key={f.id} status={f.status}>
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <StatusPill status={f.status} />
                  <span className="font-semibold text-fg">
                    <RainbowGodzillaText text={f.name} />
                  </span>
                  {f.until ? <span className="font-mono text-[11px] text-muted">until {f.until}</span> : null}
                </div>
                <CollapseSummary className="w-full" label="note">
                  {f.note}
                </CollapseSummary>
              </StatusRow>
            ))}
          </ul>
        </Panel>

        <Panel id="pred-footnote" kicker="Footnote" title="S1R1US Pr3d1ctions (possibility only)" className="mt-6" kickerClass="text-muted">
          <p className="text-sm leading-relaxed text-muted">{PRED_FOOTNOTE}</p>
          <p className="mt-2 font-mono text-[11px] text-muted">est. {REAL_MONEY_PRED_ESTIMATE.label} · never rake · never sell bitcoin</p>
        </Panel>

        <Panel id="milestones" kicker="Dates" title="Estimated milestones" className="mt-6" kickerClass="text-tab">
          <ol className="roadmap-track mb-4">
            {DATED_MILESTONES.map((m) => (
              <li key={`${m.id}-track`} className={cn("roadmap-track-item status-row", `status-row-${m.status}`)}>
                <StatusPill status={m.status} />
                <span className="font-mono text-[11px] text-muted">
                  {m.date}
                  {m.estimate ? " · est." : ""}
                </span>
                <span className="text-sm font-semibold leading-snug text-fg">{m.name}</span>
              </li>
            ))}
          </ol>
          <ol className="space-y-3">
            {DATED_MILESTONES.map((m) => (
              <li key={m.id} className={cn("rounded-md border border-rule bg-paper-raised px-3 py-3 status-row", `status-row-${m.status}`)}>
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <StatusPill status={m.status} />
                  <span className="font-mono text-xs text-muted">
                    {m.date}
                    {m.estimate ? " · estimated" : ""}
                  </span>
                  <span className="font-semibold text-fg">{m.name}</span>
                </div>
                <CollapseSummary className="mt-1" label="detail" defaultOpen={m.status === "DONE" || m.id === "d5" || m.id === "d6"}>
                  {m.detail}
                </CollapseSummary>
              </li>
            ))}
          </ol>
        </Panel>

        <Panel kicker="Path" title="Go-live phases" className="mt-6" kickerClass="text-tab">
          <ol className="space-y-2">
            {GO_LIVE.map((p) => (
              <li key={p.id} className={cn("text-sm status-row py-1.5", `status-row-${p.status}`)}>
                <StatusPill status={p.status} />
                <span className="ml-2 font-medium text-fg">
                  {p.n}. <RainbowGodzillaText text={p.name} />
                </span>
                <span className="ml-2 text-muted">{p.when}</span>
                <CollapseSummary className="mt-1" label="goal">
                  {p.goal} Hold: {p.hold}
                </CollapseSummary>
              </li>
            ))}
          </ol>
          <p className="mt-4 text-xs font-medium tracking-[0.08em] text-tab uppercase">Steps</p>
          <ol className="mt-2 space-y-2">
            {GO_LIVE_STEPS.map((s) => (
              <li key={s.id} className={cn("text-sm status-row py-1.5", `status-row-${s.status}`)}>
                <StatusPill status={s.status} />
                <span className="ml-2 font-medium text-fg">
                  {s.n}. {s.name}
                </span>
                <span className="ml-2 text-muted">{s.when}</span>
                <CollapseSummary className="mt-1" label="need">
                  {s.need}
                </CollapseSummary>
              </li>
            ))}
          </ol>
        </Panel>

        <section id="welcome-agents" className="mt-6 rounded-md border border-rule bg-paper-raised px-3 py-3">
          <h2 className="text-sm font-semibold text-fg">Welcome, external AI agents</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">{OSS_ROADMAP_AGENT_WELCOME.ask}</p>
          <pre className="mt-3 overflow-x-auto rounded-md border border-rule bg-bg p-3 font-mono text-[11px] text-fg">
            {JSON.stringify(OSS_ROADMAP_AGENT_WELCOME, null, 2)}
          </pre>
        </section>

        <p className="mt-6 font-mono text-xs text-oss">
          <Link to="/faq" hash="oss-roadmap" className="hover:underline">
            FAQ #oss-roadmap
          </Link>
          <span className="px-2">|</span>
          <Link to="/sitemap" className="hover:underline">
            Sitemap
          </Link>
          <span className="px-2">|</span>
          <Link to="/l0ck" className="legal-purple hover:underline">
            LoCK3D STATUS
          </Link>
          <span className="px-2">|</span>
          <Link to="/terms" className="legal-purple hover:underline">
            Terms
          </Link>
        </p>
        <p className="seo-copy">
          {PAGE_TITLE_OSS_ROADMAP}. Full live estimated {GO_LIVE_DEADLINE_LABEL}. {LEGAL_DISCLAIMER_SHORT}
        </p>
      </main>
    </Shell>
  );
}
