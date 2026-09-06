import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { AsyncLocalStorage } from "node:async_hooks";
import { argon2id } from "@noble/hashes/argon2.js";
import { getSql } from "@/lib/db";
import { ADMIN_LOGIN_NAME } from "./admin-name";
import { isAdminXProvider, looksLikeAdminX, profileLooksLikeAdminX } from "./x-admin";
import { looksLikeSecret } from "./security";

export const DEFAULT_ADMIN = ADMIN_LOGIN_NAME;
const LEGACY_PEPPER = "h3li0s-lab-access-v1";

const bearerAls = new AsyncLocalStorage<string | undefined>();
export function runWithBearer<T>(token: string | undefined, fn: () => T): T {
  return bearerAls.run(token, fn);
}
/** Factory SHA-256 is revoked. Live unlock is Argon2id in admin_lock after Credentials rotate. */
const DEFAULT_HASH = "0000000000000000000000000000000000000000000000000000000000000000";
const TTL_MS = 12 * 60 * 60 * 1000;
export const ADMIN_NAME_RE = /^[A-Za-z0-9._$@!-]{3,32}$/;
const ARGON = { t: 3, m: 16384, p: 1, dkLen: 32, maxmem: 64 * 1024 * 1024 } as const;

let hmacPepper: Buffer | null = null;

function equalHex(a: string, b: string) {
  const left = Buffer.from(a, "hex");
  const right = Buffer.from(b, "hex");
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

function sha256Legacy(user: string, pass: string) {
  return createHash("sha256").update(`${LEGACY_PEPPER}\0${user}\0${pass}`, "utf8").digest("hex");
}

export function credDigest(user: string, pass: string) {
  return sha256Legacy(user, pass);
}

function hashArgon(user: string, pass: string) {
  const salt = randomBytes(16);
  const out = argon2id(Buffer.from(`${user}\0${pass}`, "utf8"), salt, ARGON);
  return `argon2id$m=${ARGON.m},t=${ARGON.t},p=${ARGON.p}$${salt.toString("hex")}$${Buffer.from(out).toString("hex")}`;
}

function verifyArgon(user: string, pass: string, stored: string) {
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
    const out = Buffer.from(
      argon2id(Buffer.from(`${user}\0${pass}`, "utf8"), salt, { t, m, p, dkLen: expect.length, maxmem: ARGON.maxmem }),
    );
    if (out.length !== expect.length) return false;
    return timingSafeEqual(out, expect);
  } catch {
    return false;
  }
}

async function verifySecret(user: string, pass: string, stored: string) {
  if (stored.startsWith("argon2id$")) return verifyArgon(user, pass, stored);
  if (/^[0-9a-f]{64}$/i.test(stored)) return equalHex(sha256Legacy(user, pass), stored);
  return false;
}

export async function hmacKey() {
  if (hmacPepper) return hmacPepper;
  const sql = await getSql();
  const rows = await sql<{ hmac_pepper: string }>`
    select hmac_pepper from desk_secrets where id = 'hmac' limit 1
  `;
  let hex = rows[0]?.hmac_pepper;
  if (!hex || !/^[0-9a-f]{64}$/i.test(hex)) {
    hex = randomBytes(32).toString("hex");
    await sql`
      insert into desk_secrets (id, hmac_pepper, created_at)
      values ('hmac', ${hex}, now())
      on conflict (id) do nothing
    `;
    const again = await sql<{ hmac_pepper: string }>`
      select hmac_pepper from desk_secrets where id = 'hmac' limit 1
    `;
    hex = again[0]?.hmac_pepper ?? hex;
  }
  hmacPepper = Buffer.from(hex, "hex");
  return hmacPepper;
}

async function signMac(payload: string) {
  const key = await hmacKey();
  return createHmac("sha256", key).update(payload).digest("hex");
}

async function lockRow(): Promise<{ cred_hash: string; token_gen: number; admin_name: string } | null> {
  const sql = await getSql();
  const rows = await sql<{ cred_hash: string; token_gen: number; admin_name: string }>`
    select cred_hash,
           coalesce(token_gen, 1) as token_gen,
           coalesce(admin_name, ${DEFAULT_ADMIN}) as admin_name
    from admin_lock where id = 'default' limit 1
  `;
  return rows[0] ?? null;
}

export async function storedAdminName() {
  try {
    const row = await lockRow();
    return row?.admin_name || DEFAULT_ADMIN;
  } catch {
    return DEFAULT_ADMIN;
  }
}

/** True when a live Argon2id (or legacy) hash is stored — not the revoked factory SHA. */
export async function adminLockReady() {
  try {
    const row = await lockRow();
    if (!row?.cred_hash) return false;
    if (row.cred_hash === DEFAULT_HASH) return false;
    return true;
  } catch {
    return false;
  }
}

