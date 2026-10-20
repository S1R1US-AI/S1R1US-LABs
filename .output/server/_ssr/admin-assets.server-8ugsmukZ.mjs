import { i as cookieValue, isAdminToken, n as ADMIN_ASSET_HEADERS, r as adminAssetDecision, t as ADMIN_ASSET_COOKIE } from "./admin-gate.server-BhKp4MMm.mjs";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-assets.server-8ugsmukZ.js
/** Server-only: serves the admin page code that the build moved out of the public folder. */
var cache = null;
function gatedDir() {
	if (cache) return cache;
	const roots = [join(process.cwd(), ".output/server/admin-assets")];
	if (process.argv[1]) roots.push(join(dirname(process.argv[1]), "admin-assets"));
	for (const dir of roots) {
		const list = join(dir, "admin-assets.json");
		if (!existsSync(list)) continue;
		try {
			const names = JSON.parse(readFileSync(list, "utf8")).files ?? [];
			cache = {
				dir,
				names: new Set(names.map((n) => n.toLowerCase())),
				real: new Map(names.map((n) => [n.toLowerCase(), n]))
			};
			return cache;
		} catch {}
	}
	cache = {
		dir: "",
		names: /* @__PURE__ */ new Set(),
		real: /* @__PURE__ */ new Map()
	};
	return cache;
}
function notFound(head) {
	return new Response(head ? null : "Not found", {
		status: 404,
		headers: {
			...ADMIN_ASSET_HEADERS,
			"content-type": "text/plain; charset=utf-8"
		}
	});
}
async function serveAdminAsset(request) {
	const head = request.method === "HEAD";
	const url = new URL(request.url);
	const { dir, names, real } = gatedDir();
	if (!adminAssetDecision(url.pathname, names, true).serve) return notFound(head);
	const token = cookieValue(request.headers.get("cookie"), ADMIN_ASSET_COOKIE);
	const ok = await isAdminToken(token);
	const decision = adminAssetDecision(url.pathname, names, ok);
	if (!decision.serve || !dir) return notFound(head);
	let body;
	try {
		const file = real.get(decision.serve);
		if (!file) return notFound(head);
		body = readFileSync(join(dir, file));
	} catch {
		return notFound(head);
	}
	return new Response(head ? null : new Uint8Array(body), {
		status: 200,
		headers: {
			...ADMIN_ASSET_HEADERS,
			"content-type": "text/javascript; charset=utf-8"
		}
	});
}
//#endregion
export { serveAdminAsset };
