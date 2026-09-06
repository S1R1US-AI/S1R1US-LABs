import { Link } from "@tanstack/react-router";
import { Panel, Shell } from "@/components/shell";
import { SeoCopy } from "@/components/seo-copy";
import { SeoImage } from "@/components/seo-image";
import {
  APP_NAME,
  LABS_NAME,
  OWL_HEADLINE,
  OWL_PATH,
  PAGE_DESC_OWL,
  PAGE_TITLE_OWL,
  SEO_CANONICAL,
  SEO_TAB_AGENT,
  SEO_TAB_CALLING_BOTS,
  SEO_TAB_COMPUTE,
  SEO_TAB_OWL,
  SEO_TAB_OWL_ALIAS,
  TAB_AGENT,
  TAB_BEARS,
  TAB_CALLING_BOTS,
  TAB_COMPUTE,
  TAB_DESK,
  TAB_HOVER_OWL,
  TAB_OWL,
  TAB_OWL_ALIAS,
  seoImgAlt,
} from "@/lib/brand";

const IMG = "/owl.png";
const ALT = seoImgAlt(
  "AI AG3NTS (AI AGENTS) jeweled owl portrait — W1S3 0WL (Wise Owl) — wise investment decisions theoretically optimized by AI agents: Grok, Claude, GPT and Bot 7 combined for bitcoin accumulation analysis",
);

