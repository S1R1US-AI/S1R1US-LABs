import { f as ckpoolStatsUrl, g as minerActive, m as defaultMinerConfig, p as ckpoolUserJsonUrl, v as parseCkpoolHash, x as withMinerDefaults } from "./btc-miners-C_ITq4f_.mjs";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
//#region node_modules/.nitro/vite/services/ssr/assets/btc-miners.server-DkmzOUil.js
/**
* BTC M1N3Rz server side — per-admin miner config store, free public solo
* CKPool stats fetch, and hash power history sampling for the graph.
*
* Each admin scope ("system" for /admin, "app" for the /app/admin copy)
* owns exactly one config row and can update ONLY its own stratum + BTC
* receive address. Missing / blank rows run on the S1R1US.ai defaults.
* Never stores keys. Never talks to Coinbase.
*/
var CONFIG_PATHS = process.env.NODE_TEST_CONTEXT ? ["/tmp/btc-miners-config-test.json"] : ["/tmp/btc-miners-config.json", "/workspace/data/btc-miners-config.json"];
var HISTORY_PATHS = process.env.NODE_TEST_CONTEXT ? ["/tmp/btc-miners-history-test.json"] : ["/tmp/btc-miners-history.json", "/workspace/data/btc-miners-history.json"];
var SAMPLE_MIN_GAP_MS = 6e4;
var FETCH_TIMEOUT_MS = 6e3;
var STATS_TTL_MS = 6e4;
function readJson(paths) {
	for (const p of paths) try {
		return JSON.parse(readFileSync(p, "utf8"));
	} catch {}
	return null;
}
function writeJson(paths, value) {
	const body = JSON.stringify(value);
	for (const p of paths) try {
		if (p.includes("/data/")) mkdirSync("/workspace/data", { recursive: true });
		writeFileSync(p, body);
	} catch {}
}
/** Load the saved config for a scope — S1R1US.ai defaults fill every blank box. */
function loadMinerConfig(scope) {
	const store = readJson(CONFIG_PATHS) ?? {};
	return withMinerDefaults(store[scope]);
}
/**
* Save a scope's OWN config. Blank + Save = S1R1US.ai CKPool data populates
* the dialogue boxes (defaults). Returns the effective config.
*/
function saveMinerConfig(scope, raw) {
	const store = readJson(CONFIG_PATHS) ?? {};
	const effective = withMinerDefaults(raw);
	store[scope] = effective;
	writeJson(CONFIG_PATHS, store);
	return effective;
}
var g = globalThis;
function normalizeStats(raw) {
	if (!raw || typeof raw !== "object") return null;
	const j = raw;
	const worker = Array.isArray(j.worker) ? j.worker.map((w) => ({
		workername: String(w.workername ?? ""),
		hashrate1m: String(w.hashrate1m ?? "0"),
		hashrate5m: String(w.hashrate5m ?? "0"),
		hashrate1hr: String(w.hashrate1hr ?? "0"),
		hashrate1d: String(w.hashrate1d ?? "0"),
		hashrate7d: String(w.hashrate7d ?? "0"),
		lastshare: Number(w.lastshare ?? 0) || 0,
		shares: Number(w.shares ?? 0) || 0,
		bestshare: Number(w.bestshare ?? 0) || 0,
		bestever: Number(w.bestever ?? 0) || 0
	})) : [];
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
		worker
	};
}
async function fetchCkpoolStats(address) {
	for (const url of [ckpoolUserJsonUrl(address), ckpoolStatsUrl(address)]) try {
		const res = await fetch(url, {
			signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
			headers: {
				accept: "application/json",
				"user-agent": "s1r1us.ai BTC M1N3Rz (read-only miner stats view)"
			}
		});
		if (!res.ok) continue;
		const text = await res.text();
		const stats = normalizeStats(JSON.parse(text));
		if (stats) return {
			stats,
			error: null
		};
	} catch {}
	return {
		stats: null,
		error: "CKPool stats unreachable — miner not yet active on the pool, or the pool is offline. The view keeps the last saved samples."
	};
}
function recordSample(address, stats, now) {
	const store = readJson(HISTORY_PATHS) ?? {};
	const rows = Array.isArray(store[address]) ? store[address] : [];
	const sample = {
		t: now,
		ths: parseCkpoolHash(stats.hashrate1m),
		ths5m: parseCkpoolHash(stats.hashrate5m),
		ths1h: parseCkpoolHash(stats.hashrate1hr)
	};
	const last = rows[rows.length - 1];
	if (!last || now - last.t >= SAMPLE_MIN_GAP_MS) {
		rows.push(sample);
		store[address] = rows.slice(-6e3);
		writeJson(HISTORY_PATHS, store);
	}
	return store[address] ?? rows;
}
function loadSamples(address) {
	const store = readJson(HISTORY_PATHS) ?? {};
	return Array.isArray(store[address]) ? store[address] : [];
}
/** Fetch (60s cache) the free public CKPool stats + history for one address. */
async function minerStatsView(address) {
	const addr = String(address ?? "").trim() || defaultMinerConfig().address;
	const now = Date.now();
	const cache = g.__btcMinersCache__ ??= {};
	const hit = cache[addr];
	if (hit && now - hit.at < STATS_TTL_MS) return hit.view;
	const { stats, error } = await fetchCkpoolStats(addr);
	const samples = stats ? recordSample(addr, stats, now) : loadSamples(addr);
	const view = {
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
			d7: parseCkpoolHash(stats?.hashrate7d)
		},
		samples
	};
	cache[addr] = {
		at: now,
		view
	};
	return view;
}
//#endregion
export { loadMinerConfig, minerStatsView, saveMinerConfig };
