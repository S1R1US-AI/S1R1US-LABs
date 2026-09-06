/** Optional admin-panel lock behind a physical YubiKey. Server-only. */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { getSql } from "@/lib/db";
import { webauthnCount } from "./webauthn.server";
import { yubiRows } from "./yubi.server";

const PATHS = ["/tmp/admin-yubi-gate.json", "/workspace/data/admin-yubi-gate.json"];

type Gate = { panelLock: boolean; updatedAt: string | null };

const OFF: Gate = { panelLock: false, updatedAt: null };

function readFileGate(): Gate | null {
  for (const p of PATHS) {
    try {
      const raw = JSON.parse(readFileSync(p, "utf8")) as Gate;
      if (typeof raw?.panelLock === "boolean") return { panelLock: raw.panelLock, updatedAt: raw.updatedAt ?? null };
    } catch {
      /* missing */
    }
  }
  return null;
}

function writeFileGate(g: Gate) {
  const body = JSON.stringify(g);
  for (const p of PATHS) {
    try {
      if (p.startsWith("/workspace/data")) mkdirSync("/workspace/data", { recursive: true });
      writeFileSync(p, body);
    } catch {
      /* preview */
    }
  }
}

export function peekYubiPanelLock(): boolean {
  return readFileGate()?.panelLock ?? false;
}

export async function adminPanelYubiLock(): Promise<boolean> {
  try {
    const sql = await getSql();
    const rows = await sql<{ panel_lock: boolean }>`select panel_lock from admin_yubi_gate where id = 'gate' limit 1`;
    if (rows[0]) return Boolean(rows[0].panel_lock);
  } catch {
    /* migrate later */
  }
  return readFileGate()?.panelLock ?? false;
}

export async function setAdminPanelYubiLock(
  on: boolean,
): Promise<{ ok: true; panelLock: boolean; keyCount: number; yubicoRecommendTwo: boolean } | { ok: false; error: string }> {
  const otp = await yubiRows();
  const fido = await webauthnCount();
  const keyCount = otp.length + fido;
  if (on && keyCount < 1) {
    return { ok: false, error: "Enroll a YubiKey (Yubico OTP or FIDO2) before locking the admin panel." };
  }
  const next: Gate = { panelLock: on, updatedAt: new Date().toISOString() };
  writeFileGate(next);
  try {
    const sql = await getSql();
    await sql`
      insert into admin_yubi_gate (id, panel_lock, updated_at)
      values ('gate', ${on}, now())
      on conflict (id) do update set panel_lock = excluded.panel_lock, updated_at = now()
    `;
  } catch {
    /* file is source in preview */
  }
  return { ok: true, panelLock: on, keyCount, yubicoRecommendTwo: keyCount < 2 };
}

export async function adminHasPhysicalKey() {
  const otp = (await yubiRows()).length;
  const fido = await webauthnCount();
  return otp + fido > 0;
}
