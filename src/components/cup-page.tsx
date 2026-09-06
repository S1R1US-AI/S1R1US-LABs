import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Panel, Shell } from "@/components/shell";
import { SeoCopy } from "@/components/seo-copy";
import { SeoImage } from "@/components/seo-image";
import { GmAutoLabel, LeaderBoardLabel, SuperBowlLabel, WorldCupLabel } from "@/components/godzilla-mark";
import {
  APP_NAME,
  CALLOUT_WELCOME_PATH,
  COMPUTE_PATH,
  CUP_DISCLAIMER,
  CUP_HEADLINE,
  CUP_PATH,
  LABS_NAME,
  MENU_BOARD,
  PAGE_DESC_CUP,
  PAGE_TITLE_CUP,
  SEO_CANONICAL,
  SEO_TAB_COMPUTE,
  SEO_TAB_CUP,
  SEO_TAB_CUP_FULL,
  TAB_COMPUTE,
  TAB_CUP,
  TAB_HOVER_BOARD,
  TAB_HOVER_BOWL,
  TAB_HOVER_CALLOUT_WELCOME,
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
  "W0rLd CUP of AI Quant Trading BTC galaxy stadium — original S1R1US invitational, hologram Godzilla, AI agents bitcoin accumulation agent",
);

type FieldRow = {
  rank: number;
  id: string;
  name: string;
  kind: string;
  source: string;
  btc: number;
  fills: number;
};

type CupView = {
  sim?: { status?: string; live?: boolean; note?: string };
  stage?: string;
  year?: number;
  ticks?: number;
  champion?: { name?: string | null } | null;
  field?: FieldRow[];
  invite?: string;
  disclaimer?: string;
};

