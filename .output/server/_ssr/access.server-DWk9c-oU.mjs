import { g as looksLikeAdminX, h as isAdminXProvider, y as profileLooksLikeAdminX } from "./x-admin-CALKyy-K.mjs";
import { f as looksLikeSecret } from "./security-Cp6DEZcn.mjs";
import { r as getSql } from "./db-CnQahlAD.mjs";
import { o as isAppAdminToken } from "./tenancy-XVYWlKJ3.mjs";
import { i as argon2id } from "../_libs/noble__hashes.mjs";
import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { AsyncLocalStorage } from "node:async_hooks";
//#region node_modules/.nitro/vite/services/ssr/assets/access.server-DWk9c-oU.js
var DEFAULT_ADMIN = "S1R1uSxadm";
var LEGACY_PEPPER = "h3li0s-lab-access-v1";
var bearerAls = new AsyncLocalStorage();
function runWithBearer(token, fn) {
	return bearerAls.run(token, fn);
}
/** Factory SHA-256 is revoked. Live unlock is Argon2id in admin_lock after Credentials rotate. */
var DEFAULT_HASH = "0000000000000000000000000000000000000000000000000000000000000000";
var TTL_MS = 432e5;
var ADMIN_NAME_RE = /^[A-Za-z0-9._$@!-]{3,32}$/;
var ARGON = {
	t: 3,
	m: 16384,
	p: 1,
	dkLen: 32,
	maxmem: 67108864
};
var hmacPepper = null;
function equalHex(a, b) {
	const left = Buffer.from(a, "hex");
	const right = Buffer.from(b, "hex");
	if (left.length !== right.length) return false;
	return timingSafeEqual(left, right);
}
function sha256Legacy(user, pass) {
	return createHash("sha256").update(`${LEGACY_PEPPER}\0${user}\0${pass}`, "utf8").digest("hex");
}
function hashArgon(user, pass) {
	const salt = randomBytes(16);
	const out = argon2id(Buffer.from(`${user}\0${pass}`, "utf8"), salt, ARGON);
	return `argon2id$m=${ARGON.m},t=${ARGON.t},p=${ARGON.p}$${salt.toString("hex")}$${Buffer.from(out).toString("hex")}`;
}
function verifyArgon(user, pass, stored) {
	const parts = stored.split("$");
	if (parts.length !== 4 || parts[0] !== "argon2id") return false;
	const meta = parts[1] ?? "";
	const saltHex = parts[2] ?? "";
	const hashHex = parts[3] ?? "";
	const m = Number(/m=(\d+)/.exec(meta)?.[1] ?? ARGON.m);
	const t = Number(/t=(\d+)/.exec(meta)?.[1] ?? ARGON.t);
	const p = Number(/p=(\d+)/.exec(meta)?.[1] ?? ARGON.p);
	try {
		const salt = Buffer.from(saltHex, "hex");
		const expect = Buffer.from(hashHex, "hex");
		const out = Buffer.from(argon2id(Buffer.from(`${user}\0${pass}`, "utf8"), salt, {
			t,
			m,
			p,
			dkLen: expect.length,
			maxmem: ARGON.maxmem
		}));
		if (out.length !== expect.length) return false;
		return timingSafeEqual(out, expect);
	} catch {
		return false;
	}
}
async function verifySecret(user, pass, stored) {
	if (stored.startsWith("argon2id$")) return verifyArgon(user, pass, stored);
	if (/^[0-9a-f]{64}$/i.test(stored)) return equalHex(sha256Legacy(user, pass), stored);
	return false;
}
async function hmacKey() {
	if (hmacPepper) return hmacPepper;
	const sql = await getSql();
	let hex = (await sql`
    select hmac_pepper from desk_secrets where id = 'hmac' limit 1
  `)[0]?.hmac_pepper;
	if (!hex || !/^[0-9a-f]{64}$/i.test(hex)) {
		hex = randomBytes(32).toString("hex");
		await sql`
      insert into desk_secrets (id, hmac_pepper, created_at)
      values ('hmac', ${hex}, now())
      on conflict (id) do nothing
    `;
		hex = (await sql`
      select hmac_pepper from desk_secrets where id = 'hmac' limit 1
    `)[0]?.hmac_pepper ?? hex;
	}
	hmacPepper = Buffer.from(hex, "hex");
	return hmacPepper;
}
async function signMac(payload) {
	const key = await hmacKey();
	return createHmac("sha256", key).update(payload).digest("hex");
}
async function lockRow() {
	return (await (await getSql())`
    select cred_hash,
           coalesce(token_gen, 1) as token_gen,
           coalesce(admin_name, ${"S1R1uSxadm"}) as admin_name
    from admin_lock where id = 'default' limit 1
  `)[0] ?? null;
}
async function storedAdminName() {
	try {
		return (await lockRow())?.admin_name || "S1R1uSxadm";
	} catch {
		return DEFAULT_ADMIN;
	}
}
/** True when a live Argon2id (or legacy) hash is stored — not the revoked factory SHA. */
async function adminLockReady() {
	try {
		const row = await lockRow();
		if (!row?.cred_hash) return false;
		if (row.cred_hash === DEFAULT_HASH) return false;
		return true;
	} catch {
		return false;
	}
}
async function credsMatch(user, pass) {
	try {
		const row = await lockRow();
		if (!row) return false;
		if (row.cred_hash === DEFAULT_HASH) return false;
		if (user.trim().toLowerCase() !== row.admin_name.toLowerCase()) return false;
		if (!await verifySecret(row.admin_name, pass, row.cred_hash)) return false;
		if (!row.cred_hash.startsWith("argon2id$")) await rotateCreds(row.admin_name, pass);
		return true;
	} catch {
		return false;
	}
}
async function rotateCreds(name, pass) {
	const sql = await getSql();
	try {
		if ((await sql`
      select id from desk_users where lower(username) = ${name.toLowerCase()} limit 1
    `)[0]) throw new Error("That name is already a desk user.");
	} catch (e) {
		if (e instanceof Error && e.message === "That name is already a desk user.") throw e;
	}
	await sql`
    insert into admin_lock (id, cred_hash, admin_name, token_gen, updated_at)
    values ('default', ${hashArgon(name, pass)}, ${name}, 2, now())
    on conflict (id) do update set
      cred_hash = excluded.cred_hash,
      admin_name = excluded.admin_name,
      token_gen = coalesce(admin_lock.token_gen, 1) + 1,
      updated_at = now()
  `;
}
async function bumpEpoch() {
	await (await getSql())`
    update admin_lock
    set token_gen = coalesce(token_gen, 1) + 1, updated_at = now()
    where id = 'default'
  `;
}
async function currentGen() {
	return (await lockRow())?.token_gen ?? 1;
}
async function requireAdminXSession() {
	const id = await currentXUserId();
	if (!id) return false;
	return sessionIsAdminX(id);
}
async function signAccessToken() {
	const gen = await currentGen();
	const exp = Date.now() + TTL_MS;
	return `${exp}.${gen}.${await signMac(`${exp}.${gen}`)}`;
}
async function verifyAccessToken(token) {
	if (!token) return false;
	if (isAppAdminToken(token) || token.startsWith("app.") || token.includes(".u.")) return false;
	const parts = token.split(".");
	if (parts.length !== 3) return false;
	const [expRaw, genRaw, sig] = parts;
	const exp = Number(expRaw);
	const gen = Number(genRaw);
	if (!Number.isFinite(exp) || !Number.isFinite(gen) || Date.now() > exp) return false;
	if (gen !== await currentGen()) return false;
	const expect = await signMac(`${exp}.${gen}`);
	try {
		if (!timingSafeEqual(Buffer.from(sig ?? "", "hex"), Buffer.from(expect, "hex"))) return false;
	} catch {
		return false;
	}
	return requireAdminXSession();
}
async function signYubiTicket() {
	const gen = await currentGen();
	const exp = Date.now() + 12e4;
	return `${exp}.${gen}.${await signMac(`yubi.${exp}.${gen}`)}`;
}
async function verifyYubiTicket(ticket) {
	if (!ticket) return false;
	const parts = ticket.split(".");
	if (parts.length !== 3) return false;
	const [expRaw, genRaw, sig] = parts;
	const exp = Number(expRaw);
	const gen = Number(genRaw);
	if (!Number.isFinite(exp) || !Number.isFinite(gen) || Date.now() > exp) return false;
	if (gen !== await currentGen()) return false;
	const expect = await signMac(`yubi.${exp}.${gen}`);
	try {
		return timingSafeEqual(Buffer.from(sig ?? "", "hex"), Buffer.from(expect, "hex"));
	} catch {
		return false;
	}
}
async function currentXUserId(bearerToken) {
	try {
		const { getSessionUser } = await import("./verify.server-3YJL-enW.mjs");
		return (await getSessionUser(bearerToken ?? bearerAls.getStore()))?.id ?? null;
	} catch {
		return null;
	}
}
async function finishDeskUnlock() {
	const username = await storedAdminName();
	try {
		const { adminPanelYubiLock, adminHasPhysicalKey } = await import("./yubi-gate-B9Zz0Kwf.mjs");
		if (await adminPanelYubiLock() && await adminHasPhysicalKey()) return {
			ok: true,
			needYubi: true,
			ticket: await signYubiTicket(),
			username
		};
	} catch {}
	return {
		ok: true,
		needYubi: false,
		token: await signAccessToken(),
		role: "admin",
		scope: "system",
		username
	};
}
var USER_ID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
async function signUserToken(userId) {
	const gen = await currentGen();
	const exp = Date.now() + TTL_MS;
	return `${exp}.${gen}.u.${userId}.${await signMac(`user.${exp}.${gen}.${userId}`)}`;
}
async function verifyDeskToken(token) {
	if (!token) return null;
	if (isAppAdminToken(token) || token.startsWith("app.")) return null;
	const parts = token.split(".");
	if (parts.length === 3) return await verifyAccessToken(token) ? { role: "admin" } : null;
	if (parts.length !== 5 || parts[2] !== "u") return null;
	const [expRaw, genRaw, , userId, sig] = parts;
	if (!userId || !USER_ID_RE.test(userId)) return null;
	const exp = Number(expRaw);
	const gen = Number(genRaw);
	if (!Number.isFinite(exp) || !Number.isFinite(gen) || Date.now() > exp) return null;
	if (gen !== await currentGen()) return null;
	const expect = await signMac(`user.${exp}.${gen}.${userId}`);
	try {
		if (!timingSafeEqual(Buffer.from(sig ?? "", "hex"), Buffer.from(expect, "hex"))) return null;
	} catch {
		return null;
	}
	if (!await deskUserById(userId)) return null;
	return {
		role: "user",
		userId
	};
}
async function deskUserById(id) {
	try {
		return (await (await getSql())`
      select id, username, pass_hash from desk_users where id = ${id} limit 1
    `)[0] ?? null;
	} catch {
		return null;
	}
}
async function matchDeskUser(user, pass) {
	try {
		const row = (await (await getSql())`
      select id, username, pass_hash from desk_users where lower(username) = ${user.toLowerCase()} limit 1
    `)[0];
		if (!row) return null;
		if (!await verifySecret(row.username, pass, row.pass_hash)) return null;
		if (!row.pass_hash.startsWith("argon2id$")) await (await getSql())`update desk_users set pass_hash = ${hashArgon(row.username, pass)} where id = ${row.id}`;
		return {
			id: row.id,
			username: row.username
		};
	} catch {
		return null;
	}
}
async function listDeskUsers() {
	return (await getSql())`
    select id, username, created_at::text as created_at
    from desk_users
    order by created_at asc
  `;
}
async function createDeskUser(username, pass) {
	const sql = await getSql();
	const admin = await storedAdminName();
	if (username.toLowerCase() === admin.toLowerCase()) throw new Error("That name is reserved for admin.");
	if (((await sql`select count(*)::int as n from desk_users`)[0]?.n ?? 0) >= 24) throw new Error("User limit reached (24).");
	if ((await sql`
    select id from desk_users where lower(username) = ${username.toLowerCase()} limit 1
  `)[0]) throw new Error("That username is taken.");
	const id = crypto.randomUUID();
	await sql`
    insert into desk_users (id, username, pass_hash, created_at)
    values (${id}, ${username}, ${hashArgon(username, pass)}, now())
  `;
	return {
		id,
		username
	};
}
async function removeDeskUser(id) {
	if (!USER_ID_RE.test(id)) throw new Error("Invalid user.");
	await (await getSql())`delete from desk_users where id = ${id}`;
}
async function enrolled2fa() {
	return (await enrolledRow())?.user_id ?? null;
}
async function enrolledRow() {
	try {
		return (await (await getSql())`
      select user_id,
             coalesce(passwordless, false) as passwordless,
             handle
      from admin_2fa where id = 'default' limit 1
    `)[0] ?? null;
	} catch {
		return null;
	}
}
async function enroll2fa(userId, handle) {
	await (await getSql())`
    insert into admin_2fa (id, user_id, enrolled_at, passwordless, handle)
    values ('default', ${userId}, now(), false, ${handle?.slice(0, 64) || null})
    on conflict (id) do nothing
  `;
}
async function setXBind(userId, handle, passwordless) {
	await (await getSql())`
    insert into admin_2fa (id, user_id, enrolled_at, passwordless, handle)
    values ('default', ${userId}, now(), ${passwordless}, ${handle.slice(0, 64)})
    on conflict (id) do update set
      user_id = excluded.user_id,
      passwordless = excluded.passwordless,
      handle = excluded.handle,
      enrolled_at = now()
  `;
}
async function setPasswordless(on) {
	await (await getSql())`
    update admin_2fa set passwordless = ${on} where id = 'default'
  `;
}
async function clear2fa() {
	await (await getSql())`delete from admin_2fa where id = 'default'`;
}
async function assert2fa(userId) {
	const x = await assertAdminX(userId);
	if (x) return x;
	const enrolled = await enrolled2fa();
	if (!enrolled) return "Complete 2FA enrollment: X, then admin password.";
	if (enrolled !== userId) return "This X account is not the bound operator.";
	return null;
}
async function assertAdminX(userId) {
	if (await sessionIsAdminX(userId)) return null;
	return "Only the operator X account can access admin. Sign out and Continue with X as that account.";
}
async function sessionIsAdminX(userId) {
	if (!userId) return false;
	try {
		const sql = await getSql();
		const accounts = await sql`
      select "accountId" as "accountId", "providerId" as "providerId", "idToken" as "idToken"
      from "account" where "userId" = ${userId}
    `;
		let grokX = false;
		for (const a of accounts) {
			if (!isAdminXProvider(a.providerId)) continue;
			grokX = true;
			if (looksLikeAdminX(a.accountId) || profileLooksLikeAdminX(a.accountId)) return true;
			if (idTokenClaimsAreAdmin(a.idToken)) return true;
		}
		if (!grokX) return false;
		const u = (await sql`
      select name, email from "user" where id = ${userId} limit 1
    `)[0];
		if (u && profileLooksLikeAdminX({
			name: u.name,
			email: u.email,
			preferred_username: u.name
		})) return true;
		return false;
	} catch {
		return false;
	}
}
function idTokenClaimsAreAdmin(token) {
	if (!token || token.split(".").length < 2) return false;
	try {
		const payload = JSON.parse(Buffer.from(token.split(".")[1], "base64url").toString("utf8"));
		if (profileLooksLikeAdminX(payload)) return true;
		if (payload && typeof payload === "object" && !Array.isArray(payload)) {
			const rec = payload;
			return [
				rec.sub,
				rec.user_id,
				rec.preferred_username,
				rec.username,
				rec.nickname
			].some((v) => typeof v === "string" && looksLikeAdminX(v));
		}
		return false;
	} catch {
		return false;
	}
}
function assertNewAdminPass(pass, confirm, adminName) {
	if (pass !== confirm) return "New passwords do not match.";
	if (pass.length < 12) return "New password must be at least 12 characters.";
	if (pass.length > 128) return "New password is too long.";
	if (looksLikeSecret(pass)) return "Secret rejected. Never paste a Coinbase key or wallet seed here.";
	if (pass.toLowerCase() === adminName.toLowerCase()) return "Password cannot match the admin name.";
	return null;
}
async function issueResetToken() {
	const sql = await getSql();
	await sql`delete from admin_reset where exp < now() or used_at is not null`;
	await sql`delete from admin_reset where used_at is null`;
	const raw = randomBytes(32).toString("hex");
	await sql`
    insert into admin_reset (token_hash, exp, created_at)
    values (${createHash("sha256").update(raw, "utf8").digest("hex")}, now() + interval '30 minutes', now())
  `;
	return raw;
}
async function consumeResetToken(raw) {
	const token = raw.trim().toLowerCase();
	if (!/^[0-9a-f]{64}$/.test(token)) return false;
	const hash = createHash("sha256").update(token, "utf8").digest("hex");
	const sql = await getSql();
	if (!(await sql`
    select token_hash from admin_reset
    where token_hash = ${hash} and used_at is null and exp > now()
    limit 1
  `)[0]) return false;
	await sql`update admin_reset set used_at = now() where token_hash = ${hash}`;
	return true;
}
//#endregion
export { ADMIN_NAME_RE, DEFAULT_ADMIN, adminLockReady, assert2fa, assertAdminX, assertNewAdminPass, bumpEpoch, clear2fa, consumeResetToken, createDeskUser, credsMatch, enroll2fa, enrolled2fa, enrolledRow, finishDeskUnlock, hmacKey, issueResetToken, listDeskUsers, matchDeskUser, removeDeskUser, rotateCreds, runWithBearer, sessionIsAdminX, setPasswordless, setXBind, signAccessToken, signUserToken, storedAdminName, verifyAccessToken, verifyDeskToken, verifyYubiTicket };
