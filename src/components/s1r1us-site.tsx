import { useEffect, useMemo, type ReactNode } from "react";
import { money } from "@/components/helios-card";
import { DeskWorkspace } from "@/components/desk-workspace";
import { LiveTracks } from "@/components/live-tracks";
import { HelloWorld } from "@/components/hello-world";
import { AskGrokPanel } from "@/components/ask-grok-panel";
import { GoLivePanel } from "@/components/go-live-panel";
import { BowlLiveFeed } from "@/components/bowl-live-feed";
import { Panel, Shell } from "@/components/shell";
import { SystemOverview } from "@/components/system-overview";
import { TapeChart } from "@/components/tape-charts";
import { LeverageWhaleRow } from "@/components/whale-tape";
import { GodzillaModeLabel } from "@/components/godzilla-mark";
import { SeoCopy } from "@/components/seo-copy";
import { APP_NAME, BOT7_NAME, LABS_NAME, TAB_DESK } from "@/lib/brand";
import { COMPANY_X_HANDLE, COMPANY_X_URL } from "@/lib/desk/x-admin";
import { CompanyXChip } from "@/components/company-x";
import { heliosCall, runBots } from "@/lib/desk/signal";
import { useDeskTape } from "@/lib/desk/tape-client";
import { rollBots, DESK_POLL_MS } from "@/lib/desk/roll-bots";
import { COIN_DOMAIN } from "@/lib/launch/model";
import { cn, BTC_TONE, USD_TONE, fgTone, kimchiTone, rsiTone } from "@/lib/utils";

