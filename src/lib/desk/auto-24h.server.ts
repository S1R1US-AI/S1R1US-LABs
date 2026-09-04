import { readFileSync } from "node:fs";
import { AUTO_RUN_CASH, AUTO_RUN_ID, AUTO_RUN_START_MS, AUTO_RUN_UNTIL_MS } from "./auto-window";
import type { DeskSnapshot } from "./types";

export type Auto24Book = {
  cashUsd: number;
  btc: number;
  fills: number;
  ticks: number;
  last: string;
};

export type Auto24State = {
  id: string;
  startedAt: string;
  until: string;
  paused: boolean;
  pausedAt: string | null;
  lastAt: string | null;
  lastPx: number | null;
  bot7: Auto24Book;
  gm: Auto24Book;
};

const DIR = "/workspace/data";
const PATH = `${DIR}/auto-24h.json`;

let mem: Auto24State | null = null;

function emptyBook(): Auto24Book {
  return { cashUsd: AUTO_RUN_CASH, btc: 0, fills: 0, ticks: 0, last: "disabled" };
}

function fresh(): Auto24State {
  return {
    id: AUTO_RUN_ID,
    startedAt: new Date(AUTO_RUN_START_MS).toISOString(),
    until: new Date(AUTO_RUN_UNTIL_MS).toISOString(),
    paused: true,
    pausedAt: new Date().toISOString(),
    lastAt: null,
    lastPx: null,
    bot7: emptyBook(),
    gm: emptyBook(),
  };
}

function load(): Auto24State {
  if (mem && mem.id === AUTO_RUN_ID) return { ...mem, paused: true };
  try {
    const raw = JSON.parse(readFileSync(PATH, "utf8")) as Auto24State;
    mem = { ...raw, paused: true, pausedAt: raw.pausedAt ?? new Date().toISOString() };
    return mem;
  } catch {
    mem = fresh();
    return mem;
  }
}

export function readAuto24h(): Auto24State {
  return load();
}

/** Never fills. Never attached to the live tape fill. */
export async function tickAuto24h(_snap: DeskSnapshot) {
  return;
}
