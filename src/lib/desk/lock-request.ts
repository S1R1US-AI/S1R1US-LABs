import type { LockId } from "./lock-status";

/** Phone-app admin may REQUEST these only. Never live-intent rails. */
export const PHONE_REQUESTABLE = ["agents", "hive", "pred"] as const satisfies readonly LockId[];
export type PhoneRequestId = (typeof PHONE_REQUESTABLE)[number];

export const PHONE_NEVER_UNLOCK: LockId[] = ["bot7Auto", "gmAuto", "gmManual", "agentLive"];

export type LockChangeRequest = {
  id: string;
  at: string;
  by: "app-admin";
  ids: PhoneRequestId[];
  want: "lock" | "unlock";
  note: string;
  status: "open" | "done" | "rejected";
};
