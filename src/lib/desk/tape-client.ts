import { useEffect, useState } from "react";
import { DESK_POLL_MS, RELOAD_FORCE_MS } from "./poll";
import { fetchDesk } from "./desk-rpc";
import type { DeskSnapshot } from "./types";

const STORE = "s1r1us-desk-snap-v3";
const LAST_PULL_KEY = "s1r1us-last-pull-at";
const listeners = new Set<(s: DeskSnapshot | null) => void>();
const liveListeners = new Set<(on: boolean) => void>();
let memory: DeskSnapshot | null = null;
let pending: Promise<DeskSnapshot> | null = null;
let pendingAt = 0;
let pollOn = false;
let pollPaused = false;
let reloadForceUsed = false;
let fillCatch = 0;
let fillCatchTimer = 0;

/** Core paints first. These lanes arrive on fill — don't treat a thin snap as done. */
export function tapeNeedsFill(s: DeskSnapshot | null) {
  if (!s) return true;
  const bars = (s.capital?.bars ?? []).filter((b) => b.usd != null).length;
  const curve = (s.macro?.tbill?.points?.length ?? 0) + (s.macro?.y10?.points?.length ?? 0);
  const cpi = s.macro?.cpiYoy?.points?.length ?? 0;
  const m2n = s.macro?.m2?.points?.length ?? 0;
  const stables = s.macro?.stables?.length ?? 0;
  const holders = s.holders?.holders?.length ?? 0;
  const news = (s.headlines?.length ?? 0) + (s.filings?.length ?? 0);
  const dats = s.capital?.dats?.length ?? 0;
  return bars < 3 || curve < 8 || cpi < 6 || m2n < 6 || stables < 1 || holders < 5 || news < 3 || dats < 3;
}

function richness(s: DeskSnapshot) {
  return [
    (s.capital.bars ?? []).filter((b) => b.usd != null).length,
    s.capital.dats.length,
    s.holders.holders.length,
    s.headlines.length,
    s.filings.length,
    s.macro.tbill.last ?? "",
    s.macro.m2.last ?? "",
    s.macro.cpiYoy.points.length,
    s.macro.stables.length,
    s.quotes.length,
    s.candles.length,
  ].join("|");
}

function lastPullAt() {
  if (typeof localStorage === "undefined") return 0;
  try {
    return Number(localStorage.getItem(LAST_PULL_KEY) || 0);
  } catch {
    return 0;
  }
}

function markPull() {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.setItem(LAST_PULL_KEY, String(Date.now()));
  } catch {
    /* private mode */
  }
}

export function forcePullAllowed() {
  const last = lastPullAt();
  return !Number.isFinite(last) || last <= 0 || Date.now() - last >= RELOAD_FORCE_MS;
}

function isBrowserReload() {
  if (typeof performance === "undefined") return false;
  try {
    const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
    return nav?.type === "reload";
  } catch {
    return false;
  }
}

/** One forced rebuild per reload, and only if the mandate cycle has elapsed since the last pull. */
function takeReloadForce() {
  if (reloadForceUsed) return false;
  reloadForceUsed = true;
  return isBrowserReload() && forcePullAllowed();
}

function readStored(): DeskSnapshot | null {
  if (typeof sessionStorage === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(STORE);
    if (!raw) return null;
    return JSON.parse(raw) as DeskSnapshot;
  } catch {
    return null;
  }
}

function writeStored(s: DeskSnapshot) {
  if (typeof sessionStorage === "undefined") return;
  try {
    const hours = [...s.candles].sort((a, b) => a.t - b.t).slice(-300);
    const slim = { ...s, errors: [] as string[], candles: hours };
    sessionStorage.setItem(STORE, JSON.stringify(slim));
  } catch {
    /* quota — skip */
  }
}

function tapeKey(s: DeskSnapshot) {
  const last = s.candles[s.candles.length - 1];
  return [
    s.btc.price,
    s.rsi14,
    s.fearGreed?.value ?? "",
    s.candles.length,
    last?.t ?? "",
    last?.close ?? "",
    s.positioning.longShort ?? "",
    s.positioning.fundingRate ?? "",
    s.capital.etfFlow ?? "",
    s.asia.kimchiPct ?? "",
  ].join("|");
}