export function S1r1usSite() {
  const { snap, err } = useDeskTape();
  useEffect(() => {
    void rollBots({ force: true });
    const id = window.setInterval(() => void rollBots(), DESK_POLL_MS);
    return () => window.clearInterval(id);
  }, []);
  const briefs = useMemo(() => (snap ? runBots(snap) : []), [snap]);
  const call = useMemo(
    () => (snap ? heliosCall(snap, briefs, 1000) : null),
    [snap, briefs],
  );
  const px = snap?.btc.price;
  const chg = snap?.btc.changePct;

  return (
    <Shell>
      <main className="mx-auto max-w-[1400px] px-3 py-4 sm:px-4">
        <SeoCopy />
        {err ? (
          <p className="mb-3 rounded-md border border-down/40 bg-down/10 px-3 py-2 text-sm text-down">{err}</p>
        ) : null}

        <DeskWorkspace
          snap={snap}
          briefs={briefs}
          call={call}
          canAct={false}
          canFill={false}
          asking={false}
          copied={false}
          grok={null}
          grokErr={null}
          onAsk={() => {
            window.location.assign("/compute");
          }}
          onCopy={() => undefined}
          onFill={() => undefined}
        />

        <div className="mt-4 grid gap-3">
          <HelloWorld />
          <GoLivePanel />
          <BowlLiveFeed compact />
          <AskGrokPanel />
        </div>

        <LiveTracks
          briefs={briefs}
          note="Live visual summary of bots 1–6 from the last tape pull. 7-B0T reads these lanes — it does not average them."
        />

        <div className="mt-4 mb-4 grid w-full grid-cols-2 gap-x-4 gap-y-4 sm:grid-cols-3 lg:grid-cols-5">
          <Stat
            label="BTC-USD"
            value={px ? money(px, 0) : "—"}
            hint={chg != null ? `${chg >= 0 ? "+" : ""}${chg.toFixed(2)}%` : "Coinbase"}
            up={chg == null ? undefined : chg >= 0}
            valueClass={USD_TONE}
            labelClass={BTC_TONE}
          />
          <Stat
            label="RSI-14 1h"
            value={snap?.rsi14 != null ? snap.rsi14.toFixed(1) : "—"}
            hint={
              snap?.rsiAvg != null
                ? `avg ${snap.rsiAvg.toFixed(1)} · ${
                    snap.rsi14 != null && snap.rsi14 < snap.rsiAvg ? "below" : "above"
                  }`
                : "vs tape avg"
            }
            valueClass={rsiTone(snap?.rsi14, snap?.rsiAvg)}
            labelClass={rsiTone(snap?.rsi14, snap?.rsiAvg)}
          />
          <Stat
            label="MACD 1h"
            value={
              snap?.macd
                ? `${snap.macd.hist >= 0 ? "+" : ""}${Math.abs(snap.macd.hist) >= 10 ? snap.macd.hist.toFixed(0) : snap.macd.hist.toFixed(1)}`
                : "—"
            }
            hint={snap?.macd ? (snap.macd.hist >= 0 ? "hist · above signal" : "hist · below signal") : "12/26/9"}
            valueClass={snap?.macd ? (snap.macd.hist >= 0 ? "rsi-above" : "rsi-below") : undefined}
            labelClass={snap?.macd ? (snap.macd.hist >= 0 ? "rsi-above" : "rsi-below") : undefined}
          />
          <Stat
            label="Fear & Greed"
            value={snap?.fearGreed ? String(snap.fearGreed.value) : "—"}
            hint={snap?.fearGreed?.label}
            valueClass={fgTone(snap?.fearGreed?.value, snap?.fearGreed?.label)}
            labelClass={fgTone(snap?.fearGreed?.value, snap?.fearGreed?.label)}
          />
          <Stat
            labelNode={
              <>
                <span className="upbit-blue">Upbit</span>
                <span className="text-muted"> vs </span>
                <span className="coinbase-orange">Coinbase</span>
              </>
            }
            value={
              snap?.asia?.kimchiPct != null
                ? `${snap.asia.kimchiPct >= 0 ? "+" : ""}${snap.asia.kimchiPct.toFixed(2)}%`
                : "—"
            }
            hint="Kimchi premium"
            valueClass={kimchiTone(snap?.asia?.kimchiPct)}
          />
        </div>

        <div className="mt-4">
          <TapeChart snap={snap} />
        </div>
        <LeverageWhaleRow snap={snap} />

        <SystemOverview />

        <Panel className="mt-4" kicker={LABS_NAME} title={COIN_DOMAIN} kickerClass="text-high" titleClass="text-high">
          <p className="text-sm leading-relaxed text-muted">
            {LABS_NAME} is an AI Bitcoin hedge fund. The S1R1US Bot Hedge Fund is seven orthogonal bots plus SuperGrok
            reading free public tape. Same mandate as {APP_NAME}: stack bitcoin, never short, never chase crowded longs.
            Public views are {TAB_DESK} and <GodzillaModeLabel />. {BOT7_NAME} issues the accumulation call. Not financial advice.
          </p>
          <p className="mt-3 text-xs leading-relaxed text-muted">
            {LABS_NAME} · {APP_NAME} · {COIN_DOMAIN}
            {COMPANY_X_HANDLE ? (
              <>
                {" "}
                ·{" "}
                <a className="text-fg underline-offset-2 hover:underline" href={COMPANY_X_URL} target="_blank" rel="noreferrer">
                  {COMPANY_X_HANDLE}
                </a>
              </>
            ) : null}
            . Operator identity is not published. Public data only. Not an offer of securities. Do not send seeds or funds to anyone
            claiming to be this page.
          </p>
        </Panel>
      </main>
    </Shell>
  );
}

function Stat({
  label,
  labelNode,
  value,
  hint,
  up,
  valueClass,
  labelClass,
}: {
  label?: string;
  labelNode?: ReactNode;
  value: string;
  hint?: string;
  up?: boolean;
  valueClass?: string;
  labelClass?: string;
}) {
  const hot = valueClass === "rsi-below" ? "#ff1f1f" : valueClass === "rsi-above" ? "#3dff1a" : undefined;
  return (
    <div>
      <p
        className={cn("text-[11px] tracking-[0.14em] uppercase", !labelNode && (labelClass || "text-muted"))}
        style={!labelNode && hot ? { color: hot } : undefined}
      >
        {labelNode ?? label}
      </p>
      <p className={cn("mt-1 text-lg tabular-nums", valueClass)} style={hot ? { color: hot } : undefined}>
        {value}
      </p>
      {hint ? (
        <p className={cn("text-xs", up == null ? "text-muted" : up ? "text-up" : "text-down")}>{hint}</p>
      ) : null}
    </div>
  );
}

