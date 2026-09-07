import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
} from "lucide-react";
import { CapitalTapeChart } from "@/components/capital-tape";
import { SlowPoolsBoard } from "@/components/slow-pools";
import { HashrateBoard } from "@/components/hashrate-board";
import { BtcHoldersTable, MetalBoards } from "@/components/holders-table";
import { GoldBtcChart } from "@/components/gold-btc-chart";
import { MacroTape } from "@/components/macro-tape";
import { StrategyTape } from "@/components/strategy-tape";
import { PaperCard, money } from "@/components/helios-card";
import { ConfirmClip } from "@/components/confirm-clip";
import { isOutgoingCli, YubiApprove } from "@/components/yubi-approve";
import { DeskWorkspace } from "@/components/desk-workspace";
import { LiveTracks } from "@/components/live-tracks";
import { HelloWorld } from "@/components/hello-world";
import { GoLivePanel } from "@/components/go-live-panel";
import { BowlLiveFeed } from "@/components/bowl-live-feed";
import { SeoCopy } from "@/components/seo-copy";
import { TapeFreezeBanner } from "@/components/tape-freeze";
import { Panel, Shell } from "@/components/shell";
import { TapeChart } from "@/components/tape-charts";
import { LeverageWhaleRow } from "@/components/whale-tape";
import {
  AsiaPanel,
  CoinbasePanel,
  EmFlowPanel,
  Quotes,
  Stat,
  WirePanel,
} from "@/components/desk-tape-panels";

import { askHelios } from "@/lib/desk/grok";
import { useOperator } from "@/lib/desk/operator";
import { looksLikeSecret } from "@/lib/desk/security";
import { heliosCall, runBots } from "@/lib/desk/signal";
import { useDeskTape } from "@/lib/desk/tape-client";
import { rollBots, DESK_POLL_MS } from "@/lib/desk/roll-bots";
import { initialStop, STOP_DEFAULT } from "@/lib/desk/stops";
import { STARTING_CASH, usePaper } from "@/lib/desk/store";
import { GOLD_TICKERS, SILVER_TICKERS } from "@/lib/desk/proxy-book";
import type { DeskSnapshot, HeliosCall, PredictionKind, PredictionMarket } from "@/lib/desk/types";
import { PRED_KIND_LABEL } from "@/lib/desk/prediction-markets";
import { cn, BTC_TONE, USD_TONE, fgTone, kimchiHex, kimchiTone, rsiTone } from "@/lib/utils";
import { APP_CALLS } from "@/lib/brand";

