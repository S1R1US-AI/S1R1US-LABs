import { r as __exportAll } from "../_runtime.mjs";
import { t as __exportAll$1 } from "./agent-ping-BXZGzZ_N.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ban-list-C6IREqAh.js
var ban_list_C6IREqAh_exports = /* @__PURE__ */ __exportAll({
	a: () => isBanned,
	c: () => noteStrike,
	i: () => ingestBans,
	n: () => ban_list_exports,
	o: () => isLoopback,
	r: () => clientIpFromHeaders,
	s: () => listBans,
	t: () => banUntil
});
var ban_list_exports = /* @__PURE__ */ __exportAll$1({
	banUntil: () => banUntil,
	barPermanent: () => barPermanent,
	clientIpFromHeaders: () => clientIpFromHeaders,
	ingestBans: () => ingestBans,
	isBanned: () => isBanned,
	isLoopback: () => isLoopback,
	listBans: () => listBans,
	noteStrike: () => noteStrike,
	prune: () => prune
});
var LOOPBACK = /* @__PURE__ */ new Set([
	"local",
	"127.0.0.1",
	"::1",
	"0.0.0.0",
	"::ffff:127.0.0.1"
]);
var STRIKES = /* @__PURE__ */ new Map();
var BANS = [];
var LOG_PATH = "/tmp/desk-bans.json";
function clientIpFromHeaders(headers) {
	const rec = headers && typeof headers === "object" ? headers : {};
	const read = (name) => {
		if (typeof rec.get === "function") return rec.get(name) ?? "";
		const v = rec[name] ?? rec[name.toLowerCase()];
		if (Array.isArray(v)) return String(v[0] ?? "");
		return typeof v === "string" ? v : "";
	};
	const cf = read("cf-connecting-ip")?.trim();
	if (cf) return cf.slice(0, 64);
	const real = read("x-real-ip")?.trim();
	if (real) return real.slice(0, 64);
	const fwd = read("x-forwarded-for")?.split(",")[0]?.trim();
	if (fwd) return fwd.slice(0, 64);
	return "local";
}
function isLoopback(ip) {
	const t = ip.trim().toLowerCase();
	if (LOOPBACK.has(t)) return true;
	if (t.startsWith("127.") || t.startsWith("::ffff:127.")) return true;
	return false;
}
function isBanned(ip) {
	prune();
	if (isLoopback(ip)) return false;
	const row = BANS.find((b) => b.ip === ip);
	return Boolean(row && row.until > Date.now());
}
function banUntil(ip) {
	prune();
	return BANS.find((b) => b.ip === ip && b.until > Date.now()) ?? null;
}
/**
* Weight: WAF CRITICAL=5, auth-fail=2, scraper=2, secret-paste=4.
* 8 points / 10 min → 30 min ban. 16 points → 12 h.
*/
function noteStrike(ip, weight, reason) {
	if (isLoopback(ip) || weight <= 0) return null;
	prune();
	const now = Date.now();
	const cur = STRIKES.get(ip);
	if (!cur || now - cur.at > 6e5) STRIKES.set(ip, {
		n: weight,
		at: now
	});
	else {
		cur.n += weight;
		cur.at = now;
	}
	const n = STRIKES.get(ip).n;
	let ms = 0;
	if (n >= 16) ms = 432e5;
	else if (n >= 8) ms = 18e5;
	else return null;
	const existing = BANS.find((b) => b.ip === ip);
	const until = now + ms;
	const row = {
		ip: ip.slice(0, 64),
		until,
		reason: reason.slice(0, 160),
		strikes: n,
		at: (/* @__PURE__ */ new Date()).toISOString()
	};
	if (existing) {
		existing.until = Math.max(existing.until, until);
		existing.reason = row.reason;
		existing.strikes = n;
		existing.at = row.at;
		persist();
		return existing;
	}
	BANS.unshift(row);
	if (BANS.length > 200) BANS.length = 200;
	persist();
	return row;
}
function listBans() {
	prune();
	return {
		active: BANS.filter((b) => b.until > Date.now()),
		total: BANS.length,
		loopbackExempt: true,
		engine: "CrowdSec-style local scoring · Fail2ban windows (8/10m → 30m, 16 → 12h) · permanent forum bars"
	};
}
/** Permanent IP bar (W1S3 0WL$ harm / false-mandate). Loopback never banned. */
function barPermanent(ip, reason) {
	if (isLoopback(ip) || !ip) return null;
	prune();
	const until = Date.now() + 31536e7;
	const existing = BANS.find((b) => b.ip === ip);
	const row = {
		ip: ip.slice(0, 64),
		until,
		reason: reason.slice(0, 160),
		strikes: 99,
		at: (/* @__PURE__ */ new Date()).toISOString()
	};
	if (existing) {
		existing.until = Math.max(existing.until, until);
		existing.reason = row.reason;
		existing.strikes = 99;
		existing.at = row.at;
		persist();
		return existing;
	}
	BANS.unshift(row);
	if (BANS.length > 200) BANS.length = 200;
	persist();
	return row;
}
function prune() {
	const now = Date.now();
	BANS = BANS.filter((b) => b.until > now - 864e5);
	for (const [ip, s] of STRIKES) if (now - s.at > 36e5) STRIKES.delete(ip);
}
function persist() {
	if (typeof window !== "undefined") return;
	import("node:fs").then((fs) => {
		try {
			fs.writeFileSync(LOG_PATH, JSON.stringify({
				at: (/* @__PURE__ */ new Date()).toISOString(),
				bans: BANS
			}, null, 2));
		} catch {}
	}).catch(() => void 0);
}
function ingestBans(raw) {
	if (!raw || typeof raw !== "object") return;
	const bans = raw.bans;
	if (!Array.isArray(bans)) return;
	const seen = new Set(BANS.map((b) => b.ip));
	for (const item of bans) {
		if (!item || typeof item !== "object") continue;
		const b = item;
		if (!b.ip || !b.until) continue;
		if (seen.has(b.ip)) continue;
		seen.add(b.ip);
		BANS.push({
			ip: String(b.ip).slice(0, 64),
			until: Number(b.until) || 0,
			reason: String(b.reason ?? "").slice(0, 160),
			strikes: Number(b.strikes) || 0,
			at: String(b.at ?? (/* @__PURE__ */ new Date()).toISOString()).slice(0, 40)
		});
	}
}
//#endregion
export { isBanned as a, noteStrike as c, ingestBans as i, ban_list_C6IREqAh_exports as n, isLoopback as o, clientIpFromHeaders as r, listBans as s, banUntil as t };
