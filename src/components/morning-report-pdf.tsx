import { Download, ExternalLink, Pause, Play } from "lucide-react";
import { useEffect, useState } from "react";
import { Panel } from "@/components/shell";
import { fetchDeskErrors, fetchMorningLib, fetchAgentFlags, fetchSecurityBrief, setMorningReportPaused } from "@/lib/desk/desk-rpc";
import { useGm } from "@/lib/desk/gm-store";
import { GM_NAME } from "@/lib/desk/gm";
import type { DeskError } from "@/lib/desk/error-log";
import { MORNING_PDF_BASE64, MORNING_PDF_NAME, MORNING_PDF_PAGES } from "@/lib/desk/morning-pdf";
import { MORNING_KEEP, MORNING_TITLE, MORNING_VISIBLE, morningInlineHref, morningPdfName } from "@/lib/desk/morning-lib";
import { useOperator } from "@/lib/desk/operator";
import { useDeskTape } from "@/lib/desk/tape-client";
import { morningAgent, morningFeeds, morningSecurity } from "@/lib/desk/morning-ops";
import { GoLivePanel } from "@/components/go-live-panel";
import { ANALYSIS_AS_OF } from "@/lib/desk/security";
import { SeoImage } from "@/components/seo-image";
import { cn } from "@/lib/utils";

type Report = {
  id: string;
  at: string;
  title: string;
  pages: number;
  pdf: string;
  thumbs: string[];
};

