import { r as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/desk-rpc-CKyZGNFP.js
var fetchDesk_createServerFn_handler = createServerRpc({
	id: "5cf62f4e779d5d6880a0cc11d158c6be2e5eeb2026216ec06a53d5d2048406cd",
	name: "fetchDesk",
	filename: "src/lib/desk/desk-rpc.ts"
}, (opts) => fetchDesk.__executeServer(opts));
var fetchDesk = createServerFn({ method: "GET" }).validator((input) => input ?? {}).handler(fetchDesk_createServerFn_handler, async ({ data }) => {
	const { loadSnapshot } = await import("./sources-Dk79xI8O.mjs");
	const { isTapeFrozen } = await import("./tape-persist-i5d38WDH.mjs").then((n) => n.i).then((n) => n.i);
	const force = Boolean(data?.force) && !isTapeFrozen();
	return Promise.race([loadSnapshot(force), new Promise((_, reject) => {
		setTimeout(() => reject(/* @__PURE__ */ new Error("rpc deadline")), 2600);
	})]).catch(() => loadSnapshot(false));
});
var fetchTapeMeta_createServerFn_handler = createServerRpc({
	id: "4ad2fda086277f62e7ecbc8458401244541db57fe627e90504025516478eab67",
	name: "fetchTapeMeta",
	filename: "src/lib/desk/desk-rpc.ts"
}, (opts) => fetchTapeMeta.__executeServer(opts));
var fetchTapeMeta = createServerFn({ method: "GET" }).handler(fetchTapeMeta_createServerFn_handler, async () => {
	const { lastGoodMeta } = await import("./tape-persist-i5d38WDH.mjs").then((n) => n.i).then((n) => n.i);
	return lastGoodMeta();
});
var setTapeFreeze_createServerFn_handler = createServerRpc({
	id: "645ce5dcd2143f301180bb73a3bbb42b5706b9673c921fa057498f2781d8f8b4",
	name: "setTapeFreeze",
	filename: "src/lib/desk/desk-rpc.ts"
}, (opts) => setTapeFreeze.__executeServer(opts));
var setTapeFreeze = createServerFn({ method: "POST" }).validator((input) => input).handler(setTapeFreeze_createServerFn_handler, async ({ data }) => {
	const { verifyAccessToken } = await import("./access.server-BhqnGgjj.mjs");
	const { setTapeFrozen, lastGoodMeta } = await import("./tape-persist-i5d38WDH.mjs").then((n) => n.i).then((n) => n.i);
	if (!await verifyAccessToken(data.token)) return {
		ok: false,
		error: "Admin session required",
		...lastGoodMeta()
	};
	setTapeFrozen(data.frozen);
	try {
		const { stampGoLiveNotice } = await import("./go-live-notices-CS1diESp.mjs").then((n) => n.t);
		if (data.frozen) stampGoLiveNotice("PAUSED", "Data pulls paused — under maintenance", "The tape is the last validated snapshot. Do not place Coinbase orders from it. Poll GET /api/agent/ping. You will be invited when pulls resume.");
		else {
			const now = (/* @__PURE__ */ new Date()).toISOString();
			const { stampInvites } = await import("./agent-gate-CPEElLYl.mjs").then((n) => n.a);
			const n = stampInvites(now);
			const { noteInviteBatch } = await import("./agent-gate-CPEElLYl.mjs").then((n) => n.r);
			noteInviteBatch(n, now);
			stampGoLiveNotice("RESUMED", "Data pulls resumed", "The 5-minute tape clock is back. Waitlisted bots: this is your go-live notice. Resume GET /api/agent/call every 300s. Do not treat this as live Coinbase unlock.");
		}
	} catch {}
	return {
		ok: true,
		...lastGoodMeta()
	};
});
var rebuildDesk_createServerFn_handler = createServerRpc({
	id: "6cec224d2d3bacdaff9821d9e34983f58a4bb3ab931693a937be1ca19d5e3a92",
	name: "rebuildDesk",
	filename: "src/lib/desk/desk-rpc.ts"
}, (opts) => rebuildDesk.__executeServer(opts));
var rebuildDesk = createServerFn({ method: "POST" }).validator((input) => input).handler(rebuildDesk_createServerFn_handler, async ({ data }) => {
	const { verifyAccessToken } = await import("./access.server-BhqnGgjj.mjs");
	const { loadSnapshot } = await import("./sources-Dk79xI8O.mjs");
	const { isTapeFrozen } = await import("./tape-persist-i5d38WDH.mjs").then((n) => n.i).then((n) => n.i);
	if (!await verifyAccessToken(data.token) || isTapeFrozen()) return loadSnapshot(false);
	return loadSnapshot(true);
});
var fetchDeskErrors_createServerFn_handler = createServerRpc({
	id: "a09f23fe5bdae92d6c7606faa5e475556882d6ad931424c9a3c8a4bce42359e6",
	name: "fetchDeskErrors",
	filename: "src/lib/desk/desk-rpc.ts"
}, (opts) => fetchDeskErrors.__executeServer(opts));
var fetchDeskErrors = createServerFn({ method: "GET" }).handler(fetchDeskErrors_createServerFn_handler, async () => {
	const { listDeskErrors, recordDeskFails } = await import("./error-log-AIBGWk_n.mjs");
	const fs = await import("node:fs");
	for (const p of [
		"/tmp/desk-errors.json",
		"/tmp/desk-cycle.json",
		"/workspace/artifacts/desk-cycle.json"
	]) try {
		const raw = fs.readFileSync(p, "utf8");
		const j = JSON.parse(raw);
		if (Array.isArray(j.rows) && j.rows.length) recordDeskFails(j.rows.map((r) => r.msg), j.rows[0]?.at);
		if (j.stats?.fails?.length) recordDeskFails(j.stats.fails);
	} catch {}
	return listDeskErrors();
});
var fetchIntrusions_createServerFn_handler = createServerRpc({
	id: "7d95ce8b736ec263ed12bbaf93d618091433ac4e9c24ddd5d170c160adbb013c",
	name: "fetchIntrusions",
	filename: "src/lib/desk/desk-rpc.ts"
}, (opts) => fetchIntrusions.__executeServer(opts));
var fetchIntrusions = createServerFn({ method: "POST" }).validator((input) => input).handler(fetchIntrusions_createServerFn_handler, async ({ data }) => {
	const { verifyAccessToken } = await import("./access.server-BhqnGgjj.mjs");
	if (!await verifyAccessToken(data.token)) return {
		ok: false,
		rows: [],
		summary: {
			total: 0,
			last24h: 0,
			byKind: {},
			lastAt: null
		}
	};
	const { listIntrusions, intrusionSummary, ingestPersisted } = await import("./intrusion-log-DgqVPLPw.mjs").then((n) => n.i).then((n) => n.i);
	try {
		const fs = await import("node:fs");
		ingestPersisted(JSON.parse(fs.readFileSync("/tmp/desk-intrusions.json", "utf8")));
	} catch {}
	return {
		ok: true,
		rows: listIntrusions(),
		summary: intrusionSummary()
	};
});
var runHunterAudit_createServerFn_handler = createServerRpc({
	id: "821cc51f8e53d995bccf344d723b48c673b7c3561883022e778666c2642bf20a",
	name: "runHunterAudit",
	filename: "src/lib/desk/desk-rpc.ts"
}, (opts) => runHunterAudit.__executeServer(opts));
var runHunterAudit = createServerFn({ method: "POST" }).validator((input) => input).handler(runHunterAudit_createServerFn_handler, async ({ data }) => {
	const { verifyAccessToken } = await import("./access.server-BhqnGgjj.mjs");
	if (!await verifyAccessToken(data.token)) return {
		ok: false,
		report: null
	};
	const { hydrateSecurityDisk } = await import("./posture-CcSXdHDs.mjs");
	hydrateSecurityDisk();
	const { runHunter } = await import("./hunter-BjvCXTM1.mjs").then((n) => n.r);
	return {
		ok: true,
		report: runHunter()
	};
});
var fetchSecurityPosture_createServerFn_handler = createServerRpc({
	id: "e8c64d6bb68ba4681691bea632985bc7af5dce8570257d70688d43934a6347ed",
	name: "fetchSecurityPosture",
	filename: "src/lib/desk/desk-rpc.ts"
}, (opts) => fetchSecurityPosture.__executeServer(opts));
var fetchSecurityPosture = createServerFn({ method: "POST" }).validator((input) => input).handler(fetchSecurityPosture_createServerFn_handler, async ({ data }) => {
	const { verifyAccessToken } = await import("./access.server-BhqnGgjj.mjs");
	if (!await verifyAccessToken(data.token)) return {
		ok: false,
		posture: null
	};
	const { securityPosture } = await import("./posture-CcSXdHDs.mjs");
	return {
		ok: true,
		posture: await securityPosture({ refreshIntel: Boolean(data.refreshIntel) })
	};
});
var fetchSecurityBrief_createServerFn_handler = createServerRpc({
	id: "7d0c11795f8624b74086b669339d9431d40f36fe77ad35a1e50d0b60b7e1bd4f",
	name: "fetchSecurityBrief",
	filename: "src/lib/desk/desk-rpc.ts"
}, (opts) => fetchSecurityBrief.__executeServer(opts));
var fetchSecurityBrief = createServerFn({ method: "POST" }).validator((input) => input).handler(fetchSecurityBrief_createServerFn_handler, async ({ data }) => {
	const { verifyAccessToken } = await import("./access.server-BhqnGgjj.mjs");
	if (!await verifyAccessToken(data.token)) return {
		ok: false,
		brief: null
	};
	try {
		const fs = await import("node:fs");
		const { ingestPersisted } = await import("./intrusion-log-DgqVPLPw.mjs").then((n) => n.i).then((n) => n.i);
		ingestPersisted(JSON.parse(fs.readFileSync("/tmp/desk-intrusions.json", "utf8")));
	} catch {}
	const { morningSecurity } = await import("./morning-ops-DVYBigIH.mjs").then((n) => n.i);
	return {
		ok: true,
		brief: morningSecurity()
	};
});
var fetchAgentFlags_createServerFn_handler = createServerRpc({
	id: "428fb23ec9fdf3ede46607e1241acc80a5022a44f56391a98b427fcb0e9286ec",
	name: "fetchAgentFlags",
	filename: "src/lib/desk/desk-rpc.ts"
}, (opts) => fetchAgentFlags.__executeServer(opts));
var fetchAgentFlags = createServerFn({ method: "GET" }).handler(fetchAgentFlags_createServerFn_handler, async () => {
	const { peekAgentFlags } = await import("./agent-ping-BXZGzZ_N.mjs").then((n) => n.n).then((n) => n.t);
	const { agentGatePublic, peekAgentGate } = await import("./agent-gate-CPEElLYl.mjs").then((n) => n.r);
	const flags = peekAgentFlags();
	const gate = peekAgentGate();
	return {
		...flags,
		gate: agentGatePublic(),
		communication: gate.externalAgents ? "OPEN" : "MAINTENANCE"
	};
});
var fetchAgentGate_createServerFn_handler = createServerRpc({
	id: "f372babf0f6ae485bb7482c85c670110ca8e92222ea4bf7de3f257bfa9b3c45d",
	name: "fetchAgentGate",
	filename: "src/lib/desk/desk-rpc.ts"
}, (opts) => fetchAgentGate.__executeServer(opts));
var fetchAgentGate = createServerFn({ method: "POST" }).validator((input) => input).handler(fetchAgentGate_createServerFn_handler, async ({ data }) => {
	const { verifyAccessToken } = await import("./access.server-BhqnGgjj.mjs");
	if (!await verifyAccessToken(data.token)) return {
		ok: false,
		error: "Admin session required",
		gate: null,
		waitlist: {
			count: 0,
			invited: 0,
			rows: []
		},
		bars: {
			count: 0,
			rows: []
		}
	};
	const { peekAgentGate, agentGatePublic } = await import("./agent-gate-CPEElLYl.mjs").then((n) => n.r);
	const { waitlistAdmin } = await import("./agent-gate-CPEElLYl.mjs").then((n) => n.a);
	const { listAgentBars } = await import("./agent-bar-tE7hqyyO.mjs").then((n) => n.t);
	return {
		ok: true,
		error: null,
		gate: {
			...peekAgentGate(),
			public: agentGatePublic()
		},
		waitlist: waitlistAdmin(),
		bars: listAgentBars()
	};
});
var setAgentGate_createServerFn_handler = createServerRpc({
	id: "cc566ed26039b1983e76b5e9e83cce49a5174091823080d91b7d1a5cb3658e1f",
	name: "setAgentGate",
	filename: "src/lib/desk/desk-rpc.ts"
}, (opts) => setAgentGate.__executeServer(opts));
var setAgentGate = createServerFn({ method: "POST" }).validator((input) => input).handler(setAgentGate_createServerFn_handler, async ({ data }) => {
	const { verifyAccessToken } = await import("./access.server-BhqnGgjj.mjs");
	if (!await verifyAccessToken(data.token)) return {
		ok: false,
		error: "Admin session required",
		gate: null,
		waitlist: {
			count: 0,
			invited: 0,
			rows: []
		},
		bars: {
			count: 0,
			rows: []
		}
	};
	const { setAgentComm, peekAgentGate, agentGatePublic } = await import("./agent-gate-CPEElLYl.mjs").then((n) => n.r);
	const { waitlistAdmin } = await import("./agent-gate-CPEElLYl.mjs").then((n) => n.a);
	const { listAgentBars } = await import("./agent-bar-tE7hqyyO.mjs").then((n) => n.t);
	setAgentComm(data.open);
	return {
		ok: true,
		error: null,
		gate: {
			...peekAgentGate(),
			public: agentGatePublic()
		},
		waitlist: waitlistAdmin(),
		bars: listAgentBars()
	};
});
var unbarAgent_createServerFn_handler = createServerRpc({
	id: "9e2d670ea9885717b4bf6e44d44cffedc7a7dde00507e196e67749e1b40d8cca",
	name: "unbarAgent",
	filename: "src/lib/desk/desk-rpc.ts"
}, (opts) => unbarAgent.__executeServer(opts));
var unbarAgent = createServerFn({ method: "POST" }).validator((input) => input).handler(unbarAgent_createServerFn_handler, async ({ data }) => {
	const { verifyAccessToken } = await import("./access.server-BhqnGgjj.mjs");
	if (!await verifyAccessToken(data.token)) return {
		ok: false,
		error: "Admin session required",
		bars: {
			count: 0,
			rows: []
		}
	};
	const { unbarAgent: drop } = await import("./agent-bar-tE7hqyyO.mjs").then((n) => n.t);
	return {
		ok: true,
		error: null,
		bars: drop(data.id)
	};
});
var fetchMorningLib_createServerFn_handler = createServerRpc({
	id: "f57bee00551cea168a828cfda0a1bbfa0a2802559e29d2c609fe1d31497cd3cf",
	name: "fetchMorningLib",
	filename: "src/lib/desk/desk-rpc.ts"
}, (opts) => fetchMorningLib.__executeServer(opts));
var fetchMorningLib = createServerFn({ method: "POST" }).validator((input) => input).handler(fetchMorningLib_createServerFn_handler, async ({ data }) => {
	const { verifyAccessToken } = await import("./access.server-BhqnGgjj.mjs");
	if (!await verifyAccessToken(data.token)) return {
		ok: false,
		paused: true,
		pausedAt: null,
		reports: []
	};
	const { getMorningLib } = await import("./morning-lib.server-8ELMhzrr.mjs");
	return {
		ok: true,
		...await getMorningLib()
	};
});
var setMorningReportPaused_createServerFn_handler = createServerRpc({
	id: "56a5cd771ece1bf754af79b4554bf63f9f41484e364fb0b15cf2e36f5ee5bc68",
	name: "setMorningReportPaused",
	filename: "src/lib/desk/desk-rpc.ts"
}, (opts) => setMorningReportPaused.__executeServer(opts));
var setMorningReportPaused = createServerFn({ method: "POST" }).validator((input) => input).handler(setMorningReportPaused_createServerFn_handler, async ({ data }) => {
	const { verifyAccessToken } = await import("./access.server-BhqnGgjj.mjs");
	if (!await verifyAccessToken(data.token)) return {
		ok: false,
		paused: true,
		pausedAt: null,
		reports: []
	};
	const { setMorningPaused } = await import("./morning-lib.server-8ELMhzrr.mjs");
	return {
		ok: true,
		...await setMorningPaused(data.paused)
	};
});
var postPracticePulse_createServerFn_handler = createServerRpc({
	id: "e91da4e66df44aa9ebdf315575068b5fff2eede3ec0cfb2fcef1671147a4c0c7",
	name: "postPracticePulse",
	filename: "src/lib/desk/desk-rpc.ts"
}, (opts) => postPracticePulse.__executeServer(opts));
var postPracticePulse = createServerFn({ method: "POST" }).validator((input) => input).handler(postPracticePulse_createServerFn_handler, async ({ data }) => {
	const { writePulse } = await import("./practice-pulse-DsIXMyE2.mjs");
	await writePulse(data);
	return { ok: true };
});
var fetchPracticePulse_createServerFn_handler = createServerRpc({
	id: "f50e05dc58b5b0575866cc2c7311bb5c3e0e947c4d045a2d25e02521fee667aa",
	name: "fetchPracticePulse",
	filename: "src/lib/desk/desk-rpc.ts"
}, (opts) => fetchPracticePulse.__executeServer(opts));
var fetchPracticePulse = createServerFn({ method: "GET" }).handler(fetchPracticePulse_createServerFn_handler, async () => {
	const { loadPulse } = await import("./practice-pulse-DsIXMyE2.mjs");
	return loadPulse();
});
var fetchAuto24h_createServerFn_handler = createServerRpc({
	id: "5d795ffcbdcf278e95568b2620b25787d8cc249f9c1bd5d88d8fc94e060d890b",
	name: "fetchAuto24h",
	filename: "src/lib/desk/desk-rpc.ts"
}, (opts) => fetchAuto24h.__executeServer(opts));
var fetchAuto24h = createServerFn({ method: "GET" }).handler(fetchAuto24h_createServerFn_handler, async () => {
	const { readAuto24h } = await import("./auto-24h.server-BRJbavxQ.mjs");
	return readAuto24h();
});
//#endregion
export { fetchAgentFlags_createServerFn_handler, fetchAgentGate_createServerFn_handler, fetchAuto24h_createServerFn_handler, fetchDeskErrors_createServerFn_handler, fetchDesk_createServerFn_handler, fetchIntrusions_createServerFn_handler, fetchMorningLib_createServerFn_handler, fetchPracticePulse_createServerFn_handler, fetchSecurityBrief_createServerFn_handler, fetchSecurityPosture_createServerFn_handler, fetchTapeMeta_createServerFn_handler, postPracticePulse_createServerFn_handler, rebuildDesk_createServerFn_handler, runHunterAudit_createServerFn_handler, setAgentGate_createServerFn_handler, setMorningReportPaused_createServerFn_handler, setTapeFreeze_createServerFn_handler, unbarAgent_createServerFn_handler };
