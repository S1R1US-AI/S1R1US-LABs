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
    try {
      const { stampGoLiveNotice } = await import("./go-live-notices");
      if (data.frozen) {
        stampGoLiveNotice(
          "PAUSED",
          "Data pulls paused — under maintenance",
          "The tape is the last validated snapshot. Do not place Coinbase orders from it. Poll GET /api/agent/ping. You will be invited when pulls resume.",
        );
      } else {
        const now = new Date().toISOString();
        const { stampInvites } = await import("./agent-waitlist");
        const n = stampInvites(now);
        const { noteInviteBatch } = await import("./agent-gate");
        noteInviteBatch(n, now);
        stampGoLiveNotice(
          "RESUMED",
          "Data pulls resumed",
          "The 5-minute tape clock is back. Waitlisted bots: this is your go-live notice. Resume GET /api/agent/call every 300s. Do not treat this as live Coinbase unlock.",
        );
      }
    } catch {
      /* preview */
    }
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

export const fetchIntrusions = createServerFn({ method: "POST" })
  .validator((input: { token: string }) => input)
  .handler(async ({ data }) => {
    const { verifyAccessToken } = await import("./access.server");
    if (!(await verifyAccessToken(data.token))) return { ok: false as const, rows: [], summary: { total: 0, last24h: 0, byKind: {}, lastAt: null } };
    const { listIntrusions, intrusionSummary, ingestPersisted } = await import("./intrusion-log");
    try {
      const fs = await import("node:fs");
      ingestPersisted(JSON.parse(fs.readFileSync("/tmp/desk-intrusions.json", "utf8")));
    } catch {
      /* missing */
    }
    return { ok: true as const, rows: listIntrusions(), summary: intrusionSummary() };
  });

export const runHunterAudit = createServerFn({ method: "POST" })
  .validator((input: { token: string }) => input)
  .handler(async ({ data }) => {
    const { verifyAccessToken } = await import("./access.server");
    if (!(await verifyAccessToken(data.token))) return { ok: false as const, report: null };
    const { hydrateSecurityDisk } = await import("./posture");
    hydrateSecurityDisk();
    const { runHunter } = await import("./hunter");
    return { ok: true as const, report: runHunter() };
  });

export const fetchSecurityPosture = createServerFn({ method: "POST" })
  .validator((input: { token: string; refreshIntel?: boolean }) => input)
  .handler(async ({ data }) => {
    const { verifyAccessToken } = await import("./access.server");
    if (!(await verifyAccessToken(data.token))) return { ok: false as const, posture: null };
    const { securityPosture } = await import("./posture");
    return { ok: true as const, posture: await securityPosture({ refreshIntel: Boolean(data.refreshIntel) }) };
  });

export const fetchSecurityBrief = createServerFn({ method: "POST" })
  .validator((input: { token: string }) => input)
  .handler(async ({ data }) => {
    const { verifyAccessToken } = await import("./access.server");
    if (!(await verifyAccessToken(data.token))) return { ok: false as const, brief: null, badBots: null, health: null };
    try {
      const fs = await import("node:fs");
      const { ingestPersisted } = await import("./intrusion-log");
      ingestPersisted(JSON.parse(fs.readFileSync("/tmp/desk-intrusions.json", "utf8")));
    } catch {
      /* missing */
    }
    const { morningSecurity, morningBadBots } = await import("./morning-ops");
    const { systemHealth } = await import("./system-health");
    const { listAgentBars } = await import("./agent-bar");
    const { badBotIntrusions } = await import("./intrusion-log");
    const bars = listAgentBars();
    const probes = badBotIntrusions(24).map((r) => ({
      at: r.at,
      kind: r.kind,
      detail: r.detail,
      ip: r.ip,
    }));
    return {
      ok: true as const,
      brief: morningSecurity(),
      health: systemHealth(),
      badBots: morningBadBots({
        barred: bars.rows.map((r) => ({
          id: r.id,
          at: r.at,
          name: r.name,
          handle: r.handle,
          kind: r.kind,
          ip: r.ip,
          reason: r.reason,
        })),
        probes,
      }),
    };
  });

export const fetchAgentFlags = createServerFn({ method: "GET" }).handler(async () => {
  const { peekAgentFlags } = await import("./agent-ping");
  const { agentGatePublic, peekAgentGate } = await import("./agent-gate");
  const flags = peekAgentFlags();
  const gate = peekAgentGate();
  return { ...flags, gate: agentGatePublic(), communication: gate.externalAgents ? ("OPEN" as const) : ("MAINTENANCE" as const) };
});

export const fetchAgentGate = createServerFn({ method: "POST" })
  .validator((input: { token: string }) => input)
  .handler(async ({ data }) => {
    const { verifyAccessToken } = await import("./access.server");
    if (!(await verifyAccessToken(data.token))) {
      return { ok: false as const, error: "Admin session required", gate: null, waitlist: { count: 0, invited: 0, rows: [] }, bars: { count: 0, rows: [] } };
    }
    const { peekAgentGate, agentGatePublic } = await import("./agent-gate");
    const { waitlistAdmin } = await import("./agent-waitlist");
    const { listAgentBars } = await import("./agent-bar");
    return {
      ok: true as const,
      error: null as string | null,
      gate: { ...peekAgentGate(), public: agentGatePublic() },
      waitlist: waitlistAdmin(),
      bars: listAgentBars(),
    };
  });

