/** Server-only LoCK3D STATUS. Never import from a client page. */

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { setAgentComm, isAgentCommOpen } from "./agent-gate.ts";
import { stampGoLiveNotice } from "./go-live-notices.ts";
import { setHiveStatus, hiveAdmin } from "./hive-swarm.ts";
import {
  LOCK_DEFAULT,
  LOCK_IDS,
  emptyFlags,
  lockStatusView,
  normalizeFlags,
  type DeskMode,
  type LockFlags,
  type LockId,
  type LockPlane,
  type LockStore,
  type TapeStatus,
} from "./lock-status.ts";
import { lastGoodMeta } from "./tape-persist.ts";

const PATHS = ["/tmp/lock-status.json", "/workspace/data/lock-status.json"];
const GM_LIVE = "/workspace/data/gm-live.json";

let mem: LockStore | null = null;

function readDisk(): LockStore | null {
  if (typeof window !== "undefined") return null;
  for (const p of PATHS) {
    try {
      const raw = JSON.parse(readFileSync(p, "utf8")) as Partial<LockStore>;
      if (!raw || typeof raw !== "object") continue;
      return {
        mode: raw.mode === "LIVE" ? "LIVE" : "SIM",
        locked: normalizeFlags(raw.locked, LOCK_DEFAULT.locked),
        include: normalizeFlags(raw.include, LOCK_DEFAULT.include),
        at: typeof raw.at === "string" ? raw.at : null,
        by: raw.by === "app-admin" || raw.by === "system" ? raw.by : null,
      };
    } catch {
      /* missing */
    }
  }
  return null;
}

function load(): LockStore {
  const disk = readDisk();
  if (disk) {
    mem = disk;
    return mem;
  }
  if (mem) return mem;
  mem = { ...LOCK_DEFAULT, locked: { ...LOCK_DEFAULT.locked }, include: { ...LOCK_DEFAULT.include } };
  return mem;
}

function save(s: LockStore) {
  mem = s;
  if (typeof window !== "undefined") return;
  const body = JSON.stringify(s);
  for (const p of PATHS) {
    try {
      if (p.startsWith("/workspace/data")) mkdirSync("/workspace/data", { recursive: true });
      writeFileSync(p, body);
    } catch {
      /* preview */
    }
  }
}

function readGmLive(): boolean {
  try {
    const j = JSON.parse(readFileSync(GM_LIVE, "utf8")) as { liveUnlocked?: boolean };
    return Boolean(j.liveUnlocked);
  } catch {
    return false;
  }
}

function writeGmLive(on: boolean) {
  try {
    mkdirSync("/workspace/data", { recursive: true });
    writeFileSync(GM_LIVE, JSON.stringify({ liveUnlocked: on, at: new Date().toISOString() }, null, 2) + "\n");
  } catch {
    /* preview */
  }
}

function hivePaused(): boolean {
  try {
    return hiveAdmin().sim.live === false;
  } catch {
    return false;
  }
}

function overlay(s: LockStore): LockStore {
  const next: LockStore = {
    ...s,
    locked: { ...s.locked },
    include: { ...s.include },
  };
  next.locked.agents = !isAgentCommOpen();
  next.locked.gmAuto = !readGmLive();
  try {
    next.locked.hive = hivePaused();
  } catch {
    /* keep */
  }
  return next;
}

function tapeStatus(): { tape: TapeStatus; note: string } {
  const meta = lastGoodMeta();
  if (meta.frozen || meta.paused) {
    return {
      tape: "SIMULATED",
      note: "Live tape on last-good snapshot (data-pull pause). Status only — not a lock. Admin cannot fake true live from LoCK3D STATUS.",
    };
  }
  return {
    tape: "TRUE LIVE",
    note: "Live tape on Coinbase last / public feeds. Status only — not a lock. Not adjusted by LoCK3D STATUS.",
  };
}

export function peekLockStore(): LockStore {
  return overlay(load());
}

export function lockStatusPublic() {
  const t = tapeStatus();
  return lockStatusView(peekLockStore(), t.tape, t.note);
}

