import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Panel } from "@/components/shell";
import { AskGrokPanel } from "@/components/ask-grok-panel";
import { HiveResourcePanel } from "@/components/hive-resource-panel";
import {
  BYO_CONNECT_AUTO,
  BYO_CONNECT_DIALOGUE,
  BYO_CONNECT_HEADLINE,
  byoConnectPublic,
} from "@/lib/desk/byo-connect";

export function ByoConnectPanel({ compact = false }: { compact?: boolean }) {
  const info = byoConnectPublic();
  const [howOpen, setHowOpen] = useState(false);
  const welcomeJson = JSON.stringify(
    {
      hello: info.autoHow,
      auto: true,
      keysOnThisHost: false,
      vpn: false,
      extraRpc: false,
      steps: info.steps,
      competitions: info.competitions,
      resource: info.resourceCopy,
      never: info.never,
    },
    null,
    2,
  );

  useEffect(() => {
    /* session keys stay in AskGrokPanel — never written to this host. */
  }, []);

  return (
    <Panel
      id="byo-connect"
      className="mt-4"
      kicker="BYO C0MPUT3"
      title={BYO_CONNECT_HEADLINE}
      kickerClass="text-tab"
      titleClass="text-medium"
    >
      <p className="text-sm leading-relaxed text-muted">{BYO_CONNECT_AUTO}</p>
      <p className="mt-2 text-sm leading-relaxed text-fg">{BYO_CONNECT_DIALOGUE}</p>
      <ul className="mt-3 list-decimal space-y-1 pl-5 text-sm text-muted">
        {info.steps.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ul>
      <p className="mt-3 text-xs text-muted">
        FAQ{" "}
        <Link to="/faq" hash="byo-connect" className="text-oss hover:underline">
          #byo-connect
        </Link>
        {" · "}
        JSON{" "}
        <a href="/api/agent/connect" className="text-oss hover:underline">
          /api/agent/connect
        </a>
        {" · "}
        MCP byo_connect (read-only). This host never stores keys.
      </p>
      <button
        type="button"
        className="mt-3 inline-flex min-h-11 items-center text-sm font-semibold text-expand hover:underline"
        aria-expanded={howOpen}
        onClick={() => setHowOpen((v) => !v)}
      >
        {howOpen ? "collapse" : "expand"} agent JSON
      </button>
      {howOpen ? (
        <pre className="mt-2 overflow-x-auto whitespace-pre-wrap rounded-md border border-rule bg-paper p-3 font-mono text-[11px] leading-relaxed text-muted">
          {welcomeJson}
        </pre>
      ) : null}
      {!compact ? (
        <>
          <div className="mt-4">
            <AskGrokPanel kicker="Dialogue · xAI key (session only)" />
          </div>
          <HiveResourcePanel compact />
        </>
      ) : null}
    </Panel>
  );
}
