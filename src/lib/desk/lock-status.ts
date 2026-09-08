/** LoCK3D STATUS — functional desk locks. Client-safe public snapshot. Server writes via lock-status.server.ts. */

export const TAB_LOCK3D = "LoCK3D STATUS";
export const SEO_TAB_LOCK3D = "Locked Status";

export type DeskMode = "SIM" | "LIVE";
export type LockPlane = "system" | "app-admin";
export type TapeStatus = "TRUE LIVE" | "SIMULATED";

export type LockId = "agents" | "bot7Auto" | "gmAuto" | "gmManual" | "agentLive" | "hive" | "pred";

export const LOCK_IDS: LockId[] = ["agents", "bot7Auto", "gmAuto", "gmManual", "agentLive", "hive", "pred"];

export type LockHref = "/" | "/gm" | "/agent" | "/h1v3" | "/helios" | "/pr3d";

export const LOCK_META: Record<
  LockId,
  { id: LockId; name: string; seo: string; css: string; hint: string; copyAdmin: true; to: LockHref; hash?: string }
> = {
  agents: {
    id: "agents",
    name: "AI Agents",
    seo: "external AI agents",
    css: "legal-purple",
    hint: "Allow or refuse external AI agents on 7-B0T JSON / MCP / A2A. Ping and waitlist stay up.",
    copyAdmin: true,
    to: "/agent",
  },
  bot7Auto: {
    id: "bot7Auto",
    name: "7-B0T AUTO",
    seo: "7-B0T AUTO live trades",
    css: "coinbase-orange",
    hint: "Live-intent for 7-B0T AUTO. This host never places Coinbase orders. Agents execute on THEIR Coinbase.",
    copyAdmin: true,
    to: "/",
    hash: "bot7",
  },
  gmAuto: {
    id: "gmAuto",
    name: "G M0D3 AUTO",
    seo: "Godzilla Mode AUTO live trades",
    css: "gm-rainbow",
    hint: "Live-intent for G M0D3 AUTO. This host never holds keys. Operator / agent Coinbase only.",
    copyAdmin: true,
    to: "/gm",
    hash: "auto",
  },
  gmManual: {
    id: "gmManual",
    name: "G M0D3 M@NU@L",
    seo: "Godzilla Mode MANUAL live trades",
    css: "gm-rainbow",
    hint: "Live-intent for G M0D3 M@NU@L. Paper until unlocked. This host never creates orders.",
    copyAdmin: true,
    to: "/gm",
    hash: "manual",
  },
  agentLive: {
    id: "agentLive",
    name: "AI Agents LIVE",
    seo: "live trades for external AI agents only",
    css: "legal-purple",
    hint: "Live-intent for external AI agents only. They trade on THEIR Coinbase. GM sleeves stay as set.",
    copyAdmin: true,
    to: "/agent",
    hash: "live",
  },
  hive: {
    id: "hive",
    name: "H1V3 SW@RM",
    seo: "Hive Swarm",
    css: "hive-nav",
    hint: "Pause or continue the paper hive. TEST data until go-live. Never escrow. Never hive_withdraw.",
    copyAdmin: true,
    to: "/h1v3",
  },
  pred: {
    id: "pred",
    name: "PR3D1CT10N$",
    seo: "AI Agent Prediction Market",
    css: "pred-nav",
    hint: "Education paper market. Fake S1R1U$. This host never takes bets. Click opens /pr3d.",
    copyAdmin: true,
    to: "/pr3d",
  },
};

export function lockViewPath(id: LockId): string {
  const m = LOCK_META[id];
  return m.hash ? `${m.to}#${m.hash}` : m.to;
}

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
export const LOCK_GIF_OPEN_ALIAS = "/lock-open.gif";
export const LOCK_GIF_OPEN_NAME = "AI Agent Lock System for AI Agent BTC Trading Bot";

export const LOCK_DEFAULT: LockStore = {
  mode: "SIM",
  locked: {
    agents: false,
    bot7Auto: true,
    gmAuto: true,
    gmManual: true,
    agentLive: true,
    hive: false,
    pred: true,
  },
  include: {
    agents: true,
    bot7Auto: true,
    gmAuto: true,
    gmManual: true,
    agentLive: true,
    hive: true,
    pred: true,
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
    pred: value,
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
    to: LockHref;
    hash?: string;
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
      to: LOCK_META[id].to,
      hash: LOCK_META[id].hash,
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
      "LoCK3D STATUS is Admin. System admin is top-level. Phone-app admin is subordinate and cannot change system-admin rights or source. AI agents cannot view or change system-admin rights. Live tape is status only. This host never places Coinbase orders. PR3D1CT10N$ is paper education — click opens /pr3d. Championship pause stays system Admin.",
  };
}

/** Split rails into UNLOCKED vs LOCKED sets. UNLOCKED stacks above LOCKED. */
export function groupLockRows<T extends { locked: boolean }>(rows: T[]) {
  return {
    unlocked: rows.filter((r) => !r.locked),
    locked: rows.filter((r) => r.locked),
  };
}
