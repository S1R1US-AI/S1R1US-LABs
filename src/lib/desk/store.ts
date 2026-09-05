import { create } from "zustand";
import { persist } from "zustand/middleware";
import { initialStop, STOP_DEFAULT } from "./stops";
import type { PaperBook, PaperFill } from "./types";

const START_CASH = 1000;
export const CASH_MIN = 100;
export const CASH_MAX = 100_000;
export const CASH_STEP = 100;

function clampCash(n: number) {
  const x = Math.round(n / CASH_STEP) * CASH_STEP;
  return Math.min(CASH_MAX, Math.max(CASH_MIN, x));
}

function consumeOpen(fills: PaperFill[], qty: number): PaperFill[] {
  let left = qty;
  return fills.map((f) => {
    if (f.side !== "BUY" || left <= 0) return f;
    const open = f.openBtc ?? f.btc;
    if (open <= 0) return f;
    const take = Math.min(open, left);
    left -= take;
    return { ...f, openBtc: open - take };
  });
}

type BookState = PaperBook & {
  hydrate: () => void;
  fill: (f: Omit<PaperFill, "id">) => void;
  markPeaks: (last: number) => void;
  reset: (cash?: number) => void;
  setCash: (cash: number) => void;
};

export const usePaper = create<BookState>()(
  persist(
    (set, get) => ({
      cashUsd: START_CASH,
      btc: 0,
      profitBtc: 0,
      fills: [],
      hydrate: () => {
        void get();
      },
      markPeaks: (last) => {
        if (!last) return;
        set((s) => ({
          fills: s.fills.map((f) =>
            f.side === "BUY" && (f.openBtc ?? f.btc) > 0
              ? { ...f, peakPrice: Math.max(f.peakPrice ?? f.price, last) }
              : f,
          ),
        }));
      },
      fill: (f) => {
        const id = `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
        set((s) => {
          if (f.side === "BUY") {
            if (s.cashUsd < f.usd) return s;
            const row: PaperFill = {
              ...f,
              id,
              kind: f.kind ?? "clip",
              openBtc: f.btc,
              peakPrice: f.price,
              stopPrice: f.stopPrice ?? initialStop(f.price, STOP_DEFAULT),
            };
            return {
              cashUsd: s.cashUsd - f.usd,
              btc: s.btc + f.btc,
              profitBtc: s.profitBtc ?? 0,
              fills: [row, ...s.fills].slice(0, 40),
            };
          }
          if (s.btc < f.btc) return s;
          const kind = f.kind ?? "trim";
          const row: PaperFill = { ...f, id, kind, openBtc: 0 };
          const nextFills = consumeOpen([{ ...row }, ...s.fills], f.btc).slice(0, 40);
          if (kind === "stop") {
            return {
              cashUsd: s.cashUsd + f.usd,
              btc: s.btc - f.btc,
              profitBtc: s.profitBtc ?? 0,
              fills: nextFills,
            };
          }
          return {
            cashUsd: s.cashUsd,
            btc: s.btc - f.btc,
            profitBtc: (s.profitBtc ?? 0) + f.btc,
            fills: nextFills,
          };
        });
      },
      reset: (cash = START_CASH) =>
        set({ cashUsd: clampCash(cash), btc: 0, profitBtc: 0, fills: [] }),
      setCash: (cash) => set({ cashUsd: clampCash(cash) }),
    }),
    { name: "s1rius-paper-book-v1000" },
  ),
);

export const STARTING_CASH = START_CASH;
export { clampCash };