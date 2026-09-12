/**
 * BTC M1N3Rz server side — per-admin miner config store, free public solo
 * CKPool stats fetch, and hash power history sampling for the graph.
 *
 * Each admin scope ("system" for /admin, "app" for the /app/admin copy)
 * owns exactly one config row and can update ONLY its own stratum + BTC
 * receive address. Missing / blank rows run on the S1R1US.ai defaults.
 * Never stores keys. Never talks to Coinbase.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import {
  ckpoolStatsUrl,
  ckpoolUserJsonUrl,
  defaultMinerConfig,
  minerActive,
  parseCkpoolHash,
  withMinerDefaults,
  type MinerConfig,
  type MinerSample,
} from "./btc-miners.ts";

export type MinerScope = "system" | "app";

type ConfigStore = Partial<Record<MinerScope, Partial<MinerConfig>>>;

const CONFIG_PATHS = process.env.NODE_TEST_CONTEXT
  ? ["/tmp/btc-miners-config-test.json"]
  : ["/tmp/btc-miners-config.json", "/workspace/data/btc-miners-config.json"];
const HISTORY_PATHS = process.env.NODE_TEST_CONTEXT
  ? ["/tmp/btc-miners-history-test.json"]
  : ["/tmp/btc-miners-history.json", "/workspace/data/btc-miners-history.json"];

/** Keep a year of samples with a hard cap (one sample per poll, min 60s apart). */
const HISTORY_MAX = 6_000;
const SAMPLE_MIN_GAP_MS = 60_000;
const FETCH_TIMEOUT_MS = 6_000;
const STATS_TTL_MS = 60_000;

function readJson<T>(paths: string[]): T | null {
  for (const p of paths) {
    try {
      return JSON.parse(readFileSync(p, "utf8")) as T;
    } catch {
      /* missing */
    }
  }
  return null;
}

function writeJson(paths: string[], value: unknown) {
  const body = JSON.stringify(value);
  for (const p of paths) {
    try {
      if (p.includes("/data/")) mkdirSync("/workspace/data", { recursive: true });
      writeFileSync(p, body);
    } catch {
      /* read-only path */
    }
  }
}

/** Load the saved config for a scope — S1R1US.ai defaults fill every blank box. */
export function loadMinerConfig(scope: MinerScope): MinerConfig {
  const store = readJson<ConfigStore>(CONFIG_PATHS) ?? {};
  return withMinerDefaults(store[scope]);
}

/**
 * Save a scope's OWN config. Blank + Save = S1R1US.ai CKPool data populates
 * the dialogue boxes (defaults). Returns the effective config.
 */
export function saveMinerConfig(scope: MinerScope, raw: Partial<MinerConfig>): MinerConfig {
  const store = readJson<ConfigStore>(CONFIG_PATHS) ?? {};
  const effective = withMinerDefaults(raw);
  store[scope] = effective;
  writeJson(CONFIG_PATHS, store);
  return effective;
}

export type CkpoolWorker = {
  workername: string;
  hashrate1m: string;
  hashrate5m: string;
  hashrate1hr: string;
  hashrate1d: string;
  hashrate7d: string;
  lastshare: number;
  shares: number;
  bestshare: number;
  bestever: number;
};

/** Documented solo CKPool user stats JSON (https://solo.ckpool.org/users/<address>). */
export type CkpoolUserStats = {
  hashrate1m: string;
  hashrate5m: string;
  hashrate1hr: string;
  hashrate1d: string;
  hashrate7d: string;
  lastshare: number;
  workers: number;
  shares: number;
  bestshare: number;
  bestever: number;
  authorised: number;
  worker: CkpoolWorker[];
};

export type MinerStatsView = {
  address: string;
  statsUrl: string;
  active: boolean;
  fetchedAt: number;
  error: string | null;
  stats: CkpoolUserStats | null;
  /** parsed TH/s for the metric row */
  ths: { m1: number; m5: number; h1: number; d1: number; d7: number };
  samples: MinerSample[];
};

type StatsCache = Record<string, { at: number; view: MinerStatsView }>;
type HistoryStore = Record<string, MinerSample[]>;

const g = globalThis as typeof globalThis & { __btcMinersCache__?: StatsCache };

