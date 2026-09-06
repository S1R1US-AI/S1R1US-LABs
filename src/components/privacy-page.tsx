import { Link } from "@tanstack/react-router";
import { Panel, Shell } from "@/components/shell";
import { SeoCopy } from "@/components/seo-copy";
import { APP_NAME, TAB_DESK } from "@/lib/brand";
import { LEGAL_BOTS, PRIVACY_SECTIONS, PRIVACY_TITLE, PRIVACY_UPDATED, TERMS_PATH, TERMS_TITLE } from "@/lib/legal";

export function PrivacyPage() {
  return (
    <Shell>
      <SeoCopy />
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <p className="legal-purple font-mono text-xs tracking-[0.12em] uppercase">{PRIVACY_TITLE}</p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-medium">{APP_NAME}</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Updated {PRIVACY_UPDATED}. Bots may not retain system information. Reverse engineering without S1R1US.ai
          authorization violates these terms.
        </p>
        <Panel className="mt-6" kicker="Privacy" title="Bots and source" kickerClass="legal-purple" titleClass="legal-purple">
          <p className="text-sm leading-relaxed text-muted">{LEGAL_BOTS}</p>
        </Panel>
        <div className="mt-4 space-y-3">
          {PRIVACY_SECTIONS.map((s) => (
            <Panel key={s.id} id={s.id} kicker="Privacy" title={s.title} kickerClass="legal-purple" titleClass="text-fg text-base">
              <p className="text-sm leading-relaxed text-muted">{s.body}</p>
            </Panel>
          ))}
        </div>
        <p className="mt-6 font-mono text-xs text-oss">
          <Link to={TERMS_PATH} className="legal-purple hover:underline">
            {TERMS_TITLE}
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
