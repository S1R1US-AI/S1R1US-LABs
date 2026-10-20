import { s as protocolRows, u as vulnRows } from "./security-CL_DgNXK.mjs";
import { n as intrusionSummary } from "./intrusion-log-BESda8KG.mjs";
import { t as alignmentScore } from "./alignment-B33iKkpj.mjs";
import { c as owlSecuritySummary } from "./owl-forum-KLFiJJvp.mjs";
import { cachedHunter } from "./hunter-C3QdBSZI.mjs";
import { t as s3cSweepRows } from "./s3c-sweep-B7_SNzUJ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/morning-security.server-CYk-82SH.js
function s3cSweepScore(rows) {
	const pass = rows.filter((r) => r.status === "PASS").length;
	const warn = rows.filter((r) => r.status === "WARN").length;
	const fail = rows.filter((r) => r.status === "FAIL").length;
	const score = Math.max(1, Math.min(100, Math.round(100 - fail * 12 - warn * 4)));
	return {
		score,
		headline: fail === 0 ? `S3C SWEEP ${score}/100 — ${pass} PASS · ${warn} WARN · 0 FAIL` : `S3C SWEEP ${score}/100 — ${fail} FAIL · ${warn} WARN · ${pass} PASS`,
		pass,
		warn,
		fail
	};
}
/** Morning-report security section. Server-only: reached through the admin server functions. */
function morningSecurity() {
	const proto = protocolRows();
	const vulns = vulnRows();
	const fail = proto.filter((p) => p.status === "FAIL");
	const operator = proto.filter((p) => p.status === "OPERATOR");
	const open = vulns.filter((v) => v.status === "OPERATOR" || v.status === "ACCEPT");
	const needHelp = vulns.filter((v) => v.status === "OPERATOR");
	const hunter = cachedHunter();
	const intrusions = intrusionSummary();
	const headline = hunter.open === 0 && fail.length === 0 ? `SECURITY ANALYSIS — hunter ${hunter.pass} PASS · ${hunter.operator} OPERATOR · ${intrusions.last24h} blocks / 24h` : `SECURITY ANALYSIS — hunter OPEN ${hunter.open} · FAIL ${fail.length} · ${intrusions.last24h} blocks / 24h`;
	const kinds = Object.entries(intrusions.byKind).sort((a, b) => b[1] - a[1]).slice(0, 4).map(([k, n]) => `${k} ${n}`).join(" · ");
	return {
		asOf: (/* @__PURE__ */ new Date()).toISOString(),
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
		mandateScoreNote: "Security analysis: Electrovolt-style web work packages + Hacktron-style hunter (PoC || GTFO). Alignment Score 1–100 is security protocols vs system mandate. Firewall is app-layer. Live Coinbase create stays off. Score is ops honesty, not a promise of zero risk."
	};
}
//#endregion
export { morningSecurity };