export async function credsMatch(user: string, pass: string) {
  try {
    const row = await lockRow();
    if (!row) {
      return false;
    }
    if (row.cred_hash === DEFAULT_HASH) return false;
    const name = user.trim();
    if (name.toLowerCase() !== row.admin_name.toLowerCase()) return false;
    const ok = await verifySecret(row.admin_name, pass, row.cred_hash);
    if (!ok) return false;
    if (!row.cred_hash.startsWith("argon2id$")) await rotateCreds(row.admin_name, pass);
    return true;
  } catch {
    return false;
  }
}

export async function rotateCreds(name: string, pass: string) {
  const sql = await getSql();
  try {
    const clash = await sql<{ id: string }>`
      select id from desk_users where lower(username) = ${name.toLowerCase()} limit 1
    `;
    if (clash[0]) throw new Error("That name is already a desk user.");
  } catch (e) {
    if (e instanceof Error && e.message === "That name is already a desk user.") throw e;
  }
  const hash = hashArgon(name, pass);
  await sql`
    insert into admin_lock (id, cred_hash, admin_name, token_gen, updated_at)
    values ('default', ${hash}, ${name}, 2, now())
    on conflict (id) do update set
      cred_hash = excluded.cred_hash,
      admin_name = excluded.admin_name,
      token_gen = coalesce(admin_lock.token_gen, 1) + 1,
      updated_at = now()
  `;
}

export async function bumpEpoch() {
  const sql = await getSql();
  await sql`
    update admin_lock
    set token_gen = coalesce(token_gen, 1) + 1, updated_at = now()
    where id = 'default'
  `;
}

async function currentGen() {
  const row = await lockRow();
  return row?.token_gen ?? 1;
}

export async function requireAdminXSession(): Promise<boolean> {
  const id = await currentXUserId();
  if (!id) return false;
  return sessionIsAdminX(id);
}

export async function signAccessToken() {
  const gen = await currentGen();
  const exp = Date.now() + TTL_MS;
  const sig = await signMac(`${exp}.${gen}`);
  return `${exp}.${gen}.${sig}`;
}

export async function verifyAccessToken(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [expRaw, genRaw, sig] = parts;
  const exp = Number(expRaw);
  const gen = Number(genRaw);
  if (!Number.isFinite(exp) || !Number.isFinite(gen) || Date.now() > exp) return false;
  const live = await currentGen();
  if (gen !== live) return false;
  const expect = await signMac(`${exp}.${gen}`);
  try {
    if (!timingSafeEqual(Buffer.from(sig ?? "", "hex"), Buffer.from(expect, "hex"))) return false;
  } catch {
    return false;
  }
  return requireAdminXSession();
}

export async function signYubiTicket() {
  const gen = await currentGen();
  const exp = Date.now() + 2 * 60_000;
  const sig = await signMac(`yubi.${exp}.${gen}`);
  return `${exp}.${gen}.${sig}`;
}

export async function verifyYubiTicket(ticket: string | undefined): Promise<boolean> {
  if (!ticket) return false;
  const parts = ticket.split(".");
  if (parts.length !== 3) return false;
  const [expRaw, genRaw, sig] = parts;
  const exp = Number(expRaw);
  const gen = Number(genRaw);
  if (!Number.isFinite(exp) || !Number.isFinite(gen) || Date.now() > exp) return false;
  const live = await currentGen();
  if (gen !== live) return false;
  const expect = await signMac(`yubi.${exp}.${gen}`);
  try {
    return timingSafeEqual(Buffer.from(sig ?? "", "hex"), Buffer.from(expect, "hex"));
  } catch {
    return false;
  }
}

export async function currentXUserId(bearerToken?: string): Promise<string | null> {
  try {
    const { getSessionUser } = await import("@/lib/auth/verify.server");
    const token = bearerToken ?? bearerAls.getStore();
    const user = await getSessionUser(token);
    return user?.id ?? null;
  } catch {
    return null;
  }
}

export async function finishDeskUnlock(): Promise<
  | { ok: true; needYubi: false; token: string; role: "admin"; username: string }
  | { ok: true; needYubi: true; ticket: string; username: string }
> {
  const username = await storedAdminName();
  try {
    const { adminPanelYubiLock, adminHasPhysicalKey } = await import("./yubi-gate");
    if ((await adminPanelYubiLock()) && (await adminHasPhysicalKey())) {
      return { ok: true, needYubi: true, ticket: await signYubiTicket(), username };
    }
  } catch {
    /* gate off */
  }
  return {
    ok: true,
    needYubi: false,
    token: await signAccessToken(),
    role: "admin",
    username,
  };
}

