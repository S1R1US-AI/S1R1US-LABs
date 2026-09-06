import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Lock, Radio } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { BotBrief, DeskSnapshot, HeliosCall } from "@/lib/desk/types";
import { DEMO_AUTO, LAUNCH_LIVE_TRADES } from "@/lib/launch/build";
import { cn } from "@/lib/utils";
import { callStanceClass, money, stanceClass } from "@/components/helios-card";
import { WorkspaceTape } from "@/components/tape-charts";
import { GmRainbow } from "@/components/godzilla-mark";
import { AUTO_RUN_CASH, AUTO_RUN_LABEL } from "@/lib/desk/auto-run";
import { DEFAULT_GM_VARS, GM_NAME, gmCall } from "@/lib/desk/gm";

function isPurchase(stance: string | undefined) {
  if (!stance) return false;
  const u = stance.toUpperCase();
  return u === "BUY" || u.includes("ACCUMULATE");
}

function liveTapeTone(audit: { ok: number; fail: number } | null | undefined) {
  const ok = audit?.ok ?? 0;
  const fail = audit?.fail ?? 0;
  const total = ok + fail;
  if (total === 0 || ok === 0) return "live-tape-none";
  if (fail === 0) return "live-tape-all";
  if (ok > total / 2) return "live-tape-most";
  return "live-tape-half";
}

function convClass(c: string | undefined) {
  if (c === "MEDIUM") return "call-medium";
  if (c === "HIGH") return "text-high";
  return "text-sell";
}

function vsAvg(n: number | null | undefined, avg: number | null | undefined) {
  if (n == null || avg == null) return undefined;
  if (n > avg) return "rsi-above";
  if (n < avg) return "rsi-below";
  return "rsi-flat";
}

