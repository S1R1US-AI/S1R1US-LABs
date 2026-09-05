import { useEffect, useState } from "react";
import { money, stanceClass, CallWords } from "@/components/helios-card";
import { OrderBookPanel } from "@/components/order-book-panel";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/shell";
import { LIVE_UNLOCKED, PRACTICE_MS, TEST_PHASE_USDC, usePractice } from "@/lib/desk/practice";
import { rollBots, DESK_POLL_MS } from "@/lib/desk/roll-bots";
import { openLots, STOP_MAX, STOP_MIN } from "@/lib/desk/stops";
import { CASH_MAX, CASH_MIN, CASH_STEP, usePaper } from "@/lib/desk/store";
import { cn, BTC_TONE, USD_TONE } from "@/lib/utils";

export function PracticeDesk() {
  const view = usePractice((s) => s.view);
  const setView = usePractice((s) => s.setView);
  const running = usePractice((s) => s.running);
  const start = usePractice((s) => s.start);
  const stop = usePractice((s) => s.stop);
  const resetBook = usePractice((s) => s.resetBook);
  const bookUsd = usePractice((s) => s.bookUsd);
  const setBookUsd = usePractice((s) => s.setBookUsd);
  const stopPct = usePractice((s) => s.stopPct);
  const setStopPct = usePractice((s) => s.setStopPct);
  const applyBookUsd = usePractice((s) => s.applyBookUsd);
  const tick = usePractice((s) => s.tick);
  const busy = usePractice((s) => s.busy);
  const error = usePractice((s) => s.error);
  const lastTick = usePractice((s) => s.lastTick);
  const ticks = usePractice((s) => s.ticks);
  const liveFills = usePractice((s) => s.liveFills);
  const fills = usePaper((s) => s.fills);
  const cash = usePaper((s) => s.cashUsd);
  const btc = usePaper((s) => s.btc);
  const profitBtc = usePaper((s) => s.profitBtc);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);
  useEffect(() => {
    void rollBots({ force: true });
    const id = window.setInterval(() => void rollBots(), DESK_POLL_MS);
    return () => window.clearInterval(id);
  }, []);

  const lastMs = lastTick ? new Date(lastTick).getTime() : 0;
  const remain = running && lastMs ? Math.max(0, lastMs + PRACTICE_MS - now) : 0;
  const mm = Math.floor(remain / 60000);
  const ss = Math.floor((remain % 60000) / 1000);
  const last = ticks[0];
  const px = last?.price ?? 0;
  const nav = cash + (btc + (profitBtc ?? 0)) * px;
  const lots = openLots(fills, px, stopPct);

  return (
    <Panel className="mt-4" kicker="Dialogue" title="Practice / Live trades">
      <p className="max-w-3xl text-sm leading-relaxed text-muted">
        Practice runs 24/7 with no admin click. All seven bots scan every 5 minutes. HIGH BUY /
        ACCUMULATE converts paper USDC → BTC. Never sells bitcoin. Never shorts. A stop only blocks
        add-on buys into a loser — BTC stays BTC. Live Coinbase create stays locked on this host.
      </p>

      <div className="desk-tabs mt-4 flex flex-wrap gap-1" role="tablist" aria-label="Trade mode">
        <button
          type="button"
          role="tab"
          aria-selected={view === "practice"}
          className={cn(
            "inline-flex h-10 min-h-10 items-center rounded-md px-3 text-sm font-medium",
            view === "practice" && "is-on",
          )}
          onClick={() => setView("practice")}
        >
          Practice
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={view === "live"}
          className={cn(
            "inline-flex h-10 min-h-10 items-center rounded-md px-3 text-sm font-medium",
            view === "live" && "is-on",
          )}
          onClick={() => setView("live")}
        >
          Live
        </button>
      </div>

      {view === "live" ? (
        <div className="mt-4">
          <div className="rounded-md border border-rule bg-bg p-4">
            <p className="font-mono text-xs tracking-[0.14em] text-sell uppercase">Live locked</p>
            <h3 className="mt-1 text-lg font-semibold text-fg">Not active until practice testing is complete</h3>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
              Live Coinbase orders stay off. The book below is the real Coinbase L2. The purchase
              ledger is empty until Live is unlocked. No CDP secret on this host.
            </p>
            <p className="mt-3 font-mono text-sm text-muted">LIVE_UNLOCKED = {LIVE_UNLOCKED ? "true" : "false"}</p>
          </div>
          {last ? (
            <div className="mt-4 rounded-md border border-rule bg-bg p-4">
              <p className="text-[11px] font-medium tracking-[0.08em] text-muted uppercase">
                Live bot-7 call · {new Date(last.at).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
              </p>
              <CallWords call={last} className="mt-1 font-mono text-sm" />
              {last.clipUsd ? (
                <p className="font-mono text-xs text-muted">clip {money(last.clipUsd, 0)}</p>
              ) : null}
              <p className="mt-1 text-sm text-muted">{last.reason}</p>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {last.bots.map((b) => (
                  <li key={b.id} className="rounded-sm border border-rule/70 px-2 py-1.5">
                    <p className="flex items-baseline justify-between gap-2">
                      <span className="text-sm">{b.name}</span>
                      <span className={cn("font-mono text-[11px]", stanceClass(b.stance))}>{b.stance}</span>
                    </p>
                    <p className="mt-0.5 line-clamp-2 text-xs text-muted">{b.summary}</p>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="mt-4 text-sm text-muted">Waiting for the next 5-minute live scan.</p>
          )}
          <div className="mt-3">
            <Button onClick={() => void tick()} disabled={busy}>
              Scan live now
            </Button>
          </div>
          <OrderBookPanel
            mode="live"
            stance={last?.stance ?? null}
            conviction={last?.conviction ?? null}
            fills={liveFills}
          />
        </div>
      ) : (
        <>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <Kicker k="Mode" v={running ? "SCANNING" : "PAUSED"} hint="5 min cadence" />
            <Kicker k="Next scan" v={running ? `${mm}:${String(ss).padStart(2, "0")}` : "—"} hint="All 7 bots" />
            <Kicker k="Paper USDC" v={money(cash, 2)} hint={`Book ${money(bookUsd, 0)}`} tone={USD_TONE} />
            <Kicker k="Paper BTC" v={btc.toFixed(6)} hint={px ? `@ ${money(px, 0)}` : "Coinbase"} tone={BTC_TONE} />
            <Kicker k="NAV" v={money(nav, 2)} hint="Cash + BTC" />
          </div>

          <div className="mt-4 rounded-md border border-rule bg-bg p-4">
            <div className="flex flex-wrap items-end justify-between gap-2">
              <label htmlFor="practice-usdc" className="text-sm">
                Practice USDC book
              </label>
              <p className={`font-mono text-sm tabular-nums ${USD_TONE}`}>{money(bookUsd, 0)}</p>
            </div>
            <input
              id="practice-usdc"
              type="range"
              min={CASH_MIN}
              max={CASH_MAX}
              step={CASH_STEP}
              value={bookUsd}
              onChange={(e) => setBookUsd(Number(e.target.value))}
              className="mt-2 w-full"
              aria-valuemin={CASH_MIN}
              aria-valuemax={CASH_MAX}
              aria-valuenow={bookUsd}
            />
            <div className="mt-1 flex justify-between font-mono text-[11px] text-muted">
              <span>{money(CASH_MIN, 0)}</span>
              <span>{money(CASH_MAX, 0)}</span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button variant="primary" type="button" onClick={() => applyBookUsd()}>
                Set USDC to {money(bookUsd, 0)}
              </Button>
              {[100, 500, 1_000, 5_000, 10_000].map((n) => (
                <Button key={n} type="button" onClick={() => setBookUsd(n)}>
                  {money(n, 0)}
                </Button>
              ))}
            </div>
            <p className="mt-2 text-xs text-muted">
              Set USDC replaces cash only (BTC stays). Reset book zeros BTC and fills, then uses this
              amount. Clips stay 1% / 2% of NAV.
            </p>
          </div>

          <div className="mt-4 rounded-md border border-rule bg-bg p-4">
            <div className="flex flex-wrap items-end justify-between gap-2">
              <label htmlFor="practice-stop" className="text-sm">
                Per-clip stop
              </label>
              <p className="font-mono text-sm tabular-nums text-sell">{(stopPct * 100).toFixed(2)}%</p>
            </div>
            <input
              id="practice-stop"
              type="range"
              min={STOP_MIN * 100}
              max={STOP_MAX * 100}
              step={0.25}
              value={stopPct * 100}
              onChange={(e) => setStopPct(Number(e.target.value) / 100)}
              className="mt-2 w-full"
            />
            <div className="mt-1 flex justify-between font-mono text-[11px] text-muted">
              <span>0%</span>
              <span>10%</span>
            </div>
            <p className="mt-2 text-xs text-muted">
              Stop is under that clip’s entry. After +1% it sits at entry so the lot cannot close at a USD
              loss. Stop returns USDC. It does not dump the profit wallet.
            </p>
            {lots.length ? (
              <ul className="mt-3 space-y-1 font-mono text-xs">
                {lots.map((l) => (
                  <li key={l.id} className="flex flex-wrap justify-between gap-2 border-b border-rule/50 py-1">
                    <span className={BTC_TONE}>{l.btc.toFixed(6)} BTC</span>
                    <span>entry {money(l.entry, 0)}</span>
                    <span className="text-sell">stop {money(l.stop, 0)}</span>
                    <span className={l.pnlPct >= 0 ? "text-up" : "text-down"}>
                      {l.pnlPct >= 0 ? "+" : ""}
                      {(l.pnlPct * 100).toFixed(2)}%
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-xs text-muted">No open lots.</p>
            )}
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {running ? (
              <Button onClick={() => stop()}>Pause fills</Button>
            ) : (
              <Button variant="primary" onClick={() => start()}>
                Resume fills
              </Button>
            )}
            <Button onClick={() => void tick()} disabled={busy}>
              Scan now
            </Button>
            <Button
              onClick={() => {
                resetBook();
                start();
                void usePractice.getState().tick();
              }}
            >
              Reset {money(bookUsd, 0)} book
            </Button>
          </div>
          {error ? <p className="mt-2 text-sm text-down">{error}</p> : null}
          {busy ? <p className="mt-2 text-sm text-muted">Scanning seven bots…</p> : null}

          {last ? (
            <div className="mt-4 rounded-md border border-rule bg-bg p-4">
              <p className="text-[11px] font-medium tracking-[0.08em] text-muted uppercase">
                Last call · {new Date(last.at).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
              </p>
              <CallWords call={last} className="mt-1 font-mono text-sm" />
              {last.clipUsd ? (
                <p className="font-mono text-xs text-muted">
                  clip {money(last.clipUsd, 0)}
                  {last.executed ? " · FILLED" : ""}
                </p>
              ) : null}
              <p className="mt-1 text-sm text-muted">{last.reason}</p>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {last.bots.map((b) => (
                  <li key={b.id} className="rounded-sm border border-rule/70 px-2 py-1.5">
                    <p className="flex items-baseline justify-between gap-2">
                      <span className="text-sm">{b.name}</span>
                      <span className={cn("font-mono text-[11px]", stanceClass(b.stance))}>{b.stance}</span>
                    </p>
                    <p className="mt-0.5 line-clamp-2 text-xs text-muted">{b.summary}</p>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="mt-4 text-sm text-muted">Waiting for the first 5-minute scan.</p>
          )}

          <ul className="mt-4 max-h-48 space-y-1 overflow-auto font-mono text-xs">
            {ticks.length ? (
              ticks.map((t) => (
                <li key={t.at} className="flex flex-wrap gap-2">
                  <span className="text-muted">
                    {new Date(t.at).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                  </span>
                  <span className={stanceClass(t.stance)}>
                    {t.conviction} {t.stance}
                  </span>
                  <span className={t.executed ? "text-high" : "text-muted"}>
                    {t.executed ? "FILL" : "skip"}
                  </span>
                  <span className="text-muted">{t.reason}</span>
                </li>
              ))
            ) : (
              <li className="text-muted">No practice ticks yet.</li>
            )}
          </ul>

          <OrderBookPanel
            mode="practice"
            stance={last?.stance ?? null}
            conviction={last?.conviction ?? null}
            fills={fills}
          />
        </>
      )}
    </Panel>
  );
}

function Kicker({
  k,
  v,
  hint,
  tone,
}: {
  k: string;
  v: string;
  hint: string;
  tone?: string;
}) {
  return (
    <div className="rounded-md border border-rule bg-bg px-3 py-2">
      <p className="text-[11px] font-medium tracking-[0.08em] text-muted uppercase">{k}</p>
      <p className={cn("mt-0.5 font-mono text-sm tabular-nums", tone)}>{v}</p>
      <p className="text-[11px] text-muted">{hint}</p>
    </div>
  );
}