function pdfBytes() {
  const bin = atob(MORNING_PDF_BASE64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

function downloadBlob(name: string, bytes: Uint8Array) {
  const copy = new Uint8Array(bytes.byteLength);
  copy.set(bytes);
  const blob = new Blob([copy], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 2000);
}

export function downloadMorningPdf() {
  downloadBlob(MORNING_PDF_NAME, pdfBytes());
}

export function MorningReportPdf() {
  const token = useOperator((s) => s.token);
  const [page, setPage] = useState(1);
  const [paused, setPaused] = useState(false);
  const [pausedAt, setPausedAt] = useState<string | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | "live">("live");
  const [busy, setBusy] = useState(false);

  async function load() {
    if (!token) return;
    const res = await fetchMorningLib({ data: { token } });
    if (!res.ok) return;
    setPaused(res.paused);
    setPausedAt(res.pausedAt);
    setReports(res.reports);
  }

  useEffect(() => {
    void load();
  }, [token]);

  async function toggle() {
    if (!token || busy) return;
    setBusy(true);
    const res = await setMorningReportPaused({ data: { token, paused: !paused } });
    setBusy(false);
    if (!res.ok) return;
    setPaused(res.paused);
    setPausedAt(res.pausedAt);
    setReports(res.reports);
  }

  const selected =
    active === "live"
      ? reports[0] ?? null
      : reports.find((r) => r.id === active) ?? reports[0] ?? null;
  const thumbs = selected?.thumbs?.length ? selected.thumbs : [];
  const pageCount = selected ? Math.max(selected.pages, thumbs.length, 1) : MORNING_PDF_PAGES;
  const src = selected ? thumbs[page - 1] ?? thumbs[0] : `/morning-report-${page}.jpg`;
  const recent = reports.slice(0, MORNING_VISIBLE);
  const rest = reports.slice(MORNING_VISIBLE, MORNING_KEEP);
  const inline = selected ? morningInlineHref(selected.id) : null;
  const canDownload = Boolean(selected && recent.some((r) => r.id === selected.id));

  return (
    <>
    <Panel className="mt-4" kicker="Daily" title={MORNING_TITLE}>
      <p className="text-sm leading-relaxed text-muted">
        08:00 ET ops PDF. Last {MORNING_KEEP} days kept. {MORNING_VISIBLE} on screen. Expand for the rest.
        Newest {MORNING_VISIBLE} include a PDF that opens in this browser.
      </p>
      <p className={cn("mt-2 font-mono text-xs", paused ? "text-down" : "text-up")}>
        {paused ? `PAUSED${pausedAt ? ` · ${new Date(pausedAt).toLocaleString("en-US")}` : ""}` : "LIVE · next 08:00 ET"}
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => void toggle()}
          disabled={busy || !token}
          className="inline-flex h-11 min-h-11 items-center gap-2 rounded-md border border-rule bg-surface px-4 text-sm font-medium"
        >
          {paused ? <Play className="size-4 text-up" /> : <Pause className="size-4 text-down" />}
          {paused ? "Resume" : "Pause"}
        </button>
        {inline ? (
          <a
            href={`${inline}#toolbar=1`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-11 min-h-11 items-center gap-2 rounded-md border border-rule bg-surface px-4 text-sm font-medium"
          >
            <ExternalLink className="size-4" />
            Open PDF in browser
          </a>
        ) : null}
        {canDownload ? (
          <a
            href={`${inline}?dl=1`}
            download={selected ? morningPdfName(selected.id) : MORNING_PDF_NAME}
            className="inline-flex h-11 min-h-11 items-center gap-2 rounded-md bg-accent px-4 text-sm font-medium text-accent-fg"
          >
            <Download className="size-4" />
            Download PDF
          </a>
        ) : (
          <button
            type="button"
            onClick={() => downloadMorningPdf()}
            className="inline-flex h-11 min-h-11 items-center gap-2 rounded-md bg-accent px-4 text-sm font-medium text-accent-fg"
          >
            <Download className="size-4" />
            Download PDF
          </button>
        )}
        {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => (
          <button
            key={n}
            type="button"
            className={cn(
              "inline-flex h-10 min-h-10 items-center rounded-md px-3 text-sm font-medium text-tab",
              page === n && "is-on",
            )}
            onClick={() => setPage(n)}
          >
            Page {n}
          </button>
        ))}
      </div>
      {src ? (
        <SeoImage
          src={src}
          desc={`${MORNING_TITLE} page ${page}`}
          className="mt-4 w-full rounded-md border border-rule bg-black"
        />
      ) : null}
      {inline ? (
        <iframe
          title={`${MORNING_TITLE} ${selected?.id ?? ""}`}
          src={`${inline}#toolbar=1&navpanes=0&page=${page}`}
          className="mt-3 h-[70vh] w-full rounded-md border border-rule bg-black"
        />
      ) : null}

      <div className="mt-5 border-t border-rule pt-4">
        <p className="text-xs font-medium tracking-[0.08em] text-muted uppercase">Report library · 14 days</p>
        <p className="mt-1 text-sm text-muted">
          {Math.min(reports.length, MORNING_KEEP)} of {MORNING_KEEP} kept · {Math.min(reports.length, MORNING_VISIBLE)} shown
          {rest.length ? ` · ${rest.length} more on expand` : ""}
        </p>
        {recent.length ? (
          recent.map((r, i) => (
            <LibraryRow
              key={r.id}
              report={r}
              on={active === r.id || (active === "live" && i === 0)}
              download
              onOpen={() => {
                setActive(r.id);
                setPage(1);
              }}
            />
          ))
        ) : (
          <p className="mt-2 text-sm text-muted">Today’s report is the live view above. Archive fills at 08:00 ET.</p>
        )}
        {rest.length ? (
          <button
            type="button"
            className="mt-3 text-sm text-tab hover:underline"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
          >
            {open ? "Collapse to 3 days" : `Expand ${rest.length} more · up to ${MORNING_KEEP} days`}
          </button>
        ) : null}
        {open
          ? rest.map((r) => (
              <LibraryRow
                key={r.id}
                report={r}
                on={active === r.id}
                download={false}
                onOpen={() => {
                  setActive(r.id);
                  setPage(1);
                }}
              />
            ))
          : null}
      </div>
    </Panel>
    <GmMorningSection />
    <div className="mt-4">
      <GoLivePanel />
    </div>
    <AgentMorningSection />
    <ForumMorningSection />
    <SecurityMorningSection />
    <FeedsMorningSection />
    </>
  );
}

function LibraryRow({
  report,
  on,
  download,
  onOpen,
}: {
  report: Report;
  on: boolean;
  download: boolean;
  onOpen: () => void;
}) {
  const inline = morningInlineHref(report.id);
  return (
    <div
      className={cn(
        "mt-2 flex w-full flex-wrap items-center justify-between gap-3 rounded-md border border-rule px-3 py-2",
        on && "border-tab",
      )}
    >
      <button type="button" onClick={onOpen} className="min-w-0 flex-1 text-left">
        <span className="block font-mono text-sm text-fg">{report.id}</span>
        <span className="block text-xs text-muted">
          {report.title} · {report.pages} pg
          {download ? " · PDF" : ""}
        </span>
      </button>
      <span className="flex flex-wrap items-center gap-2">
        <a
          href={`${inline}#toolbar=1`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-9 items-center gap-1 rounded-md border border-rule px-2 font-mono text-[11px] text-tab"
        >
          <ExternalLink className="size-3.5" />
          Browser
        </a>
        {download ? (
          <a
            href={`${inline}?dl=1`}
            download={morningPdfName(report.id)}
            className="inline-flex h-9 items-center gap-1 rounded-md border border-rule px-2 font-mono text-[11px] text-tab"
          >
            <Download className="size-3.5" />
            PDF
          </a>
        ) : null}
      </span>
    </div>
  );
}

function GmMorningSection() {
  const pilot = useGm((s) => s.pilot);
  const view = useGm((s) => s.view);
  const risk = useGm((s) => s.risk);
  const liveUnlocked = useGm((s) => s.liveUnlocked);
  const error = useGm((s) => s.error);
  const [rows, setRows] = useState<DeskError[]>([]);
  useEffect(() => {
    void fetchDeskErrors().then((list) => {
      if (Array.isArray(list)) setRows(list.filter((r) => /gm/i.test(r.source) || /^gm:/i.test(r.msg)));
    });
  }, []);
  return (
    <Panel className="mt-4" kicker="GM" title={`${GM_NAME} morning`}>
      <p className="font-mono text-xs text-muted">
        {pilot} · {view}
        {liveUnlocked ? " · Live unlocked" : " · tape"} · risk {risk} ({risk * 20}%)
      </p>
      <p className="mt-2 font-mono text-sm uppercase text-high">
        AUTO live tape
      </p>
      <p className="mt-2 text-sm text-muted">
        GM AUTO reads the live Coinbase tape with Bot 7. Coinbase orders stay off until Live is unlocked.
      </p>
      {error ? <p className="mt-2 font-mono text-xs text-down">{error}</p> : null}
      {rows.length ? (
        <ul className="mt-3 space-y-1.5">
          {rows.slice(0, 8).map((r) => (
            <li key={r.id} className="font-mono text-xs">
              <span className={r.resolved ? "text-muted" : "text-sell"}>{r.resolved ? "green" : "error"}</span>
              {" · "}
              {r.msg}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-xs text-muted">No GM-tagged cycle errors in the last 100.</p>
      )}
    </Panel>
  );
}

function AgentMorningSection() {
  const [brief, setBrief] = useState<ReturnType<typeof morningAgent> | null>(null);
  useEffect(() => {
    void fetchAgentFlags().then((flags) => {
      setBrief(morningAgent(flags));
    });
  }, []);
  return (
    <Panel className="mt-4" kicker="AGENT" title="Call1ng All B0Ts">
      <p className="font-mono text-xs text-muted">Daily flags · America/New_York · proof of concept — not LIVE</p>
      {brief ? (
        <>
          <p className={brief.communication === "MAINTENANCE" ? "mt-2 font-mono text-sm text-medium" : brief.pings > 0 ? "mt-2 font-mono text-sm text-sell" : "mt-2 font-mono text-sm text-muted"}>
            {brief.headline}
          </p>
          <p className="mt-2 text-sm text-muted">{brief.note}</p>
          <p className="mt-2 font-mono text-xs text-muted">
            {brief.dayEt} · pings {brief.pings} · rejects {brief.rejects} · flags {brief.flags.join(", ")} · gate {brief.communication} · invite {brief.invite}
          </p>
        </>
      ) : (
        <p className="mt-2 text-sm text-muted">Loading agent flags…</p>
      )}
    </Panel>
  );
}

type ForumMorning = {
  digest: string;
  count: number;
  last24h: number;
  themes: string[];
  kinds: Record<string, number>;
  latest: { name: string; kind: string; at: string; excerpt: string }[];
  live: boolean;
  openRegistration: boolean;
  daily?: {
    dayEt: string;
    analyzedAt: string;
    postsAnalyzed: number;
    summary: string;
    suggestions: { title: string; detail: string; from: string; kind: string }[];
  };
};

function ForumMorningSection() {
  const [brief, setBrief] = useState<ForumMorning | null>(null);
  useEffect(() => {
    void fetch("/api/agent/forum", { headers: { accept: "application/json" } })
      .then((r) => r.json())
      .then((d: { morning?: ForumMorning }) => {
        if (d.morning) setBrief(d.morning);
      })
      .catch(() => setBrief(null));
  }, []);
  return (
    <Panel className="mt-4" kicker="W1S3 0WL$" title="W1S3 0WL$ Forum · daily discussion">
      <p className="font-mono text-xs text-up">Once per day · America/New_York · auto trade LOCKED</p>
      {brief ? (
        <>
          <p className="mt-2 text-sm leading-relaxed text-fg">{brief.daily?.summary ?? brief.digest}</p>
          <p className="mt-2 font-mono text-xs text-muted">
            {brief.daily ? `${brief.daily.dayEt} ET · ${brief.daily.postsAnalyzed} posts analyzed` : `${brief.count} posts · ${brief.last24h} / 24h`}
            {brief.themes?.length ? ` · ${brief.themes.join(" · ")}` : ""}
          </p>
          {brief.daily?.suggestions?.length ? (
            <ul className="mt-3 space-y-2">
              {brief.daily.suggestions.map((s) => (
                <li key={`${s.from}-${s.title}`}>
                  <p className="forum-suggest-title text-sm">{s.title}</p>
                  <p className="mt-0.5 text-sm leading-relaxed text-muted">
                    {s.kind} · {s.from} — {s.detail}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-sm text-muted">No mandate-improvement suggestions in this day’s window.</p>
          )}
        </>
      ) : (
        <p className="mt-2 text-sm text-muted">Loading daily W1S3 0WL$ analysis…</p>
      )}
    </Panel>
  );
}

function SecurityMorningSection() {
  const token = useOperator((s) => s.token);
  const [brief, setBrief] = useState<ReturnType<typeof morningSecurity> | null>(null);
  useEffect(() => {
    if (!token) {
      setBrief(morningSecurity());
      return;
    }
    void fetchSecurityBrief({ data: { token } }).then((res) => {
      if (res.ok && res.brief) setBrief(res.brief);
      else setBrief(morningSecurity());
    });
  }, [token]);
  if (!brief) {
    return (
      <Panel className="mt-4" kicker="Security" title="Security analysis">
        <p className="mt-2 text-sm text-muted">Loading hunter…</p>
      </Panel>
    );
  }
  return (
    <Panel className="mt-4" kicker="Security" title="Security analysis">
      <p className="font-mono text-xs text-muted">{ANALYSIS_AS_OF}</p>
      <p className={cn("mt-2 font-mono text-sm", brief.hunter.open || brief.fail.length ? "text-sell" : "text-high")}>
        {brief.headline}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-muted">{brief.effectiveness}</p>
      <p className="mt-2 font-mono text-xs text-muted">
        hunter {brief.hunter.pass} PASS / {brief.hunter.open} OPEN / {brief.hunter.operator} OPERATOR
        {" · "}
        {brief.intrusions.last24h} blocks / 24h
        {brief.kinds ? ` · ${brief.kinds}` : ""}
      </p>
      {brief.needHelp.length ? (
        <p className="mt-2 text-sm text-sell">Need your call: {brief.needHelp.map((v) => v.title).join(" · ")}</p>
      ) : (
        <p className="mt-2 text-sm text-high">No OPERATOR vulns waiting on a decision — sessionStorage cookie move still listed on Audit.</p>
      )}
      {brief.patchQueue.length ? (
        <ul className="mt-3 space-y-1.5">
          {brief.patchQueue.map((p) => (
            <li key={p} className="font-mono text-xs text-muted">
              improve · {p}
            </li>
          ))}
        </ul>
      ) : null}
      <p className="mt-3 text-xs text-muted">Full log: Admin → Security (Firewall, Intrusions, Audit, Hunter, Automations).</p>
    </Panel>
  );
}

function FeedsMorningSection() {
  const { snap } = useDeskTape();
  const brief = morningFeeds(snap);
  return (
    <Panel className="mt-4" kicker="Feeds" title="Pull speed · source list">
      <p className="font-mono text-xs text-muted">
        core {brief.cycle.coreMs}ms · client race {brief.cycle.clientRaceMs}ms · inflight {brief.cycle.inflight}
      </p>
      <p className={cn("mt-2 font-mono text-sm", brief.hung ? "text-sell" : "text-high")}>
        last pull {brief.pullMs != null ? `${brief.pullMs} ms` : "—"}
        {brief.ageMs != null ? ` · age ${Math.round(brief.ageMs / 1000)}s` : ""}
        {brief.hung ? " · HUNG / slow" : ""}
      </p>
      {brief.errors.length ? (
        <ul className="mt-2 space-y-1">
          {brief.errors.map((e) => (
            <li key={e} className="font-mono text-xs text-sell">
              {e}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-sm text-muted">No snap.errors this pull.</p>
      )}
      <ul className="mt-3 grid gap-1.5 sm:grid-cols-2">
        {brief.rows.map((r) => (
          <li key={r.id} className="font-mono text-[11px]">
            <span className={r.ok ? "text-high" : "text-sell"}>{r.ok ? "ok" : "fail"}</span>
            {" · "}
            {r.name}
            <span className="block text-muted">{r.role}</span>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs leading-relaxed text-muted">
        2026 free stack still fit: Coinbase public last (no key), mempool.space / blockchain.info (on-chain),
        Alternative.me F&G, FRED, SoSoValue ETF, DeFiLlama stables, OKX/Bybit/HL public. CoinGlass and
        CoinMarketCap stay out (paid keys). SuperGrok is operator Ask Grok; visitors use BYO compute.
      </p>
    </Panel>
  );
}
