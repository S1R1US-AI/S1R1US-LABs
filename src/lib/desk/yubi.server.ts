import { randomBytes } from "node:crypto";
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

export async function verifyYubicoOtp(otp: string): Promise<string | null> {
  if (!YUBI_OTP_RE.test(otp)) return "Tap the YubiKey in this field (44-character Yubico OTP).";
  const nonce = randomBytes(16).toString("hex");
  const id = process.env.YUBICO_CLIENT_ID?.trim() || "1";
  const hosts = [
    "https://api.yubico.com/wsapi/2.0/verify",
    "https://api2.yubico.com/wsapi/2.0/verify",
    "https://api3.yubico.com/wsapi/2.0/verify",
    "https://api4.yubico.com/wsapi/2.0/verify",
    "https://api5.yubico.com/wsapi/2.0/verify",
  ];
  const query = `id=${encodeURIComponent(id)}&otp=${encodeURIComponent(otp)}&nonce=${nonce}`;
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
      if (!body.includes(`nonce=${nonce}`)) continue;
      if (/\bstatus=OK\b/.test(body)) return null;
      if (/\bstatus=REPLAYED_OTP\b/.test(body)) replay = true;
      if (/\bstatus=BAD_OTP\b/.test(body)) bad = true;
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
