/** Shared live-tape cadence. Core paints first; fill merges behind. Client poll is one interval. */
export const DESK_POLL_MS = 5 * 60 * 1000;
/** Browser reload may force a full rebuild at most this often — same clock as the mandate cycle. */
export const RELOAD_FORCE_MS = DESK_POLL_MS;
