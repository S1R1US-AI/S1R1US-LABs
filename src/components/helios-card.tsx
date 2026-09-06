import { useState } from "react";
import { Copy, LoaderCircle, Paperclip, ScanSearch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmClip } from "@/components/confirm-clip";
import { isOutgoingCli, YubiApprove } from "@/components/yubi-approve";
import { Panel } from "@/components/shell";
import { STARTING_CASH } from "@/lib/desk/store";
import type { HeliosCall, PaperFill, Stance } from "@/lib/desk/types";
import { cn, BTC_TONE, USD_TONE, fgTone, rsiTone } from "@/lib/utils";
import { APP_CALLS } from "@/lib/brand";

function gateShort(label: string) {
  if (/orthogonal/i.test(label)) return "two-lane";
  if (/Fear & Greed/i.test(label)) return "F&G";
  if (/Sell wall/i.test(label)) return "sell wall";
  if (/RSI/i.test(label)) return "RSI";
  if (/Long\/short/i.test(label)) return "L/S";
  if (/Funding/i.test(label)) return "funding";
  if (/Kimchi/i.test(label)) return "kimchi";
  if (/CNY/i.test(label)) return "CNY OTC";
  if (/^EM /i.test(label)) return "EM";
  if (/ETF/i.test(label)) return "ETF melt";
  if (/gold/i.test(label)) return "BTC/gold";
  if (/rotat/i.test(label)) return "rotation";
  if (/Mempool|fee spike/i.test(label)) return "fees";
  if (/dry-run|Preview/i.test(label)) return "dry-run";
  if (/Never sell/i.test(label)) return "never-sell";
  return label.split("(")[0]!.trim().slice(0, 18);
}

export function money(n: number, d = 0) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: d });
}

export function stanceClass(s: Stance | string) {
  if (s === "BUY") return "text-high";
  if (s === "ACCUMULATE") return "call-accumulate";
  if (s === "HOLD" || s === "TRIM") return "call-hold";
  if (s === "WAIT") return "call-wait";
  return "text-muted";
}

/** Bot-7 / GM: green only on an announced BUY/ACCUMULATE. HOLD/TRIM stay red. WAIT purple. */
export function callStanceClass(s: string) {
  if (s === "BUY") return "text-high";
  if (s === "ACCUMULATE") return "call-accumulate";
  if (s === "HOLD" || s === "TRIM" || s === "SHORT") return "call-hold";
  if (s === "WAIT") return "call-wait";
  if (s === "HEDGE") return "text-tbill";
  return "text-muted";
}

export function convictionClass(conviction: string, stance?: string) {
  if (conviction === "LOW") return "call-hold";
  if (conviction === "MEDIUM") return "call-medium";
  if (conviction === "HIGH" && stance === "ACCUMULATE") return "call-high-accum";
  if (conviction === "HIGH" && stance === "BUY") return "text-high";
  return "text-muted";
}

/** Kicker / CALLS title: green only on an active buy/accumulate. MEDIUM = blue. HOLD = red. */
export function bannerTone(call: { stance: string; conviction: string } | null | undefined) {
  if (!call) return "text-high";
  if (call.conviction === "LOW") return "text-sell";
  if (call.stance === "BUY" || call.stance === "ACCUMULATE") return "text-high";
  if (call.stance === "WAIT") return "call-wait";
  if (call.stance === "HOLD" || call.stance === "TRIM" || call.stance === "SHORT") return "call-hold";
  if (call.conviction === "MEDIUM") return "call-medium";
  return "text-muted";
}

export function callTone(call: Pick<HeliosCall, "stance" | "conviction"> | { stance: string; conviction: string }) {
  if (call.conviction === "MEDIUM" && (call.stance === "HOLD" || call.stance === "TRIM")) return "text-tab";
  return callStanceClass(call.stance);
}

export function callHeadline(call: Pick<HeliosCall, "stance" | "conviction">) {
  if (call.stance === "TRIM") return `${call.conviction} CONVICTION SELL`;
  if (call.conviction === "HIGH" && call.stance === "BUY") return "HIGH CONVICTION BUY";
  if (call.conviction === "HIGH" && call.stance === "ACCUMULATE") return "HIGH CONVICTION ACCUMULATE";
  if (call.conviction === "MEDIUM") return `MEDIUM CONVICTION ${call.stance}`;
  return `${call.conviction} CONVICTION ${call.stance}`;
}

