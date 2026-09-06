/** Server-only tenants for the iOS / Google copy-admin. Not system admin. */

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { looksLikeAdminX, looksLikeCompanyX } from "./x-admin.ts";
import { inspectAgentInput } from "./agent-security.ts";
import { APP_ADMIN_KINDS, APP_ADMIN_PATH, isAppAdminKind, type AppAdminKind } from "./tenancy.ts";

export type AppAdminRow = {
  id: string;
  at: string;
  kind: AppAdminKind;
  handle: string;
  label: string;
};

type Store = { rows: AppAdminRow[] };

const PATHS = ["/tmp/app-admins.json", "/workspace/data/app-admins.json"];
const MAX = 400;
const TTL_MS = 12 * 60 * 60 * 1000;
const PEPPER = "s1r1us-app-admin-v1";

function load(): Store {
  if (typeof window !== "undefined") return { rows: [] };
  for (const p of PATHS) {
    try {
      const raw = JSON.parse(readFileSync(p, "utf8")) as Store;
      if (Array.isArray(raw?.rows)) return { rows: raw.rows.slice(0, MAX) };
    } catch {
      /* missing */
    }
  }
  return { rows: [] };
}

function save(s: Store) {
  if (typeof window !== "undefined") return;
  const body = JSON.stringify(s);
  for (const p of PATHS) {
    try {
      if (p.startsWith("/workspace/data")) mkdirSync("/workspace/data", { recursive: true });
      writeFileSync(p, body);
    } catch {
      /* preview */
    }
  }
}

function cleanHandle(raw: string) {
  return String(raw ?? "")
    .trim()
    .replace(/^@/, "")
    .slice(0, 32);
}

function sign(payload: string) {
  return createHmac("sha256", PEPPER).update(payload).digest("hex");
}

export function signAppAdminToken(id: string) {
  const exp = Date.now() + TTL_MS;
  const sig = sign(`app-admin.${exp}.${id}`);
  return `app.${exp}.${id}.${sig}`;
}

export function verifyAppAdminToken(token: string | undefined): { id: string } | null {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 4 || parts[0] !== "app") return null;
  const exp = Number(parts[1]);
  const id = parts[2] ?? "";
  const sig = parts[3] ?? "";
  if (!Number.isFinite(exp) || Date.now() > exp || !id.startsWith("aa-")) return null;
  const expect = sign(`app-admin.${exp}.${id}`);
  try {
    if (!timingSafeEqual(Buffer.from(sig, "hex"), Buffer.from(expect, "hex"))) return null;
  } catch {
    return null;
  }
  const row = load().rows.find((r) => r.id === id);
  return row ? { id: row.id } : null;
}

export function peekAppAdmin(id: string) {
  return load().rows.find((r) => r.id === id) ?? null;
}

export function claimAppAdmin(input: {
  kind?: string;
  handle?: string;
  label?: string;
  mandate?: boolean;
  xHandle?: string | null;
}): { ok: true; token: string; you: AppAdminRow } | { ok: false; error: string } {
  if (input.mandate !== true) {
    return { ok: false, error: "Read the mandate first. POST mandate:true. Accumulate bitcoin. Never sell. Never short." };
  }
  const kindRaw = String(input.kind ?? "iphone").toLowerCase();
  if (!isAppAdminKind(kindRaw)) {
    return { ok: false, error: `kind must be one of ${APP_ADMIN_KINDS.join(", ")}.` };
  }
  const handle = cleanHandle(input.handle || input.xHandle || "");
  if (handle.length < 2) return { ok: false, error: "Need a short name or handle for this copy." };
  if (looksLikeAdminX(handle) || looksLikeCompanyX(handle)) {
    return { ok: false, error: "System admin and company X use /admin. This copy is for the iOS / Google download user." };
  }
  if (inspectAgentInput(handle).block || inspectAgentInput(String(input.label ?? "")).block) {
    return { ok: false, error: "blocked" };
  }
  const s = load();
  const existing = s.rows.find((r) => r.kind === kindRaw && r.handle.toLowerCase() === handle.toLowerCase());
  if (existing) {
    return { ok: true, token: signAppAdminToken(existing.id), you: existing };
  }
  const row: AppAdminRow = {
    id: `aa-${Date.now().toString(36)}-${randomBytes(4).toString("hex")}`,
    at: new Date().toISOString(),
    kind: kindRaw,
    handle,
    label: String(input.label ?? handle).trim().slice(0, 40) || handle,
  };
  s.rows = [row, ...s.rows].slice(0, MAX);
  save(s);
  return { ok: true, token: signAppAdminToken(row.id), you: row };
}

export const APP_ADMIN_PUBLIC = {
  path: APP_ADMIN_PATH,
  trade: false as const,
  ordersCreate: false as const,
  hostAdmin: false as const,
  note: "This token opens the download-copy Admin only. It cannot open s1r1us.ai /admin, Yubi, vault, hunter, or live Coinbase.",
};
