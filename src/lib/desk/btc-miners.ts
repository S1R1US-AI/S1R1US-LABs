/**
 * "BTC M1N3Rz" (SEO "BTC Miners View") — personal bitcoin miner view for the
 * system admin console, built on solo CKPool (ckpool.org) free public data.
 *
 * Miner information is NEVER stripped from the system admin view. The
 * S1R1US.ai defaults below are free public data (a public stratum URL and a
 * public bitcoin receive address) and ship with every download as the
 * default entry for all systems. Any system admin — including a white label
 * admin — updates ONLY their own stratum + BTC receive address from the
 * dialogue boxes and hits Save. Blank + Save = the S1R1US.ai CKPool data
 * populates the dialogue boxes again. Client-safe. No secrets here.
 */

import {
  MINERS_DISCLAIMER,
  MINERS_HEADLINE,
  MINERS_PATH,
  SEO_TAB_MINERS,
  TAB_MINERS,
} from "../brand.ts";

export { MINERS_DISCLAIMER, MINERS_HEADLINE, MINERS_PATH, SEO_TAB_MINERS, TAB_MINERS };
export const MINERS_FAQ = "/faq#btc-miners";

/** S1R1US.ai system admin BTC key — default miner receive address for all systems. */
export const MINERS_DEFAULT_ADDRESS = "33kmWvmf3nz3255dGmbHxigb9X6Szv6cJ8";
/** Dialogue box "stratum+tcp://" default — solo CKPool primary. */
export const MINERS_DEFAULT_STRATUM = "solo.ckpool.org:3333";
/** Backup pool default — solo CKPool port 443 (for firewalled miners). */
export const MINERS_DEFAULT_BACKUP = "solo.ckpool.org:443";
/** Stratum scheme label for the dialogue box. */
export const MINERS_STRATUM_SCHEME = "stratum+tcp://";
/** Miner password on solo CKPool is ignored — anything works; "x" is the doc convention. */
export const MINERS_PASSWORD_NOTE = "Password: x (solo CKPool ignores it). Username: your BTC receive address, optional .workername suffix.";

/** ckpool.org docs used to set up this view. */
export const CKPOOL_DOCS = "https://ckpool.org";
export const CKPOOL_STATS_BASE = "https://stats.ckpool.org/users";
export const CKPOOL_SOLO_BASE = "https://solo.ckpool.org/users";

/** Free public stats page for a miner address (HTML view with graphs). */
export function ckpoolStatsUrl(address: string) {
  return `${CKPOOL_STATS_BASE}/${encodeURIComponent(String(address ?? "").trim() || MINERS_DEFAULT_ADDRESS)}`;
}
/** Free public JSON stats for a miner address (documented ckpool user endpoint). */
export function ckpoolUserJsonUrl(address: string) {
  return `${CKPOOL_SOLO_BASE}/${encodeURIComponent(String(address ?? "").trim() || MINERS_DEFAULT_ADDRESS)}`;
}

export type MinerConfig = {
  /** "stratum+tcp://" dialogue box — host:port, e.g. solo.ckpool.org:3333 */
  stratum: string;
  /** Backup pool dialogue box — host:port, e.g. solo.ckpool.org:443 */
  backup: string;
  /** BTC receiving address for the miners — the pool pays this address. */
  address: string;
};

export function defaultMinerConfig(): MinerConfig {
  return {
    stratum: MINERS_DEFAULT_STRATUM,
    backup: MINERS_DEFAULT_BACKUP,
    address: MINERS_DEFAULT_ADDRESS,
  };
}

/**
 * Blank + Save = S1R1US.ai CKPool data populates the dialogue boxes.
 * Only the most basic information is required: every blank box falls back
 * to the default entry for all systems.
 */
