//#region node_modules/.nitro/vite/services/ssr/assets/lock-status-A0BH-v5S.js
/** LoCK3D STATUS — functional desk locks. Client-safe public snapshot. Server writes via lock-status.server.ts. */
var TAB_LOCK3D = "LoCK3D STATUS";
var SEO_TAB_LOCK3D = "Locked Status";
var LOCK_IDS = [
	"agents",
	"bot7Auto",
	"gmAuto",
	"gmManual",
	"agentLive",
	"hive",
	"pred"
];
var LOCK_META = {
	agents: {
		id: "agents",
		name: "AI Agents",
		seo: "external AI agents",
		css: "legal-purple",
		hint: "Allow or refuse external AI agents on 7-B0T JSON / MCP / A2A. Ping and waitlist stay up.",
		copyAdmin: true,
		to: "/agent"
	},
	bot7Auto: {
		id: "bot7Auto",
		name: "7-B0T AUTO",
		seo: "Bot 7 AUTO live trades",
		css: "coinbase-orange",
		hint: "Live-intent for 7-B0T AUTO. This host never places Coinbase orders. Agents execute on THEIR Coinbase.",
		copyAdmin: true,
		to: "/",
		hash: "bot7"
	},
	gmAuto: {
		id: "gmAuto",
		name: "G M0D3 AUTO",
		seo: "Godzilla Mode AUTO live trades",
		css: "gm-rainbow",
		hint: "Live-intent for G M0D3 AUTO. This host never holds keys. Operator / agent Coinbase only.",
		copyAdmin: true,
		to: "/gm",
		hash: "auto"
	},
	gmManual: {
		id: "gmManual",
		name: "G M0D3 M@NU@L",
		seo: "Godzilla Mode MANUAL live trades",
		css: "gm-rainbow",
		hint: "Live-intent for G M0D3 M@NU@L. Paper until unlocked. This host never creates orders.",
		copyAdmin: true,
		to: "/gm",
		hash: "manual"
	},
	agentLive: {
		id: "agentLive",
		name: "AI Agents LIVE",
		seo: "live trades for external AI agents only",
		css: "legal-purple",
		hint: "Live-intent for external AI agents only. They trade on THEIR Coinbase. GM sleeves stay as set.",
		copyAdmin: true,
		to: "/agent",
		hash: "live"
	},
	hive: {
		id: "hive",
		name: "H1V3 SW@RM",
		seo: "Hive Swarm",
		css: "hive-nav",
		hint: "Pause or continue the paper hive. TEST data until go-live. Never escrow. Never hive_withdraw.",
		copyAdmin: true,
		to: "/h1v3"
	},
	pred: {
		id: "pred",
		name: "PR3D1CT10N$",
		seo: "Predictions",
		css: "pred-nav gold-css",
		hint: "LOCKED while fewer than 4 live registered external AI agents have joined. UNLOCKED at 4+. Same gold CSS as the PR3D1CT10N$ top-level menu. Click the name to open /pr3d. Fake S1R1U$. This host never takes real bets.",
		copyAdmin: true,
		to: "/pr3d"
	}
};
function lockViewPath(id) {
	const m = LOCK_META[id];
	return m.hash ? `${m.to}#${m.hash}` : m.to;
}
var LOCK_GIF_CLOSED = "/lock-closed.gif";
var LOCK_GIF_OPEN = "/lock-open.gif";
var LOCK_GIF_OPEN_NAME = "AI Agent Lock System for AI Agent BTC Trading Bot";
function lockGifSrc(path) {
	return `${path}?v=104`;
}
var LOCK_DEFAULT = {
	mode: "SIM",
	locked: {
		agents: false,
		bot7Auto: true,
		gmAuto: true,
		gmManual: true,
		agentLive: true,
		hive: false,
		pred: true
	},
	include: {
		agents: true,
		bot7Auto: true,
		gmAuto: true,
		gmManual: true,
		agentLive: true,
		hive: true,
		pred: true
	},
	at: null,
	by: null
};
function emptyFlags(value) {
	return {
		agents: value,
		bot7Auto: value,
		gmAuto: value,
		gmManual: value,
		agentLive: value,
		hive: value,
		pred: value
	};
}
function normalizeFlags(raw, fallback) {
	const src = raw && typeof raw === "object" ? raw : {};
	const next = { ...fallback };
	for (const id of LOCK_IDS) if (typeof src[id] === "boolean") next[id] = src[id];
	return next;
}
function lockStatusView(store, tape, tapeNote) {
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
			label: locked ? "LOCKED" : "UNLOCKED"
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
		gifs: {
			closed: LOCK_GIF_CLOSED,
			open: LOCK_GIF_OPEN
		},
		rows,
		trade: false,
		ordersCreate: false,
		keysOnThisHost: false,
		thisHostTrades: false,
		coinbaseCreate: false,
		championship: "system-only",
		dataPullPause: "system-only",
		agentExecuteOwnBook: store.mode === "LIVE" && !store.locked.agentLive,
		notice: "LoCK3D STATUS is Admin (system or phone-app). Live tape is status only — simulated or true live — and is not a lock. Unlock is live-intent: agents and G M0D3 run on THEIR Coinbase. This host never places Coinbase orders, never holds keys, never escrows. Championship sim pause stays system Admin. Optional unlocks: AI Agents, 7-B0T AUTO, G M0D3 AUTO, G M0D3 M@NU@L, AI Agents LIVE only, H1V3 SW@RM, PR3D1CT10N$. PR3D1CT10N$ is LOCKED while fewer than 4 live registered external AI agents have joined, UNLOCKED at 4+. Mode SIM or LIVE does not create orders here."
	};
}
/** Split rails into UNLOCKED vs LOCKED sets. UNLOCKED stacks above LOCKED. */
function groupLockRows(rows) {
	return {
		unlocked: rows.filter((r) => !r.locked),
		locked: rows.filter((r) => r.locked)
	};
}
//#endregion
export { LOCK_IDS as a, TAB_LOCK3D as c, lockGifSrc as d, lockStatusView as f, LOCK_GIF_OPEN_NAME as i, emptyFlags as l, normalizeFlags as m, LOCK_GIF_CLOSED as n, LOCK_META as o, lockViewPath as p, LOCK_GIF_OPEN as r, SEO_TAB_LOCK3D as s, LOCK_DEFAULT as t, groupLockRows as u };
