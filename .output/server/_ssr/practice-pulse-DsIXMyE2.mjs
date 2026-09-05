//#region node_modules/.nitro/vite/services/ssr/assets/practice-pulse-DsIXMyE2.js
var PATH = "/workspace/data/practice-pulse.json";
var mem = null;
async function loadPulse() {
	if (mem) return mem;
	try {
		const fs = await import("node:fs");
		mem = JSON.parse(fs.readFileSync(PATH, "utf8"));
		return mem;
	} catch {
		return null;
	}
}
async function writePulse(p) {
	mem = p;
	try {
		const fs = await import("node:fs");
		fs.mkdirSync("/workspace/data", { recursive: true });
		fs.writeFileSync(PATH, JSON.stringify(p, null, 2));
	} catch {}
}
//#endregion
export { loadPulse, writePulse };
