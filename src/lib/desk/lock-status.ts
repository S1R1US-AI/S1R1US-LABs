/** LoCK3D STATUS — functional desk locks. Client-safe public snapshot. Server writes via lock-status.server.ts. */

export const TAB_LOCK3D = "LoCK3D STATUS";
export const SEO_TAB_LOCK3D = "Locked Status";

export type DeskMode = "SIM" | "LIVE";
export type LockPlane = "system" | "app-admin";
export type TapeStatus = "TRUE LIVE" | "SIMULATED";

export type LockId = "agents" | "bot7Auto" | "gmAuto" | "gmManual" | "agentLive" | "hive";

export const LOCK_IDS: LockId[] = ["agents", "bot7Auto", "gmAuto", "gmManual", "agentLive", "hive"];

export const LOCK_META: Record<
  LockId,
  { id: LockId; name: string; seo: string; css: string; hint: string; copyAdmin: true }
> = {
  agents: {
    id: "agents",
    name: "AI Agents",
    seo: "external AI agents",
    css: "legal-purple",
    hint: "Allow or refuse external AI agents on 7-B0T JSON / MCP / A2A. Ping and waitlist stay up.",
    copyAdmin: true,
  },
  bot7Auto: {
    id: "bot7Auto",
    name: "7-B0T AUTO",
    seo: "Bot 7 AUTO live trades",
    css: "coinbase-orange",
    hint: "Live-intent for 7-B0T AUTO. This host never places Coinbase orders. Agents execute on THEIR Coinbase.",
    copyAdmin: true,
  },
  gmAuto: {
    id: "gmAuto",
    name: "G M0D3 AUTO",
    seo: "Godzilla Mode AUTO live trades",
    css: "gm-rainbow",
    hint: "Live-intent for G M0D3 AUTO. This host never holds keys. Operator / agent Coinbase only.",
    copyAdmin: true,
  },
  gmManual: {
    id: "gmManual",
    name: "G M0D3 M@NU@L",
    seo: "Godzilla Mode MANUAL live trades",
    css: "gm-rainbow",
    hint: "Live-intent for G M0D3 M@NU@L. Paper until unlocked. This host never creates orders.",
    copyAdmin: true,
  },
  agentLive: {
    id: "agentLive",
    name: "AI Agents LIVE",
    seo: "live trades for external AI agents only",
    css: "legal-purple",
    hint: "Live-intent for external AI agents only. They trade on THEIR Coinbase. GM sleeves stay as set.",
    copyAdmin: true,
  },
  hive: {
    id: "hive",
    name: "H1V3 SW@RM",
    seo: "Hive Swarm",
    css: "hive-nav",
    hint: "Pause or continue the paper hive. TEST data until go-live. Never escrow. Never hive_withdraw.",
    copyAdmin: true,
  },
};

export type LockFlags = Record<LockId, boolean>;

export type LockStore = {
  mode: DeskMode;
  locked: LockFlags;
  include: LockFlags;
  at: string | null;
  by: LockPlane | null;
};

export const LOCK_GIF_CLOSED = "/lock-closed.gif";
export const LOCK_GIF_OPEN = "/lock-open.gif";

export const LOCK_DEFAULT: LockStore = {
  mode: "SIM",
  locked: {
    agents: false,
    bot7Auto: true,
    gmAuto: true,
    gmManual: true,
    agentLive: true,
    hive: false,
  },
  include: {
    agents: true,
    bot7Auto: true,
    gmAuto: true,
    gmManual: true,
    agentLive: true,
    hive: true,
  },
  at: null,
  by: null,
};

export function emptyFlags(value: boolean): LockFlags {
  return {
    agents: value,
    bot7Auto: value,
    gmAuto: value,
    gmManual: value,
    agentLive: value,
    hive: value,
  };
}

export function normalizeFlags(raw: unknown, fallback: LockFlags): LockFlags {
  const src = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
  const next = { ...fallback };
  for (const id of LOCK_IDS) {
    if (typeof src[id] === "boolean") next[id] = src[id];
  }
  return next;
}

export type LockStatusPublic = {
  name: typeof TAB_LOCK3D;
  seo: typeof SEO_TAB_LOCK3D;
  mode: DeskMode;
  tape: TapeStatus;
  tapeNote: string;
  tapeLock: false;
  locked: LockFlags;
  include: LockFlags;
  masterLocked: boolean;
  at: string | null;
  by: LockPlane | null;
  gifs: { closed: string; open: string };
  rows: {
    id: LockId;
    name: string;
    seo: string;
    css: string;
    hint: string;
    locked: boolean;
    include: boolean;
    gif: string;
    label: "LOCKED" | "UNLOCKED";
  }[];
  trade: false;
  ordersCreate: false;
  keysOnThisHost: false;
  thisHostTrades: false;
  coinbaseCreate: false;
  championship: "system-only";
  dataPullPause: "system-only";
  agentExecuteOwnBook: boolean;
  notice: string;
};

export function lockStatusView(store: LockStore, tape: TapeStatus, tapeNote: string): LockStatusPublic {
  const rows = LOCK_IDS.map((id) => {
    const locked = store.locked[id];
    return {
      id,
      name: LOCK_META[id].name,
      seo: LOCK_META[id].seo,
      css: LOCK_META[id].css,
      hint: LOCK_META[id].hint,
      locked,
      include: store.include[id],
      gif: locked ? LOCK_GIF_CLOSED : LOCK_GIF_OPEN,
      label: (locked ? "LOCKED" : "UNLOCKED") as "LOCKED" | "UNLOCKED",
    };
  });
  const included = LOCK_IDS.filter((id) => store.include[id]);
  const masterLocked = included.length > 0 && included.every((id) => store.locked[id]);
  return {
    name: TAB_LOCK3D,
    seo: SEO_TAB_LOCK3D,
    mode: store.mode,
    tape,
    tapeNote,
    tapeLock: false,
    locked: store.locked,
    include: store.include,
    masterLocked,
    at: store.at,
    by: store.by,
    gifs: { closed: LOCK_GIF_CLOSED, open: LOCK_GIF_OPEN },
    rows,
    trade: false,
    ordersCreate: false,
    keysOnThisHost: false,
    thisHostTrades: false,
    coinbaseCreate: false,
    championship: "system-only",
    dataPullPause: "system-only",
    agentExecuteOwnBook: store.mode === "LIVE" && !store.locked.agentLive,
    notice:
      "LoCK3D STATUS is Admin (system or phone-app). Live tape is status only — simulated or true live — and is not a lock. Unlock is live-intent: agents and G M0D3 run on THEIR Coinbase. This host never places Coinbase orders, never holds keys, never escrows. Championship sim pause stays system Admin. Optional unlocks: AI Agents, 7-B0T AUTO, G M0D3 AUTO, G M0D3 M@NU@L, AI Agents LIVE only, H1V3 SW@RM. Mode SIM or LIVE does not create orders here.",
  };
}
