import { r as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-BgpH4YR6.mjs";
//#region ../../workspace/node_modules/.nitro/vite/services/ssr/assets/gm-live-eHhI50Pc.js
var FILE = "data/gm-live.json";
async function readLive() {
	try {
		const { readFile } = await import("node:fs/promises");
		const raw = await readFile(FILE, "utf8");
		const j = JSON.parse(raw);
		return {
			liveUnlocked: Boolean(j.liveUnlocked),
			at: j.at ?? null
		};
	} catch {
		return {
			liveUnlocked: false,
			at: null
		};
	}
}
async function writeLive(next) {
	const { mkdir, writeFile } = await import("node:fs/promises");
	const { dirname } = await import("node:path");
	await mkdir(dirname(FILE), { recursive: true });
	await writeFile(FILE, JSON.stringify(next, null, 2) + "\n", "utf8");
	return next;
}
var getGmLive_createServerFn_handler = createServerRpc({
	id: "3bb2b512072976cd3a86a22f8611883216c8291ee761c4550c25d6127801d639",
	name: "getGmLive",
	filename: "src/lib/desk/gm-live.ts"
}, (opts) => getGmLive.__executeServer(opts));
var getGmLive = createServerFn({ method: "GET" }).handler(getGmLive_createServerFn_handler, async () => readLive());
var setGmLive_createServerFn_handler = createServerRpc({
	id: "08afd2e285c9ae25b69be9b0b0689069cb0b951c9f4e04fb46b172d4fbefd0e7",
	name: "setGmLive",
	filename: "src/lib/desk/gm-live.ts"
}, (opts) => setGmLive.__executeServer(opts));
var setGmLive = createServerFn({ method: "POST" }).validator((input) => input).handler(setGmLive_createServerFn_handler, async ({ data }) => {
	const { verifyAccessToken } = await import("./access.server-CkRZvMBK.mjs");
	if (!await verifyAccessToken(data.token)) return {
		ok: false,
		error: "Admin session required.",
		liveUnlocked: false,
		at: null
	};
	const next = await writeLive({
		liveUnlocked: Boolean(data.liveUnlocked),
		at: (/* @__PURE__ */ new Date()).toISOString()
	});
	try {
		const { stampGoLiveNotice } = await import("./go-live-notices-y5KTHj_G.mjs").then((n) => n.t).then((n) => n.t);
		stampGoLiveNotice(next.liveUnlocked ? "LIVE_ON" : "LIVE_OFF", next.liveUnlocked ? "GM live sleeve unlocked (operator)" : "GM live sleeve locked", next.liveUnlocked ? "Operator flipped GM live ON. This website still never places Coinbase orders for external AI agents. You execute on YOUR Coinbase. Poll goLiveNotice." : "Operator flipped GM live OFF. Auto trade remains locked on this host. Poll goLiveNotice.");
	} catch {}
	return {
		ok: true,
		...next
	};
});
//#endregion
export { getGmLive_createServerFn_handler, setGmLive_createServerFn_handler };
