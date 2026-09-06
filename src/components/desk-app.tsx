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

import { askHelios } from "@/lib/desk/grok";
import { useOperator } from "@/lib/desk/operator";
import { looksLikeSecret } from "@/lib/desk/security";
import { heliosCall, runBots } from "@/lib/desk/signal";
import { useDeskTape } from "@/lib/desk/tape-client";
import { rollBots, DESK_POLL_MS } from "@/lib/desk/roll-bots";
import { initialStop, STOP_DEFAULT } from "@/lib/desk/stops";
import { STARTING_CASH, usePaper } from "@/lib/desk/store";
import { GOLD_TICKERS, SILVER_TICKERS } from "@/lib/desk/proxy-book";
import type { DeskSnapshot, HeliosCall } from "@/lib/desk/types";
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
      <p className={cn("text-[11px] tracking-[0.14em] uppercase", !labelNode && (labelClass || "text-muted"))} style={!labelNode && hot ? { color: hot } : undefined}>
        {labelNode ?? label}
      </p>
      <p className={cn("mt-1 text-lg tabular-nums", valueClass)} style={hot ? { color: hot } : undefined}>
        {value}
      </p>
      {hint ? (
        <p
          className={cn("text-xs", up == null ? "text-muted" : up ? "text-up" : "text-down")}
        >
          {hint}
        </p>
      ) : null}
    </div>
  );
}

function asiaVenueClass(id: string) {
  if (id === "upbit") return "upbit-blue";
  if (id === "bithumb") return "asia-bithumb";
  if (id === "hashkey") return "asia-hashkey";
  if (id === "okx") return "asia-okx";
  if (id === "htx") return "asia-htx";
  return "text-fg";
}

