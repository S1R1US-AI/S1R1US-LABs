import { create } from "zustand";
import { persist } from "zustand/middleware";
import { APP_CALLS } from "@/lib/brand";
import { LAUNCH_BUILD, LAUNCH_FREEZE } from "@/lib/launch/build";
import { DESK_POLL_MS } from "./poll";
import { heliosCall, runBots } from "./signal";
import { peekDeskTape } from "./tape-client";
import { clampStop, initialStop, lotsThroughStop, openLots, STOP_DEFAULT } from "./stops";
import { clampCash, STARTING_CASH, usePaper } from "./store";
import { useAutoRun } from "./auto-run";
import type { BotBrief, HeliosCall, PaperFill, Stance } from "./types";

export const PRACTICE_MS = DESK_POLL_MS;
export const LIVE_UNLOCKED = false;
export const TEST_PHASE = "usdc-1000-v1";
export const TEST_PHASE_USDC = 1000;

export type PracticeTick = {
  at: string;
  stance: Stance;
  conviction: HeliosCall["conviction"];
  clipUsd: number;
  executed: boolean;
  reason: string;
  price: number | null;
  cash: number;
  btc: number;
  nav: number;
  bots: { id: string; name: string; stance: Stance; summary: string }[];
};

type PracticeState = {
  running: boolean;
  view: "practice" | "live";
  bookUsd: number;
  lastTick: string | null;
  error: string | null;
  busy: boolean;
  ticks: PracticeTick[];
  liveFills: PaperFill[];
  testPhase: string | null;
  stopPct: number;
  start: () => void;
  stop: () => void;
  setView: (view: "practice" | "live") => void;
  setBookUsd: (n: number) => void;
  setStopPct: (n: number) => void;
  applyBookUsd: () => void;
  resetBook: () => void;
  beginTestPhase: () => void;
  tick: () => Promise<void>;
};

function bookNav(price: number | null) {
  const { cashUsd, btc, profitBtc } = usePaper.getState();
  return cashUsd + (btc + (profitBtc ?? 0)) * (price ?? 0);
}