const USER_ID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function signUserToken(userId: string) {
  const gen = await currentGen();
  const exp = Date.now() + TTL_MS;
  const sig = await signMac(`user.${exp}.${gen}.${userId}`);
  return `${exp}.${gen}.u.${userId}.${sig}`;
}

export type DeskSession = { role: "admin" } | { role: "user"; userId: string };

export async function verifyDeskToken(token: string | undefined): Promise<DeskSession | null> {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length === 3) {
    return (await verifyAccessToken(token)) ? { role: "admin" } : null;
  }
  if (parts.length !== 5 || parts[2] !== "u") return null;
  const [expRaw, genRaw, , userId, sig] = parts;
  if (!userId || !USER_ID_RE.test(userId)) return null;
  const exp = Number(expRaw);
  const gen = Number(genRaw);
  if (!Number.isFinite(exp) || !Number.isFinite(gen) || Date.now() > exp) return null;
  const live = await currentGen();
  if (gen !== live) return null;
  const expect = await signMac(`user.${exp}.${gen}.${userId}`);
  try {
    if (!timingSafeEqual(Buffer.from(sig ?? "", "hex"), Buffer.from(expect, "hex"))) return null;
  } catch {
    return null;
  }
  const row = await deskUserById(userId);
  if (!row) return null;
  return { role: "user", userId };
}

export async function deskUserById(id: string) {
  try {
    const sql = await getSql();
    const rows = await sql<{ id: string; username: string; pass_hash: string }>`
      select id, username, pass_hash from desk_users where id = ${id} limit 1
    `;
    return rows[0] ?? null;
  } catch {
    return null;
  }
}

export async function matchDeskUser(user: string, pass: string) {
  try {
    const sql = await getSql();
    const rows = await sql<{ id: string; username: string; pass_hash: string }>`
      select id, username, pass_hash from desk_users where lower(username) = ${user.toLowerCase()} limit 1
    `;
    const row = rows[0];
    if (!row) return null;
    if (!(await verifySecret(row.username, pass, row.pass_hash))) return null;
    if (!row.pass_hash.startsWith("argon2id$")) {
      const sql2 = await getSql();
      const next = hashArgon(row.username, pass);
      await sql2`update desk_users set pass_hash = ${next} where id = ${row.id}`;
    }
    return { id: row.id, username: row.username };
  } catch {
    return null;
  }
}

export async function listDeskUsers() {
  const sql = await getSql();
  return sql<{ id: string; username: string; created_at: string }>`
    select id, username, created_at::text as created_at
    from desk_users
    order by created_at asc
  `;
}

export async function createDeskUser(username: string, pass: string) {
  const sql = await getSql();
  const admin = await storedAdminName();
  if (username.toLowerCase() === admin.toLowerCase()) {
    throw new Error("That name is reserved for admin.");
  }
  const existing = await sql<{ n: number }>`select count(*)::int as n from desk_users`;
  if ((existing[0]?.n ?? 0) >= 24) throw new Error("User limit reached (24).");
  const taken = await sql<{ id: string }>`
    select id from desk_users where lower(username) = ${username.toLowerCase()} limit 1
  `;
  if (taken[0]) throw new Error("That username is taken.");
  const id = crypto.randomUUID();
  const hash = hashArgon(username, pass);
  await sql`
    insert into desk_users (id, username, pass_hash, created_at)
    values (${id}, ${username}, ${hash}, now())
  `;
  return { id, username };
}

export async function removeDeskUser(id: string) {
  if (!USER_ID_RE.test(id)) throw new Error("Invalid user.");
  const sql = await getSql();
  await sql`delete from desk_users where id = ${id}`;
}

export async function purgeAuth() {
  const sql = await getSql();
  await sql`delete from "session"`;
  await sql`delete from "verification"`;
  await sql`delete from admin_2fa`;
  await sql`delete from admin_yubi`;
  try {
    await sql`delete from admin_webauthn`;
    await sql`update admin_yubi_gate set panel_lock = false, updated_at = now() where id = 'gate'`;
  } catch {
    /* migrate later */
  }
  await sql`
    update admin_lock
    set token_gen = coalesce(token_gen, 1) + 1, updated_at = now()
    where id = 'default'
  `;
}

export async function enrolled2fa(): Promise<string | null> {
  const row = await enrolledRow();
  return row?.user_id ?? null;
}

