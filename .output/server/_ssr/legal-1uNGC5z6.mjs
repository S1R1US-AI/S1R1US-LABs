import { o as __toESM } from "../_runtime.mjs";
import { H as require_react, x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { w as COMPANY_X_HANDLE } from "./security-D9Edw5IJ.mjs";
import { Dt as TAB_LAB, G as SEO_TAB_COFFEE, it as TAB_COFFEE, n as APP_NAME, o as LABS_NAME, ot as TAB_DESK, st as TAB_FEED, ut as TAB_GM, z as SEO_CANONICAL } from "./brand-BKM5q_W_.mjs";
import { a as SUPPORT_COFFEE_USD, s as SUPPORT_GIFT_RECEIPT } from "./support-DrkzmaJ-.mjs";
import { a as signOut } from "./client-Gq2WFxue.mjs";
import { h as useOperator } from "./operator-2NQMIkHh.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/legal-1uNGC5z6.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var IDLE_MS = 3e5;
var BURST_MS = 3e3;
var GM_SEQ = "G0DZ1LLa M0D3";
var CLASSIC = "ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍｦｧｨｩｪｫｬｭｮｯｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ0123456789";
var RAINBOW = [
	"#ff1f1f",
	"#ff8a1f",
	"#f4e14b",
	"#3dff1a",
	"#5eb3e4",
	"#9b6bdb",
	"#e879b0"
];
var burstFns = /* @__PURE__ */ new Set();
/** 3s Matrix rain on the GM tab — does not lock the session. */
function rainGmBurst(ms = BURST_MS) {
	for (const fn of burstFns) fn(ms);
}
function rainbowAt(tMs, col, row) {
	const cycle = 3600;
	const i = (tMs + col * 90 + row * 220) % cycle / cycle * RAINBOW.length;
	return RAINBOW[Math.floor(i) % RAINBOW.length] ?? "#3dff1a";
}
/** GM rain only on the G0DZ1LLa M0D3 tab. Every other view uses classic rain. */
function gmRainActive() {
	const path = typeof window !== "undefined" ? window.location.pathname : "";
	return path === "/gm" || path.startsWith("/gm/");
}
function MatrixSaver() {
	const canvasRef = (0, import_react.useRef)(null);
	const [mode, setMode] = (0, import_react.useState)("off");
	const [rain, setRain] = (0, import_react.useState)("classic");
	const modeRef = (0, import_react.useRef)("off");
	(0, import_react.useEffect)(() => {
		modeRef.current = mode;
	}, [mode]);
	(0, import_react.useEffect)(() => {
		let idleTimer = window.setTimeout(trip, IDLE_MS);
		let burstTimer = 0;
		async function trip() {
			const useGmRain = gmRainActive();
			const session = useOperator.getState();
			if (!session.unlocked) {
				setRain(useGmRain ? "gm" : "classic");
				setMode("burst");
				window.clearTimeout(burstTimer);
				burstTimer = window.setTimeout(() => {
					if (modeRef.current === "burst") setMode("off");
				}, 8e3);
				idleTimer = window.setTimeout(trip, IDLE_MS);
				return;
			}
			session.lockFromIdle();
			try {
				signOut("/login");
			} catch {
				try {
					sessionStorage.removeItem("grok-auth.bearer-token");
				} catch {}
			}
			setRain(useGmRain ? "gm" : "classic");
			setMode("lock");
		}
		function burst(ms) {
			if (modeRef.current === "lock") return;
			setRain("gm");
			setMode("burst");
			window.clearTimeout(burstTimer);
			burstTimer = window.setTimeout(() => {
				if (modeRef.current === "burst") setMode("off");
			}, ms);
		}
		burstFns.add(burst);
		function goLogin() {
			window.location.assign("/login");
		}
		function poke(ev) {
			if (modeRef.current === "lock") {
				if (!useOperator.getState().unlocked) {
					setMode("off");
					idleTimer = window.setTimeout(trip, IDLE_MS);
					return;
				}
				if (ev.type === "pointermove" || ev.type === "wheel" || ev.type === "scroll") return;
				goLogin();
				return;
			}
			window.clearTimeout(idleTimer);
			idleTimer = window.setTimeout(trip, IDLE_MS);
		}
		const events = [
			"pointerdown",
			"pointermove",
			"keydown",
			"wheel",
			"touchstart",
			"scroll"
		];
		for (const e of events) window.addEventListener(e, poke, { passive: true });
		return () => {
			window.clearTimeout(idleTimer);
			window.clearTimeout(burstTimer);
			burstFns.delete(burst);
			for (const e of events) window.removeEventListener(e, poke);
		};
	}, []);
	(0, import_react.useEffect)(() => {
		if (mode === "off") return;
		const raw = canvasRef.current;
		const rawCtx = raw?.getContext("2d") ?? null;
		if (!raw || !rawCtx) return;
		const surface = raw;
		const g = rawCtx;
		const gmTheme = rain === "gm";
		const burstFall = mode === "burst";
		const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		let columns = [];
		let size = 16;
		let pitch = 16;
		let rowGap = 28;
		let raf = 0;
		let running = true;
		const t0 = performance.now();
		function resize() {
			const dpr = Math.min(window.devicePixelRatio || 1, 2);
			const w = window.innerWidth;
			const h = window.innerHeight;
			surface.width = Math.floor(w * dpr);
			surface.height = Math.floor(h * dpr);
			surface.style.width = `${w}px`;
			surface.style.height = `${h}px`;
			g.setTransform(dpr, 0, 0, dpr, 0, 0);
			g.imageSmoothingEnabled = false;
			size = w < 480 ? 20 : 24;
			pitch = size / 1.875;
			rowGap = Math.round(size * 1.78);
			const count = Math.ceil(w / pitch);
			const rows = Math.max(1, h / rowGap);
			const fall = burstFall ? rows / 180 : (reduced ? .28 + Math.random() * .2 : .5 + Math.random() * .8) * .5419;
			columns = Array.from({ length: count }, (_, i) => ({
				y: burstFall ? -Math.random() * rows * .35 : Math.random() * rows,
				speed: burstFall ? fall * (.92 + Math.random() * .16) : fall,
				gm: gmTheme ? i % 12 === 0 : Math.random() < .05,
				seq: Math.floor(Math.random() * 13),
				hold: 18 + Math.floor(Math.random() * 12),
				glyphs: Array.from({ length: 11 }, () => CLASSIC[Math.floor(Math.random() * 97)] ?? "0")
			}));
			g.fillStyle = "#000";
			g.fillRect(0, 0, w, h);
		}
		function glyph() {
			return CLASSIC[Math.floor(Math.random() * 97)] ?? "0";
		}
		let frame = 0;
		function tick(now) {
			if (!running) return;
			if (document.hidden) {
				raf = window.requestAnimationFrame(tick);
				return;
			}
			frame += 1;
			const w = window.innerWidth;
			const h = window.innerHeight;
			const tMs = now - t0;
			g.fillStyle = reduced ? "rgba(0,0,0,0.28)" : "rgba(0,0,0,0.2)";
			g.fillRect(0, 0, w, h);
			g.font = `700 ${size}px "IBM Plex Mono", Consolas, monospace`;
			g.textBaseline = "top";
			g.textAlign = "left";
			const classicPx = Math.round(size * 1.08);
			const gmPx = Math.round(size * .92);
			for (let i = 0; i < columns.length; i++) {
				const col = columns[i];
				const x = Math.round(i * pitch);
				const flip = frame % col.hold === 0;
				if (col.gm) {
					g.font = `600 ${gmPx}px "IBM Plex Mono", Consolas, monospace`;
					if (flip) col.seq = (col.seq + 1) % 13;
					const trail = 13;
					for (let k = 0; k < trail; k++) {
						const yy = Math.round((col.y - k) * rowGap);
						if (yy < -rowGap || yy > h) continue;
						const ch = GM_SEQ[(col.seq + k) % 13] ?? "G";
						g.fillStyle = rainbowAt(tMs, i, Math.floor(col.y) - k);
						g.fillText(ch === " " ? "·" : ch, x, yy);
					}
				} else {
					g.font = `800 ${classicPx}px "IBM Plex Mono", Consolas, monospace`;
					if (flip) {
						col.glyphs.pop();
						col.glyphs.unshift(glyph());
					}
					const y = Math.round(col.y * rowGap);
					const greens = [
						"#d8ff9a",
						"#b6ff7a",
						"#4dff3a",
						"#3dff1a",
						"#32c428",
						"#2f9e2c",
						"#268528",
						"#1d7a22",
						"#17661a",
						"#125214",
						"#0d3f10"
					];
					for (let k = 0; k < col.glyphs.length; k++) {
						const yy = y - k * rowGap;
						if (yy < -rowGap || yy > h) continue;
						const ch = col.glyphs[k] ?? "0";
						g.strokeStyle = "#031208";
						g.lineWidth = 1.35;
						g.strokeText(ch, x, yy);
						g.fillStyle = greens[k] ?? "#17661a";
						g.fillText(ch, x, yy);
					}
				}
				col.y += col.speed;
				if (!burstFall && col.y * rowGap > h && Math.random() > (reduced ? .992 : .975)) col.y = 0;
			}
			g.fillStyle = "#2f7d34";
			g.fillText(APP_NAME, 16, h - size * 2);
			raf = window.requestAnimationFrame(tick);
		}
		resize();
		window.addEventListener("resize", resize);
		raf = window.requestAnimationFrame(tick);
		return () => {
			running = false;
			window.cancelAnimationFrame(raf);
			window.removeEventListener("resize", resize);
		};
	}, [mode, rain]);
	if (mode === "off") return null;
	const burst = mode === "burst";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: burst ? "pointer-events-none fixed inset-0 z-[90] bg-bg/80" : "fixed inset-0 z-[90] bg-bg",
		role: "presentation",
		"aria-label": burst ? "G0DZ1LLa M0D3" : "Locked. Sign in again to continue.",
		onPointerDown: burst ? void 0 : () => window.location.assign("/login"),
		onKeyDown: burst ? void 0 : () => window.location.assign("/login"),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
			ref: canvasRef,
			className: "block h-full w-full"
		})
	});
}
var TERMS_PATH = "/terms";
var TERMS_TITLE = "Terms and Agreements";
var TERMS_HOVER = `${TERMS_TITLE} · using this website is agreement · not financial advice`;
var PRIVACY_PATH = "/privacy";
var PRIVACY_TITLE = "Privacy Policy";
var PRIVACY_HOVER = `${PRIVACY_TITLE} · no bot retention of system information · no reverse engineering without authorization`;
var LEGAL_NFA = "Not financial advice. Not licensed. Not a broker-dealer. Not an investment adviser. Not a recommendation to buy, sell, or hold bitcoin, any token, or any other asset. Education only. Seek a licensed professional. Invest only on the advice of a licensed advisor. You can lose all funds.";
var LEGAL_HOWEY = "Nothing on this website is an offer to sell or a solicitation to buy a security. A cultural ticker, if one exists on a public pad, is not shares of the desk, not a claim on bitcoin, not a share of profit, and not how the trading book is funded. The desk is funded only by operator cash and unconditional gifts that receive nothing back. Do not buy any ticker because bots, a treasury, or a bitcoin stack exist.";
var LEGAL_USE_IS_AGREEMENT = "By accessing or using this website you agree to the Terms and Agreements and the Privacy Policy. If you do not agree, do not use the site.";
var LEGAL_BOTS = "No bot, AI agent, crawler, or automated system may retain S1R1US.ai system information, internal capabilities, unpublished endpoints, operator identity, or non-public tape beyond what is required to display a single public Bot 7 call. No bot may steal source code, clone the desk, scrape internals, or reverse engineer this open-source software without prior written authorization from S1R1US.ai. This live website does not offer a source pack, zip, or archive for download. The public tree, if any, is GitHub under Apache-2.0 where stated — that is not a license to reconstruct operator vaults, YubiKey flows, Coinbase keys, admin panels, or unpublished internals. Failure to comply violates the Terms and the Privacy Policy and is unauthorized access. Any attempt to steal, clone, scrape internals, or reverse engineer this system without authorization may result in a civil lawsuit, criminal charges, or both, under applicable law.";
var LEGAL_UNLAWFUL = "Anyone who uses this website, the desk, the lab, Bot 7 feeds, agent APIs, or any related system unlawfully is subject to punishment by law. Unlawful use includes, without limitation, fraud, theft, unauthorized access, computer crime, market manipulation, money laundering, and any other civil or criminal violation. S1R1US.ai, the owners, and the operators may report suspected unlawful use to law enforcement and pursue all available remedies.";
var LEGAL_RECON = "Unauthorized reconnaissance is not allowed. You may not tamper with, probe, prod, ping, or scan this system to discover vulnerabilities, except for the published Bot 7 connection test at GET /api/agent/ping used as documented. Forbidden activity includes, without limitation: ICMP echo and other ICMP misuse; port, host, or vulnerability scanning; fuzzing; packet crafting; traceroute or similar network mapping aimed at internals; load or denial-of-service tests; credential stuffing; session hijacking; injection; and use of nmap, masscan, nuclei, sqlmap, Metasploit, or any other networking or exploit tooling against s1r1us.ai or its hosts. You may not insert malware, ransomware, backdoors, worms, trojans, cryptominers, or other unauthorized code. Reconnaissance for hacking, intrusion, or malware will be treated as unauthorized access and pursued legally when possible, including civil action and referral for criminal charges.";
var LEGAL_VENUE = "You agree that any dispute, claim, or legal situation arising out of or relating to these Terms, the Privacy Policy, or your use of the site will first be submitted to confidential mediation with the owners or operators. The venue for mediation and, if needed, for any later proceeding is the state (and courts) of the owner's sole choice. You waive objection to that venue, including inconvenient forum. Governing law is the law of that chosen state, without regard to conflict-of-law rules, except that U.S. federal law applies to federal claims.";
var LEGAL_COSTS = "The owners and operators of S1R1US.ai will not pay your legal expenses, attorney fees, court costs, expert fees, settlement costs, or any other costs you or any third party generate, regardless of how they arise, including claims you bring, claims brought against you, mediation, arbitration, or litigation. You agree to bear your own legal expenses. If the owners or operators incur costs because of your breach or unlawful use, you agree to reimburse those costs to the fullest extent allowed by law.";
var TERMS_UPDATED = "2026-09-05";
var TERMS_SECTIONS = [
	{
		id: "accept",
		title: "1. Acceptance by use",
		body: `These Terms and Agreements (the "Terms") are a binding agreement between you and ${LABS_NAME} (${APP_NAME}) for https://s1r1us.ai and related pages. Accessing, browsing, or otherwise using the website constitutes your agreement to these Terms and to the disclaimer below. If you do not agree, leave the site.`
	},
	{
		id: "nfa",
		title: "2. Not financial advice — seek a licensed professional",
		body: LEGAL_NFA
	},
	{
		id: "howey",
		title: "3. No offer of securities",
		body: `${LEGAL_HOWEY} Company public desk on X is ${COMPANY_X_HANDLE}. That account is not an invitation to purchase a security. This site does not sell tokens.`
	},
	{
		id: "token",
		title: "4. T0K3N L@UNCH (Token launch)",
		body: `A cultural ticker named s1r1us may appear on a public meme pad such as pump.fun. T0K3N L@UNCH is also searched as Token launch. It is not ${TAB_DESK} (S1R1US 7-bot hedge fund). It is not equity, debt, a profit share, a vote, or a claim on any bitcoin, USDC, or other asset held by the desk. Creator fees, bonding-curve inventory, and locked LP (if any) are not the Coinbase book and are not used to buy bitcoin for holders. This website does not take orders for that ticker and does not promise price, liquidity, or profit from anyone's efforts.`
	},
	{
		id: "desk",
		title: "5. The desk, lab, and sleeves",
		body: `${TAB_DESK} (S1R1US 7-bot hedge fund), ${TAB_LAB} (S1R1US Lab Strategies), ${TAB_GM} (Godzilla mode), and ${TAB_FEED} (Feed Hosting) are educational tools and open-source software. Practice and paper fills are not live orders. Live execution, if ever unlocked, is the operator's own risk. You are responsible for any action you take.`
	},
	{
		id: "gifts",
		title: "6. Donations and gifts",
		body: `${TAB_FEED} wallets, if used, are optional gifts to help pay hosting, domain, and app-store fees. ${TAB_COFFEE} (${SEO_TAB_COFFEE}) is a suggested $${SUPPORT_COFFEE_USD.toFixed(2)} gift to assist long programming days at s1r1us.ai. ${SUPPORT_GIFT_RECEIPT} Gifts buy no ticker, no equity, no profit share, and no service level. Bitcoin (BTC) to the stated BTC address. USDC (Ethereum ERC-20 + Base) to the stated 0x address — same address on both chains, native Circle USDC only. Do not send anything except the stated asset on the stated network. Wrong-network sends can be lost. F33D is not the trading book and not the token.`
	},
	{
		id: "risk",
		title: "7. Risk of loss",
		body: "Cryptocurrency, bitcoin, tokens, and software can fail, be hacked, fork, halt, or go to zero. Past tape is not future results. You can lose all money you put at risk. No warranty of uptime, accuracy, or fitness. Software is provided as-is."
	},
	{
		id: "third",
		title: "8. Third-party sites",
		body: "Links to X, GitHub, pump.fun, explorers, or other sites are for reference. We do not control those sites. Their terms apply there. A screenshot or post about a pad is not a sale by this website."
	},
	{
		id: "ip",
		title: "9. Open source and marks",
		body: `${APP_NAME} source is offered under Apache License 2.0 where stated on GitHub. Brand marks stay with ${LABS_NAME}. Do not imply we endorse your trades. ${LEGAL_BOTS}`
	},
	{
		id: "conduct",
		title: "10. Prohibited use",
		body: `Do not use the site to commit crime, to scrape in a way that harms the service, or to market an unregistered security as if it were this desk. Do not paste seeds, Coinbase keys, or one-time codes into any form. ${LEGAL_UNLAWFUL} ${LEGAL_RECON} ${LEGAL_BOTS} Unauthorized reverse engineering, retention of system information, or theft of source is a breach of these Terms and may result in a lawsuit or criminal charges.`
	},
	{
		id: "bots",
		title: "11. Bots, agents, and reverse engineering",
		body: LEGAL_BOTS
	},
	{
		id: "recon",
		title: "12. No reconnaissance, probing, or malware",
		body: LEGAL_RECON
	},
	{
		id: "venue",
		title: "13. Mediation and venue",
		body: LEGAL_VENUE
	},
	{
		id: "costs",
		title: "14. Legal expenses",
		body: LEGAL_COSTS
	},
	{
		id: "changes",
		title: "15. Changes",
		body: `We may update these Terms. The date at the top of the Terms page is the current version. Continued use after a change is agreement to the new Terms. Last updated ${TERMS_UPDATED}. Canonical: ${SEO_CANONICAL.replace(/\/$/, "")}${TERMS_PATH}.`
	}
];
var PRIVACY_UPDATED = TERMS_UPDATED;
var PRIVACY_SECTIONS = [
	{
		id: "scope",
		title: "1. Scope",
		body: `This Privacy Policy covers https://s1r1us.ai and related pages operated by ${LABS_NAME} (${APP_NAME}). Using the site is also agreement to the Terms, including the ban on reconnaissance, probing, and malware. Canonical: ${SEO_CANONICAL.replace(/\/$/, "")}${PRIVACY_PATH}. Last updated ${PRIVACY_UPDATED}.`
	},
	{
		id: "collect",
		title: "2. What we collect",
		body: "We may process technical logs (IP, User-Agent, path, time) to run rate limits and keep the desk up. Sign-in with X, if used, receives the account the OAuth provider shares. We do not ask for Coinbase keys, seeds, or Yubi secrets. Optional gifts (BTC/USDC) are on-chain and public; we do not need your identity to receive them. BYO xAI keys, if pasted, are used for that Ask Grok call and are not stored as a vault."
	},
	{
		id: "bots",
		title: "3. Bots may not retain system information",
		body: LEGAL_BOTS
	},
	{
		id: "source",
		title: "4. Source code and reverse engineering",
		body: "The public GitHub tree is Apache-2.0 where stated. That license is not permission to steal unpublished source, to reverse engineer internals, or to retain system information for cloning the desk. Operator vault, YubiKey ceremony, Coinbase book, admin routes, and unpublished capabilities stay private. Use without S1R1US.ai authorization is a violation of the Terms and this Policy and may result in a civil lawsuit, criminal charges, or both."
	},
	{
		id: "share",
		title: "5. Sharing",
		body: "We do not sell personal data. Hosting, DNS, auth, and analytics vendors may process technical logs as needed to serve the site. On-chain gifts are public by design."
	},
	{
		id: "rights",
		title: "6. Contact and changes",
		body: `Questions: company desk on X as published on the site. We may update this Policy; the date above is current. Continued use is agreement. See also ${TERMS_TITLE} at ${TERMS_PATH}.`
	}
];
//#endregion
export { MatrixSaver as a, PRIVACY_SECTIONS as c, TERMS_HOVER as d, TERMS_PATH as f, rainGmBurst as g, TERMS_UPDATED as h, LEGAL_USE_IS_AGREEMENT as i, PRIVACY_TITLE as l, TERMS_TITLE as m, LEGAL_HOWEY as n, PRIVACY_HOVER as o, TERMS_SECTIONS as p, LEGAL_NFA as r, PRIVACY_PATH as s, LEGAL_BOTS as t, PRIVACY_UPDATED as u };
