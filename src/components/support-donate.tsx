import { useState } from "react";
import { Panel } from "@/components/shell";
import {
  SUPPORT_BLURB,
  SUPPORT_BTC,
  SUPPORT_BTC_EXPLORER,
  SUPPORT_USDC,
  SUPPORT_USDC_EXPLORER,
} from "@/lib/desk/support";

async function copyText(value: string) {
  try {
    await navigator.clipboard.writeText(value);
    return true;
  } catch {
    return false;
  }
}

function AddrRow({
  label,
  value,
  href,
}: {
  label: string;
  value: string;
  href: string;
}) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="mt-3 rounded-md border border-rule p-3">
      <p className="font-mono text-[11px] tracking-[0.12em] text-muted uppercase">{label}</p>
      <p className="mt-1 break-all font-mono text-sm text-fg">{value}</p>
      <div className="mt-2 flex flex-wrap gap-2">
        <button
          type="button"
          className="inline-flex h-10 min-h-10 items-center rounded-md border border-rule px-3 text-sm hover:bg-fg/6"
          onClick={() => {
            void copyText(value).then((ok) => {
              if (!ok) return;
              setCopied(true);
              window.setTimeout(() => setCopied(false), 1600);
            });
          }}
        >
          {copied ? "Copied" : "Copy"}
        </button>
        <a
          className="inline-flex h-10 min-h-10 items-center rounded-md border border-rule px-3 text-sm hover:bg-fg/6"
          href={href}
          target="_blank"
          rel="noreferrer"
        >
          Explorer
        </a>
      </div>
    </div>
  );
}

export function SupportDonate() {
  return (
    <Panel className="mt-4" kicker="Support" title="Hosting & app fees" kickerClass="text-oss">
      <p className="text-sm leading-relaxed text-muted">{SUPPORT_BLURB}</p>
      <AddrRow label="Bitcoin (BTC)" value={SUPPORT_BTC} href={SUPPORT_BTC_EXPLORER} />
      <AddrRow
        label="USDC · Ethereum ERC-20"
        value={SUPPORT_USDC}
        href={SUPPORT_USDC_EXPLORER}
      />
    </Panel>
  );
}
