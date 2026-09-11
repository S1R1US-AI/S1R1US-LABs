import { t as MORNING_TITLE } from "./morning-lib-D4ZKOXow.mjs";
import path from "node:path";
import { access, copyFile, mkdir, readFile, readdir, writeFile } from "node:fs/promises";
//#region ../../workspace/node_modules/.nitro/vite/services/ssr/assets/morning-lib.server-8ELMhzrr.js
var ROOT = process.cwd();
var INDEX = path.join(ROOT, "data", "morning-lib.json");
var PUBLIC_LIB = path.join(ROOT, "public", "morning-lib");
var LIVE_PDF = path.join(ROOT, "public", "S1R1US-Morning-Report.pdf");
var empty = {
	paused: false,
	pausedAt: null,
	reports: []
};
function etDay(d = /* @__PURE__ */ new Date()) {
	return new Intl.DateTimeFormat("en-CA", {
		timeZone: "America/New_York",
		year: "numeric",
		month: "2-digit",
		day: "2-digit"
	}).format(d);
}
async function exists(p) {
	try {
		await access(p);
		return true;
	} catch {
		return false;
	}
}
async function readLib() {
	try {
		const raw = await readFile(INDEX, "utf8");
		const j = JSON.parse(raw);
		return {
			paused: Boolean(j.paused),
			pausedAt: j.pausedAt ?? null,
			reports: Array.isArray(j.reports) ? j.reports : []
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
		reports: lib.reports.slice(0, 14)
	};
	await writeFile(INDEX, JSON.stringify(next, null, 2) + "\n", "utf8");
	return next;
}
async function thumbsFor(id, files) {
	return files.filter((f) => new RegExp(`^${id}-\\d+\\.jpg$`).test(f)).sort((a, b) => a.localeCompare(b, void 0, { numeric: true })).map((f) => `/morning-lib/${f}`);
}
async function archiveLive(id, at) {
	await mkdir(PUBLIC_LIB, { recursive: true });
	if (!await exists(LIVE_PDF)) return null;
	const destPdf = path.join(PUBLIC_LIB, `${id}.pdf`);
	if (!await exists(destPdf)) await copyFile(LIVE_PDF, destPdf);
	const thumbs = [];
	for (let n = 1; n <= 8; n++) {
		const src = path.join(ROOT, "public", `morning-report-${n}.jpg`);
		if (!await exists(src)) break;
		const dest = path.join(PUBLIC_LIB, `${id}-${n}.jpg`);
		if (!await exists(dest)) await copyFile(src, dest);
		thumbs.push(`/morning-lib/${id}-${n}.jpg`);
	}
	return {
		id,
		at: at ?? (/* @__PURE__ */ new Date()).toISOString(),
		title: MORNING_TITLE,
		pages: thumbs.length || 1,
		pdf: `/morning-lib/${id}.pdf`,
		thumbs
	};
}
async function hydrate() {
	const lib = await readLib();
	const byId = new Map(lib.reports.map((r) => [r.id, r]));
	let files = [];
	try {
		files = await readdir(PUBLIC_LIB);
	} catch {
		files = [];
	}
	for (const f of files) {
		const m = f.match(/^(\d{4}-\d{2}-\d{2})\.pdf$/);
		if (!m) continue;
		const id = m[1];
		const thumbs = await thumbsFor(id, files);
		const prev = byId.get(id);
		byId.set(id, {
			id,
			at: prev?.at ?? `${id}T12:00:00-04:00`,
			title: prev?.title ?? "S1R1U$ M0rning R3p0rt",
			pages: thumbs.length || prev?.pages || 1,
			pdf: `/morning-lib/${id}.pdf`,
			thumbs: thumbs.length ? thumbs : prev?.thumbs ?? []
		});
	}
	const today = etDay();
	if (!lib.paused && !byId.has(today)) {
		const rec = await archiveLive(today);
		if (rec) byId.set(today, rec);
	}
	for (const r of [...byId.values()]) {
		if (await exists(path.join(PUBLIC_LIB, `${r.id}.pdf`))) continue;
		const rec = await archiveLive(r.id, r.at);
		if (rec) byId.set(r.id, {
			...r,
			...rec,
			at: r.at,
			title: r.title
		});
	}
	const reports = [...byId.values()].sort((a, b) => b.id.localeCompare(a.id)).slice(0, 14);
	return writeLib({
		...lib,
		reports
	});
}
async function getMorningLib() {
	return hydrate();
}
async function readMorningPdf(id) {
	if (!/^\d{4}-\d{2}-\d{2}$/.test(id)) return null;
	await hydrate();
	const p = path.join(PUBLIC_LIB, `${id}.pdf`);
	try {
		return await readFile(p);
	} catch {
		return null;
	}
}
async function setMorningPaused(paused) {
	const lib = await hydrate();
	lib.paused = paused;
	lib.pausedAt = paused ? (/* @__PURE__ */ new Date()).toISOString() : null;
	return writeLib(lib);
}
//#endregion
export { getMorningLib, readMorningPdf, setMorningPaused };
