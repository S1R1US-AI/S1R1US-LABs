import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import {
  PHONE_REQUESTABLE,
  type LockChangeRequest,
  type PhoneRequestId,
} from "./lock-request.ts";

const PATHS = ["/tmp/lock-requests.json", "/workspace/data/lock-requests.json"];

function load(): LockChangeRequest[] {
  for (const p of PATHS) {
    try {
      const raw = JSON.parse(readFileSync(p, "utf8")) as LockChangeRequest[];
      if (Array.isArray(raw)) return raw;
    } catch {
      /* missing */
    }
  }
  return [];
}

function save(rows: LockChangeRequest[]) {
  const body = JSON.stringify(rows.slice(-80));
  for (const p of PATHS) {
    try {
      if (p.startsWith("/workspace/data")) mkdirSync("/workspace/data", { recursive: true });
      writeFileSync(p, body);
    } catch {
      /* preview */
    }
  }
}

export function listLockRequests() {
  return load();
}

export function addLockRequest(input: { ids: string[]; want: "lock" | "unlock"; note?: string }) {
  const ids = input.ids.filter((id): id is PhoneRequestId =>
    (PHONE_REQUESTABLE as readonly string[]).includes(id),
  );
  if (!ids.length) return { ok: false as const, error: "No requestable rails selected", rows: load() };
  const row: LockChangeRequest = {
    id: `req-${Date.now()}`,
    at: new Date().toISOString(),
    by: "app-admin",
    ids,
    want: input.want === "unlock" ? "unlock" : "lock",
    note: (input.note ?? "").slice(0, 280),
    status: "open",
  };
  const rows = [...load(), row];
  save(rows);
  return { ok: true as const, error: null as string | null, rows };
}
