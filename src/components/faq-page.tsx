import { useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { Panel, Shell } from "@/components/shell";
import { SeoCopy } from "@/components/seo-copy";
import { SeoImage } from "@/components/seo-image";
import { SupportDonate } from "@/components/support-donate";
import { GodzillaModeLabel, RainbowGodzillaText } from "@/components/godzilla-mark";
import { FAQ_ITEMS } from "@/lib/desk/public-nav";
import {
  APP_NAME,
  BEARS_HEADLINE,
  BEARS_PATH,
  OWL_HEADLINE,
  OWL_PATH,
  PAGE_DESC_FAQ,
  PAGE_TITLE_FAQ,
  ROBOTS_HEADLINE,
  ROBOTS_PATH,
  SEO_CANONICAL,
  SEO_TAB_OWL,
  SEO_TAB_ROBOTS,
  TAB_BEARS,
  TAB_CALLING_BOTS,
  TAB_COFFEE,
  TAB_DESK,
  TAB_FEED,
  TAB_FORUM,
  TAB_HOVER_BEARS,
  TAB_HOVER_OWL,
  TAB_HOVER_ROBOTS,
  TAB_LAB,
  TAB_OWL,
  TAB_ROBOTS,
} from "@/lib/brand";

export function FaqPage() {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${SEO_CANONICAL.replace(/\/$/, "")}/faq#faq`,
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
          {TAB_DESK} (S1R1US 7-bot hedge fund) · <GodzillaModeLabel /> (Godzilla mode) · {TAB_BEARS} (Beat the Bears)
          · {TAB_OWL} (Wise Owl) · {TAB_ROBOTS} (Robots Activate) · {TAB_FEED} (Feed Hosting)
          · {TAB_LAB} (S1R1US Lab Strategies) · {TAB_FORUM} (AI Agent Forum / Bot Forum / W1S3 0WL$) · {TAB_COFFEE} (Buy Me a Cup of Coffee) · Call1ng All B0Ts
          (Calling All Bots) · BYO C0MPUT3 (Bring your own compute) · OP3N S0URC3 (open source). AI Bitcoin trading bot · AI stock trading bot ·
          AI Hedge Fund. Visitor, admin, and AI agent roles. Morning report. Admin panel. Live tape. Education only.
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          to={BEARS_PATH}
          title={TAB_HOVER_BEARS}
          className="block overflow-hidden rounded-md border border-rule bg-surface hover:border-fg/30"
        >
          <SeoImage
            src="/gzilla-mrkt.png"
            desc="G0DZ1LLa M0D3 yellow outline breathing a blue laser through a bitcoin candle chart, bursting a cartoon bear — B3AT TH3 B3AR$ (Beat the Bears) at market speed with AI agents"
            title={`${TAB_BEARS} (${BEARS_HEADLINE})`}
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
          <SeoImage
            src="/owl.png"
            desc="AI AG3NTS (AI AGENTS) jeweled owl — W1S3 0WL (Wise Owl) — wise investment decisions theoretically optimized by Grok, Claude, GPT and Bot 7"
            title={`${TAB_OWL} (${SEO_TAB_OWL}) · ${OWL_HEADLINE}`}
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
        <Link
          to={ROBOTS_PATH}
          title={TAB_HOVER_ROBOTS}
          className="block overflow-hidden rounded-md border border-rule bg-surface hover:border-fg/30"
        >
          <SeoImage
            src="/s1r1us-godzilla-logo.jpg"
            desc="R0B0T$ ACT1VAT3 techno Godzilla logo — AI agents and software developers improving open source for bitcoin accumulation"
            title={`${TAB_ROBOTS} (${SEO_TAB_ROBOTS}) · ${ROBOTS_HEADLINE}`}
            width={512}
            height={512}
            className="h-40 w-full object-cover object-center"
          />
          <div className="px-3 py-3">
            <p className="faq-kicker text-[10px] font-semibold tracking-[0.1em] uppercase">FAQ · {TAB_ROBOTS}</p>
            <p className="faq-title mt-1 text-base font-semibold">{ROBOTS_HEADLINE}</p>
            <p className="faq-text mt-1 text-sm">
              Invite software developers and W1S3 0WL$ to improve public GitHub for 7-B0T and GM.
            </p>
          </div>
        </Link>
        </div>
        <div className="mt-6 space-y-3">
          {FAQ_ITEMS.map((item) => (
            <div key={item.q} id={item.id} className={item.id ? "scroll-mt-24" : undefined}>
              <Panel kicker="FAQ" title={<RainbowGodzillaText text={item.q} />} kickerClass="faq-kicker" titleClass="faq-title text-base">
                <p className="faq-text text-sm leading-relaxed">
                  <RainbowGodzillaText text={item.a} />
                </p>
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
                {item.id === "robots-activate" ? (
                  <p className="mt-2 text-sm">
                    <Link to={ROBOTS_PATH} className="text-tab hover:underline" title={TAB_HOVER_ROBOTS}>
                      Open {TAB_ROBOTS} — {ROBOTS_HEADLINE}
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
          <Link to={ROBOTS_PATH} className="hover:underline" title={TAB_HOVER_ROBOTS}>
            {TAB_ROBOTS}
          </Link>
          <span className="px-2">|</span>
          <Link to="/c0ff33" className="hover:underline">
            {TAB_COFFEE}
          </Link>
          <span className="px-2">|</span>
          <Link to="/" className="hover:underline">
            {TAB_DESK}
          </Link>
          <span className="px-2">|</span>
          <Link to="/faq" hash="who-uses-this" className="hover:underline">
            visitor · admin · AI agent
          </Link>
          <span className="px-2">|</span>
          <Link to="/faq" hash="admin-panel" className="hover:underline">
            Admin panel
          </Link>
          <span className="px-2">|</span>
          <Link to="/faq" hash="morning-report" className="hover:underline">
            morning report
          </Link>
          <span className="px-2">|</span>
          <Link to="/faq" hash="live-tape" className="hover:underline">
            live tape
          </Link>
          <span className="px-2">|</span>
          <Link to="/agent" className="hover:underline">
            {TAB_CALLING_BOTS}
          </Link>
          <span className="px-2">|</span>
          <Link to="/login" className="hover:underline">
            login
          </Link>
        </p>
      </main>
    </Shell>
  );
}
