import { useEffect, useMemo, useState } from "react";
import {
  Check,
  Copy,
  Download,
  FileText,
  Image as ImageIcon,
  Printer,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SeoImage } from "@/components/seo-image";
import {
  ABSTRACT,
  BOT_COSTS,
  INDEX_TERMS,
  INSTITUTIONAL_COSTS,
  PAGES,
  PAPER_SUBTITLE,
  PAPER_TITLE,
  RESEARCH_BOTS,
  RISK_RULES,
  SECTIONS,
  SOURCE,
  STATS,
  buildMarkdown,
  usd,
  type Block,
} from "@/lib/paper";
import { cn } from "@/lib/utils";

const TOC = [
  { id: "masthead", label: "Title" },
  { id: "abstract", label: "Abstract" },
  { id: "figures", label: "Key figures" },
  ...SECTIONS.map((s) => ({
    id: s.id,
    label: s.roman ? `${s.roman}. ${s.title}` : s.title,
  })),
  { id: "tables", label: "Cost tables" },
  { id: "scans", label: "Original pages" },
];

function downloadText(filename: string, text: string, mime: string) {
  const blob = new Blob([text], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function ReportApp({ embedded = false }: { embedded?: boolean }) {
  const markdown = useMemo(() => buildMarkdown(), []);
  const [copied, setCopied] = useState<"md" | "all" | null>(null);
  const [scan, setScan] = useState<number | null>(null);
  const [active, setActive] = useState("masthead");

  useEffect(() => {
    const ids = TOC.map((t) => t.id);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActive(visible.target.id);
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: [0, 0.25, 0.5] },
    );
    for (const id of ids) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  async function copy(kind: "md" | "all") {
    const text = kind === "md" ? markdown : markdown;
    await navigator.clipboard.writeText(text);
    setCopied(kind);
    window.setTimeout(() => setCopied(null), 1600);
  }

  return (
    <div className={embedded ? "bg-paper text-ink" : "min-h-dvh bg-paper text-ink"}>
      {embedded ? null : (
      <header className="no-print sticky top-0 z-30 border-b border-rule/80 bg-ink text-paper">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:px-6">
          <div className="min-w-0 flex-1">
            <p className="font-sans text-[11px] font-medium tracking-[0.22em] text-paper/70 uppercase">
              Field report
            </p>
            <p className="truncate font-serif text-sm text-paper/90 sm:text-base">
              Autonomous alpha desk · 3 pages transcribed
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-1.5">
            <Button
              variant="ghost"
              className="text-paper hover:bg-paper/10"
              onClick={() => copy("md")}
              aria-label="Copy document"
            >
              {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
              <span className="hidden sm:inline">{copied ? "Copied" : "Copy"}</span>
            </Button>
            <Button
              variant="ghost"
              className="text-paper hover:bg-paper/10"
              onClick={() =>
                downloadText("field-report.md", markdown, "text/markdown;charset=utf-8")
              }
              aria-label="Download markdown"
            >
              <Download className="size-4" />
              <span className="hidden sm:inline">Markdown</span>
            </Button>
            <a
              href={SOURCE.pdfPath}
              download="AI-Hedge-Fund-Paper.pdf"
              className="inline-flex h-10 min-h-10 items-center gap-2 rounded-sm px-3 font-sans text-sm font-medium text-paper hover:bg-paper/10"
            >
              <FileText className="size-4" />
              <span className="hidden md:inline">PDF</span>
            </a>
            <Button
              variant="ghost"
              className="text-paper hover:bg-paper/10"
              onClick={() => window.print()}
              aria-label="Print"
            >
              <Printer className="size-4" />
              <span className="hidden lg:inline">Print</span>
            </Button>
          </div>
        </div>
      </header>
      )}

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-0 lg:grid-cols-[220px_minmax(0,1fr)]">
        <nav
          className="no-print border-b border-rule px-4 py-3 lg:sticky lg:top-16 lg:h-[calc(100dvh-4rem)] lg:overflow-y-auto lg:border-r lg:border-b-0 lg:px-5 lg:py-8"
          aria-label="Contents"
        >
          <p className="mb-3 hidden font-sans text-[11px] font-medium tracking-[0.18em] text-muted uppercase lg:block">
            Contents
          </p>
          <div className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0">
            {TOC.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={cn(
                  "shrink-0 rounded-sm px-3 py-2 font-sans text-xs leading-snug lg:px-2",
                  active === item.id
                    ? "bg-accent text-accent-fg"
                    : "text-muted hover:bg-ink/6 hover:text-ink",
                )}
              >
                {item.label}
              </a>
            ))}
          </div>
        </nav>

        <main className="px-4 py-8 sm:px-8 sm:py-12 lg:px-12 lg:py-14">
          <article className="mx-auto max-w-3xl">
            <header id="masthead" className="scroll-mt-24">
              <p className="font-sans text-[11px] font-medium tracking-[0.22em] text-muted uppercase">
                Transcription · {SOURCE.posted}
              </p>
              <h1 className="mt-4 font-serif text-[1.85rem] leading-[1.18] font-medium tracking-[-0.02em] sm:text-[2.35rem]">
                {PAPER_TITLE}
              </h1>
              <p className="mt-4 font-serif text-lg text-muted italic sm:text-xl">
                {PAPER_SUBTITLE}
              </p>
              <dl className="mt-6 grid grid-cols-1 gap-x-8 gap-y-2 border-y border-rule py-4 font-sans text-sm sm:grid-cols-2">
                <div className="flex justify-between gap-3 sm:block">
                  <dt className="text-muted">Author</dt>
                  <dd className="font-medium">
                    {SOURCE.author}{" "}
                    <a
                      className="text-accent underline-offset-2 hover:underline"
                      href={SOURCE.tweetUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {SOURCE.handle}
                    </a>
                  </dd>
                </div>
                <div className="flex justify-between gap-3 sm:block">
                  <dt className="text-muted">Posted</dt>
                  <dd className="font-medium">{SOURCE.posted}</dd>
                </div>
                <div className="flex justify-between gap-3 sm:block">
                  <dt className="text-muted">Document</dt>
                  <dd className="font-medium">3-page production field report</dd>
                </div>
                <div className="flex justify-between gap-3 sm:block">
                  <dt className="text-muted">Image in the post</dt>
                  <dd className="font-medium">Page 1 of 3</dd>
                </div>
              </dl>
              <p className="mt-4 font-sans text-sm leading-relaxed text-muted">
                The tweet image is page one. The author’s follow-up linked the full
                three-page PDF; this document transcribes every page so you can keep the
                information without the scan.
              </p>
            </header>

            <section id="abstract" className="mt-10 scroll-mt-24">
              <h2 className="font-serif text-xl font-medium">Abstract</h2>
              <p className="mt-4 font-serif text-[1.05rem] leading-[1.7] first-letter:float-left first-letter:pr-2 first-letter:font-serif first-letter:text-5xl first-letter:leading-[0.85] first-letter:font-medium">
                {ABSTRACT}
              </p>
              <div className="mt-6">
                <h3 className="font-sans text-[11px] font-medium tracking-[0.18em] text-muted uppercase">
                  Index terms
                </h3>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {INDEX_TERMS.map((term) => (
                    <li
                      key={term}
                      className="rounded-sm border border-rule bg-paper-raised px-2.5 py-1 font-sans text-xs text-ink"
                    >
                      {term}
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            <section id="figures" className="mt-10 scroll-mt-24">
              <h2 className="font-serif text-xl font-medium">Key figures as printed</h2>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {STATS.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-lg border border-rule bg-paper-raised p-4"
                  >
                    <p className="font-sans text-[11px] tracking-[0.12em] text-muted uppercase">
                      {stat.label}
                    </p>
                    <p className="mt-2 font-serif text-2xl font-medium tabular-nums">
                      {stat.value}
                    </p>
                    <p className="mt-1 font-sans text-xs leading-snug text-muted">{stat.note}</p>
                  </div>
                ))}
              </div>
              <p className="mt-3 font-sans text-xs text-muted">
                Abstract cites ~$3,000 / year; the detailed table annualizes to $8,700. Both
                figures appear in the original.
              </p>
            </section>

            {SECTIONS.map((section) => (
              <section key={section.id} id={section.id} className="mt-12 scroll-mt-24">
                <h2 className="border-t border-ink/80 pt-6 font-serif text-xl font-medium tracking-[-0.01em] sm:text-2xl">
                  {section.roman ? (
                    <span className="block font-sans text-[11px] font-medium tracking-[0.2em] text-muted uppercase">
                      Section {section.roman}
                    </span>
                  ) : null}
                  <span className={section.roman ? "mt-2 block" : undefined}>{section.title}</span>
                </h2>
                {section.id === "architecture" ? <DeskRoster /> : null}
                {section.blocks.map((block, i) => (
                  <BlockView key={`${section.id}-${i}`} block={block} />
                ))}
                {section.id === "layers" ? <RiskStrip /> : null}
              </section>
            ))}

            <section id="tables" className="mt-12 scroll-mt-24">
              <h2 className="border-t border-ink/80 pt-6 font-serif text-xl font-medium sm:text-2xl">
                Cost tables
              </h2>
              <div className="mt-6 grid gap-8 md:grid-cols-2">
                <CostTable
                  title="Institutional annual stack"
                  rows={INSTITUTIONAL_COSTS.map((r) => ({
                    item: r.item,
                    value: usd(r.amount),
                  }))}
                  total={usd(INSTITUTIONAL_COSTS.reduce((s, r) => s + r.amount, 0))}
                  totalLabel="Before occupancy"
                />
                <CostTable
                  title="Eight-bot monthly stack"
                  rows={BOT_COSTS.map((r) => ({
                    item: r.item,
                    value: usd(r.monthly),
                  }))}
                  total={usd(BOT_COSTS.reduce((s, r) => s + r.monthly, 0) * 12)}
                  totalLabel="Annualized ($8,700)"
                />
              </div>
            </section>

            <section id="scans" className="mt-12 scroll-mt-24">
              <h2 className="border-t border-ink/80 pt-6 font-serif text-xl font-medium sm:text-2xl">
                Original pages
              </h2>
              <p className="mt-3 font-sans text-sm text-muted">
                Scans of the PDF. Page 1 is the image attached to the tweet.
              </p>
              <ul className="mt-5 grid gap-4 sm:grid-cols-3">
                {PAGES.map((page) => (
                  <li key={page.n}>
                    <button
                      type="button"
                      onClick={() => setScan(page.n)}
                      className="group w-full text-left"
                    >
                      <span className="block overflow-hidden rounded-md border border-rule bg-paper-raised shadow-[0_1px_0_rgba(22,20,18,0.04)]">
                        <SeoImage
                          src={page.thumb}
                          desc={`S1R1US Labs paper page ${page.n} — ${page.caption}`}
                          className="aspect-[3/4] w-full object-cover object-top transition-transform duration-[var(--motion-fast)] ease-[var(--ease-out)] group-hover:scale-[1.02]"
                        />
                      </span>
                      <span className="mt-2 flex items-center gap-2 font-sans text-sm">
                        <ImageIcon className="size-3.5 text-muted" />
                        Page {page.n}
                      </span>
                      <span className="mt-0.5 block font-sans text-xs text-muted">
                        {page.caption}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </section>

            <footer className="mt-16 border-t border-rule pt-6 font-sans text-xs leading-relaxed text-muted">
              <p>
                Transcribed from {SOURCE.handle}’s post on {SOURCE.posted}. Title wording
                (“Build a Your…”) is as printed. The three-page PDF’s table of contents
                names Sections IV–X in more detail than the printed body, which jumps from
                the research desk to a condensed cost analysis and conclusion.
              </p>
              <p className="mt-3">
                This is a reading copy of a public post, not investment advice, a
                solicitation, or a claim that the described system produces returns.
              </p>
            </footer>
          </article>
        </main>
      </div>

      {scan !== null ? (
        <div
          className="no-print fixed inset-0 z-50 flex items-center justify-center bg-ink/80 p-3 sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label={`Original page ${scan}`}
          onClick={() => setScan(null)}
        >
          <SeoImage
            src={PAGES[scan - 1]?.src}
            desc={`S1R1US Labs paper full scan of page ${scan}`}
            className="max-h-full max-w-full rounded-md object-contain shadow-2xl"
          />
        </div>
      ) : null}
    </div>
  );
}

function BlockView({ block }: { block: Block }) {
  if (block.type === "h3") {
    return (
      <h3 id={block.id} className="mt-8 scroll-mt-24 font-serif text-lg font-medium italic">
        {block.text}
      </h3>
    );
  }
  return (
    <p className="mt-4 font-serif text-[1.05rem] leading-[1.7]">{block.text}</p>
  );
}

function DeskRoster() {
  return (
    <div className="mt-6 mb-2 rounded-lg border border-rule bg-paper-raised p-4 sm:p-5">
      <p className="font-sans text-[11px] font-medium tracking-[0.16em] text-muted uppercase">
        Named research desk
      </p>
      <ul className="mt-3 divide-y divide-rule">
        {RESEARCH_BOTS.map((bot) => (
          <li key={bot.name} className="grid gap-1 py-3 sm:grid-cols-[160px_minmax(0,1fr)]">
            <p className="font-sans text-sm font-medium">{bot.name}</p>
            <p className="font-serif text-sm leading-relaxed text-muted">{bot.role}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

function RiskStrip() {
  return (
    <div className="mt-8 rounded-lg border border-rule bg-paper-raised p-4 sm:p-5">
      <p className="font-sans text-[11px] font-medium tracking-[0.16em] text-muted uppercase">
        Risk Bot hard rules
      </p>
      <ul className="mt-3 grid gap-3 sm:grid-cols-2">
        {RISK_RULES.map((rule) => (
          <li key={rule.trigger} className="border-l-2 border-brick pl-3">
            <p className="font-sans text-sm font-medium">{rule.trigger}</p>
            <p className="font-serif text-sm text-muted italic">{rule.action}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

function CostTable({
  title,
  rows,
  total,
  totalLabel,
}: {
  title: string;
  rows: { item: string; value: string }[];
  total: string;
  totalLabel: string;
}) {
  return (
    <div>
      <h3 className="font-serif text-lg font-medium">{title}</h3>
      <table className="mt-3 w-full border-collapse font-sans text-sm">
        <tbody>
          {rows.map((row) => (
            <tr key={row.item} className="border-b border-rule">
              <td className="py-2 pr-3 text-muted">{row.item}</td>
              <td className="py-2 text-right font-medium tabular-nums">{row.value}</td>
            </tr>
          ))}
          <tr>
            <td className="pt-3 font-medium">{totalLabel}</td>
            <td className="pt-3 text-right font-serif text-lg font-medium tabular-nums">
              {total}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
