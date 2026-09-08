/** Phone-admin lock change tickets. System admin applies. Never execute from app-admin. */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import type { LockId } from "./lock-status.ts";
import { LOCK_IDS } from "./lock-status.ts";

/** Live-intent rails phone admin may not request-unlock. */
export const PHONE_REQUEST_BLOCKED: LockId[] = ["bot7Auto", "gmAuto", "gmManual", "agentLive"];
export const PHONE_REQUEST_OK: LockId[] = ["agents", "hive", "pred"];

export type LockTicket = {
  id: string;
  at: string;
  by: "app-admin";
  ids: LockId[];
  locked: boolean;
  note: string;
  status: "open" | "applied" | "denied";
};

const PATH = "/tmp/lock-tickets.json";

function load(): LockTicket[] {
  try {
    const raw = JSON.parse(readFileSync(PATH, "utf8")) as LockTicket[];
    return Array.isArray(raw) ? raw : [];
  } catch {
    return [];
  }
}

function save(rows: LockTicket[]) {
  try {
    writeFileSync(PATH, JSON.stringify(rows.slice(-50), null, 2));
  } catch {
    try {
      mkdirSync("/tmp", { recursive: true });
      writeFileSync(PATH, JSON.stringify(rows.slice(-50), null, 2));
    } catch {
      /* preview */
    }
  }
}

export function listLockTickets() {
  return load();
}

export function fileLockTicket(ids: string[], locked: boolean, note: string): LockTicket | { error: string } {
  const clean = ids.filter((id): id is LockId => (LOCK_IDS as string[]).includes(id) && (PHONE_REQUEST_OK as string[]).includes(id));
  if (!clean.length) return { error: "No requestable rails (agents, hive, pred only). Live-intent locks stay system admin." };
  const row: LockTicket = {
    id: `t-${Date.now()}`,
    at: new Date().toISOString(),
    by: "app-admin",
    ids: clean,
    locked: Boolean(locked),
    note: String(note || "").slice(0, 240),
    status: "open",
  };
  const rows = load();
  rows.push(row);
  save(rows);
  return row;
}
