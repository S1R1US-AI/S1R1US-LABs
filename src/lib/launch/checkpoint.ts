/** Single source for desk checkpoint build number. No @/ imports. Client-safe. */
export const CHECKPOINT_BASELINE_N = 68;
export const CHECKPOINT_BUILD_N = 113;
export const CHECKPOINT_FOLD = "2026-09-11T22:34:00.000Z";
export const CHECKPOINT_LAST_EDIT = "2026-09-11T22:34:00.000Z";
/** Operator name for this fold. Live sim launch on main. White label + screensavers folded in at #113. */
export const CHECKPOINT_NAME = "S1R1US App build #113 (live sim launch)";
export const CHECKPOINT_SHORT = "S1R1US App build #113";
export const CHECKPOINT_PROJECT = "Project BTD";
export const CHECKPOINT_FOLDER = "S1R1US L@Bs";

export function checkpointLabel(n = CHECKPOINT_BUILD_N) {
  if (n === CHECKPOINT_BUILD_N) return CHECKPOINT_SHORT;
  return `DEPLOY #${n}`;
}

export function checkpointId(n = CHECKPOINT_BUILD_N) {
  return String(n);
}
