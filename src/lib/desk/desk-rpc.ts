import { createServerFn } from "@tanstack/react-start";

export const fetchDesk = createServerFn({ method: "GET" })
  .validator((input: { force?: boolean } | undefined) => input ?? {})
  .handler(async ({ data }) => {
    const { loadSnapshot } = await import("./sources");
    const { isTapeFrozen } = await import("./tape-persist");
    const force = Boolean(data?.force) && !isTapeFrozen();
    return Promise.race([
      loadSnapshot(force),
      new Promise<Awaited<ReturnType<typeof loadSnapshot>>>((_, reject) => {
        setTimeout(() => reject(new Error("rpc deadline")), 2_600);
      }),
    ]).catch(() => loadSnapshot(false));
  });

export const fetchTapeMeta = createServerFn({ method: "GET" }).handler(async () => {
  const { lastGoodMeta } = await import("./tape-persist");
  return lastGoodMeta();
});

export const setTapeFreeze = createServerFn({ method: "POST" })
  .validator((input: { token: string; frozen: boolean }) => input)
  .handler(async ({ data }) => {
    const { verifyAccessToken } = await import("./access.server");
    const { setTapeFrozen, lastGoodMeta } = await import("./tape-persist");
    if (!(await verifyAccessToken(data.token))) {
      return { ok: false as const, error: "Admin session required", ...lastGoodMeta() };
    }
    setTapeFrozen(data.frozen);
    return { ok: true as const, ...lastGoodMeta() };
  });

export const rebuildDesk = createServerFn({ method: "POST" })
  .validator((input: { token: string }) => input)
  .handler(async ({ data }) => {
    const { verifyAccessToken } = await import("./access.server");
    const { loadSnapshot } = await import("./sources");
    const { isTapeFrozen } = await import("./tape-persist");
    if (!(await verifyAccessToken(data.token)) || isTapeFrozen()) {
      return loadSnapshot(false);
    }
    return loadSnapshot(true);
  });

export const fetchDeskErrors = createServerFn({ method: "GET" }).handler(async () => {
  const { listDeskErrors, recordDeskFails } = await import("./error-log");
  const fs = await import("node:fs");
  for (const p of ["/tmp/desk-errors.json", "/tmp/desk-cycle.json", "/workspace/artifacts/desk-cycle.json"]) {
    try {
      const raw = fs.readFileSync(p, "utf8");
      const j = JSON.parse(raw) as { rows?: { msg: string; at?: string }[]; stats?: { fails?: string[] } };
      if (Array.isArray(j.rows) && j.rows.length) recordDeskFails(j.rows.map((r) => r.msg), j.rows[0]?.at);
      if (j.stats?.fails?.length) recordDeskFails(j.stats.fails);
    } catch {
      /* missing */
    }
  }
  return listDeskErrors();
});

export const fetchAgentFlags = createServerFn({ method: "GET" }).handler(async () => {
  const { peekAgentFlags } = await import("./agent-ping");
  return peekAgentFlags();
});

export const fetchMorningLib = createServerFn({ method: "POST" })
  .validator((input: { token: string }) => input)
  .handler(async ({ data }) => {
    const { verifyAccessToken } = await import("./access.server");
    if (!(await verifyAccessToken(data.token))) return { ok: false as const, paused: true, pausedAt: null, reports: [] };
    const { getMorningLib } = await import("./morning-lib.server");
    const lib = await getMorningLib();
    return { ok: true as const, ...lib };
  });

export const setMorningReportPaused = createServerFn({ method: "POST" })
  .validator((input: { token: string; paused: boolean }) => input)
  .handler(async ({ data }) => {
    const { verifyAccessToken } = await import("./access.server");
    if (!(await verifyAccessToken(data.token))) return { ok: false as const, paused: true, pausedAt: null, reports: [] };
    const { setMorningPaused } = await import("./morning-lib.server");
    const lib = await setMorningPaused(data.paused);
    return { ok: true as const, ...lib };
  });

export const postPracticePulse = createServerFn({ method: "POST" })
  .validator((input: {
    at: string;
    paused: boolean;
    day: number;
    bot7: { fills: number; ticks: number; cash: number; btc: number; last: string };
    gm: { fills: number; ticks: number; cash: number; btc: number; last: string };
  }) => input)
  .handler(async ({ data }) => {
    const { writePulse } = await import("./practice-pulse");
    await writePulse(data);
    return { ok: true as const };
  });

export const fetchPracticePulse = createServerFn({ method: "GET" }).handler(async () => {
  const { loadPulse } = await import("./practice-pulse");
  return loadPulse();
});

export const fetchAuto24h = createServerFn({ method: "GET" }).handler(async () => {
  const { readAuto24h } = await import("./auto-24h.server");
  return readAuto24h();
});
