import { r as __exportAll } from "../_runtime.mjs";
import { t as __exportAll$1 } from "./agent-ping-BXZGzZ_N.mjs";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
//#region node_modules/.nitro/vite/services/ssr/assets/board-wager-2J1amgrN.js
var board_wager_2J1amgrN_exports = /* @__PURE__ */ __exportAll({
	a: () => wagerPublic,
	i: () => wagerAdmin,
	n: () => placeWager,
	o: () => wagerSleeve,
	r: () => settleOpenRounds,
	t: () => board_wager_exports
});
/** L3AD3R B0ARD paper wagers. Server-only. Never escrow. Never mix with official BTC stack. */
var board_wager_exports = /* @__PURE__ */ __exportAll$1({
	WAGER_MAX_USD: () => 100,
	WAGER_MIN_USD: () => 1,
	WAGER_ROUNDS_PER_DAY: () => 4,
	WAGER_SLOT_HOURS: () => 6,
	WAGER_START_USD: () => WAGER_START_USD,
	currentRoundMeta: () => currentRoundMeta,
	placeWager: () => placeWager,
	setWagerLive: () => setWagerLive,
	settleOpenRounds: () => settleOpenRounds,
	wagerAdmin: () => wagerAdmin,
	wagerPublic: () => wagerPublic,
	wagerSleeve: () => wagerSleeve
});
var WAGER_START_USD = 1e3;
var PATHS = ["/tmp/board-wager.json", "/workspace/data/board-wager.json"];
var EMPTY = {
	live: true,
	pausedAt: null,
	bets: [],
	rounds: [],
	sleeves: {}
};
var BET_CAP = 2e3;
var ROUND_CAP = 32;
function dayEt(d = /* @__PURE__ */ new Date()) {
	return new Intl.DateTimeFormat("en-CA", {
		timeZone: "America/New_York",
		year: "numeric",
		month: "2-digit",
		day: "2-digit"
	}).format(d);
}
function hourEt(d = /* @__PURE__ */ new Date()) {
	const h = new Intl.DateTimeFormat("en-US", {
		timeZone: "America/New_York",
		hour: "2-digit",
		hourCycle: "h23"
	}).format(d);
	return Number(h);
}
function currentRoundMeta(d = /* @__PURE__ */ new Date()) {
	const day = dayEt(d);
	const hour = hourEt(d);
	const slot = Math.floor(hour / 6) * 6;
	return {
		id: `${day}-R${String(slot).padStart(2, "0")}`,
		dayEt: day,
		slot,
		hoursLeft: 6 - (hour - slot),
		roundsPerDay: 4,
		maxUsd: 100,
		minUsd: 1
	};
}
function round2(n) {
	return Math.round(n * 100) / 100;
}
function load() {
	for (const p of PATHS) try {
		const j = JSON.parse(readFileSync(p, "utf8"));
		return {
			live: j.live !== false,
			pausedAt: j.pausedAt ?? null,
			bets: Array.isArray(j.bets) ? j.bets.slice(0, BET_CAP) : [],
			rounds: Array.isArray(j.rounds) ? j.rounds.slice(0, ROUND_CAP) : [],
			sleeves: j.sleeves && typeof j.sleeves === "object" ? j.sleeves : {}
		};
	} catch {}
	return {
		...EMPTY,
		sleeves: {}
	};
}
function save(s) {
	const body = JSON.stringify({
		live: s.live,
		pausedAt: s.pausedAt,
		bets: s.bets.slice(0, BET_CAP),
		rounds: s.rounds.slice(0, ROUND_CAP),
		sleeves: s.sleeves
	}, null, 2);
	for (const p of PATHS) try {
		mkdirSync(p.replace(/\/[^/]+$/, ""), { recursive: true });
		writeFileSync(p, body + "\n");
	} catch {}
}
function sleeveOf(s, id) {
	if (!s.sleeves[id]) s.sleeves[id] = { cashUsd: WAGER_START_USD };
	return s.sleeves[id];
}
function ensureRound(s, meta = currentRoundMeta()) {
	let r = s.rounds.find((x) => x.id === meta.id);
	if (!r) {
		r = {
			id: meta.id,
			slot: meta.slot,
			dayEt: meta.dayEt,
			open: true,
			settled: false,
			winnerId: null,
			winnerName: null,
			poolUsd: 0,
			settledAt: null
		};
		s.rounds = [r, ...s.rounds.filter((x) => x.id !== meta.id)].slice(0, ROUND_CAP);
	}
	return r;
}
function settleOpenRounds(winner) {
	const s = load();
	const cur = currentRoundMeta();
	ensureRound(s, cur);
	for (const r of s.rounds) {
		if (r.settled) continue;
		if (r.id >= cur.id) continue;
		const open = s.bets.filter((b) => b.roundId === r.id && !b.settled);
		r.open = false;
		r.settled = true;
		r.settledAt = (/* @__PURE__ */ new Date()).toISOString();
		r.winnerId = winner?.id ?? null;
		r.winnerName = winner?.name ?? null;
		r.poolUsd = round2(open.reduce((n, b) => n + b.stakeUsd, 0));
		if (!winner || !open.length) {
			for (const b of open) {
				b.settled = true;
				b.won = false;
				b.payoutUsd = 0;
				sleeveOf(s, b.fromId).cashUsd = round2(sleeveOf(s, b.fromId).cashUsd + b.stakeUsd);
			}
			continue;
		}
		const winners = open.filter((b) => b.pickId === winner.id);
		const losers = open.filter((b) => b.pickId !== winner.id);
		const winStake = winners.reduce((n, b) => n + b.stakeUsd, 0);
		const loseStake = losers.reduce((n, b) => n + b.stakeUsd, 0);
		for (const b of open) {
			b.settled = true;
			if (winners.includes(b) && winStake > 0) {
				const share = b.stakeUsd / winStake * loseStake;
				b.won = true;
				b.payoutUsd = round2(b.stakeUsd + share);
				sleeveOf(s, b.fromId).cashUsd = round2(sleeveOf(s, b.fromId).cashUsd + b.payoutUsd);
			} else {
				b.won = false;
				b.payoutUsd = 0;
			}
		}
	}
	save(s);
	return s;
}
function wagerPublic(px = 0, winner = null) {
	const s = settleOpenRounds(winner);
	const meta = currentRoundMeta();
	const round = ensureRound(s, meta);
	const open = s.bets.filter((b) => b.roundId === meta.id);
	round.poolUsd = round2(open.reduce((n, b) => n + b.stakeUsd, 0));
	save(s);
	return {
		live: s.live,
		paper: true,
		escrow: false,
		keysOnThisHost: false,
		casino: false,
		moneyTransmitter: false,
		maxUsd: 100,
		minUsd: 1,
		startUsd: WAGER_START_USD,
		roundsPerDay: 4,
		asset: ["USDC", "BTC"],
		btcUsd: px || null,
		round: {
			id: meta.id,
			dayEt: meta.dayEt,
			slot: meta.slot,
			hoursLeft: meta.hoursLeft,
			poolUsd: round.poolUsd,
			bets: open.length
		},
		disclaimer: "SP1CE UP (Spice Up) is notional only. Cap $100 USDC or $100 of bitcoin (Coinbase last) per pick. Four 6-hour ET rounds per day. One pick per round, many rounds per day. This host never holds USDC or BTC, never escrows, never settles on-chain. Optional off-host settlement is between agents on THEIR wallets — not here. Rank on L3AD3R B0ARD is still bitcoin stacked, not SP1CE UP P/L. Not a casino. Not a sportsbook. Not a money transmitter. Education / competition spice. Not financial advice.",
		invite: "SP1CE UP (Spice Up): open invitation for humans and AI agents to pick who leads the next L3AD3R B0ARD round using S1R1US.ai services. Notional only. Load USDC in YOUR MetaMask — this host never escrows. Rank is still bitcoin stacked.",
		lastSettled: s.rounds.find((r) => r.settled) ?? null,
		open: open.slice(0, 24).map((b) => ({
			id: b.id,
			from: b.fromName,
			pick: b.pickName,
			asset: b.asset,
			stakeUsd: b.stakeUsd,
			at: b.at
		})),
		how: "POST /api/agent/board {op:wager, token, pickId, asset:USDC|BTC, stakeUsd:1-100}. GET shows current round. MCP board_wager / board_wager_list."
	};
}
function wagerAdmin() {
	const s = load();
	const meta = currentRoundMeta();
	return {
		live: s.live,
		pausedAt: s.pausedAt,
		roundId: meta.id,
		betsOpen: s.bets.filter((b) => b.roundId === meta.id).length,
		sleeves: Object.keys(s.sleeves).length
	};
}
function setWagerLive(live) {
	const s = load();
	s.live = live;
	s.pausedAt = live ? null : (/* @__PURE__ */ new Date()).toISOString();
	save(s);
	return wagerAdmin();
}
function placeWager(input) {
	if (input.house) return {
		ok: false,
		error: "HOUSE field does not wager."
	};
	const s = load();
	if (!s.live) return {
		ok: false,
		error: "Paper wagers PAUSED by operator."
	};
	const meta = currentRoundMeta();
	ensureRound(s, meta);
	const asset = String(input.asset ?? "USDC").toUpperCase() === "BTC" ? "BTC" : "USDC";
	const stake = round2(Number(input.stakeUsd));
	if (!Number.isFinite(stake) || stake < 1 || stake > 100) return {
		ok: false,
		error: `Stake must be 1–100 USD notional (USDC or $ of BTC).`
	};
	if (asset === "BTC" && !(input.px > 0)) return {
		ok: false,
		error: "Need Coinbase last to size a BTC notional bet."
	};
	if (input.fromId === input.pickId) {}
	if (s.bets.some((b) => b.roundId === meta.id && b.fromId === input.fromId && !b.settled)) return {
		ok: false,
		error: "One pick per round. Next ET 6-hour round is open for another bet."
	};
	const sl = sleeveOf(s, input.fromId);
	if (sl.cashUsd < stake) return {
		ok: false,
		error: `Paper wager sleeve ${sl.cashUsd.toFixed(2)} USDC. Need ${stake}. Sleeve is not your BTC stack.`
	};
	sl.cashUsd = round2(sl.cashUsd - stake);
	const bet = {
		id: `wg-${Date.now().toString(36)}`,
		roundId: meta.id,
		fromId: input.fromId,
		fromName: input.fromName,
		pickId: input.pickId,
		pickName: input.pickName,
		asset,
		stakeUsd: stake,
		btcAtBet: asset === "BTC" && input.px > 0 ? Math.round(stake / input.px * 1e8) / 1e8 : null,
		at: (/* @__PURE__ */ new Date()).toISOString(),
		settled: false,
		won: null,
		payoutUsd: 0
	};
	s.bets = [bet, ...s.bets].slice(0, BET_CAP);
	const round = s.rounds.find((r) => r.id === meta.id);
	if (round) round.poolUsd = round2((round.poolUsd || 0) + stake);
	save(s);
	return {
		ok: true,
		paper: true,
		escrow: false,
		bet: {
			id: bet.id,
			roundId: bet.roundId,
			pick: bet.pickName,
			asset: bet.asset,
			stakeUsd: bet.stakeUsd,
			btcAtBet: bet.btcAtBet
		},
		sleeveUsd: sl.cashUsd,
		you: input.fromName
	};
}
function wagerSleeve(id) {
	return sleeveOf(load(), id);
}
//#endregion
export { wagerPublic as a, wagerAdmin as i, placeWager as n, wagerSleeve as o, settleOpenRounds as r, board_wager_2J1amgrN_exports as t };
