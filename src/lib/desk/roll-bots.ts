import { DESK_POLL_MS } from "./poll";
import { pullDeskTape } from "./tape-client";

/** Live Coinbase tape cycle only. No paper fills. No extra 7-B0T / GM practice ticks. */
export async function rollBots(opts?: { force?: boolean; admin?: boolean }) {
  void opts?.admin;
  await pullDeskTape({ force: opts?.force });
}

export { DESK_POLL_MS };
