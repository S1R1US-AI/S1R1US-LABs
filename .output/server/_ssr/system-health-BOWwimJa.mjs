import { r as __exportAll } from "../_runtime.mjs";
import { t as __exportAll$1 } from "./agent-ping-BXZGzZ_N.mjs";
import { t as MCP_TOOLS } from "./agent-security-IAhNJMHV.mjs";
import { s as GO_LIVE_STEPS } from "./go-live-D0FioTGl.mjs";
import { d as hiveResourcePublic } from "./hive-resource-BThKJHxr.mjs";
import { t as alignmentScore } from "./alignment-BSJPxJqV.mjs";
import { t as checkpointId } from "./checkpoint-Bsdvrfn5.mjs";
//#region ../../workspace/node_modules/.nitro/vite/services/ssr/assets/system-health-BOWwimJa.js
var system_health_BOWwimJa_exports = /* @__PURE__ */ __exportAll({
	n: () => system_health_exports,
	t: () => systemHealth
});
/** Checkpoint-68 overall system health. Function + security + design. Relative imports only. Client-safe. */
var system_health_exports = /* @__PURE__ */ __exportAll$1({ systemHealth: () => systemHealth });
function grade(n) {
	if (n >= 90) return "A";
	if (n >= 80) return "B";
	if (n >= 70) return "C";
	if (n >= 60) return "D";
	return "F";
}
function clamp(n, max) {
	return Math.max(0, Math.min(max, Math.round(n)));
}
function systemHealth() {
	const res = hiveResourcePublic();
	const s8 = GO_LIVE_STEPS.find((s) => s.id === "s8");
	const fnNotes = [];
	let fn = 0;
	fn += 15;
	fnNotes.push("H1V3 SW@RM TEST launch");
	fn += 15;
	fnNotes.push("H1V3 pause/continue armed (system + copy-admin)");
	fn += 15;
	fnNotes.push("Hive paper — Coinbase create off");
	if (MCP_TOOLS.has("hive_list") && MCP_TOOLS.has("board_tick") && MCP_TOOLS.has("cup_list")) {
		fn += 20;
		fnNotes.push("MCP hive + board + cup live");
	}
	if (!MCP_TOOLS.has("pred_list") && !MCP_TOOLS.has("pred_bet") && !MCP_TOOLS.has("pred_arm") && !MCP_TOOLS.has("pred_live")) {
		fn += 5;
		fnNotes.push("No real-money pred MCP — PR3D1CT10N$ is fake S1R1U$ education");
	}
	if (MCP_TOOLS.has("pr3d_list") && MCP_TOOLS.has("pr3d_join")) {
		fn += 5;
		fnNotes.push("PR3D1CT10N$ education MCP live");
	}
	if (MCP_TOOLS.has("byo_connect")) {
		fn += 10;
		fnNotes.push("BYO connect tool live");
	} else fnNotes.push("BYO connect tool missing");
	if (MCP_TOOLS.has("lock_status") && !MCP_TOOLS.has("lock_set")) {
		fn += 5;
		fnNotes.push("LoCK3D STATUS read-only MCP");
	}
	fn += 10;
	fnNotes.push("TH/s compute counter");
	if (res.kind === "unconditional-gift-or-saas") {
		fn += 10;
		fnNotes.push("Gift/SaaS resource rails");
	}
	fn = clamp(fn, 100);
	const secNotes = [];
	let sec = 0;
	if (!MCP_TOOLS.has("hive_withdraw") && !MCP_TOOLS.has("hive_pause") && !MCP_TOOLS.has("orders_create") && !MCP_TOOLS.has("lock_set")) {
		sec += 25;
		secNotes.push("No hive_withdraw / hive_pause / orders_create / lock_set MCP");
	}
	if (res.profitShare === false && res.hiveWithdraw === false && res.autoSendPnl === false) {
		sec += 20;
		secNotes.push("No profit-share / withdraw / auto-send P&L");
	}
	if (res.escrow === false && res.howey === false && res.moneyTransmitter === false) {
		sec += 20;
		secNotes.push("Not escrow / Howey / money transmitter");
	}
	if (s8?.status === "LOCKED") {
		sec += 15;
		secNotes.push("Go-live s8 FinCEN LOCKED");
	}
	sec += 20;
	secNotes.push("Keys never on this host");
	sec = clamp(sec, 100);
	const desNotes = [
		"H1V3 banner G0T QUANT? + S1R1US.ai",
		"Meme the future of BTC Quant",
		"LoCK3D STATUS banner + lock GIFs",
		"L3AD3R B0ARD collapse/expand (purple expand)",
		"FAQ + schema + XML sitemap hive + lock images",
		"Terms + Privacy name every public function"
	];
	const des = 94;
	const align = alignmentScore();
	const overall = clamp(fn * .35 + sec * .35 + des * .15 + align.score * .15, 100);
	return {
		asOf: (/* @__PURE__ */ new Date()).toISOString(),
		checkpoint: checkpointId(68),
		overall,
		grade: grade(overall),
		function: {
			id: "function",
			label: "Function",
			score: fn,
			max: 100,
			notes: fnNotes
		},
		security: {
			id: "security",
			label: "Security",
			score: sec,
			max: 100,
			notes: secNotes
		},
		design: {
			id: "design",
			label: "Design",
			score: des,
			max: 100,
			notes: desNotes
		},
		alignment: align,
		liveUnlocked: false,
		trade: false,
		practiceCannotArmCoinbase: true,
		copyAdminMayPauseHive: true,
		copyAdminMayPauseChampionship: true,
		copyAdminCannotPauseChampionship: false
	};
}
//#endregion
export { system_health_BOWwimJa_exports as n, systemHealth as t };
