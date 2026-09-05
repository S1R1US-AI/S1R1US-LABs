import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Copy } from "lucide-react";
import { CallWords } from "@/components/helios-card";
import { SeoCopy } from "@/components/seo-copy";
import { Button } from "@/components/ui/button";
import { Panel, Shell } from "@/components/shell";
import {
  AGENT_FEED_PATH,
  AGENT_INDEX_PATH,
  AGENT_PING_PATH,
  COINBASE_AGENTS_DOCS,
  COINBASE_AGENTS_MCP,
  type AgentFeed,
} from "@/lib/desk/agent-feed";
import { APP_NAME, BOT7_NAME, SEO_CANONICAL, TAB_DESK } from "@/lib/brand";
import { STARTING_CASH } from "@/lib/desk/store";

const ORIGIN = SEO_CANONICAL.replace(/\/$/, "");
const FEED_URL = `${ORIGIN}${AGENT_FEED_PATH}`;

export function AgentFeedPage() {
  const [feed, setFeed] = useState<AgentFeed | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [pong, setPong] = useState<string | null>(null);

  useEffect(() => {
    let live = true;
    fetch(AGENT_FEED_PATH, { headers: { accept: "application/json" } })
      .then(async (r) => {
        const data = (await r.json()) as AgentFeed & { error?: string };
        if (!live) return;
        if (!r.ok || !("ok" in data) || data.ok !== true) {
          setErr(data.error ?? "Feed unavailable");
          return;
        }
        setFeed(data);
      })
      .catch(() => {
        if (live) setErr("Feed unavailable");
      });
    return () => {
      live = false;
    };
  }, []);

  async function copy(label: string, text: string) {
    await navigator.clipboard.writeText(text);
    setCopied(label);
    window.setTimeout(() => setCopied(null), 1400);
  }

  return (
    <Shell>
      <SeoCopy />
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <p className="font-mono text-xs tracking-[0.12em] text-oss uppercase">Agent feed</p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-medium">{APP_NAME}</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Proof of concept — not LIVE. Read-only {BOT7_NAME} call for other AI agents. Conviction,
          stance, clip, and tape. This host never places Coinbase orders and never holds your keys.
          Education only — not financial advice.
        </p>

        <Panel className="mt-6" kicker="PoC" title="Not LIVE" kickerClass="text-sell" titleClass="text-sell">
          <p className="text-sm leading-relaxed text-muted">
            Agents may ping and read. They cannot trade here. Connection test is flagged on the daily
            morning report.{" "}
            <Link to="/faq" hash="calling-all-bots" className="text-sell hover:underline">
              Call1ng All B0Ts FAQ
            </Link>
            .
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button
              onClick={() => {
                void fetch(AGENT_PING_PATH)
                  .then((r) => r.json())
                  .then((d: { pong?: boolean; message?: string }) => {
                    setPong(d.pong ? d.message ?? "pong" : "ping failed");
                  })
                  .catch(() => setPong("ping failed"));
              }}
              aria-label="Test agent connection"
            >
              Test connection
            </Button>
            <a
              href={AGENT_PING_PATH}
              className="inline-flex h-10 min-h-10 items-center rounded-md border border-rule bg-surface px-3 text-sm font-medium hover:bg-fg/6"
            >
              GET ping
            </a>
          </div>
          {pong ? <p className="mt-2 font-mono text-xs text-tab">{pong}</p> : null}
        </Panel>

        <Panel className="mt-6" kicker="Bot 7" title="Live call" kickerClass="text-oss">
          {err ? <p className="text-sm text-down">{err}</p> : null}
          {feed ? (
            <>
              <CallWords
                call={{ conviction: feed.call.conviction, stance: feed.call.stance }}
                className="text-2xl font-semibold tracking-tight"
              />
              <p className="mt-2 font-mono text-xs text-muted">
                clip ${feed.call.clipUsd.toLocaleString("en-US")} · nav ${feed.navUsd.toLocaleString("en-US")} ·{" "}
                {feed.tape.btcUsd != null
                  ? `BTC ${feed.tape.btcUsd.toLocaleString("en-US", { maximumFractionDigits: 0 })}`
                  : "BTC —"}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted">{feed.disclaimer}</p>
            </>
          ) : !err ? (
            <p className="text-sm text-muted">Pulling Bot 7…</p>
          ) : null}
        </Panel>

        <Panel className="mt-4" kicker="GET" title="JSON feed" kickerClass="text-oss">
          <p className="font-mono text-xs break-all text-tab">{FEED_URL}</p>
          <p className="mt-2 text-sm text-muted">
            Optional <span className="font-mono text-fg">?nav={STARTING_CASH}</span> sizes the clip to your
            USD book. It does not trade.
          </p>
          <pre className="mt-3 overflow-x-auto rounded-md border border-rule bg-black px-4 py-3 font-mono text-[12px] leading-relaxed text-muted">
            {`curl -s ${FEED_URL}`}
          </pre>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button onClick={() => void copy("url", FEED_URL)} aria-label="Copy feed URL">
              <Copy className="size-4" />
              {copied === "url" ? "Copied" : "Copy URL"}
            </Button>
            <a
              href={AGENT_FEED_PATH}
              className="inline-flex h-10 min-h-10 items-center rounded-md border border-rule bg-surface px-3 text-sm font-medium hover:bg-fg/6"
            >
              Open JSON
            </a>
            <a
              href={AGENT_INDEX_PATH}
              className="inline-flex h-10 min-h-10 items-center rounded-md border border-rule bg-surface px-3 text-sm font-medium hover:bg-fg/6"
            >
              Catalog
            </a>
          </div>
        </Panel>

        <Panel className="mt-4" kicker="Coinbase" title="You run the preview" kickerClass="text-oss">
          <p className="text-sm leading-relaxed text-muted">
            Signal only. Run this on <span className="text-fg">your</span> Coinbase for Agents. Keys
            stay on your machine. Never paste a secret here.
          </p>
          {feed ? (
            <>
              <pre className="mt-3 overflow-x-auto rounded-md border border-rule bg-black px-4 py-3 font-mono text-[12px] leading-relaxed text-high">
                {feed.coinbase.cli}
              </pre>
              <Button className="mt-3" onClick={() => void copy("cli", feed.coinbase.cli)} aria-label="Copy preview CLI">
                <Copy className="size-4" />
                {copied === "cli" ? "Copied" : "Copy preview CLI"}
              </Button>
            </>
          ) : null}
          <ul className="mt-4 space-y-2 text-sm text-muted">
            <li>
              MCP:{" "}
              <a href={COINBASE_AGENTS_MCP} className="text-tab hover:underline" target="_blank" rel="noreferrer">
                {COINBASE_AGENTS_MCP}
              </a>
            </li>
            <li>
              Docs:{" "}
              <a href={COINBASE_AGENTS_DOCS} className="text-tab hover:underline" target="_blank" rel="noreferrer">
                {COINBASE_AGENTS_DOCS}
              </a>
            </li>
            <li>Always <span className="font-mono text-fg">--dry-run</span> first. This site never sends <span className="font-mono">orders create</span>.</li>
          </ul>
        </Panel>

        <p className="mt-6 font-mono text-xs text-oss">
          <Link to="/" className="hover:underline">
            {TAB_DESK}
          </Link>
          <span className="px-2">|</span>
          <Link to="/faq" className="hover:underline">
            FAQ
          </Link>
        </p>
      </main>
    </Shell>
  );
}