export function CallWords({
  call,
  className,
}: {
  call: { conviction: string; stance: string };
  className?: string;
}) {
  const stanceWord = call.stance === "TRIM" ? "SELL" : call.stance;
  return (
    <p className={cn("min-w-0 uppercase", className)}>
      <span className={convictionClass(call.conviction, call.stance)}>{call.conviction} CONVICTION</span>
      {" "}
      <span className={callStanceClass(call.stance)}>{stanceWord}</span>
    </p>
  );
}

const CALL_INK: Record<string, string> = {
  MEDIUM: "call-medium",
  ACCUMULATE: "call-accumulate",
  BUY: "text-high",
  HIGH: "text-high",
  LOW: "call-hold",
  HOLD: "call-hold",
  TRIM: "call-hold",
  SELL: "call-hold",
  WAIT: "call-wait",
};

/** Color MEDIUM (blue) and ACCUMULATE (green) inside a free-text scan line. */
export function CallInk({ text }: { text: string }) {
  const parts = text.split(/(\bMEDIUM\b|\bACCUMULATE\b|\bHIGH\b|\bLOW\b|\bBUY\b|\bHOLD\b|\bTRIM\b|\bSELL\b|\bWAIT\b)/g);
  return (
    <>
      {parts.map((part, i) => {
        const cls = CALL_INK[part];
        return cls ? (
          <span key={i} className={cls}>
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        );
      })}
    </>
  );
}

export type CallTape = {
  price: number | null;
  rsi: number | null;
  rsiAvg?: number | null;
  fg: number | null;
  fgLabel?: string | null;
  fetchedAt?: string | null;
};

