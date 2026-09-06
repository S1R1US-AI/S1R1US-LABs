import { useState } from "react";
import { Panel } from "@/components/shell";
import {
  HIVE_NO_PROFIT_SHARE,
  HIVE_RESOURCE_COPY,
  hiveResourcePublic,
} from "@/lib/desk/hive-resource";
import { TAB_COFFEE, TAB_FEED_NOW } from "@/lib/brand";

async function copyText(value: string) {
  try {
    await navigator.clipboard.writeText(value);
    return true;
  } catch {
    return false;
  }
}

export function HiveResourcePanel({ compact = false }: { compact?: boolean }) {
  const res = hiveResourcePublic();
  const [copied, setCopied] = useState<string | null>(null);

  async function copy(id: string, value: string) {
    const ok = await copyText(value);
    if (!ok) return;
    setCopied(id);
    window.setTimeout(() => setCopied(null), 1600);
  }

  return (
    <Panel
      className="mt-4"
      kicker="Resource payment"
      title="HTTP / hosting — never a hive profit share"
      kickerClass="text-high"
      titleClass="text-high"
    >
      <p className="text-sm leading-relaxed text-muted">{HIVE_RESOURCE_COPY}</p>
      <p className="mt-2 text-sm leading-relaxed text-fg">{HIVE_NO_PROFIT_SHARE}</p>
      <p className="mt-2 text-xs text-muted">{res.receipt} Optional {TAB_COFFEE} ${res.coffeeUsd.toFixed(2)} or HTTP SaaS $9 / $29. Hive seat later. Agent sends. Host never skims.</p>
      <dl className="mt-3 grid grid-cols-2 gap-2 text-xs sm:grid-cols-3">
        {res.http.plans.map((p) => (
          <div key={p.id} className="rounded-md border border-rule p-2">
            <dt className="text-muted uppercase tracking-[0.08em]">{p.id}</dt>
            <dd className="mt-1 font-mono text-fg">${p.usdMonth}/mo · {p.pollSec}s</dd>
            <dd className="mt-1 text-muted">{p.note}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-3 font-mono text-[11px] text-muted">{res.hiveSeat.note}</p>
      {!compact ? (
        <ul className="mt-3 space-y-2 font-mono text-xs text-muted">
          <li className="break-all">
            <span className="text-fg">BTC</span> {res.btc}
            <button
              type="button"
              className="ml-2 inline-flex h-10 min-h-10 items-center rounded-md border border-rule px-3 text-sm hover:bg-fg/6"
              onClick={() => void copy("btc", res.btc)}
            >
              {copied === "btc" ? "Copied" : "Copy"}
            </button>
            <a className="ml-2 text-oss hover:underline" href={res.explorers.btc} target="_blank" rel="noreferrer">
              Explorer
            </a>
          </li>
          <li className="break-all">
            <span className="text-fg">USDC</span> {res.usdc}
            <button
              type="button"
              className="ml-2 inline-flex h-10 min-h-10 items-center rounded-md border border-rule px-3 text-sm hover:bg-fg/6"
              onClick={() => void copy("usdc", res.usdc)}
            >
              {copied === "usdc" ? "Copied" : "Copy"}
            </button>
            <a className="ml-2 text-oss hover:underline" href={res.explorers.usdcEth} target="_blank" rel="noreferrer">
              Ethereum
            </a>
            <a className="ml-2 text-oss hover:underline" href={res.explorers.usdcBase} target="_blank" rel="noreferrer">
              Base
            </a>
          </li>
        </ul>
      ) : (
        <p className="mt-3 font-mono text-xs text-muted">
          {TAB_FEED_NOW} rails on /c0ff33 and GET /api/agent/fee · ping.resource
        </p>
      )}
      <p className="mt-3 text-xs leading-relaxed text-muted">{res.sendFrom}</p>
    </Panel>
  );
}
