import { useEffect, useState } from "react";
import { money, CallWords, bannerTone, callStanceClass, CallInk } from "@/components/helios-card";
import { GodzillaMark, GmRainbow, LeaderBoardLabel } from "@/components/godzilla-mark";
import { Button } from "@/components/ui/button";
import { Panel, Shell, LoginCluster } from "@/components/shell";
import { TAB_BOARD, TAB_BOARD_LEADER, TAB_GM } from "@/lib/brand";
import { SeoCopy } from "@/components/seo-copy";
import { getGmLive, setGmLive } from "@/lib/desk/gm-live";
import {
  dayTraderTf,
  gmCall,
  type GmCall,
  GM_CASH_MAX,
  GM_CASH_MIN,
  GM_CASH_STEP,
  GM_NAME,
  GM_FUND_EXPLORER,
  GM_FUND_USDC,
  GM_PROFIT_BTC,
  GM_PROFIT_EXPLORER,
  GM_TF_MAX,
  GM_TF_MIN,
  GM_VAR_META,
} from "@/lib/desk/gm";
import { useGm, type GmTick } from "@/lib/desk/gm-store";
import { usePractice, type PracticeTick } from "@/lib/desk/practice";
import { usePaper } from "@/lib/desk/store";
import type { PaperFill } from "@/lib/desk/types";
import { useOperator } from "@/lib/desk/operator";
import { useDeskTape } from "@/lib/desk/tape-client";
import { rollBots, DESK_POLL_MS } from "@/lib/desk/roll-bots";
import { heliosCall, runBots } from "@/lib/desk/signal";
import { LiveTracks } from "@/components/live-tracks";
import { cn, BTC_TONE, USD_TONE, rsiTone } from "@/lib/utils";

function isGmAccumulate(call: { conviction: string; stance: string } | null | undefined) {
  return Boolean(call && call.stance === "ACCUMULATE");
}