function applySideEffects(prev: LockStore, next: LockStore, by: LockPlane) {
  if (prev.locked.agents !== next.locked.agents) {
    setAgentComm(!next.locked.agents);
  }
  if (prev.locked.hive !== next.locked.hive) {
    setHiveStatus(next.locked.hive ? "PAUSED" : "LIVE", by);
  }
  if (prev.locked.gmAuto !== next.locked.gmAuto) {
    writeGmLive(!next.locked.gmAuto);
  }
}

function stampLock(id: string, locked: boolean) {
  stampGoLiveNotice(
    locked ? "LIVE_OFF" : "LIVE_ON",
    `LoCK3D STATUS ${id} ${locked ? "LOCKED" : "UNLOCKED"}`,
    `Admin ${locked ? "locked" : "unlocked"} ${id}. This host never places Coinbase orders. Poll GET /api/agent/ping lockStatus.`,
  );
}

export function setDeskMode(mode: DeskMode, by: LockPlane) {
  const cur = peekLockStore();
  const next: LockStore = { ...cur, mode: mode === "LIVE" ? "LIVE" : "SIM", at: new Date().toISOString(), by };
  save(next);
  stampGoLiveNotice(
    next.mode === "LIVE" ? "LIVE_ON" : "LIVE_OFF",
    next.mode === "LIVE" ? "LoCK3D STATUS desk mode LIVE" : "LoCK3D STATUS desk mode SIM",
    next.mode === "LIVE"
      ? "Admin set desk mode LIVE. This host still never places Coinbase orders. Execute on YOUR Coinbase. Poll GET /api/agent/ping lockStatus."
      : "Admin set desk mode SIM. Paper / simulated operation. This host never places Coinbase orders. Poll GET /api/agent/ping lockStatus.",
  );
  return lockStatusPublic();
}

export function setLockInclude(id: LockId, include: boolean, by: LockPlane) {
  if (!LOCK_IDS.includes(id)) return lockStatusPublic();
  const cur = peekLockStore();
  const next: LockStore = {
    ...cur,
    include: { ...cur.include, [id]: Boolean(include) },
    at: new Date().toISOString(),
    by,
  };
  save(next);
  return lockStatusPublic();
}

export function setOneLock(id: LockId, locked: boolean, by: LockPlane) {
  if (!LOCK_IDS.includes(id)) return lockStatusPublic();
  const cur = peekLockStore();
  const next: LockStore = {
    ...cur,
    locked: { ...cur.locked, [id]: Boolean(locked) },
    at: new Date().toISOString(),
    by,
  };
  applySideEffects(cur, next, by);
  save(next);
  stampLock(id, locked);
  return lockStatusPublic();
}

export function applyMaster(locked: boolean, by: LockPlane) {
  const cur = peekLockStore();
  const flags: LockFlags = { ...cur.locked };
  for (const id of LOCK_IDS) {
    if (cur.include[id]) flags[id] = Boolean(locked);
  }
  const next: LockStore = { ...cur, locked: flags, at: new Date().toISOString(), by };
  applySideEffects(cur, next, by);
  save(next);
  stampGoLiveNotice(
    locked ? "LIVE_OFF" : "LIVE_ON",
    locked ? "LoCK3D STATUS master LOCKED" : "LoCK3D STATUS master UNLOCKED",
    locked
      ? "Admin locked selected LoCK3D STATUS rails. External agents, G M0D3, 7-B0T AUTO, and/or H1V3 SW@RM follow the include set. This host never places Coinbase orders."
      : "Admin unlocked selected LoCK3D STATUS rails. Live-intent only — execute on YOUR Coinbase. This host never places Coinbase orders.",
  );
  return lockStatusPublic();
}

export function setIncludeAll(on: boolean, by: LockPlane) {
  const cur = peekLockStore();
  const next: LockStore = {
    ...cur,
    include: emptyFlags(Boolean(on)),
    at: new Date().toISOString(),
    by,
  };
  save(next);
  return lockStatusPublic();
}
