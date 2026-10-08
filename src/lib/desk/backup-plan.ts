/** Admin Security → BACKUP. Full-system restore entries for s1r1us.ai. Client-safe. */

const REPO = "https://github.com/S1R1US-AI/S1R1US-LABs";

export const BACKUP_SHOW_DAYS = 7;
export const BACKUP_WINDOW_DAYS = 14;

export type BackupEntry = {
  date: string; // YYYY-MM-DD
  label: string;
  /** Full system source (web app + phone-app PWA wrap + prebuilt .output) as of that day. */
  downloadUrl: string;
  /** Commit list for that day — pick a SHA to download that exact snapshot archive. */
  dayCommitsUrl: string;
  /** Entry point — public releases list. */
  restoreUrl: string;
};

export const RESTORE_STEPS = [
  "Restore follows the operator's private runbook. Restore details are not published.",
  "Hard-refresh https://s1r1us.ai after a restore (web app and phone-app PWA pick up the restored build).",
] as const;

export const BACKUP_LINKS = {
  tag: "releases",
  releaseUrl: `${REPO}/releases`,
  downloadUrl: `${REPO}/archive/refs/heads/main.zip`,
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
      restoreUrl: BACKUP_LINKS.releaseUrl,
    });
  }
  return out;
}
