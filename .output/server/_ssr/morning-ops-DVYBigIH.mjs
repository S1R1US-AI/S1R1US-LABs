import { t as __exportAll } from "./agent-ping-BXZGzZ_N.mjs";
import { g as vulnRows, p as protocolRows } from "./security-BGs2AzWv.mjs";
import { r as intrusionSummary } from "./intrusion-log-DgqVPLPw.mjs";
import { n as CYCLE_ARCH, r as DATA_FEEDS } from "./policy-GHDtc2b_.mjs";
import { n as cachedHunter } from "./hunter-BjvCXTM1.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/morning-ops-DVYBigIH.js
var morning_ops_exports = /* @__PURE__ */ __exportAll({
	morningAgent: () => morningAgent,
	morningFeeds: () => morningFeeds,
	morningSecurity: () => morningSecurity
});
function morningSecurity() {
	const proto = protocolRows();
	const vulns = vulnRows();
	const fail = proto.filter((p) => p.status === "FAIL");
	const operator = proto.filter((p) => p.status === "OPERATOR");
	const open = vulns.filter((v) => v.status === "OPERATOR" || v.status === "ACCEPT");
	const needHelp = vulns.filter((v) => v.status === "OPERATOR");
	const hunter = cachedHunter();
	const intrusions = intrusionSummary();
	const headline = hunter.open === 0 && fail.length === 0 ? `SECURITY ANALYSIS — hunter ${hunter.pass} PASS · ${hunter.operator} OPERATOR · ${intrusions.last24h} blocks / 24h` : `SECURITY ANALYSIS — hunter OPEN ${hunter.open} · FAIL ${fail.length} · ${intrusions.last24h} blocks / 24h`;
	const kinds = Object.entries(intrusions.byKind).sort((a, b) => b[1] - a[1]).slice(0, 4).map(([k, n]) => `${k} ${n}`).join(" · ");
	return {
		asOf: (/* @__PURE__ */ new Date()).toISOString(),
		headline,
		proto,
		vulns,
		fail,
		operator,
		open,
		needHelp,
		hunter,
		intrusions,
		kinds,
		effectiveness: hunter.effectiveness,
		patchQueue: hunter.patchQueue.slice(0, 4),
		mandateScoreNote: "Security analysis: Electrovolt-style web work packages + Hacktron-style hunter (PoC || GTFO). Firewall is app-layer. Live Coinbase create stays off. Score is ops honesty, not a promise of zero risk."
	};
}
(/* @__PURE__ */ new Date()).toISOString();
function morningAgent(flags) {
	const maint = flags.communication === "MAINTENANCE" || flags.gate?.maintenance === true;
	return {
		asOf: (/* @__PURE__ */ new Date()).toISOString(),
		dayEt: flags.dayEt,
		pings: flags.pings,
		rejects: flags.rejects,
		lastAt: flags.lastAt,
		live: false,
		status: flags.status,
		flags: flags.flags,
		note: flags.note,
		communication: maint ? "MAINTENANCE" : "OPEN",
		invite: flags.gate?.invite?.status ?? (maint ? "PENDING" : "NONE"),
		headline: maint ? "AGENT GATE MAINTENANCE — Bot 7 / MCP / A2A closed. Ping + waitlist stay. Invite pending when the gate opens." : flags.pings === 0 ? "AGENT FLAG NONE — no connection tests today (ET). PoC, not LIVE." : `AGENT FLAG ${flags.flags.join("+")} — ${flags.pings} ping(s), ${flags.rejects} reject(s). PoC, not LIVE. No trades.`
	};
}
function morningFeeds(snap) {
	const pullMs = snap?.pullMs ?? null;
	const ageMs = snap?.fetchedAt ? Date.now() - Date.parse(snap.fetchedAt) : null;
	const errors = snap?.errors ?? [];
	const rows = DATA_FEEDS.map((f) => {
		const hit = errors.find((e) => e.toLowerCase().includes(f.id) || e.toLowerCase().includes(f.name.toLowerCase().slice(0, 6)));
		return {
			id: f.id,
			name: f.name,
			role: f.role,
			ok: !hit,
			detail: hit ?? "live / last-good"
		};
	});
	return {
		cycle: CYCLE_ARCH,
		pullMs,
		ageMs,
		errors,
		rows,
		hung: pullMs != null && pullMs > CYCLE_ARCH.clientRaceMs + 4e3
	};
}
//#endregion
export { morning_ops_exports as i, morningFeeds as n, morningSecurity as r, morningAgent as t };
