import { n as GO_LIVE_DEADLINE } from "./go-live-DktWNPuy.mjs";
import { r as checkpointLabel } from "./checkpoint-C6kJwYoY.mjs";
import { i as liveSimNote, n as LIVE_SIM_SEO, r as LIVE_SIM_TZ, t as LIVE_SIM_NAME } from "./live-sim-C2yWsSkm.mjs";
import { i as setTapeFrozen, t as isTapeFrozen } from "./tape-persist-CHN2yE-V.mjs";
import { r as stampGoLiveNotice } from "./go-live-notices-y5KTHj_G.mjs";
import { writePulse } from "./practice-pulse-DsIXMyE2.mjs";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
//#region node_modules/.nitro/vite/services/ssr/assets/live-sim.server-DykJKMX5.js
/**
* As-live G M0D3 AUTO + AI-agent simulation until go-live.
* Daily: run until 07:00 ET, pause, morning report 07:30 ET, resume.
* System Admin and copy-admin may pause. Championship pause stays system-only.
* Stray practice AUTO ticks stay killed. This host never places Coinbase orders.
*/
var PATHS = process.env.NODE_TEST_CONTEXT ? ["/tmp/live-sim-test.json"] : ["/tmp/live-sim.json", "/workspace/data/live-sim.json"];
var PRACTICE_KILL = process.env.NODE_TEST_CONTEXT ? "/tmp/practice-killed-test.json" : "/workspace/data/practice-killed.json";
function pad(n) {
	return String(n).padStart(2, "0");
}
function etParts(d = /* @__PURE__ */ new Date()) {
	const fmt = new Intl.DateTimeFormat("en-US", {
		timeZone: LIVE_SIM_TZ,
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
		hourCycle: "h23"
	});
	const p = Object.fromEntries(fmt.formatToParts(d).filter((x) => x.type !== "literal").map((x) => [x.type, x.value]));
	return {
		y: Number(p.year),
		m: Number(p.month),
		d: Number(p.day),
		H: Number(p.hour),
		M: Number(p.minute)
	};
}
function etInstant(y, m, d, H, M) {
	for (const off of ["-04:00", "-05:00"]) {
		const t = Date.parse(`${y}-${pad(m)}-${pad(d)}T${pad(H)}:${pad(M)}:00${off}`);
		if (!Number.isFinite(t)) continue;
		const p = etParts(new Date(t));
		if (p.y === y && p.m === m && p.d === d && p.H === H && p.M === M) return t;
	}
	return Date.parse(`${y}-${pad(m)}-${pad(d)}T${pad(H)}:${pad(M)}:00-04:00`);
}
function addEtDays(y, m, d, days) {
	const t = etInstant(y, m, d, 12, 0) + days * 864e5;
	return etParts(new Date(t));
}
function nextWindow(from = /* @__PURE__ */ new Date()) {
	const p = etParts(from);
	let pause = etInstant(p.y, p.m, p.d, 7, 0);
	let report = etInstant(p.y, p.m, p.d, 7, 30);
	let resume = etInstant(p.y, p.m, p.d, 7, 31);
	if (from.getTime() >= resume) {
		const n = addEtDays(p.y, p.m, p.d, 1);
		pause = etInstant(n.y, n.m, n.d, 7, 0);
		report = etInstant(n.y, n.m, n.d, 7, 30);
		resume = etInstant(n.y, n.m, n.d, 7, 31);
	}
	return {
		pauseAt: new Date(pause).toISOString(),
		reportAt: new Date(report).toISOString(),
		resumeAt: new Date(resume).toISOString(),
		pauseMs: pause,
		reportMs: report,
		resumeMs: resume
	};
}
function fresh() {
	const w = nextWindow();
	return {
		status: "LIVE",
		pausedBy: null,
		pausedAt: null,
		startedAt: (/* @__PURE__ */ new Date()).toISOString(),
		cycleUntil: w.pauseAt,
		nextPauseAt: w.pauseAt,
		nextReportAt: w.reportAt,
		lastReportAt: null,
		lastReportId: null,
		practiceKilled: true,
		checkpoint: 113,
		lastSyncedAt: (/* @__PURE__ */ new Date()).toISOString(),
		conflict: null
	};
}
var mem = null;
function rebaseBaseline(s, why) {
	s.checkpoint = 68;
	s.status = "LIVE";
	s.pausedBy = null;
	s.pausedAt = null;
	s.practiceKilled = true;
	s.conflict = why;
	s.lastSyncedAt = (/* @__PURE__ */ new Date()).toISOString();
	return s;
}
function syncCheckpoint(s) {
	const systemN = 113;
	const stored = Number(s.checkpoint);
	if (!Number.isFinite(systemN) || !Number.isFinite(stored) || stored < 68) return rebaseBaseline(s, "desync-rebased-to-baseline");
	if (stored !== systemN) {
		s.checkpoint = systemN;
		s.lastSyncedAt = (/* @__PURE__ */ new Date()).toISOString();
		s.conflict = null;
		s.status = "LIVE";
		s.pausedBy = null;
		s.pausedAt = null;
		s.practiceKilled = true;
		return s;
	}
	s.checkpoint = systemN;
	s.conflict = null;
	return s;
}
function load() {
	if (mem) {
		mem = syncCheckpoint(mem);
		return mem;
	}
	for (const p of PATHS) try {
		const j = JSON.parse(readFileSync(p, "utf8"));
		if (j && (j.status === "LIVE" || j.status === "PAUSED")) {
			mem = syncCheckpoint({
				...fresh(),
				...j,
				practiceKilled: true
			});
			return mem;
		}
	} catch {}
	mem = fresh();
	return mem;
}
function save(s) {
	mem = s;
	const body = JSON.stringify(s, null, 2);
	for (const p of PATHS) try {
		if (p.includes("/data/")) mkdirSync("/workspace/data", { recursive: true });
		writeFileSync(p, body);
	} catch {}
}
function killStrayPractice() {
	try {
		const dir = PRACTICE_KILL.includes("/data/") ? "/workspace/data" : "/tmp";
		mkdirSync(dir, { recursive: true });
		writeFileSync(PRACTICE_KILL, JSON.stringify({
			killed: true,
			at: (/* @__PURE__ */ new Date()).toISOString(),
			note: "Old AUTO 24h practice and extra paper ticks stay off. Admin simulation is the only live-data test cycle."
		}, null, 2));
	} catch {}
	writePulse({
		at: (/* @__PURE__ */ new Date()).toISOString(),
		paused: true,
		day: 0,
		bot7: {
			fills: 0,
			ticks: 0,
			cash: 0,
			btc: 0,
			last: "killed"
		},
		gm: {
			fills: 0,
			ticks: 0,
			cash: 0,
			btc: 0,
			last: "killed"
		}
	});
}
function syncPulls(live) {
	setTapeFrozen(!live);
}
function healLiveSim() {
	killStrayPractice();
	const s = load();
	const frozen = isTapeFrozen();
	if (s.status === "LIVE" && frozen) syncPulls(true);
	else if (s.status === "PAUSED" && !frozen) syncPulls(false);
	return liveSimPublic();
}
function liveSimPublic() {
	const s = load();
	const w = nextWindow();
	const synced = s.checkpoint === 113 && s.conflict === null;
	return {
		name: LIVE_SIM_NAME,
		seo: LIVE_SIM_SEO,
		status: s.status,
		checkpoint: s.checkpoint,
		baseline: 68,
		label: checkpointLabel(s.checkpoint),
		synced,
		conflict: s.conflict,
		pauseAllowed: true,
		asLiveUntilGoLive: true,
		trade: false,
		ordersCreate: false,
		keysOnThisHost: false,
		pauseEt: "07:00",
		reportEt: "07:30",
		tz: LIVE_SIM_TZ,
		until: GO_LIVE_DEADLINE,
		nextPauseAt: s.nextPauseAt ?? w.pauseAt,
		nextReportAt: s.nextReportAt ?? w.reportAt,
		cycleUntil: s.cycleUntil ?? w.pauseAt,
		pausedBy: s.pausedBy,
		pausedAt: s.pausedAt,
		lastReportAt: s.lastReportAt,
		lastReportId: s.lastReportId,
		lastSyncedAt: s.lastSyncedAt,
		practiceKilled: true,
		dataPullsFollowSim: true,
		copyAdminMayPause: true,
		championshipPauseSystemOnly: false,
		note: liveSimNote(s.status, s.checkpoint)
	};
}
function testLiveSimCheckpoint() {
	killStrayPractice();
	const pub = liveSimPublic();
	const notes = [];
	if (pub.checkpoint !== 113) notes.push("checkpoint desync");
	if (pub.checkpoint < 68) notes.push("below baseline");
	if (pub.trade !== false) notes.push("trade must stay false");
	if (pub.ordersCreate !== false) notes.push("ordersCreate must stay false");
	if (!pub.pauseAllowed) notes.push("pause must stay allowed");
	if (!pub.copyAdminMayPause) notes.push("copy-admin pause missing");
	if (!pub.practiceKilled) notes.push("stray practice still armed");
	if (pub.conflict) notes.push(`conflict ${pub.conflict} — rebased to baseline 68 LIVE`);
	if (pub.synced) notes.push(`${pub.label} synced · simulation ${pub.status} · pause allowed`);
	return {
		ok: notes.every((n) => !/desync|must stay|missing|still armed|below/.test(n)),
		checkpoint: pub.checkpoint,
		baseline: pub.baseline,
		synced: pub.synced,
		status: pub.status,
		pauseAllowed: true,
		trade: false,
		notes
	};
}
function setLiveSimStatus(status, by) {
	const s = load();
	const w = nextWindow();
	s.status = status === "PAUSED" ? "PAUSED" : "LIVE";
	s.pausedBy = s.status === "PAUSED" ? by : null;
	s.pausedAt = s.status === "PAUSED" ? (/* @__PURE__ */ new Date()).toISOString() : null;
	s.nextPauseAt = w.pauseAt;
	s.nextReportAt = w.reportAt;
	s.cycleUntil = w.pauseAt;
	s.practiceKilled = true;
	save(s);
	syncPulls(s.status === "LIVE");
	stampGoLiveNotice(s.status === "LIVE" ? "SIM_LIVE" : "SIM_PAUSED", s.status === "LIVE" ? "G M0D3 AUTO · AI agents simulation LIVE" : "G M0D3 AUTO · AI agents simulation PAUSED", liveSimNote(s.status, s.checkpoint));
	return liveSimPublic();
}
async function captureMorning() {
	const s = load();
	const p = etParts();
	const id = `${p.y}-${pad(p.m)}-${pad(p.d)}`;
	if (s.lastReportId === id) return;
	try {
		const { getMorningLib } = await import("./morning-lib.server-8ELMhzrr.mjs");
		await getMorningLib();
	} catch {}
	try {
		const { alignmentScore } = await import("./alignment-DjFyA72-.mjs").then((n) => n.n).then((n) => n.n);
		const test = testLiveSimCheckpoint();
		const brief = {
			at: (/* @__PURE__ */ new Date()).toISOString(),
			id,
			alignment: alignmentScore(),
			sim: liveSimPublic(),
			test
		};
		mkdirSync("/workspace/data/morning-lib", { recursive: true });
		writeFileSync(`/workspace/data/morning-lib/${id}-ops.json`, JSON.stringify(brief, null, 2));
	} catch {}
	s.lastReportAt = (/* @__PURE__ */ new Date()).toISOString();
	s.lastReportId = id;
	save(s);
}
async function tickLiveSimSchedule() {
	killStrayPractice();
	healLiveSim();
	const s = load();
	const now = Date.now();
	const p = etParts();
	const pauseMs = etInstant(p.y, p.m, p.d, 7, 0);
	const reportMs = etInstant(p.y, p.m, p.d, 7, 30);
	const resumeMs = etInstant(p.y, p.m, p.d, 7, 31);
	const w = nextWindow();
	s.nextPauseAt = w.pauseAt;
	s.nextReportAt = w.reportAt;
	s.cycleUntil = w.pauseAt;
	s.practiceKilled = true;
	if (now >= pauseMs && now < resumeMs) {
		if (s.status === "LIVE" && s.pausedBy !== "system" && s.pausedBy !== "app-admin") {
			s.status = "PAUSED";
			s.pausedBy = "scheduler";
			s.pausedAt = (/* @__PURE__ */ new Date()).toISOString();
			save(s);
			syncPulls(false);
			stampGoLiveNotice("SIM_PAUSED", "07:00 ET pause — morning report window", liveSimNote("PAUSED", s.checkpoint));
		} else save(s);
		if (now >= reportMs) await captureMorning();
	} else if (s.status === "PAUSED" && s.pausedBy === "scheduler") {
		s.status = "LIVE";
		s.pausedBy = null;
		s.pausedAt = null;
		save(s);
		syncPulls(true);
		stampGoLiveNotice("SIM_LIVE", "Simulation resumed — next 24h as-live cycle", liveSimNote("LIVE", s.checkpoint));
	} else {
		save(s);
		if (s.status === "LIVE") syncPulls(true);
	}
}
var timer = null;
function ensureLiveSimScheduler() {
	if (process.env.NODE_TEST_CONTEXT) return;
	killStrayPractice();
	const s = load();
	if (!existsSync(PATHS[0]) && !s.startedAt) save(fresh());
	if (s.status === "LIVE") healLiveSim();
	if (timer) return;
	timer = setInterval(() => {
		tickLiveSimSchedule();
	}, 15e3);
	tickLiveSimSchedule();
}
//#endregion
export { ensureLiveSimScheduler, liveSimPublic, setLiveSimStatus };
