import { existsSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";
import type { DeskSnapshot } from "./types";

const LAST_PATH = "/tmp/desk-last-good.json";
const FREEZE_PATH = "/tmp/desk-tape-freeze";

type LastGood = { at: number; snap: DeskSnapshot };

let mem: LastGood | null = null;
let frozen: boolean | null = null;

export function isTapeFrozen(): boolean {
  if (typeof window !== "undefined") return false;
  try {
    frozen = existsSync(FREEZE_PATH);
  } catch {
    frozen = false;
  }
  return frozen;
}

export function setTapeFrozen(on: boolean): boolean {
  if (typeof window !== "undefined") return on;
  frozen = on;
  try {
    if (on) writeFileSync(FREEZE_PATH, "1");
    else if (existsSync(FREEZE_PATH)) unlinkSync(FREEZE_PATH);
  } catch {
    /* preview */
  }
  return on;
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

export function lastGoodMeta(): { frozen: boolean; at: number | null; ageMs: number | null; price: number | null } {
  const g = readLastGood();
  return {
    frozen: isTapeFrozen(),
    at: g?.at ?? null,
    ageMs: g ? Date.now() - g.at : null,
    price: g?.snap.btc.price ?? null,
  };
}
