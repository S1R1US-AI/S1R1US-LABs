import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { money } from "@/components/helios-card";
import { fetchDonate, type DonateProgress, DONATE_ASK, DONATE_GOAL_USD } from "@/lib/launch/donate";
import { BTC_TONE, USD_TONE, cn } from "@/lib/utils";

export function DonateTrack({ compact }: { compact?: boolean }) {
  const [d, setD] = useState<DonateProgress | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    void fetchDonate()
      .then(setD)
      .catch(() => setD(null));
    const id = window.setInterval(() => {
      void fetchDonate()
        .then(setD)
        .catch(() => undefined);
    }, 60_000);
    return () => window.clearInterval(id);
  }, []);

  async function copy(label: string, text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(label);
      window.setTimeout(() => setCopied(null), 1600);
    } catch {
      setCopied(null);
    }
  }

  const raised = d?.raisedUsd ?? 0;
  const pct = d?.pct ?? 0;
  const usdcReady = Boolean(d?.usdcAddress);

  return (
    <section className={cn("rounded-lg border border-rule bg-surface p-4 sm:p-5", !compact && "mt-8")}>
      <p className="font-mono text-xs tracking-[0.14em] text-muted uppercase">Desk gifts</p>
      <h2 className="mt-1 text-lg font-semibold tracking-tight text-high sm:text-xl">
        7-B0T DESK GIFT GOAL {money(DONATE_GOAL_USD, 0)}
      </h2>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-fg">{DONATE_ASK}</p>

      <div className="mt-4">
        <div className="flex items-baseline justify-between gap-3 font-mono text-sm">
          <span className={USD_TONE}>{money(raised, 0)} raised</span>
          <span className="text-muted">{pct.toFixed(1)}% of {money(DONATE_GOAL_USD, 0)}</span>
        </div>
        <div className="mt-2 h-3 overflow-hidden rounded-sm bg-rule">
          <div
            className="h-full bg-[#ffd24a] transition-[width]"
            style={{ width: `${Math.max(pct > 0 ? 2 : 0, pct)}%` }}
          />
        </div>
        <p className="mt-2 font-mono text-xs text-muted">
          BTC {d?.btc != null ? `${d.btc.toFixed(6)} · ${d.btcUsd != null ? money(d.btcUsd, 0) : "—"}` : "—"}
          {" · "}
          USDC {d?.usdc != null ? money(d.usdc, 0) : usdcReady ? "0" : "address not published"}
        </p>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Addr
          kicker="Bitcoin"
          kickerClass={BTC_TONE}
          value={d?.btcAddress ?? ""}
          hint="On-chain BTC · P2SH"
          explorer={d?.btcExplorer}
          copied={copied === "btc"}
          onCopy={() => d && void copy("btc", d.btcAddress)}
        />
        <Addr
          kicker="USDC"
          kickerClass={USD_TONE}
          value={usdcReady ? d!.usdcAddress : "Save Coinbase USDC receive in Admin → Wallet"}
          hint={usdcReady ? `${d?.usdcNetwork} · native USDC only` : "No 0x published yet — BTC donations are live"}
          explorer={usdcReady ? d?.usdcExplorer : undefined}
          copied={copied === "usdc"}
          onCopy={usdcReady && d ? () => void copy("usdc", d.usdcAddress) : undefined}
          disabled={!usdcReady}
        />
      </div>
      <p className="mt-4 text-xs leading-relaxed text-muted">
        Send only BTC to the Bitcoin address and only native USDC to the 0x (Base preferred). Do not send
        other tokens, wrapped BTC, or seeds. Gifts are not s1r1us and do not buy the trading book.
        {d?.source ? ` Balance: ${d.source}.` : ""}
      </p>
    </section>
  );
}

function Addr({
  kicker,
  kickerClass,
  value,
  hint,
  explorer,
  copied,
  onCopy,
  disabled,
}: {
  kicker: string;
  kickerClass?: string;
  value: string;
  hint: string;
  explorer?: string;
  copied: boolean;
  onCopy?: () => void;
  disabled?: boolean;
}) {
  return (
    <div>
      <p className={cn("font-mono text-[11px] tracking-[0.12em] uppercase", kickerClass)}>{kicker}</p>
      <p className="mt-1 break-all font-mono text-xs text-fg">{value}</p>
      <p className="mt-1 text-[11px] text-muted">{hint}</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {onCopy ? (
          <Button type="button" size="sm" variant="outline" className="h-9 px-3 text-xs" onClick={onCopy} disabled={disabled}>
            {copied ? "Copied" : "Copy"}
          </Button>
        ) : null}
        {explorer ? (
          <a
            href={explorer}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-9 items-center rounded-md border border-rule px-3 text-xs hover:bg-fg/6"
          >
            Explorer
          </a>
        ) : null}
      </div>
    </div>
  );
}
