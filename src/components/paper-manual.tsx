import { Download } from "lucide-react";
import { OssPdfViewers, downloadOssPdf } from "@/components/pdf-viewers";
import { APP_NAME, TAB_DESK, TAB_LAB } from "@/lib/brand";
import { GithubReadmeSplit } from "@/components/github-readme-split";
import { GUIDE, GUIDE_MARKDOWN, GUIDE_META } from "@/lib/desk/guide";
import { THESIS, THESIS_MARKDOWN, THESIS_META } from "@/lib/desk/thesis";

function downloadMarkdown(body: string, name: string) {
  const blob = new Blob([body], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}

export function PaperToolbar() {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => downloadMarkdown(THESIS_MARKDOWN, "S1R1US-research-paper.md")}
        className="inline-flex h-10 min-h-10 items-center gap-2 rounded-md border border-rule bg-surface px-3 text-sm"
      >
        <Download className="size-4" />
        Thesis Markdown
      </button>
      <button
        type="button"
        onClick={() => downloadMarkdown(GUIDE_MARKDOWN, "S1R1US-seven-bot-plan.md")}
        className="inline-flex h-10 min-h-10 items-center gap-2 rounded-md border border-rule bg-surface px-3 text-sm"
      >
        <Download className="size-4" />
        Manual Markdown
      </button>
      <button
        type="button"
        onClick={downloadOssPdf}
        className="inline-flex h-10 min-h-10 items-center gap-2 rounded-md bg-accent px-3 text-sm font-medium text-accent-fg"
      >
        <Download className="size-4" />
        Download PDF
      </button>
    </div>
  );
}

export function PaperManual() {
  return (
    <div className="mx-auto max-w-3xl">
      <p className="text-xs font-medium tracking-[0.08em] text-muted uppercase">System Admin only · not on iOS/Google copy-admin</p>
      <p className="mt-3 font-serif text-[11px] tracking-[0.18em] text-muted uppercase">{THESIS_META.venue}</p>
      <h2 className="mt-2 font-serif text-2xl font-semibold tracking-tight text-fg sm:text-3xl">{THESIS_META.title}</h2>
      <p className="mt-3 font-serif text-base italic leading-relaxed text-muted">{THESIS_META.subtitle}</p>
      <p className="mt-4 font-serif text-sm text-fg">
        {THESIS_META.authors}
        <br />
        {THESIS_META.affiliation}
      </p>
      <p className="mt-2 font-mono text-xs text-muted">
        {THESIS_META.date} · {THESIS_META.version} · {APP_NAME}
      </p>
      <p className="mt-3 font-serif text-xs text-muted">Keywords: {THESIS_META.keywords.join(" · ")}</p>
      <p className="mt-4 border-y border-rule py-3 font-serif text-sm leading-relaxed text-muted">
        Not investment advice. Not legal advice. Bitcoin is volatile. You authorize every live Coinbase order.
        This research paper is not shown on {TAB_DESK}, {TAB_LAB}, or the iOS/Google copy-admin plane.
      </p>
      <div className="mt-4">
        <PaperToolbar />
      </div>
      {THESIS.map((section) => (
        <section key={section.id} id={section.id} className="mt-10">
          <h3 className="font-serif text-xl font-semibold text-fg">{section.title}</h3>
          {section.body.map((p) => (
            <p key={p.slice(0, 80)} className="mt-3 font-serif text-[16px] leading-7 text-fg/90">
              {p}
            </p>
          ))}
        </section>
      ))}
      <details className="mt-12 rounded-md border border-rule px-4 py-3">
        <summary className="cursor-pointer font-mono text-xs uppercase tracking-[0.12em] text-muted">
          Appendix · operating manual {GUIDE_META.version} · {GUIDE_META.date}
        </summary>
        <p className="mt-3 text-sm text-muted">{GUIDE_META.subtitle}</p>
        <GithubReadmeSplit />
        <OssPdfViewers />
        {GUIDE.map((section) => (
          <section key={section.id} id={section.id} className="mt-8">
            <h3 className="text-lg font-semibold text-medium">{section.title}</h3>
            {section.body.map((p) => (
              <p key={p.slice(0, 72)} className="mt-3 text-[15px] leading-relaxed text-fg/90">
                {p}
              </p>
            ))}
          </section>
        ))}
      </details>
    </div>
  );
}
