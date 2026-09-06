import { Download } from "lucide-react";
import { OssPdfViewers, downloadOssPdf } from "@/components/pdf-viewers";
import { APP_NAME, TAB_DESK, TAB_LAB } from "@/lib/brand";
import { GithubReadmeSplit } from "@/components/github-readme-split";
import { GUIDE, GUIDE_MARKDOWN, GUIDE_META } from "@/lib/desk/guide";

function downloadMarkdown() {
  const blob = new Blob([GUIDE_MARKDOWN], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "S1R1US-seven-bot-plan.md";
  a.click();
  URL.revokeObjectURL(url);
}

export function PaperToolbar() {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={downloadMarkdown}
        className="inline-flex h-10 min-h-10 items-center gap-2 rounded-md border border-rule bg-surface px-3 text-sm"
      >
        <Download className="size-4" />
        Markdown
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
      <p className="text-xs font-medium tracking-[0.08em] text-muted uppercase">Admin only</p>
      <h2 className="mt-1 text-2xl font-bold tracking-tight text-medium">{APP_NAME}</h2>
      <p className="mt-2 text-sm text-muted">
        {GUIDE_META.subtitle} · {GUIDE_META.date} · {GUIDE_META.version}
      </p>
      <p className="mt-4 border-y border-rule py-3 text-sm text-muted">
        Not investment advice. Bitcoin is volatile. You authorize every live Coinbase order.
        SuperGrok is the operator Ask Grok path; visitors bring their own compute. This manual is not shown on {TAB_DESK} or {TAB_LAB}.
      </p>
      <div className="mt-4">
        <PaperToolbar />
      </div>
      <GithubReadmeSplit />
      <OssPdfViewers />
      {GUIDE.map((section) => (
        <section key={section.id} id={section.id} className="mt-10">
          <h3 className="text-xl font-semibold text-medium">{section.title}</h3>
          {section.body.map((p) => (
            <p key={p.slice(0, 72)} className="mt-3 text-[15px] leading-relaxed text-fg/90">
              {p}
            </p>
          ))}
        </section>
      ))}
    </div>
  );
}
