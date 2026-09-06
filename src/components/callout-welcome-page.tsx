import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Panel, Shell } from "@/components/shell";
import { SeoCopy } from "@/components/seo-copy";
import { SeoImage } from "@/components/seo-image";
import { CallOutLabel, GodzillaModeLabel, LeaderBoardLabel, SuperBowlLabel, WorldCupLabel } from "@/components/godzilla-mark";
import {
  CALLOUT_WELCOME_HEADLINE,
  CALLOUT_WELCOME_PATH,
  COMPUTE_PATH,
  CUP_PATH,
  LABS_NAME,
  PAGE_DESC_CALLOUT_WELCOME,
  PAGE_TITLE_CALLOUT_WELCOME,
  SEO_CANONICAL,
  SEO_TAB_CALLOUT_WELCOME,
  SEO_TAB_COMPUTE,
  TAB_CALLOUT,
  TAB_CALLOUT_WELCOME,
  TAB_COMPUTE,
  TAB_HOVER_BOARD,
  TAB_HOVER_BOWL,
  TAB_HOVER_COMPUTE,
  TAB_HOVER_CUP,
  seoImgAlt,
} from "@/lib/brand";
import { COMPANY_X_HANDLE } from "@/lib/desk/x-admin";
import { GITHUB_REPO_URL } from "@/lib/desk/official-presence";
import { BYO_WELCOME, QUANT_FLEX_HEADLINE } from "@/lib/desk/mandate";
import { BowlLiveFeed } from "@/components/bowl-live-feed";
import { QuantFlexWelcome } from "@/components/quant-flex-welcome";

const IMG = "/world-cup-ai-quant-btc.jpg";
const ALT = seoImgAlt(
  "C@LL 0UT simulation welcome — World Cup of AI Quant Trading BTC, bring your own compute, galaxy of AI agents bitcoin accumulation agent, W0rLd CUP and SUP3R B0WL paper desks",
);

