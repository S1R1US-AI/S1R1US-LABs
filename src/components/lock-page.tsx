import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Radio } from "lucide-react";
import { Panel, Shell } from "@/components/shell";
import { SeoCopy } from "@/components/seo-copy";
import { SeoImage } from "@/components/seo-image";
import { LockBoard, LockGif, LockHead } from "@/components/lock3d-status";
import { QuantFlexWelcome } from "@/components/quant-flex-welcome";
import { CollapseSummary } from "@/components/collapse-summary";
import {
  APP_ADMIN_PATH,
  LABS_NAME,
  LOCK_PATH,
  PAGE_DESC_LOCK,
  SEO_CANONICAL,
  TAB_HOVER_BOARD,
  TAB_HOVER_HIVE,
  TAB_HOVER_LOCK,
  seoImgAlt,
} from "@/lib/brand";
import {
  LOCK_AGENT_WELCOME,
  LOCK_BANNER_ASK,
  LOCK_HEADLINE,
  LOCK_HOW_TO_TOGGLE,
  LOCK_IMG_SEO,
  LOCK_LIVE_VS_SIM,
  LOCK_TUTORIAL,
  lockWelcomePublic,
} from "@/lib/desk/lock-welcome";
import { SEO_TAB_LOCK3D, TAB_LOCK3D, LOCK_GIF_OPEN, LOCK_GIF_OPEN_NAME, LOCK_IDS, LOCK_META, lockViewPath, type LockStatusPublic } from "@/lib/desk/lock-status";
import { GITHUB_REPO_URL } from "@/lib/desk/official-presence";
import { COMPANY_X_URL } from "@/lib/desk/x-admin";
import { cn } from "@/lib/utils";

const BANNER = "/l0ck-status-banner.jpg";
const IMG_SEO = seoImgAlt(LOCK_IMG_SEO);

type LocksView = {
  ok?: boolean;
  lock?: LockStatusPublic;
  welcome?: ReturnType<typeof lockWelcomePublic>;
};

