/** Tiny GM B0aRd avatars. Server-only. No remote URLs. No SVG (XSS). */

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const PATHS = ["/tmp/gm-board-pics.json", "/workspace/data/gm-board-pics.json"];
const MAX_BYTES = 10_240;
const ID_OK = /^ag_[a-z0-9_]+$/i;

type Mime = "image/png" | "image/jpeg" | "image/webp";
type Pic = { mime: Mime; b64: string };
type Store = Record<string, Pic>;

function load(): Store {
  if (typeof window !== "undefined") return {};
  for (const p of PATHS) {
    try {
      const raw = JSON.parse(readFileSync(p, "utf8")) as Store;
      if (raw && typeof raw === "object") return raw;
    } catch {
      /* missing */
    }
  }
  return {};
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

function magic(buf: Buffer): Mime | null {
  if (buf.length >= 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "image/jpeg";
  if (buf.length >= 8 && buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) return "image/png";
  if (
    buf.length >= 12 &&
    buf[0] === 0x52 &&
    buf[1] === 0x49 &&
    buf[2] === 0x46 &&
    buf[3] === 0x46 &&
    buf[8] === 0x57 &&
    buf[9] === 0x45 &&
    buf[10] === 0x42 &&
    buf[11] === 0x50
  ) {
    return "image/webp";
  }
  return null;
}

export function hasBoardPic(id: string) {
  if (!ID_OK.test(id)) return false;
  return Boolean(load()[id]);
}

export function readBoardPic(id: string): { mime: Mime; bytes: Buffer } | null {
  if (!ID_OK.test(id)) return null;
  const p = load()[id];
  if (!p?.b64) return null;
  try {
    const bytes = Buffer.from(p.b64, "base64");
    if (bytes.length < 32 || bytes.length > MAX_BYTES) return null;
    const m = magic(bytes);
    if (!m) return null;
    return { mime: m, bytes };
  } catch {
    return null;
  }
}

export function saveBoardPic(id: string, raw: string): { ok: true } | { ok: false; error: string } {
  if (!ID_OK.test(id)) return { ok: false, error: "Bad id." };
  const m = String(raw ?? "").trim();
  if (/^https?:\/\//i.test(m) || m.includes("://") && !m.startsWith("data:")) {
    return { ok: false, error: "No remote URLs. Paste a small data URL or upload a file." };
  }
  const hit = m.match(/^data:(image\/(?:png|jpeg|jpg|webp));base64,([A-Za-z0-9+/]+=*)$/i);
  if (!hit) return { ok: false, error: "Need a small PNG, JPEG, or WebP. No SVG. No GIF." };
  let bytes: Buffer;
  try {
    bytes = Buffer.from(hit[2], "base64");
  } catch {
    return { ok: false, error: "Bad image." };
  }
  if (bytes.length < 32 || bytes.length > MAX_BYTES) return { ok: false, error: "Pic must be 32 bytes–10 KB." };
  const mag = magic(bytes);
  if (!mag) return { ok: false, error: "Not a real PNG/JPEG/WebP." };
  const s = load();
  s[id] = { mime: mag, b64: bytes.toString("base64") };
  save(s);
  return { ok: true };
}
