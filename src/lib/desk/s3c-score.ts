/** S3C Sweep row shapes and score. Client-safe; rows come from the admin server functions. */
export type S3cStatus = "PASS" | "WARN" | "FAIL";

export type S3cRow = {
  id: string;
  name: string;
  status: S3cStatus;
  note: string;
};

export function s3cSweepScore(rows: S3cRow[]): { score: number; headline: string; pass: number; warn: number; fail: number } {
  const pass = rows.filter((r) => r.status === "PASS").length;
  const warn = rows.filter((r) => r.status === "WARN").length;
  const fail = rows.filter((r) => r.status === "FAIL").length;
  const score = Math.max(1, Math.min(100, Math.round(100 - fail * 12 - warn * 4)));
  const headline =
    fail === 0
      ? `S3C SWEEP ${score}/100 — ${pass} PASS · ${warn} WARN · 0 FAIL`
      : `S3C SWEEP ${score}/100 — ${fail} FAIL · ${warn} WARN · ${pass} PASS`;
  return { score, headline, pass, warn, fail };
}