export const usePractice = create<PracticeState>()(
  persist(
    (set, get) => ({
      running: false,
      view: "practice",
      bookUsd: TEST_PHASE_USDC,
      lastTick: null,
      error: null,
      busy: false,
      ticks: [],
      liveFills: [],
      testPhase: null,
      stopPct: STOP_DEFAULT,
      start: () => {
        if (LAUNCH_FREEZE) {
          set({ running: false, error: `Practice paused — ${LAUNCH_BUILD}` });
          return;
        }
        set({ running: true, view: "practice", error: null });
      },
      stop: () => set({ running: false, error: null }),
      setView: (view) => {
        if (view === "live" && !LIVE_UNLOCKED) {
          set({ view: "live" });
          return;
        }
        set({ view });
      },
      setBookUsd: (n) => set({ bookUsd: clampCash(n) }),
      setStopPct: (n) => set({ stopPct: clampStop(n) }),
      applyBookUsd: () => {
        const n = get().bookUsd;
        usePaper.getState().setCash(n);
      },
      resetBook: () => {
        usePaper.getState().reset(get().bookUsd);
        set({ ticks: [], lastTick: null, error: null });
      },
      beginTestPhase: () => {
        if (LAUNCH_FREEZE) {
          set({ running: false, error: `Practice paused — ${LAUNCH_BUILD}` });
          return;
        }
        usePaper.getState().reset(TEST_PHASE_USDC);
        set({
          bookUsd: TEST_PHASE_USDC,
          running: true,
          view: "practice",
          ticks: [],
          lastTick: null,
          error: null,
          testPhase: TEST_PHASE,
        });
      },
      tick: async () => {
        if (LAUNCH_FREEZE && get().running) set({ running: false });
        if (get().busy) return;
        set({ busy: true, error: null });
        try {
          const snap = peekDeskTape();
          if (!snap) {
            set({ busy: false, lastTick: new Date().toISOString() });
            return;
          }
          const paper = usePaper.getState();
          const nav = bookNav(snap.btc.price) || STARTING_CASH;
          const bots = runBots(snap);
          const call = heliosCall(snap, bots, nav);
          const px = snap.btc.price ?? 0;
          const stopPct = get().stopPct;
          if (px) usePaper.getState().markPeaks(px);
          const lots = openLots(usePaper.getState().fills, px, stopPct);
          const hit = lotsThroughStop(lots, px);
          const view = get().view;
          const liveLocked = view === "live" && !LIVE_UNLOCKED;
          const fillPaper =
            !LAUNCH_FREEZE && get().running && !liveLocked && useAutoRun.getState().fillsAllowed();
          const buyStance = call.stance === "BUY" || call.stance === "ACCUMULATE";
          const actionable =
            buyStance &&
            (call.conviction === "HIGH" || (call.conviction === "MEDIUM" && fillPaper));
          let executed = false;
          let reason = `${call.conviction} ${call.stance} — no clip`;

          if (hit.length && px) {
            reason = `STOP watch ${hit.length} lot(s) · hold ${hit.reduce((s, l) => s + l.btc, 0).toFixed(6)} BTC — no sell (mandate)`;
          } else if (liveLocked) {
            reason = `${call.conviction} ${call.stance} — live call. Coinbase orders locked on this host.`;
            if (actionable) reason += ` Would BUY ${call.clipUsd.toFixed(0)} USDC (preview).`;
          } else if (!useAutoRun.getState().fillsAllowed()) {
            reason = `${call.conviction} ${call.stance} — practice PAUSED until further notice`;
          } else if (!actionable) {
            reason = `${call.conviction} ${call.stance} — wait (need HIGH or MEDIUM BUY/ACCUMULATE). Never sell.`;
          } else if (!px) {
            reason = "No Coinbase last — skipped";
          } else if (!fillPaper) {
            reason = `${call.conviction} ${call.stance} — scan only`;
          } else if (call.stance === "BUY" && lots.some((l) => l.pnlPct < -stopPct / 2)) {
            reason = "HIGH BUY blocked — open lot already losing; hold BTC, do not add, do not sell";
          } else {
            const want = call.conviction === "HIGH" ? call.clipUsd : call.clipUsd * 0.5;
            const usd = Math.min(paper.cashUsd, want);
            if (usd <= 0) reason = "Buy call but no USDC left in paper book";
            else {
              paper.fill({
                at: new Date().toISOString(),
                side: "BUY",
                usd,
                btc: usd / px,
                price: px,
                note: `PRACTICE ${APP_CALLS} ${call.stance} ${call.conviction}`,
                kind: "clip",
                stopPrice: initialStop(px, stopPct),
                peakPrice: px,
              });
              executed = true;
              reason = `Practice ${call.stance} ${usd.toFixed(2)} USDC → BTC`;
            }
          }
          const after = usePaper.getState();
          const tick: PracticeTick = {
            at: new Date().toISOString(),
            stance: call.stance,
            conviction: call.conviction,
            clipUsd: call.clipUsd,
            executed,
            reason,
            price: snap.btc.price,
            cash: after.cashUsd,
            btc: after.btc,
            nav: after.cashUsd + (after.btc + (after.profitBtc ?? 0)) * px,
            bots: bots.map((b: BotBrief) => ({
              id: b.id,
              name: b.name,
              stance: b.stance,
              summary: b.summary,
            })),
          };
          set({
            lastTick: tick.at,
            ticks: [tick, ...get().ticks].slice(0, 48),
            busy: false,
            error: null,
          });
        } catch (e) {
          set({
            busy: false,
            error: e instanceof Error ? e.message : "Practice tick failed",
            lastTick: new Date().toISOString(),
          });
        }
      },
    }),
    {
      name: "s1rius-practice-off-20260904",
      partialize: (s) => ({
        running: s.running,
        view: s.view,
        bookUsd: s.bookUsd,
        lastTick: s.lastTick,
        ticks: s.ticks,
        liveFills: s.liveFills,
        testPhase: s.testPhase,
        stopPct: s.stopPct,
      }),
    },
  ),
);
