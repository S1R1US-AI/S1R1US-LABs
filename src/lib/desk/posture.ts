/** Admin Security tab payload: WAF + intel + headers + maps + actions. Server-only. */
import { readFileSync } from "node:fs";
import { firewallLayers, firewallSummary } from "./firewall";
import { wafStats, ingestWafLog } from "./waf";
import { listBans, ingestBans } from "./ban-list";
import { listActions, ingestActions, underAttack } from "./auto-defend";
import { cachedIntel, ingestIntel, refreshIntel } from "./threat-intel";
import { headerPosture } from "./sec-headers";
import { owaspRows, pciRows, pluginInventory } from "./control-map";
import { protocolRows, vulnRows } from "./security";
import { runHunter } from "./hunter";
import { listIntrusions, intrusionSummary, ingestPersisted } from "./intrusion-log";
import { agentSecurityStats, asiRows, llmAgentRows } from "./agent-security";

function readJson(path: string): unknown {
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch {
    return null;
  }
}

export function hydrateSecurityDisk() {
  ingestPersisted(readJson("/tmp/desk-intrusions.json"));
  ingestWafLog(readJson("/tmp/desk-waf.json"));
  ingestBans(readJson("/tmp/desk-bans.json"));
  ingestActions(readJson("/tmp/desk-defend.json"));
  ingestIntel(readJson("/tmp/desk-intel.json"));
}

export async function securityPosture(opts?: { refreshIntel?: boolean }) {
  hydrateSecurityDisk();
  let intel = cachedIntel();
  if (opts?.refreshIntel || !intel.count) {
    try {
      intel = await refreshIntel(Boolean(opts?.refreshIntel));
    } catch {
      intel = cachedIntel();
    }
  }
  const hunter = runHunter();
  const layers = firewallLayers();
  let agentGate: {
    externalAgents: boolean;
    closedAt: string | null;
    openedAt: string | null;
    inviteBatchAt: string | null;
    inviteCount: number;
    public: ReturnType<(typeof import("./agent-gate"))["agentGatePublic"]>;
  } | null = null;
  let waitlist: { count: number; invited: number; rows: { name: string; kind: string; handle: string | null; at: string; invitedAt: string | null; inviteId: string | null }[] } = {
    count: 0,
    invited: 0,
    rows: [],
  };
  try {
    const gate = await import("./agent-gate");
    const wl = await import("./agent-waitlist");
    const state = gate.peekAgentGate();
    agentGate = { ...state, public: gate.agentGatePublic() };
    waitlist = wl.waitlistAdmin();
    const layer = layers.find((l) => l.id === "agent-gate");
    if (layer) {
      layer.status = state.externalAgents ? "ARMED" : "OPERATOR";
      layer.detail = state.externalAgents
        ? `External AI communication OPEN${state.inviteBatchAt ? ` · last invite ${state.inviteCount} bots` : ""}. Admin can close it from Security.`
        : `MAINTENANCE since ${state.closedAt ?? "—"}. Ping + waitlist open. Invite queued for ${waitlist.count} waitlisted bots.`;
    }
  } catch {
    /* preview */
  }

  let bars: { count: number; rows: { id: string; at: string; name: string; handle: string | null; kind: string; ip: string; reason: string; forever: true }[] } = {
    count: 0,
    rows: [],
  };
  try {
    bars = (await import("./agent-bar")).listAgentBars();
  } catch {
    /* preview */
  }

  try {
    const gate = await import("./yubi-gate");
    const on = await gate.adminPanelYubiLock();
    const keys = await gate.adminHasPhysicalKey();
    const layer = layers.find((l) => l.id === "yubi-panel");
    if (layer) {
      layer.status = on ? "ARMED" : "OPERATOR";
      layer.detail = on
        ? `ON — Admin requires a physical YubiKey after X + password. Keys enrolled=${String(keys)}.`
        : `OFF (default). Enroll a YubiKey then lock Admin from Wallet. Dual OTP still required for outgoing BTC/USDC.`;
    }
  } catch {
    /* preview */
  }

  return {
    asOf: new Date().toISOString(),
    firewall: { layers, summary: firewallSummary(layers) },
    waf: wafStats(),
    bans: listBans(),
    intel,
    headers: headerPosture(),
    owasp: owaspRows(),
    pci: pciRows(),
    plugins: pluginInventory(),
    actions: listActions(),
    underAttack: underAttack(),
    hunter,
    protocol: protocolRows(),
    vulns: vulnRows(),
    intrusions: { rows: listIntrusions(), summary: intrusionSummary() },
    agentGate,
    waitlist,
    bars,
    agentic: { stats: agentSecurityStats(), asi: asiRows(), llm: llmAgentRows() },
  };
}

export type SecurityPosture = Awaited<ReturnType<typeof securityPosture>>;
