/** Single source for desk checkpoint build number. No @/ imports. Client-safe. */
export const CHECKPOINT_BASELINE_N = 68;
export const CHECKPOINT_BUILD_N = 113;
export const CHECKPOINT_FOLD = "2026-09-12T00:20:00.000Z";
export const CHECKPOINT_LAST_EDIT = "2026-09-12T02:10:00.000Z";
/** Public label for the current release. Internal build numbers stay out of visitor copy. */
export const CHECKPOINT_NAME = "S1R1US live sim launch";
export const CHECKPOINT_SHORT = "S1R1US current release";

export function checkpointLabel(n = CHECKPOINT_BUILD_N) {
  if (n === CHECKPOINT_BUILD_N) return CHECKPOINT_SHORT;
  return "S1R1US earlier release";
}

export function checkpointId(n = CHECKPOINT_BUILD_N) {
  return String(n);
}
