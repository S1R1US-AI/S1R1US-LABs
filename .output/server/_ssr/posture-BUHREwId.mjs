import { g as vulnRows, p as protocolRows } from "./security-D_r_MqD6.mjs";
import { i as ingestBans, s as listBans } from "./ban-list-C6IREqAh.mjs";
import { i as intrusionSummary, o as listIntrusions, r as ingestPersisted } from "./intrusion-log-Dl3lKsr8.mjs";
import { a as underAttack, i as listActions, r as ingestActions } from "./auto-defend-CiARGVXy.mjs";
import { i as wafStats, n as ingestWafLog } from "./waf-B_PDEz1d.mjs";
import { i as asiRows, n as agentSecurityStats, s as llmAgentRows } from "./agent-security-IAhNJMHV.mjs";
import { a as firewallSummary, c as ingestIntel, i as firewallLayers, l as refreshIntel, o as headerPosture, r as cachedIntel, u as runHunter } from "./hunter-DZC1f6NN.mjs";
import { n as pciRows, r as pluginInventory, t as owaspRows } from "./control-map-CYwGTHQc.mjs";
import { readFileSync } from "node:fs";
//#region node_modules/.nitro/vite/services/ssr/assets/posture-BUHREwId.js
/** Admin Security tab payload: WAF + intel + headers + maps + actions. Server-only. */
function readJson(path) {
	try {
		return JSON.parse(readFileSync(path, "utf8"));
	} catch {
		return null;
	}
}
function hydrateSecurityDisk() {
	ingestPersisted(readJson("/tmp/desk-intrusions.json"));
	ingestWafLog(readJson("/tmp/desk-waf.json"));
	ingestBans(readJson("/tmp/desk-bans.json"));
	ingestActions(readJson("/tmp/desk-defend.json"));
	ingestIntel(readJson("/tmp/desk-intel.json"));
}
async function securityPosture(opts) {
	hydrateSecurityDisk();
	let intel = cachedIntel();
	if (opts?.refreshIntel || !intel.count) try {
		intel = await refreshIntel(Boolean(opts?.refreshIntel));
	} catch {
		intel = cachedIntel();
	}
	const hunter = runHunter();
	const layers = firewallLayers();
	let agentGate = null;
	let waitlist = {
		count: 0,
		invited: 0,
		rows: []
	};
	try {
		const gate = await import("./agent-gate-Diboe8GJ.mjs").then((n) => n.r);
		const wl = await import("./agent-gate-Diboe8GJ.mjs").then((n) => n.l);
		const state = gate.peekAgentGate();
		agentGate = {
			...state,
			public: gate.agentGatePublic()
		};
		waitlist = wl.waitlistAdmin();
		const layer = layers.find((l) => l.id === "agent-gate");
		if (layer) {
			layer.status = state.externalAgents ? "ARMED" : "OPERATOR";
			layer.detail = state.externalAgents ? `External AI communication OPEN${state.inviteBatchAt ? ` · last invite ${state.inviteCount} bots` : ""}. Admin can close it from Security.` : `MAINTENANCE since ${state.closedAt ?? "—"}. Ping + waitlist open. Invite queued for ${waitlist.count} waitlisted bots.`;
		}
	} catch {}
	let bars = {
		count: 0,
		rows: []
	};
	try {
		bars = (await import("./agent-bar-CWDlzF7K.mjs").then((n) => n.t).then((n) => n.t)).listAgentBars();
	} catch {}
	try {
		const gate = await import("./yubi-gate-DQ6LYOjo.mjs");
		const on = await gate.adminPanelYubiLock();
		const keys = await gate.adminHasPhysicalKey();
		const layer = layers.find((l) => l.id === "yubi-panel");
		if (layer) {
			layer.status = on ? "ARMED" : "OPERATOR";
			layer.detail = on ? `ON — Admin requires a physical YubiKey after X + password. Keys enrolled=${String(keys)}.` : `OFF (default). Enroll a YubiKey then lock Admin from Wallet. Dual OTP still required for outgoing BTC/USDC.`;
		}
	} catch {}
	return {
		asOf: (/* @__PURE__ */ new Date()).toISOString(),
		firewall: {
			layers,
			summary: firewallSummary(layers)
		},
		waf: wafStats(),
		bans: listBans(),
		intel,
		headers: headerPosture(),
		owasp: owaspRows(),
		pci: pciRows(),
		plugins: pluginInventory(),
		actions: listActions(),
		underAttack: underAttack(),
		hunter,
		protocol: protocolRows(),
		vulns: vulnRows(),
		intrusions: {
			rows: listIntrusions(),
			summary: intrusionSummary()
		},
		agentGate,
		waitlist,
		bars,
		agentic: {
			stats: agentSecurityStats(),
			asi: asiRows(),
			llm: llmAgentRows()
		}
	};
}
//#endregion
export { hydrateSecurityDisk, securityPosture };
