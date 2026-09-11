/** Single source for desk checkpoint build number. No @/ imports. Client-safe. */
export const CHECKPOINT_BASELINE_N = 68;
export const CHECKPOINT_BUILD_N = 68;
export const CHECKPOINT_FOLD = "2026-09-07T17:20:00.000Z";
/** Last operator edit stamp before final checkpoint 101 build prep. Does not retarget sim (still DEPLOY #68). */
export const CHECKPOINT_LAST_EDIT = "2026-09-11T02:42:00.000Z";

export function checkpointLabel(n = CHECKPOINT_BUILD_N) {
  return `DEPLOY #${n}`;
}

export function checkpointId(n = CHECKPOINT_BUILD_N) {
  return String(n);
}
