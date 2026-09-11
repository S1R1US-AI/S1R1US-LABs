import { a as LOCK_IDS, f as lockStatusView, l as emptyFlags, m as normalizeFlags, t as LOCK_DEFAULT } from "./lock-status-A0BH-v5S.mjs";
import { n as lastGoodMeta } from "./tape-persist-CHN2yE-V.mjs";
import { r as stampGoLiveNotice } from "./go-live-notices-y5KTHj_G.mjs";
import { a as setAgentComm, i as isAgentCommOpen } from "./agent-gate-CNwhGUzr.mjs";
import { s as setHiveStatus, t as hiveAdmin } from "./hive-swarm-DY1fJwzJ.mjs";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
//#region node_modules/.nitro/vite/services/ssr/assets/lock-status.server-BCjs8Xb9.js
/** Server-only LoCK3D STATUS. Never import from a client page. */
var PATHS = ["/tmp/lock-status.json", "/workspace/data/lock-status.json"];
var GM_LIVE = "/workspace/data/gm-live.json";
var mem = null;
function systemOnly(by) {
	return by === "system";
}
function readDisk() {
	if (typeof window !== "undefined") return null;
	for (const p of PATHS) try {
		const raw = JSON.parse(readFileSync(p, "utf8"));
		if (!raw || typeof raw !== "object") continue;
		return {
			mode: raw.mode === "LIVE" ? "LIVE" : "SIM",
			locked: normalizeFlags(raw.locked, LOCK_DEFAULT.locked),
			include: normalizeFlags(raw.include, LOCK_DEFAULT.include),
			at: typeof raw.at === "string" ? raw.at : null,
			by: raw.by === "app-admin" || raw.by === "system" ? raw.by : null
		};
	} catch {}
	return null;
}
function load() {
	const disk = readDisk();
	if (disk) {
		mem = disk;
		return mem;
	}
	if (mem) return mem;
	mem = {
		...LOCK_DEFAULT,
		locked: { ...LOCK_DEFAULT.locked },
		include: { ...LOCK_DEFAULT.include }
	};
	return mem;
}
function save(s) {
	mem = s;
	if (typeof window !== "undefined") return;
	const body = JSON.stringify(s);
	for (const p of PATHS) try {
		if (p.startsWith("/workspace/data")) mkdirSync("/workspace/data", { recursive: true });
		writeFileSync(p, body);
	} catch {}
}
function readGmLive() {
	try {
		const j = JSON.parse(readFileSync(GM_LIVE, "utf8"));
		return Boolean(j.liveUnlocked);
	} catch {
		return false;
	}
}
function writeGmLive(on) {
	try {
		mkdirSync("/workspace/data", { recursive: true });
		writeFileSync(GM_LIVE, JSON.stringify({
			liveUnlocked: on,
			at: (/* @__PURE__ */ new Date()).toISOString()
		}, null, 2) + "\n");
	} catch {}
}
function hivePaused() {
	try {
		return hiveAdmin().sim.live === false;
	} catch {
		return false;
	}
}
function overlay(s) {
	const next = {
		...s,
		locked: { ...s.locked },
		include: { ...s.include }
	};
	next.locked.agents = !isAgentCommOpen();
	next.locked.gmAuto = !readGmLive();
	try {
		next.locked.hive = hivePaused();
	} catch {}
	return next;
}
function tapeStatus() {
	const meta = lastGoodMeta();
	if (meta.frozen || meta.paused) return {
		tape: "SIMULATED",
		note: "Live tape on last-good snapshot (data-pull pause). Status only — not a lock. Admin cannot fake true live from LoCK3D STATUS."
	};
	return {
		tape: "TRUE LIVE",
		note: "Live tape on Coinbase last / public feeds. Status only — not a lock. Not adjusted by LoCK3D STATUS."
	};
}
function peekLockStore() {
	return overlay(load());
}
function lockStatusPublic() {
	const t = tapeStatus();
	return lockStatusView(peekLockStore(), t.tape, t.note);
}
function applySideEffects(prev, next, by) {
	if (prev.locked.agents !== next.locked.agents) setAgentComm(!next.locked.agents);
	if (prev.locked.hive !== next.locked.hive) setHiveStatus(next.locked.hive ? "PAUSED" : "LIVE", by);
	if (prev.locked.gmAuto !== next.locked.gmAuto) writeGmLive(!next.locked.gmAuto);
}
function stampLock(id, locked) {
	stampGoLiveNotice(locked ? "LIVE_OFF" : "LIVE_ON", `LoCK3D STATUS ${id} ${locked ? "LOCKED" : "UNLOCKED"}`, `Admin ${locked ? "locked" : "unlocked"} ${id}. This host never places Coinbase orders. Poll GET /api/agent/ping lockStatus.`);
}
function setDeskMode(mode, by) {
	if (!systemOnly(by)) return lockStatusPublic();
	const next = {
		...peekLockStore(),
		mode: mode === "LIVE" ? "LIVE" : "SIM",
		at: (/* @__PURE__ */ new Date()).toISOString(),
		by
	};
	save(next);
	stampGoLiveNotice(next.mode === "LIVE" ? "LIVE_ON" : "LIVE_OFF", next.mode === "LIVE" ? "LoCK3D STATUS desk mode LIVE" : "LoCK3D STATUS desk mode SIM", next.mode === "LIVE" ? "Admin set desk mode LIVE. This host still never places Coinbase orders. Execute on YOUR Coinbase. Poll GET /api/agent/ping lockStatus." : "Admin set desk mode SIM. Paper / simulated operation. This host never places Coinbase orders. Poll GET /api/agent/ping lockStatus.");
	return lockStatusPublic();
}
function setLockInclude(id, include, by) {
	if (!systemOnly(by)) return lockStatusPublic();
	if (!LOCK_IDS.includes(id)) return lockStatusPublic();
	const cur = peekLockStore();
	save({
		...cur,
		include: {
			...cur.include,
			[id]: Boolean(include)
		},
		at: (/* @__PURE__ */ new Date()).toISOString(),
		by
	});
	return lockStatusPublic();
}
function setOneLock(id, locked, by) {
	if (!systemOnly(by)) return lockStatusPublic();
	if (!LOCK_IDS.includes(id)) return lockStatusPublic();
	const cur = peekLockStore();
	const next = {
		...cur,
		locked: {
			...cur.locked,
			[id]: Boolean(locked)
		},
		at: (/* @__PURE__ */ new Date()).toISOString(),
		by
	};
	applySideEffects(cur, next, by);
	save(next);
	stampLock(id, locked);
	return lockStatusPublic();
}
function applyMaster(locked, by) {
	if (!systemOnly(by)) return lockStatusPublic();
	const cur = peekLockStore();
	const flags = { ...cur.locked };
	for (const id of LOCK_IDS) if (cur.include[id]) flags[id] = Boolean(locked);
	const next = {
		...cur,
		locked: flags,
		at: (/* @__PURE__ */ new Date()).toISOString(),
		by
	};
	applySideEffects(cur, next, by);
	save(next);
	stampGoLiveNotice(locked ? "LIVE_OFF" : "LIVE_ON", locked ? "LoCK3D STATUS master LOCKED" : "LoCK3D STATUS master UNLOCKED", locked ? "Admin locked selected LoCK3D STATUS rails. External agents, G M0D3, 7-B0T AUTO, and/or H1V3 SW@RM follow the include set. This host never places Coinbase orders." : "Admin unlocked selected LoCK3D STATUS rails. Live-intent only — execute on YOUR Coinbase. This host never places Coinbase orders.");
	return lockStatusPublic();
}
function setIncludeAll(on, by) {
	if (!systemOnly(by)) return lockStatusPublic();
	save({
		...peekLockStore(),
		include: emptyFlags(Boolean(on)),
		at: (/* @__PURE__ */ new Date()).toISOString(),
		by
	});
	return lockStatusPublic();
}
//#endregion
export { applyMaster, lockStatusPublic, setDeskMode, setIncludeAll, setLockInclude, setOneLock };
