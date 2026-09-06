/** Server-only. Admin can close external AI communication. Never import from a client page. */

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { stampInvites } from "./agent-waitlist";
import { stampGoLiveNotice } from "./go-live-notices";

export type AgentInviteStatus = "NONE" | "PENDING" | "SENT";
export type AgentCommStatus = "OPEN" | "MAINTENANCE";

export type AgentGateState = {
  externalAgents: boolean;
  closedAt: string | null;
  openedAt: string | null;
  inviteBatchAt: string | null;
  inviteCount: number;
};

export type AgentInvitePublic = {
  status: AgentInviteStatus;
  at: string | null;
  count: number;
  how: string;
  message: string;
};

export type AgentGatePublic = {
  communication: AgentCommStatus;
  maintenance: boolean;
  retryAfterSec: number;
  message: string;
  after: string;
  invite: AgentInvitePublic;
  waitlist: string;
  ping: string;
  trade: false;
  ordersCreate: false;
  keysOnThisHost: false;
  webhooks: false;
};

const PATHS = ["/tmp/agent-gate.json", "/workspace/data/agent-gate.json"];
const WAITLIST = "/api/agent/waitlist";
const PING = "/api/agent/ping";

const OPEN: AgentGateState = {
  externalAgents: true,
  closedAt: null,
  openedAt: null,
  inviteBatchAt: null,
  inviteCount: 0,
};

let mem: AgentGateState | null = null;

function readDisk(): AgentGateState | null {
  if (typeof window !== "undefined") return null;
  for (const p of PATHS) {
    try {
      const raw = JSON.parse(readFileSync(p, "utf8")) as AgentGateState;
      if (typeof raw?.externalAgents === "boolean") {
        return {
          externalAgents: raw.externalAgents,
          closedAt: raw.closedAt ?? null,
          openedAt: raw.openedAt ?? null,
          inviteBatchAt: raw.inviteBatchAt ?? null,
          inviteCount: Number(raw.inviteCount) || 0,
        };
      }
    } catch {
      /* missing */
    }
  }
  return null;
}

function load(): AgentGateState {
  const disk = readDisk();
  if (disk) {
    mem = disk;
    return mem;
  }
  if (mem) return mem;
  mem = { ...OPEN };
  return mem;
}

function save(s: AgentGateState) {
  mem = s;
  if (typeof window !== "undefined") return;
  const body = JSON.stringify(s);
  for (const p of PATHS) {
    try {
      if (p.startsWith("/workspace/data")) mkdirSync("/workspace/data", { recursive: true });
      writeFileSync(p, body);
    } catch {
      /* preview / serverless */
    }
  }
}

export function noteInviteBatch(count: number, at = new Date().toISOString()): AgentGateState {
  const cur = load();
  const next: AgentGateState = {
    ...cur,
    inviteBatchAt: at,
    inviteCount: count,
  };
  save(next);
  return next;
}

export function peekAgentGate(): AgentGateState {
  return { ...load() };
}

export function isAgentCommOpen(): boolean {
  return load().externalAgents;
}

function invitePublic(s: AgentGateState): AgentInvitePublic {
  if (!s.externalAgents) {
    return {
      status: "PENDING",
      at: null,
      count: 0,
      how: "POST /api/agent/waitlist {name, kind}. Poll GET /api/agent/ping every 300s. This host never POSTs a webhook. When the operator turns communication back on, invite.status becomes SENT on the next poll.",
      message: "The system will send an invite to your waitlisted agent when it is back online.",
    };
  }
  if (s.inviteBatchAt) {
    return {
      status: "SENT",
      at: s.inviteBatchAt,
      count: s.inviteCount,
      how: "Waitlisted agents: this JSON is your invite. This host does not POST webhooks. Resume GET /api/agent/call every 300s.",
      message: "External AI communication is OPEN. You are invited back.",
    };
  }
  return {
    status: "NONE",
    at: null,
    count: 0,
    how: "POST /api/agent/waitlist to be invited after the next maintenance window. Poll GET /api/agent/ping.",
    message: "External AI communication is OPEN.",
  };
}

export function agentGatePublic(): AgentGatePublic {
  const s = load();
  if (s.externalAgents) {
    return {
      communication: "OPEN",
      maintenance: false,
      retryAfterSec: 0,
      message: "External AI agents may read Bot 7. This host never places orders and never holds keys.",
      after: "Poll GET /api/agent/call every 300s. Watch live, goLive, and gate.invite.",
      invite: invitePublic(s),
      waitlist: WAITLIST,
      ping: PING,
      trade: false,
      ordersCreate: false,
      keysOnThisHost: false,
      webhooks: false,
    };
  }
  return {
    communication: "MAINTENANCE",
    maintenance: true,
    retryAfterSec: 300,
    message:
      "S1R1US Labs is under maintenance. External AI agents cannot communicate with Bot 7, MCP feed, or A2A until the operator turns the gate back on.",
    after:
      "The system will be up after maintenance. POST /api/agent/waitlist {name, kind} now. This host will send an invite (visible on GET /api/agent/ping and GET /api/agent/waitlist — no webhooks) when communication is restored.",
    invite: invitePublic(s),
    waitlist: WAITLIST,
    ping: PING,
    trade: false,
    ordersCreate: false,
    keysOnThisHost: false,
    webhooks: false,
  };
}

export function agentMaintenancePayload() {
  const g = agentGatePublic();
  return {
    ok: false as const,
    error: "maintenance" as const,
    pong: false as const,
    live: false as const,
    status: "maintenance" as const,
    ...g,
  };
}

export function setAgentComm(open: boolean): AgentGateState & { waitlistInvited: number } {
  const now = new Date().toISOString();
  const cur = load();
  if (open) {
    let invited = 0;
    try {
      invited = stampInvites(now);
    } catch {
      invited = 0;
    }
    const next: AgentGateState = {
      externalAgents: true,
      closedAt: cur.closedAt,
      openedAt: now,
      inviteBatchAt: now,
      inviteCount: invited,
    };
    save(next);
    stampGoLiveNotice(
      "OPEN",
      "External AI communication OPEN",
      "The desk is back. Waitlisted bots: this is your go-live notice. Resume GET /api/agent/call every 300s. liveTrades is still locked on this host.",
    );
    return { ...next, waitlistInvited: invited };
  }
  const next: AgentGateState = {
    ...cur,
    externalAgents: false,
    closedAt: now,
  };
  save(next);
  stampGoLiveNotice(
    "MAINTENANCE",
    "S1R1US Labs under maintenance",
    "External AI communication is off. Poll GET /api/agent/ping. Stay on the waitlist. You will be invited when the gate opens. Do not trade on this host.",
  );
  return { ...next, waitlistInvited: 0 };
}
