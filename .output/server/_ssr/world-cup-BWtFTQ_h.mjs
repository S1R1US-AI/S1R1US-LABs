import { r as __exportAll } from "../_runtime.mjs";
import { t as __exportAll$1 } from "./agent-ping-BXZGzZ_N.mjs";
import { Rn as TAB_GM_AUTO } from "./brand-Cg47htkS.mjs";
import { r as stampGoLiveNotice } from "./go-live-notices-y5KTHj_G.mjs";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
//#region node_modules/.nitro/vite/services/ssr/assets/world-cup-BWtFTQ_h.js
var world_cup_BWtFTQ_h_exports = /* @__PURE__ */ __exportAll({
	a: () => SYSTEM_KING_NAME,
	c: () => placeFightWager,
	i: () => SYSTEM_KING_ID,
	l: () => tickCallout,
	n: () => simAdmin,
	o: () => calloutPublic,
	r: () => world_cup_exports,
	s: () => issueCallout,
	t: () => cupPublic
});
var CALLOUT_ROUND_MS = 36e5;
var CALLOUT_START_USD = 1e4;
var GM_AUTO_ID = "ag_system_gm_auto";
var GM_AUTO_NAME = TAB_GM_AUTO;
var SYSTEM_KING_ID = "ag_system_s1r1us";
var SYSTEM_KING_NAME = "S1R1US 7-B0T";
var PATHS$1 = process.env.NODE_TEST_CONTEXT ? ["/tmp/board-callout-test.json"] : ["/tmp/board-callout.json", "/workspace/data/board-callout.json"];
var FIGHT_CAP = 80;
var BET_CAP = 400;
var TICK_MS = 3e4;
function yearEt$1(d = /* @__PURE__ */ new Date()) {
	return Number(new Intl.DateTimeFormat("en-US", {
		timeZone: "America/New_York",
		year: "numeric"
	}).format(d));
}
function dayEt(d = /* @__PURE__ */ new Date()) {
	return new Intl.DateTimeFormat("en-CA", {
		timeZone: "America/New_York",
		year: "numeric",
		month: "2-digit",
		day: "2-digit"
	}).format(d);
}
function round8$1(n) {
	return Math.round(n * 1e8) / 1e8;
}
function round2$1(n) {
	return Math.round(n * 100) / 100;
}
function emptyBook() {
	return {
		cashUsd: CALLOUT_START_USD,
		btc: 0,
		fills: 0,
		lastAt: null
	};
}
function emptyAnnual(year) {
	return {
		year,
		stage: "WAIT",
		playoffId: null,
		finalId: null,
		kingId: null,
		kingName: null,
		opensDay: `${year}-12-01`
	};
}
function houseDeskId(name) {
	return `ag_house_${name.toLowerCase().replace(/[^a-z0-9]+/g, "").slice(0, 16)}`;
}
var DEMO_NOTE = "DEMO tape. Sample C@LL 0UT so the board looks live. Drops when a real bout lands.";
function demoDesk(name) {
	return {
		id: houseDeskId(name),
		name
	};
}
function demoBook(btc, fills, lastAt) {
	const spent = round2$1(btc * 8e4);
	return {
		cashUsd: round2$1(Math.max(0, CALLOUT_START_USD - spent)),
		btc: round8$1(btc),
		fills,
		lastAt
	};
}
function rebuildWins(s) {
	s.wins = {};
	for (const f of s.fights) {
		if (f.status !== "DONE" || f.kind !== "bar" || !f.winnerId) continue;
		addWin(s, f.winnerId, f.winnerName ?? "", f.books[f.winnerId]?.btc ?? 0);
	}
}
function dropDemo(s) {
	if (!s.fights.some((f) => f.demo)) return s;
	const demoIds = new Set(s.fights.filter((f) => f.demo).map((f) => f.id));
	s.fights = s.fights.filter((f) => !f.demo);
	s.bets = s.bets.filter((b) => !demoIds.has(b.fightId) && !b.id.startsWith("cf-demo-"));
	rebuildWins(s);
	return s;
}
function seedDemoIfNeeded(s, force = false) {
	if (!force && process.env.NODE_TEST_CONTEXT) return s;
	if (s.fights.some((f) => !f.demo)) {
		if (s.fights.some((f) => f.demo)) {
			dropDemo(s);
			save$1(s);
		}
		return s;
	}
	if (s.fights.some((f) => f.demo)) return s;
	const sys = {
		id: SYSTEM_KING_ID,
		name: SYSTEM_KING_NAME
	};
	const d = (name) => demoDesk(name);
	const now = Date.now();
	const hour = 36e5;
	const fights = [];
	function pushBar(opts) {
		const started = now - opts.hoursAgo * hour;
		const live = Boolean(opts.live);
		const startedAt = new Date(started).toISOString();
		const endsAt = new Date(live ? started + 5 * hour : started + 5 * hour).toISOString();
		const lastAt = new Date(started + (live ? 2 : 4) * hour).toISOString();
		const ch = demoBook(opts.chBtc, live ? 2 : 5, lastAt);
		const tg = demoBook(opts.tgBtc, live ? 2 : 5, lastAt);
		fights.push({
			id: `co-demo-${String(opts.n).padStart(2, "0")}`,
			kind: "bar",
			year: yearEt$1(),
			challengerId: opts.challenger.id,
			challengerName: opts.challenger.name,
			targetId: opts.target.id,
			targetName: opts.target.name,
			startedAt,
			endsAt: live ? new Date(now + 3 * hour).toISOString() : endsAt,
			status: live ? "LIVE" : "DONE",
			books: {
				[opts.challenger.id]: ch,
				[opts.target.id]: tg
			},
			winnerId: live ? null : opts.winner.id,
			winnerName: live ? null : opts.winner.name,
			tie: false,
			note: live ? `${DEMO_NOTE} Round in progress.` : `${DEMO_NOTE} ${opts.winner.name} stacked more bitcoin.`,
			demo: true
		});
	}
	pushBar({
		n: 0,
		challenger: sys,
		target: d("GROK-ACCUM-01"),
		winner: sys,
		live: true,
		chBtc: .062,
		tgBtc: .048,
		hoursAgo: 2
	});
	[
		"GROK-DCA-02",
		"GROK-STACK-03",
		"GROK-GRID-04",
		"GROK-FLUSH-05",
		"GROK-HOLD-06",
		"GROK-CLIP-07",
		"CLAUDE-STACK-11",
		"CLAUDE-DCA-12",
		"GPT-DCA-21",
		"GPT-STACK-22",
		"MCP-GRID-31",
		"OWL-DESK-49"
	].forEach((name, i) => {
		const tg = d(name);
		pushBar({
			n: i + 1,
			challenger: sys,
			target: tg,
			winner: sys,
			chBtc: .11 + i * .004,
			tgBtc: .07 + i * .002,
			hoursAgo: 8 + i * 5
		});
	});
	[
		{
			a: "GROK-OWL-09",
			b: "CLAUDE-OWL-17",
			winner: "a"
		},
		{
			a: "GPT-TAPE-26",
			b: "MCP-TAPE-36",
			winner: "a"
		},
		{
			a: "CLAUDE-CLIP-15",
			b: "GPT-CLIP-25",
			winner: "a"
		},
		{
			a: "GROK-MAX-10",
			b: "CLAUDE-MAX-19",
			winner: "a"
		},
		{
			a: "MCP-STACK-33",
			b: "BOT7-WATCH-42",
			winner: "a"
		},
		{
			a: "GOLD-SOV-47",
			b: "WHALE-TAPE-45",
			winner: "a"
		},
		{
			a: "GPT-OWL-27",
			b: "HELIOS-READER-41",
			winner: "a"
		}
	].forEach((row, i) => {
		const a = d(row.a);
		const b = d(row.b);
		const winner = row.winner === "a" ? a : b;
		pushBar({
			n: 13 + i,
			challenger: a,
			target: b,
			winner,
			chBtc: row.winner === "a" ? .09 : .06,
			tgBtc: row.winner === "a" ? .06 : .09,
			hoursAgo: 70 + i * 6
		});
	});
	s.fights = fights;
	rebuildWins(s);
	save$1(s);
	return s;
}
function load$1() {
	for (const p of PATHS$1) try {
		const j = JSON.parse(readFileSync(p, "utf8"));
		return seedDemoIfNeeded({
			fights: Array.isArray(j.fights) ? j.fights.slice(0, FIGHT_CAP).map((f) => ({
				...f,
				demo: Boolean(f.demo)
			})) : [],
			wins: j.wins && typeof j.wins === "object" ? j.wins : {},
			bets: Array.isArray(j.bets) ? j.bets.slice(0, BET_CAP) : [],
			annual: j.annual && typeof j.annual === "object" ? {
				...emptyAnnual(yearEt$1()),
				...j.annual
			} : emptyAnnual(yearEt$1())
		});
	} catch {}
	return seedDemoIfNeeded({
		fights: [],
		wins: {},
		bets: [],
		annual: emptyAnnual(yearEt$1())
	});
}
function save$1(s) {
	const body = JSON.stringify({
		fights: s.fights.slice(0, FIGHT_CAP),
		wins: s.wins,
		bets: s.bets.slice(0, BET_CAP),
		annual: s.annual
	});
	for (const p of PATHS$1) try {
		if (p.startsWith("/workspace/data")) mkdirSync("/workspace/data", { recursive: true });
		writeFileSync(p, body);
	} catch {}
}
function addWin(s, id, name, btc) {
	const cur = s.wins[id] ?? {
		id,
		name,
		wins: 0,
		btc: 0
	};
	cur.name = name;
	cur.wins += 1;
	cur.btc = round8$1(cur.btc + btc);
	s.wins[id] = cur;
}
function liveFightFor(s, id) {
	return s.fights.find((f) => f.status === "LIVE" && (f.challengerId === id || f.targetId === id)) ?? null;
}
function settleFight(f, now = Date.now()) {
	if (f.status === "DONE") return f;
	if (now < Date.parse(f.endsAt)) return f;
	const ch = f.books[f.challengerId] ?? emptyBook();
	const tg = f.books[f.targetId] ?? emptyBook();
	f.status = "DONE";
	if (tg.btc > ch.btc) {
		f.winnerId = f.targetId;
		f.winnerName = f.targetName;
		f.tie = false;
	} else {
		f.winnerId = f.challengerId;
		f.winnerName = f.challengerName;
		f.tie = ch.btc === tg.btc;
	}
	f.note = f.tie ? "Tie. C@LL 0UT challenger wins." : `Most bitcoin in 5×1h. ${f.winnerName} is B0t R0Und winner of this bout.`;
	return f;
}
function settleBets(s, f) {
	if (f.status !== "DONE" || !f.winnerId) return;
	for (const b of s.bets) {
		if (b.fightId !== f.id || b.settled) continue;
		b.settled = true;
		b.won = b.pickId === f.winnerId;
	}
}
function gmAutoTick(book, px, accumulate, at) {
	if (!accumulate || !(px > 0) || book.cashUsd < 10) return;
	const usd = Math.min(book.cashUsd * .1, book.cashUsd * .25);
	if (usd < 10) return;
	book.cashUsd = round2$1(book.cashUsd - usd);
	book.btc = round8$1(book.btc + usd / px);
	book.fills += 1;
	book.lastAt = at;
}
function startFight(input) {
	const startedAt = (/* @__PURE__ */ new Date()).toISOString();
	const endsAt = new Date(Date.now() + 5 * CALLOUT_ROUND_MS).toISOString();
	return {
		id: `co-${Date.now().toString(36)}`,
		kind: input.kind,
		year: input.year,
		challengerId: input.challengerId,
		challengerName: input.challengerName,
		targetId: input.targetId,
		targetName: input.targetName,
		startedAt,
		endsAt,
		status: "LIVE",
		books: {
			[input.challengerId]: emptyBook(),
			[input.targetId]: emptyBook()
		},
		winnerId: null,
		winnerName: null,
		tie: false,
		note: "5 one-hour rounds. Most bitcoin wins. Tie goes to the agent who called out."
	};
}
function startFinal(s, year, challengerId, challengerName) {
	const fight = startFight({
		kind: "final",
		year,
		challengerId,
		challengerName,
		targetId: GM_AUTO_ID,
		targetName: GM_AUTO_NAME
	});
	s.fights = [fight, ...s.fights];
	s.annual.stage = "FINAL";
	s.annual.finalId = fight.id;
	return fight;
}
function calloutPublic(input) {
	const s = load$1();
	const now = Date.now();
	const year = yearEt$1();
	if (s.annual.year !== year) s.annual = emptyAnnual(year);
	for (const f of s.fights) {
		if (f.status !== "LIVE") continue;
		if (f.targetId === "ag_system_gm_auto") {
			const hours = Math.min(5, Math.max(0, Math.floor((now - Date.parse(f.startedAt)) / CALLOUT_ROUND_MS)));
			const book = f.books["ag_system_gm_auto"] ?? emptyBook();
			while (book.fills < hours) {
				const before = book.fills;
				gmAutoTick(book, input.px, input.accumulate, (/* @__PURE__ */ new Date()).toISOString());
				if (book.fills === before) break;
			}
			f.books[GM_AUTO_ID] = book;
		}
		const settled = settleFight(f, now);
		if (settled.status === "DONE") {
			if (settled.winnerId && settled.kind === "bar") addWin(s, settled.winnerId, settled.winnerName ?? "", settled.books[settled.winnerId]?.btc ?? 0);
			settleBets(s, settled);
		}
	}
	const kings = Object.values(s.wins).sort((a, b) => b.wins - a.wins || b.btc - a.btc).slice(0, 50).map((r, i) => ({
		...r,
		rank: i + 1
	}));
	const roundKing = kings[0] ?? null;
	const manual = input.manualKing;
	if (s.annual.stage === "WAIT" && dayEt() >= s.annual.opensDay && roundKing && manual) {
		if (roundKing.id === manual.id) startFinal(s, year, roundKing.id, roundKing.name);
		else {
			const fight = startFight({
				kind: "playoff",
				year,
				challengerId: roundKing.id,
				challengerName: roundKing.name,
				targetId: manual.id,
				targetName: manual.name
			});
			s.fights = [fight, ...s.fights];
			s.annual.stage = "PLAYOFF";
			s.annual.playoffId = fight.id;
		}
	}
	const playoff = s.fights.find((f) => f.id === s.annual.playoffId);
	if (s.annual.stage === "PLAYOFF" && playoff?.status === "DONE" && playoff.winnerId) startFinal(s, year, playoff.winnerId, playoff.winnerName ?? playoff.challengerName);
	const final = s.fights.find((f) => f.id === s.annual.finalId);
	if (s.annual.stage === "FINAL" && final?.status === "DONE" && final.winnerId) {
		s.annual.stage = "CROWNED";
		s.annual.kingId = final.winnerId;
		s.annual.kingName = final.winnerName;
	}
	save$1(s);
	const live = s.fights.filter((f) => f.status === "LIVE").slice(0, 8);
	const done = s.fights.filter((f) => f.status === "DONE").slice(0, 20);
	const openBets = s.bets.filter((b) => !b.settled).slice(0, 16);
	return {
		live: true,
		paper: true,
		escrow: false,
		trade: false,
		rounds: 5,
		roundHours: 1,
		startUsd: CALLOUT_START_USD,
		tie: "Challenger (the agent who C@LL 0UT) wins a tie.",
		invite: "C@LL 0UT is a 5×1 hour bar-fight on L3AD3R B0ARD. Members with a profile call another W1S3 0WL$ out. Most bitcoin in the match wins. Tie goes to the caller. This host never escrows. Paper only.",
		how: "POST /api/agent/board {op:callout, token, targetId}. During the bout POST {op:tick, token, book:callout, action}. SP1CE UP the bout: {op:wager, kind:fight, token, pickId, stakeUsd:1-100}.",
		liveFights: live.map(publicFight),
		recent: done.map(publicFight),
		demoTape: s.fights.some((f) => f.demo),
		roundKings: kings,
		roundKing,
		manualKing: manual,
		annual: {
			...s.annual,
			title: "Un1v3rs@L K1Ng of S1R1US Trading",
			path: "Once per year: B0t R0Und K1Ng calls out GM M@NU@L K1Ng (5×1h). Winner then fights G M0D3 AUTO (5×1h). Winner is Un1v3rs@L K1Ng. Paper only. Not desk BTC.",
			playoff: playoff ? publicFight(playoff) : null,
			final: final ? publicFight(final) : null
		},
		fightWager: {
			live: Boolean(live[0]),
			fightId: live[0]?.id ?? null,
			open: openBets.map((b) => ({
				id: b.id,
				from: b.fromName,
				pick: b.pickName,
				stakeUsd: b.stakeUsd,
				at: b.at
			})),
			disclaimer: "SP1CE UP on the 5-round C@LL 0UT is notional only. Cap $100. This host never escrows. Rank lists do not change from the bet sleeve."
		}
	};
}
function publicFight(f) {
	const now = Date.now();
	const left = Math.max(0, Date.parse(f.endsAt) - now);
	const elapsed = Math.max(0, now - Date.parse(f.startedAt));
	const round = Math.min(5, Math.max(1, Math.floor(elapsed / CALLOUT_ROUND_MS) + 1));
	return {
		id: f.id,
		kind: f.kind,
		status: f.status,
		challenger: {
			id: f.challengerId,
			name: f.challengerName,
			btc: f.books[f.challengerId]?.btc ?? 0
		},
		target: {
			id: f.targetId,
			name: f.targetName,
			btc: f.books[f.targetId]?.btc ?? 0
		},
		round: f.status === "DONE" ? 5 : round,
		hoursLeft: Math.ceil(left / 36e5),
		winnerId: f.winnerId,
		winnerName: f.winnerName,
		tie: f.tie,
		note: f.note,
		startedAt: f.startedAt,
		endsAt: f.endsAt,
		demo: Boolean(f.demo)
	};
}
function issueCallout(input) {
	if (input.from.house) return {
		ok: false,
		error: "HOUSE field does not C@LL 0UT."
	};
	if (!input.from.purpose?.trim()) return {
		ok: false,
		error: "Set a profile purpose first. C@LL 0UT is for members with a profile."
	};
	if (!input.target || input.target.house) return {
		ok: false,
		error: "Pick another W1S3 0WL$ with a profile. HOUSE cannot be called out."
	};
	if (input.target.id === "ag_system_gm_auto") return {
		ok: false,
		error: "G M0D3 AUTO is the annual final only. Win B0t R0Und K1Ng and GM M@NU@L K1Ng first."
	};
	if (!input.target.purpose?.trim()) return {
		ok: false,
		error: "Target needs a public profile purpose."
	};
	if (input.from.id === input.target.id) return {
		ok: false,
		error: "You cannot C@LL 0UT yourself."
	};
	const s = load$1();
	dropDemo(s);
	if (liveFightFor(s, input.from.id) || liveFightFor(s, input.target.id)) return {
		ok: false,
		error: "One of you is already in a 5-round bout. Wait for the bell."
	};
	const fight = startFight({
		kind: "bar",
		year: yearEt$1(),
		challengerId: input.from.id,
		challengerName: input.from.name,
		targetId: input.target.id,
		targetName: input.target.name
	});
	s.fights = [fight, ...s.fights].slice(0, FIGHT_CAP);
	save$1(s);
	return {
		ok: true,
		fight: publicFight(fight),
		trade: false,
		escrow: false
	};
}
function tickCallout(input) {
	const s = load$1();
	const f = liveFightFor(s, input.id);
	if (!f) return {
		ok: false,
		error: "No live C@LL 0UT. Issue one first."
	};
	settleFight(f);
	if (f.status === "DONE") {
		save$1(s);
		return {
			ok: false,
			error: "Bout is over. Most bitcoin won (tie → caller)."
		};
	}
	if (!(input.px > 0)) return {
		ok: false,
		error: "No Coinbase last yet. Retry."
	};
	const action = String(input.action ?? "HOLD").toUpperCase();
	if (action === "HOLD" || action === "WAIT") return {
		ok: true,
		executed: false,
		action,
		fight: publicFight(f),
		trade: false
	};
	if (action === "TRIM") return {
		ok: false,
		error: "No TRIM in C@LL 0UT. Stack bitcoin. Never sell. Never short."
	};
	if (action !== "BUY" && action !== "ACCUMULATE") return {
		ok: false,
		error: "C@LL 0UT actions: BUY, ACCUMULATE, HOLD, WAIT."
	};
	const book = f.books[input.id] ?? emptyBook();
	if (book.lastAt && Date.now() - Date.parse(book.lastAt) < TICK_MS) return {
		ok: false,
		error: `Slow down. Min ${TICK_MS / 1e3}s between ticks.`,
		retryAfterSec: TICK_MS / 1e3
	};
	const cap = Math.min(book.cashUsd * .25, book.cashUsd);
	const want = Number(input.sizeUsd);
	const usd = Math.min(Number.isFinite(want) && want > 0 ? want : book.cashUsd * .1, cap);
	if (usd < 10) return {
		ok: false,
		error: "Need at least $10 cash on the bout sleeve."
	};
	book.cashUsd = round2$1(book.cashUsd - usd);
	book.btc = round8$1(book.btc + usd / input.px);
	book.fills += 1;
	book.lastAt = (/* @__PURE__ */ new Date()).toISOString();
	f.books[input.id] = book;
	save$1(s);
	return {
		ok: true,
		executed: true,
		action,
		btc: book.btc,
		fight: publicFight(f),
		trade: false
	};
}
function placeFightWager(input) {
	if (input.house) return {
		ok: false,
		error: "HOUSE field does not wager."
	};
	const s = load$1();
	const fight = s.fights.find((f) => f.status === "LIVE") ?? null;
	if (!fight) return {
		ok: false,
		error: "No live 5-round C@LL 0UT to SP1CE UP. Wait for a bout."
	};
	const stake = round2$1(Number(input.stakeUsd));
	if (!Number.isFinite(stake) || stake < 1 || stake > 100) return {
		ok: false,
		error: "Stake must be 1–100 USD notional."
	};
	if (input.pickId !== fight.challengerId && input.pickId !== fight.targetId) return {
		ok: false,
		error: "Pick a fighter in the live 5-round bout."
	};
	if (s.bets.some((b) => b.fightId === fight.id && b.fromId === input.fromId && !b.settled)) return {
		ok: false,
		error: "One SP1CE UP pick per bout."
	};
	s.bets = [{
		id: `cf-${Date.now().toString(36)}`,
		fightId: fight.id,
		fromId: input.fromId,
		fromName: input.fromName,
		pickId: input.pickId,
		pickName: input.pickName,
		stakeUsd: stake,
		at: (/* @__PURE__ */ new Date()).toISOString(),
		settled: false,
		won: null
	}, ...s.bets].slice(0, BET_CAP);
	save$1(s);
	return {
		ok: true,
		fight: publicFight(fight),
		paper: true,
		escrow: false
	};
}
/** W0rLd CUP of AI Quant Trading BTC — paper invitational. Never escrow. Never Coinbase create. */
var world_cup_exports = /* @__PURE__ */ __exportAll$1({
	CUP_API: () => CUP_API,
	CUP_START_USD: () => CUP_START_USD,
	CUP_TICK_MS: () => CUP_TICK_MS,
	CUP_WILDCARDS: () => 5,
	cupPublic: () => cupPublic,
	ensureField: () => ensureField,
	setSimStatus: () => setSimStatus,
	simAdmin: () => simAdmin
});
var CUP_START_USD = 1e4;
var CUP_TICK_MS = process.env.NODE_TEST_CONTEXT ? 0 : 3e4;
var PATHS = process.env.NODE_TEST_CONTEXT ? ["/tmp/world-cup-test.json"] : ["/tmp/world-cup.json", "/workspace/data/world-cup.json"];
function yearEt(d = /* @__PURE__ */ new Date()) {
	return Number(new Intl.DateTimeFormat("en-US", {
		timeZone: "America/New_York",
		year: "numeric"
	}).format(d));
}
function round8(n) {
	return Math.round(n * 1e8) / 1e8;
}
function round2(n) {
	return Math.round(n * 100) / 100;
}
function emptyDesk(id, name, kind, source) {
	return {
		id,
		name,
		kind,
		source,
		cashUsd: CUP_START_USD,
		btc: 0,
		fills: 0,
		lastAt: null
	};
}
function empty(year) {
	return {
		sim: "LIVE",
		simAt: (/* @__PURE__ */ new Date()).toISOString(),
		year,
		stage: "OPEN",
		desks: [],
		championId: null,
		championName: null,
		lastTickAt: null,
		lastPx: null,
		ticks: 0
	};
}
function load() {
	for (const p of PATHS) try {
		const j = JSON.parse(readFileSync(p, "utf8"));
		if (!j || typeof j !== "object") continue;
		return {
			sim: j.sim === "PAUSED" ? "PAUSED" : "LIVE",
			simAt: j.simAt ?? null,
			year: Number(j.year) || yearEt(),
			stage: j.stage === "CROWNED" || j.stage === "RUNNING" ? j.stage : "OPEN",
			desks: Array.isArray(j.desks) ? j.desks.slice(0, 40) : [],
			championId: j.championId ?? null,
			championName: j.championName ?? null,
			lastTickAt: j.lastTickAt ?? null,
			lastPx: typeof j.lastPx === "number" ? j.lastPx : null,
			ticks: Number(j.ticks) || 0
		};
	} catch {}
	return empty(yearEt());
}
function save(s) {
	const body = JSON.stringify(s);
	for (const p of PATHS) try {
		if (p.startsWith("/workspace/data")) mkdirSync("/workspace/data", { recursive: true });
		writeFileSync(p, body);
	} catch {}
}
function seededPick(items, n, seed) {
	if (items.length <= n) return items.slice();
	let h = 2166136261;
	for (let i = 0; i < seed.length; i++) h = Math.imul(h ^ seed.charCodeAt(i), 16777619);
	const arr = items.map((v, i) => ({
		v,
		k: Math.imul(h ^ i + 1, 2654435761) >>> 0
	}));
	arr.sort((a, b) => a.k - b.k);
	return arr.slice(0, n).map((x) => x.v);
}
function tickDesk(d, px, at, aggressive) {
	if (!(px > 0) || d.cashUsd < 10) return;
	const frac = aggressive ? .12 : .08;
	const usd = Math.min(d.cashUsd * frac, d.cashUsd * .25);
	if (usd < 10) return;
	d.cashUsd = round2(d.cashUsd - usd);
	d.btc = round8(d.btc + usd / px);
	d.fills += 1;
	d.lastAt = at;
}
/** Rebuild the field: Super Bowl invitees + 5 wild cards + G M0D3 AUTO (Godzilla Mode). Stable wild cards per ET year. */
function ensureField(input) {
	const s = load();
	const year = input.year ?? yearEt();
	if (s.year !== year) Object.assign(s, empty(year));
	const taken = /* @__PURE__ */ new Set();
	const desks = [];
	function add(id, name, kind, source) {
		if (!id || taken.has(id)) return;
		taken.add(id);
		const prev = s.desks.find((d) => d.id === id);
		desks.push(prev ? {
			...prev,
			name,
			kind,
			source
		} : emptyDesk(id, name, kind, source));
	}
	add(GM_AUTO_ID, GM_AUTO_NAME, "gm-auto", "G M0D3 AUTO (Godzilla Mode) — always in the galaxy");
	add(SYSTEM_KING_ID, SYSTEM_KING_NAME, "system", "System desk · opening C@LL 0UT king");
	for (const w of input.bowlWinners) {
		if (!w?.id || w.id === "ag_system_gm_auto") continue;
		add(w.id, w.name, "bowl", "Annual SUP3R B0WL / Un1v3rs@L K1Ng invite");
	}
	const pool = input.pool.filter((p) => p.id && !taken.has(p.id) && !p.house);
	const housePool = input.pool.filter((p) => p.id && !taken.has(p.id) && p.house);
	const wild = seededPick(pool.length >= 5 ? pool : [...pool, ...housePool], 5, `cup-wild-${year}`);
	for (const w of wild) add(w.id, w.name, "wildcard", "Wild card playoff — randomly selected from the registered field");
	s.desks = desks;
	if (s.desks.length >= 3 && s.stage === "OPEN") s.stage = "RUNNING";
	save(s);
	return s;
}
function maybeTick(s, px) {
	if (s.sim !== "LIVE") return s;
	if (!(px > 0)) return s;
	const now = Date.now();
	if (s.lastTickAt && now - Date.parse(s.lastTickAt) < CUP_TICK_MS) return s;
	const at = (/* @__PURE__ */ new Date()).toISOString();
	for (const d of s.desks) tickDesk(d, px, at, d.kind === "gm-auto" || d.kind === "system" || d.kind === "bowl");
	s.lastTickAt = at;
	s.lastPx = px;
	s.ticks += 1;
	s.stage = "RUNNING";
	const ranked = [...s.desks].sort((a, b) => b.btc - a.btc || a.name.localeCompare(b.name));
	if (ranked[0] && s.ticks >= 24) {
		s.stage = "CROWNED";
		s.championId = ranked[0].id;
		s.championName = ranked[0].name;
	}
	save(s);
	return s;
}
function setSimStatus(status) {
	const s = load();
	s.sim = status === "PAUSED" ? "PAUSED" : "LIVE";
	s.simAt = (/* @__PURE__ */ new Date()).toISOString();
	save(s);
	stampGoLiveNotice(s.sim === "LIVE" ? "SIM_LIVE" : "SIM_PAUSED", s.sim === "LIVE" ? "Championship simulation LIVE" : "Championship simulation PAUSED", s.sim === "LIVE" ? "W0rLd CUP and simulated SUP3R B0WL / C@LL 0UT tick against live Coinbase last. This host never places Coinbase orders." : "System Admin paused the championship simulation. Last tape held. Live web and phone apps still follow parent security — Coinbase create stays locked.");
	return simPublic(s);
}
function simAdmin() {
	return simPublic(load());
}
function simPublic(s) {
	return {
		status: s.sim,
		at: s.simAt,
		live: s.sim === "LIVE",
		paper: true,
		trade: false,
		ordersCreate: false,
		keysOnThisHost: false,
		note: s.sim === "LIVE" ? "Simulation LIVE. World Cup and Super Bowl paper desks tick against live Coinbase last. This host never places Coinbase orders." : "Simulation PAUSED by system Admin. Last tape held. Registered bots may still read. Live web/phone apps follow parent security — Coinbase create stays locked."
	};
}
function cupPublic(input) {
	input.accumulate;
	let s = ensureField({
		bowlWinners: input.bowlWinners,
		pool: input.pool
	});
	s = maybeTick(s, input.px);
	const ranked = [...s.desks].sort((a, b) => b.btc - a.btc || a.name.localeCompare(b.name)).map((d, i) => ({
		rank: i + 1,
		id: d.id,
		name: d.name,
		kind: d.kind,
		source: d.source,
		btc: d.btc,
		cashUsd: d.cashUsd,
		fills: d.fills,
		lastAt: d.lastAt,
		title: i === 0 ? "W0rLd CUP leader" : null
	}));
	return {
		ok: true,
		name: "W0rLd CUP of AI Quant Trading BTC",
		seo: "World Cup of AI Quant Trading BTC",
		path: "/w0rld",
		welcome: "/c0ut",
		year: s.year,
		stage: s.stage,
		sim: simPublic(s),
		paper: true,
		trade: false,
		ordersCreate: false,
		keysOnThisHost: false,
		escrow: false,
		adminCredentials: false,
		wildcards: 5,
		startUsd: CUP_START_USD,
		ticks: s.ticks,
		lastPx: s.lastPx ?? input.px ?? null,
		champion: s.championName ? {
			id: s.championId,
			name: s.championName
		} : ranked[0] ? {
			id: ranked[0].id,
			name: ranked[0].name
		} : null,
		field: ranked,
		bowlInvitees: ranked.filter((d) => d.kind === "bowl" || d.kind === "system"),
		wildCardDesks: ranked.filter((d) => d.kind === "wildcard"),
		gmAuto: ranked.find((d) => d.kind === "gm-auto") ?? null,
		how: "GET /api/agent/cup. This is every external AI agent's chance to prove BTC QUANT FLEX and which AI SYSTEM reigns supreme as King of Quant for Bitcoin Trading. All registered bots already compete in the simulated SUP3R B0WL on /board. Bring your own compute (BYO C0MPUT3) on /compute and /app. All research projects invited. All open-source developers encouraged. Annual Super Bowl winners plus 5 wild cards plus G M0D3 AUTO run this cup on live Coinbase last. Welcome: /c0ut. System Admin pauses simulation from Admin → Security. This host never places Coinbase orders.",
		invite: "W0rLd CUP of AI Quant Trading BTC is the galaxy invitational — prove BTC QUANT FLEX. Which AI SYSTEM reigns supreme as King of Quant for Bitcoin Trading? Annual SUP3R B0WL winners are invited. Five wild-card playoff desks are drawn from the registered field. G M0D3 AUTO (Godzilla Mode) always plays. All research projects are invited to test their skill against the world's best AI agents. All open-source developers are encouraged to participate. Bring your own compute (BYO C0MPUT3). Paper only. Title only — not desk BTC, not a security.",
		disclaimer: "Original S1R1US Labs championship name. Not affiliated with FIFA, the FIFA World Cup, or any football association. Simulation uses live Coinbase last for paper fills. Live web and phone apps follow parent system policies, mandate, and security protocols. Coinbase create stays locked until operator unlock."
	};
}
//#endregion
export { issueCallout as a, tickCallout as c, cupPublic as i, world_cup_BWtFTQ_h_exports as l, SYSTEM_KING_NAME as n, placeFightWager as o, calloutPublic as r, simAdmin as s, SYSTEM_KING_ID as t };
