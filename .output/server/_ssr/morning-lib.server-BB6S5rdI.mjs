import path from "node:path";
import { mkdir, readFile, writeFile } from "node:fs/promises";
//#region node_modules/.nitro/vite/services/ssr/assets/morning-lib.server-BB6S5rdI.js
var ROOT = process.cwd();
var INDEX = path.join(ROOT, "data", "morning-lib.json");
var PUBLIC_LIB = path.join(ROOT, "public", "morning-lib");
var empty = {
	paused: false,
	pausedAt: null,
	reports: []
};
async function readLib() {
	try {
		const raw = await readFile(INDEX, "utf8");
		const j = JSON.parse(raw);
		return {
			paused: Boolean(j.paused),
			pausedAt: j.pausedAt ?? null,
			reports: Array.isArray(j.reports) ? j.reports.slice(0, 10) : []
		};
	} catch {
		return {
			...empty,
			reports: []
		};
	}
}
async function writeLib(lib) {
	await mkdir(path.dirname(INDEX), { recursive: true });
	await mkdir(PUBLIC_LIB, { recursive: true });
	const next = {
		paused: lib.paused,
		pausedAt: lib.pausedAt,
		reports: lib.reports.slice(0, 10)
	};
	await writeFile(INDEX, JSON.stringify(next, null, 2) + "\n", "utf8");
	return next;
}
async function getMorningLib() {
	return readLib();
}
async function setMorningPaused(paused) {
	const lib = await readLib();
	lib.paused = paused;
	lib.pausedAt = paused ? (/* @__PURE__ */ new Date()).toISOString() : null;
	return writeLib(lib);
}
//#endregion
export { getMorningLib, setMorningPaused };