export function DeskWorkspace({
  snap,
  briefs,
  call,
  canAct,
  canFill,
  asking,
  copied,
  grok,
  grokErr,
  onAsk,
  onCopy,
  onFill,
}: {
  snap: DeskSnapshot | null;
  briefs: BotBrief[];
  call: HeliosCall | null;
  canAct: boolean;
  canFill: boolean;
  asking: boolean;
  copied: boolean;
  grok: string | null;
  grokErr: string | null;
  onAsk: () => void;
  onCopy: () => void;
  onFill: () => void;
}) {
  const [overseer, setOverseer] = useState(false);
  const [lockOpen, setLockOpen] = useState(false);
  const gm = useMemo(
    () =>
      snap
        ? gmCall(snap, AUTO_RUN_CASH, {
            pilot: "AUTO",
            risk: 2,
            manual: DEFAULT_GM_VARS,
            adminLive: false,
            dayHours: 1,
          })
        : null,
    [snap],
  );
  const px = snap?.btc.price ?? null;
  const chg = snap?.btc.changePct ?? null;
  const high = snap?.btc.high24h ?? null;
  const low = snap?.btc.low24h ?? null;
  const mid24 = high != null && low != null ? (high + low) / 2 : null;
  const vol = snap?.btc.volume24h ?? null;
  const volAvg = snap?.btc.volumeAvg24h ?? null;
  const up = chg != null && chg >= 0;
  const pxTone = vsAvg(px, mid24) ?? (up ? "rsi-above" : chg != null ? "rsi-below" : undefined);
  const tradeOn = LAUNCH_LIVE_TRADES;
  const demoOn = DEMO_AUTO && !tradeOn;

  return (
    <div className="min-w-0">
      <div className="mb-3 flex flex-wrap items-center gap-x-6 gap-y-2 rounded-md border border-rule bg-paper-raised px-5 py-3 text-[1.08rem] leading-snug text-muted">
        <span
          className={cn("inline-flex items-center gap-1.5 font-semibold", liveTapeTone(snap?.feedAudit))}
          title={
            snap?.feedAudit
              ? `Live tape · ${snap.feedAudit.ok} live · ${snap.feedAudit.fail} down`
              : "Live tape · waiting on sources"
          }
        >
          <Radio className="size-4" />
          Live tape
        </span>
        <span>
          <span className="coinbase-orange font-semibold">7-B0T</span>{" "}
          <strong className={cn("font-semibold", convClass(call?.conviction))}>{call?.conviction ?? "—"}</strong>{" "}
          <strong className={cn("font-semibold", stanceClass(call?.stance ?? "HOLD"))}>{call?.stance ?? "—"}</strong>
        </span>
        <span>
          <span className="legal-purple font-semibold">AI Agents</span>{" "}
          <strong className="text-sell">read-only</strong>
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="coinbase-orange font-semibold">B0T-7 AUTO</span>
          {demoOn ? <strong className="text-high">would-run</strong> : null}
          <Lock className={cn("size-4", tradeOn ? "text-high" : "text-sell")} fill="currentColor" strokeWidth={1.5} />
          <strong className={tradeOn ? "text-high" : "text-sell"}>{tradeOn ? "unlocked" : "Coinbase locked"}</strong>
        </span>
        <span className="inline-flex items-center gap-1.5">
          <GmRainbow text="GM M0D3 AUTO" className="font-semibold" />
          {demoOn ? <strong className="text-high">would-run</strong> : null}
          <Lock className={cn("size-4", tradeOn ? "text-high" : "text-sell")} fill="currentColor" strokeWidth={1.5} />
          <strong className={tradeOn ? "text-high" : "text-sell"}>{tradeOn ? "unlocked" : "Coinbase locked"}</strong>
        </span>
        <button
          type="button"
          aria-expanded={lockOpen}
          onClick={() => setLockOpen((v) => !v)}
          className={cn(
            "inline-flex items-center gap-1.5 font-bold tracking-[0.08em] uppercase",
            tradeOn ? "text-high" : "legal-purple",
          )}
        >
          <Lock className={cn("size-4", tradeOn ? "text-high" : "lock-deep")} fill="currentColor" strokeWidth={1.5} />
          LoCK3D STATUS
        </button>
        {lockOpen ? (
          <span className="w-full">
            When unlocked:{" "}
            <GmRainbow text="AI Bots execute BTC on their Coinbase Wallet — K3YS ARE NEVER STORED HERE !!" />
          </span>
        ) : null}
      </div>

      <div className="grid isolate rounded-md border border-rule carbon-fiber lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)_minmax(0,0.7fr)] lg:items-stretch">
        <section className="relative z-0 flex min-h-0 min-w-0 flex-col overflow-hidden border-b border-rule bg-surface p-3 lg:border-b-0 lg:border-r">
          <p className="coinbase-orange text-[10px] font-semibold tracking-[0.1em] uppercase">Bitcoin Current Market</p>
          <p className={cn("text-[clamp(1.75rem,4vw,2.6rem)] leading-tight font-medium tracking-tight tabular-nums", pxTone)}>
            {px != null ? money(px, 2) : "—"}
          </p>
          <p className={cn("text-sm tabular-nums", pxTone)}>
            {chg != null ? `${chg >= 0 ? "+" : ""}${chg.toFixed(2)}%` : "waiting on tape"}
          </p>
          <WorkspaceTape snap={snap} />
          <dl className="mt-3 grid grid-cols-3 gap-2">
            <div>
              <dt className="coinbase-orange text-[10px] tracking-[0.08em] uppercase">RSI-14</dt>
              <dd className={cn("text-sm font-medium tabular-nums", vsAvg(snap?.rsi14, snap?.rsiAvg))}>
                {snap?.rsi14 != null ? snap.rsi14.toFixed(1) : "—"}
              </dd>
            </div>
            <div>
              <dt className="coinbase-orange text-[10px] tracking-[0.08em] uppercase">MACD</dt>
              <dd className={cn("text-sm font-medium tabular-nums", snap?.macd ? (snap.macd.hist >= 0 ? "rsi-above" : "rsi-below") : undefined)}>
                {snap?.macd
                  ? `${snap.macd.hist >= 0 ? "+" : ""}${Math.abs(snap.macd.hist) >= 10 ? snap.macd.hist.toFixed(0) : snap.macd.hist.toFixed(1)}`
                  : "—"}
              </dd>
            </div>
            <div>
              <dt className="coinbase-orange text-[10px] tracking-[0.08em] uppercase">F&G</dt>
              <dd className={cn("text-sm font-medium tabular-nums", vsAvg(snap?.fearGreed?.value, 50))}>
                {snap?.fearGreed?.value ?? "—"} {snap?.fearGreed?.label ?? ""}
              </dd>
            </div>
            <div>
              <dt className="coinbase-orange text-[10px] tracking-[0.08em] uppercase">EMA-21</dt>
              <dd className={cn("text-sm font-medium tabular-nums", px != null && snap?.ema21 != null ? vsAvg(px, snap.ema21) : undefined)}>
                {snap?.ema21 != null ? money(snap.ema21, 0) : "—"}
              </dd>
            </div>
            <div>
              <dt className="coinbase-orange text-[10px] tracking-[0.08em] uppercase">24h high</dt>
              <dd className={cn("text-sm font-medium tabular-nums", vsAvg(px, mid24))}>
                {high != null ? money(high, 0) : "—"}
              </dd>
            </div>
            <div>
              <dt className="coinbase-orange text-[10px] tracking-[0.08em] uppercase">24h vol</dt>
              <dd className={cn("text-sm font-medium tabular-nums", vsAvg(vol, volAvg))}>
                {vol != null ? `${(vol / 1e9).toFixed(2)}B` : "—"}
              </dd>
            </div>
          </dl>
        </section>

        <aside className="relative z-[1] flex min-h-0 min-w-0 flex-col overflow-hidden border-b border-rule bg-surface p-3 lg:border-b-0 lg:border-r">
          <p className="coinbase-orange text-[10px] font-semibold tracking-[0.1em] uppercase">Order ticket · Bot 7</p>
          <h2 className="mt-2 text-lg font-semibold tracking-tight">
            <span className={convClass(call?.conviction)}>{call?.conviction ?? "—"}</span>{" "}
            <span className={stanceClass(call?.stance ?? "HOLD")}>{call?.stance ?? "—"}</span>
          </h2>
          <p className="mt-1 text-sm text-muted">Clip {call ? money(call.clipUsd, 0) : "—"} · preview only</p>
          {call ? <p className="mt-2 text-sm leading-relaxed text-muted">{call.brief}</p> : null}
          <p className="mt-2 font-mono text-[11px] break-all text-muted">{call?.cli ?? "coinbase products ticker BTC-USD"}</p>
          <div className="mt-3 flex flex-col gap-2">
            <Button variant="primary" onClick={onFill} disabled={!canAct || !canFill}>
              {call?.stance === "TRIM" ? "Paper take-profit" : "Preview buy"}
            </Button>
            <Button disabled>Create — locked</Button>
            <Button onClick={onCopy} disabled={!call}>
              {copied ? "Copied" : "Copy CLI"}
            </Button>
            <Button onClick={onAsk} disabled={asking}>
              {asking ? "Asking…" : canAct ? "Ask Grok" : "Ask Grok · BYO"}
            </Button>
          </div>
          <div className="mt-3 rounded-sm border border-brand/30 bg-brand/8 p-2.5 text-xs leading-relaxed text-muted">
            <p className="coinbase-orange mb-1 text-[10px] font-semibold tracking-[0.08em] uppercase">Bot capability</p>
            Other agents already read Bot 7 (poll 300s). They cannot trade on this host. When the operator unlocks
            auto trade, each bot runs Coinbase for Agents on an account it controls. Keys never sit here.
          </div>
          {grokErr ? <p className="mt-2 text-sm text-down">{grokErr}</p> : null}
          {grok ? <p className="mt-2 whitespace-pre-wrap border-t border-rule pt-2 text-sm leading-relaxed">{grok}</p> : null}
        </aside>

        <aside className="relative flex min-h-0 min-w-0 flex-col overflow-hidden carbon-fiber p-3">
          <div className="relative z-10 rounded-sm bg-bg/50 px-1 backdrop-blur-[1px]">
          <p className="bots-1-6 text-[10px] font-semibold tracking-[0.1em] uppercase">Bots 1–6</p>
          {briefs.map((b, i) => (
            <div key={b.id} className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 border-b border-rule py-2 text-xs">
              <span className="bots-1-6 w-4 shrink-0">{i + 1}</span>
              <span className="bot-lane-name min-w-0 flex-1 leading-snug">
                {b.name.replace(/ Analyst$/i, "")}
              </span>
              <span className={cn("shrink-0", stanceClass(b.stance))}>{b.stance}</span>
            </div>
          ))}
          {call ? (
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 border-b border-rule py-2 text-xs">
              <span className="coinbase-orange w-4 shrink-0">7</span>
              <span className="min-w-0 flex-1 font-semibold leading-snug">
                <span className="coinbase-orange">7-B0T</span>{" "}
                <GmRainbow text="AUTO" />
              </span>
              <span className={cn("shrink-0", stanceClass(call.stance))}>{call.stance}</span>
            </div>
          ) : null}
          {gm ? (
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 py-2 text-xs">
              <span className="w-4 shrink-0">
                <GmRainbow text="G" />
              </span>
              <span className="min-w-0 flex-1 leading-snug">
                <GmRainbow text="GM M0D3 AUTO" />
              </span>
              <span className={cn("shrink-0", callStanceClass(gm.stance))}>{gm.stance}</span>
            </div>
          ) : null}
          </div>
          <div className="gm-holo mt-2 flex-1">
            <img
              src="/gzilla-holo.jpg"
              alt="G0DZ1LLa M0D3 techno Godzilla hologram. Godzilla mode. AI trading bots. Bitcoin trading agents. AI AGENTS. AI Bitcoin hedge fund desk at S1R1US Labs."
              title="G0DZ1LLa M0D3 hologram — Godzilla mode, AI trading bots, Bitcoin trading agents"
            />
          </div>
        </aside>
      </div>

      {(() => {
        const buys = [
          ...briefs.filter((b) => isPurchase(b.stance)).map((b) => ({
            id: b.id,
            name: b.name,
            stance: b.stance,
            detail: b.summary,
            tone: "bot" as const,
          })),
          ...(call && isPurchase(call.stance)
            ? [
                {
                  id: "bot7",
                  name: "7-B0T AUTO",
                  stance: `${call.conviction} ${call.stance}`,
                  detail: `Would clip ${money(call.clipUsd, 0)} USDC · ${call.brief}`,
                  tone: "bot7" as const,
                },
              ]
            : []),
          ...(gm && isPurchase(gm.stance)
            ? [
                {
                  id: "gm",
                  name: "G M0D3 AUTO",
                  stance: `${gm.conviction} ${gm.stance}`,
                  detail: `Would clip ${money(gm.clipUsd, 0)} · ${gm.reason}`,
                  tone: "gm" as const,
                },
              ]
            : []),
        ];
        return (
          <div className="mt-3 rounded-md border border-rule bg-surface p-3">
            <p className="bots-1-6 text-[10px] font-semibold tracking-[0.1em] uppercase">
              Purchase calls · this cycle · would-accumulate (Coinbase create off)
            </p>
            {buys.length ? (
              <ul className="mt-2 space-y-2">
                {buys.map((row) => (
                  <li key={row.id} className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 border-b border-rule pb-2 text-xs last:border-0 last:pb-0">
                    {row.tone === "gm" ? (
                      <GmRainbow text={row.name} className="font-semibold" />
                    ) : (
                      <span className={cn("font-semibold", row.tone === "bot7" ? "coinbase-orange" : "bot-lane-name")}>
                        {row.name}
                      </span>
                    )}
                    <span className={stanceClass(row.stance.split(" ").pop() ?? row.stance)}>{row.stance}</span>
                    <span className="w-full text-muted">{row.detail}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-xs text-muted">
                No BUY / ACCUMULATE this cycle. Bots 1–6, 7-B0T AUTO, and GM M0D3 AUTO are scanning the live tape.
                Coinbase create stays locked.
              </p>
            )}
          </div>
        );
      })()}

      <div className="mt-3 overflow-x-auto rounded-md border border-rule bg-surface">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-rule text-[10px] tracking-[0.08em] uppercase">
              <th className="coinbase-orange px-3 py-2 font-semibold">Bot</th>
              <th className="coinbase-orange px-3 py-2 font-semibold">Stance</th>
              <th className="coinbase-orange px-3 py-2 font-semibold">Summary</th>
            </tr>
          </thead>
          <tbody>
            {briefs.map((b) => (
              <tr key={b.id} className="border-b border-rule last:border-0">
                <td className="bot-lane-name px-3 py-2">{b.name}</td>
                <td className={cn("px-3 py-2", stanceClass(b.stance))}>{b.stance}</td>
                <td className="px-3 py-2 text-muted">{b.summary}</td>
              </tr>
            ))}
            {call ? (
              <tr>
                <td className="coinbase-orange px-3 py-2 font-semibold">7-B0T</td>
                <td className="px-3 py-2">
                  <span className={convClass(call.conviction)}>{call.conviction}</span>{" "}
                  <span className={stanceClass(call.stance)}>{call.stance}</span>
                </td>
                <td className="px-3 py-2 text-muted">
                  <p>{call.brief}</p>
                  {demoOn && isPurchase(call.stance) ? (
                    <p className="mt-1 font-mono text-[11px] text-tab">
                      would-run · clip {money(call.clipUsd, 0)} · Coinbase create off
                    </p>
                  ) : null}
                  {canAct ? (
                    <div className="mt-2">
                      <button
                        type="button"
                        className="expand-ctl text-[11px] font-medium hover:underline"
                        aria-expanded={overseer}
                        onClick={() => setOverseer((o) => !o)}
                      >
                        Overseer
                      </button>
                      {overseer ? (
                        <p className="mt-2 max-w-prose text-[11px] leading-relaxed text-muted">{call.thesis}</p>
                      ) : null}
                    </div>
                  ) : null}
                </td>
              </tr>
            ) : null}
            {gm ? (
              <tr>
                <td className="px-3 py-2">
                  <GmRainbow text={GM_NAME} />
                </td>
                <td className="px-3 py-2">
                  <span className={convClass(gm.conviction)}>{gm.conviction}</span>{" "}
                  <span className={callStanceClass(gm.stance)}>{gm.stance}</span>
                </td>
                <td className="px-3 py-2 text-muted">
                  AUTO · clip {money(gm.clipUsd, 0)} · {gm.reason} {AUTO_RUN_LABEL}
                  {demoOn && isPurchase(gm.stance) ? (
                    <p className="mt-1 font-mono text-[11px] text-tab">would-run · Coinbase create off</p>
                  ) : null}
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
      <p className="mt-2 font-mono text-[11px] text-oss">
        <Link to="/agent" className="hover:underline">
          Agent feed
        </Link>
        {" · "}
        <Link to="/compute" className="hover:underline">
          BYO compute
        </Link>
        {" · dry-run only until unlock"}
      </p>
    </div>
  );
}
