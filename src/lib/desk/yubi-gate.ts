/** YubiKey is optional. Name+password unlocks system admin. */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { getSql } from "@/lib/db";
import { webauthnCount } from "./webauthn.server";
import { yubiRows } from "./yubi.server";

const PATHS = ["/tmp/admin-yubi-gate.json", "/workspace/data/admin-yubi-gate.json"];

type Gate = { panelLock: boolean; updatedAt: string | null };

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
  return false;
}

/** Login must not block on Yubi. Enrollment stays available. */
export async function adminPanelYubiLock(): Promise<boolean> {
  return false;
}

export async function setAdminPanelYubiLock(
  on: boolean,
): Promise<{ ok: true; panelLock: boolean; keyCount: number; yubicoRecommendTwo: boolean } | { ok: false; error: string }> {
  const otp = await yubiRows();
  const fido = await webauthnCount();
  const keyCount = otp.length + fido;
  const next: Gate = { panelLock: false, updatedAt: new Date().toISOString() };
  writeFileGate(next);
  try {
    const sql = await getSql();
    await sql`
      insert into admin_yubi_gate (id, panel_lock, updated_at)
      values ('gate', false, now())
      on conflict (id) do update set panel_lock = false, updated_at = now()
    `;
  } catch {
    /* file is source in preview */
  }
  return { ok: true, panelLock: false, keyCount, yubicoRecommendTwo: keyCount < 2 };
}

export async function adminHasPhysicalKey() {
  const otp = (await yubiRows()).length;
  const fido = await webauthnCount();
  return otp + fido > 0;
}
