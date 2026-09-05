import { useState } from "react";
import { Panel } from "@/components/shell";
import { GITHUB_README_MD } from "@/lib/launch/readme";
import { GITHUB_URL } from "@/lib/launch/model";
import { cn } from "@/lib/utils";

function inlineBits(s: string) {
  const parts = s.split(/(`[^`]+`)/g);
  return parts.map((p, i) =>
    p.startsWith("`") && p.endsWith("`") && p.length >= 2 ? (
      <code key={i} className="rounded bg-fg/8 px-1 font-mono text-[0.9em]">
        {p.slice(1, -1)}
      </code>
    ) : (
      <span key={i}>{p}</span>
    ),
  );
}

function ReadmePreview({ md }: { md: string }) {
  const blocks = md.replace(/\r\n/g, "\n").trim().split(/\n{2,}/);
  return (
    <div className="space-y-3 text-sm leading-relaxed text-fg">
      {blocks.map((raw, i) => {
        const t = raw.trim();
        if (t.startsWith("# ")) {
          return (
            <h2 key={i} className="text-xl font-bold tracking-tight text-medium">
              {t.slice(2)}
            </h2>
          );
        }
        if (t.startsWith("## ")) {
          return (
            <h3 key={i} className="text-base font-semibold text-medium">
              {t.slice(3)}
            </h3>
          );
        }
        if (/^\d+\.\s/.test(t) || t.startsWith("- ")) {
          const items = t.split("\n").filter(Boolean);
          const ol = /^\d+\.\s/.test(t);
          const Tag = ol ? "ol" : "ul";
          return (
            <Tag key={i} className={cn("space-y-1 pl-5", ol ? "list-decimal" : "list-disc")}>
              {items.map((line) => (
                <li key={line}>{inlineBits(line.replace(/^\d+\.\s|^-\s/, ""))}</li>
              ))}
            </Tag>
          );
        }
        if (t.split("\n").every((l) => l.startsWith("    "))) {
          return (
            <pre key={i} className="overflow-x-auto rounded-md border border-rule bg-fg/4 p-3 font-mono text-xs">
              {t
                .split("\n")
                .map((l) => l.replace(/^    /, ""))
                .join("\n")}
            </pre>
          );
        }
        return (
          <p key={i} className="text-fg/90">
            {t.split("\n").map((line, n) => (
              <span key={n}>
                {n ? <br /> : null}
                {inlineBits(line)}
              </span>
            ))}
          </p>
        );
      })}
    </div>
  );
}

export function GithubReadmeSplit() {
  const [copied, setCopied] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(GITHUB_README_MD);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }
  return (
    <Panel
      className="mt-4"
      kicker="GitHub · both panels"
      title="README.md for main"
      kickerClass="text-high"
      titleClass="text-medium"
    >
      <p className="text-sm text-muted">
        Left is what you paste into GitHub. Right is the Preview GitHub should show. Copy left →{" "}
        <a href={`${GITHUB_URL}/new/main?filename=README.md`} className="text-high hover:underline" target="_blank" rel="noreferrer">
          new README on main
        </a>
        . Click Preview there to confirm they match.
      </p>
      <div className="mt-3">
        <button
          type="button"
          onClick={() => void copy()}
          className="inline-flex h-10 min-h-10 items-center rounded-md bg-accent px-3 text-sm font-medium text-accent-fg"
        >
          {copied ? "Copied" : "Copy left panel"}
        </button>
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div className="min-w-0 rounded-md border border-rule">
          <p className="border-b border-rule px-3 py-2 font-mono text-[11px] tracking-[0.08em] text-muted uppercase">
            Edit · paste this
          </p>
          <textarea
            readOnly
            value={GITHUB_README_MD}
            spellCheck={false}
            className="h-[28rem] w-full resize-y bg-transparent p-3 font-mono text-xs leading-relaxed text-fg outline-none"
            onFocus={(e) => e.currentTarget.select()}
          />
        </div>
        <div className="min-w-0 rounded-md border border-rule">
          <p className="border-b border-rule px-3 py-2 font-mono text-[11px] tracking-[0.08em] text-muted uppercase">
            Preview · rendered
          </p>
          <div className="h-[28rem] overflow-y-auto p-3">
            <ReadmePreview md={GITHUB_README_MD} />
          </div>
        </div>
      </div>
    </Panel>
  );
}