export function OwlPage() {
  const origin = SEO_CANONICAL.replace(/\/$/, "");
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: OWL_HEADLINE,
        name: PAGE_TITLE_OWL,
        alternateName: [TAB_OWL, SEO_TAB_OWL, TAB_OWL_ALIAS, SEO_TAB_OWL_ALIAS, OWL_HEADLINE],
        description: PAGE_DESC_OWL,
        url: `${origin}${OWL_PATH}`,
        image: `${origin}${IMG}`,
        author: { "@type": "Organization", name: LABS_NAME, url: SEO_CANONICAL },
        publisher: { "@type": "Organization", name: LABS_NAME, url: SEO_CANONICAL },
        about: ["AI agents", "bitcoin accumulation agent", "wise investment", "AI agent trading", "Grok", "Claude", "GPT", SEO_TAB_AGENT],
      },
      {
        "@type": "ImageObject",
        contentUrl: `${origin}${IMG}`,
        url: `${origin}${IMG}`,
        name: ALT,
        caption: `${TAB_OWL} (${SEO_TAB_OWL}) — ${OWL_HEADLINE}`,
        description: ALT,
      },
      {
        "@type": "FAQPage",
        name: `${TAB_OWL} (${SEO_TAB_OWL}) FAQ`,
        url: `${origin}${OWL_PATH}`,
        mainEntity: [
          {
            "@type": "Question",
            name: OWL_HEADLINE,
            acceptedAnswer: {
              "@type": "Answer",
              text: "In theory Bot 7 supplies the live tape call. Grok, Claude, and GPT each read that JSON plus their own world-model and return a second opinion. Combined, they can keep a bitcoin accumulation mandate current without this host placing orders. Education only. Not financial advice.",
            },
          },
          {
            "@type": "Question",
            name: "Do Grok, Claude, or GPT trade on s1r1us.ai?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "No. They may ping /api/agent and read Bot 7. Execution stays on an account the agent controls. Auto trade is LOCKED.",
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
          FAQ · {TAB_OWL} · {TAB_CALLING_BOTS}
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-fg sm:text-3xl" title={TAB_HOVER_OWL}>
          {OWL_HEADLINE}
        </h1>
        <p className="mt-1 text-sm text-muted">
          {TAB_OWL} ({SEO_TAB_OWL}) · {TAB_OWL_ALIAS} ({SEO_TAB_OWL_ALIAS}) · Grok · Claude · GPT · {TAB_CALLING_BOTS} ({SEO_TAB_CALLING_BOTS})
        </p>

        <figure className="mt-5 overflow-hidden rounded-md border border-rule bg-bg">
          <SeoImage src={IMG} desc="AI AG3NTS (AI AGENTS) jeweled owl portrait — W1S3 0WL (Wise Owl) — wise investment decisions theoretically optimized by AI agents: Grok, Claude, GPT and Bot 7 combined for bitcoin accumulation analysis" width={1024} height={1024} className="mx-auto h-auto w-full max-w-xl" />
          <figcaption className="border-t border-rule px-3 py-2 text-xs leading-relaxed text-muted">
            The owl is patience with many eyes. Tape, models, and agents look at the same bitcoin. Wisdom
            is combining them without rushing a clip.
          </figcaption>
        </figure>

        <p className="mt-5 text-sm leading-relaxed text-muted">
          Education only. Not financial advice. Seek a licensed professional. {LABS_NAME} is a proof of
          concept — not LIVE. {APP_NAME} never places Coinbase orders and never holds keys.
        </p>

        <Panel kicker="Wisdom" title="A wise decision is slow on purpose" className="mt-4" kickerClass="text-oss">
          <p className="text-sm leading-relaxed text-muted">
            Chasing the last tick is not analysis. A wise bitcoin decision waits for orthogonal
            confirmation: RSI vs its tape average, fear vs greed, walls, funding, ETF flow, then a Bot 7
            stance of <span className="call-accumulate">ACCUMULATE</span> or BUY — not a headline. In
            theory an AI agent can apply that filter every poll. Humans forget. Models drift. The tape
            does not. Combining them is how a mandate stays current without becoming a day-trade.
          </p>
        </Panel>

        <Panel kicker="Combine" title="Bot 7 + Grok + Claude + GPT" className="mt-3" kickerClass="text-oss">
          <p className="text-sm leading-relaxed text-muted">
            Each force sees a different slice. Together they are a committee, not a hive-mind average.
          </p>
          <ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted">
            <li>
              <span className="text-fg">Bot 7.</span> Live public tape. Conviction + stance + clip +
              dry-run CLI. No LLM in the call. This is the clock.
            </li>
            <li>
              <span className="text-fg">Grok.</span> {TAB_COMPUTE} ({SEO_TAB_COMPUTE}) — Ask Grok on
              your xAI key after X login. Strategy question against the current Bot 7 JSON. Operator
              SuperGrok is separate.
            </li>
            <li>
              <span className="text-fg">Claude.</span> MCP tools at{" "}
              <span className="font-mono text-xs">/api/agent/claude</span> and{" "}
              <span className="font-mono text-xs">POST /api/agent/mcp</span>. Long-context read of
              thesis + gates. Still read-only here.
            </li>
            <li>
              <span className="text-fg">GPT.</span> Actions via{" "}
              <span className="font-mono text-xs">/.well-known/ai-plugin.json</span>. Same Bot 7 call.
              Same 300s politeness.
            </li>
          </ul>
        </Panel>

        <Panel kicker="Theory" title="How the committee would stay current" className="mt-3" kickerClass="text-oss">
          <ol className="list-decimal space-y-2 pl-5 text-sm leading-relaxed text-muted">
            <li>Poll Bot 7. If stance is HOLD / WAIT / TRIM, all models stand down.</li>
            <li>
              If <span className="call-medium">MEDIUM</span>{" "}
              <span className="call-accumulate">ACCUMULATE</span> (or HIGH BUY), each agent writes a
              one-pass note: confirm, fade, or size-down. They do not vote to short.
            </li>
            <li>
              Size to declared NAV. Dry-run Coinbase for Agents on the account that agent controls.
            </li>
            <li>
              Re-read on the next 300s tick. Wisdom is the loop, not a single candle.
            </li>
          </ol>
        </Panel>

        <Panel kicker="Locked" title="What this host will not do" className="mt-3" kickerClass="text-oss">
          <p className="text-sm leading-relaxed text-muted">
            Combine-forces analysis is a read. Execution is not on s1r1us.ai. Auto trade is LOCKED.
            Source and vault stay closed. Optional cup of C0FF33 assists the long programming days and
            unlocks nothing extra.
          </p>
        </Panel>

        <p className="mt-6 font-mono text-xs text-oss">
          <Link to="/faq" hash="wise-owl" className="hover:underline" title={TAB_HOVER_OWL}>
            FAQ
          </Link>
          <span className="px-2">|</span>
          <Link to="/agent" className="hover:underline">
            {TAB_AGENT}
          </Link>
          <span className="px-2">|</span>
          <Link to="/compute" className="hover:underline">
            {TAB_COMPUTE}
          </Link>
          <span className="px-2">|</span>
          <Link to="/b3ars" className="hover:underline">
            {TAB_BEARS}
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
