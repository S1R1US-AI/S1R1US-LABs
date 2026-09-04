import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DEFAULT_GM_VARS, type GmVars } from "./gm";
import {
  AUTO_RUN_CASH,
  AUTO_RUN_ID,
  AUTO_RUN_UNTIL_MS,
  autoWindowOpen,
} from "./auto-window";

export {
  AUTO_RUN_CASH,
  AUTO_RUN_ID,
  AUTO_RUN_START_MS,
  AUTO_RUN_UNTIL_MS,
  AUTO_RUN_LABEL,
  autoWindowOpen,
} from "./auto-window";

export const CHECKPOINTS = [
  { day: 1 as const, at: AUTO_RUN_UNTIL_MS, label: "5 Sep 2026 13:40 ET · 24h close" },
];

export type DaySnap = {
  day: 1 | 2 | 3;
  at: string;
  bot7Fills: number;
  bot7Ticks: number;
  gmFills: number;
  gmTicks: number;
  cashUsd: number;
  btc: number;
  gmCash: number;
  gmBtc: number;
  lastCall: string;
};

export const FULL_GM_VARS: GmVars = {
  ...DEFAULT_GM_VARS,
  dca: true,
  buyGrid: true,
  flush: true,
  dayTrader: false,
  neutralGrid: false,
  fundingArb: false,
  naked: false,
};

type AutoState = {
  id: string;
  armed: boolean;
  paused: boolean;
  pausedAt: string | null;
  until: number;
  cash: number;
  days: DaySnap[];
  markArmed: () => void;
  recordDay: (snap: DaySnap) => void;
  pauseUntilNotice: () => void;
  fillsAllowed: () => boolean;
  windowOpen: () => boolean;
};

export const useAutoRun = create<AutoState>()(
  persist(
    (set, get) => ({
      id: AUTO_RUN_ID,
      armed: false,
      paused: true,
      pausedAt: new Date().toISOString(),
      until: AUTO_RUN_UNTIL_MS,
      cash: AUTO_RUN_CASH,
      days: [],
      windowOpen: () => false,
      fillsAllowed: () => false,
      markArmed: () =>
        set({
          id: AUTO_RUN_ID,
          armed: true,
          paused: false,
          pausedAt: null,
          until: AUTO_RUN_UNTIL_MS,
          cash: AUTO_RUN_CASH,
        }),
      recordDay: (snap) =>
        set((s) => ({
          days: [...s.days.filter((d) => d.day !== snap.day), snap].sort((a, b) => a.day - b.day),
        })),
      pauseUntilNotice: () =>
        set({
          paused: true,
          pausedAt: new Date().toISOString(),
        }),
    }),
    { name: "s1r1us-auto-run-paused-20260904" },
  ),
);
