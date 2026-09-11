/** S1R1US App build #113 (live sim launch). Carbon-fiber baseline DEPLOY #68. Live tape on. Call board on. Paper fills off. Live Coinbase off. */
import { CHECKPOINT_BUILD_N, CHECKPOINT_NAME } from "./checkpoint.ts";

export const LAUNCH_BUILD_N = CHECKPOINT_BUILD_N;
export const LAUNCH_BUILD = CHECKPOINT_NAME;
/** Paper AUTO fills off. Not a Coinbase freeze. */
export const LAUNCH_FREEZE = false;
export const LAUNCH_LIVE_TRADES = false;
/** Show 7-B0T + GM would-accumulate calls on the live tape. No paper fills. Never orders create. */
export const DEMO_AUTO = true;
export const LAUNCH_ON = "2026-09-05";
export { PATH_A_LOCKED } from "@/lib/launch/model";