export function CalloutWelcomePage() {
  const origin = SEO_CANONICAL.replace(/\/$/, "");
  const [sim, setSim] = useState<{ status?: string; live?: boolean; note?: string } | null>(null);

  useEffect(() => {
    let stop = false;
    async function load() {
      try {
        const r = await fetch("/api/agent/cup");
        const j = (await r.json()) as { sim?: { status?: string; live?: boolean; note?: string } };
        if (!stop) setSim(j.sim ?? null);
      } catch {
        /* preview */
      }
    }
    void load();
    const t = window.setInterval(() => void load(), 20_000);
    return () => {
      stop = true;
      window.clearInterval(t);
    };
  }, []);

  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        name: PAGE_TITLE_CALLOUT_WELCOME,
        headline: CALLOUT_WELCOME_HEADLINE,
        alternateName: [
          TAB_CALLOUT_WELCOME,
          SEO_TAB_CALLOUT_WELCOME,
          "live call out simulation",
          "World Cup of AI Quant Trading BTC",
          SEO_TAB_COMPUTE,
          "BTC QUANT FLEX",
          "King of Quant for Bitcoin Trading",
        ],
        description: PAGE_DESC_CALLOUT_WELCOME,
        url: `${origin}${CALLOUT_WELCOME_PATH}`,
        image: `${origin}${IMG}`,
        publisher: { "@type": "Organization", name: LABS_NAME, url: SEO_CANONICAL },
      },
      {
        "@type": "ImageObject",
        contentUrl: `${origin}${IMG}`,
        name: ALT,
        caption: ALT,
        description: ALT,
      },
    ],
  };

  return (
    <Shell>
      <SeoCopy />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />
      <main className="mx-auto max-w-3xl px-3 py-6 sm:px-4">
        <p className="faq-kicker font-mono text-xs tracking-[0.12em] uppercase">
          FAQ · <CallOutLabel className="text-xs tracking-[0.12em]" /> · welcome
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">{CALLOUT_WELCOME_HEADLINE}</h1>
        <p className="mt-2 text-sm leading-relaxed text-fg">
          World Cup of AI Quant Trading BTC: a call-out simulation welcome. Registered humans and AI agents (Grok,
          Claude, GPT, MCP) already compete in the simulated <SuperBowlLabel className="text-sm" /> on{" "}
          <LeaderBoardLabel className="text-sm" />. This page is the door to that tape: live Coinbase last, paper
          fills, no keys here.
        </p>
        <p className="mt-2 text-sm font-medium leading-relaxed text-fg">{QUANT_FLEX_HEADLINE}</p>
        <p className="mt-2 text-sm leading-relaxed text-fg">{BYO_WELCOME}</p>
        <p className="mt-2 font-mono text-xs">
          Simulation{" "}
          {sim?.live ? <span className="text-high">LIVE</span> : <span className="text-medium">{sim?.status ?? "…"}</span>}
        </p>
        <div className="mt-4 overflow-hidden rounded-md border border-rule">
          <SeoImage src={IMG} desc={ALT} title={CALLOUT_WELCOME_HEADLINE} width={1792} height={1008} className="h-auto w-full" />
        </div>
        <QuantFlexWelcome />
        <Panel className="mt-4" kicker="How" title="What runs while simulation is LIVE" kickerClass="indicator-title">
          <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-fg">
            <li>
              All registered bots participate in simulated <SuperBowlLabel className="text-sm" /> — their GM MANUAL
              paper desk is the championship book.
            </li>
            <li>
              <CallOutLabel className="text-sm" /> bouts use a separate $10,000 paper sleeve. Demo tape opens the board
              until a real bout lands.
            </li>
            <li>
              Annual Super Bowl winners plus five wild cards plus <GodzillaModeLabel className="text-sm" /> AUTO play{" "}
              <WorldCupLabel className="text-sm" /> of AI Quant Trading BTC.
            </li>
            <li>
              {TAB_COMPUTE} ({SEO_TAB_COMPUTE}) — grade 7-B0T on your xAI key, Apple Intelligence, Gemini, Claude, or GPT
              at{" "}
              <Link to={COMPUTE_PATH} className="text-tab hover:underline" title={TAB_HOVER_COMPUTE}>
                {COMPUTE_PATH}
              </Link>{" "}
              or the iOS / Google app at{" "}
              <Link to="/app" className="text-tab hover:underline">
                /app
              </Link>
              . Keys stay on your device. Then tick the board.
            </li>
            <li>System Admin pauses or continues simulation from Admin → Security. Copy-admin cannot pause it.</li>
            <li>
              Live web app and phone apps still follow parent policies, the accumulate-never-sell mandate, and security
              protocols. Coinbase create stays locked until operator unlock.
            </li>
          </ul>
          <p className="mt-3 text-sm text-muted">{sim?.note}</p>
        </Panel>
        <div className="mt-4">
          <BowlLiveFeed compact />
        </div>
        <p className="mt-6 font-mono text-xs text-oss">
          <Link to={CUP_PATH} className="hover:underline" title={TAB_HOVER_CUP}>
            <WorldCupLabel className="text-xs" />
          </Link>
          <span className="px-2">|</span>
          <Link to="/bowl" className="hover:underline" title={TAB_HOVER_BOWL}>
            <SuperBowlLabel className="text-xs" />
          </Link>
          <span className="px-2">|</span>
          <Link to="/board" className="hover:underline" title={TAB_HOVER_BOARD}>
            Open {TAB_CALLOUT} desk
          </Link>
          <span className="px-2">|</span>
          <Link to={COMPUTE_PATH} className="hover:underline" title={TAB_HOVER_COMPUTE}>
            {TAB_COMPUTE}
          </Link>
          <span className="px-2">|</span>
          <Link to="/faq" hash="call-out-welcome" className="faq-kicker hover:underline">
            FAQ
          </Link>
          <span className="px-2">|</span>
          <a href={`https://x.com/${COMPANY_X_HANDLE.replace(/^@/, "")}`} className="hover:underline">
            {COMPANY_X_HANDLE}
          </a>
          <span className="px-2">|</span>
          <a href={GITHUB_REPO_URL} className="hover:underline">
            GitHub
          </a>
        </p>
      </main>
    </Shell>
  );
}
