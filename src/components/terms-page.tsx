import { Link } from "@tanstack/react-router";
import { Panel, Shell } from "@/components/shell";
import { SeoCopy } from "@/components/seo-copy";
import { APP_NAME, TAB_DESK } from "@/lib/brand";
import { LEGAL_BOTS, LEGAL_HOWEY, LEGAL_NFA, PRIVACY_PATH, PRIVACY_TITLE, TERMS_SECTIONS, TERMS_TITLE, TERMS_UPDATED } from "@/lib/legal";

export function TermsPage() {
  return (
    <Shell>
      <SeoCopy />
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <p className="legal-purple font-mono text-xs tracking-[0.12em] uppercase">{TERMS_TITLE}</p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-medium">{APP_NAME}</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">Updated {TERMS_UPDATED}. Using this website is agreement to these Terms.</p>
        <Panel className="mt-6" kicker="Disclaimer" title="Read this first" kickerClass="legal-purple">
          <p className="text-sm leading-relaxed text-muted">{LEGAL_NFA}</p>
          <p className="mt-3 text-sm leading-relaxed text-muted">{LEGAL_HOWEY}</p>
          <p className="mt-3 text-sm leading-relaxed text-muted">{LEGAL_BOTS}</p>
        </Panel>
        <div className="mt-4 space-y-3">
          {TERMS_SECTIONS.map((s) => (
            <Panel key={s.id} id={s.id} kicker="Terms" title={s.title} kickerClass="legal-purple" titleClass="text-fg text-base">
              <p className="text-sm leading-relaxed text-muted">{s.body}</p>
            </Panel>
          ))}
        </div>
        <p className="mt-6 font-mono text-xs text-oss">
          <Link to={PRIVACY_PATH} className="legal-purple hover:underline">
            {PRIVACY_TITLE}
          </Link>
          <span className="px-2">|</span>
          <Link to="/faq" className="faq-kicker hover:underline">
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