export function DeskApp() {
  const { snap, err, live } = useDeskTape();
  const [grok, setGrok] = useState<string | null>(null);
  const [grokErr, setGrokErr] = useState<string | null>(null);
  const [asking, setAsking] = useState(false);
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [copyAsk, setCopyAsk] = useState(false);

  const cash = usePaper((s) => s.cashUsd);
  const btc = usePaper((s) => s.btc);
  const profitBtc = usePaper((s) => s.profitBtc);
  const fills = usePaper((s) => s.fills);
  const fill = usePaper((s) => s.fill);
  const reset = usePaper((s) => s.reset);
  const log = useOperator((s) => s.log);
  const unlocked = useOperator((s) => s.unlocked);
  const role = useOperator((s) => s.role);
  const isAdmin = unlocked && role === "admin";

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    const admin = useOperator.getState().unlocked && useOperator.getState().role === "admin";
    void rollBots({ force: true, admin });
    const id = window.setInterval(() => {
      const a = useOperator.getState().unlocked && useOperator.getState().role === "admin";
      void rollBots({ admin: a });
    }, DESK_POLL_MS);
    return () => window.clearInterval(id);
  }, []);

  const briefs = useMemo(() => (snap ? runBots(snap) : []), [snap]);
  const nav = mounted ? cash + (btc + (profitBtc ?? 0)) * (snap?.btc.price ?? 0) : STARTING_CASH;
  const call = useMemo(
    () => (snap ? heliosCall(snap, briefs, nav) : null),
    [snap, briefs, nav],
  );

  async function onAskGrok() {
    if (!unlocked || !snap || !call) return;
    setAsking(true);
    setGrokErr(null);
    try {
      const res = await askHelios({ data: { token: useOperator.getState().token, snapshot: snap, briefs, call } });
      if (!res.ok) setGrokErr(res.error);
      else {
        setGrok(res.text);
        log("grok", "Ask Grok");
      }
    } catch (e) {
      setGrokErr(e instanceof Error ? e.message : "Grok request failed");
    } finally {
      setAsking(false);
    }
  }

  function executeClip(c: HeliosCall) {
    if (!unlocked || role !== "admin") return;
    const px = snap?.btc.price;
    if (!px || c.clipUsd <= 0) return;
    if (c.stance === "TRIM") {
      const qty = Math.min(btc, c.clipUsd / px);
      if (qty <= 0) return;
      fill({
        at: new Date().toISOString(),
        side: "SELL",
        usd: qty * px,
        btc: qty,
        price: px,
        note: `${APP_CALLS} ${c.stance} ${c.conviction}`,
        kind: "trim",
      });
      log("fill", `Paper SELL ${c.clipUsd}`);
      return;
    }
    const usd = Math.min(cash, c.clipUsd);
    if (usd <= 0) return;
    fill({
      at: new Date().toISOString(),
      side: "BUY",
      usd,
      btc: usd / px,
      price: px,
      note: `${APP_CALLS} ${c.stance} ${c.conviction}`,
      kind: "clip",
      stopPrice: initialStop(px, STOP_DEFAULT),
      peakPrice: px,
    });
    log("fill", `Paper BUY ${c.clipUsd}`);
  }

  async function copyCli(text: string) {
    if (looksLikeSecret(text) || text.includes("orders create")) {
      log("reject", "Blocked unsafe CLI copy");
      return;
    }
    await navigator.clipboard.writeText(text);
    log("copy", "Preview CLI copied");
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  const px = snap?.btc.price;
  const chg = snap?.btc.changePct;

  return (
    <Shell>
      <main className="mx-auto max-w-[1400px] px-3 py-4 sm:px-4">
        <SeoCopy />
        <TapeFreezeBanner />

        {err ? (
          <p className="mb-3 rounded-md border border-down/40 bg-down/10 px-3 py-2 text-sm text-down">
            {err}
          </p>
        ) : null}

        <DeskWorkspace
          snap={snap}
          briefs={briefs}
          call={call}
          canAct={isAdmin}
          canFill={isAdmin && Boolean(px) && call != null && call.clipUsd > 0}
          asking={asking}
          copied={copied}
          grok={grok}
          grokErr={grokErr}
          onAsk={() => {
            if (!isAdmin) window.location.assign("/compute");
            else void onAskGrok();
          }}
          onCopy={() => {
            if (!call) return;
            if (isOutgoingCli(call.cli)) setCopyAsk(true);
            else void copyCli(call.cli);
          }}
          onFill={() => {
            if (isAdmin) setConfirm(true);
          }}
        />
        {confirm && call ? (
          <ConfirmClip
            call={call}
            onCancel={() => setConfirm(false)}
            onConfirm={() => {
              setConfirm(false);
              executeClip(call);
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
              void copyCli(call.cli);
            }}
          />
        ) : null}

        <div className="mt-3">
          <HelloWorld />
        </div>
        <div className="mt-3">
          <GoLivePanel />
        </div>
        <div className="mt-3">
          <BowlLiveFeed compact />
        </div>

        {isAdmin ? (
          <div className="mt-3">
          <PaperCard
            mounted={mounted}
            cash={cash}
            btc={btc}
            profitBtc={profitBtc ?? 0}
            px={px ?? null}
            fills={fills}
            onReset={unlocked ? reset : undefined}
          />
          </div>
        ) : null}

        <div className="mt-4">
        <LiveTracks
          briefs={briefs}
          note="Live visual summary of bots 1–6 from the last tape pull. 7-B0T reads these lanes — it does not average them."
        />
        </div>

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
              label="EMA-21 1h"
              value={snap?.ema21 != null ? money(snap.ema21, 0) : "—"}
              hint={
                px != null && snap?.ema21 != null ? (px >= snap.ema21 ? "last above" : "last below") : "trend"
              }
              valueClass={px != null && snap?.ema21 != null ? (px >= snap.ema21 ? "rsi-above" : "rsi-below") : undefined}
              labelClass={px != null && snap?.ema21 != null ? (px >= snap.ema21 ? "rsi-above" : "rsi-below") : undefined}
            />
            <Stat
              label="SMA-50 1h"
              value={snap?.sma50 != null ? money(snap.sma50, 0) : "—"}
              hint={
                px != null && snap?.sma50 != null ? (px >= snap.sma50 ? "last above" : "last below") : "need 50 bars"
              }
              valueClass={px != null && snap?.sma50 != null ? (px >= snap.sma50 ? "rsi-above" : "rsi-below") : undefined}
              labelClass={px != null && snap?.sma50 != null ? (px >= snap.sma50 ? "rsi-above" : "rsi-below") : undefined}
            />
            <Stat
              label="BB %B 1h"
              value={snap?.bbPct != null ? snap.bbPct.toFixed(2) : "—"}
              hint={
                snap?.bbPct == null
                  ? "20,2"
                  : snap.bbPct <= 0.3
                    ? "lower band"
                    : snap.bbPct >= 0.7
                      ? "upper band"
                      : "mid band"
              }
              valueClass={
                snap?.bbPct == null ? undefined : snap.bbPct <= 0.3 ? "rsi-above" : snap.bbPct >= 0.7 ? "rsi-below" : undefined
              }
              labelClass={
                snap?.bbPct == null ? undefined : snap.bbPct <= 0.3 ? "rsi-above" : snap.bbPct >= 0.7 ? "rsi-below" : undefined
              }
            />
            <Stat
              label="Vol 1h"
              value={snap?.volRatio != null ? `${snap.volRatio.toFixed(2)}×` : "—"}
              hint={snap?.volRatio != null ? (snap.volRatio >= 1 ? "vs 20h avg" : "quiet vs 20h") : "vs 20h avg"}
              valueClass={snap?.volRatio != null && snap.volRatio >= 1 ? "rsi-above" : snap?.volRatio != null ? "rsi-below" : undefined}
              labelClass={snap?.volRatio != null && snap.volRatio >= 1 ? "rsi-above" : snap?.volRatio != null ? "rsi-below" : undefined}
            />
            <Stat
              label="ATR-14 1h"
              value={snap?.atr != null ? money(snap.atr, 0) : "—"}
              hint="stop width"
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

        <AsiaPanel snap={snap} />
        <EmFlowPanel snap={snap} />
        <CapitalTapeChart snap={snap} />
        <SlowPoolsBoard snap={snap} />
        <HashrateBoard snap={snap} />
        <BtcHoldersTable snap={snap} />

        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <Quotes snap={snap} />
          <WirePanel snap={snap} />
        </div>

        <CoinbasePanel call={call} />
        <MacroTape snap={snap} />
        <StrategyTape snap={snap} />
        <GoldBtcChart snap={snap} />
        <MetalBoards snap={snap} />

        {snap?.errors.length || snap?.pullMs ? (
          <p className="mt-4 font-mono text-xs text-muted">
            {snap.pullMs ? `Live pull ${((snap.pullMs ?? 0) / 1000).toFixed(1)}s` : null}
            {snap.feedAudit ? ` · ${snap.feedAudit.ok}/${snap.feedAudit.ok + snap.feedAudit.fail} sources` : null}
            {live ? " · 5m cadence" : " · paused"}
            {snap.errors.length ? ` · Degraded: ${snap.errors.join(" · ")}` : " · all sources live"}
          </p>
        ) : null}
      </main>
    </Shell>
  );
}
