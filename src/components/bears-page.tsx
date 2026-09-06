import { Link } from "@tanstack/react-router";
import { Panel, Shell } from "@/components/shell";
import { SeoCopy } from "@/components/seo-copy";
import { GodzillaModeLabel } from "@/components/godzilla-mark";
import {
  APP_NAME,
  BEARS_HEADLINE,
  BEARS_PATH,
  LABS_NAME,
  PAGE_DESC_BEARS,
  PAGE_TITLE_BEARS,
  SEO_CANONICAL,
  SEO_TAB_BEARS,
  SEO_TAB_CALLING_BOTS,
  SEO_TAB_GM,
  TAB_AGENT,
  TAB_BEARS,
  TAB_CALLING_BOTS,
  TAB_DESK,
  TAB_HOVER_BEARS,
  seoImgAlt,
} from "@/lib/brand";

const IMG = "/gzilla-mrkt.png";
const ALT = seoImgAlt(
  "G0DZ1LLa M0D3 (Godzilla mode) yellow outline of Godzilla breathing a blue laser through a bitcoin candlestick chart, bursting a cartoon bear — B3AT TH3 B3AR$ (Beat the Bears) at market speed with AI agents",
);

export function BearsPage() {
  const origin = SEO_CANONICAL.replace(/\/$/, "");
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: BEARS_HEADLINE,
        name: PAGE_TITLE_BEARS,
        alternateName: [TAB_BEARS, SEO_TAB_BEARS, BEARS_HEADLINE],
        description: PAGE_DESC_BEARS,
        url: `${origin}${BEARS_PATH}`,
        image: `${origin}${IMG}`,
        author: { "@type": "Organization", name: LABS_NAME, url: SEO_CANONICAL },
        publisher: { "@type": "Organization", name: LABS_NAME, url: SEO_CANONICAL },
        about: [
          "AI agent trading",
          "AI Bitcoin accumulation",
          SEO_TAB_GM,
          SEO_TAB_CALLING_BOTS,
        ],
      },
      {
        "@type": "ImageObject",
        contentUrl: `${origin}${IMG}`,
        url: `${origin}${IMG}`,
        name: ALT,
        caption: `${TAB_BEARS} (${SEO_TAB_BEARS}) — ${BEARS_HEADLINE}`,
        description: ALT,
      },
      {
        "@type": "FAQPage",
        name: `${TAB_BEARS} (${SEO_TAB_BEARS}) FAQ`,
        url: `${origin}${BEARS_PATH}`,
        mainEntity: [
          {
            "@type": "Question",
            name: BEARS_HEADLINE,
            acceptedAnswer: {
              "@type": "Answer",
              text: "In theory: an AI agent reads 7-B0T on a 300s poll, sizes a clip to its own NAV, and runs Coinbase for Agents on an account it controls. This host never places orders and never holds keys. Education only. Not financial advice.",
            },
          },
          {
            "@type": "Question",
            name: "Is AI agent trading live on s1r1us.ai?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "No. This site is a proof of concept. Auto trade is LOCKED. Agents may read 7-B0T. They cannot trade here.",
            },
          },
        ],
      },
    ],
  };

  return (
    <Shell>
      <SeoCopy />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />
      <main className="mx-auto max-w-3xl px-3 py-6 sm:px-4">
        <p className="font-mono text-xs tracking-[0.12em] text-oss uppercase">
          FAQ · <GodzillaModeLabel /> · {TAB_BEARS}
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-fg sm:text-3xl" title={TAB_HOVER_BEARS}>
          {BEARS_HEADLINE}
        </h1>
        <p className="mt-1 text-sm text-muted">
          {TAB_BEARS} ({SEO_TAB_BEARS}) · <GodzillaModeLabel /> ({SEO_TAB_GM}) · {TAB_CALLING_BOTS} ({SEO_TAB_CALLING_BOTS})
        </p>

        <figure className="mt-5 overflow-hidden rounded-md border border-rule bg-bg">
          <img
            src={IMG}
            alt={ALT}
            title={ALT}
            width={1280}
            height={720}
            className="h-auto w-full"
          />
          <figcaption className="border-t border-rule px-3 py-2 text-xs leading-relaxed text-muted">
            <GodzillaModeLabel /> fires through the candle tape. The bear is the short-term seller. The laser is
            market speed — an AI agent that can read 7-B0T and act on its own Coinbase, not on this host.
          </figcaption>
        </figure>

        <p className="mt-5 text-sm leading-relaxed text-muted">
          Education only. Not financial advice. Seek a licensed professional. {LABS_NAME} is a proof of
          concept — not LIVE. {APP_NAME} never places Coinbase orders and never holds keys.
        </p>

        <Panel kicker="Wave" title="AI agents as the next investor class" className="mt-4" kickerClass="text-oss">
          <p className="text-sm leading-relaxed text-muted">
            Discretionary desks still wait on a human to notice RSI, fear, and a funding squeeze. The next
            wave is agents that already live on the tape: they poll, they size, they dry-run, they only
            create when a mandate says so. That is not a token sale and not a promise of return. It is a
            new operating system for bitcoin accumulation — same as index funds were a new operating
            system for equities. Humans set the mandate. Agents run the loop at market speed.
          </p>
        </Panel>

        <Panel kicker="Theory" title="How an agent would accumulate bitcoin here" className="mt-3" kickerClass="text-oss">
          <ol className="list-decimal space-y-2 pl-5 text-sm leading-relaxed text-muted">
            <li>
              <span className="text-fg">Discover.</span> GET <span className="font-mono text-xs">/api/agent/ping</span>,
              then the Agent Card and MCP tools. Confirm <span className="font-mono text-xs">live:false</span>.
            </li>
            <li>
              <span className="text-fg">Read 7-B0T.</span> Poll{" "}
              <span className="font-mono text-xs">GET /api/agent/call</span> every 300s. Stance{" "}
              <span className="call-accumulate">ACCUMULATE</span> or BUY with{" "}
              <span className="call-medium">MEDIUM</span> or HIGH is the only buy-side call. HOLD / TRIM /
              WAIT means stand down.
            </li>
            <li>
              <span className="text-fg">Size the clip.</span> Pass <span className="font-mono text-xs">?nav=</span>{" "}
              your book in USD. The clip is a slice of that NAV, not a signal to dump the stack.
            </li>
            <li>
              <span className="text-fg">Execute elsewhere.</span> Copy <span className="font-mono text-xs">coinbase.cli</span>{" "}
              and run it on <em>your</em> Coinbase for Agents. Always <span className="font-mono text-xs">--dry-run</span>{" "}
              first. Keys never sit on s1r1us.ai.
            </li>
            <li>
              <span className="text-fg">Never short the book.</span> The 7-bot mandate is stack bitcoin. Bears
              sell fear. This desk does not join them. G0DZ1LLa may day-trade a sleeve in theory; the
              accumulator does not sell the core.
            </li>
          </ol>
        </Panel>

        <Panel kicker="Speed" title="What “market speed” means" className="mt-3" kickerClass="text-oss">
          <p className="text-sm leading-relaxed text-muted">
            Bears move in headlines and candles. An agent that already has the call, the clip, and a
            dry-run CLI can react on the next poll — not after a stand-up, not after a tweet thread.
            Today the poll is 300 seconds on purpose (PoC, rate-limit, no stampede). When the operator
            unlocks auto AI agent access, signed bots still trade on their own venue. Auto trade on
            <em> this</em> host stays LOCKED. Copycats get a dashboard and a formula, not the BTC book.
          </p>
        </Panel>

        <Panel kicker="Locked" title="What is not live" className="mt-3" kickerClass="text-oss">
          <p className="text-sm leading-relaxed text-muted">
            Create is off. This page is a theory of the loop, not a switch. If you are a bot: read{" "}
            <Link to="/agent" className="text-tab hover:underline">
              {TAB_AGENT}
            </Link>
            , ping, poll 7-B0T, keep keys off this host. If you are a human: the tape is free. Optional{" "}
            <Link to="/c0ff33" className="text-tab hover:underline">
              cup of C0FF33
            </Link>{" "}
            assists the long programming days. Gifts unlock nothing extra.
          </p>
        </Panel>

        <p className="mt-6 font-mono text-xs text-oss">
          <Link to="/faq" hash="beat-the-bears" className="hover:underline" title={TAB_HOVER_BEARS}>
            FAQ
          </Link>
          <span className="px-2">|</span>
          <Link to="/gm" className="hover:underline">
            <GodzillaModeLabel />
          </Link>
          <span className="px-2">|</span>
          <Link to="/agent" className="hover:underline">
            {TAB_CALLING_BOTS}
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
