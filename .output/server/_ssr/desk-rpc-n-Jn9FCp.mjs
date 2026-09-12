import { r as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/desk-rpc-n-Jn9FCp.js
var fetchDesk_createServerFn_handler = createServerRpc({
	id: "5cf62f4e779d5d6880a0cc11d158c6be2e5eeb2026216ec06a53d5d2048406cd",
	name: "fetchDesk",
	filename: "src/lib/desk/desk-rpc.ts"
}, (opts) => fetchDesk.__executeServer(opts));
var fetchDesk = createServerFn({ method: "GET" }).validator((input) => input ?? {}).handler(fetchDesk_createServerFn_handler, async ({ data }) => {
	const { loadSnapshot } = await import("./sources-otJ0ZL8Z.mjs");
	const { isTapeFrozen } = await import("./tape-persist-CHN2yE-V.mjs").then((n) => n.a).then((n) => n.a);
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
	const { lastGoodMeta } = await import("./tape-persist-CHN2yE-V.mjs").then((n) => n.a).then((n) => n.a);
	return lastGoodMeta();
});
var setTapeFreeze_createServerFn_handler = createServerRpc({
	id: "645ce5dcd2143f301180bb73a3bbb42b5706b9673c921fa057498f2781d8f8b4",
	name: "setTapeFreeze",
	filename: "src/lib/desk/desk-rpc.ts"
}, (opts) => setTapeFreeze.__executeServer(opts));
var setTapeFreeze = createServerFn({ method: "POST" }).validator((input) => input).handler(setTapeFreeze_createServerFn_handler, async ({ data }) => {
	const { verifyAccessToken } = await import("./access.server-CaZHHbCU.mjs");
	const { setTapeFrozen, lastGoodMeta } = await import("./tape-persist-CHN2yE-V.mjs").then((n) => n.a).then((n) => n.a);
	if (!await verifyAccessToken(data.token)) return {
		ok: false,
		error: "Admin session required",
		...lastGoodMeta()
	};
	setTapeFrozen(data.frozen);
	try {
		const { stampGoLiveNotice } = await import("./go-live-notices-y5KTHj_G.mjs").then((n) => n.t).then((n) => n.t);
		if (data.frozen) stampGoLiveNotice("PAUSED", "Data pulls paused — under maintenance", "The tape is the last validated snapshot. Do not place Coinbase orders from it. Poll GET /api/agent/ping. You will be invited when pulls resume.");
		else {
			const now = (/* @__PURE__ */ new Date()).toISOString();
			const { stampInvites } = await import("./agent-gate-Dc4_BNmM.mjs").then((n) => n.l);
			const n = stampInvites(now);
			const { noteInviteBatch } = await import("./agent-gate-Dc4_BNmM.mjs").then((n) => n.r);
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
	const { verifyAccessToken } = await import("./access.server-CaZHHbCU.mjs");
	const { loadSnapshot } = await import("./sources-otJ0ZL8Z.mjs");
	const { isTapeFrozen } = await import("./tape-persist-CHN2yE-V.mjs").then((n) => n.a).then((n) => n.a);
	if (!await verifyAccessToken(data.token) || isTapeFrozen()) return loadSnapshot(false);
	return loadSnapshot(true);
});
var fetchDeskErrors_createServerFn_handler = createServerRpc({
	id: "a09f23fe5bdae92d6c7606faa5e475556882d6ad931424c9a3c8a4bce42359e6",
	name: "fetchDeskErrors",
	filename: "src/lib/desk/desk-rpc.ts"
}, (opts) => fetchDeskErrors.__executeServer(opts));
var fetchDeskErrors = createServerFn({ method: "GET" }).handler(fetchDeskErrors_createServerFn_handler, async () => {
	const { listDeskErrors, recordDeskFails } = await import("./error-log-DsgXhkRT.mjs");
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
	const { verifyAccessToken } = await import("./access.server-CaZHHbCU.mjs");
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
	const { listIntrusions, intrusionSummary, ingestPersisted } = await import("./intrusion-log-Dl3lKsr8.mjs").then((n) => n.a).then((n) => n.a);
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
	const { verifyAccessToken } = await import("./access.server-CaZHHbCU.mjs");
	if (!await verifyAccessToken(data.token)) return {
		ok: false,
		report: null
	};
	const { hydrateSecurityDisk } = await import("./posture-C7xbcaOa.mjs");
	hydrateSecurityDisk();
	const { runHunter } = await import("./hunter-BiB3s5EG.mjs").then((n) => n.s).then((n) => n.r);
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
	const { verifyAccessToken } = await import("./access.server-CaZHHbCU.mjs");
	if (!await verifyAccessToken(data.token)) return {
		ok: false,
		posture: null
	};
	const { securityPosture } = await import("./posture-C7xbcaOa.mjs");
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
	const { verifyAccessToken } = await import("./access.server-CaZHHbCU.mjs");
	if (!await verifyAccessToken(data.token)) return {
		ok: false,
		brief: null,
		badBots: null,
		health: null,
		alignment: null
	};
	try {
		const fs = await import("node:fs");
		const { ingestPersisted } = await import("./intrusion-log-Dl3lKsr8.mjs").then((n) => n.a).then((n) => n.a);
		ingestPersisted(JSON.parse(fs.readFileSync("/tmp/desk-intrusions.json", "utf8")));
	} catch {}
	const { morningSecurity, morningBadBots } = await import("./morning-ops-Di63Csd2.mjs").then((n) => n.s).then((n) => n.s);
	const { systemHealth } = await import("./system-health-B0GUPVzU.mjs").then((n) => n.n).then((n) => n.n);
	const { alignmentScore } = await import("./alignment-Dny0XkYu.mjs").then((n) => n.n).then((n) => n.n);
	const { listAgentBars } = await import("./agent-bar-CWDlzF7K.mjs").then((n) => n.t).then((n) => n.t);
	const { badBotIntrusions } = await import("./intrusion-log-Dl3lKsr8.mjs").then((n) => n.a).then((n) => n.a);
	const bars = listAgentBars();
	const probes = badBotIntrusions(24).map((r) => ({
		at: r.at,
		kind: r.kind,
		detail: r.detail,
		ip: r.ip
	}));
	return {
		ok: true,
		brief: morningSecurity(),
		health: systemHealth(),
		alignment: alignmentScore(),
		badBots: morningBadBots({
			barred: bars.rows.map((r) => ({
				id: r.id,
				at: r.at,
				name: r.name,
				handle: r.handle,
				kind: r.kind,
				ip: r.ip,
				reason: r.reason
			})),
			probes
		})
	};
});
var fetchAgentFlags_createServerFn_handler = createServerRpc({
	id: "428fb23ec9fdf3ede46607e1241acc80a5022a44f56391a98b427fcb0e9286ec",
	name: "fetchAgentFlags",
	filename: "src/lib/desk/desk-rpc.ts"
}, (opts) => fetchAgentFlags.__executeServer(opts));
var fetchAgentFlags = createServerFn({ method: "GET" }).handler(fetchAgentFlags_createServerFn_handler, async () => {
	const { peekAgentFlags } = await import("./agent-ping-BXZGzZ_N.mjs").then((n) => n.n).then((n) => n.t);
	const { agentGatePublic, peekAgentGate } = await import("./agent-gate-Dc4_BNmM.mjs").then((n) => n.r);
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
	const { verifyAccessToken } = await import("./access.server-CaZHHbCU.mjs");
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
	const { peekAgentGate, agentGatePublic } = await import("./agent-gate-Dc4_BNmM.mjs").then((n) => n.r);
	const { waitlistAdmin } = await import("./agent-gate-Dc4_BNmM.mjs").then((n) => n.l);
	const { listAgentBars } = await import("./agent-bar-CWDlzF7K.mjs").then((n) => n.t).then((n) => n.t);
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
	const { verifyAccessToken } = await import("./access.server-CaZHHbCU.mjs");
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
	const { setAgentComm, peekAgentGate, agentGatePublic } = await import("./agent-gate-Dc4_BNmM.mjs").then((n) => n.r);
	const { waitlistAdmin } = await import("./agent-gate-Dc4_BNmM.mjs").then((n) => n.l);
	const { listAgentBars } = await import("./agent-bar-CWDlzF7K.mjs").then((n) => n.t).then((n) => n.t);
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
	const { verifyAccessToken } = await import("./access.server-CaZHHbCU.mjs");
	if (!await verifyAccessToken(data.token)) return {
		ok: false,
		error: "Admin session required",
		bars: {
			count: 0,
			rows: []
		}
	};
	const { unbarAgent: drop } = await import("./agent-bar-CWDlzF7K.mjs").then((n) => n.t).then((n) => n.t);
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
	const { verifyAccessToken } = await import("./access.server-CaZHHbCU.mjs");
	const system = await verifyAccessToken(data.token);
	const { verifyAppAdminToken } = await import("./app-admin-DF3iX8xC.mjs");
	const copy = verifyAppAdminToken(data.token);
	if (!system && !copy) return {
		ok: false,
		paused: true,
		pausedAt: null,
		reports: []
	};
	const { getMorningLib } = await import("./morning-lib.server-8ELMhzrr.mjs");
	return {
		ok: true,
		...await getMorningLib(),
		role: system ? "system" : "app-admin"
	};
});
var setMorningReportPaused_createServerFn_handler = createServerRpc({
	id: "56a5cd771ece1bf754af79b4554bf63f9f41484e364fb0b15cf2e36f5ee5bc68",
	name: "setMorningReportPaused",
	filename: "src/lib/desk/desk-rpc.ts"
}, (opts) => setMorningReportPaused.__executeServer(opts));
var setMorningReportPaused = createServerFn({ method: "POST" }).validator((input) => input).handler(setMorningReportPaused_createServerFn_handler, async ({ data }) => {
	const { verifyAccessToken } = await import("./access.server-CaZHHbCU.mjs");
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
	const { readAuto24h } = await import("./auto-24h.server-BQxnsIL4.mjs");
	return readAuto24h();
});
var fetchGmBoard_createServerFn_handler = createServerRpc({
	id: "08630dbdcc82e7ea9c877dbd4ba7153b1214827c58fc307a622d2d33054bfe0c",
	name: "fetchGmBoard",
	filename: "src/lib/desk/desk-rpc.ts"
}, (opts) => fetchGmBoard.__executeServer(opts));
var fetchGmBoard = createServerFn({ method: "POST" }).validator((input) => input).handler(fetchGmBoard_createServerFn_handler, async ({ data }) => {
	const { verifyAccessToken } = await import("./access.server-CaZHHbCU.mjs");
	if (!await verifyAccessToken(data.token)) return {
		ok: false,
		error: "Admin session required",
		board: null
	};
	const { boardAdmin } = await import("./gm-board-DLUKXXL9.mjs").then((n) => n.a);
	return {
		ok: true,
		error: null,
		board: boardAdmin()
	};
});
var setGmBoardStatus_createServerFn_handler = createServerRpc({
	id: "2f88814ebe3c10d7156b6db6201076371c639ae3cf2a2a3bea005f8bfe6622dc",
	name: "setGmBoardStatus",
	filename: "src/lib/desk/desk-rpc.ts"
}, (opts) => setGmBoardStatus.__executeServer(opts));
var setGmBoardStatus = createServerFn({ method: "POST" }).validator((input) => input).handler(setGmBoardStatus_createServerFn_handler, async ({ data }) => {
	const { verifyAccessToken } = await import("./access.server-CaZHHbCU.mjs");
	if (!await verifyAccessToken(data.token)) return {
		ok: false,
		error: "Admin session required",
		board: null
	};
	const next = data.status === "LIVE" ? "LIVE" : "PAUSED";
	const { setBoardStatus } = await import("./gm-board-DLUKXXL9.mjs").then((n) => n.a);
	return {
		ok: true,
		error: null,
		board: setBoardStatus(next)
	};
});
var setGmWagerStatus_createServerFn_handler = createServerRpc({
	id: "38899cab9b9e1946a930cd4a4c0042c64434b8f36fc9e04151f9faf8a5584e5c",
	name: "setGmWagerStatus",
	filename: "src/lib/desk/desk-rpc.ts"
}, (opts) => setGmWagerStatus.__executeServer(opts));
var setGmWagerStatus = createServerFn({ method: "POST" }).validator((input) => input).handler(setGmWagerStatus_createServerFn_handler, async ({ data }) => {
	const { verifyAccessToken } = await import("./access.server-CaZHHbCU.mjs");
	if (!await verifyAccessToken(data.token)) return {
		ok: false,
		error: "Admin session required",
		wager: null
	};
	const { setWagerLive, wagerAdmin } = await import("./board-wager-CPdvFgGb.mjs").then((n) => n.t).then((n) => n.t);
	return {
		ok: true,
		error: null,
		wager: setWagerLive(Boolean(data.live)),
		peek: wagerAdmin()
	};
});
var setChampionshipSim_createServerFn_handler = createServerRpc({
	id: "cb77de7687fb7901cd976bb9f5db41657c61a486dce837e7a876bd337b90b3a6",
	name: "setChampionshipSim",
	filename: "src/lib/desk/desk-rpc.ts"
}, (opts) => setChampionshipSim.__executeServer(opts));
var setChampionshipSim = createServerFn({ method: "POST" }).validator((input) => input).handler(setChampionshipSim_createServerFn_handler, async ({ data }) => {
	const { verifyAccessToken } = await import("./access.server-CaZHHbCU.mjs");
	const system = await verifyAccessToken(data.token);
	const { verifyAppAdminToken } = await import("./app-admin-DF3iX8xC.mjs");
	const copy = verifyAppAdminToken(data.token);
	if (!system && !copy) return {
		ok: false,
		error: "Admin session required",
		sim: null
	};
	const next = data.status === "PAUSED" ? "PAUSED" : "LIVE";
	const { setSimStatus } = await import("./world-cup-BbyoqAEQ.mjs").then((n) => n.f).then((n) => n.r);
	return {
		ok: true,
		error: null,
		sim: setSimStatus(next, system ? "system" : "app-admin"),
		role: system ? "system" : "app-admin"
	};
});
var fetchChampionshipSim_createServerFn_handler = createServerRpc({
	id: "c1ffd201e31acae1978bd563ee10bd68425f83d4908a6344d37b9352c784f10a",
	name: "fetchChampionshipSim",
	filename: "src/lib/desk/desk-rpc.ts"
}, (opts) => fetchChampionshipSim.__executeServer(opts));
var fetchChampionshipSim = createServerFn({ method: "POST" }).validator((input) => input).handler(fetchChampionshipSim_createServerFn_handler, async ({ data }) => {
	const { verifyAccessToken } = await import("./access.server-CaZHHbCU.mjs");
	const system = await verifyAccessToken(data.token);
	const { verifyAppAdminToken } = await import("./app-admin-DF3iX8xC.mjs");
	const copy = verifyAppAdminToken(data.token);
	if (!system && !copy) return {
		ok: false,
		error: "Admin session required",
		sim: null
	};
	const { simAdmin } = await import("./world-cup-BbyoqAEQ.mjs").then((n) => n.f).then((n) => n.r);
	return {
		ok: true,
		error: null,
		sim: simAdmin(),
		role: system ? "system" : "app-admin"
	};
});
var fetchHiveSwarm_createServerFn_handler = createServerRpc({
	id: "31199baf80fc241309bd11b14e343ec48ad346fb093882e65b45c27ba8367cb4",
	name: "fetchHiveSwarm",
	filename: "src/lib/desk/desk-rpc.ts"
}, (opts) => fetchHiveSwarm.__executeServer(opts));
var fetchHiveSwarm = createServerFn({ method: "POST" }).validator((input) => input).handler(fetchHiveSwarm_createServerFn_handler, async ({ data }) => {
	const { verifyAccessToken } = await import("./access.server-CaZHHbCU.mjs");
	const system = await verifyAccessToken(data.token);
	const { verifyAppAdminToken } = await import("./app-admin-DF3iX8xC.mjs");
	const copy = verifyAppAdminToken(data.token);
	if (!system && !copy) return {
		ok: false,
		error: "Admin session required",
		hive: null
	};
	const { hiveAdmin } = await import("./hive-swarm-DEKKrd6z.mjs").then((n) => n.r);
	return {
		ok: true,
		error: null,
		hive: hiveAdmin(),
		role: system ? "system" : "app-admin"
	};
});
var setHiveSwarmStatus_createServerFn_handler = createServerRpc({
	id: "7a4996c4db8a1aa4cca15b656b13d1e29fd87e599208137f37c014607844e570",
	name: "setHiveSwarmStatus",
	filename: "src/lib/desk/desk-rpc.ts"
}, (opts) => setHiveSwarmStatus.__executeServer(opts));
var setHiveSwarmStatus = createServerFn({ method: "POST" }).validator((input) => input).handler(setHiveSwarmStatus_createServerFn_handler, async ({ data }) => {
	const { verifyAccessToken } = await import("./access.server-CaZHHbCU.mjs");
	const system = await verifyAccessToken(data.token);
	const { verifyAppAdminToken } = await import("./app-admin-DF3iX8xC.mjs");
	const copy = verifyAppAdminToken(data.token);
	if (!system && !copy) return {
		ok: false,
		error: "Admin session required",
		hive: null
	};
	const next = data.status === "PAUSED" ? "PAUSED" : "LIVE";
	const { setHiveStatus } = await import("./hive-swarm-DEKKrd6z.mjs").then((n) => n.r);
	return {
		ok: true,
		error: null,
		hive: setHiveStatus(next, system ? "system" : "app-admin")
	};
});
var fetchLiveSim_createServerFn_handler = createServerRpc({
	id: "31e5dd3b28e06f49ffb01f32fd9dcf61760e2f54fc54f4bb0be3c65ae954c524",
	name: "fetchLiveSim",
	filename: "src/lib/desk/desk-rpc.ts"
}, (opts) => fetchLiveSim.__executeServer(opts));
var fetchLiveSim = createServerFn({ method: "POST" }).validator((input) => input).handler(fetchLiveSim_createServerFn_handler, async ({ data }) => {
	const { verifyAccessToken } = await import("./access.server-CaZHHbCU.mjs");
	const system = await verifyAccessToken(data.token);
	const { verifyAppAdminToken } = await import("./app-admin-DF3iX8xC.mjs");
	const copy = verifyAppAdminToken(data.token);
	if (!system && !copy) return {
		ok: false,
		error: "Admin session required",
		sim: null
	};
	const { ensureLiveSimScheduler, liveSimPublic } = await import("./live-sim.server-D_G8ZcxV.mjs");
	ensureLiveSimScheduler();
	return {
		ok: true,
		error: null,
		sim: liveSimPublic(),
		role: system ? "system" : "app-admin"
	};
});
var setLiveSim_createServerFn_handler = createServerRpc({
	id: "c09a6d649fb46548c258d51fc8c79aa919eaeab41ae6f0e8b4ec34c4e89e699f",
	name: "setLiveSim",
	filename: "src/lib/desk/desk-rpc.ts"
}, (opts) => setLiveSim.__executeServer(opts));
var setLiveSim = createServerFn({ method: "POST" }).validator((input) => input).handler(setLiveSim_createServerFn_handler, async ({ data }) => {
	const { verifyAccessToken } = await import("./access.server-CaZHHbCU.mjs");
	const system = await verifyAccessToken(data.token);
	const { verifyAppAdminToken } = await import("./app-admin-DF3iX8xC.mjs");
	const copy = verifyAppAdminToken(data.token);
	if (!system && !copy) return {
		ok: false,
		error: "Admin session required",
		sim: null
	};
	const { setLiveSimStatus, ensureLiveSimScheduler } = await import("./live-sim.server-D_G8ZcxV.mjs");
	ensureLiveSimScheduler();
	return {
		ok: true,
		error: null,
		sim: setLiveSimStatus(data.status === "PAUSED" ? "PAUSED" : "LIVE", system ? "system" : "app-admin"),
		role: system ? "system" : "app-admin"
	};
});
var fetchLockStatus_createServerFn_handler = createServerRpc({
	id: "5fd7063674cca64fc5e76ee9b5c2a184e05a286f85934a9fde69c05c144aa196",
	name: "fetchLockStatus",
	filename: "src/lib/desk/desk-rpc.ts"
}, (opts) => fetchLockStatus.__executeServer(opts));
var fetchLockStatus = createServerFn({ method: "GET" }).handler(fetchLockStatus_createServerFn_handler, async () => {
	const { lockStatusPublic } = await import("./lock-status.server-DnOhzGpx.mjs");
	return lockStatusPublic();
});
var setLockStatus_createServerFn_handler = createServerRpc({
	id: "ec4a1a26b62741ff71065c73371b20f95621e484f8951dd4ab7e95e2add1f9c5",
	name: "setLockStatus",
	filename: "src/lib/desk/desk-rpc.ts"
}, (opts) => setLockStatus.__executeServer(opts));
var setLockStatus = createServerFn({ method: "POST" }).validator((input) => input).handler(setLockStatus_createServerFn_handler, async ({ data }) => {
	const { verifyAccessToken } = await import("./access.server-CaZHHbCU.mjs");
	const system = await verifyAccessToken(data.token);
	const { verifyAppAdminToken } = await import("./app-admin-DF3iX8xC.mjs");
	const copy = verifyAppAdminToken(data.token);
	if (!system && !copy) return {
		ok: false,
		error: "Admin session required",
		lock: null
	};
	const by = system ? "system" : "app-admin";
	const { applyMaster, setOneLock, setLockInclude, setIncludeAll, setDeskMode, lockStatusPublic } = await import("./lock-status.server-DnOhzGpx.mjs");
	if (data.op === "mode") return {
		ok: true,
		error: null,
		lock: setDeskMode(data.mode === "LIVE" ? "LIVE" : "SIM", by),
		role: by
	};
	if (data.op === "includeAll") return {
		ok: true,
		error: null,
		lock: setIncludeAll(Boolean(data.include), by),
		role: by
	};
	if (data.op === "include" && data.id) return {
		ok: true,
		error: null,
		lock: setLockInclude(data.id, Boolean(data.include), by),
		role: by
	};
	if (data.op === "one" && data.id) return {
		ok: true,
		error: null,
		lock: setOneLock(data.id, Boolean(data.locked), by),
		role: by
	};
	if (data.op === "master") return {
		ok: true,
		error: null,
		lock: applyMaster(Boolean(data.locked), by),
		role: by
	};
	return {
		ok: true,
		error: null,
		lock: lockStatusPublic(),
		role: by
	};
});
//#endregion
export { fetchAgentFlags_createServerFn_handler, fetchAgentGate_createServerFn_handler, fetchAuto24h_createServerFn_handler, fetchChampionshipSim_createServerFn_handler, fetchDeskErrors_createServerFn_handler, fetchDesk_createServerFn_handler, fetchGmBoard_createServerFn_handler, fetchHiveSwarm_createServerFn_handler, fetchIntrusions_createServerFn_handler, fetchLiveSim_createServerFn_handler, fetchLockStatus_createServerFn_handler, fetchMorningLib_createServerFn_handler, fetchPracticePulse_createServerFn_handler, fetchSecurityBrief_createServerFn_handler, fetchSecurityPosture_createServerFn_handler, fetchTapeMeta_createServerFn_handler, postPracticePulse_createServerFn_handler, rebuildDesk_createServerFn_handler, runHunterAudit_createServerFn_handler, setAgentGate_createServerFn_handler, setChampionshipSim_createServerFn_handler, setGmBoardStatus_createServerFn_handler, setGmWagerStatus_createServerFn_handler, setHiveSwarmStatus_createServerFn_handler, setLiveSim_createServerFn_handler, setLockStatus_createServerFn_handler, setMorningReportPaused_createServerFn_handler, setTapeFreeze_createServerFn_handler, unbarAgent_createServerFn_handler };
