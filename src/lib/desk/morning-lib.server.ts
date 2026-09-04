import { mkdir, readFile, readdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

export const MORNING_KEEP = 10;
const ROOT = process.cwd();
const INDEX = path.join(ROOT, "data", "morning-lib.json");
const PUBLIC_LIB = path.join(ROOT, "public", "morning-lib");

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

async function readLib(): Promise<MorningLib> {
  try {
    const raw = await readFile(INDEX, "utf8");
    const j = JSON.parse(raw) as MorningLib;
    return {
      paused: Boolean(j.paused),
      pausedAt: j.pausedAt ?? null,
      reports: Array.isArray(j.reports) ? j.reports.slice(0, MORNING_KEEP) : [],
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

export async function getMorningLib() {
  return readLib();
}

export async function setMorningPaused(paused: boolean) {
  const lib = await readLib();
  lib.paused = paused;
  lib.pausedAt = paused ? new Date().toISOString() : null;
  return writeLib(lib);
}

export async function pruneMorningLib() {
  const lib = await readLib();
  const keep = new Set(lib.reports.flatMap((r) => [r.id, ...r.thumbs.map((t) => path.basename(t)), path.basename(r.pdf)]));
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
