import { create } from "zustand";
import { persist } from "zustand/middleware";
import { LAUNCH_FREEZE } from "@/lib/launch/build";
import { DESK_POLL_MS } from "./poll";
import { useAutoRun } from "./auto-run";
import {
  clampGmCash,
  clampGmRisk,
  clampGmTf,
  DEFAULT_GM_VARS,
  gmCall,
  GM_CASH_MIN,
  GM_PROFIT_BTC,
  type GmCall,
  type GmPilot,
  type GmVars,
  type GmView,
} from "./gm";
import { peekDeskTape } from "./tape-client";
import type { PaperFill } from "./types";

export const GM_POLL_MS = DESK_POLL_MS;

type GmBook = {
  cashUsd: number;
  btc: number;
  profitBtc: number;
  fills: PaperFill[];
};

export type GmTick = {
  at: string;
  call: GmCall;
  executed: boolean;
  price: number | null;
  cash: number;
  btc: number;
  nav: number;
  book: "practice" | "live";
};

type GmState = {
  pilot: GmPilot;
  view: GmView;
  risk: number;
  bookUsd: number;
  dayHours: number;
  vars: GmVars;
  practice: GmBook;
  live: GmBook;
  ticks: GmTick[];
  lastTick: string | null;
  running: boolean;
  busy: boolean;
  error: string | null;
  liveUnlocked: boolean;
  setPilot: (p: GmPilot) => void;
  setView: (v: GmView) => void;
  setRisk: (n: number) => void;
  setBookUsd: (n: number) => void;
  setDayHours: (n: number) => void;
  setVar: (id: keyof GmVars, on: boolean) => void;
  applyBook: () => void;
  resetBook: () => void;
  setLiveUnlocked: (on: boolean) => void;
  start: () => void;
  tick: (opts: { admin: boolean }) => Promise<void>;
};

function emptyBook(cash: number): GmBook {
  return { cashUsd: cash, btc: 0, profitBtc: 0, fills: [] };
}

export function emptyGmPractice(cash: number) {
  return emptyBook(cash);
}

function navOf(book: GmBook, px: number | null) {
  return book.cashUsd + book.btc * (px ?? 0);
}

function applyFill(book: GmBook, fill: Omit<PaperFill, "id">): GmBook {
  const id = `gm-${Date.now().toString(36)}-${Math.random().toString(16).slice(2, 6)}`;
  const profitBtc = book.profitBtc ?? 0;
  if (fill.side === "BUY") {
    if (book.cashUsd < fill.usd) return book;
    return {
      cashUsd: book.cashUsd - fill.usd,
      btc: book.btc + fill.btc,
      profitBtc,
      fills: [{ ...fill, id, kind: fill.kind ?? "clip", openBtc: fill.btc }, ...book.fills].slice(0, 40),
    };
  }
  if (book.btc < fill.btc) return book;
  if (fill.kind === "trim") {
    return {
      cashUsd: book.cashUsd,
      btc: book.btc - fill.btc,
      profitBtc: profitBtc + fill.btc,
      fills: [{ ...fill, id, kind: "trim" as const, openBtc: 0 }, ...book.fills].slice(0, 40),
    };
  }
  return {
    cashUsd: book.cashUsd + fill.usd,
    btc: book.btc - fill.btc,
    profitBtc,
    fills: [{ ...fill, id, kind: fill.kind ?? "stop", openBtc: 0 }, ...book.fills].slice(0, 40),
  };
}

