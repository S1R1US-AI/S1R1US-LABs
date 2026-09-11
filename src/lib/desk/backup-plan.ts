/** Admin Security → BACKUP. Full-system restore entries for s1r1us.ai. Client-safe. */

const REPO = "https://github.com/S1R1US-AI/S1R1US-LABs";
const PIN_TAG = "s1r1us-app-build-111";
const PIN_BRANCH = "checkpoint/s1r1us-app-build-111";

export const BACKUP_SHOW_DAYS = 7;
export const BACKUP_WINDOW_DAYS = 14;

export type BackupEntry = {
  date: string; // YYYY-MM-DD
  label: string;
  /** Full system source (web app + phone-app PWA wrap + prebuilt .output) as of that day. */
  downloadUrl: string;
  /** Commit list for that day — pick a SHA to download that exact snapshot archive. */
  dayCommitsUrl: string;
  /** Restore entry point — pinned checkpoint release with restore steps. */
  restoreUrl: string;
};

export const RESTORE_STEPS = [
  `DigitalOcean project live-production → App Spec github.branch = ${PIN_BRANCH}.`,
  "Wait for the deploy to report Healthy.",
  "Hard-refresh https://s1r1us.ai (web app and phone-app PWA pick up the restored build).",
  "Point back to main only after main matches the pinned tag. Never compile on the 1 GB box — the pin ships prebuilt .output.",
] as const;

export const BACKUP_PIN = {
  tag: PIN_TAG,
  branch: PIN_BRANCH,
  releaseUrl: `${REPO}/releases/tag/${PIN_TAG}`,
  downloadUrl: `${REPO}/archive/refs/tags/${PIN_TAG}.zip`,
} as const;

function dayString(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/** Last 14 daily full-system entries, newest first. */
export function backupEntries(now = new Date()): BackupEntry[] {
  const out: BackupEntry[] = [];
  for (let i = 0; i < BACKUP_WINDOW_DAYS; i++) {
    const day = new Date(now.getTime() - i * 86_400_000);
    const date = dayString(day);
    const next = dayString(new Date(day.getTime() + 86_400_000));
    out.push({
      date,
      label: i === 0 ? `${date} · latest full system` : `${date} · daily snapshot`,
      downloadUrl: i === 0 ? `${REPO}/archive/refs/heads/main.zip` : `${REPO}/commits/main?since=${date}&until=${next}`,
      dayCommitsUrl: `${REPO}/commits/main?since=${date}&until=${next}`,
      restoreUrl: BACKUP_PIN.releaseUrl,
    });
  }
  return out;
}