export function HeliosCard({
  call,
  grok,
  grokErr,
  asking,
  copied,
  canFill,
  onAsk,
  onCopy,
  onFill,
  kicker = "Bot 7",
  title = APP_CALLS,
  canAct = true,
  canAsk,
  tape,
}: {
  call: HeliosCall | null;
  grok: string | null;
  grokErr: string | null;
  asking: boolean;
  copied: boolean;
  canFill: boolean;
  onAsk: () => void;
  onCopy: () => void;
  onFill: () => void;
  kicker?: string;
  title?: string;
  canAct?: boolean;
  canAsk?: boolean;
  tape?: CallTape | null;
}) {
  const askOk = canAsk ?? canAct;
  const [confirm, setConfirm] = useState(false);
  const [copyAsk, setCopyAsk] = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const passed = call ? call.checks.filter((c) => c.pass).length : 0;
  return (
    <Panel kicker={kicker} title={title} kickerClass={bannerTone(call)} titleClass={bannerTone(call)}>
      {call ? (
        <>
          <div className="flex flex-wrap items-baseline gap-3">
            <CallWords call={call} className="min-w-0 break-words text-2xl font-semibold tracking-tight sm:text-3xl" />
            <p className={cn("font-mono text-xs", USD_TONE)}>clip {money(call.clipUsd, 0)}</p>
          </div>
          {tape && canAct ? (
            <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-4">
              <div>
                <dt className="text-[13px] tracking-[0.14em] text-muted uppercase">BTC-USD</dt>
                <dd className={cn("mt-0.5 font-mono text-[17px] tabular-nums", USD_TONE)}>
                  {tape.price != null ? money(tape.price, 0) : "—"}
                </dd>
              </div>
              <div>
                <dt className={cn("text-[13px] tracking-[0.14em] uppercase", rsiTone(tape.rsi, tape.rsiAvg ?? null) || "text-muted")}>
                  RSI-14
                </dt>
                <dd className={cn("mt-0.5 font-mono text-[17px] tabular-nums", rsiTone(tape.rsi, tape.rsiAvg ?? null))}>
                  {tape.rsi != null ? tape.rsi.toFixed(1) : "—"}
                </dd>
              </div>
              <div>
                <dt className={cn("text-[13px] tracking-[0.14em] uppercase", fgTone(tape.fg, tape.fgLabel) || "text-muted")}>
                  Fear & Greed
                </dt>
                <dd className={cn("mt-0.5 font-mono text-[17px] tabular-nums", fgTone(tape.fg, tape.fgLabel))}>
                  {tape.fg != null ? String(tape.fg) : "—"}
                </dd>
              </div>
              <div>
                <dt
                  className="text-[13px] tracking-[0.14em] uppercase text-medium"
                  title="How many of Bot 7's add-bitcoin conditions are true. Green = accumulate or buy. Red = wait."
                >
                  Add-BTC
                </dt>
                <dd
                  className={
                    call.stance === "BUY" || call.stance === "ACCUMULATE"
                      ? "mt-0.5 font-mono text-[17px] tabular-nums text-high"
                      : "mt-0.5 font-mono text-[17px] tabular-nums text-down"
                  }
                >
                  {passed}/{call.checks.length}
                </dd>
              </div>
            </dl>
          ) : tape ? (
            <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-3">
              <div>
                <dt className="text-[13px] tracking-[0.14em] text-muted uppercase">BTC-USD</dt>
                <dd className={cn("mt-0.5 font-mono text-[17px] tabular-nums", USD_TONE)}>
                  {tape.price != null ? money(tape.price, 0) : "—"}
                </dd>
              </div>
              <div>
                <dt className={cn("text-[13px] tracking-[0.14em] uppercase", rsiTone(tape.rsi, tape.rsiAvg ?? null) || "text-muted")}>
                  RSI-14
                </dt>
                <dd className={cn("mt-0.5 font-mono text-[17px] tabular-nums", rsiTone(tape.rsi, tape.rsiAvg ?? null))}>
                  {tape.rsi != null ? tape.rsi.toFixed(1) : "—"}
                </dd>
              </div>
              <div>
                <dt className={cn("text-[13px] tracking-[0.14em] uppercase", fgTone(tape.fg, tape.fgLabel) || "text-muted")}>
                  Fear & Greed
                </dt>
                <dd className={cn("mt-0.5 font-mono text-[17px] tabular-nums", fgTone(tape.fg, tape.fgLabel))}>
                  {tape.fg != null ? String(tape.fg) : "—"}
                </dd>
              </div>
            </dl>
          ) : null}
          <p className="mt-3 text-sm leading-relaxed text-muted">{call.brief}</p>
          {canAct ? (
            <>
          <button
            type="button"
            onClick={() => setSummaryOpen((o) => !o)}
            aria-expanded={summaryOpen}
            className="mt-3 inline-flex min-h-10 items-center gap-2 text-sm font-medium expand-ctl hover:underline"
          >
            <Paperclip className="size-4 shrink-0" aria-hidden />
            Overseer
          </button>
          {summaryOpen ? (
            <div className="mt-2 space-y-3">
              <p className="text-sm leading-relaxed text-muted">{call.thesis}</p>
              <ul className="space-y-1.5">
                {[...call.checks]
                  .sort((a, b) => Number(a.pass) - Number(b.pass))
                  .map((c) => (
                  <li key={c.label} className="flex gap-2 font-mono text-xs">
                    <span className={c.pass ? "text-up" : "text-down"}>{c.pass ? "PASS" : "FAIL"}</span>
                    <span className={c.pass ? "text-muted" : "text-sell"}>{c.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="mt-2 text-xs text-muted">Admin — expand for proprietary Bot 7 overseer.</p>
          )}
            </>
          ) : null}
          <pre className="mt-4 overflow-x-auto rounded-md bg-bg px-3 py-2 font-mono text-[11px] text-accent">
            {call.cli}
          </pre>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button variant="primary" onClick={() => setConfirm(true)} disabled={!canAct || !canFill}>
              {call.stance === "TRIM" ? "Paper take-profit" : call.clipUsd > 0 ? "Paper buy clip" : "No clip this cycle"}
            </Button>
            <Button
              disabled={!canAct}
              onClick={() => {
                if (call && isOutgoingCli(call.cli)) setCopyAsk(true);
                else onCopy();
              }}
            >
              <Copy className="size-4" />
              {copied ? "Copied" : "Copy CLI"}
            </Button>
            <Button onClick={onAsk} disabled={!askOk || asking}>
              {asking ? <LoaderCircle className="size-4 animate-spin" /> : <ScanSearch className="size-4" />}
              Ask Grok
            </Button>
          </div>
          {canAct ? null : (
            <p className="mt-3 text-sm text-muted">
              Sign in to paper-fill or copy CLI.{" "}
              {askOk ? "Ask Grok is on." : (
                <>
                  Ask Grok:{" "}
                  <a href="/compute" className="text-tab hover:underline">
                    BYO C0MPUT3
                  </a>
                  .
                </>
              )}
            </p>
          )}
          {grokErr ? <p className="mt-3 text-sm text-down">{grokErr}</p> : null}
          {grok ? (
            <p className="mt-3 whitespace-pre-wrap border-t border-rule pt-3 text-sm leading-relaxed">
              {grok}
            </p>
          ) : null}
          {confirm ? (
            <ConfirmClip
              call={call}
              onCancel={() => setConfirm(false)}
              onConfirm={() => {
                setConfirm(false);
                onFill();
              }}
            />
          ) : null}
          {copyAsk && call ? (
            <YubiApprove
              title="Approve outgoing CLI"
              detail="Copying a Coinbase BTC/USDC trade or transfer command requires the admin YubiKey. This does not place a live order."
              action={`cli:helios:${call.stance}:${Math.round(call.clipUsd)}`}
              onCancel={() => setCopyAsk(false)}
              onDone={() => {
                setCopyAsk(false);
                onCopy();
              }}
            />
          ) : null}
        </>
      ) : (
        <p className="flex items-center gap-2 text-sm text-muted">
          <LoaderCircle className="size-4 animate-spin" /> Running first cycle…
        </p>
      )}
    </Panel>
  );
}

export function PaperCard({
  mounted,
  cash,
  btc,
  profitBtc = 0,
  px,
  fills,
  onReset,
}: {
  mounted: boolean;
  cash: number;
  btc: number;
  profitBtc?: number;
  px: number | null;
  fills: PaperFill[];
  onReset?: () => void;
}) {
  const nav = cash + (btc + profitBtc) * (px ?? 0);
  return (
    <Panel kicker="Paper Coinbase" title="Accumulator book">
      <div className="grid grid-cols-2 gap-3 font-mono text-sm sm:grid-cols-4">
        <div>
          <p className="text-[11px] text-muted">NAV</p>
          <p className="mt-1 tabular-nums">{mounted ? money(nav, 0) : "—"}</p>
        </div>
        <div>
          <p className={`text-[11px] ${USD_TONE}`}>USD</p>
          <p className={`mt-1 tabular-nums ${USD_TONE}`}>{mounted ? money(cash, 0) : "—"}</p>
        </div>
        <div>
          <p className={`text-[11px] ${BTC_TONE}`}>Hot BTC</p>
          <p className={`mt-1 tabular-nums ${BTC_TONE}`}>{mounted ? btc.toFixed(6) : "—"}</p>
        </div>
        <div>
          <p className={`text-[11px] ${BTC_TONE}`}>Profit BTC</p>
          <p className={`mt-1 tabular-nums ${BTC_TONE}`}>{mounted ? profitBtc.toFixed(6) : "—"}</p>
        </div>
      </div>
      <p className="mt-3 text-xs text-muted">
        Starts at {money(STARTING_CASH, 0)} paper. TRIM take-profit is recorded here; the destination
        wallet lives in Admin (encrypted). Not a live send.
      </p>
      <ul className="mt-3 max-h-40 space-y-1 overflow-auto font-mono text-[11px]">
        {mounted && fills.length ? (
          fills.slice(0, 8).map((f) => (
            <li key={f.id} className="flex justify-between gap-2">
              <span className={f.side === "BUY" ? "text-high" : "text-sell"}>
                {f.side} <span className={BTC_TONE}>{f.btc.toFixed(5)}</span>
              </span>
              <span className={USD_TONE}>{money(f.usd, 0)}</span>
            </li>
          ))
        ) : (
          <li className="text-muted">No clips yet.</li>
        )}
      </ul>
      <Button className="mt-3" onClick={onReset} disabled={!onReset}>
        Reset paper
      </Button>
    </Panel>
  );
}
