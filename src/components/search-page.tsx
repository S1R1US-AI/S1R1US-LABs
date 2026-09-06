"use client";

import { useMemo } from "react";
import { useSearch } from "@tanstack/react-router";
import { Panel, Shell } from "@/components/shell";
import { SeoCopy } from "@/components/seo-copy";
import { PUBLIC_PAGES } from "@/lib/desk/public-nav";
import { OFFICIAL_PROPERTIES } from "@/lib/desk/official-presence";
import { PAGE_DESC_SEARCH, PAGE_TITLE_SEARCH } from "@/lib/brand";

export function SearchPage() {
  const q = String((useSearch({ strict: false }) as { q?: string }).q ?? "").trim();
  const needle = q.toLowerCase();
  const hits = useMemo(() => {
    const pages = PUBLIC_PAGES.filter((p) => {
      if (!needle) return true;
      const hay = `${p.label} ${p.title} ${p.hint} ${p.path}`.toLowerCase();
      return hay.includes(needle);
    });
    const props = OFFICIAL_PROPERTIES.filter((p) => {
      if (!needle) return p.live;
      return `${p.name} ${p.label} ${p.url} ${p.hint}`.toLowerCase().includes(needle);
    });
    return { pages, props };
  }, [needle]);

  return (
    <Shell>
      <SeoCopy />
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <p className="font-mono text-xs tracking-[0.12em] text-oss uppercase">Search</p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-medium">{PAGE_TITLE_SEARCH}</h1>
        <p className="mt-2 text-sm text-muted">{PAGE_DESC_SEARCH}</p>
        <form method="get" action="/search" className="mt-5 flex gap-2">
          <input
            name="q"
            defaultValue={q}
            placeholder="Search public pages"
            className="h-10 min-w-0 flex-1 rounded-md border border-rule bg-surface px-3 text-sm text-fg"
            aria-label="Search s1r1us.ai"
          />
          <button type="submit" className="h-10 rounded-md border border-rule px-3 text-sm text-fg hover:bg-fg/6">
            Search
          </button>
        </form>
        <Panel kicker="Pages" title={q ? `Results for “${q}”` : "Public index"} className="mt-6" kickerClass="text-oss">
          <ul className="space-y-3">
            {hits.pages.map((p) => (
              <li key={p.path}>
                <a href={p.path} className="font-medium text-fg hover:underline">
                  {p.label}
                </a>
                <span className="mt-0.5 block text-xs text-muted">{p.hint}</span>
              </li>
            ))}
          </ul>
          {hits.pages.length === 0 ? <p className="text-sm text-muted">No public pages matched.</p> : null}
        </Panel>
        <Panel kicker="Desks" title="Official properties" className="mt-4" kickerClass="text-oss">
          <ul className="space-y-3">
            {hits.props.map((p) => (
              <li key={p.url}>
                <a href={p.url} className="font-medium text-oss hover:underline" target={p.kind === "site" ? undefined : "_blank"} rel="noreferrer">
                  {p.name} · {p.label} {p.live ? "" : "(reserved)"}
                </a>
                <span className="mt-0.5 block text-xs text-muted">{p.hint}</span>
              </li>
            ))}
          </ul>
        </Panel>
      </main>
    </Shell>
  );
}
