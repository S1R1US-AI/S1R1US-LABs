import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { getSql } from "@/lib/db";
import { guardedFetch } from "./net-guard";

export const YUBI_OTP_RE = /^[cbdefghijklnrtuv]{44}$/;
export const YUBI_SLOTS = 2;

export type YubiKeyRow = { id: string; public_id: string; last_otp: string | null };

export function yubiPublicId(otp: string) {
  return otp.slice(0, 12);
}

export function maskYubiId(publicId: string) {
  if (publicId.length < 6) return publicId;
  return `${publicId.slice(0, 4)}…${publicId.slice(-2)}`;
}

export async function yubiRows(): Promise<YubiKeyRow[]> {
  try {
    const sql = await getSql();
    return await sql<YubiKeyRow>`
      select id, public_id, last_otp from admin_yubi order by id asc
    `;
  } catch {
    return [];
  }
}

export async function yubiRow(): Promise<YubiKeyRow | null> {
  const rows = await yubiRows();
  return rows[0] ?? null;
}

export async function saveYubi(publicId: string, otp: string): Promise<{ slot: string; created: boolean } | { error: string }> {
  const sql = await getSql();
  const rows = await yubiRows();
  const same = rows.find((r) => r.public_id === publicId);
  if (same) {
    await sql`update admin_yubi set last_otp = ${otp}, enrolled_at = now() where public_id = ${publicId}`;
    return { slot: same.id, created: false };
  }
  if (rows.length >= YUBI_SLOTS) {
    return { error: `Both YubiKey slots are full (${YUBI_SLOTS}). Remove one before adding another.` };
  }
  const used = new Set(rows.map((r) => r.id));
  const slot = used.has("1") ? "2" : "1";
  await sql`
    insert into admin_yubi (id, public_id, last_otp, enrolled_at)
    values (${slot}, ${publicId}, ${otp}, now())
    on conflict (id) do update set
      public_id = excluded.public_id,
      last_otp = excluded.last_otp,
      enrolled_at = now()
  `;
  return { slot, created: true };
}

export async function touchYubi(publicId: string, otp: string) {
  const sql = await getSql();
  await sql`update admin_yubi set last_otp = ${otp} where public_id = ${publicId}`;
}

export async function consumeYubiOtp(otp: string): Promise<string | null> {
  const tap = otp.trim().toLowerCase();
  const cloud = await verifyYubicoOtp(tap);
  if (cloud) return cloud;
  const rows = await yubiRows();
  if (!rows.length) return "Enroll two admin YubiKeys in Admin before approving outgoing BTC or USDC.";
  const pid = yubiPublicId(tap);
  const row = rows.find((r) => r.public_id === pid);
  if (!row) return "That YubiKey is not one of the two enrolled admin keys.";
  if (row.last_otp && row.last_otp === tap) return "That YubiKey OTP was already used. Tap again.";
  try {
    await touchYubi(pid, tap);
  } catch {
    return "Could not record YubiKey tap.";
  }
  return null;
}

export async function clearYubi(publicId?: string) {
  const sql = await getSql();
  if (publicId) {
    await sql`delete from admin_yubi where public_id = ${publicId}`;
    return;
  }
  await sql`delete from admin_yubi`;
}

/** Yubico OTP Validation Protocol 2.0 HMAC-SHA1. Official: developers.yubico.com/OTP/Specifications/OTP_validation_protocol.html */
export function yubiCloudHmac(params: Record<string, string>, secretB64: string) {
  const line = Object.keys(params)
    .filter((k) => k !== "h")
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join("&");
  return createHmac("sha1", Buffer.from(secretB64, "base64")).update(line).digest("base64");
}

function parseYubiKv(body: string) {
  const out: Record<string, string> = {};
  for (const line of body.split(/\r?\n/)) {
    const i = line.indexOf("=");
    if (i < 1) continue;
    out[line.slice(0, i)] = line.slice(i + 1);
  }
  return out;
}

function yubiHmacOk(kv: Record<string, string>, secretB64: string) {
  const got = kv.h;
  if (!got) return false;
  const expect = yubiCloudHmac(kv, secretB64);
  const a = Buffer.from(got);
  const b = Buffer.from(expect);
  if (a.length !== b.length) return false;
  try {
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export async function verifyYubicoOtp(otp: string): Promise<string | null> {
  if (!YUBI_OTP_RE.test(otp)) return "Tap the YubiKey in this field (44-character Yubico OTP).";
  const nonce = randomBytes(16).toString("hex");
  const id = process.env.YUBICO_CLIENT_ID?.trim() || "1";
  const secret = process.env.YUBICO_API_SECRET?.trim() || "";
  const params: Record<string, string> = { id, nonce, otp, timeout: "8" };
  if (secret) params.h = yubiCloudHmac(params, secret);
  const query = Object.entries(params)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join("&");
  const hosts = [
    "https://api.yubico.com/wsapi/2.0/verify",
    "https://api2.yubico.com/wsapi/2.0/verify",
    "https://api3.yubico.com/wsapi/2.0/verify",
    "https://api4.yubico.com/wsapi/2.0/verify",
    "https://api5.yubico.com/wsapi/2.0/verify",
  ];
  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort(), 8000);
  try {
    const settled = await Promise.allSettled(
      hosts.map((url) => guardedFetch(`${url}?${query}`, { signal: ac.signal })),
    );
    let replay = false;
    let bad = false;
    for (const item of settled) {
      if (item.status !== "fulfilled" || !item.value.ok) continue;
      const body = await item.value.text();
      const kv = parseYubiKv(body);
      if (kv.nonce !== nonce) continue;
      if (secret && !yubiHmacOk(kv, secret)) continue;
      if (kv.status === "OK") return null;
      if (kv.status === "REPLAYED_OTP") replay = true;
      if (kv.status === "BAD_OTP") bad = true;
    }
    if (replay) return "That YubiKey OTP was already used. Tap again.";
    if (bad) return "YubiCloud rejected that OTP.";
    return "YubiCloud could not verify that tap. Try again.";
  } catch {
    return "YubiCloud is unreachable. Try the tap again.";
  } finally {
    clearTimeout(timer);
  }
}