function normalizeStats(raw: unknown): CkpoolUserStats | null {
  if (!raw || typeof raw !== "object") return null;
  const j = raw as Record<string, unknown>;
  const worker = Array.isArray(j.worker)
    ? (j.worker as Record<string, unknown>[]).map((w) => ({
        workername: String(w.workername ?? ""),
        hashrate1m: String(w.hashrate1m ?? "0"),
        hashrate5m: String(w.hashrate5m ?? "0"),
        hashrate1hr: String(w.hashrate1hr ?? "0"),
        hashrate1d: String(w.hashrate1d ?? "0"),
        hashrate7d: String(w.hashrate7d ?? "0"),
        lastshare: Number(w.lastshare ?? 0) || 0,
        shares: Number(w.shares ?? 0) || 0,
        bestshare: Number(w.bestshare ?? 0) || 0,
        bestever: Number(w.bestever ?? 0) || 0,
      }))
    : [];
  return {
    hashrate1m: String(j.hashrate1m ?? "0"),
    hashrate5m: String(j.hashrate5m ?? "0"),
    hashrate1hr: String(j.hashrate1hr ?? "0"),
    hashrate1d: String(j.hashrate1d ?? "0"),
    hashrate7d: String(j.hashrate7d ?? "0"),
    lastshare: Number(j.lastshare ?? 0) || 0,
    workers: Number(j.workers ?? worker.length) || worker.length,
    shares: Number(j.shares ?? 0) || 0,
    bestshare: Number(j.bestshare ?? 0) || 0,
    bestever: Number(j.bestever ?? 0) || 0,
    authorised: Number(j.authorised ?? 0) || 0,
    worker,
  };
}

async function fetchCkpoolStats(address: string): Promise<{ stats: CkpoolUserStats | null; error: string | null }> {
  for (const url of [ckpoolUserJsonUrl(address), ckpoolStatsUrl(address)]) {
    try {
      const res = await fetch(url, {
        signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
        headers: { accept: "application/json", "user-agent": "s1r1us.ai BTC M1N3Rz (read-only miner stats view)" },
      });
      if (!res.ok) continue;
      const text = await res.text();
      const stats = normalizeStats(JSON.parse(text));
      if (stats) return { stats, error: null };
    } catch {
      /* try next source */
    }
  }
  return { stats: null, error: "CKPool stats unreachable — miner not yet active on the pool, or the pool is offline. The view keeps the last saved samples." };
}

function recordSample(address: string, stats: CkpoolUserStats, now: number): MinerSample[] {
  const store = readJson<HistoryStore>(HISTORY_PATHS) ?? {};
  const rows = Array.isArray(store[address]) ? store[address] : [];
  const sample: MinerSample = {
    t: now,
    ths: parseCkpoolHash(stats.hashrate1m),
    ths5m: parseCkpoolHash(stats.hashrate5m),
    ths1h: parseCkpoolHash(stats.hashrate1hr),
  };
  const last = rows[rows.length - 1];
  if (!last || now - last.t >= SAMPLE_MIN_GAP_MS) {
    rows.push(sample);
    store[address] = rows.slice(-HISTORY_MAX);
    writeJson(HISTORY_PATHS, store);
  }
  return store[address] ?? rows;
}

function loadSamples(address: string): MinerSample[] {
  const store = readJson<HistoryStore>(HISTORY_PATHS) ?? {};
  return Array.isArray(store[address]) ? store[address] : [];
}

/** Fetch (60s cache) the free public CKPool stats + history for one address. */
export async function minerStatsView(address: string): Promise<MinerStatsView> {
  const addr = String(address ?? "").trim() || defaultMinerConfig().address;
  const now = Date.now();
  const cache = (g.__btcMinersCache__ ??= {});
  const hit = cache[addr];
  if (hit && now - hit.at < STATS_TTL_MS) return hit.view;

  const { stats, error } = await fetchCkpoolStats(addr);
  const samples = stats ? recordSample(addr, stats, now) : loadSamples(addr);
  const view: MinerStatsView = {
    address: addr,
    statsUrl: ckpoolStatsUrl(addr),
    active: minerActive(stats),
    fetchedAt: now,
    error,
    stats,
    ths: {
      m1: parseCkpoolHash(stats?.hashrate1m),
      m5: parseCkpoolHash(stats?.hashrate5m),
      h1: parseCkpoolHash(stats?.hashrate1hr),
      d1: parseCkpoolHash(stats?.hashrate1d),
      d7: parseCkpoolHash(stats?.hashrate7d),
    },
    samples,
  };
  cache[addr] = { at: now, view };
  return view;
}