function emit(s: DeskSnapshot | null) {
  if (s && memory && tapeKey(s) === tapeKey(memory) && richness(s) === richness(memory)) {
    memory = s;
    writeStored(s);
    return;
  }
  memory = s;
  if (s) writeStored(s);
  for (const fn of listeners) fn(s);
}

function scheduleFillCatch() {
  if (typeof window === "undefined") return;
  if (fillCatch >= 2 || fillCatchTimer) return;
  fillCatch += 1;
  fillCatchTimer = window.setTimeout(() => {
    fillCatchTimer = 0;
    if (tapeNeedsFill(peekDeskTape())) void pullDeskTape();
  }, 2_800);
}

export function peekDeskTape(): DeskSnapshot | null {
  if (memory) return memory;
  memory = readStored();
  return memory;
}

export async function pullDeskTape(opts?: { force?: boolean }): Promise<DeskSnapshot> {
  if (pending && Date.now() - pendingAt < 4_000) return pending;
  const had = peekDeskTape();
  let force = Boolean(opts?.force) || takeReloadForce();
  if (force && !forcePullAllowed()) force = false;
  if (!force && had?.fetchedAt && !tapeNeedsFill(had)) {
    const age = Date.now() - Date.parse(had.fetchedAt);
    if (Number.isFinite(age) && age >= 0 && age < DESK_POLL_MS) return had;
  }
  const fetchP = fetchDesk({ data: { force } }).then((s) => {
    markPull();
    emit(s);
    if (tapeNeedsFill(s)) scheduleFillCatch();
    else fillCatch = 0;
    return s;
  });
  const run = Promise.race([
    fetchP,
    new Promise<DeskSnapshot>((resolve, reject) => {
      setTimeout(() => {
        const last = peekDeskTape() ?? had;
        if (last) resolve(last);
        else reject(new Error("tape timeout"));
      }, force ? 3_200 : 2_800);
    }),
  ]);
  pendingAt = Date.now();
  pending = run.finally(() => {
    pending = null;
    pendingAt = 0;
  });
  return pending;
}

function ensurePoll() {
  if (pollOn || typeof window === "undefined") return;
  pollOn = true;
  if (!peekDeskTape()) void pullDeskTape();
  window.setInterval(() => {
    if (pollPaused) return;
    if (typeof document !== "undefined" && document.hidden) return;
    void pullDeskTape();
  }, DESK_POLL_MS);
}

export function setDeskPollLive(on: boolean) {
  pollPaused = !on;
  for (const fn of liveListeners) fn(on);
}

export function isDeskPollLive() {
  return !pollPaused;
}

export function useDeskTape() {
  const [snap, setSnap] = useState<DeskSnapshot | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [live, setLiveState] = useState(true);

  useEffect(() => {
    listeners.add(setSnap);
    liveListeners.add(setLiveState);
    const had = peekDeskTape();
    if (had) {
      setSnap(had);
      setLoading(false);
    }
    const stop = window.setTimeout(() => setLoading(false), 5_000);
    ensurePoll();
    const thin = !had || tapeNeedsFill(had) || had.candles.length < 220;
    if (thin) {
      void pullDeskTape()
        .then((s) => {
          setSnap(s);
          setErr(null);
        })
        .catch((e) => setErr(e instanceof Error ? e.message : "Desk fetch failed"))
        .finally(() => {
          window.clearTimeout(stop);
          setLoading(false);
        });
    } else {
      window.clearTimeout(stop);
      setLoading(false);
    }
    return () => {
      listeners.delete(setSnap);
      liveListeners.delete(setLiveState);
    };
  }, []);

  function setLive(on: boolean) {
    setDeskPollLive(on);
    setLiveState(on);
  }

  async function refresh() {
    setErr(null);
    try {
      await pullDeskTape({ force: forcePullAllowed() });
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Desk fetch failed");
    } finally {
      setLoading(false);
    }
  }

  return { snap, err, loading, refresh, live, setLive };
}
