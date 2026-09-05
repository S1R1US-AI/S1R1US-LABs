import { Link } from "@tanstack/react-router";
import { Panel, Shell } from "@/components/shell";
import { SeoCopy } from "@/components/seo-copy";
import { SupportDonate } from "@/components/support-donate";
import { FAQ_ITEMS } from "@/lib/desk/public-nav";
import { APP_NAME, LABS_NAME, PAGE_DESC_FAQ, PAGE_TITLE_FAQ, SEO_CANONICAL, TAB_DESK, TAB_FEED, TAB_GM, TAB_LAB } from "@/lib/brand";

export function FaqPage() {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
    url: `${SEO_CANONICAL.replace(/\/$/, "")}/faq`,
    name: PAGE_TITLE_FAQ,
    description: PAGE_DESC_FAQ,
  };

  return (
    <Shell>
      <SeoCopy />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <p className="font-mono text-xs tracking-[0.12em] text-oss uppercase">FAQ</p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-medium">{APP_NAME}</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          {TAB_DESK} (S1R1US 7-bot hedge fund) · {TAB_GM} (Godzilla mode) · {TAB_LAB} (S1R1US Lab
          Strategies) · OP3N S0URC3 (open source). AI Bitcoin trading bot · AI stock trading bot · AI
          Hedge Fund. Education only.
        </p>
        <div className="mt-6 space-y-3">
          {FAQ_ITEMS.map((item) => (
            <Panel key={item.q} kicker="FAQ" title={item.q} kickerClass="text-oss" titleClass="text-fg text-base">
              <p className="text-sm leading-relaxed text-muted">{item.a}</p>
            </Panel>
          ))}
        </div>
        <SupportDonate />
        <p className="mt-3 font-mono text-xs text-oss">
          Same wallets as the{" "}
          <Link to="/f33d" hash="donate" className="hover:underline">
            {TAB_FEED}
          </Link>{" "}
          tab.
        </p>
        <p className="mt-6 font-mono text-xs text-oss">
          <Link to="/sitemap" className="hover:underline">
            Sitemap
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