export const useGm = create<GmState>()(
  persist(
    (set, get) => ({
      pilot: "AUTO",
      view: "practice",
      risk: 2,
      bookUsd: 10_000,
      dayHours: 1,
      vars: { ...DEFAULT_GM_VARS },
      practice: emptyBook(10_000),
      live: emptyBook(10_000),
      ticks: [],
      lastTick: null,
      running: false,
      busy: false,
      error: null,
      liveUnlocked: false,
      setPilot: (pilot) => set({ pilot }),
      setView: (view) => {
        if (view === "live" && !get().liveUnlocked) {
          set({ view: "live" });
          return;
        }
        set({ view });
      },
      setRisk: (n) => set({ risk: clampGmRisk(n) }),
      setBookUsd: (n) => set({ bookUsd: clampGmCash(n) }),
      setDayHours: (n) => set({ dayHours: clampGmTf(n) }),
      setVar: (id, on) => set((s) => ({ vars: { ...s.vars, [id]: on } })),
      applyBook: () => {
        const cash = clampGmCash(get().bookUsd);
        set({
          bookUsd: cash,
          practice: emptyBook(cash),
          ticks: [],
          lastTick: null,
          error: null,
        });
      },
      resetBook: () => {
        const cash = clampGmCash(get().bookUsd);
        set({
          practice: emptyBook(cash),
          ticks: [],
          lastTick: null,
          error: null,
        });
      },
      setLiveUnlocked: (on) => set({ liveUnlocked: on, view: on ? get().view : get().view === "live" ? "live" : "practice" }),
      start: () => {
        if (LAUNCH_FREEZE) {
          set({ running: false, liveUnlocked: false, error: "Practice paused — LAUNCH BUILD DEPLOY #39" });
          return;
        }
        set({ running: true, error: null });
      },
      tick: async ({ admin }) => {
        if (LAUNCH_FREEZE && (get().running || get().liveUnlocked)) {
          set({ running: false, liveUnlocked: false });
        }
        if (get().busy) return;
        try {
          let snap = peekDeskTape();
          if (!snap) {
            set({ lastTick: new Date().toISOString() });
            return;
          }
          const liveOn = !LAUNCH_FREEZE && get().liveUnlocked && admin && get().view === "live";
          const bookKey = liveOn ? "live" : "practice";
          const book = get()[bookKey];
          const px = snap.btc.price;
          const nav = navOf(book, px);
          const call = gmCall(snap, nav || get().bookUsd, {
            pilot: get().pilot,
            risk: get().risk,
            manual: get().vars,
            adminLive: liveOn,
            dayHours: get().dayHours,
          });
          let next = book;
          let executed = false;
          const allowFill = !LAUNCH_FREEZE && get().running && (liveOn || useAutoRun.getState().fillsAllowed());
          if (allowFill && px && px > 0 && call.clipUsd > 0) {
            if (call.stance === "BUY" || call.stance === "ACCUMULATE") {
              const usd = Math.min(call.clipUsd, next.cashUsd);
              if (usd >= 10) {
                next = applyFill(next, {
                  at: snap.fetchedAt,
                  side: "BUY",
                  usd,
                  btc: usd / px,
                  price: px,
                  note: `GM ${call.conviction} ${call.stance}`,
                  kind: "clip",
                  triggers: call.triggers.map((t) => ({ label: t.label, why: t.why })),
                });
                executed = true;
              }
            } else if ((call.stance === "TRIM" || call.stance === "SHORT") && next.btc > 0) {
              const want = Math.min(call.clipUsd / px, next.btc);
              if (want > 0) {
                next = applyFill(next, {
                  at: snap.fetchedAt,
                  side: "SELL",
                  usd: want * px,
                  btc: want,
                  price: px,
                  note:
                    call.stance === "TRIM"
                      ? `GM profit → ${GM_PROFIT_BTC}`
                      : "GM sleeve SHORT close",
                  kind: call.stance === "TRIM" ? "trim" : "stop",
                  triggers: call.triggers.map((t) => ({ label: t.label, why: t.why })),
                });
                executed = true;
              }
            }
          }
          const tick: GmTick = {
            at: new Date().toISOString(),
            call,
            executed,
            price: px,
            cash: next.cashUsd,
            btc: next.btc,
            nav: navOf(next, px),
            book: bookKey,
          };
          if (bookKey === "live") {
            set({
              live: next,
              ticks: [tick, ...get().ticks].slice(0, 40),
              lastTick: tick.at,
              busy: false,
              error: null,
              vars: get().pilot === "AUTO" ? call.vars : get().vars,
            });
          } else {
            set({
              practice: next,
              ticks: [tick, ...get().ticks].slice(0, 40),
              lastTick: tick.at,
              busy: false,
              error: null,
              vars: get().pilot === "AUTO" ? call.vars : get().vars,
            });
          }
        } catch (e) {
          set({
            busy: false,
            error: `gm: ${e instanceof Error ? e.message : "tick failed"}`,
            lastTick: new Date().toISOString(),
          });
        }
      },
    }),
    { name: "s1r1us-gm-off-20260904", partialize: (s) => ({
      pilot: s.pilot,
      view: "practice" as const,
      risk: s.risk,
      bookUsd: s.bookUsd,
      dayHours: s.dayHours,
      vars: s.vars,
      practice: s.practice,
      ticks: s.ticks,
      running: s.running,
    }) },
  ),
);

export { GM_CASH_MIN };
