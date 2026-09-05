import { Download } from "lucide-react";
import { Shell } from "@/components/shell";
import { GUIDE, GUIDE_MARKDOWN, GUIDE_META } from "@/lib/desk/guide";
import { APP_NAME } from "@/lib/brand";

function downloadMarkdown() {
  const blob = new Blob([GUIDE_MARKDOWN], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "S1R1US-seven-bot-plan.md";
  a.click();
  URL.revokeObjectURL(url);
}

export function GuidePage() {
  return (
    <Shell
      right={
        <div className="flex gap-2">
          <button
            type="button"
            onClick={downloadMarkdown}
            className="inline-flex h-10 min-h-10 items-center gap-2 rounded-sm border border-rule bg-surface px-3 text-sm"
          >
            <Download className="size-4" />
            Markdown
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex h-10 min-h-10 items-center gap-2 rounded-sm bg-accent px-3 text-sm font-medium text-accent-fg"
          >
            <Download className="size-4" />
            Print / PDF
          </button>
        </div>
      }
    >
      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <p className="font-mono text-[11px] tracking-[0.18em] text-muted uppercase">
          {GUIDE_META.date} · {GUIDE_META.version}
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-medium">{APP_NAME}</h1>
        <p className="mt-1 text-sm font-medium text-medium">Seven-Bot Bitcoin Accumulator</p>
        <p className="mt-3 text-muted">{GUIDE_META.subtitle}</p>
        <p className="mt-4 border-y border-rule py-3 text-sm text-muted">
          Not investment advice. You authorize every live Coinbase order. SuperGrok is the only
          paid dependency.
        </p>
        {GUIDE.map((section) => (
          <section key={section.id} id={section.id} className="mt-10">
            <h2 className="text-xl font-medium">{section.title}</h2>
            {section.body.map((p) => (
              <p key={p.slice(0, 48)} className="mt-3 text-[15px] leading-relaxed text-fg/90">
                {p}
              </p>
            ))}
          </section>
        ))}
      </main>
    </Shell>
  );
}