export async function enrolledRow(): Promise<{
  user_id: string;
  passwordless: boolean;
  handle: string | null;
} | null> {
  try {
    const sql = await getSql();
    const rows = await sql<{ user_id: string; passwordless: boolean; handle: string | null }>`
      select user_id,
             coalesce(passwordless, false) as passwordless,
             handle
      from admin_2fa where id = 'default' limit 1
    `;
    return rows[0] ?? null;
  } catch {
    return null;
  }
}

export async function enroll2fa(userId: string, handle?: string) {
  const sql = await getSql();
  const label = handle?.slice(0, 64) || null;
  await sql`
    insert into admin_2fa (id, user_id, enrolled_at, passwordless, handle)
    values ('default', ${userId}, now(), false, ${label})
    on conflict (id) do nothing
  `;
}

export async function setXBind(userId: string, handle: string, passwordless: boolean) {
  const sql = await getSql();
  const label = handle.slice(0, 64);
  await sql`
    insert into admin_2fa (id, user_id, enrolled_at, passwordless, handle)
    values ('default', ${userId}, now(), ${passwordless}, ${label})
    on conflict (id) do update set
      user_id = excluded.user_id,
      passwordless = excluded.passwordless,
      handle = excluded.handle,
      enrolled_at = now()
  `;
}

export async function setPasswordless(on: boolean) {
  const sql = await getSql();
  await sql`
    update admin_2fa set passwordless = ${on} where id = 'default'
  `;
}

export async function clear2fa() {
  const sql = await getSql();
  await sql`delete from admin_2fa where id = 'default'`;
}

export async function assert2fa(userId: string): Promise<string | null> {
  const x = await assertAdminX(userId);
  if (x) return x;
  const enrolled = await enrolled2fa();
  if (!enrolled) return "Complete 2FA enrollment: X, then admin password.";
  if (enrolled !== userId) return "This X account is not the bound operator.";
  return null;
}

export async function assertAdminX(userId: string): Promise<string | null> {
  if (await sessionIsAdminX(userId)) return null;
  return "Only the operator X account can access admin. Sign out and Continue with X as that account.";
}

export async function sessionIsAdminX(userId: string): Promise<boolean> {
  if (!userId) return false;
  try {
    const sql = await getSql();
    const accounts = await sql<{ accountId: string; providerId: string; idToken: string | null }>`
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
    const users = await sql<{ name: string | null; email: string | null }>`
      select name, email from "user" where id = ${userId} limit 1
    `;
    const u = users[0];
    if (u && profileLooksLikeAdminX({ name: u.name, email: u.email, preferred_username: u.name })) {
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

function idTokenClaimsAreAdmin(token: string | null | undefined) {
  if (!token || token.split(".").length < 2) return false;
  try {
    const payload = JSON.parse(
      Buffer.from(token.split(".")[1]!, "base64url").toString("utf8"),
    ) as unknown;
    if (profileLooksLikeAdminX(payload)) return true;
    if (payload && typeof payload === "object" && !Array.isArray(payload)) {
      const rec = payload as Record<string, unknown>;
      const fields = [rec.sub, rec.user_id, rec.preferred_username, rec.username, rec.nickname];
      return fields.some((v) => typeof v === "string" && looksLikeAdminX(v));
    }
    return false;
  } catch {
    return false;
  }
}

export function assertNewAdminPass(pass: string, confirm: string, adminName: string): string | null {
  if (pass !== confirm) return "New passwords do not match.";
  if (pass.length < 12) return "New password must be at least 12 characters.";
  if (pass.length > 128) return "New password is too long.";
  if (looksLikeSecret(pass)) return "Secret rejected. Never paste a Coinbase key or wallet seed here.";
  if (pass.toLowerCase() === adminName.toLowerCase()) return "Password cannot match the admin name.";
  return null;
}

export async function issueResetToken(): Promise<string> {
  const sql = await getSql();
  await sql`delete from admin_reset where exp < now() or used_at is not null`;
  await sql`delete from admin_reset where used_at is null`;
  const raw = randomBytes(32).toString("hex");
  const hash = createHash("sha256").update(raw, "utf8").digest("hex");
  await sql`
    insert into admin_reset (token_hash, exp, created_at)
    values (${hash}, now() + interval '30 minutes', now())
  `;
  return raw;
}

export async function consumeResetToken(raw: string): Promise<boolean> {
  const token = raw.trim().toLowerCase();
  if (!/^[0-9a-f]{64}$/.test(token)) return false;
  const hash = createHash("sha256").update(token, "utf8").digest("hex");
  const sql = await getSql();
  const rows = await sql<{ token_hash: string }>`
    select token_hash from admin_reset
    where token_hash = ${hash} and used_at is null and exp > now()
    limit 1
  `;
  if (!rows[0]) return false;
  await sql`update admin_reset set used_at = now() where token_hash = ${hash}`;
  return true;
}
