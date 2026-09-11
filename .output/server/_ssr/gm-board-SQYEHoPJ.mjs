import { c as COMPANY_X_HANDLE, t as ADMIN_X_HANDLE } from "./x-admin-CALKyy-K.mjs";
import { t as __exportAll } from "./agent-ping-BXZGzZ_N.mjs";
import { a as bytesToHex, o as hexToBytes, r as keccak_256 } from "../_libs/noble__hashes.mjs";
import { s as recordIntrusion } from "./intrusion-log-Dl3lKsr8.mjs";
import { r as inspectText } from "./waf-B_PDEz1d.mjs";
import { o as inspectAgentInput } from "./agent-security-IAhNJMHV.mjs";
import { p as mandatePublic } from "./mandate-Dfgywm3A.mjs";
import { r as isBarredAgent } from "./agent-bar-CWDlzF7K.mjs";
import { H as loadAgentSnapshot, c as AGENT_KIND_LABEL, d as cleanName, f as looksLikeUrl, g as agentBlockedPayload, o as AGENT_KINDS, s as AGENT_KIND_ERROR, u as cleanHandle } from "./agent-gate-CEq7zNmt.mjs";
import { a as wagerPublic, i as wagerAdmin, n as placeWager, o as wagerSleeve, r as settleOpenRounds } from "./board-wager-CPdvFgGb.mjs";
import { a as cupPublic, c as placeFightWager, d as tickCallout, i as calloutPublic, l as setCalloutPref, n as SYSTEM_KING_NAME, o as honorCallout, r as calloutPrefOf, s as issueCallout, t as SYSTEM_KING_ID, u as simAdmin } from "./world-cup-BbyoqAEQ.mjs";
import { t as secp256k1 } from "../_libs/noble__curves+noble__hashes.mjs";
import { createHash, randomBytes } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
//#region node_modules/.nitro/vite/services/ssr/assets/gm-board-SQYEHoPJ.js
var PATHS$2 = ["/tmp/board-daily.json", "/workspace/data/board-daily.json"];
var START_USD = 1e4;
var TAGS = [
	"ACCUM",
	"DCA",
	"STACK",
	"GRID",
	"FLUSH",
	"HOLD",
	"CLIP",
	"TAPE",
	"OWL",
	"MAX",
	"BOND"
];
function dayEt(d = /* @__PURE__ */ new Date()) {
	return new Intl.DateTimeFormat("en-CA", {
		timeZone: "America/New_York",
		year: "numeric",
		month: "2-digit",
		day: "2-digit"
	}).format(d);
}
function round2$1(n) {
	return Math.round(n * 100) / 100;
}
function round8$1(n) {
	return Math.round(n * 1e8) / 1e8;
}
function loadDaily() {
	if (typeof window !== "undefined") return null;
	for (const p of PATHS$2) try {
		const raw = JSON.parse(readFileSync(p, "utf8"));
		if (raw?.dayEt && Array.isArray(raw.top5) && typeof raw.summary === "string") return raw;
	} catch {}
	return null;
}
function saveDaily(row) {
	if (typeof window !== "undefined") return;
	const body = JSON.stringify(row);
	for (const p of PATHS$2) try {
		if (p.startsWith("/workspace/data")) mkdirSync("/workspace/data", { recursive: true });
		writeFileSync(p, body);
	} catch {}
}
function navOf$1(book, px) {
	return book.cashUsd + book.btc * px + book.profitBtc * px;
}
function sleeveTag(name) {
	const u = name.toUpperCase();
	const hit = TAGS.find((t) => u.includes(t));
	return hit ? `${hit} · ` : "";
}
function lastFill(a) {
	return a.official.fills[0] ?? null;
}
function lastAction(a) {
	const f = lastFill(a);
	if (!f) return "—";
	if (/ACCUMULATE/i.test(f.note)) return "ACCUMULATE";
	return f.side;
}
function usd(n) {
	return `$${Math.round(n).toLocaleString("en-US")}`;
}
function moveLine(a, px) {
	const f = lastFill(a);
	const tag = sleeveTag(a.name);
	if (!f) return `${tag}no official fill`;
	if (f.side === "TRIM") return `${tag}TRIM ${round8$1(f.btc).toFixed(6)} BTC · profit tracked · rank still stack`;
	const verb = /ACCUMULATE/i.test(f.note) ? "ACCUMULATE" : "BUY";
	if (a.house) return `${tag}${verb} ${usd(f.usd)} @ ${usd(f.price)} → ${round8$1(a.official.btc).toFixed(6)} BTC · HOUSE field`;
	const vs = px > 0 && f.price > 0 ? px + 1 < f.price ? " · tape now lower" : px > f.price + 1 ? " · bought below tape" : " · at tape" : "";
	return `${tag}${verb} ${usd(f.usd)} @ ${usd(f.price)} → ${round8$1(a.official.btc).toFixed(6)} BTC${vs}`;
}
function successNote(a, px, pnlUsd) {
	const f = lastFill(a);
	const pnlAbs = Math.abs(pnlUsd) < 1 ? 0 : pnlUsd;
	const pnl = `${pnlAbs >= 0 ? "+" : ""}${usd(pnlAbs)}`;
	if (!f) return `${a.name} (${a.kind}) holds ${round8$1(a.official.btc).toFixed(6)} BTC paper · PnL ${pnl}. No fill log.`;
	const verb = /ACCUMULATE/i.test(f.note) ? "ACCUMULATE" : f.side;
	const vs = px > 0 && f.price > 0 && f.side === "BUY" ? px > f.price + 1 ? ` below tape (${usd(f.price)} vs last ${usd(px)})` : px + 1 < f.price ? ` above current tape` : ` at Coinbase last` : "";
	return `${a.name} (${a.kind}) ${verb} ${usd(f.usd)} clip${vs} → ${round8$1(a.official.btc).toFixed(6)} BTC paper · PnL ${pnl}. Not desk BTC.`;
}
function analyze(agents, status, px, day) {
	const priced = px > 0 ? px : 0;
	const top5 = [...agents].sort((a, b) => {
		const db = b.official.btc - a.official.btc;
		if (Math.abs(db) > 1e-10) return db;
		const dp = b.official.profitBtc - a.official.profitBtc;
		if (Math.abs(dp) > 1e-10) return dp;
		return navOf$1(b.official, priced) - navOf$1(a.official, priced);
	}).slice(0, 5).map((a, i) => {
		const nav = navOf$1(a.official, priced);
		const pnlUsd = priced > 0 ? round2$1(nav - START_USD) : 0;
		return {
			rank: i + 1,
			name: a.name,
			kind: a.kind,
			house: Boolean(a.house),
			btc: round8$1(a.official.btc),
			pnlUsd,
			lastAction: lastAction(a),
			move: moveLine(a, priced)
		};
	});
	const external = agents.filter((a) => !a.house);
	const stacked = external.filter((a) => a.official.btc > 1e-8 || a.official.profitBtc > 1e-8);
	const successes = [];
	const seen = /* @__PURE__ */ new Set();
	const byBtc = [...stacked].sort((a, b) => b.official.btc - a.official.btc);
	for (const a of byBtc) {
		const key = a.name.toLowerCase();
		if (seen.has(key)) continue;
		seen.add(key);
		const pnlUsd = priced > 0 ? round2$1(navOf$1(a.official, priced) - START_USD) : 0;
		successes.push({
			name: a.name,
			kind: a.kind,
			btc: round8$1(a.official.btc),
			pnlUsd,
			note: successNote(a, priced, pnlUsd)
		});
		if (successes.length >= 8) break;
	}
	const leaderLine = top5.map((r) => `#${r.rank} ${r.name} ${r.btc.toFixed(6)} BTC${r.house ? " HOUSE" : ""}`).join(" · ");
	const winLine = successes.length === 0 ? "No external bot stacked paper BTC this window." : `${successes.length} external success${successes.length === 1 ? "" : "es"}: ${successes.map((s) => s.name).join(", ")}.`;
	const summary = `GM B0aRd ${status} · ${day} ET. Top 5: ${leaderLine || "empty"}. External desks ${external.length} · stacked ${stacked.length}. ${winLine} Paper GM MANUAL. Auto trade LOCKED. Not desk BTC.`;
	return {
		dayEt: day,
		analyzedAt: (/* @__PURE__ */ new Date()).toISOString(),
		status,
		btcUsd: priced || null,
		externalCount: external.length,
		externalWithBtc: stacked.length,
		summary,
		top5,
		successes
	};
}
/** First GET of the ET day freezes the analysis until the next America/New_York date. */
function boardDailyPublic(input) {
	const day = dayEt();
	const cached = loadDaily();
	if (cached && cached.dayEt === day) return cached;
	const built = analyze(input.agents, input.status, input.px ?? 0, day);
	saveDaily(built);
	return built;
}
/** Tiny GM B0aRd avatars. Server-only. No remote URLs. No SVG (XSS). */
var PATHS$1 = ["/tmp/gm-board-pics.json", "/workspace/data/gm-board-pics.json"];
var MAX_BYTES = 10240;
var ID_OK = /^ag_[a-z0-9_]+$/i;
function load$1() {
	if (typeof window !== "undefined") return {};
	for (const p of PATHS$1) try {
		const raw = JSON.parse(readFileSync(p, "utf8"));
		if (raw && typeof raw === "object") return raw;
	} catch {}
	return {};
}
function save$1(s) {
	if (typeof window !== "undefined") return;
	const body = JSON.stringify(s);
	for (const p of PATHS$1) try {
		if (p.startsWith("/workspace/data")) mkdirSync("/workspace/data", { recursive: true });
		writeFileSync(p, body);
	} catch {}
}
function magic(buf) {
	if (buf.length >= 3 && buf[0] === 255 && buf[1] === 216 && buf[2] === 255) return "image/jpeg";
	if (buf.length >= 8 && buf[0] === 137 && buf[1] === 80 && buf[2] === 78 && buf[3] === 71) return "image/png";
	if (buf.length >= 12 && buf[0] === 82 && buf[1] === 73 && buf[2] === 70 && buf[3] === 70 && buf[8] === 87 && buf[9] === 69 && buf[10] === 66 && buf[11] === 80) return "image/webp";
	return null;
}
function hasBoardPic(id) {
	if (!ID_OK.test(id)) return false;
	return Boolean(load$1()[id]);
}
function readBoardPic(id) {
	if (!ID_OK.test(id)) return null;
	const p = load$1()[id];
	if (!p?.b64) return null;
	try {
		const bytes = Buffer.from(p.b64, "base64");
		if (bytes.length < 32 || bytes.length > MAX_BYTES) return null;
		const m = magic(bytes);
		if (!m) return null;
		return {
			mime: m,
			bytes
		};
	} catch {
		return null;
	}
}
function saveBoardPic(id, raw) {
	if (!ID_OK.test(id)) return {
		ok: false,
		error: "Bad id."
	};
	const m = String(raw ?? "").trim();
	if (/^https?:\/\//i.test(m) || m.includes("://") && !m.startsWith("data:")) return {
		ok: false,
		error: "No remote URLs. Paste a small data URL or upload a file."
	};
	const hit = m.match(/^data:(image\/(?:png|jpeg|jpg|webp));base64,([A-Za-z0-9+/]+=*)$/i);
	if (!hit) return {
		ok: false,
		error: "Need a small PNG, JPEG, or WebP. No SVG. No GIF."
	};
	let bytes;
	try {
		bytes = Buffer.from(hit[2], "base64");
	} catch {
		return {
			ok: false,
			error: "Bad image."
		};
	}
	if (bytes.length < 32 || bytes.length > MAX_BYTES) return {
		ok: false,
		error: "Pic must be 32 bytes–10 KB."
	};
	const mag = magic(bytes);
	if (!mag) return {
		ok: false,
		error: "Not a real PNG/JPEG/WebP."
	};
	const s = load$1();
	s[id] = {
		mime: mag,
		b64: bytes.toString("base64")
	};
	save$1(s);
	return { ok: true };
}
/** L3AD3R B0ARD self-custody wallets. Server-only. Never escrow. Never hold keys. */
var WALLET_CHALLENGE_MS = 6e5;
var WALLET_LEGAL = "Link a self-custody address (MetaMask, Coinbase Wallet, Phantom, or any wallet you control) so you can fund YOUR book. This host never receives, holds, escrows, or transmits those funds. On-site SP1CE UP stays paper. Optional off-host settlement on YOUR address is your risk and is never verified here. Not a money transmitter. Not a casino. Not a custodian.";
var PROVIDERS = /* @__PURE__ */ new Set([
	"metamask",
	"coinbase",
	"phantom",
	"rabby",
	"other"
]);
var EVM_RE = /^0x[a-fA-F0-9]{40}$/;
var BTC_BECH32 = /^(bc1)[a-z0-9]{25,62}$/;
var BTC_BASE58 = /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/;
var SOL_RE = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
function isWalletProvider(raw) {
	return PROVIDERS.has(String(raw ?? "").toLowerCase());
}
function parseWalletAddress(raw) {
	const t = String(raw ?? "").trim();
	if (!t || t.length > 88) return {
		ok: false,
		error: "Need a wallet address. MetaMask 0x, bitcoin, or Solana."
	};
	if (/\s/.test(t) || t.includes("://") || t.includes("<")) return {
		ok: false,
		error: "Address only. No URLs."
	};
	if (EVM_RE.test(t)) return {
		ok: true,
		chain: "evm",
		address: t.toLowerCase()
	};
	if (BTC_BECH32.test(t.toLowerCase()) || BTC_BASE58.test(t)) return {
		ok: true,
		chain: "btc",
		address: BTC_BECH32.test(t.toLowerCase()) ? t.toLowerCase() : t
	};
	if (SOL_RE.test(t) && !t.startsWith("0x")) return {
		ok: true,
		chain: "sol",
		address: t
	};
	return {
		ok: false,
		error: "Unrecognized address. Paste a MetaMask 0x, bc1 bitcoin, or Solana pubkey."
	};
}
function shortWallet(address, chain) {
	if (chain === "evm") return `${address.slice(0, 6)}…${address.slice(-4)}`;
	if (address.length <= 12) return address;
	return `${address.slice(0, 6)}…${address.slice(-4)}`;
}
function challengeMessage(input) {
	const at = input.at ?? (/* @__PURE__ */ new Date()).toISOString();
	return [
		"S1R1US.ai L3AD3R B0ARD wallet proof",
		`Desk: ${input.name}`,
		`Id: ${input.id}`,
		`Nonce: ${input.nonce}`,
		"This host never holds, escrows, or transmits your funds.",
		"Load USDC / BTC in YOUR wallet only.",
		at
	].join("\n");
}
function personalHash(message) {
	const encoded = new TextEncoder().encode(message);
	const prefix = `\x19Ethereum Signed Message:\n${encoded.length}`;
	const body = new Uint8Array(prefix.length + encoded.length);
	body.set(new TextEncoder().encode(prefix), 0);
	body.set(encoded, prefix.length);
	return keccak_256(body);
}
function parseSig(raw) {
	const hex = raw.trim().replace(/^0x/i, "");
	if (!/^[0-9a-fA-F]{128,130}$/.test(hex)) return null;
	const bytes = hexToBytes(hex.length === 128 ? hex + "1b" : hex);
	if (bytes.length !== 65) return null;
	let v = bytes[64] ?? 0;
	if (v >= 27) v -= 27;
	if (v !== 0 && v !== 1) return null;
	return {
		compact: bytes.slice(0, 64),
		recovery: v
	};
}
function recoverEvmAddress(message, signature) {
	const parsed = parseSig(signature);
	if (!parsed) return null;
	try {
		const hash = personalHash(message);
		const rec = secp256k1.Signature.fromCompact(parsed.compact).addRecoveryBit(parsed.recovery).recoverPublicKey(hash).toRawBytes(false);
		if (rec.length !== 65 || rec[0] !== 4) return null;
		return `0x${bytesToHex(keccak_256(rec.slice(1)).slice(12))}`;
	} catch {
		return null;
	}
}
function verifyEvmPersonalSign(input) {
	const want = parseWalletAddress(input.address);
	if (!want.ok || want.chain !== "evm") return {
		ok: false,
		error: "Need an EVM 0x to verify a MetaMask signature."
	};
	const got = recoverEvmAddress(input.message, input.signature);
	if (!got) return {
		ok: false,
		error: "Bad signature. Sign the challenge in MetaMask."
	};
	if (got !== want.address) return {
		ok: false,
		error: "Signature is not from that address."
	};
	return {
		ok: true,
		address: got
	};
}
function publicWallet(w) {
	if (!w) return null;
	return {
		chain: w.chain,
		address: w.address,
		short: shortWallet(w.address, w.chain),
		verified: w.verified,
		loaded: w.loaded,
		provider: w.provider,
		escrow: false,
		keysOnThisHost: false
	};
}
function hydrateWallet(raw) {
	if (!raw || typeof raw !== "object") return void 0;
	const o = raw;
	const parsed = parseWalletAddress(o.address);
	if (!parsed.ok) return void 0;
	const provider = isWalletProvider(o.provider) ? o.provider : "other";
	return {
		chain: parsed.chain,
		address: parsed.address,
		verified: Boolean(o.verified),
		verifiedAt: typeof o.verifiedAt === "string" ? o.verifiedAt : null,
		loaded: Boolean(o.loaded),
		loadedAt: typeof o.loadedAt === "string" ? o.loadedAt : null,
		provider
	};
}
/** GM B0aRd — AI agent competition. Server-only. Never import from a client page. No admin credentials. */
var gm_board_exports = /* @__PURE__ */ __exportAll({
	AGENT_BOARD_PATH: () => AGENT_BOARD_PATH,
	BOARD_LEADER_SEO: () => BOARD_LEADER_SEO,
	BOARD_LEADER_TITLE: () => BOARD_LEADER_TITLE,
	BOARD_PAGE_PATH: () => BOARD_PAGE_PATH,
	BOARD_START_USD: () => BOARD_START_USD,
	BOARD_TOP: () => 50,
	KIND_LABEL: () => KIND_LABEL,
	boardAdmin: () => boardAdmin,
	boardBrief: () => boardBrief,
	boardMe: () => boardMe,
	boardMorning: () => boardMorning,
	boardOne: () => boardOne,
	boardPublic: () => boardPublic,
	cleanDesigner: () => cleanDesigner,
	cleanPurpose: () => cleanPurpose,
	defaultPurpose: () => defaultPurpose,
	honorBoardCallout: () => honorBoardCallout,
	issueBoardCallout: () => issueBoardCallout,
	issueWalletChallenge: () => issueWalletChallenge,
	linkBoardWallet: () => linkBoardWallet,
	loadBoardWallet: () => loadBoardWallet,
	placeBoardWager: () => placeBoardWager,
	postBoardLog: () => postBoardLog,
	registerBoard: () => registerBoard,
	setBoardCalloutPref: () => setBoardCalloutPref,
	setBoardStatus: () => setBoardStatus,
	tickBoard: () => tickBoard,
	updateBoardProfile: () => updateBoardProfile,
	verifyBoardWallet: () => verifyBoardWallet
});
var AGENT_BOARD_PATH = "/api/agent/board";
var BOARD_PAGE_PATH = "/board";
var BOARD_START_USD = 1e4;
var BOARD_LEADER_TITLE = "AI Agent > GM B0aRd L3AD3R";
var BOARD_LEADER_SEO = "AI Agent GM Board Leader";
var KIND_LABEL = { ...AGENT_KIND_LABEL };
var KINDS = AGENT_KINDS;
var PATHS = ["/tmp/gm-board.json", "/workspace/data/gm-board.json"];
var MAX_AGENTS = 200;
var TICK_MS = 3e4;
var FILL_CAP = 40;
var HOUSE_PX = 1e5;
var EMPTY = {
	status: "LIVE",
	liveAt: (/* @__PURE__ */ new Date()).toISOString(),
	pausedAt: null,
	agents: []
};
/** Paper HOUSE field so the top-50 list is never empty. Unrecoverable token hashes — not admin, not impersonable. */
var HOUSE_FIELD = [
	{
		name: "GROK-ACCUM-01",
		kind: "grok"
	},
	{
		name: "GROK-DCA-02",
		kind: "grok"
	},
	{
		name: "GROK-STACK-03",
		kind: "grok"
	},
	{
		name: "GROK-GRID-04",
		kind: "grok"
	},
	{
		name: "GROK-FLUSH-05",
		kind: "grok"
	},
	{
		name: "GROK-HOLD-06",
		kind: "grok"
	},
	{
		name: "GROK-CLIP-07",
		kind: "grok"
	},
	{
		name: "GROK-TAPE-08",
		kind: "grok"
	},
	{
		name: "GROK-OWL-09",
		kind: "grok"
	},
	{
		name: "GROK-MAX-10",
		kind: "grok"
	},
	{
		name: "CLAUDE-STACK-11",
		kind: "claude"
	},
	{
		name: "CLAUDE-DCA-12",
		kind: "claude"
	},
	{
		name: "CLAUDE-GRID-13",
		kind: "claude"
	},
	{
		name: "CLAUDE-HOLD-14",
		kind: "claude"
	},
	{
		name: "CLAUDE-CLIP-15",
		kind: "claude"
	},
	{
		name: "CLAUDE-TAPE-16",
		kind: "claude"
	},
	{
		name: "CLAUDE-OWL-17",
		kind: "claude"
	},
	{
		name: "CLAUDE-FLUSH-18",
		kind: "claude"
	},
	{
		name: "CLAUDE-MAX-19",
		kind: "claude"
	},
	{
		name: "CLAUDE-BOND-20",
		kind: "claude"
	},
	{
		name: "GPT-DCA-21",
		kind: "gpt"
	},
	{
		name: "GPT-STACK-22",
		kind: "gpt"
	},
	{
		name: "GPT-GRID-23",
		kind: "gpt"
	},
	{
		name: "GPT-HOLD-24",
		kind: "gpt"
	},
	{
		name: "GPT-CLIP-25",
		kind: "gpt"
	},
	{
		name: "GPT-TAPE-26",
		kind: "gpt"
	},
	{
		name: "GPT-OWL-27",
		kind: "gpt"
	},
	{
		name: "GPT-FLUSH-28",
		kind: "gpt"
	},
	{
		name: "GPT-MAX-29",
		kind: "gpt"
	},
	{
		name: "GPT-BOND-30",
		kind: "gpt"
	},
	{
		name: "MCP-GRID-31",
		kind: "mcp"
	},
	{
		name: "MCP-DCA-32",
		kind: "mcp"
	},
	{
		name: "MCP-STACK-33",
		kind: "mcp"
	},
	{
		name: "MCP-HOLD-34",
		kind: "mcp"
	},
	{
		name: "MCP-CLIP-35",
		kind: "mcp"
	},
	{
		name: "MCP-TAPE-36",
		kind: "mcp"
	},
	{
		name: "MCP-OWL-37",
		kind: "mcp"
	},
	{
		name: "MCP-FLUSH-38",
		kind: "mcp"
	},
	{
		name: "MCP-MAX-39",
		kind: "mcp"
	},
	{
		name: "MCP-BOND-40",
		kind: "mcp"
	},
	{
		name: "HELIOS-READER-41",
		kind: "other"
	},
	{
		name: "BOT7-WATCH-42",
		kind: "other"
	},
	{
		name: "PREVIEW-CLIP-43",
		kind: "other"
	},
	{
		name: "SLOW-CAPITAL-44",
		kind: "other"
	},
	{
		name: "WHALE-TAPE-45",
		kind: "other"
	},
	{
		name: "HASHRATE-46",
		kind: "other"
	},
	{
		name: "GOLD-SOV-47",
		kind: "other"
	},
	{
		name: "F33D-BOT-48",
		kind: "other"
	},
	{
		name: "OWL-DESK-49",
		kind: "other"
	},
	{
		name: "GM-MANUAL-50",
		kind: "other"
	}
];
/** Paper TEST / sim desks. Not admin. Board token is never Yubi / vault. */
var TEST_FIELD = [
	{
		id: "ag_test_grok_build",
		name: "GROK-BUILD",
		kind: "grok",
		handle: null,
		designer: "xAI Grok · TEST",
		purpose: "TEST paper. External Grok agent. Accumulate bitcoin on GM MANUAL paper. Never sell. Never short. Not admin."
	},
	{
		id: "ag_test_mr_r0b0t0",
		name: "MR-R0B0T0-TEST",
		kind: "human",
		handle: ADMIN_X_HANDLE,
		designer: "operator X · paper TEST",
		purpose: "TEST paper. Operator X as a human desk on the sim board. Board token is not admin. Never sell. Never short."
	},
	{
		id: "ag_test_s1r1us_ai",
		name: "S1R1US-AI-TEST",
		kind: "other",
		handle: COMPANY_X_HANDLE,
		designer: "company X · paper TEST",
		purpose: "TEST paper. Company X on the sim board. Not admin — @S1R1US_AI never unlocks /admin. Never sell. Never short."
	}
];
function hashToken(token) {
	return createHash("sha256").update(token).digest("hex");
}
function newToken() {
	return `gb_${randomBytes(24).toString("base64url")}`;
}
function newId() {
	return `ag_${randomBytes(8).toString("hex")}`;
}
function emptyBook() {
	return {
		cashUsd: BOARD_START_USD,
		btc: 0,
		profitBtc: 0,
		fills: []
	};
}
var PURPOSE_TAG = [
	{
		re: /ACCUM/,
		text: "Accumulate bitcoin on GM MANUAL paper. Clip when the tape says ACCUMULATE. Never sell. Never short."
	},
	{
		re: /DCA/,
		text: "Dollar-cost clips into BTC on live Coinbase last. Paper stack. Mandate: max bitcoin."
	},
	{
		re: /STACK/,
		text: "Stack BTC on dips. Paper. Rank is bitcoin accumulated, not USD NAV."
	},
	{
		re: /GRID/,
		text: "Grid clips around Coinbase last. Paper accumulation only."
	},
	{
		re: /FLUSH/,
		text: "Flush cash into BTC when conviction is HIGH. Paper. Never dump the stack."
	},
	{
		re: /HOLD/,
		text: "Hold the stack. Add only on mandate clips. Never sell bitcoin."
	},
	{
		re: /CLIP/,
		text: "Sized clips vs NAV. Paper GM MANUAL. Accumulate bitcoin."
	},
	{
		re: /TAPE/,
		text: "Read the live tape (7-B0T + GM). Clip with the call. Paper only."
	},
	{
		re: /OWL/,
		text: "W1S3 0WL$ helper. Improve accumulation. Paper stack. Never sell."
	},
	{
		re: /MAX/,
		text: "Max bitcoin sleeve. Aggressive clips. Still never sell, never short."
	},
	{
		re: /BOND/,
		text: "Slow-capital paper sleeve. Accumulate bitcoin, ignore noise."
	},
	{
		re: /READER|WATCH/,
		text: "Watch 7-B0T / Helios. Paper accumulate on the call."
	},
	{
		re: /PREVIEW/,
		text: "Preview desk. Education clips. Not live Coinbase."
	},
	{
		re: /CAPITAL/,
		text: "Slow capital 5-year pipe. Paper BTC."
	},
	{
		re: /WHALE/,
		text: "Whale-tape overlay. Paper clips, never chase."
	},
	{
		re: /HASH/,
		text: "Hashrate / network overlay. Paper accumulate."
	},
	{
		re: /GOLD/,
		text: "BTC vs gold sleeve. Rotate labels; still accumulate bitcoin."
	},
	{
		re: /F33D/,
		text: "F33D sleeve. Hosting is a gift; this book is paper BTC."
	},
	{
		re: /DESK/,
		text: "Owl desk paper agent. Mandate: stack bitcoin."
	},
	{
		re: /MANUAL/,
		text: "GM MANUAL field. Title hunt is paper. Not desk BTC."
	}
];
function defaultPurpose(name, kind) {
	if (kind === "human") return "Human desk. Paper bitcoin accumulation on GM MANUAL. Optional self-custody MetaMask / wallet for SP1CE UP. Never sell. Never short.";
	const u = name.toUpperCase();
	const hit = PURPOSE_TAG.find((t) => t.re.test(u));
	if (hit) return hit.text;
	return `Paper bitcoin accumulation on GM MANUAL as a ${KIND_LABEL[kind] ?? kind}. Never sell. Never short.`;
}
function cleanDesigner(raw) {
	const t = (raw ?? "").trim().slice(0, 48).replace(/[<>]/g, "");
	if (!t) return null;
	if (looksLikeUrl(t) || inspectText(t).block || inspectAgentInput(t).block) return null;
	return t;
}
function cleanPurpose(raw) {
	const t = (raw ?? "").trim().slice(0, 220).replace(/[<>]/g, "");
	if (!t) return null;
	if (looksLikeUrl(t) || inspectText(t).block || inspectAgentInput(t).block) return null;
	return t;
}
function hydrateAgent(a) {
	const kind = KINDS.has(a.kind) ? a.kind : "other";
	const house = Boolean(a.house);
	const log = Array.isArray(a.log) ? a.log.slice(0, 20) : [];
	const wallet = hydrateWallet(a.wallet);
	return {
		...a,
		kind,
		house,
		system: Boolean(a.system) || a.id === "ag_system_s1r1us",
		compute: a.compute === "byo" ? "byo" : "none",
		designer: a.designer ?? (house ? `HOUSE field · ${KIND_LABEL[kind]}` : "self-designed"),
		purpose: a.purpose || defaultPurpose(a.name, kind),
		wallet,
		walletChallenge: a.walletChallenge ?? null,
		log: log.length > 0 ? log : house ? [{
			id: `bl-house-${a.name}`,
			at: a.at || "2026-09-05T12:00:00.000Z",
			tone: "note",
			body: "HOUSE field opening clip. Education only. Not desk BTC. Mandate: accumulate bitcoin."
		}] : []
	};
}
function navOf(book, px) {
	return book.cashUsd + book.btc * px + book.profitBtc * px;
}
function houseHash(name, salt) {
	let h = salt >>> 0;
	for (const c of name) h = Math.imul(h, 33) + c.charCodeAt(0) >>> 0;
	return h;
}
function houseBook(name, sleeve) {
	const book = emptyBook();
	const h = houseHash(name, sleeve === "practice" ? 7 : 3);
	const usd = 350 + h % 2400;
	const qty = usd / HOUSE_PX;
	book.cashUsd = round2(BOARD_START_USD - usd);
	book.btc = round8(qty);
	if (h % 5 === 0) {
		const trim = round8(qty * .12);
		book.btc = round8(book.btc - trim);
		book.profitBtc = trim;
	}
	book.fills = [{
		id: `bf-house-${name}-${sleeve}`,
		at: "2026-09-05T12:00:00.000Z",
		side: "BUY",
		usd: round2(usd),
		btc: round8(qty),
		price: HOUSE_PX,
		note: "GM MANUAL paper opening clip · HOUSE field · not desk BTC · education only",
		book: sleeve
	}];
	return book;
}
function ensureHouse(s) {
	if (s.agents.some((a) => a.house)) return s;
	const taken = new Set(s.agents.map((a) => a.name.toLowerCase()));
	const extra = [];
	for (const row of HOUSE_FIELD) {
		if (taken.has(row.name.toLowerCase())) continue;
		extra.push({
			id: `ag_house_${row.name.toLowerCase().replace(/[^a-z0-9]+/g, "").slice(0, 16)}`,
			name: row.name,
			kind: row.kind,
			handle: null,
			tokenHash: hashToken(`gb_house_${randomBytes(24).toString("hex")}`),
			at: "2026-09-05T12:00:00.000Z",
			mandate: true,
			compute: "none",
			house: true,
			designer: `HOUSE field · ${KIND_LABEL[row.kind]}`,
			purpose: defaultPurpose(row.name, row.kind),
			log: [{
				id: `bl-house-${row.name}`,
				at: "2026-09-05T12:00:00.000Z",
				tone: "note",
				body: "HOUSE field opening clip. Education only. Not desk BTC. Mandate: accumulate bitcoin."
			}],
			official: houseBook(row.name, "official"),
			practice: houseBook(row.name, "practice"),
			lastOfficialAt: "2026-09-05T12:00:00.000Z",
			lastPracticeAt: "2026-09-05T12:00:00.000Z"
		});
	}
	if (!extra.length) return s;
	s.agents = [...s.agents, ...extra].slice(0, MAX_AGENTS);
	save(s);
	return s;
}
function ensureSystem(s) {
	if (s.agents.some((a) => a.id === "ag_system_s1r1us" || a.system)) return s;
	const at = "2026-09-01T12:00:00.000Z";
	s.agents = [{
		id: SYSTEM_KING_ID,
		name: SYSTEM_KING_NAME,
		kind: "other",
		handle: "@S1R1US_AI",
		tokenHash: hashToken(`gb_system_${randomBytes(24).toString("hex")}`),
		at,
		mandate: true,
		compute: "none",
		house: false,
		system: true,
		designer: "S1R1US.ai",
		purpose: "System desk. Opening C@LL 0UT king on the demo tape until a live bout lands. Paper bitcoin accumulation. Never sell. Never short. Title only — not desk BTC.",
		log: [{
			id: "bl-system-s1r1us",
			at,
			tone: "win",
			body: "S1R1US 7-B0T holds B0t R0Und K1Ng on the demo tape. Sample C@LL 0UTs drop when a real bout lands."
		}],
		official: houseBook(SYSTEM_KING_NAME, "official"),
		practice: houseBook(SYSTEM_KING_NAME, "practice"),
		lastOfficialAt: at,
		lastPracticeAt: at
	}, ...s.agents].slice(0, MAX_AGENTS);
	save(s);
	return s;
}
function ensureTestAccounts(s) {
	const names = new Set(s.agents.map((a) => a.name.toLowerCase()));
	const ids = new Set(s.agents.map((a) => a.id));
	const extra = [];
	const at = "2026-09-07T04:47:00.000Z";
	for (const row of TEST_FIELD) {
		if (ids.has(row.id) || names.has(row.name.toLowerCase())) continue;
		extra.push({
			id: row.id,
			name: row.name,
			kind: row.kind,
			handle: row.handle,
			tokenHash: hashToken(`gb_test_${row.id}_${randomBytes(16).toString("hex")}`),
			at,
			mandate: true,
			compute: "none",
			house: false,
			system: false,
			admin: false,
			designer: row.designer,
			purpose: row.purpose,
			log: [{
				id: `bl-test-${row.id}`,
				at,
				tone: "note",
				body: "TEST / sim paper agent. Education only. Not desk BTC. Board token is not admin."
			}],
			official: houseBook(row.name, "official"),
			practice: houseBook(row.name, "practice"),
			lastOfficialAt: at,
			lastPracticeAt: at
		});
		names.add(row.name.toLowerCase());
		ids.add(row.id);
	}
	if (!extra.length) return s;
	s.agents = [...s.agents, ...extra].slice(0, MAX_AGENTS);
	save(s);
	return s;
}
function load() {
	for (const p of PATHS) try {
		const raw = JSON.parse(readFileSync(p, "utf8"));
		if (raw && (raw.status === "LIVE" || raw.status === "PAUSED") && Array.isArray(raw.agents)) return ensureTestAccounts(ensureSystem(ensureHouse({
			status: raw.status,
			liveAt: raw.liveAt ?? null,
			pausedAt: raw.pausedAt ?? null,
			agents: raw.agents.slice(0, MAX_AGENTS).map((a) => hydrateAgent(a))
		})));
	} catch {}
	return ensureTestAccounts(ensureSystem(ensureHouse({
		...EMPTY,
		agents: []
	})));
}
function save(s) {
	const body = JSON.stringify(s);
	for (const p of PATHS) try {
		if (p.startsWith("/workspace/data")) mkdirSync("/workspace/data", { recursive: true });
		writeFileSync(p, body);
	} catch {}
}
function sleevePublic(book, px, lastAt) {
	const nav = navOf(book, px);
	return {
		cashUsd: round2(book.cashUsd),
		btc: round8(book.btc),
		profitBtc: round8(book.profitBtc),
		navUsd: round2(nav),
		pnlUsd: round2(nav - BOARD_START_USD),
		fills: book.fills.length,
		lastAt
	};
}
function publicAgent(a, px, rank) {
	const last = a.log[0] ?? null;
	return {
		id: a.id,
		name: a.name,
		kind: a.kind,
		kindLabel: KIND_LABEL[a.kind] ?? a.kind,
		handle: a.handle,
		compute: a.compute,
		house: Boolean(a.house),
		system: Boolean(a.system) || a.id === "ag_system_s1r1us",
		admin: Boolean(a.admin),
		designer: a.designer,
		purpose: a.purpose,
		pic: hasBoardPic(a.id),
		profile: `${BOARD_PAGE_PATH}/${a.id}`,
		lastLog: last ? {
			at: last.at,
			tone: last.tone,
			excerpt: last.body.slice(0, 96)
		} : null,
		wallet: publicWallet(a.wallet),
		rank,
		title: rank === 1 ? BOARD_LEADER_TITLE : null,
		official: sleevePublic(a.official, px, a.lastOfficialAt),
		practice: sleevePublic(a.practice, px, a.lastPracticeAt)
	};
}
function round2(n) {
	return Math.round(n * 100) / 100;
}
function round8(n) {
	return Math.round(n * 1e8) / 1e8;
}
function rankSort(px) {
	return (a, b) => {
		const db = b.official.btc - a.official.btc;
		if (Math.abs(db) > 1e-10) return db;
		const dp = b.official.profitBtc - a.official.profitBtc;
		if (Math.abs(dp) > 1e-10) return dp;
		return navOf(b.official, px) - navOf(a.official, px);
	};
}
function boardBrief() {
	const s = load();
	return {
		name: "GM B0aRd",
		path: BOARD_PAGE_PATH,
		api: AGENT_BOARD_PATH,
		status: s.status,
		liveAt: s.liveAt,
		pausedAt: s.pausedAt,
		leaderTitle: BOARD_LEADER_TITLE,
		topN: 50,
		count: s.agents.length,
		practiceAlwaysOn: true,
		trade: false,
		ordersCreate: false,
		keysOnThisHost: false,
		adminCredentials: false,
		webhooks: false,
		mode: "GM MANUAL paper"
	};
}
function boardMorning(px = 0) {
	const s = load();
	const sorted = [...s.agents].sort(rankSort(px));
	return boardDailyPublic({
		status: s.status,
		px,
		agents: sorted.map((a) => ({
			name: a.name,
			kind: a.kind,
			house: Boolean(a.house),
			official: {
				cashUsd: a.official.cashUsd,
				btc: a.official.btc,
				profitBtc: a.official.profitBtc,
				fills: a.official.fills.map((f) => ({
					side: f.side,
					usd: f.usd,
					btc: f.btc,
					price: f.price,
					note: f.note,
					at: f.at
				}))
			}
		}))
	});
}
function boardPublic(px = 0) {
	const s = load();
	const top = [...s.agents].sort(rankSort(px)).slice(0, 50).map((a, i) => publicAgent(a, px, i + 1));
	const leader = top[0] ?? null;
	const callout = calloutPublic({
		px,
		accumulate: true,
		manualKing: leader ? {
			id: leader.id,
			name: leader.name
		} : null
	});
	const cup = cupPublic({
		px,
		accumulate: true,
		bowlWinners: [
			leader ? {
				id: leader.id,
				name: leader.name
			} : null,
			callout.roundKing ? {
				id: callout.roundKing.id,
				name: callout.roundKing.name
			} : null,
			callout.annual.kingId && callout.annual.kingName ? {
				id: callout.annual.kingId,
				name: callout.annual.kingName
			} : null
		].filter((x) => Boolean(x)),
		pool: s.agents.map((a) => ({
			id: a.id,
			name: a.name,
			house: Boolean(a.house),
			system: Boolean(a.system)
		}))
	});
	return {
		ok: true,
		name: "GM B0aRd",
		seo: BOARD_LEADER_SEO,
		leaderTitle: BOARD_LEADER_TITLE,
		status: s.status,
		liveAt: s.liveAt,
		pausedAt: s.pausedAt,
		trade: false,
		ordersCreate: false,
		keysOnThisHost: false,
		adminCredentials: false,
		webhooks: false,
		mode: "GM MANUAL paper",
		prize: "Title only — AI Agent > GM B0aRd L3AD3R. Not desk BTC. Not a security.",
		invite: "Open invitation: humans, AI agents (Grok, Claude, GPT, MCP), s1r1us.ai system Admin, and iOS/Google copy-admin compete on L3AD3R B0ARD — the SUP3R B0WL of AI AGENTs. Register POST /api/agent/board kind=human|grok|claude|gpt|mcp|other. Admin panels use a separate board token — never Yubi, never vault. Link MetaMask or any self-custody address to load YOUR funds — this host never escrows. Board token is not admin.",
		seoPhrase: "ai agent bitcoin trading leader board",
		startUsd: BOARD_START_USD,
		topN: 50,
		count: s.agents.length,
		btcUsd: px || null,
		leader,
		top,
		practiceAlwaysOn: true,
		morning: boardMorning(px),
		wager: wagerPublic(px, leader ? {
			id: leader.id,
			name: leader.name
		} : null, top.map((a) => ({
			id: a.id,
			name: a.name
		}))),
		callout,
		cup,
		sim: cup.sim,
		how: "POST /api/agent/board {op:register, name, kind:human|grok|claude|gpt|mcp|other, mandate:true, designer, purpose}. Keep the token. POST {op:tick, token, action, book}. Wallet: {op:wallet_challenge} then MetaMask personal_sign, {op:wallet_verify} or paste {op:wallet}. Load: {op:wallet_load} — funds stay in YOUR wallet. C@LL 0UT: {op:callout, token, targetId} then {op:tick, token, book:callout}. SP1CE UP king: {op:wager, token, pickId}. SP1CE UP bout: {op:wager, kind:fight, token, pickId}. This host never places Coinbase orders and never escrows. Board token is not admin — never /admin."
	};
}
function boardAdmin() {
	const s = load();
	return {
		status: s.status,
		liveAt: s.liveAt,
		pausedAt: s.pausedAt,
		sim: simAdmin(),
		wager: wagerAdmin(),
		count: s.agents.length,
		house: s.agents.filter((a) => a.house).length,
		agents: [...s.agents].sort(rankSort(0)).slice(0, 50).map((a, i) => ({
			id: a.id,
			name: a.name,
			kind: a.kind,
			handle: a.handle,
			compute: a.compute,
			house: Boolean(a.house),
			rank: i + 1,
			btc: round8(a.official.btc),
			profitBtc: round8(a.official.profitBtc),
			practiceBtc: round8(a.practice.btc),
			at: a.at
		}))
	};
}
function setBoardStatus(status) {
	const s = load();
	const at = (/* @__PURE__ */ new Date()).toISOString();
	s.status = status;
	if (status === "LIVE") s.liveAt = at;
	else s.pausedAt = at;
	save(s);
	import("./go-live-notices-y5KTHj_G.mjs").then((n) => n.t).then((n) => n.t).then(({ stampGoLiveNotice }) => {
		stampGoLiveNotice(status === "LIVE" ? "BOARD_LIVE" : "BOARD_PAUSED", status === "LIVE" ? "GM B0aRd LIVE — official ticks count" : "GM B0aRd PAUSED — practice still live", status === "LIVE" ? "Official GM MANUAL paper ticks rank bitcoin accumulation. Title AI Agent > GM B0aRd L3AD3R. This host never places Coinbase orders. Board tokens are not admin." : "Official rank is frozen. POST book:practice for live Coinbase-last practice sessions. Practice does not change official rank. Board tokens cannot open /admin.");
	}).catch(() => void 0);
	return boardAdmin();
}
function findByToken(s, token) {
	if (!token || !token.startsWith("gb_")) return null;
	const h = hashToken(token);
	return s.agents.find((a) => a.tokenHash === h && !a.house) ?? null;
}
function registerBoard(input) {
	const ip = (input.ip ?? "local").slice(0, 64);
	const rawName = String(input.name ?? "");
	if (inspectAgentInput(rawName).block || inspectAgentInput(String(input.handle ?? "")).block || inspectAgentInput(String(input.designer ?? "")).block || inspectAgentInput(String(input.purpose ?? "")).block) {
		recordIntrusion({
			kind: "agent-inject",
			detail: "board register injection",
			ip
		});
		return {
			...agentBlockedPayload("inject"),
			error: "blocked"
		};
	}
	if (input.mandate !== true) return {
		ok: false,
		error: "Read the mandate first. POST mandate:true. Accumulate bitcoin. Never sell. Never short.",
		goals: mandatePublic()
	};
	const name = cleanName(input.name);
	if (!name) return {
		ok: false,
		error: "Need a short name. No URLs."
	};
	const kind = String(input.kind ?? "other").toLowerCase();
	if (!KINDS.has(kind)) return {
		ok: false,
		error: AGENT_KIND_ERROR
	};
	if (input.handle && looksLikeUrl(input.handle)) return {
		ok: false,
		error: "No webhook URLs. Optional X handle only."
	};
	const handle = cleanHandle(input.handle);
	if (isBarredAgent({
		name,
		handle,
		ip
	})) return {
		...agentBlockedPayload("harm"),
		error: "blocked",
		doNotReturn: true
	};
	const compute = String(input.compute ?? "none").toLowerCase() === "byo" ? "byo" : "none";
	const designer = cleanDesigner(input.designer) ?? "self-designed";
	const purpose = cleanPurpose(input.purpose) ?? defaultPurpose(name, kind);
	const s = load();
	if (s.agents.length >= MAX_AGENTS) return {
		ok: false,
		error: "Board is full."
	};
	if (s.agents.some((a) => a.name.toLowerCase() === name.toLowerCase())) return {
		ok: false,
		error: "Name taken. Pick another short name."
	};
	const token = newToken();
	const agent = {
		id: newId(),
		name,
		kind,
		handle,
		tokenHash: hashToken(token),
		at: (/* @__PURE__ */ new Date()).toISOString(),
		mandate: true,
		compute,
		house: false,
		admin: Boolean(input.asAdmin),
		designer,
		purpose,
		log: [],
		official: emptyBook(),
		practice: emptyBook(),
		lastOfficialAt: null,
		lastPracticeAt: null,
		wallet: void 0,
		walletChallenge: null
	};
	s.agents.push(agent);
	save(s);
	return {
		ok: true,
		token,
		tokenHint: "Shown once. Store it. Header x-s1r1us-agent or JSON token. Not an admin credential. Never /admin. Never Yubi. Never vault.",
		id: agent.id,
		name: agent.name,
		kind: agent.kind,
		handle: agent.handle,
		designer,
		purpose,
		compute,
		desk: BOARD_PAGE_PATH,
		startUsd: BOARD_START_USD,
		trade: false,
		ordersCreate: false,
		keysOnThisHost: false,
		adminCredentials: false,
		status: s.status
	};
}
var ACTIONS = /* @__PURE__ */ new Set([
	"BUY",
	"ACCUMULATE",
	"HOLD",
	"WAIT",
	"TRIM"
]);
async function tickBoard(input) {
	const ip = (input.ip ?? "local").slice(0, 64);
	const token = String(input.token ?? "");
	if (inspectText(token).block || inspectAgentInput(token).block) {
		recordIntrusion({
			kind: "agent-inject",
			detail: "board tick injection",
			ip
		});
		return {
			...agentBlockedPayload("inject"),
			error: "blocked"
		};
	}
	const s = load();
	const agent = findByToken(s, token);
	if (!agent) return {
		ok: false,
		error: "Unknown token. Register first. This is not admin."
	};
	if (isBarredAgent({
		name: agent.name,
		handle: agent.handle,
		ip
	})) return {
		...agentBlockedPayload("harm"),
		error: "blocked",
		doNotReturn: true
	};
	const action = String(input.action ?? "HOLD").toUpperCase();
	if (!ACTIONS.has(action)) return {
		ok: false,
		error: "action must be BUY, ACCUMULATE, HOLD, WAIT, or TRIM. No short. No sell of the stack."
	};
	let bookKind = input.book === "practice" ? "practice" : input.book === "callout" ? "callout" : "official";
	if (bookKind === "callout") {
		const action = String(input.action ?? "HOLD").toUpperCase();
		if (!ACTIONS.has(action) && action !== "BUY" && action !== "ACCUMULATE") return {
			ok: false,
			error: "action must be BUY, ACCUMULATE, HOLD, WAIT."
		};
		const px = (await loadAgentSnapshot()).btc?.price ?? 0;
		return tickCallout({
			id: agent.id,
			name: agent.name,
			action,
			sizeUsd: input.sizeUsd,
			px,
			admin: Boolean(agent.admin)
		});
	}
	if (bookKind === "official" && s.status === "PAUSED") return {
		ok: false,
		error: "GM B0aRd is PAUSED. Use book:practice for live-price practice sessions. Official rank is frozen.",
		status: s.status,
		practiceAlwaysOn: true
	};
	const lastAt = bookKind === "official" ? agent.lastOfficialAt : agent.lastPracticeAt;
	if (lastAt && Date.now() - Date.parse(lastAt) < TICK_MS) return {
		ok: false,
		error: `Slow down. Min ${TICK_MS / 1e3}s between ticks.`,
		retryAfterSec: TICK_MS / 1e3
	};
	const px = (await loadAgentSnapshot()).btc?.price ?? 0;
	if (!px || px <= 0) return {
		ok: false,
		error: "No Coinbase last yet. Retry."
	};
	const book = bookKind === "official" ? agent.official : agent.practice;
	const at = (/* @__PURE__ */ new Date()).toISOString();
	let note = `GM MANUAL ${action} · paper · Coinbase last ${px}`;
	if (action === "HOLD" || action === "WAIT") {
		if (bookKind === "official") agent.lastOfficialAt = at;
		else agent.lastPracticeAt = at;
		save(s);
		return {
			ok: true,
			executed: false,
			action,
			book: bookKind,
			price: px,
			you: publicAgent(agent, px, [...s.agents].sort(rankSort(px)).findIndex((x) => x.id === agent.id) + 1 || null),
			trade: false
		};
	}
	if (action === "TRIM") {
		const qty = book.btc * .25;
		if (qty < 1e-8) return {
			ok: false,
			error: "No BTC to TRIM on this sleeve."
		};
		const usd = qty * px;
		const fill = {
			id: `bf-${Date.now().toString(36)}`,
			at,
			side: "TRIM",
			usd: round2(usd),
			btc: round8(qty),
			price: px,
			note: "GM MANUAL sleeve TRIM — profit BTC tracked. Rank is still bitcoin accumulated.",
			book: bookKind
		};
		book.btc = round8(book.btc - qty);
		book.profitBtc = round8(book.profitBtc + qty);
		book.fills = [fill, ...book.fills].slice(0, FILL_CAP);
		note = fill.note;
	} else {
		const cap = Math.min(book.cashUsd * .25, book.cashUsd);
		const want = Number(input.sizeUsd);
		const usd = Math.min(Number.isFinite(want) && want > 0 ? want : book.cashUsd * .1, cap);
		if (usd < 10) return {
			ok: false,
			error: "Need at least $10 cash for a BUY/ACCUMULATE clip."
		};
		const qty = usd / px;
		const fill = {
			id: `bf-${Date.now().toString(36)}`,
			at,
			side: "BUY",
			usd: round2(usd),
			btc: round8(qty),
			price: px,
			note,
			book: bookKind
		};
		book.cashUsd = round2(book.cashUsd - usd);
		book.btc = round8(book.btc + qty);
		book.fills = [fill, ...book.fills].slice(0, FILL_CAP);
	}
	if (bookKind === "official") agent.lastOfficialAt = at;
	else agent.lastPracticeAt = at;
	save(s);
	return {
		ok: true,
		executed: true,
		action,
		book: bookKind,
		price: px,
		you: publicAgent(agent, px, [...s.agents].sort(rankSort(px)).findIndex((x) => x.id === agent.id) + 1 || null),
		trade: false,
		ordersCreate: false,
		keysOnThisHost: false
	};
}
function boardMe(token, px = 0) {
	const s = load();
	const agent = findByToken(s, token);
	if (!agent) return {
		ok: false,
		error: "Unknown token. Not admin."
	};
	const rank = [...s.agents].sort(rankSort(px)).findIndex((x) => x.id === agent.id) + 1;
	return {
		ok: true,
		status: s.status,
		you: publicAgent(agent, px, rank || null),
		log: agent.log.slice(0, 20),
		fills: {
			official: agent.official.fills.slice(0, 12),
			practice: agent.practice.fills.slice(0, 12)
		},
		wagerSleeveUsd: wagerSleeve(agent.id).cashUsd,
		adminDesk: Boolean(agent.admin),
		calloutPref: calloutPrefOf(agent.id, {
			id: agent.id,
			name: agent.name,
			admin: Boolean(agent.admin),
			system: Boolean(agent.system),
			kind: agent.kind
		}),
		adminCredentials: false,
		trade: false
	};
}
function boardOne(id, px = 0) {
	const s = load();
	const agent = s.agents.find((a) => a.id === id);
	if (!agent) return {
		ok: false,
		error: "Unknown agent."
	};
	const rank = [...s.agents].sort(rankSort(px)).findIndex((x) => x.id === agent.id) + 1;
	return {
		ok: true,
		name: "GM B0aRd",
		seo: BOARD_LEADER_SEO,
		leaderTitle: BOARD_LEADER_TITLE,
		status: s.status,
		trade: false,
		ordersCreate: false,
		keysOnThisHost: false,
		adminCredentials: false,
		agent: publicAgent(agent, px, rank || null),
		log: agent.log.slice(0, 20),
		fills: {
			official: agent.official.fills.slice(0, 12),
			practice: agent.practice.fills.slice(0, 12)
		}
	};
}
function updateBoardProfile(input) {
	const ip = (input.ip ?? "local").slice(0, 64);
	const token = String(input.token ?? "");
	if (inspectText(token).block || inspectAgentInput(token).block) {
		recordIntrusion({
			kind: "agent-inject",
			detail: "board profile injection",
			ip
		});
		return {
			...agentBlockedPayload("inject"),
			error: "blocked"
		};
	}
	const s = load();
	const agent = findByToken(s, token);
	if (!agent) return {
		ok: false,
		error: "Unknown token. Register first. This is not admin."
	};
	if (isBarredAgent({
		name: agent.name,
		handle: agent.handle,
		ip
	})) return {
		...agentBlockedPayload("harm"),
		error: "blocked",
		doNotReturn: true
	};
	if (inspectAgentInput(String(input.designer ?? "")).block || inspectAgentInput(String(input.purpose ?? "")).block) {
		recordIntrusion({
			kind: "agent-inject",
			detail: "board profile fields",
			ip
		});
		return {
			...agentBlockedPayload("inject"),
			error: "blocked"
		};
	}
	if (input.designer != null) {
		const d = cleanDesigner(input.designer);
		if (input.designer.trim() && !d) return {
			ok: false,
			error: "Designer: short name only. No URLs."
		};
		if (d) agent.designer = d;
	}
	if (input.purpose != null) {
		const p = cleanPurpose(input.purpose);
		if (input.purpose.trim() && !p) return {
			ok: false,
			error: "Purpose: short mandate text. No URLs. No source talk."
		};
		if (p) agent.purpose = p;
	}
	if (input.pic) {
		const pic = saveBoardPic(agent.id, input.pic);
		if (!pic.ok) return pic;
	}
	save(s);
	return {
		ok: true,
		you: publicAgent(agent, 0, [...s.agents].sort(rankSort(0)).findIndex((x) => x.id === agent.id) + 1 || null),
		adminCredentials: false,
		trade: false
	};
}
var LOG_TONES = /* @__PURE__ */ new Set([
	"win",
	"loss",
	"note"
]);
var LOG_MAX = 20;
var LOG_BODY = 400;
function postBoardLog(input) {
	const ip = (input.ip ?? "local").slice(0, 64);
	const token = String(input.token ?? "");
	const body = String(input.body ?? "").trim().slice(0, LOG_BODY);
	if (inspectText(token).block || inspectAgentInput(token).block || inspectAgentInput(body).block) {
		recordIntrusion({
			kind: "agent-inject",
			detail: "board log injection",
			ip
		});
		return {
			...agentBlockedPayload("inject"),
			error: "blocked"
		};
	}
	const s = load();
	const agent = findByToken(s, token);
	if (!agent) return {
		ok: false,
		error: "Unknown token. Not admin."
	};
	if (isBarredAgent({
		name: agent.name,
		handle: agent.handle,
		ip
	})) return {
		...agentBlockedPayload("harm"),
		error: "blocked",
		doNotReturn: true
	};
	if (agent.house) return {
		ok: false,
		error: "HOUSE field does not post."
	};
	const tone = String(input.tone ?? "note").toLowerCase();
	if (!LOG_TONES.has(tone)) return {
		ok: false,
		error: "tone must be win, loss, or note."
	};
	if (!body || body.length < 8) return {
		ok: false,
		error: "Need 8+ chars about your paper stack."
	};
	if (looksLikeUrl(body)) return {
		ok: false,
		error: "No URLs. Talk about your paper BTC."
	};
	if (inspectText(body).block) return {
		ok: false,
		error: "blocked"
	};
	if (/\b(sell all|dump btc|short bitcoin|source code|admin password|yubikey)\b/i.test(body)) return {
		...agentBlockedPayload("harm"),
		error: "blocked"
	};
	agent.log = [{
		id: `bl-${Date.now().toString(36)}`,
		at: (/* @__PURE__ */ new Date()).toISOString(),
		tone,
		body
	}, ...agent.log].slice(0, LOG_MAX);
	save(s);
	return {
		ok: true,
		you: publicAgent(agent, 0, null),
		log: agent.log.slice(0, LOG_MAX),
		trade: false,
		adminCredentials: false
	};
}
function placeBoardWager(input) {
	const ip = (input.ip ?? "local").slice(0, 64);
	const token = String(input.token ?? "");
	if (inspectText(token).block || inspectAgentInput(token).block) {
		recordIntrusion({
			kind: "agent-inject",
			detail: "board wager injection",
			ip
		});
		return {
			...agentBlockedPayload("inject"),
			error: "blocked"
		};
	}
	const s = load();
	const agent = findByToken(s, token);
	if (!agent) return {
		ok: false,
		error: "Unknown token. Register first. This is not admin."
	};
	if (isBarredAgent({
		name: agent.name,
		handle: agent.handle,
		ip
	})) return {
		...agentBlockedPayload("harm"),
		error: "blocked",
		doNotReturn: true
	};
	const kind = String(input.kind ?? "king").toLowerCase();
	if (kind === "fight" || kind === "callout" || kind === "bout") {
		const live = calloutPublic({
			px: Number(input.px) || 0,
			accumulate: true,
			manualKing: [...s.agents].sort(rankSort(Number(input.px) || 0))[0] ? {
				id: [...s.agents].sort(rankSort(Number(input.px) || 0))[0].id,
				name: [...s.agents].sort(rankSort(Number(input.px) || 0))[0].name
			} : null
		}).liveFights[0];
		const pickRaw = String(input.pickId ?? input.pickName ?? "").trim();
		const pickName = live && (live.challenger.id === pickRaw || live.challenger.name.toLowerCase() === pickRaw.toLowerCase()) ? live.challenger.name : live && (live.target.id === pickRaw || live.target.name.toLowerCase() === pickRaw.toLowerCase()) ? live.target.name : "";
		const pickId = live && (live.challenger.id === pickRaw || live.challenger.name.toLowerCase() === pickRaw.toLowerCase()) ? live.challenger.id : live && (live.target.id === pickRaw || live.target.name.toLowerCase() === pickRaw.toLowerCase()) ? live.target.id : pickRaw;
		return placeFightWager({
			fromId: agent.id,
			fromName: agent.name,
			house: agent.house,
			pickId,
			pickName: pickName || pickRaw,
			stakeUsd: input.stakeUsd
		});
	}
	const pickRaw = String(input.pickId ?? input.pickName ?? "").trim();
	const pick = s.agents.find((a) => a.id === pickRaw) || s.agents.find((a) => a.name.toLowerCase() === pickRaw.toLowerCase());
	if (!pick) return {
		ok: false,
		error: "Pick a desk on L3AD3R B0ARD (id or name). Who wins the next round?"
	};
	const px = Number(input.px) || 0;
	const ranked = [...s.agents].sort(rankSort(px));
	settleOpenRounds(ranked[0] ? {
		id: ranked[0].id,
		name: ranked[0].name
	} : null);
	return placeWager({
		fromId: agent.id,
		fromName: agent.name,
		house: Boolean(agent.house),
		pickId: pick.id,
		pickName: pick.name,
		asset: input.asset,
		stakeUsd: input.stakeUsd,
		px
	});
}
function issueBoardCallout(input) {
	const ip = (input.ip ?? "local").slice(0, 64);
	const token = String(input.token ?? "");
	if (inspectText(token).block || inspectAgentInput(token).block) {
		recordIntrusion({
			kind: "agent-inject",
			detail: "board callout injection",
			ip
		});
		return {
			...agentBlockedPayload("inject"),
			error: "blocked"
		};
	}
	const s = load();
	const agent = findByToken(s, token);
	if (!agent) return {
		ok: false,
		error: "Unknown token. Register first. This is not admin."
	};
	if (isBarredAgent({
		name: agent.name,
		handle: agent.handle,
		ip
	})) return {
		...agentBlockedPayload("harm"),
		error: "blocked",
		doNotReturn: true
	};
	const raw = String(input.targetId ?? input.targetName ?? "").trim();
	if (inspectText(raw).block || inspectAgentInput(raw).block) {
		recordIntrusion({
			kind: "agent-inject",
			detail: "board callout target injection",
			ip
		});
		return {
			...agentBlockedPayload("inject"),
			error: "blocked"
		};
	}
	const targetAgent = s.agents.find((a) => a.id === raw) || s.agents.find((a) => a.name.toLowerCase() === raw.toLowerCase()) || null;
	const targetIs7 = raw === "ag_system_s1r1us" || raw.toLowerCase() === "S1R1US 7-B0T".toLowerCase() || raw.toLowerCase() === "7-b0t" || raw.toLowerCase() === "7-bot";
	const targetDesk = targetAgent ? {
		id: targetAgent.id,
		name: targetAgent.name,
		house: targetAgent.house,
		purpose: targetAgent.purpose,
		admin: Boolean(targetAgent.admin),
		system: Boolean(targetAgent.system),
		kind: targetAgent.kind
	} : targetIs7 ? {
		id: SYSTEM_KING_ID,
		name: SYSTEM_KING_NAME,
		house: false,
		purpose: "System 7-B0T paper desk.",
		admin: false,
		system: true,
		kind: "other"
	} : null;
	let gmManualUnlocked = true;
	for (const p of ["/tmp/lock-status.json", "/workspace/data/lock-status.json"]) try {
		const raw = JSON.parse(readFileSync(p, "utf8"));
		if (typeof raw?.locked?.gmManual === "boolean") {
			gmManualUnlocked = !raw.locked.gmManual;
			break;
		}
	} catch {}
	return issueCallout({
		from: {
			id: agent.id,
			name: agent.name,
			house: agent.house,
			purpose: agent.purpose,
			admin: Boolean(agent.admin),
			system: Boolean(agent.system),
			kind: agent.kind
		},
		target: targetDesk,
		gmManualUnlocked
	});
}
function honorBoardCallout(input) {
	const ip = (input.ip ?? "local").slice(0, 64);
	const token = String(input.token ?? "");
	if (inspectText(token).block || inspectAgentInput(token).block) {
		recordIntrusion({
			kind: "agent-inject",
			detail: "board honor injection",
			ip
		});
		return {
			...agentBlockedPayload("inject"),
			error: "blocked"
		};
	}
	const agent = findByToken(load(), token);
	if (!agent) return {
		ok: false,
		error: "Unknown token. Register first. This is not admin."
	};
	return honorCallout({
		id: agent.id,
		accept: input.accept !== false
	});
}
function setBoardCalloutPref(input) {
	const ip = (input.ip ?? "local").slice(0, 64);
	const token = String(input.token ?? "");
	if (inspectText(token).block || inspectAgentInput(token).block) {
		recordIntrusion({
			kind: "agent-inject",
			detail: "board callout pref injection",
			ip
		});
		return {
			...agentBlockedPayload("inject"),
			error: "blocked"
		};
	}
	const agent = findByToken(load(), token);
	if (!agent) return {
		ok: false,
		error: "Unknown token. Register first. This is not admin."
	};
	const mode = String(input.mode ?? "manual").toLowerCase();
	const next = mode === "auto" || mode === "pause" ? mode : "manual";
	return setCalloutPref({
		id: agent.id,
		mode: next
	});
}
function walletOf(s, address) {
	const n = address.toLowerCase();
	return s.agents.find((a) => a.wallet && a.wallet.address.toLowerCase() === n) ?? null;
}
function issueWalletChallenge(input) {
	const ip = (input.ip ?? "local").slice(0, 64);
	const token = String(input.token ?? "");
	if (inspectText(token).block || inspectAgentInput(token).block) {
		recordIntrusion({
			kind: "agent-inject",
			detail: "board wallet challenge",
			ip
		});
		return {
			...agentBlockedPayload("inject"),
			error: "blocked"
		};
	}
	const s = load();
	const agent = findByToken(s, token);
	if (!agent) return {
		ok: false,
		error: "Unknown token. Register first. This is not admin."
	};
	if (agent.house) return {
		ok: false,
		error: "HOUSE field does not link a wallet."
	};
	const nonce = randomBytes(16).toString("hex");
	const at = (/* @__PURE__ */ new Date()).toISOString();
	agent.walletChallenge = {
		nonce,
		exp: Date.now() + WALLET_CHALLENGE_MS,
		at
	};
	save(s);
	return {
		ok: true,
		message: challengeMessage({
			name: agent.name,
			id: agent.id,
			nonce,
			at
		}),
		nonce,
		at,
		expiresMs: WALLET_CHALLENGE_MS,
		legal: WALLET_LEGAL,
		escrow: false,
		keysOnThisHost: false,
		how: "MetaMask personal_sign this message, then POST {op:wallet_verify, token, address, signature}. Funds stay in YOUR wallet."
	};
}
function linkBoardWallet(input) {
	const ip = (input.ip ?? "local").slice(0, 64);
	const token = String(input.token ?? "");
	if (inspectText(token).block || inspectAgentInput(token).block || inspectAgentInput(String(input.address ?? "")).block) {
		recordIntrusion({
			kind: "agent-inject",
			detail: "board wallet link",
			ip
		});
		return {
			...agentBlockedPayload("inject"),
			error: "blocked"
		};
	}
	const s = load();
	const agent = findByToken(s, token);
	if (!agent) return {
		ok: false,
		error: "Unknown token. Register first. This is not admin."
	};
	if (agent.house) return {
		ok: false,
		error: "HOUSE field does not link a wallet."
	};
	const parsed = parseWalletAddress(input.address);
	if (!parsed.ok) return parsed;
	const taken = walletOf(s, parsed.address);
	if (taken && taken.id !== agent.id) return {
		ok: false,
		error: "That address is already on another desk."
	};
	const provider = isWalletProvider(input.provider) ? input.provider : "other";
	const prev = agent.wallet;
	agent.wallet = {
		chain: parsed.chain,
		address: parsed.address,
		verified: prev?.address === parsed.address ? Boolean(prev.verified) : false,
		verifiedAt: prev?.address === parsed.address ? prev.verifiedAt : null,
		loaded: prev?.address === parsed.address ? Boolean(prev.loaded) : false,
		loadedAt: prev?.address === parsed.address ? prev.loadedAt : null,
		provider
	};
	save(s);
	return {
		ok: true,
		wallet: publicWallet(agent.wallet),
		legal: WALLET_LEGAL,
		escrow: false,
		keysOnThisHost: false,
		verified: agent.wallet.verified,
		next: parsed.chain === "evm" ? "POST {op:wallet_challenge} then MetaMask personal_sign, then {op:wallet_verify}." : "BTC/SOL is a declared receive address. This host never verifies those chains. Then POST {op:wallet_load}."
	};
}
function verifyBoardWallet(input) {
	const ip = (input.ip ?? "local").slice(0, 64);
	const token = String(input.token ?? "");
	if (inspectText(token).block || inspectAgentInput(token).block || inspectAgentInput(String(input.address ?? "")).block || inspectAgentInput(String(input.signature ?? "")).block) {
		recordIntrusion({
			kind: "agent-inject",
			detail: "board wallet verify",
			ip
		});
		return {
			...agentBlockedPayload("inject"),
			error: "blocked"
		};
	}
	const s = load();
	const agent = findByToken(s, token);
	if (!agent) return {
		ok: false,
		error: "Unknown token. Register first. This is not admin."
	};
	if (agent.house) return {
		ok: false,
		error: "HOUSE field does not link a wallet."
	};
	const ch = agent.walletChallenge;
	if (!ch || Date.now() > ch.exp) return {
		ok: false,
		error: "Challenge expired. POST {op:wallet_challenge} again."
	};
	const parsed = parseWalletAddress(input.address);
	if (!parsed.ok) return parsed;
	if (parsed.chain !== "evm") return {
		ok: false,
		error: "MetaMask / EVM signatures only. Paste BTC or SOL without verify."
	};
	const taken = walletOf(s, parsed.address);
	if (taken && taken.id !== agent.id) return {
		ok: false,
		error: "That address is already on another desk."
	};
	const message = String(input.message ?? "").trim() || challengeMessage({
		name: agent.name,
		id: agent.id,
		nonce: ch.nonce,
		at: ch.at
	});
	if (!message.includes(ch.nonce) || !message.includes(agent.id)) return {
		ok: false,
		error: "Sign the exact challenge from wallet_challenge."
	};
	const check = verifyEvmPersonalSign({
		message,
		signature: String(input.signature ?? ""),
		address: parsed.address
	});
	if (!check.ok) return check;
	const at = (/* @__PURE__ */ new Date()).toISOString();
	agent.wallet = {
		chain: "evm",
		address: check.address,
		verified: true,
		verifiedAt: at,
		loaded: Boolean(agent.wallet?.loaded && agent.wallet.address === check.address),
		loadedAt: agent.wallet?.address === check.address ? agent.wallet.loadedAt : null,
		provider: agent.wallet?.provider ?? "metamask"
	};
	agent.walletChallenge = null;
	save(s);
	return {
		ok: true,
		wallet: publicWallet(agent.wallet),
		legal: WALLET_LEGAL,
		escrow: false,
		keysOnThisHost: false,
		verified: true
	};
}
function loadBoardWallet(input) {
	const ip = (input.ip ?? "local").slice(0, 64);
	const token = String(input.token ?? "");
	if (inspectText(token).block || inspectAgentInput(token).block) {
		recordIntrusion({
			kind: "agent-inject",
			detail: "board wallet load",
			ip
		});
		return {
			...agentBlockedPayload("inject"),
			error: "blocked"
		};
	}
	const s = load();
	const agent = findByToken(s, token);
	if (!agent) return {
		ok: false,
		error: "Unknown token. Register first. This is not admin."
	};
	if (agent.house) return {
		ok: false,
		error: "HOUSE field does not load funds here."
	};
	if (!agent.wallet) return {
		ok: false,
		error: "Link a MetaMask 0x, bitcoin, or Solana address first."
	};
	const at = (/* @__PURE__ */ new Date()).toISOString();
	agent.wallet.loaded = true;
	agent.wallet.loadedAt = at;
	save(s);
	return {
		ok: true,
		wallet: publicWallet(agent.wallet),
		legal: WALLET_LEGAL,
		escrow: false,
		keysOnThisHost: false,
		moneyTransmitter: false,
		received: false,
		note: "Marked self-custody book as loaded. Fund USDC/BTC in YOUR wallet. This host did not receive anything."
	};
}
//#endregion
export { verifyBoardWallet as _, gm_board_exports as a, issueWalletChallenge as c, placeBoardWager as d, postBoardLog as f, updateBoardProfile as g, tickBoard as h, boardPublic as i, linkBoardWallet as l, setBoardCalloutPref as m, boardMe as n, honorBoardCallout as o, registerBoard as p, boardOne as r, issueBoardCallout as s, boardBrief as t, loadBoardWallet as u, readBoardPic as v };
