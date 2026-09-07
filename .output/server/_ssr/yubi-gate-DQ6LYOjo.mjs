import { r as getSql } from "./db-CnQahlAD.mjs";
import { s as yubiRows } from "./yubi.server-DnGyn4Hv.mjs";
import { webauthnCount } from "./webauthn.server-DPjCYsym.mjs";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
//#region node_modules/.nitro/vite/services/ssr/assets/yubi-gate-DQ6LYOjo.js
/** Optional admin-panel lock behind a physical YubiKey. Server-only. */
var PATHS = ["/tmp/admin-yubi-gate.json", "/workspace/data/admin-yubi-gate.json"];
function readFileGate() {
	for (const p of PATHS) try {
		const raw = JSON.parse(readFileSync(p, "utf8"));
		if (typeof raw?.panelLock === "boolean") return {
			panelLock: raw.panelLock,
			updatedAt: raw.updatedAt ?? null
		};
	} catch {}
	return null;
}
function writeFileGate(g) {
	const body = JSON.stringify(g);
	for (const p of PATHS) try {
		if (p.startsWith("/workspace/data")) mkdirSync("/workspace/data", { recursive: true });
		writeFileSync(p, body);
	} catch {}
}
async function adminPanelYubiLock() {
	try {
		const rows = await (await getSql())`select panel_lock from admin_yubi_gate where id = 'gate' limit 1`;
		if (rows[0]) return Boolean(rows[0].panel_lock);
	} catch {}
	return readFileGate()?.panelLock ?? false;
}
async function setAdminPanelYubiLock(on) {
	const otp = await yubiRows();
	const fido = await webauthnCount();
	const keyCount = otp.length + fido;
	if (on && keyCount < 1) return {
		ok: false,
		error: "Enroll a YubiKey (Yubico OTP or FIDO2) before locking the admin panel."
	};
	writeFileGate({
		panelLock: on,
		updatedAt: (/* @__PURE__ */ new Date()).toISOString()
	});
	try {
		await (await getSql())`
      insert into admin_yubi_gate (id, panel_lock, updated_at)
      values ('gate', ${on}, now())
      on conflict (id) do update set panel_lock = excluded.panel_lock, updated_at = now()
    `;
	} catch {}
	return {
		ok: true,
		panelLock: on,
		keyCount,
		yubicoRecommendTwo: keyCount < 2
	};
}
async function adminHasPhysicalKey() {
	return (await yubiRows()).length + await webauthnCount() > 0;
}
//#endregion
export { adminHasPhysicalKey, adminPanelYubiLock, setAdminPanelYubiLock };