export const setAgentGate = createServerFn({ method: "POST" })
  .validator((input: { token: string; open: boolean }) => input)
  .handler(async ({ data }) => {
    const { verifyAccessToken } = await import("./access.server");
    if (!(await verifyAccessToken(data.token))) {
      return { ok: false as const, error: "Admin session required", gate: null, waitlist: { count: 0, invited: 0, rows: [] }, bars: { count: 0, rows: [] } };
    }
    const { setAgentComm, peekAgentGate, agentGatePublic } = await import("./agent-gate");
    const { waitlistAdmin } = await import("./agent-waitlist");
    const { listAgentBars } = await import("./agent-bar");
    setAgentComm(data.open);
    return {
      ok: true as const,
      error: null as string | null,
      gate: { ...peekAgentGate(), public: agentGatePublic() },
      waitlist: waitlistAdmin(),
      bars: listAgentBars(),
    };
  });

export const unbarAgent = createServerFn({ method: "POST" })
  .validator((input: { token: string; id: string }) => input)
  .handler(async ({ data }) => {
    const { verifyAccessToken } = await import("./access.server");
    if (!(await verifyAccessToken(data.token))) {
      return { ok: false as const, error: "Admin session required", bars: { count: 0, rows: [] } };
    }
    const { unbarAgent: drop } = await import("./agent-bar");
    return { ok: true as const, error: null as string | null, bars: drop(data.id) };
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

export const fetchGmBoard = createServerFn({ method: "POST" })
  .validator((input: { token: string }) => input)
  .handler(async ({ data }) => {
    const { verifyAccessToken } = await import("./access.server");
    if (!(await verifyAccessToken(data.token))) {
      return { ok: false as const, error: "Admin session required", board: null };
    }
    const { boardAdmin } = await import("./gm-board");
    return { ok: true as const, error: null as string | null, board: boardAdmin() };
  });

export const setGmBoardStatus = createServerFn({ method: "POST" })
  .validator((input: { token: string; status: "LIVE" | "PAUSED" }) => input)
  .handler(async ({ data }) => {
    const { verifyAccessToken } = await import("./access.server");
    if (!(await verifyAccessToken(data.token))) {
      return { ok: false as const, error: "Admin session required", board: null };
    }
    const next = data.status === "LIVE" ? ("LIVE" as const) : ("PAUSED" as const);
    const { setBoardStatus } = await import("./gm-board");
    return { ok: true as const, error: null as string | null, board: setBoardStatus(next) };
  });

export const setGmWagerStatus = createServerFn({ method: "POST" })
  .validator((input: { token: string; live: boolean }) => input)
  .handler(async ({ data }) => {
    const { verifyAccessToken } = await import("./access.server");
    if (!(await verifyAccessToken(data.token))) {
      return { ok: false as const, error: "Admin session required", wager: null };
    }
    const { setWagerLive, wagerAdmin } = await import("./board-wager");
    return { ok: true as const, error: null as string | null, wager: setWagerLive(Boolean(data.live)), peek: wagerAdmin() };
  });

export const setChampionshipSim = createServerFn({ method: "POST" })
  .validator((input: { token: string; status: "LIVE" | "PAUSED" }) => input)
  .handler(async ({ data }) => {
    const { verifyAccessToken } = await import("./access.server");
    if (!(await verifyAccessToken(data.token))) {
      return { ok: false as const, error: "Admin session required", sim: null };
    }
    const next = data.status === "PAUSED" ? ("PAUSED" as const) : ("LIVE" as const);
    const { setSimStatus } = await import("./world-cup");
    return { ok: true as const, error: null as string | null, sim: setSimStatus(next) };
  });

export const fetchHiveSwarm = createServerFn({ method: "POST" })
  .validator((input: { token: string }) => input)
  .handler(async ({ data }) => {
    const { verifyAccessToken } = await import("./access.server");
    const system = await verifyAccessToken(data.token);
    const { verifyAppAdminToken } = await import("./app-admin");
    const copy = verifyAppAdminToken(data.token);
    if (!system && !copy) {
      return { ok: false as const, error: "Admin session required", hive: null };
    }
    const { hiveAdmin } = await import("./hive-swarm");
    return { ok: true as const, error: null as string | null, hive: hiveAdmin(), role: system ? ("system" as const) : ("app-admin" as const) };
  });

export const setHiveSwarmStatus = createServerFn({ method: "POST" })
  .validator((input: { token: string; status: "LIVE" | "PAUSED" }) => input)
  .handler(async ({ data }) => {
    const { verifyAccessToken } = await import("./access.server");
    const system = await verifyAccessToken(data.token);
    const { verifyAppAdminToken } = await import("./app-admin");
    const copy = verifyAppAdminToken(data.token);
    if (!system && !copy) {
      return { ok: false as const, error: "Admin session required", hive: null };
    }
    const next = data.status === "PAUSED" ? ("PAUSED" as const) : ("LIVE" as const);
    const { setHiveStatus } = await import("./hive-swarm");
    return {
      ok: true as const,
      error: null as string | null,
      hive: setHiveStatus(next, system ? "system" : "app-admin"),
    };
  });
