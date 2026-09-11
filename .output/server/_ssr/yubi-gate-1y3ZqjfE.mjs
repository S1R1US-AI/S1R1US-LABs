import { r as getSql } from "./db-CnQahlAD.mjs";
import { s as yubiRows } from "./yubi.server-DnGyn4Hv.mjs";
import { webauthnCount } from "./webauthn.server-DMtSECIC.mjs";
import { mkdirSync, writeFileSync } from "node:fs";
//#region ../../workspace/node_modules/.nitro/vite/services/ssr/assets/yubi-gate-1y3ZqjfE.js
/** YubiKey is optional. Name+password unlocks system admin. */
var PATHS = ["/tmp/admin-yubi-gate.json", "/workspace/data/admin-yubi-gate.json"];
function writeFileGate(g) {
	const body = JSON.stringify(g);
	for (const p of PATHS) try {
		if (p.startsWith("/workspace/data")) mkdirSync("/workspace/data", { recursive: true });
		writeFileSync(p, body);
	} catch {}
}
/** Login must not block on Yubi. Enrollment stays available. */
async function adminPanelYubiLock() {
	return false;
}
async function setAdminPanelYubiLock(on) {
	const otp = await yubiRows();
	const fido = await webauthnCount();
	const keyCount = otp.length + fido;
	writeFileGate({
		panelLock: false,
		updatedAt: (/* @__PURE__ */ new Date()).toISOString()
	});
	try {
		await (await getSql())`
      insert into admin_yubi_gate (id, panel_lock, updated_at)
      values ('gate', false, now())
      on conflict (id) do update set panel_lock = false, updated_at = now()
    `;
	} catch {}
	return {
		ok: true,
		panelLock: false,
		keyCount,
		yubicoRecommendTwo: keyCount < 2
	};
}
async function adminHasPhysicalKey() {
	return (await yubiRows()).length + await webauthnCount() > 0;
}
//#endregion
export { adminHasPhysicalKey, adminPanelYubiLock, setAdminPanelYubiLock };
