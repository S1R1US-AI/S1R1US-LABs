/** Single source for desk checkpoint build number. No @/ imports. Client-safe. */
export const CHECKPOINT_BASELINE_N = 68;
export const CHECKPOINT_BUILD_N = 68;
export const CHECKPOINT_FOLD = "2026-09-07T14:50:00.000Z";

export function checkpointLabel(n = CHECKPOINT_BUILD_N) {
  return `DEPLOY #${n}`;
}

export function checkpointId(n = CHECKPOINT_BUILD_N) {
  return String(n);
}
