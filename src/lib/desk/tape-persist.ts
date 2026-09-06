/**
 * Last-good snapshot + admin data-pull pause.
 *
 * Pause is a test switch only. It MUST NOT:
 * - unlock live Coinbase create
 * - sell or short bitcoin
 * - change 7-B0T's accumulate mandate
 * - auto-green feed errors
 * - close/open the external AI gate
 * - write paper fills
 *
 * While paused the desk serves the last validated snapshot. Resume restores
 * the 5-minute pull clock. One process, one flag — Console and Security share it.
 */
import { existsSync, mkdirSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";
import type { DeskSnapshot } from "./types";

const LAST_PATH = "/tmp/desk-last-good.json";
const FREEZE_FLAG = "/tmp/desk-tape-freeze";
const STATE_PATHS = ["/tmp/desk-pull-pause.json", "/workspace/data/desk-pull-pause.json"];

type LastGood = { at: number; snap: DeskSnapshot };

export type PullPauseState = {
  paused: boolean;
  pausedAt: string | null;
  resumedAt: string | null;
};

type LastGoodMeta = {
  frozen: boolean;
  paused: boolean;
  pausedAt: string | null;
  resumedAt: string | null;
  at: number | null;
  ageMs: number | null;
  price: number | null;
};

const OPEN: PullPauseState = { paused: false, pausedAt: null, resumedAt: null };

let mem: LastGood | null = null;

function readPauseDisk(): PullPauseState | null {
  if (typeof window !== "undefined") return null;
  for (const p of STATE_PATHS) {
    try {
      const raw = JSON.parse(readFileSync(p, "utf8")) as PullPauseState;
      if (typeof raw?.paused === "boolean") {
        return {
          paused: raw.paused,
          pausedAt: raw.pausedAt ?? null,
          resumedAt: raw.resumedAt ?? null,
        };
      }
    } catch {
      /* missing */
    }
  }
  try {
    if (existsSync(FREEZE_FLAG)) return { paused: true, pausedAt: null, resumedAt: null };
  } catch {
    /* preview */
  }
  return null;
}

function writePauseDisk(s: PullPauseState) {
  if (typeof window !== "undefined") return;
  const body = JSON.stringify(s);
  for (const p of STATE_PATHS) {
    try {
      if (p.startsWith("/workspace/data")) mkdirSync("/workspace/data", { recursive: true });
      writeFileSync(p, body);
    } catch {
      /* preview */
    }
  }
  try {
    if (s.paused) writeFileSync(FREEZE_FLAG, "1");
    else if (existsSync(FREEZE_FLAG)) unlinkSync(FREEZE_FLAG);
  } catch {
    /* preview */
  }
}

export function pullPauseState(): PullPauseState {
  return readPauseDisk() ?? { ...OPEN };
}

export function isTapeFrozen(): boolean {
  return pullPauseState().paused;
}

export function setTapeFrozen(on: boolean): boolean {
  if (typeof window !== "undefined") return on;
  const cur = pullPauseState();
  const now = new Date().toISOString();
  const next: PullPauseState = on
    ? { paused: true, pausedAt: now, resumedAt: cur.resumedAt }
    : { paused: false, pausedAt: cur.pausedAt, resumedAt: now };
  writePauseDisk(next);
  return next.paused;
}

export function readLastGood(): LastGood | null {
  if (typeof window !== "undefined") return null;
  if (mem) return mem;
  try {
    if (!existsSync(LAST_PATH)) return null;
    const raw = JSON.parse(readFileSync(LAST_PATH, "utf8")) as LastGood;
    if (raw?.snap?.btc) {
      mem = raw;
      return raw;
    }
  } catch {
    /* corrupt */
  }
  return null;
}

export function writeLastGood(snap: DeskSnapshot) {
  if (typeof window !== "undefined") return;
  if (snap.btc?.price == null) return;
  const prev = mem?.snap;
  const keep = prev
    ? {
        ...snap,
        macro:
          (snap.macro?.m2?.points?.length ?? 0) >= 6 || (snap.macro?.cpiYoy?.points?.length ?? 0) >= 6
            ? snap.macro
            : prev.macro,
        strategy:
          snap.strategy?.products?.some((p) => (p.points?.length ?? 0) > 2 || p.change6m != null) ||
          (snap.strategy?.products?.length ?? 0) > (prev.strategy?.products?.length ?? 0)
            ? snap.strategy
            : prev.strategy?.products?.length
              ? prev.strategy
              : snap.strategy,
      }
    : snap;
  mem = { at: Date.now(), snap: keep };
  try {
    writeFileSync(LAST_PATH, JSON.stringify(mem));
  } catch {
    /* preview */
  }
}

export function lastGoodMeta(): LastGoodMeta {
  const g = readLastGood();
  const pause = pullPauseState();
  return {
    frozen: pause.paused,
    paused: pause.paused,
    pausedAt: pause.pausedAt,
    resumedAt: pause.resumedAt,
    at: g?.at ?? null,
    ageMs: g ? Date.now() - g.at : null,
    price: g?.snap.btc.price ?? null,
  };
}
