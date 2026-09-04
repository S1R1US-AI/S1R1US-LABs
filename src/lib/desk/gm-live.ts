import { createServerFn } from "@tanstack/react-start";

const FILE = "data/gm-live.json";

type GmLiveFile = { liveUnlocked: boolean; at: string | null };

async function readLive(): Promise<GmLiveFile> {
  try {
    const { readFile } = await import("node:fs/promises");
    const raw = await readFile(FILE, "utf8");
    const j = JSON.parse(raw) as GmLiveFile;
    return { liveUnlocked: Boolean(j.liveUnlocked), at: j.at ?? null };
  } catch {
    return { liveUnlocked: false, at: null };
  }
}

async function writeLive(next: GmLiveFile) {
  const { mkdir, writeFile } = await import("node:fs/promises");
  const { dirname } = await import("node:path");
  await mkdir(dirname(FILE), { recursive: true });
  await writeFile(FILE, JSON.stringify(next, null, 2) + "\n", "utf8");
  return next;
}

export const getGmLive = createServerFn({ method: "GET" }).handler(async () => readLive());

export const setGmLive = createServerFn({ method: "POST" })
  .validator((input: { token: string; liveUnlocked: boolean }) => input)
  .handler(async ({ data }) => {
    const { verifyAccessToken } = await import("./access.server");
    if (!(await verifyAccessToken(data.token))) {
      return { ok: false as const, error: "Admin session required.", liveUnlocked: false, at: null };
    }
    const next = await writeLive({
      liveUnlocked: Boolean(data.liveUnlocked),
      at: new Date().toISOString(),
    });
    return { ok: true as const, ...next };
  });