function AsiaPanel({ snap }: { snap: DeskSnapshot | null }) {
  const a = snap?.asia;
  const [open, setOpen] = useState(false);
  const fmtPrem = (n: number | null | undefined) =>
    n == null ? "—" : `${n >= 0 ? "+" : ""}${n.toFixed(2)}%`;
  return (
    <Panel className="mt-4" kicker="KR · HK · CN  ·  Binance blocked" title="Asia bitcoin tape" kickerClass="indicator-title" titleClass="indicator-title">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full flex-wrap items-baseline justify-between gap-x-6 gap-y-2 rounded-md py-1 text-left hover:bg-fg/4"
      >
        <span className="font-mono text-sm">
          <span className="text-muted">{a?.session ?? "—"}</span>
          <span className="mx-2 text-muted">·</span>
          <span className={kimchiTone(a?.kimchiPct)} style={{ color: kimchiHex(a?.kimchiPct) }}>
            kimchi {fmtPrem(a?.kimchiPct)}
          </span>
          <span className="mx-2 text-muted">·</span>
          <span className={kimchiTone(a?.hkPremiumPct)} style={{ color: kimchiHex(a?.hkPremiumPct) }}>
            HK {fmtPrem(a?.hkPremiumPct)}
          </span>
          <span className="mx-2 text-muted">·</span>
          <span className={kimchiTone(a?.cnyOtc.premiumPct)} style={{ color: kimchiHex(a?.cnyOtc.premiumPct) }}>
            CNY {fmtPrem(a?.cnyOtc.premiumPct)}
          </span>
        </span>
        <span className="shrink-0 font-mono text-[11px] expand-ctl">{open ? "collapse" : "expand"}</span>
      </button>
      {open ? (
        <>
          <div className="mb-4 mt-3 flex flex-wrap gap-6 font-mono text-sm">
            <div>
              <p className="text-[11px] text-muted">Session</p>
              <p className="mt-1">{a?.session ?? "—"}</p>
            </div>
            <div>
              <p className="text-[11px] text-muted">
                <span className="upbit-blue">Upbit</span>
                <span> vs </span>
                <span className="coinbase-orange">Coinbase</span>
              </p>
              <p className={cn("mt-1", kimchiTone(a?.kimchiPct))} style={{ color: kimchiHex(a?.kimchiPct) }}>
                {fmtPrem(a?.kimchiPct)}
              </p>
            </div>
            <div>
              <p className="text-[11px] asia-hashkey">HashKey HK</p>
              <p className={cn("mt-1", kimchiTone(a?.hkPremiumPct))} style={{ color: kimchiHex(a?.hkPremiumPct) }}>
                {fmtPrem(a?.hkPremiumPct)}
              </p>
            </div>
            <div>
              <p className="text-[11px] asia-cny">CNY OTC USDT</p>
              <p className="mt-1 tabular-nums">
                {a?.cnyOtc.usdtCny != null ? a.cnyOtc.usdtCny.toFixed(3) : "—"}{" "}
                <span className={kimchiTone(a?.cnyOtc.premiumPct)} style={{ color: kimchiHex(a?.cnyOtc.premiumPct) }}>
                  {fmtPrem(a?.cnyOtc.premiumPct)}
                </span>
              </p>
            </div>
          </div>
          <ul className="space-y-2 font-mono text-sm">
            {(a?.venues ?? []).map((v) => (
              <li key={v.id} className="flex items-baseline justify-between gap-3">
                <span className="w-8 shrink-0 text-muted">{v.region}</span>
                <span className={cn("min-w-0 flex-1 truncate", asiaVenueClass(v.id))}>{v.name}</span>
                <span className="tabular-nums">{v.lastUsd != null ? money(v.lastUsd, 0) : "—"}</span>
                <span
                  className={cn("w-16 shrink-0 text-right tabular-nums", kimchiTone(v.premiumPct))}
                  style={{ color: kimchiHex(v.premiumPct) }}
                >
                  {fmtPrem(v.premiumPct)}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-muted">
            Premiums vs Coinbase USD. Korea is KRW converted at Frankfurter FX. China onshore
            trading is banned — HTX is the offshore proxy, CNY OTC is OKX P2P USDT/CNY. HashKey is
            the SFC-licensed Hong Kong book. No Binance key, no Binance host.
          </p>
        </>
      ) : null}
    </Panel>
  );
}

const FLOW_IN = "text-high";
const FLOW_OUT = "text-[#8a918c]";
const FLOW_FLAT = "text-tbill";

function flowClass(flow: string) {
  if (flow === "INFLOW") return FLOW_IN;
  if (flow === "OUTFLOW") return FLOW_OUT;
  return FLOW_FLAT;
}

function premClass(n: number | null | undefined) {
  if (n == null) return FLOW_OUT;
  if (n >= 1.5) return FLOW_IN;
  if (n <= -1.5) return FLOW_OUT;
  return FLOW_FLAT;
}

function EmFlowPanel({ snap }: { snap: DeskSnapshot | null }) {
  const em = snap?.em;
  const fmtPrem = (n: number | null | undefined) =>
    n == null ? "—" : `${n >= 0 ? "+" : ""}${n.toFixed(2)}%`;
  return (
    <Panel className="mt-4" kicker="UAE · ME · RU · AF · SA  ·  free public books" title="EM bitcoin flow" kickerClass="indicator-title" titleClass="indicator-title">
      <div className="mb-4 flex flex-wrap gap-6 font-mono text-sm">
        <div>
          <p className={cn("text-[11px]", FLOW_IN)}>Inflow</p>
          <p className={cn("mt-1 tabular-nums", FLOW_IN)}>{em?.net.inflow ?? "—"}</p>
        </div>
        <div>
          <p className={cn("text-[11px]", FLOW_OUT)}>Outflow</p>
          <p className={cn("mt-1 tabular-nums", FLOW_OUT)}>{em?.net.outflow ?? "—"}</p>
        </div>
        <div>
          <p className={cn("text-[11px]", FLOW_FLAT)}>Flat</p>
          <p className={cn("mt-1 tabular-nums", FLOW_FLAT)}>{em?.net.flat ?? "—"}</p>
        </div>
      </div>
      <ul className="space-y-3">
        {(em?.regions ?? []).map((r) => (
          <li key={r.id} className="border-t border-line/60 pt-3 first:border-0 first:pt-0">
            <div className="flex items-baseline justify-between gap-3 font-mono text-sm">
              <span className={flowClass(r.flow)}>{r.name}</span>
              <span className={cn("uppercase tracking-wide", flowClass(r.flow))}>{r.flow}</span>
              <span className={cn("tabular-nums", flowClass(r.flow))}>{fmtPrem(r.premiumPct)}</span>
            </div>
            <ul className="mt-1 space-y-1 font-mono text-xs">
              {r.venues.map((v) => (
                <li key={v.id} className="flex items-baseline justify-between gap-3">
                  <span className="min-w-0 truncate text-muted">{v.name}</span>
                  <span className={cn("tabular-nums", premClass(v.premiumPct))}>{fmtPrem(v.premiumPct)}</span>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs text-muted">
        INFLOW = local BTC or USDT trading rich vs USD (demand / capital into bitcoin). OUTFLOW =
        trading cheap (selling). Spot: BitOasis AED, Luno ZAR/NGN, Mercado BRL, Buda CLP/COP vs
        Coinbase. P2P: OKX USDT vs open.er-api FX; Russia is Rapira USDT/RUB. Threshold ±1.5%.
        Binance is not used.
      </p>
    </Panel>
  );
}

function Quotes({ snap }: { snap: DeskSnapshot | null }) {
  const rows = snap?.quotes ?? [];
  const [open, setOpen] = useState(false);
  const top = rows.slice(0, 5);
  const rest = rows.slice(5);
  return (
    <Panel kicker="Sector / proxy" title="Public quotes" kickerClass="indicator-title" titleClass="indicator-title">
      <QuoteList rows={top} />
      {rest.length ? (
        <>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            className="mt-2 flex w-full items-baseline justify-between gap-3 rounded-md py-1 text-left hover:bg-fg/4"
          >
            <span className="font-mono text-sm text-high">
              Top 5 shown · {rows.length} quotes
            </span>
            <span className="shrink-0 font-mono text-[11px] expand-ctl">
              {open ? "collapse" : `expand ${rest.length} more`}
            </span>
          </button>
          {open ? <QuoteList rows={rest} /> : null}
        </>
      ) : null}
    </Panel>
  );
}

function QuoteList({ rows }: { rows: NonNullable<DeskSnapshot["quotes"]> }) {
  const gold = new Set<string>(GOLD_TICKERS);
  const silver = new Set<string>(SILVER_TICKERS);
  return (
    <ul className="space-y-2 font-mono text-sm">
      {rows.map((q) => (
        <li key={q.symbol} className="flex items-center justify-between gap-2">
          <span
            className={
              silver.has(q.symbol)
                ? "silver-css"
                : gold.has(q.symbol)
                  ? "gold-css"
                  : "coinbase-orange"
            }
          >
            {q.symbol}
          </span>
          <span className="tabular-nums">{q.last != null ? money(q.last, 2) : "—"}</span>
          <span
            className={cn(
              "flex items-center gap-0.5 tabular-nums",
              (q.changePct ?? 0) >= 0 ? "text-up" : "text-down",
            )}
          >
            {(q.changePct ?? 0) >= 0 ? (
              <ArrowUpRight className="size-3" />
            ) : (
              <ArrowDownRight className="size-3" />
            )}
            {q.changePct != null ? `${q.changePct.toFixed(2)}%` : "—"}
          </span>
        </li>
      ))}
    </ul>
  );
}

function WirePanel({ snap }: { snap: DeskSnapshot | null }) {
  const filings = snap?.filings ?? [];
  const headlines = snap?.headlines ?? [];
  const [open, setOpen] = useState(true);
  return (
    <Panel kicker="EDGAR · Free wire" title="Filings & headlines" kickerClass="indicator-title" titleClass="indicator-title">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-baseline justify-between gap-3 rounded-md py-1 text-left hover:bg-fg/4"
      >
        <span className="font-mono text-sm text-fg">
          {filings.length} filings · {headlines.length} wire
        </span>
        <span className="shrink-0 font-mono text-[11px] expand-ctl">{open ? "collapse" : "expand"}</span>
      </button>
      {open ? (
        <div className="mt-3 grid gap-6 sm:grid-cols-2">
          <div>
            <p className="mb-2 font-mono text-[11px] tracking-[0.12em] text-muted uppercase">SEC</p>
            <ul className="space-y-2 text-sm">
              {filings.slice(0, 6).map((f, i) => (
                <li key={`${f.cik}-${f.filed}-${i}`}>
                  <p className="font-mono text-[11px] text-muted">
                    {f.name} · {f.form} · {f.filed}
                  </p>
                  <p className="truncate">{f.title}</p>
                </li>
              ))}
              {!filings.length ? <li className="text-muted">No filings this cycle.</li> : null}
            </ul>
          </div>
          <div>
            <p className="mb-2 font-mono text-[11px] tracking-[0.12em] text-muted uppercase">Wire</p>
            <ul className="space-y-2 text-sm">
              {headlines.slice(0, 6).map((h) => (
                <li key={h.url}>
                  <p className="font-mono text-[11px] text-muted">{h.source}</p>
                  <a href={h.url} target="_blank" rel="noreferrer" className="line-clamp-2 hover:underline">
                    {h.title}
                  </a>
                </li>
              ))}
              {!headlines.length ? <li className="text-muted">No headlines this cycle.</li> : null}
            </ul>
          </div>
        </div>
      ) : null}
    </Panel>
  );
}

function CoinbasePanel({ call }: { call: HeliosCall | null }) {
  return (
    <Panel className="mt-4" kicker="Execution" title="Coinbase for Agents" kickerClass="indicator-title" titleClass="indicator-title">
      <p className="text-sm leading-relaxed text-muted">
        Helios never holds your CDP secret. Preview here, then run the CLI or connect MCP at{" "}
        <a
          className="text-fg underline-offset-2 hover:underline"
          href="https://agents.coinbase.com/mcp"
          target="_blank"
          rel="noreferrer"
        >
          agents.coinbase.com/mcp
        </a>
        . Docs:{" "}
        <a
          className="text-fg underline-offset-2 hover:underline"
          href="https://docs.cdp.coinbase.com/coinbase-for-agents/overview"
          target="_blank"
          rel="noreferrer"
        >
          Coinbase for Agents
        </a>
        .
      </p>
      {call ? (
        <pre className="mt-3 overflow-x-auto rounded-md bg-bg px-3 py-2 font-mono text-[11px]">
          {JSON.stringify(call.preview, null, 2)}
        </pre>
      ) : null}
      <p className="mt-3 flex items-center gap-2 text-xs text-muted">
        <Activity className="size-3.5" /> Isolated portfolio · Trade + Transfer · always{" "}
        <span className="font-mono">orders preview</span> before create.
      </p>
    </Panel>
  );
}