export function withMinerDefaults(raw: Partial<MinerConfig> | null | undefined): MinerConfig {
  const d = defaultMinerConfig();
  const stratum = String(raw?.stratum ?? "").trim().replace(/^stratum\+tcp:\/\//i, "");
  const backup = String(raw?.backup ?? "").trim().replace(/^stratum\+tcp:\/\//i, "");
  const address = String(raw?.address ?? "").trim();
  return {
    stratum: stratum || d.stratum,
    backup: backup || d.backup,
    address: address || d.address,
  };
}

/** host:port sanity for the stratum dialogue boxes. Blank is allowed (defaults apply). */
export function stratumError(raw: string): string | null {
  const v = String(raw ?? "").trim().replace(/^stratum\+tcp:\/\//i, "");
  if (!v) return null;
  if (!/^[a-z0-9]([a-z0-9.-]*[a-z0-9])?:\d{2,5}$/i.test(v)) {
    return "Use host:port — example solo.ckpool.org:3333.";
  }
  return null;
}

/** Legacy / SegWit / bech32 mainnet BTC address sanity. Blank is allowed (default applies). */
export function minerAddressError(raw: string): string | null {
  const v = String(raw ?? "").trim();
  if (!v) return null;
  if (/^(1|3)[1-9A-HJ-NP-Za-km-z]{25,34}$/.test(v)) return null;
  if (/^bc1[02-9ac-hj-np-z]{11,87}$/i.test(v)) return null;
  return "That does not look like a mainnet BTC address (1…, 3…, or bc1…).";
}

/** Full stratum URL for display: stratum+tcp://solo.ckpool.org:3333 */
export function stratumUrl(hostPort: string) {
  return `${MINERS_STRATUM_SCHEME}${String(hostPort ?? "").trim().replace(/^stratum\+tcp:\/\//i, "") || MINERS_DEFAULT_STRATUM}`;
}

/**
 * ckpool hashrate strings carry an SI suffix (e.g. "12.3T", "980G", "1.2P").
 * Returns TH/s. Bad input returns 0.
 */
export function parseCkpoolHash(raw: string | number | null | undefined): number {
  if (raw == null) return 0;
  if (typeof raw === "number") return Number.isFinite(raw) && raw > 0 ? raw / 1e12 : 0;
  const m = /^([0-9]*\.?[0-9]+)\s*([KMGTPEZ]?)$/i.exec(String(raw).trim());
  if (!m) return 0;
  const n = Number(m[1]);
  if (!Number.isFinite(n) || n < 0) return 0;
  const mult: Record<string, number> = { "": 1, K: 1e3, M: 1e6, G: 1e9, T: 1e12, P: 1e15, E: 1e18, Z: 1e21 };
  return (n * (mult[(m[2] ?? "").toUpperCase()] ?? 1)) / 1e12;
}

/** Pretty-print a TH/s value with the right unit. */
export function fmtThs(ths: number | null | undefined): string {
  const n = Number(ths);
  if (!Number.isFinite(n) || n <= 0) return "0 H/s";
  if (n >= 1e6) return `${(n / 1e6).toFixed(2)} EH/s`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(2)} PH/s`;
  if (n >= 1) return `${n.toFixed(2)} TH/s`;
  if (n >= 1e-3) return `${(n * 1e3).toFixed(2)} GH/s`;
  return `${(n * 1e6).toFixed(2)} MH/s`;
}

/**
 * Miner data populates the view only if the miners are ACTIVE on the pool:
 * a share in the last hour or a positive 1-hour decay average.
 */
export function minerActive(stats: { lastshare?: number | null; hashrate1hr?: string | number | null } | null | undefined, nowSec = Math.floor(Date.now() / 1000)): boolean {
  if (!stats) return false;
  const last = Number(stats.lastshare ?? 0);
  if (Number.isFinite(last) && last > 0 && nowSec - last <= 3600) return true;
  return parseCkpoolHash(stats.hashrate1hr ?? null) > 0;
}

/** Graph time frames — drop-down menu for the hash power graph. */
export const MINER_TIMEFRAMES = [
  { id: "hour", label: "By hour", windowMs: 60 * 60 * 1000, points: 60 },
  { id: "day", label: "By day", windowMs: 24 * 60 * 60 * 1000, points: 96 },
  { id: "month", label: "By month", windowMs: 30 * 24 * 60 * 60 * 1000, points: 90 },
  { id: "year", label: "By year", windowMs: 365 * 24 * 60 * 60 * 1000, points: 73 },
] as const;
export type MinerTimeframe = (typeof MINER_TIMEFRAMES)[number]["id"];

export type MinerSample = { t: number; ths: number; ths5m: number; ths1h: number };
export type MinerGraphPoint = { t: number; label: string; ths: number; ths5m: number; ths1h: number };

function frameOf(id: MinerTimeframe) {
  return MINER_TIMEFRAMES.find((f) => f.id === id) ?? MINER_TIMEFRAMES[1];
}

function labelFor(t: number, id: MinerTimeframe): string {
  const d = new Date(t);
  if (id === "hour" || id === "day") {
    return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false });
  }
  if (id === "month") return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  return d.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
}

/**
 * Bucket stored samples into the selected time frame (mean per bucket, like
 * the CKPool miner explorer graphs). Empty buckets carry no point.
 */
export function bucketMinerSamples(samples: MinerSample[], id: MinerTimeframe, now = Date.now()): MinerGraphPoint[] {
  const frame = frameOf(id);
  const start = now - frame.windowMs;
  const step = frame.windowMs / frame.points;
  const buckets = new Map<number, { n: number; ths: number; ths5m: number; ths1h: number }>();
  for (const s of samples ?? []) {
    if (!s || !Number.isFinite(s.t) || s.t < start || s.t > now) continue;
    const k = Math.min(frame.points - 1, Math.max(0, Math.floor((s.t - start) / step)));
    const b = buckets.get(k) ?? { n: 0, ths: 0, ths5m: 0, ths1h: 0 };
    b.n += 1;
    b.ths += Number(s.ths) || 0;
    b.ths5m += Number(s.ths5m) || 0;
    b.ths1h += Number(s.ths1h) || 0;
    buckets.set(k, b);
  }
  const out: MinerGraphPoint[] = [];
  for (let k = 0; k < frame.points; k++) {
    const b = buckets.get(k);
    if (!b || b.n === 0) continue;
    const t = start + k * step + step / 2;
    out.push({
      t,
      label: labelFor(t, id),
      ths: b.ths / b.n,
      ths5m: b.ths5m / b.n,
      ths1h: b.ths1h / b.n,
    });
  }
  return out;
}

/** Instruction module — how this function is used. Shared by /admin tab and /Bitcoin-Miners. */
export const MINERS_INSTRUCTIONS = [
  `Point your miner at ${MINERS_STRATUM_SCHEME}${MINERS_DEFAULT_STRATUM} (backup ${MINERS_STRATUM_SCHEME}${MINERS_DEFAULT_BACKUP}) — from the ckpool.org solo docs.`,
  "Set the miner USERNAME to the BTC receive address you control (optional .workername suffix, e.g. bc1….rig1). Password: x — solo CKPool ignores it.",
  `Open Admin → ${TAB_MINERS}. The dialogue boxes ship with the S1R1US.ai defaults (BTC key ${MINERS_DEFAULT_ADDRESS}) — the default entry for all systems.`,
  "To watch YOUR miners: enter your own stratum, backup pool, and BTC receive address, then hit Save. Each system admin updates only their own stratum.",
  "Blank a box and hit Save = the S1R1US.ai CKPool data populates the dialogue boxes again.",
  "Miner data populates the view when your miners are ACTIVE on the pool (a share in the last hour). Idle rigs show as idle — the free public stats stay visible.",
  "Pick By hour / By day / By month / By year from the drop-down to redraw the hash power graph — bright green tape with yellow (5m) and blue (1hr) contrast lines.",
  "Solo mining: if your rig finds a block, the pool pays the block reward to YOUR BTC address (CKPool solo fee applies). This host never touches the payout.",
] as const;

/** FAQ module for this function — rendered on /Bitcoin-Miners and folded into /faq. */
export const MINERS_FAQ_ITEMS: { id: string; q: string; a: string }[] = [
  {
    id: "btc-miners",
    q: `What is ${TAB_MINERS} (${SEO_TAB_MINERS})?`,
    a: `${TAB_MINERS} is the ${SEO_TAB_MINERS} — the personal bitcoin miner desk in the S1R1US.ai system admin console and the public ${MINERS_PATH} page. It reads free public solo CKPool (ckpool.org) stats for the configured BTC address — default ${MINERS_DEFAULT_ADDRESS}, the S1R1US.ai system admin BTC key — and renders a pro trading desk view: 1m/5m/1hr/1d/7d hash power, workers, best shares, and a bright green hash power graph with yellow and blue contrasts plus a By hour / By day / By month / By year drop-down. Miner data populates when miners are active on the pool. ${MINERS_DISCLAIMER}`,
  },
  {
    id: "btc-miners-setup",
    q: `How do I point my own miners at ${TAB_MINERS}?`,
    a: `Per the ckpool.org docs: set your miner URL to ${MINERS_STRATUM_SCHEME}${MINERS_DEFAULT_STRATUM} (backup ${MINERS_STRATUM_SCHEME}${MINERS_DEFAULT_BACKUP}), username = YOUR BTC receive address (optional .workername), password x. Then open Admin → ${TAB_MINERS} and enter the same stratum + BTC receive address in the dialogue boxes and hit Save — only the most basic information is required, and each system admin updates only their own stratum. Blank + Save restores the S1R1US.ai defaults. White label admins get the same dialogue boxes in the ${MINERS_PATH} setup of the /wh1t3 download — miner information is never stripped; enter your own CKPool stratum to rebuild the ${TAB_MINERS} data and view, or save blank to run on the S1R1US.ai CKPool data.`,
  },
  {
    id: "btc-miners-payout",
    q: `Where do ${TAB_MINERS} mining rewards go?`,
    a: `Straight from the pool to the BTC receiving address in the dialogue box — default ${MINERS_DEFAULT_ADDRESS} (the S1R1US.ai system admin BTC key) until a system admin changes it and hits Save. Solo CKPool pays the block reward to the address the miner mines under. This host never holds miner keys, never receives hash, never escrows a payout, and never places Coinbase orders. The view is read-only free public data from ${CKPOOL_STATS_BASE}/${MINERS_DEFAULT_ADDRESS}. Education only.`,
  },
];
