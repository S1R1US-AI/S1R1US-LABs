import { access, copyFile, mkdir, readFile, readdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { MORNING_KEEP, MORNING_TITLE } from "./morning-lib";

const ROOT = process.cwd();
const INDEX = path.join(ROOT, "data", "morning-lib.json");
const PUBLIC_LIB = path.join(ROOT, "public", "morning-lib");
const LIVE_PDF = path.join(ROOT, "public", "S1R1US-Morning-Report.pdf");

export type MorningReport = {
  id: string;
  at: string;
  title: string;
  pages: number;
  pdf: string;
  thumbs: string[];
};

export type MorningLib = {
  paused: boolean;
  pausedAt: string | null;
  reports: MorningReport[];
};

const empty: MorningLib = { paused: false, pausedAt: null, reports: [] };

export function etDay(d = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
}

async function exists(p: string) {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

async function readLib(): Promise<MorningLib> {
  try {
    const raw = await readFile(INDEX, "utf8");
    const j = JSON.parse(raw) as MorningLib;
    return {
      paused: Boolean(j.paused),
      pausedAt: j.pausedAt ?? null,
      reports: Array.isArray(j.reports) ? j.reports : [],
    };
  } catch {
    return { ...empty, reports: [] };
  }
}

async function writeLib(lib: MorningLib) {
  await mkdir(path.dirname(INDEX), { recursive: true });
  await mkdir(PUBLIC_LIB, { recursive: true });
  const next: MorningLib = {
    paused: lib.paused,
    pausedAt: lib.pausedAt,
    reports: lib.reports.slice(0, MORNING_KEEP),
  };
  await writeFile(INDEX, JSON.stringify(next, null, 2) + "\n", "utf8");
  return next;
}

async function thumbsFor(id: string, files: string[]) {
  return files
    .filter((f) => new RegExp(`^${id}-\\d+\\.jpg$`).test(f))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
    .map((f) => `/morning-lib/${f}`);
}

async function archiveLive(id: string, at?: string): Promise<MorningReport | null> {
  await mkdir(PUBLIC_LIB, { recursive: true });
  if (!(await exists(LIVE_PDF))) return null;
  const destPdf = path.join(PUBLIC_LIB, `${id}.pdf`);
  if (!(await exists(destPdf))) await copyFile(LIVE_PDF, destPdf);
  const thumbs: string[] = [];
  for (let n = 1; n <= 8; n++) {
    const src = path.join(ROOT, "public", `morning-report-${n}.jpg`);
    if (!(await exists(src))) break;
    const dest = path.join(PUBLIC_LIB, `${id}-${n}.jpg`);
    if (!(await exists(dest))) await copyFile(src, dest);
    thumbs.push(`/morning-lib/${id}-${n}.jpg`);
  }
  return {
    id,
    at: at ?? new Date().toISOString(),
    title: MORNING_TITLE,
    pages: thumbs.length || 1,
    pdf: `/morning-lib/${id}.pdf`,
    thumbs,
  };
}

async function hydrate(): Promise<MorningLib> {
  const lib = await readLib();
  const byId = new Map(lib.reports.map((r) => [r.id, r]));
  let files: string[] = [];
  try {
    files = await readdir(PUBLIC_LIB);
  } catch {
    files = [];
  }
  for (const f of files) {
    const m = f.match(/^(\d{4}-\d{2}-\d{2})\.pdf$/);
    if (!m) continue;
    const id = m[1];
    const thumbs = await thumbsFor(id, files);
    const prev = byId.get(id);
    byId.set(id, {
      id,
      at: prev?.at ?? `${id}T12:00:00-04:00`,
      title: prev?.title ?? MORNING_TITLE,
      pages: thumbs.length || prev?.pages || 1,
      pdf: `/morning-lib/${id}.pdf`,
      thumbs: thumbs.length ? thumbs : prev?.thumbs ?? [],
    });
  }

  const today = etDay();
  if (!lib.paused && !byId.has(today)) {
    const rec = await archiveLive(today);
    if (rec) byId.set(today, rec);
  }

  for (const r of [...byId.values()]) {
    const pdfPath = path.join(PUBLIC_LIB, `${r.id}.pdf`);
    if (await exists(pdfPath)) continue;
    const rec = await archiveLive(r.id, r.at);
    if (rec) byId.set(r.id, { ...r, ...rec, at: r.at, title: r.title });
  }

  const reports = [...byId.values()].sort((a, b) => b.id.localeCompare(a.id)).slice(0, MORNING_KEEP);
  return writeLib({ ...lib, reports });
}

export async function getMorningLib() {
  return hydrate();
}

export async function readMorningPdf(id: string): Promise<Buffer | null> {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(id)) return null;
  await hydrate();
  const p = path.join(PUBLIC_LIB, `${id}.pdf`);
  try {
    return await readFile(p);
  } catch {
    return null;
  }
}

export async function setMorningPaused(paused: boolean) {
  const lib = await hydrate();
  lib.paused = paused;
  lib.pausedAt = paused ? new Date().toISOString() : null;
  return writeLib(lib);
}

export async function pruneMorningLib() {
  const lib = await hydrate();
  const keep = new Set(
    lib.reports.flatMap((r) => [r.id, ...r.thumbs.map((t) => path.basename(t)), path.basename(r.pdf)]),
  );
  try {
    const files = await readdir(PUBLIC_LIB);
    for (const f of files) {
      if (f === "." || f === "..") continue;
      const id = f.replace(/-(\d+)\.jpg$/, "").replace(/\.pdf$/, "");
      const wanted = keep.has(f) || lib.reports.some((r) => r.id === id);
      if (!wanted) await unlink(path.join(PUBLIC_LIB, f)).catch(() => undefined);
    }
  } catch {
    /* none */
  }
  return lib;
}
