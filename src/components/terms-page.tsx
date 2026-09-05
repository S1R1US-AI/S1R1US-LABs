import { Link } from "@tanstack/react-router";
import { Panel, Shell } from "@/components/shell";
import { SeoCopy } from "@/components/seo-copy";
import { APP_NAME, TAB_DESK } from "@/lib/brand";
import { LEGAL_HOWEY, LEGAL_NFA, TERMS_SECTIONS, TERMS_TITLE, TERMS_UPDATED } from "@/lib/legal";

export function TermsPage() {
  return (
    <Shell>
      <SeoCopy />
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <p className="font-mono text-xs tracking-[0.12em] text-oss uppercase">{TERMS_TITLE}</p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-medium">{APP_NAME}</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">Updated {TERMS_UPDATED}. Using this website is agreement to these Terms.</p>
        <Panel className="mt-6" kicker="Disclaimer" title="Read this first" kickerClass="text-oss">
          <p className="text-sm leading-relaxed text-muted">{LEGAL_NFA}</p>
          <p className="mt-3 text-sm leading-relaxed text-muted">{LEGAL_HOWEY}</p>
        </Panel>
        <div className="mt-4 space-y-3">
          {TERMS_SECTIONS.map((s) => (
            <Panel key={s.id} id={s.id} kicker="Terms" title={s.title} kickerClass="text-oss" titleClass="text-fg text-base">
              <p className="text-sm leading-relaxed text-muted">{s.body}</p>
            </Panel>
          ))}
        </div>
        <p className="mt-6 font-mono text-xs text-oss">
          <Link to="/faq" className="hover:underline">
            FAQ
          </Link>
          <span className="px-2">|</span>
          <Link to="/" className="hover:underline">
            {TAB_DESK}
          </Link>
        </p>
      </main>
    </Shell>
  );
}