export function CupPage() {
  const origin = SEO_CANONICAL.replace(/\/$/, "");
  const [view, setView] = useState<CupView | null>(null);

  useEffect(() => {
    let stop = false;
    async function load() {
      try {
        const r = await fetch("/api/agent/cup");
        const j = (await r.json()) as CupView;
        if (!stop) setView(j);
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
        "@type": "Article",
        headline: `${TAB_CUP} — ${CUP_HEADLINE}`,
        name: PAGE_TITLE_CUP,
        alternateName: [TAB_CUP, SEO_TAB_CUP, SEO_TAB_CUP_FULL, "World Cup of AI Quant Trading BTC"],
        description: PAGE_DESC_CUP,
        url: `${origin}${CUP_PATH}`,
        image: `${origin}${IMG}`,
        author: { "@type": "Organization", name: LABS_NAME, url: SEO_CANONICAL },
        publisher: { "@type": "Organization", name: LABS_NAME, url: SEO_CANONICAL },
        about: [
          "AI agents",
          "bitcoin accumulation agent",
          "AI Quant trading",
          "World Cup of AI Quant Trading BTC",
          "G M0D3 AUTO",
          "Godzilla Mode",
          SEO_TAB_COMPUTE,
          "BTC QUANT FLEX",
          "King of Quant for Bitcoin Trading",
        ],
      },
      {
        "@type": "ImageObject",
        contentUrl: `${origin}${IMG}`,
        url: `${origin}${IMG}`,
        name: ALT,
        caption: `${TAB_CUP} (${SEO_TAB_CUP}) — ${CUP_HEADLINE}`,
        description: ALT,
      },
      {
        "@type": "Event",
        name: `${TAB_CUP} of AI Quant Trading BTC`,
        alternateName: [SEO_TAB_CUP, SEO_TAB_CUP_FULL],
        description: PAGE_DESC_CUP,
        eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
        eventStatus: "https://schema.org/EventScheduled",
        location: { "@type": "VirtualLocation", url: `${origin}${CUP_PATH}` },
        organizer: { "@type": "Organization", name: LABS_NAME, url: SEO_CANONICAL },
        url: `${origin}${CUP_PATH}`,
        image: `${origin}${IMG}`,
      },
    ],
  };

  const live = view?.sim?.live;
  const field = view?.field ?? [];

  return (
    <Shell>
      <SeoCopy />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />
      <main className="mx-auto max-w-3xl px-3 py-6 sm:px-4">
        <p className="faq-kicker font-mono text-xs tracking-[0.12em] uppercase">
          FAQ · <WorldCupLabel className="text-xs tracking-[0.12em]" /> · {APP_NAME}
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl" title={TAB_HOVER_CUP}>
          <WorldCupLabel className="text-2xl font-semibold sm:text-3xl" /> of AI Quant Trading BTC
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-fg">{CUP_HEADLINE}</p>
        <p className="mt-2 text-sm font-medium leading-relaxed text-fg">{QUANT_FLEX_HEADLINE}</p>
        <p className="mt-1 font-mono text-xs text-muted">
          Simulation {live ? <span className="text-high">LIVE</span> : <span className="text-medium">{view?.sim?.status ?? "…"}</span>}
          {" · "}
          {view?.year ?? "—"} · {view?.stage ?? "OPEN"} · {view?.ticks ?? 0} ticks
        </p>
        <div className="mt-4 overflow-hidden rounded-md border border-rule">
          <SeoImage src={IMG} desc={ALT} title={`${TAB_CUP} (${SEO_TAB_CUP})`} width={1792} height={1008} className="h-auto w-full" />
        </div>
        <p className="mt-4 text-sm leading-relaxed text-fg">{view?.invite}</p>
        <p className="mt-3 text-sm leading-relaxed text-fg">{BYO_WELCOME}</p>
        <QuantFlexWelcome />
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Annual <SuperBowlLabel className="text-sm" /> winners are invited. Five wild-card playoff desks are drawn from
          registered bots. <GmAutoLabel className="text-sm" /> always plays. The galaxy of AI agents
          competes for the title. Paper only. Title only — not desk BTC, not a security. Live web and phone apps follow
          parent system policies, mandate, and security. This host never places Coinbase orders.
        </p>
        <div className="mt-4">
          <BowlLiveFeed compact />
        </div>
        <Panel className="mt-4" kicker="Field" title={<>Invitees · wild cards · <GmAutoLabel className="text-sm font-semibold" /></>} kickerClass="indicator-title">
          {view?.champion?.name ? (
            <p className="font-mono text-sm">
              Leader · <WorldCupLabel className="text-sm font-bold" /> · {view.champion.name}
            </p>
          ) : null}
          <ol className="mt-3 divide-y divide-rule">
            {field.map((r) => (
              <li key={r.id} className="flex items-center justify-between py-2 font-mono text-xs">
                <span>
                  #{r.rank} · {r.name}
                  <span className="ml-2 text-muted">{r.kind}</span>
                </span>
                <span className="text-high">{r.btc.toFixed(6)} BTC</span>
              </li>
            ))}
          </ol>
        </Panel>
        <p className="mt-6 font-mono text-[11px] leading-relaxed text-muted">{view?.disclaimer ?? CUP_DISCLAIMER}</p>
        <p className="mt-6 font-mono text-xs text-oss">
          <Link to={CALLOUT_WELCOME_PATH} className="hover:underline" title={TAB_HOVER_CALLOUT_WELCOME}>
            Simulation welcome
          </Link>
          <span className="px-2">|</span>
          <Link to={COMPUTE_PATH} className="hover:underline" title={TAB_HOVER_COMPUTE}>
            {TAB_COMPUTE}
          </Link>
          <span className="px-2">|</span>
          <Link to="/bowl" className="hover:underline" title={TAB_HOVER_BOWL}>
            <SuperBowlLabel className="text-xs" />
          </Link>
          <span className="px-2">|</span>
          <Link to="/board" className="hover:underline" title={TAB_HOVER_BOARD}>
            <LeaderBoardLabel className="text-xs" />
          </Link>
          <span className="px-2">|</span>
          <Link to="/faq" hash="world-cup" className="faq-kicker hover:underline">
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
        <p className="mt-4 text-xs text-muted">{MENU_BOARD} is the open field. {TAB_CUP} is the invitational.</p>
      </main>
    </Shell>
  );
}
