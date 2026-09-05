import { r as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/desk-rpc-B9E-ZXEO.js
var fetchDesk_createServerFn_handler = createServerRpc({
	id: "5cf62f4e779d5d6880a0cc11d158c6be2e5eeb2026216ec06a53d5d2048406cd",
	name: "fetchDesk",
	filename: "src/lib/desk/desk-rpc.ts"
}, (opts) => fetchDesk.__executeServer(opts));
var fetchDesk = createServerFn({ method: "GET" }).validator((input) => input ?? {}).handler(fetchDesk_createServerFn_handler, async ({ data }) => {
	const { loadSnapshot } = await import("./sources-25H2sJoh.mjs");
	const { isTapeFrozen } = await import("./tape-persist-B9CZUPQm.mjs");
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
	const { lastGoodMeta } = await import("./tape-persist-B9CZUPQm.mjs");
	return lastGoodMeta();
});
var setTapeFreeze_createServerFn_handler = createServerRpc({
	id: "645ce5dcd2143f301180bb73a3bbb42b5706b9673c921fa057498f2781d8f8b4",
	name: "setTapeFreeze",
	filename: "src/lib/desk/desk-rpc.ts"
}, (opts) => setTapeFreeze.__executeServer(opts));
var setTapeFreeze = createServerFn({ method: "POST" }).validator((input) => input).handler(setTapeFreeze_createServerFn_handler, async ({ data }) => {
	const { verifyAccessToken } = await import("./access.server-kLQeMage.mjs");
	const { setTapeFrozen, lastGoodMeta } = await import("./tape-persist-B9CZUPQm.mjs");
	if (!await verifyAccessToken(data.token)) return {
		ok: false,
		error: "Admin session required",
		...lastGoodMeta()
	};
	setTapeFrozen(data.frozen);
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
	const { verifyAccessToken } = await import("./access.server-kLQeMage.mjs");
	const { loadSnapshot } = await import("./sources-25H2sJoh.mjs");
	const { isTapeFrozen } = await import("./tape-persist-B9CZUPQm.mjs");
	if (!await verifyAccessToken(data.token) || isTapeFrozen()) return loadSnapshot(false);
	return loadSnapshot(true);
});
var fetchDeskErrors_createServerFn_handler = createServerRpc({
	id: "a09f23fe5bdae92d6c7606faa5e475556882d6ad931424c9a3c8a4bce42359e6",
	name: "fetchDeskErrors",
	filename: "src/lib/desk/desk-rpc.ts"
}, (opts) => fetchDeskErrors.__executeServer(opts));
var fetchDeskErrors = createServerFn({ method: "GET" }).handler(fetchDeskErrors_createServerFn_handler, async () => {
	const { listDeskErrors, recordDeskFails } = await import("./error-log-De_6DD9t.mjs");
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
var fetchMorningLib_createServerFn_handler = createServerRpc({
	id: "f57bee00551cea168a828cfda0a1bbfa0a2802559e29d2c609fe1d31497cd3cf",
	name: "fetchMorningLib",
	filename: "src/lib/desk/desk-rpc.ts"
}, (opts) => fetchMorningLib.__executeServer(opts));
var fetchMorningLib = createServerFn({ method: "POST" }).validator((input) => input).handler(fetchMorningLib_createServerFn_handler, async ({ data }) => {
	const { verifyAccessToken } = await import("./access.server-kLQeMage.mjs");
	if (!await verifyAccessToken(data.token)) return {
		ok: false,
		paused: true,
		pausedAt: null,
		reports: []
	};
	const { getMorningLib } = await import("./morning-lib.server-BB6S5rdI.mjs");
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
	const { verifyAccessToken } = await import("./access.server-kLQeMage.mjs");
	if (!await verifyAccessToken(data.token)) return {
		ok: false,
		paused: true,
		pausedAt: null,
		reports: []
	};
	const { setMorningPaused } = await import("./morning-lib.server-BB6S5rdI.mjs");
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
	const { readAuto24h } = await import("./auto-24h.server-Du8KymGg.mjs");
	return readAuto24h();
});
//#endregion
export { fetchAuto24h_createServerFn_handler, fetchDeskErrors_createServerFn_handler, fetchDesk_createServerFn_handler, fetchMorningLib_createServerFn_handler, fetchPracticePulse_createServerFn_handler, fetchTapeMeta_createServerFn_handler, postPracticePulse_createServerFn_handler, rebuildDesk_createServerFn_handler, setMorningReportPaused_createServerFn_handler, setTapeFreeze_createServerFn_handler };
