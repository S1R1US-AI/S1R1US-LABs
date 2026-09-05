import {
  APP_NAME,
  LABS_NAME,
  SEO_ALIASES,
  SEO_CANONICAL,
  SEO_DESCRIPTION,
  SEO_TAB_DESK,
  SEO_TAB_FEED,
  SEO_TAB_GM,
  SEO_TAB_LAB,
  TAB_DESK,
  TAB_FEED,
  TAB_GM,
  TAB_LAB,
} from "@/lib/brand";
import { COMPANY_X_URL } from "@/lib/desk/x-admin";

export function SeoCopy() {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: LABS_NAME,
        alternateName: [APP_NAME, "S1R1US Labs", "S1R1US Bot Hedge Fund", TAB_DESK, SEO_TAB_DESK],
        url: SEO_CANONICAL,
        description: SEO_DESCRIPTION,
        sameAs: [COMPANY_X_URL, "https://github.com/S1R1US-AI/S1R1US-LABs"].filter(Boolean),
      },
      {
        "@type": "WebSite",
        name: LABS_NAME,
        alternateName: [APP_NAME, "AI Bitcoin trading bot", "AI Hedge Fund", TAB_DESK, TAB_GM, TAB_LAB],
        url: SEO_CANONICAL,
        description: SEO_DESCRIPTION,
        potentialAction: {
          "@type": "SearchAction",
          target: `${SEO_CANONICAL}?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "SoftwareApplication",
        name: TAB_DESK,
        alternateName: [SEO_TAB_DESK, APP_NAME, LABS_NAME, "S1R1US Bot Hedge Fund", "AI Bitcoin trading bot", "AI stock trading bot", "AI Hedge Fund"],
        applicationCategory: "FinanceApplication",
        operatingSystem: "Web",
        description: SEO_DESCRIPTION,
        url: SEO_CANONICAL,
      },
      {
        "@type": "SoftwareApplication",
        name: TAB_GM,
        alternateName: [SEO_TAB_GM, "Godzilla Mode", "Godzilla mode"],
        applicationCategory: "FinanceApplication",
        operatingSystem: "Web",
        description: `${TAB_GM} is Godzilla mode, the aggressive AI bitcoin sleeve of S1R1US Labs.`,
        url: `${SEO_CANONICAL}gm`,
      },
      {
        "@type": "WebPage",
        name: TAB_FEED,
        alternateName: [SEO_TAB_FEED, "F33D N0W"],
        description: `${TAB_FEED} is ${SEO_TAB_FEED}. Optional donations for hosting, domain, and open-source apps.`,
        url: `${SEO_CANONICAL}f33d`,
      },
      {
        "@type": "SoftwareApplication",
        name: TAB_LAB,
        alternateName: [SEO_TAB_LAB, "S1R1US Lab Strategies"],
        applicationCategory: "FinanceApplication",
        operatingSystem: "Web",
        description: `${TAB_LAB} is S1R1US Lab Strategies, the what-if overlay on the 7-bot tape.`,
        url: `${SEO_CANONICAL}helios`,
      },
      {
        "@type": "SoftwareSourceCode",
        name: "OP3N S0URC3",
        alternateName: ["open source", "H3LP 7-B0T H3DGE FUND [ S1R1U$ <<L@B$>> ] G0 >> OP3N S0URC3", "HELP 7-BOT HEDGE FUND GO OPEN SOURCE"],
        codeRepository: "https://github.com/S1R1US-AI/S1R1US-LABs",
        description: "OP3N S0URC3 is open source. GitHub repository started 2026-09-04: S1R1US-AI/S1R1US-LABs.",
        url: "https://github.com/S1R1US-AI/S1R1US-LABs",
      },
      {
        "@type": "FAQPage",
        name: `FAQ · ${TAB_DESK} · ${TAB_GM} · ${TAB_FEED} · ${TAB_LAB}`,
        url: `${SEO_CANONICAL}faq`,
        description: "FAQ for S1R1US 7-bot hedge fund, Godzilla mode, S1R1US Lab Strategies, Token launch, open source. Not financial advice. Not an offer of securities.",
      },
      {
        "@type": "WebPage",
        name: "Terms and Agreements",
        url: `${SEO_CANONICAL}terms`,
        description: "Using this website constitutes agreement. Not financial advice. Seek a licensed professional. Not an offer of securities.",
      },
      {
        "@type": "WebPage",
        name: "Sitemap",
        url: `${SEO_CANONICAL}sitemap`,
      },
    ],
  };
  return (
    <>
      <p className="seo-copy">{SEO_ALIASES}</p>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />
    </>
  );
}
