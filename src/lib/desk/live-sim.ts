/** G M0D3 AUTO + AI agents as-live simulation until go-live. Client-safe. */
import { CHECKPOINT_BASELINE_N, CHECKPOINT_BUILD_N, checkpointLabel } from "../launch/checkpoint.ts";

export const LIVE_SIM_NAME = "G M0D3 AUTO · AI agents live simulation";
export const LIVE_SIM_SEO = "G-M0de AUTO live simulation";
export const LIVE_SIM_TZ = "America/New_York";
export const LIVE_SIM_PAUSE_LABEL = "07:00";
export const LIVE_SIM_REPORT_LABEL = "07:30";
export const LIVE_SIM_UNTIL = "2026-12-01";
export { CHECKPOINT_BASELINE_N, CHECKPOINT_BUILD_N, checkpointLabel };

export type LiveSimStatus = "LIVE" | "PAUSED";
export type LiveSimBy = "system" | "app-admin" | "scheduler" | null;
export type LiveSimConflict = null | "desync-rebased-to-baseline";

export type LiveSimPublic = {
  name: string;
  seo: string;
  status: LiveSimStatus;
  checkpoint: number;
  baseline: number;
  label: string;
  synced: boolean;
  conflict: LiveSimConflict;
  pauseAllowed: true;
  asLiveUntilGoLive: true;
  trade: false;
  ordersCreate: false;
  keysOnThisHost: false;
  pauseEt: typeof LIVE_SIM_PAUSE_LABEL;
  reportEt: typeof LIVE_SIM_REPORT_LABEL;
  tz: typeof LIVE_SIM_TZ;
  until: typeof LIVE_SIM_UNTIL;
  nextPauseAt: string | null;
  nextReportAt: string | null;
  cycleUntil: string | null;
  pausedBy: LiveSimBy;
  pausedAt: string | null;
  lastReportAt: string | null;
  lastReportId: string | null;
  lastSyncedAt: string | null;
  practiceKilled: true;
  dataPullsFollowSim: true;
  copyAdminMayPause: true;
  championshipPauseSystemOnly: false;
  note: string;
};

export function liveSimNote(status: LiveSimStatus, checkpoint = CHECKPOINT_BUILD_N): string {
  const tag = checkpointLabel(checkpoint);
  return status === "LIVE"
    ? `${tag} admin simulation LIVE: G M0D3 AUTO, external AI agents, and PR3D1CT10N$ on live Coinbase last. Practice AUTO ticks stay off. Admin simulation is the only live-data test cycle. Data pulls are on. Pause or restart from Admin Console (system or phone-app Admin). Championship World Cup / C@LL 0UT pause is also system Admin and phone-app Admin. This host never places Coinbase orders.`
    : `${tag} admin simulation PAUSED (G M0D3 AUTO, AI agents, PR3D1CT10N$). Last tape held for morning report. Practice AUTO ticks stay off. Data pulls idle. Continue from Admin Console (system or phone app). Championship World Cup / C@LL 0UT pause is system Admin and phone-app Admin.`;
}
