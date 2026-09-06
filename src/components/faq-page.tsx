import { useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { Panel, Shell } from "@/components/shell";
import { SeoCopy } from "@/components/seo-copy";
import { SupportDonate } from "@/components/support-donate";
import { FAQ_ITEMS } from "@/lib/desk/public-nav";
import { APP_NAME, BEARS_HEADLINE, BEARS_PATH, LABS_NAME, OWL_HEADLINE, OWL_PATH, PAGE_DESC_FAQ, PAGE_TITLE_FAQ, SEO_CANONICAL, SEO_TAB_OWL, TAB_BEARS, TAB_COFFEE, TAB_DESK, TAB_FEED, TAB_GM, TAB_HOVER_BEARS, TAB_HOVER_OWL, TAB_LAB, TAB_OWL, seoImgAlt } from "@/lib/brand";

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

  useEffect(() => {
    const id = window.location.hash.replace(/^#/, "");
    if (!id) return;
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <Shell>
      <SeoCopy />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <p className="faq-kicker font-mono text-xs tracking-[0.12em] uppercase">FAQ</p>
        <h1 className="faq-title mt-2 text-2xl font-bold tracking-tight">{APP_NAME}</h1>
        <p className="faq-text mt-3 text-sm leading-relaxed">
          {TAB_DESK} (S1R1US 7-bot hedge fund) · {TAB_GM} (Godzilla mode) · {TAB_BEARS} (Beat the Bears)
          · {TAB_OWL} (Wise Owl) · {TAB_FEED} (Feed Hosting)
          · {TAB_LAB} (S1R1US Lab Strategies) · {TAB_COFFEE} (Buy Me a Cup of Coffee) · Call1ng All B0Ts
          (Calling All Bots) · BYO C0MPUT3 (Bring your own compute) · OP3N S0URC3 (open source). AI Bitcoin trading bot · AI stock trading bot ·
          AI Hedge Fund. Education only.
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <Link
          to={BEARS_PATH}
          title={TAB_HOVER_BEARS}
          className="block overflow-hidden rounded-md border border-rule bg-surface hover:border-fg/30"
        >
          <img
            src="/gzilla-mrkt.png"
            alt={seoImgAlt("G0DZ1LLa M0D3 yellow outline breathing a blue laser through a bitcoin candle chart, bursting a cartoon bear — B3AT TH3 B3AR$ (Beat the Bears) at market speed with AI agents")}
            title={seoImgAlt(`${TAB_BEARS} (${BEARS_HEADLINE})`)}
            width={1280}
            height={720}
            className="h-40 w-full object-cover"
          />
          <div className="px-3 py-3">
            <p className="faq-kicker text-[10px] font-semibold tracking-[0.1em] uppercase">FAQ · {TAB_BEARS}</p>
            <p className="faq-title mt-1 text-base font-semibold">{BEARS_HEADLINE}</p>
            <p className="faq-text mt-1 text-sm">
              Theoretical loop: an AI agent reads Bot 7, sizes a clip, runs Coinbase on its own keys.
            </p>
          </div>
        </Link>
        <Link
          to={OWL_PATH}
          title={TAB_HOVER_OWL}
          className="block overflow-hidden rounded-md border border-rule bg-surface hover:border-fg/30"
        >
          <img
            src="/owl.png"
            alt={seoImgAlt("AI AG3NTS (AI AGENTS) jeweled owl — W1S3 0WL (Wise Owl) — wise investment decisions theoretically optimized by Grok, Claude, GPT and Bot 7")}
            title={seoImgAlt(`${TAB_OWL} (${SEO_TAB_OWL}) · ${OWL_HEADLINE}`)}
            width={1024}
            height={1024}
            className="h-40 w-full object-cover object-top"
          />
          <div className="px-3 py-3">
            <p className="faq-kicker text-[10px] font-semibold tracking-[0.1em] uppercase">FAQ · {TAB_OWL}</p>
            <p className="faq-title mt-1 text-base font-semibold">{OWL_HEADLINE}</p>
            <p className="faq-text mt-1 text-sm">
              Combine Bot 7 tape with Grok, Claude, and GPT for a current bitcoin accumulation read.
            </p>
          </div>
        </Link>
        </div>
        <div className="mt-6 space-y-3">
          {FAQ_ITEMS.map((item) => (
            <div key={item.q} id={item.id} className={item.id ? "scroll-mt-24" : undefined}>
              <Panel kicker="FAQ" title={item.q} kickerClass="faq-kicker" titleClass="faq-title text-base">
                <p className="faq-text text-sm leading-relaxed">{item.a}</p>
                {item.id === "beat-the-bears" ? (
                  <p className="mt-2 text-sm">
                    <Link to={BEARS_PATH} className="text-tab hover:underline" title={TAB_HOVER_BEARS}>
                      Open {TAB_BEARS} — {BEARS_HEADLINE}
                    </Link>
                  </p>
                ) : null}
                {item.id === "wise-owl" ? (
                  <p className="mt-2 text-sm">
                    <Link to={OWL_PATH} className="text-tab hover:underline" title={TAB_HOVER_OWL}>
                      Open {TAB_OWL} — {OWL_HEADLINE}
                    </Link>
                  </p>
                ) : null}
              </Panel>
            </div>
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
          <Link to="/terms" className="legal-purple hover:underline">
            Terms and Agreements
          </Link>
          <span className="px-2">|</span>
          <Link to="/privacy" className="legal-purple hover:underline">
            Privacy Policy
          </Link>
          <span className="px-2">|</span>
          <Link to="/sitemap" className="hover:underline">
            Sitemap
          </Link>
          <span className="px-2">|</span>
          <Link to={BEARS_PATH} className="hover:underline" title={TAB_HOVER_BEARS}>
            {TAB_BEARS}
          </Link>
          <span className="px-2">|</span>
          <Link to={OWL_PATH} className="hover:underline" title={TAB_HOVER_OWL}>
            {TAB_OWL}
          </Link>
          <span className="px-2">|</span>
          <Link to="/c0ff33" className="hover:underline">
            {TAB_COFFEE}
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
