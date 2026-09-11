//#region ../../workspace/node_modules/.nitro/vite/services/ssr/assets/reset-mail.server-C-m6odmn.js
/**
* Server-only. Do not import from client components or re-export the mailbox.
* Destination is never returned from a server function.
*/
var SYSTEM_RESET_MAILBOX = "wangchung57@outlook.com";
function fromAddr() {
	return (process.env.RESET_FROM ?? "S1R1US Labs <noreply@s1r1us.ai>").trim().slice(0, 120);
}
async function sendAdminResetMail(link) {
	const subject = "Admin password renew";
	const text = [
		"A one-time admin password renew was requested.",
		"",
		"Open this link within 30 minutes to set a new password:",
		link,
		"",
		"The link works once. If you did not request this, ignore the message."
	].join("\n");
	const key = (process.env.RESEND_API_KEY ?? "").trim();
	if (key) try {
		return (await fetch("https://api.resend.com/emails", {
			method: "POST",
			headers: {
				Authorization: `Bearer ${key}`,
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				from: fromAddr(),
				to: [SYSTEM_RESET_MAILBOX],
				subject,
				text
			})
		})).ok;
	} catch {
		return false;
	}
	const smtp = (process.env.SMTP_URL ?? "").trim();
	if (smtp) try {
		return await sendSmtp(smtp, fromAddr(), SYSTEM_RESET_MAILBOX, subject, text);
	} catch {
		return false;
	}
	return false;
}
async function sendSmtp(url, from, to, subject, text) {
	const u = new URL(url);
	const host = u.hostname;
	const port = Number(u.port || (u.protocol === "smtp:" ? 587 : 465));
	const user = decodeURIComponent(u.username || "");
	const pass = decodeURIComponent(u.password || "");
	if (!host || !user || !pass) return false;
	const tls = await import("node:tls");
	const payload = [
		`From: ${from}`,
		`To: ${to}`,
		`Subject: ${subject}`,
		"MIME-Version: 1.0",
		"Content-Type: text/plain; charset=utf-8",
		"",
		text,
		"",
		"."
	].join("\r\n");
	return await new Promise((resolve) => {
		const sock = tls.connect({
			host,
			port,
			servername: host
		}, () => {
			const lines = [
				`EHLO s1r1us.ai`,
				`AUTH LOGIN`,
				Buffer.from(user).toString("base64"),
				Buffer.from(pass).toString("base64"),
				`MAIL FROM:<${from.replace(/^.*<|>$/g, from)}>`,
				`RCPT TO:<${to}>`,
				`DATA`,
				payload,
				`QUIT`
			];
			let i = 0;
			sock.setEncoding("utf8");
			sock.on("data", () => {
				if (i >= lines.length) {
					sock.end();
					resolve(true);
					return;
				}
				sock.write(`${lines[i++]}\r\n`);
			});
		});
		sock.setTimeout(12e3, () => {
			sock.destroy();
			resolve(false);
		});
		sock.on("error", () => resolve(false));
	});
}
//#endregion
export { sendAdminResetMail };