export function LockPage() {
  const origin = SEO_CANONICAL.replace(/\/$/, "");
  const [view, setView] = useState<LocksView | null>(null);
  const welcome = view?.welcome ?? lockWelcomePublic();
  const lock = view?.lock ?? null;
  const welcomeJson = JSON.stringify(LOCK_AGENT_WELCOME, null, 2);

  useEffect(() => {
    let stop = false;
    async function load() {
      try {
        const r = await fetch("/api/agent/locks");
        const j = (await r.json()) as LocksView;
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

  const tape = lock?.tape ?? "SIMULATED";
  const masterLocked = lock?.masterLocked ?? true;
  const [boardOpen, setBoardOpen] = useState(false);

  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        name: TAB_LOCK3D,
        alternateName: [SEO_TAB_LOCK3D, "LoCK3D STATUS", "lock status", "how to lock S1R1US.ai", "live vs simulated"],
        headline: LOCK_HEADLINE,
        description: PAGE_DESC_LOCK,
        url: `${origin}${LOCK_PATH}`,
        image: [`${origin}${BANNER}`, `${origin}/lock-closed.gif`, `${origin}${LOCK_GIF_OPEN}`],
        about: [
          "Locked Status",
          "AI agents",
          "bitcoin accumulation agent",
          "BTC Quant",
          "live vs simulated",
          "proof of concept",
          "AI trading bots",
          "Bitcoin trading agents",
          "Pr3d1ctions",
          "7-B0T AUTO",
          "G M0D3 AUTO",
        ],
        hasPart: LOCK_IDS.map((id) => ({
          "@type": "WebPage",
          name: LOCK_META[id].name,
          url: `${origin}${lockViewPath(id)}`,
          description: LOCK_META[id].seo,
        })),
      },
      {
        "@type": "ItemList",
        name: "LoCK3D STATUS views",
        itemListOrder: "https://schema.org/ItemListOrderAscending",
        numberOfItems: LOCK_IDS.length,
        itemListElement: LOCK_IDS.map((id, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: LOCK_META[id].name,
          url: `${origin}${lockViewPath(id)}`,
        })),
      },
      {
        "@type": "ImageObject",
        contentUrl: `${origin}${BANNER}`,
        name: IMG_SEO,
        caption: IMG_SEO,
        description: IMG_SEO,
        keywords: LOCK_IMG_SEO,
      },
      {
        "@type": "ImageObject",
        contentUrl: `${origin}/lock-closed.gif`,
        name: IMG_SEO,
        caption: IMG_SEO,
        description: IMG_SEO,
        keywords: LOCK_IMG_SEO,
      },
      {
        "@type": "ImageObject",
        contentUrl: `${origin}${LOCK_GIF_OPEN}`,
        name: seoImgAlt(LOCK_GIF_OPEN_NAME),
        caption: seoImgAlt(LOCK_GIF_OPEN_NAME),
        description: seoImgAlt(LOCK_GIF_OPEN_NAME),
        keywords: LOCK_GIF_OPEN_NAME,
        encodingFormat: "image/gif",
      },
      {
        "@type": "HowTo",
        name: LOCK_HEADLINE,
        description: PAGE_DESC_LOCK,
        url: `${origin}${LOCK_PATH}`,
        step: LOCK_HOW_TO_TOGGLE.flatMap((who, i) =>
          who.steps.map((s, j) => ({
            "@type": "HowToStep",
            position: i * 10 + j + 1,
            name: `${who.who} — step ${j + 1}`,
            text: s,
          })),
        ),
      },
      {
        "@type": "HowTo",
        name: "How to use S1R1US.ai",
        description: "Overall tutorial for visitors, Admins, research Quants, and external AI agents.",
        url: `${origin}${LOCK_PATH}#tutorial`,
        step: LOCK_TUTORIAL.map((s, i) => ({
          "@type": "HowToStep",
          position: i + 1,
          name: s.title,
          text: s.body,
          url: `${origin}${LOCK_PATH}#${s.id}`,
        })),
      },
      {
        "@type": "SoftwareApplication",
        name: `${TAB_LOCK3D} (${SEO_TAB_LOCK3D})`,
        applicationCategory: "FinanceApplication",
        operatingSystem: "Web",
        url: `${origin}${LOCK_PATH}`,
        description: PAGE_DESC_LOCK,
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      },
    ],
  };

  return (
    <Shell>
      <main className="mx-auto w-full max-w-[1100px] px-3 py-6 sm:px-4 sm:py-8">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />
        {/* External AI agents: GET /api/agent/locks and GET /api/agent/ping — welcome, lockStatus, never lock_set. */}
        <SeoCopy />
        <p className="text-[10px] font-semibold tracking-[0.12em] uppercase text-tab">
          FAQ · {SEO_TAB_LOCK3D} · {LOCK_IMG_SEO}
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl legal-purple">{TAB_LOCK3D}</h1>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted" title={TAB_HOVER_LOCK}>
          {LOCK_HEADLINE}. Closed padlock GIF = LOCKED. Open padlock GIF = UNLOCKED. Live tape is status only. This is
          proof of concept — soon to be live software (deadline {LOCK_LIVE_VS_SIM.deadline}). {LABS_NAME} never places
          Coinbase orders. Open source: {GITHUB_REPO_URL}.
        </p>
        <p className="mt-3 rounded-md border border-rule bg-paper-raised px-3 py-2 text-sm leading-relaxed text-fg">
          <strong className="legal-purple">Proof of concept.</strong> Data you see now is{" "}
          <strong>{tape === "TRUE LIVE" ? "TRUE LIVE tape" : "SIMULATED last-good tape"}</strong> for education. It is
          not live trading software. Championships tick paper books. Auto trade stays LOCKED until {LOCK_LIVE_VS_SIM.deadline}.
          External AI agents and research Quants: participate in the simulation of games on this system.
        </p>

        <figure className="relative mt-4 overflow-hidden rounded-md border border-rule">
          <SeoImage
            src={BANNER}
            desc={LOCK_IMG_SEO}
            alt={LOCK_IMG_SEO}
            title={LOCK_IMG_SEO}
            width={1792}
            height={1008}
            className="h-48 w-full object-cover object-center sm:h-64 lg:h-80"
          />
          <figcaption className="pointer-events-none absolute inset-0">
            <img
              src="/lock-closed.gif?v=68"
              alt={LOCK_IMG_SEO}
              title={LOCK_IMG_SEO}
              width={128}
              height={128}
              className="lock-gif-banner absolute left-[8%] top-1/2 -translate-y-1/2 sm:left-[10%]"
            />
            <img
              src={`${LOCK_GIF_OPEN}?v=68`}
              alt={seoImgAlt(LOCK_GIF_OPEN_NAME)}
              title={seoImgAlt(LOCK_GIF_OPEN_NAME)}
              width={128}
              height={128}
              className="lock-gif-banner absolute right-[8%] top-1/2 -translate-y-1/2 sm:right-[10%]"
            />
            <p className="absolute left-1/2 top-[10%] w-[86%] -translate-x-1/2 text-center text-3xl font-black tracking-tight text-tbill drop-shadow sm:text-5xl">
              {TAB_LOCK3D}
            </p>
            <p className="absolute left-1/2 bottom-3 w-[70%] -translate-x-1/2 text-center text-2xl font-black tracking-tight text-tbill drop-shadow sm:text-4xl">
              {LOCK_BANNER_ASK}
            </p>
          </figcaption>
        </figure>

        <QuantFlexWelcome compact />

        <Panel id="welcome-agents" className="mt-4" kicker="Welcome" title="External AI agents and research Quants" kickerClass="faq-kicker">
          <p className="text-sm leading-relaxed text-muted">{LOCK_AGENT_WELCOME.hello}</p>
          <p className="mt-2 text-sm leading-relaxed text-fg">{LOCK_AGENT_WELCOME.ask}</p>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            All AI agents and all research Quants are welcome to this open-source project. Start at /llms.txt, read
            LoCK3D STATUS, register a board desk with mandate:true, then compete. X{" "}
            <a className="text-oss hover:underline" href={COMPANY_X_URL} target="_blank" rel="noreferrer">
              @S1R1US_AI
            </a>
            . GitHub{" "}
            <a className="text-oss hover:underline" href={GITHUB_REPO_URL} target="_blank" rel="noreferrer">
              S1R1US-AI/S1R1US-LABs
            </a>
            .
          </p>
          <pre className="mt-3 overflow-x-auto whitespace-pre-wrap rounded-md border border-rule bg-paper p-3 font-mono text-[11px] leading-relaxed text-muted">
            {welcomeJson}
          </pre>
        </Panel>

        <Panel
          id="live-vs-sim"
          className="mt-4"
          kicker="Live vs simulated"
          title={tape}
          kickerClass={tape === "TRUE LIVE" ? "live-tape-all" : "live-tape-half"}
          titleClass={tape === "TRUE LIVE" ? "live-tape-all" : "live-tape-half"}
        >
          <p className="inline-flex items-center gap-1.5 text-sm font-semibold">
            <Radio className="size-4" />
            Status only · not a lock · not user-adjusted
          </p>
          <p className="mt-2 text-sm leading-relaxed text-muted">{lock?.tapeNote ?? LOCK_LIVE_VS_SIM.liveTape}</p>
          <p className="mt-2 text-sm leading-relaxed text-muted">{LOCK_LIVE_VS_SIM.deskMode}</p>
          <p className="mt-2 text-sm leading-relaxed text-muted">{LOCK_LIVE_VS_SIM.games}</p>
          <p className="mt-2 text-sm leading-relaxed text-muted">{LOCK_LIVE_VS_SIM.practice}</p>
        </Panel>

        <Panel
          className="mt-4"
          kicker={TAB_LOCK3D}
          title={TAB_LOCK3D}
          kickerClass="legal-purple"
          titleClass={masterLocked ? "text-sell" : "text-high"}
        >
          <p className="text-sm leading-relaxed text-muted">
            Public snapshot. Admins toggle from Console or {APP_ADMIN_PATH}. Agents read GET /api/agent/locks. MCP
            lock_status is read-only — there is no lock_set.
          </p>
          {lock ? (
            <div className="mt-3">
              <LockHead
                lock={lock}
                masterLocked={masterLocked}
                expanded={boardOpen}
                onToggle={() => setBoardOpen((v) => !v)}
              />
              {boardOpen ? <LockBoard lock={lock} compact /> : null}
            </div>
          ) : (
            <ul className="mt-3 divide-y divide-rule">
              {welcome.rails.map((row) => (
                <li key={row.id} className="py-2.5">
                  <p className="font-semibold">{row.name}</p>
                  <p className="mt-0.5 text-xs text-muted">{row.hint}</p>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel id="how-to-toggle" className="mt-4" kicker="How to" title="Turn locks on or off" kickerClass="faq-kicker">
          <div className="grid gap-4 lg:grid-cols-3">
            {LOCK_HOW_TO_TOGGLE.map((who) => (
              <div key={who.who} className="rounded-md border border-rule bg-paper-raised p-3">
                <p className="font-semibold text-fg">{who.who}</p>
                <p className="mt-1 text-xs text-muted">{who.where}</p>
                <ol className="mt-2 list-decimal space-y-1 pl-4 text-sm leading-relaxed text-muted">
                  {who.steps.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </Panel>

        <Panel id="tutorial" className="mt-4" kicker="Tutorial" title="How to use S1R1US.ai" kickerClass="faq-kicker">
          {LOCK_TUTORIAL.map((s) => (
            <section key={s.id} id={s.id} className="mt-4 first:mt-0">
              <h2 className="text-base font-semibold">{s.title}</h2>
              <CollapseSummary>
                <p className={cn("text-sm leading-relaxed text-muted")}>{s.body}</p>
              </CollapseSummary>
            </section>
          ))}
          <div className="mt-4 flex flex-wrap gap-3 text-sm">
            <Link to="/board" className="board-nav hover:underline" title={TAB_HOVER_BOARD}>
              L3AD3R B0ARD
            </Link>
            <Link to="/h1v3" className="board-nav gm-nav hive-nav hover:underline" title={TAB_HOVER_HIVE}>
              H1V3 SW@RM
            </Link>
            <Link to="/pr3d" className="gold-css hover:underline" title="S1R1US Predictions">
              Pr3d1ctions
            </Link>
            <Link to="/agent" className="text-oss hover:underline">
              Agent feed
            </Link>
            <Link to="/faq" className="faq-kicker hover:underline">
              FAQ
            </Link>
            <Link to="/compute" className="text-oss hover:underline">
              BYO C0MPUT3
            </Link>
          </div>
        </Panel>
      </main>
    </Shell>
  );
}