export function GmDesk() {
  const tape = useDeskTape();
  const snap = tape.snap;
  const admin = useOperator((s) => s.unlocked && s.role === "admin");
  const token = useOperator((s) => s.token);
  const pilot = useGm((s) => s.pilot);
  const setPilot = useGm((s) => s.setPilot);
  const view = useGm((s) => s.view);
  const setView = useGm((s) => s.setView);
  const risk = useGm((s) => s.risk);
  const setRisk = useGm((s) => s.setRisk);
  const bookUsd = useGm((s) => s.bookUsd);
  const setBookUsd = useGm((s) => s.setBookUsd);
  const dayHours = useGm((s) => s.dayHours);
  const setDayHours = useGm((s) => s.setDayHours);
  const vars = useGm((s) => s.vars);
  const setVar = useGm((s) => s.setVar);
  const applyBook = useGm((s) => s.applyBook);
  const resetBook = useGm((s) => s.resetBook);
  const lastTick = useGm((s) => s.lastTick);
  const ticks = useGm((s) => s.ticks);
  const error = useGm((s) => s.error);
  const busy = useGm((s) => s.busy);
  const liveUnlocked = useGm((s) => s.liveUnlocked);
  const setLiveUnlocked = useGm((s) => s.setLiveUnlocked);
  const practice = useGm((s) => s.practice);
  const live = useGm((s) => s.live);
  const bot7Ticks = usePractice((s) => s.ticks);
  const paper = usePaper();
  const [now, setNow] = useState(() => Date.now());
  const [liveAt, setLiveAt] = useState<string | null>(null);
  const [liveErr, setLiveErr] = useState<string | null>(null);

  useEffect(() => {
    void getGmLive().then((s) => {
      setLiveUnlocked(s.liveUnlocked);
      setLiveAt(s.at);
    });
  }, [setLiveUnlocked]);

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    void rollBots({ force: true, admin });
    const id = window.setInterval(() => void rollBots({ admin }), DESK_POLL_MS);
    return () => window.clearInterval(id);
  }, [admin]);

  const book = view === "live" && liveUnlocked && admin ? live : practice;
  const px = snap?.btc.price ?? ticks[0]?.price ?? 0;
  const nav = book.cashUsd + book.btc * px;
  const last = ticks[0];
  const liveArmed = liveUnlocked && admin && view === "live";
  const call = snap
    ? gmCall(snap, nav || bookUsd, {
        pilot,
        risk,
        manual: vars,
        adminLive: liveArmed,
        dayHours,
      })
    : last?.call;
  const tf = snap ? dayTraderTf(snap, dayHours, nav || bookUsd) : call?.dayTf;
  const briefs = snap ? runBots(snap) : [];
  const bot7 = snap ? heliosCall(snap, briefs, nav || bookUsd) : null;

  async function toggleLive(on: boolean) {
    if (!token) {
      setLiveErr("Admin sign-in required to arm Live.");
      return;
    }
    const res = await setGmLive({ data: { token, liveUnlocked: on } });
    if (!res.ok) {
      setLiveErr(res.error ?? "Could not change Live.");
      return;
    }
    setLiveUnlocked(res.liveUnlocked);
    setLiveAt(res.at);
    setLiveErr(null);
    if (!res.liveUnlocked) setView("practice");
  }

  return (
    <Shell>
      <main className="gm-mode mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        <SeoCopy />
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-3 text-high">
            <GodzillaMark className="h-12 w-[5.5rem] shrink-0" />
            <div>
              <p className="text-xs font-medium tracking-[0.14em] uppercase">
                <GmRainbow text={TAB_GM} />
              </p>
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                <GmRainbow text={GM_NAME} />
              </h1>
              <p className="mt-1 font-mono text-[11px] text-muted">
                Compete on{" "}
                <a href="/board" className="board-nav hover:underline">
                  <LeaderBoardLabel className="text-[11px]" />
                </a>
                {" · "}
                {TAB_BOARD} · {TAB_BOARD_LEADER}
              </p>
            </div>
          </div>
          <div className="desk-tabs flex flex-wrap items-center gap-1" role="tablist" aria-label="GM book">
            <button
              type="button"
              className={cn("inline-flex h-11 min-h-11 items-center rounded-md px-4 text-sm font-medium", view === "practice" && "is-on")}
              onClick={() => setView("practice")}
            >
              Practice
            </button>
            <button
              type="button"
              className={cn("inline-flex h-11 min-h-11 items-center rounded-md px-4 text-sm font-medium", view === "live" && "is-on")}
              onClick={() => setView("live")}
            >
              Live
            </button>
          </div>
        </div>

        {view === "live" && !liveArmed ? (
          <div className="mt-4 rounded-md border border-rule bg-surface p-4">
            <p className="font-mono text-xs tracking-[0.14em] text-sell uppercase">Live locked</p>
            <p className="mt-1 text-sm text-muted">
              {admin
                ? "Unlock Live below. Autonomous GM then uses the live sleeve."
                : "Only the admin can arm Live. AUTO still reads the live tape."}
            </p>
            {admin ? (
              <Button className="mt-3" variant="primary" onClick={() => void toggleLive(true)}>
                Unlock Live for admin / autonomous
              </Button>
            ) : null}
          </div>
        ) : null}
        {admin && liveUnlocked ? (
          <div className="mt-3">
            <Button onClick={() => void toggleLive(false)}>Lock Live</Button>
            {liveAt ? <p className="mt-1 font-mono text-[11px] text-muted">Live armed {new Date(liveAt).toLocaleString("en-US")}</p> : null}
          </div>
        ) : null}
        {liveErr ? <p className="mt-2 text-sm text-down">{liveErr}</p> : null}

        <div className="mt-5 desk-tabs flex flex-wrap gap-1">
          <button
            type="button"
            className={cn("inline-flex h-11 min-h-11 items-center rounded-md px-4 text-sm font-bold", pilot === "AUTO" && "is-on")}
            onClick={() => setPilot("AUTO")}
          >
            AUTO
          </button>
          <button
            type="button"
            className={cn("inline-flex h-11 min-h-11 items-center rounded-md px-4 text-sm font-bold", pilot === "MANUAL" && "is-on")}
            onClick={() => setPilot("MANUAL")}
          >
            MANUAL
          </button>
        </div>
        <p className="mt-2 text-xs text-muted">
          {pilot === "AUTO"
            ? liveArmed
              ? "AUTO may turn on day-trader sleeve sells from the tape."
              : "AUTO accumulates. Day-trader sells stay off until admin Live."
            : "You pick variables. Admin can always toggle day-trader."}
        </p>

        <AutoLiveFeed
          call={call ?? null}
          bot7={bot7}
          px={px}
          lastTick={lastTick}
          now={now}
          gmBook={book}
          gmTicks={ticks}
          bot7Ticks={bot7Ticks}
          paperCash={paper.cashUsd}
          paperBtc={paper.btc}
        />
        <LiveTracks
          briefs={briefs}
          note="Bots 1–6 from this Coinbase cycle. 7-B0T reads these lanes — it does not average them."
        />

        <div className="mt-5 grid gap-4 lg:grid-cols-3">
          <Panel
            kicker="GM call"
            title={
              isGmAccumulate(call) ? (
                <GmRainbow text={`${call!.conviction} ${call!.stance}`} />
              ) : call ? (
                `${call.conviction} ${call.stance}`
              ) : (
                "Waiting on tape"
              )
            }
            kickerClass={bannerTone(call)}
            titleClass={call && !isGmAccumulate(call) ? bannerTone(call) : call ? undefined : "text-medium"}
          >
            {call ? (
              isGmAccumulate(call) ? (
                <p className="font-mono text-lg uppercase">
                  <GmRainbow text={`${call.conviction} CONVICTION ${call.stance}`} />
                </p>
              ) : (
                <CallWords call={call} className="font-mono text-lg" />
              )
            ) : (
              <p className="font-mono text-lg text-muted">—</p>
            )}
            {call?.clipUsd ? <p className={cn("font-mono text-sm", USD_TONE)}>{money(call.clipUsd, 0)}</p> : null}
            <Button className="mt-3" onClick={() => void rollBots({ force: true, admin })} disabled={busy}>
              Roll 7-B0T + bots 1–6
            </Button>
            <p
              className={cn(
                "mt-2 text-sm leading-relaxed",
                call && (call.conviction === "LOW" || call.stance === "HOLD") ? "text-sell" : "text-muted",
              )}
            >
              {call?.reason ?? "Pulling Coinbase tape…"}
            </p>
            {call?.triggers?.length ? (
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {call.triggers.map((t) => (
                  <li
                    key={t.id}
                    className={cn(
                      "rounded-md border border-rule px-2 py-1 font-mono text-[11px]",
                      call.sellSleeve ? "text-sell" : "text-high",
                    )}
                    title={t.why}
                  >
                    {t.label}
                    <span className="ml-1 text-muted">{t.why}</span>
                  </li>
                ))}
              </ul>
            ) : null}
            <p className="mt-3 font-mono text-xs text-muted">
              7-B0T{" "}
              {call ? (
                isGmAccumulate(call.vsBot7) ? (
                  <GmRainbow text={`${call.vsBot7.conviction} ${call.vsBot7.stance}`} />
                ) : (
                  `${call.vsBot7.conviction} ${call.vsBot7.stance}`
                )
              ) : (
                "—"
              )}
              {call?.vsBot7.clipUsd ? ` · ${money(call.vsBot7.clipUsd, 0)}` : ""}
            </p>
            <p className="mt-2 font-mono text-xs text-muted">
              {busy ? "scanning…" : lastTick ? `last ${new Date(lastTick).toLocaleTimeString("en-US")}` : "—"}
              {error ? ` · ${error}` : ""}
            </p>
          </Panel>
          <Panel kicker="Sleeve" title={liveArmed ? "Live GM book" : "Practice GM book"} kickerClass="text-high" titleClass="text-medium">
            <p className={cn("font-mono text-2xl tabular-nums", USD_TONE)}>{money(nav, 0)}</p>
            <p className="mt-1 font-mono text-sm">
              <span className={USD_TONE}>{money(book.cashUsd, 0)}</span>
              {" · "}
              <span className={BTC_TONE}>{book.btc.toFixed(6)} BTC</span>
            </p>
            <p className="mt-3 font-mono text-xs text-muted">Fund GM (USDC · Base / ETH)</p>
            <p className="mt-0.5 break-all font-mono text-[11px]">
              <a className={USD_TONE} href={GM_FUND_EXPLORER} target="_blank" rel="noreferrer">
                {GM_FUND_USDC}
              </a>
            </p>
            <p className="mt-2 font-mono text-xs">
              Profit taken{" "}
              <span className={BTC_TONE}>{(book.profitBtc ?? 0).toFixed(6)} BTC</span>
            </p>
            <p className="mt-1 break-all font-mono text-[11px] text-muted">
              →{" "}
              <a className={BTC_TONE} href={GM_PROFIT_EXPLORER} target="_blank" rel="noreferrer">
                {GM_PROFIT_BTC}
              </a>
            </p>
            <label className="mt-4 block text-sm" htmlFor="gm-cash">
              Practice fund {money(bookUsd, 0)}
            </label>
            <input
              id="gm-cash"
              type="range"
              min={GM_CASH_MIN}
              max={GM_CASH_MAX}
              step={GM_CASH_STEP}
              value={bookUsd}
              onChange={(e) => setBookUsd(Number(e.target.value))}
              className="mt-1 w-full"
            />
            <div className="mt-2 flex flex-wrap gap-2">
              <Button onClick={applyBook}>
                Set sleeve to {money(bookUsd, 0)}
              </Button>
              <Button onClick={resetBook}>
                Reset fills
              </Button>
            </div>
          </Panel>
          <Panel kicker="Risk" title={`Level ${risk} · ${risk * 20}%`} kickerClass="text-high" titleClass="text-medium">
            <input
              type="range"
              min={1}
              max={5}
              step={1}
              value={risk}
              onChange={(e) => setRisk(Number(e.target.value))}
              className="w-full"
              aria-label="GM risk 1 to 5"
            />
            <p className="mt-2 text-sm text-muted">
              1 = 20% of the sleeve at risk. 5 = 100%. Naked long/short needs 4–5.
            </p>
          </Panel>
        </div>

        <Panel className="mt-4" kicker="Variables" title={pilot === "AUTO" ? "AUTO mix (tape)" : "MANUAL mix"} kickerClass="text-high" titleClass="text-medium">
          <ul className="grid gap-3 sm:grid-cols-2">
            {GM_VAR_META.map((m) => {
              const on = vars[m.id];
              const effect = call?.effects.find((e) => e.id === m.id);
              const locked = m.id === "naked" && risk < 4 && !on;
              return (
                <li key={m.id} className="rounded-md border border-rule bg-bg p-3">
                  <label className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={on}
                      disabled={pilot === "AUTO" || locked}
                      onChange={(e) => setVar(m.id, e.target.checked)}
                      className="mt-1 size-4"
                    />
                    <span>
                      <span className="block text-sm font-medium">{m.label}</span>
                      <span className="mt-0.5 block text-xs text-muted">{m.hint}</span>
                    </span>
                  </label>
                  <p className={cn("mt-2 font-mono text-[11px]", on ? "text-high" : "text-muted")}>
                    {on ? "ON" : "OFF"} · {effect?.effect ?? "—"}
                  </p>
                </li>
              );
            })}
          </ul>
        </Panel>

        <Panel className="mt-4" kicker="Day-trader" title={`${dayHours}h candle`} kickerClass="text-high" titleClass="text-medium">
          <label className="block text-sm" htmlFor="gm-tf">
            Trade RSI 30/70 on the {dayHours}-hour Coinbase candle
          </label>
          <input
            id="gm-tf"
            type="range"
            min={GM_TF_MIN}
            max={GM_TF_MAX}
            step={1}
            value={dayHours}
            onChange={(e) => setDayHours(Number(e.target.value))}
            className="mt-1 w-full"
          />
          <p className="mt-1 font-mono text-[11px] text-muted">1h · 6h · 12h · 24h · {tf?.bars ?? 0} bars · RSI({tf?.period ?? 14})</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3 font-mono text-sm">
            <div>
              <p className="text-[11px] text-muted">{dayHours}h RSI</p>
              <p className={rsiTone(tf?.rsi, tf?.rsiAvg)}>
                {tf?.rsi != null ? tf.rsi.toFixed(1) : "—"}
                <span className="ml-2 text-muted">{tf?.now ?? ""}</span>
              </p>
            </div>
            <div>
              <p className="text-[11px] text-muted">1h RSI</p>
              <p className={rsiTone(tf?.rsi1h, 50)}>{tf?.rsi1h != null ? tf.rsi1h.toFixed(1) : "—"}</p>
            </div>
            <div>
              <p className="text-[11px] text-muted">vs 1h</p>
              <p>{tf?.vs1h ?? "—"}</p>
            </div>
          </div>
          {tf ? (
            <p className="mt-3 text-sm leading-relaxed text-muted">
              On this {tf.hours}h tape, RSI 30/70 would have fired{" "}
              <span className="text-high">{tf.sim.buys} buys</span> and{" "}
              <span className="text-sell">{tf.sim.sells} sleeve sells</span>. Simulated NAV{" "}
              <span className={USD_TONE}>{money(tf.sim.nav, 0)}</span>
              {" vs buy-hold "}
              <span className={USD_TONE}>{money(tf.sim.hold, 0)}</span>
              {" ("}
              <span className={tf.sim.deltaPct >= 0 ? "text-high" : "text-sell"}>
                {tf.sim.deltaPct >= 0 ? "+" : ""}
                {tf.sim.deltaPct.toFixed(1)}%
              </span>
              {"). 1h candle on the same window: "}
              {tf.sim.buys1h} buys / {tf.sim.sells1h} sells, NAV {money(tf.sim.nav1h, 0)}. This {tf.hours}h
              setting is{" "}
              <span className={tf.sim.vs1hPct >= 0 ? "text-high" : "text-sell"}>
                {tf.sim.vs1hPct >= 0 ? "+" : ""}
                {tf.sim.vs1hPct.toFixed(1)}%
              </span>{" "}
              vs 1h. Longer candles fire less often. Turn Classic day-trader ON to use this in the GM call.
            </p>
          ) : (
            <p className="mt-3 text-sm text-muted">Waiting on Coinbase hourly candles to fold into this timeframe.</p>
          )}
        </Panel>

        <Panel className="mt-4" kicker="Fills" title="GM sleeve history" kickerClass="text-high" titleClass="text-medium">
          {book.fills.length ? (
            <ul className="space-y-3">
              {book.fills.slice(0, 12).map((f, i) => (
                <li
                  key={f.id}
                  className={cn(
                    "rounded-md border p-3",
                    i === 0 ? "border-tab bg-surface" : "border-rule bg-bg",
                  )}
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <p className={cn("font-mono text-sm font-bold", f.side === "BUY" ? "text-high" : "text-sell")}>
                      {f.side === "BUY" ? "BUY" : f.kind === "trim" ? "SELL · profit BTC" : "SELL"}
                      {i === 0 ? " · last" : ""}
                    </p>
                    <p className="font-mono text-sm">
                      <span className={USD_TONE}>{money(f.usd, 0)}</span>
                      {" · "}
                      <span className={BTC_TONE}>{f.btc.toFixed(6)} BTC</span>
                    </p>
                  </div>
                  {f.triggers?.length ? (
                    <ul className="mt-2 flex flex-wrap gap-1.5">
                      {f.triggers.map((t) => (
                        <li
                          key={`${f.id}-${t.label}`}
                          className={cn(
                            "rounded-md px-2 py-1 font-mono text-[11px]",
                            f.side === "BUY" ? "bg-high/10 text-high" : "bg-sell/15 text-sell",
                          )}
                        >
                          {t.label}
                          <span className="ml-1 text-muted">{t.why}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-1 text-xs text-muted">{f.note}</p>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted">No GM fills yet. When a clip prints, the settings that fired it show here.</p>
          )}
        </Panel>
        <div className="mt-10 flex justify-end pb-2">
          <LoginCluster />
        </div>
      </main>
    </Shell>
  );
}

function AutoLiveFeed({
  call,
  bot7,
  px,
  lastTick,
  now,
  gmBook,
  gmTicks,
  bot7Ticks,
  paperCash,
  paperBtc,
}: {
  call: GmCall | null;
  bot7: { conviction: string; stance: string; clipUsd: number } | null;
  px: number;
  lastTick: string | null;
  now: number;
  gmBook: { cashUsd: number; btc: number; profitBtc: number; fills: PaperFill[] };
  gmTicks: GmTick[];
  bot7Ticks: PracticeTick[];
  paperCash: number;
  paperBtc: number;
}) {
  const age = lastTick ? Math.max(0, Math.floor((now - Date.parse(lastTick)) / 1000)) : null;
  const gmNav = gmBook.cashUsd + gmBook.btc * px;
  const bot7Nav = paperCash + paperBtc * px;
  const liveRows = gmTicks.length
    ? gmTicks.slice(0, 8).map((t) => ({
        at: t.at,
        text: `${t.call.conviction} ${t.call.stance}`,
        filled: t.executed,
        usd: t.call.clipUsd,
        btc: t.btc,
      }))
    : call
      ? [
          {
            at: new Date().toISOString(),
            text: `${call.conviction} ${call.stance}`,
            filled: false,
            usd: call.clipUsd,
            btc: gmBook.btc,
          },
        ]
      : [];
  const bot7Rows = bot7Ticks.length
    ? bot7Ticks.slice(0, 8).map((t) => ({
        at: t.at,
        text: `${t.conviction} ${t.stance}`,
        filled: t.executed,
        usd: t.clipUsd,
        btc: t.btc,
      }))
    : bot7
      ? [
          {
            at: new Date().toISOString(),
            text: `${bot7.conviction} ${bot7.stance}`,
            filled: false,
            usd: bot7.clipUsd,
            btc: paperBtc,
          },
        ]
      : [];
  return (
    <Panel className="mt-5" kicker="AUTO" title="Live tape" kickerClass="text-high" titleClass="text-high">
      <p className="text-sm text-muted">
        Live Coinbase tape. G M0D3 AUTO reads it with 7-B0T. Coinbase orders stay off until Live is unlocked.
      </p>
      <div className="mt-3 grid gap-3 sm:grid-cols-4 font-mono text-sm">
        <div>
          <p className="text-[11px] text-muted">GM NAV</p>
          <p className={USD_TONE}>{money(gmNav, 0)}</p>
          <p className={BTC_TONE}>{gmBook.btc.toFixed(6)} BTC</p>
        </div>
        <div>
          <p className="text-[11px] text-muted">7-B0T NAV</p>
          <p className={USD_TONE}>{money(bot7Nav, 0)}</p>
          <p className={BTC_TONE}>{paperBtc.toFixed(6)} BTC</p>
        </div>
        <div>
          <p className="text-[11px] text-muted">Call</p>
          {call ? (
            isGmAccumulate(call) ? (
              <GmRainbow text={`${call.conviction} ${call.stance}`} />
            ) : (
              <p className="uppercase">
                <span className={call.conviction === "MEDIUM" ? "call-medium" : call.conviction === "HIGH" ? "text-high" : "text-sell"}>
                  {call.conviction}
                </span>{" "}
                <span className={callStanceClass(call.stance)}>{call.stance}</span>
              </p>
            )
          ) : (
            <p className="text-muted">waiting tape</p>
          )}
        </div>
        <div>
          <p className="text-[11px] text-muted">Tape</p>
          <p className={USD_TONE}>{px ? money(px, 0) : "—"}</p>
          <p className="text-muted">{age != null ? `${age}s ago` : "live"}</p>
        </div>
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <TickList label="GM sleeve" rows={liveRows} />
        <TickList label="7-B0T" rows={bot7Rows} />
      </div>
    </Panel>
  );
}

function TickList({
  label,
  rows,
}: {
  label: string;
  rows: { at: string; text: string; filled: boolean; usd: number; btc: number }[];
}) {
  return (
    <div>
      <p className="font-mono text-[11px] tracking-[0.14em] text-medium uppercase">{label}</p>
      {rows.length ? (
        <ul className="mt-2 space-y-1.5">
          {rows.map((r) => (
            <li key={r.at + r.text} className="flex flex-wrap items-baseline justify-between gap-2 font-mono text-xs">
              <span className={r.filled ? "text-high" : "text-muted"}>
                {r.filled ? "FILL" : "scan"} ·{" "}
                {/HIGH(\s+CONVICTION)?\s+ACCUMULATE/.test(r.text) ? (
                  <GmRainbow text={r.text} />
                ) : (
                  <CallInk text={r.text} />
                )}
              </span>
              <span className="text-muted">
                {new Date(r.at).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                {r.filled ? ` · ${money(r.usd, 0)}` : ""}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-sm text-muted">Waiting on live tape.</p>
      )}
    </div>
  );
}
