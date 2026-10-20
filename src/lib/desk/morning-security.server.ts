/** Morning-report security section. Server-only: reached through the admin server functions. */
import { protocolRows, vulnRows } from "./security";
import { cachedHunter } from "./hunter";
import { intrusionSummary } from "./intrusion-log";
import { s3cSweepRows, s3cSweepScore } from "./s3c-sweep";
import { owlSecuritySummary } from "./owl-forum";
import { alignmentScore } from "./alignment";

export function morningSecurity() {
  const proto = protocolRows();
  const vulns = vulnRows();
  const fail = proto.filter((p) => p.status === "FAIL");
  const operator = proto.filter((p) => p.status === "OPERATOR");
  const open = vulns.filter((v) => v.status === "OPERATOR" || v.status === "ACCEPT");
  const needHelp = vulns.filter((v) => v.status === "OPERATOR");
  const hunter = cachedHunter();
  const intrusions = intrusionSummary();
  const headline =
    hunter.open === 0 && fail.length === 0
      ? `SECURITY ANALYSIS — hunter ${hunter.pass} PASS · ${hunter.operator} OPERATOR · ${intrusions.last24h} blocks / 24h`
      : `SECURITY ANALYSIS — hunter OPEN ${hunter.open} · FAIL ${fail.length} · ${intrusions.last24h} blocks / 24h`;
  const kinds = Object.entries(intrusions.byKind)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([k, n]) => `${k} ${n}`)
    .join(" · ");
  return {
    asOf: new Date().toISOString(),
    headline,
    s3c: s3cSweepScore(s3cSweepRows()),
    owl: owlSecuritySummary(),
    proto,
    vulns,
    fail,
    operator,
    open,
    needHelp,
    hunter,
    intrusions,
    kinds,
    effectiveness: hunter.effectiveness,
    patchQueue: hunter.patchQueue.slice(0, 4),
    alignment: alignmentScore(hunter),
    mandateScoreNote:
      "Security analysis: Electrovolt-style web work packages + Hacktron-style hunter (PoC || GTFO). Alignment Score 1–100 is security protocols vs system mandate. Firewall is app-layer. Live Coinbase create stays off. Score is ops honesty, not a promise of zero risk.",
  };
}

export type MorningSecurity = ReturnType<typeof morningSecurity>;
