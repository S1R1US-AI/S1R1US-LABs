globalThis.__nitro_main__ = import.meta.url;
import { a as redirect$1, c as NodeResponse, i as defineLazyEventHandler, l as serve, n as HTTPError, o as toEventHandler, r as defineHandler, t as H3Core } from "./_libs/h3+rou3+srvx.mjs";
import { a as withoutBase, i as withQuery, n as joinURL, o as withoutTrailingSlash, r as withLeadingSlash, t as decodePath } from "./_libs/ufo.mjs";
import { existsSync, promises, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";
//#region node_modules/nitro/dist/runtime/internal/route-rules.mjs
var headers = ((m) => function headersRouteRule(event) {
	for (const [key, value] of Object.entries(m.options || {})) event.res.headers.set(key, value);
});
var redirect = ((m) => function redirectRouteRule(event) {
	let target = m.options?.to;
	if (!target) return;
	if (target.endsWith("/**")) {
		let targetPath = event.url.pathname + event.url.search;
		const strpBase = m.options._redirectStripBase;
		if (strpBase) {
			if (!isPathInScope(event.url.pathname, strpBase)) throw new HTTPError({ status: 400 });
			targetPath = withoutBase(targetPath, strpBase);
		} else if (targetPath.startsWith("//")) targetPath = targetPath.replace(/^\/+/, "/");
		target = joinURL(target.slice(0, -3), targetPath);
	} else if (event.url.search) target = withQuery(target, Object.fromEntries(event.url.searchParams));
	return redirect$1(target, m.options?.status);
});
function isPathInScope(pathname, base) {
	let canonical;
	try {
		const pre = pathname.replace(/%2f/gi, "/").replace(/%5c/gi, "\\");
		canonical = new URL(pre, "http://_").pathname;
	} catch {
		return false;
	}
	return !base || canonical === base || canonical.startsWith(base + "/");
}
//#endregion
//#region #nitro/virtual/public-assets-data
var public_assets_data_default = {
	"/AI-Agent-Lock-System-for-AI-Agent-BTC-Trading-Bot.gif": {
		"type": "image/gif",
		"etag": "\"60f2-AKZH+Ln1OQGO8erY2SxNALPTEn0\"",
		"mtime": "2026-10-09T02:46:48.737Z",
		"size": 24818,
		"path": "../public/AI-Agent-Lock-System-for-AI-Agent-BTC-Trading-Bot.gif"
	},
	"/AI-Bitcoin-Trading-Bot.gif": {
		"type": "image/gif",
		"etag": "\"54d8f-2ZwGMHE/O8ba21JBEtRoVmAv82k\"",
		"mtime": "2026-10-09T02:46:48.737Z",
		"size": 347535,
		"path": "../public/AI-Bitcoin-Trading-Bot.gif"
	},
	"/Bitcoin-Miner-for-Accumulation-System.gif": {
		"type": "image/gif",
		"etag": "\"177d4-xfw1gCl5gUXfIbl1pY2UYZjLSL8\"",
		"mtime": "2026-10-09T02:46:48.737Z",
		"size": 96212,
		"path": "../public/Bitcoin-Miner-for-Accumulation-System.gif"
	},
	"/Bitcoin-USDC-Server-Hosting-Gift.gif": {
		"type": "image/gif",
		"etag": "\"db20-CeP9A5Bcl8Q2ojoW8rmg2o3SJkk\"",
		"mtime": "2026-10-09T02:46:48.741Z",
		"size": 56096,
		"path": "../public/Bitcoin-USDC-Server-Hosting-Gift.gif"
	},
	"/Buy-Me-a-Coffee-Bitcoin-USDC-Gift.gif": {
		"type": "image/gif",
		"etag": "\"12a2a-3dcCftLk1poHkCWXOaqYXSXvzUY\"",
		"mtime": "2026-10-09T02:46:48.741Z",
		"size": 76330,
		"path": "../public/Buy-Me-a-Coffee-Bitcoin-USDC-Gift.gif"
	},
	"/Coffee-Tip-AI-Bitcoin-Trading-Bot.gif": {
		"type": "image/gif",
		"etag": "\"9a6d-yh3gi1rJm6pcw+q8wJKYNtpY2AE\"",
		"mtime": "2026-10-09T02:46:48.741Z",
		"size": 39533,
		"path": "../public/Coffee-Tip-AI-Bitcoin-Trading-Bot.gif"
	},
	"/Connect-Bitcoin-Miners-to-AI-Hive-Swarm.gif": {
		"type": "image/gif",
		"etag": "\"8a1b-9NS8CzU1K1sE50ss5CPE7pKkDhg\"",
		"mtime": "2026-10-09T02:46:48.741Z",
		"size": 35355,
		"path": "../public/Connect-Bitcoin-Miners-to-AI-Hive-Swarm.gif"
	},
	"/Crowdfund-AI-Bitcoin-Trading-Bot-Goal.gif": {
		"type": "image/gif",
		"etag": "\"9d7a-G2K7xMnCVna6m7NlXGVAcJnGLuY\"",
		"mtime": "2026-10-09T02:46:48.741Z",
		"size": 40314,
		"path": "../public/Crowdfund-AI-Bitcoin-Trading-Bot-Goal.gif"
	},
	"/Crypto-Coffee-Donation-Open-Source-Bot.gif": {
		"type": "image/gif",
		"etag": "\"b12f-2hsx/9qGoE9EnB8cCpcn1MXXFGk\"",
		"mtime": "2026-10-09T02:46:48.741Z",
		"size": 45359,
		"path": "../public/Crypto-Coffee-Donation-Open-Source-Bot.gif"
	},
	"/Feed-Hosting-Donation-AI-Bitcoin-Trading-Bot.gif": {
		"type": "image/gif",
		"etag": "\"1715d-8vyUcpMwoaKqccmwuefRnq5Ji+g\"",
		"mtime": "2026-10-09T02:46:48.745Z",
		"size": 94557,
		"path": "../public/Feed-Hosting-Donation-AI-Bitcoin-Trading-Bot.gif"
	},
	"/S1R!US-Godzilla-Logo.jpg": {
		"type": "image/jpeg",
		"etag": "\"63cfd-8pfk3Z1cvTmYMsxx2h8FtmoiXmM\"",
		"mtime": "2026-10-09T02:46:48.749Z",
		"size": 408829,
		"path": "../public/S1R!US-Godzilla-Logo.jpg"
	},
	"/S1R1US-GitHub-README.pdf": {
		"type": "application/pdf",
		"etag": "\"106e-rN2CRZhbvXtgFZ67sW7PPTgQN0E\"",
		"mtime": "2026-10-09T02:46:48.749Z",
		"size": 4206,
		"path": "../public/S1R1US-GitHub-README.pdf"
	},
	"/S1R1US-LAB-open-source.pdf": {
		"type": "application/pdf",
		"etag": "\"495ae-Sw3SrH+VF84AMVcaukBzA6QuGHk\"",
		"mtime": "2026-10-09T02:46:48.749Z",
		"size": 300462,
		"path": "../public/S1R1US-LAB-open-source.pdf"
	},
	"/S1R1US-Morning-Report.pdf": {
		"type": "application/pdf",
		"etag": "\"2a2c-C9lSE+GhdSSM8VsNZ/SH62V4dkw\"",
		"mtime": "2026-10-09T02:46:48.749Z",
		"size": 10796,
		"path": "../public/S1R1US-Morning-Report.pdf"
	},
	"/Solo-CKPool-Bitcoin-Miner-Hash-Power.gif": {
		"type": "image/gif",
		"etag": "\"d0e1-MdOyT8F9JMqTldoovYga6qM6Rec\"",
		"mtime": "2026-10-09T02:46:48.749Z",
		"size": 53473,
		"path": "../public/Solo-CKPool-Bitcoin-Miner-Hash-Power.gif"
	},
	"/Sponsor-AI-Bitcoin-Trading-Bot.gif": {
		"type": "image/gif",
		"etag": "\"186e2-oepUzJHhtc2etb1/fblJXHTr5eo\"",
		"mtime": "2026-10-09T02:46:48.749Z",
		"size": 100066,
		"path": "../public/Sponsor-AI-Bitcoin-Trading-Bot.gif"
	},
	"/Sponsor-Open-Source-Bitcoin-Bot-Heart.gif": {
		"type": "image/gif",
		"etag": "\"a89d-4lKc12nlnSTzZ8u43G4iZKqHdFs\"",
		"mtime": "2026-10-09T02:46:48.753Z",
		"size": 43165,
		"path": "../public/Sponsor-Open-Source-Bitcoin-Bot-Heart.gif"
	},
	"/Transparent-On-Chain-Funding-Bitcoin-Bot.gif": {
		"type": "image/gif",
		"etag": "\"b3bc-lRaeXV9IejJJs890E285pfofph0\"",
		"mtime": "2026-10-09T02:46:48.753Z",
		"size": 46012,
		"path": "../public/Transparent-On-Chain-Funding-Bitcoin-Bot.gif"
	},
	"/apple-touch-icon.png": {
		"type": "image/png",
		"etag": "\"fd53-oSsa/t1f9y5jjjEwMOHxzP5GKpk\"",
		"mtime": "2026-10-09T02:46:48.753Z",
		"size": 64851,
		"path": "../public/apple-touch-icon.png"
	},
	"/brand.txt": {
		"type": "text/plain; charset=utf-8",
		"etag": "\"6aa-guqe+KKsEKkT3rA/zLwND1IIarc\"",
		"mtime": "2026-10-09T02:46:48.753Z",
		"size": 1706,
		"path": "../public/brand.txt"
	},
	"/favicon-32.png": {
		"type": "image/png",
		"etag": "\"a21-vNEyfwOdN2oydy42QwMk+obdAyE\"",
		"mtime": "2026-10-09T02:46:48.753Z",
		"size": 2593,
		"path": "../public/favicon-32.png"
	},
	"/favicon-16.png": {
		"type": "image/png",
		"etag": "\"338-Lgn/lG6U4FH0qIB/c7SwEX/NGfs\"",
		"mtime": "2026-10-09T02:46:48.753Z",
		"size": 824,
		"path": "../public/favicon-16.png"
	},
	"/favicon-48.png": {
		"type": "image/png",
		"etag": "\"14a1-cdgByRTTp0VNZgdnijx1d5FflH4\"",
		"mtime": "2026-10-09T02:46:48.753Z",
		"size": 5281,
		"path": "../public/favicon-48.png"
	},
	"/favicon-96.png": {
		"type": "image/png",
		"etag": "\"4ba3-h/R8EuGQ/v4j7gINV7b39Vr9ItI\"",
		"mtime": "2026-10-09T02:46:48.753Z",
		"size": 19363,
		"path": "../public/favicon-96.png"
	},
	"/S1R!US-Godzilla-Logo-hologram.jpg": {
		"type": "image/jpeg",
		"etag": "\"995ef-Ti7x6zefgPo1NX4uzMz5s8oDwb0\"",
		"mtime": "2026-10-09T02:46:48.745Z",
		"size": 628207,
		"path": "../public/S1R!US-Godzilla-Logo-hologram.jpg"
	},
	"/favicon.ico": {
		"type": "image/vnd.microsoft.icon",
		"etag": "\"2283-uepYxU7NSrCP5az90rAx8snu1jg\"",
		"mtime": "2026-10-09T02:46:48.753Z",
		"size": 8835,
		"path": "../public/favicon.ico"
	},
	"/favicon.svg": {
		"type": "image/svg+xml",
		"etag": "\"831-a3WbDovf6XAT/DHX7cu3VMMx0NE\"",
		"mtime": "2026-10-09T02:46:48.753Z",
		"size": 2097,
		"path": "../public/favicon.svg"
	},
	"/field-report.md": {
		"type": "text/markdown; charset=utf-8",
		"etag": "\"4d9d-osgOKfAj38QvWrhzVdvO62BiFb0\"",
		"mtime": "2026-10-09T02:46:48.753Z",
		"size": 19869,
		"path": "../public/field-report.md"
	},
	"/gzilla-mrkt.png": {
		"type": "image/png",
		"etag": "\"389fe-uu3wXstJ3uGszqWG2gQUUJQFpJE\"",
		"mtime": "2026-10-09T02:46:48.753Z",
		"size": 231934,
		"path": "../public/gzilla-mrkt.png"
	},
	"/helios-desk-guide.md": {
		"type": "text/markdown; charset=utf-8",
		"etag": "\"24e9-9O5ftIS0zNuClIFDLmQ58PNYGwo\"",
		"mtime": "2026-10-09T02:46:48.761Z",
		"size": 9449,
		"path": "../public/helios-desk-guide.md"
	},
	"/helios-desk-guide.pdf": {
		"type": "application/pdf",
		"etag": "\"2503-RUj3r6R+y9IISosSiFa9ex52Ne4\"",
		"mtime": "2026-10-09T02:46:48.761Z",
		"size": 9475,
		"path": "../public/helios-desk-guide.pdf"
	},
	"/hide-x-tab.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"d8-tgr/ZS8VCTIqNSeRuknhrs4YOE4\"",
		"mtime": "2026-10-09T02:46:48.761Z",
		"size": 216,
		"path": "../public/hide-x-tab.css"
	},
	"/humans.txt": {
		"type": "text/plain; charset=utf-8",
		"etag": "\"6a9-vnUwIACwERLINJORXYHQ654432M\"",
		"mtime": "2026-10-09T02:46:48.761Z",
		"size": 1705,
		"path": "../public/humans.txt"
	},
	"/icon-192.png": {
		"type": "image/png",
		"etag": "\"11f7a-QV8cNhoBiz9sUOM3oHQHmhgoqP0\"",
		"mtime": "2026-10-09T02:46:48.761Z",
		"size": 73594,
		"path": "../public/icon-192.png"
	},
	"/icon-256.png": {
		"type": "image/png",
		"etag": "\"1f46c-QG6B8/fmzo/GgUi+63ObOzCRfgk\"",
		"mtime": "2026-10-09T02:46:48.761Z",
		"size": 128108,
		"path": "../public/icon-256.png"
	},
	"/icon-512-maskable.png": {
		"type": "image/png",
		"etag": "\"4f3b8-EbOJ6adgDaSOeFnJHTxKcSYkKrg\"",
		"mtime": "2026-10-09T02:46:48.765Z",
		"size": 324536,
		"path": "../public/icon-512-maskable.png"
	},
	"/icon-512.png": {
		"type": "image/png",
		"etag": "\"7938a-IvmRuCPpc+SgSK31ZiZrkpqxs3g\"",
		"mtime": "2026-10-09T02:46:48.765Z",
		"size": 496522,
		"path": "../public/icon-512.png"
	},
	"/l0ck-status-banner.jpg": {
		"type": "image/jpeg",
		"etag": "\"6427d-dPL6dpU107BS8Eu6asSOf1aCMDU\"",
		"mtime": "2026-10-09T02:46:48.765Z",
		"size": 410237,
		"path": "../public/l0ck-status-banner.jpg"
	},
	"/llms.txt": {
		"type": "text/plain; charset=utf-8",
		"etag": "\"8249-aaJoK49YWXKq4I518MMCUQL6Dkk\"",
		"mtime": "2026-10-09T14:20:00.000Z",
		"size": 33353,
		"path": "../public/llms.txt"
	},
	"/lock-closed.gif": {
		"type": "image/gif",
		"etag": "\"60ed-gsyLyX4170JlxntzWsPWaAHmTp4\"",
		"mtime": "2026-10-09T02:46:48.765Z",
		"size": 24813,
		"path": "../public/lock-closed.gif"
	},
	"/lock-open.gif": {
		"type": "image/gif",
		"etag": "\"60f2-AKZH+Ln1OQGO8erY2SxNALPTEn0\"",
		"mtime": "2026-10-09T02:46:48.765Z",
		"size": 24818,
		"path": "../public/lock-open.gif"
	},
	"/morning-report-1.jpg": {
		"type": "image/jpeg",
		"etag": "\"38e50-s2q5BM1Fn23iPwXKB6YvJdDLrN8\"",
		"mtime": "2026-10-09T02:46:48.765Z",
		"size": 233040,
		"path": "../public/morning-report-1.jpg"
	},
	"/morning-report-2.jpg": {
		"type": "image/jpeg",
		"etag": "\"3629c-Ha+7XTJMITl1cHLyUvSGzSdDJFM\"",
		"mtime": "2026-10-09T02:46:48.769Z",
		"size": 221852,
		"path": "../public/morning-report-2.jpg"
	},
	"/morning-report-3.jpg": {
		"type": "image/jpeg",
		"etag": "\"1b5c8-wfDOLJawDjf4GuA+opgXexLi4mA\"",
		"mtime": "2026-10-09T02:46:48.769Z",
		"size": 112072,
		"path": "../public/morning-report-3.jpg"
	},
	"/morning-report-4.jpg": {
		"type": "image/jpeg",
		"etag": "\"28595-syEU09tqUv3A3IAwoi2zt6n82kw\"",
		"mtime": "2026-10-09T02:46:48.769Z",
		"size": 165269,
		"path": "../public/morning-report-4.jpg"
	},
	"/gzilla-holo.jpg": {
		"type": "image/jpeg",
		"etag": "\"de846-rnVsM3z2Pj6M3NVfiL3dume8fjE\"",
		"mtime": "2026-10-09T02:46:48.753Z",
		"size": 911430,
		"path": "../public/gzilla-holo.jpg"
	},
	"/h1v3-bee-mascot.jpg": {
		"type": "image/jpeg",
		"etag": "\"8e159-PfVZ0Gn0au4ikZHtPlMdC0H/94s\"",
		"mtime": "2026-10-09T02:46:48.753Z",
		"size": 581977,
		"path": "../public/h1v3-bee-mascot.jpg"
	},
	"/h1v3-swarm-meme.jpg": {
		"type": "image/jpeg",
		"etag": "\"c0e78-+i9F5AA7x8uIdLDnTVomsvnIUDQ\"",
		"mtime": "2026-10-09T02:46:48.761Z",
		"size": 790136,
		"path": "../public/h1v3-swarm-meme.jpg"
	},
	"/h1v3-swarm-banner.jpg": {
		"type": "image/jpeg",
		"etag": "\"b018e-gnOH3YrTcawWtqiJPqRMyGefP8Y\"",
		"mtime": "2026-10-09T02:46:48.757Z",
		"size": 721294,
		"path": "../public/h1v3-swarm-banner.jpg"
	},
	"/morning-report-5.jpg": {
		"type": "image/jpeg",
		"etag": "\"13ef7-mFhYpyl783NuLSf7QZZzL2u9rso\"",
		"mtime": "2026-10-09T02:46:48.769Z",
		"size": 81655,
		"path": "../public/morning-report-5.jpg"
	},
	"/og.jpg": {
		"type": "image/jpeg",
		"etag": "\"2a527-qk/eeSzlM6qqs0CG+ntiGVqjNVU\"",
		"mtime": "2026-10-09T02:46:48.769Z",
		"size": 173351,
		"path": "../public/og.jpg"
	},
	"/oss-brief-1.jpg": {
		"type": "image/jpeg",
		"etag": "\"129a1-iUqaLGmOQ8lCj95T1+o/GJvBjtA\"",
		"mtime": "2026-10-09T02:46:48.769Z",
		"size": 76193,
		"path": "../public/oss-brief-1.jpg"
	},
	"/oss-brief-2.jpg": {
		"type": "image/jpeg",
		"etag": "\"31d84-PzY/fuYBYZAARKxB/ZgAHz8nt/I\"",
		"mtime": "2026-10-09T02:46:48.769Z",
		"size": 204164,
		"path": "../public/oss-brief-2.jpg"
	},
	"/oss-brief-3.jpg": {
		"type": "image/jpeg",
		"etag": "\"322c8-pqE1xwzZOgEMAUAWBdu4UjO9Amc\"",
		"mtime": "2026-10-09T02:46:48.769Z",
		"size": 205512,
		"path": "../public/oss-brief-3.jpg"
	},
	"/robots.txt": {
		"type": "text/plain; charset=utf-8",
		"etag": "\"cbc-2AoOf6Yvo+W0wci0V3Ed1SwPLyY\"",
		"mtime": "2026-10-09T02:46:48.769Z",
		"size": 3260,
		"path": "../public/robots.txt"
	},
	"/s1r1us-avatar.jpg": {
		"type": "image/jpeg",
		"etag": "\"11104-mcvouptINXZ3Faca6jTwcTD4AY8\"",
		"mtime": "2026-10-09T02:46:48.773Z",
		"size": 69892,
		"path": "../public/s1r1us-avatar.jpg"
	},
	"/s1r1us-godzilla-logo-180.jpg": {
		"type": "image/jpeg",
		"etag": "\"3f02-bVTjDi5TKOXu6zpGdSYYB6HK1NU\"",
		"mtime": "2026-10-09T02:46:48.769Z",
		"size": 16130,
		"path": "../public/s1r1us-godzilla-logo-180.jpg"
	},
	"/s1r1us-godzilla-logo-180.png": {
		"type": "image/png",
		"etag": "\"fd53-oSsa/t1f9y5jjjEwMOHxzP5GKpk\"",
		"mtime": "2026-10-09T02:46:48.769Z",
		"size": 64851,
		"path": "../public/s1r1us-godzilla-logo-180.png"
	},
	"/s1r1us-godzilla-logo.jpg": {
		"type": "image/jpeg",
		"etag": "\"63cfd-8pfk3Z1cvTmYMsxx2h8FtmoiXmM\"",
		"mtime": "2026-10-09T02:46:48.773Z",
		"size": 408829,
		"path": "../public/s1r1us-godzilla-logo.jpg"
	},
	"/s1r1us-x-banner.jpg": {
		"type": "image/jpeg",
		"etag": "\"29f85-6aTibQEWNDCNbllK06OXj1I3yqo\"",
		"mtime": "2026-10-09T02:46:48.773Z",
		"size": 171909,
		"path": "../public/s1r1us-x-banner.jpg"
	},
	"/s1r1us-x-art.png": {
		"type": "image/png",
		"etag": "\"35c68-WOS7KFoR8Gl966PHRrHd4PzsOnw\"",
		"mtime": "2026-10-09T02:46:48.773Z",
		"size": 220264,
		"path": "../public/s1r1us-x-art.png"
	},
	"/s1rius-oss.pdf": {
		"type": "application/pdf",
		"etag": "\"495ae-ihIBjAP0pVCLk+fNEVMktveN23c\"",
		"mtime": "2026-10-09T02:46:48.777Z",
		"size": 300462,
		"path": "../public/s1rius-oss.pdf"
	},
	"/sitemap-index.xml": {
		"type": "application/xml",
		"etag": "\"150-3nrb6ETucMYCifekGQdEL6U7vh0\"",
		"mtime": "2026-10-09T02:46:48.773Z",
		"size": 336,
		"path": "../public/sitemap-index.xml"
	},
	"/x-banner.jpg": {
		"type": "image/jpeg",
		"etag": "\"dc1f-DvowoSU3Ml1l0W033OmE5KU0sak\"",
		"mtime": "2026-10-09T02:46:48.777Z",
		"size": 56351,
		"path": "../public/x-banner.jpg"
	},
	"/.well-known/discord": {
		"type": "text/plain; charset=utf-8",
		"etag": "\"2c-l25smKdvWAYfGJKcNN9N3s77uz0\"",
		"mtime": "2026-10-09T02:46:48.645Z",
		"size": 44,
		"path": "../public/.well-known/discord"
	},
	"/.well-known/llms.txt": {
		"type": "text/plain; charset=utf-8",
		"etag": "\"8249-aaJoK49YWXKq4I518MMCUQL6Dkk\"",
		"mtime": "2026-10-09T14:20:00.000Z",
		"size": 33353,
		"path": "../public/.well-known/llms.txt"
	},
	"/.well-known/security.txt": {
		"type": "text/plain; charset=utf-8",
		"etag": "\"193-KIlpvS4Ix0Uhm3KoXDDNrzrS4s8\"",
		"mtime": "2026-10-09T02:46:48.645Z",
		"size": 403,
		"path": "../public/.well-known/security.txt"
	},
	"/owl.png": {
		"type": "image/png",
		"etag": "\"bb80d-5YIpH1K03a5MKKWnHRYtxVO4u0A\"",
		"mtime": "2026-10-09T02:46:48.773Z",
		"size": 768013,
		"path": "../public/owl.png"
	},
	"/__grok/icon-180.png": {
		"type": "image/png",
		"etag": "\"fd53-oSsa/t1f9y5jjjEwMOHxzP5GKpk\"",
		"mtime": "2026-10-09T02:46:48.645Z",
		"size": 64851,
		"path": "../public/__grok/icon-180.png"
	},
	"/morning-lib/2026-09-03-1.jpg": {
		"type": "image/jpeg",
		"etag": "\"32f09-gH0GthQCoJJ4wV9dJcDSqcBXXgI\"",
		"mtime": "2026-10-09T02:46:48.645Z",
		"size": 208649,
		"path": "../public/morning-lib/2026-09-03-1.jpg"
	},
	"/morning-lib/2026-09-03-2.jpg": {
		"type": "image/jpeg",
		"etag": "\"1f892-PL3Gsenvvi1mcMOC1UNbadTqovU\"",
		"mtime": "2026-10-09T02:46:48.645Z",
		"size": 129170,
		"path": "../public/morning-lib/2026-09-03-2.jpg"
	},
	"/super-bowl-ai-agents-tiktok.jpg": {
		"type": "image/jpeg",
		"etag": "\"c9e59-fhEEbwes/i+9yKMfXnXQ7QgPqrA\"",
		"mtime": "2026-10-09T02:46:48.777Z",
		"size": 826969,
		"path": "../public/super-bowl-ai-agents-tiktok.jpg"
	},
	"/super-bowl-ai-agents-banner.jpg": {
		"type": "image/jpeg",
		"etag": "\"c90c7-oRdgi6RTcCsPcgpyxFcd/T3AAf8\"",
		"mtime": "2026-10-09T02:46:48.777Z",
		"size": 823495,
		"path": "../public/super-bowl-ai-agents-banner.jpg"
	},
	"/world-cup-ai-quant-btc.jpg": {
		"type": "image/jpeg",
		"etag": "\"cd0f7-tE/AYB/mKRGq3wV+F8+j3awipYg\"",
		"mtime": "2026-10-09T02:46:48.777Z",
		"size": 839927,
		"path": "../public/world-cup-ai-quant-btc.jpg"
	},
	"/pdf.worker.min.mjs": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"134f05-SQspzg3O0OO7758aY8KzAQU3q94\"",
		"mtime": "2026-10-09T02:46:48.773Z",
		"size": 1265413,
		"path": "../public/pdf.worker.min.mjs"
	},
	"/morning-lib/2026-09-03.pdf": {
		"type": "application/pdf",
		"etag": "\"133b-ViP8wtNAQSNshxmHpR03dZVEaNI\"",
		"mtime": "2026-10-09T02:46:48.645Z",
		"size": 4923,
		"path": "../public/morning-lib/2026-09-03.pdf"
	},
	"/morning-lib/2026-09-04-2.jpg": {
		"type": "image/jpeg",
		"etag": "\"1f892-PL3Gsenvvi1mcMOC1UNbadTqovU\"",
		"mtime": "2026-10-09T02:46:48.645Z",
		"size": 129170,
		"path": "../public/morning-lib/2026-09-04-2.jpg"
	},
	"/morning-lib/2026-09-04-1.jpg": {
		"type": "image/jpeg",
		"etag": "\"32f09-gH0GthQCoJJ4wV9dJcDSqcBXXgI\"",
		"mtime": "2026-10-09T02:46:48.645Z",
		"size": 208649,
		"path": "../public/morning-lib/2026-09-04-1.jpg"
	},
	"/morning-lib/2026-09-04-3.jpg": {
		"type": "image/jpeg",
		"etag": "\"2ef8f-nCfjXQsH79bzZp6j+3+K6CqZ7iI\"",
		"mtime": "2026-10-09T02:46:48.645Z",
		"size": 192399,
		"path": "../public/morning-lib/2026-09-04-3.jpg"
	},
	"/morning-lib/2026-09-04-4.jpg": {
		"type": "image/jpeg",
		"etag": "\"aa8c-8co+D8K7yz4NUZ9fuEHTvfVgbA4\"",
		"mtime": "2026-10-09T02:46:48.645Z",
		"size": 43660,
		"path": "../public/morning-lib/2026-09-04-4.jpg"
	},
	"/morning-lib/2026-09-04.pdf": {
		"type": "application/pdf",
		"etag": "\"133b-ViP8wtNAQSNshxmHpR03dZVEaNI\"",
		"mtime": "2026-10-09T02:46:48.649Z",
		"size": 4923,
		"path": "../public/morning-lib/2026-09-04.pdf"
	},
	"/morning-lib/2026-09-06-2.jpg": {
		"type": "image/jpeg",
		"etag": "\"3629c-Ha+7XTJMITl1cHLyUvSGzSdDJFM\"",
		"mtime": "2026-10-09T02:46:48.649Z",
		"size": 221852,
		"path": "../public/morning-lib/2026-09-06-2.jpg"
	},
	"/morning-lib/2026-09-06-1.jpg": {
		"type": "image/jpeg",
		"etag": "\"38e50-s2q5BM1Fn23iPwXKB6YvJdDLrN8\"",
		"mtime": "2026-10-09T02:46:48.649Z",
		"size": 233040,
		"path": "../public/morning-lib/2026-09-06-1.jpg"
	},
	"/morning-lib/2026-09-06-3.jpg": {
		"type": "image/jpeg",
		"etag": "\"1b5c8-wfDOLJawDjf4GuA+opgXexLi4mA\"",
		"mtime": "2026-10-09T02:46:48.649Z",
		"size": 112072,
		"path": "../public/morning-lib/2026-09-06-3.jpg"
	},
	"/morning-lib/2026-09-06.pdf": {
		"type": "application/pdf",
		"etag": "\"2a2c-C9lSE+GhdSSM8VsNZ/SH62V4dkw\"",
		"mtime": "2026-10-09T02:46:48.649Z",
		"size": 10796,
		"path": "../public/morning-lib/2026-09-06.pdf"
	},
	"/assets/Bitcoin-Miners-CogFEU1b.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"121e-BaZ7+4hBK17aXJQIvccK++sdiV0\"",
		"mtime": "2026-10-09T02:46:47.393Z",
		"size": 4638,
		"path": "../public/assets/Bitcoin-Miners-CogFEU1b.js"
	},
	"/morning-lib/2026-09-06-5.jpg": {
		"type": "image/jpeg",
		"etag": "\"13ef7-mFhYpyl783NuLSf7QZZzL2u9rso\"",
		"mtime": "2026-10-09T02:46:48.649Z",
		"size": 81655,
		"path": "../public/morning-lib/2026-09-06-5.jpg"
	},
	"/assets/__vite-browser-external-2W3EstLn.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"67-SVoBi+jCWjE3Mb8msJAJLl1TehE\"",
		"mtime": "2026-10-09T02:46:47.393Z",
		"size": 103,
		"path": "../public/assets/__vite-browser-external-2W3EstLn.js"
	},
	"/assets/ComposedChart-DSVmU6qM.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"625f3-H4kYInsn8EboAYiAIew/sDCIKWc\"",
		"mtime": "2026-10-09T02:46:47.393Z",
		"size": 402931,
		"path": "../public/assets/ComposedChart-DSVmU6qM.js"
	},
	"/morning-lib/2026-09-06-4.jpg": {
		"type": "image/jpeg",
		"etag": "\"28595-syEU09tqUv3A3IAwoi2zt6n82kw\"",
		"mtime": "2026-10-09T02:46:48.649Z",
		"size": 165269,
		"path": "../public/morning-lib/2026-09-06-4.jpg"
	},
	"/assets/agent-zMliFQOA.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3e3c-gzqGyCtlmEbloiI5Zqwk9o3A3l0\"",
		"mtime": "2026-10-09T02:46:47.393Z",
		"size": 15932,
		"path": "../public/assets/agent-zMliFQOA.js"
	},
	"/assets/app-CyxMwo-l.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"51-U5sstT/F9lbnm+X4wvLJ13zv4ao\"",
		"mtime": "2026-10-09T02:46:47.393Z",
		"size": 81,
		"path": "../public/assets/app-CyxMwo-l.js"
	},
	"/assets/app_.admin-CHJja7pK.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"41d2-zt0PALGzVvr/X04rlNSdn8GcwmY\"",
		"mtime": "2026-10-09T02:46:47.393Z",
		"size": 16850,
		"path": "../public/assets/app_.admin-CHJja7pK.js"
	},
	"/assets/ask-grok-panel-D9oeAu2d.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"e09-fIn2WCqjlWbGn0GCC50HS6gozQg\"",
		"mtime": "2026-10-09T02:46:47.393Z",
		"size": 3593,
		"path": "../public/assets/ask-grok-panel-D9oeAu2d.js"
	},
	"/assets/auto-window-DuIFtLMv.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1f8a-Xy8ntO+XQtcllc0JfDZZY9kodUw\"",
		"mtime": "2026-10-09T02:46:47.393Z",
		"size": 8074,
		"path": "../public/assets/auto-window-DuIFtLMv.js"
	},
	"/assets/b3ars-CxuMoDTy.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1cb6-KThvVbko82i5NBi7Q/51E/PFckw\"",
		"mtime": "2026-10-09T02:46:47.393Z",
		"size": 7350,
		"path": "../public/assets/b3ars-CxuMoDTy.js"
	},
	"/assets/board-BSClopFv.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"935b-WjDfh0myo6v0e+69eMjxQSMuUco\"",
		"mtime": "2026-10-09T02:46:47.393Z",
		"size": 37723,
		"path": "../public/assets/board-BSClopFv.js"
	},
	"/assets/admin-DKH7eap6.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"952a5-EEW8AD9jRFECD3WWRx+g/+fC1j0\"",
		"mtime": "2026-10-09T02:46:47.393Z",
		"size": 610981,
		"path": "../public/assets/admin-DKH7eap6.js"
	},
	"/assets/board._id-DONywKNM.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2319-ZhmyK+gKec4aaWQVKo3AesYMINY\"",
		"mtime": "2026-10-09T02:46:47.393Z",
		"size": 8985,
		"path": "../public/assets/board._id-DONywKNM.js"
	},
	"/assets/bot-mark-0LHbb5-s.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"681-svJ7ijwKfbtIwtwYD9UQHG8Q6Fg\"",
		"mtime": "2026-10-09T02:46:47.393Z",
		"size": 1665,
		"path": "../public/assets/bot-mark-0LHbb5-s.js"
	},
	"/assets/bowl-live-feed-Bt5h88Re.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"f7b-rbSF4mo192jyTkQYxhC1RUYEVBU\"",
		"mtime": "2026-10-09T02:46:47.393Z",
		"size": 3963,
		"path": "../public/assets/bowl-live-feed-Bt5h88Re.js"
	},
	"/assets/bowl-qhnd_LVE.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"29ab-KzO1+mK1nHHCSaQFOXvf2ujGtFc\"",
		"mtime": "2026-10-09T02:46:47.393Z",
		"size": 10667,
		"path": "../public/assets/bowl-qhnd_LVE.js"
	},
	"/assets/brand-Dr9dkcEC.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"13ab3-iU74ec/PGhkeP2FJaGvcKyNaeh4\"",
		"mtime": "2026-10-09T02:46:47.393Z",
		"size": 80563,
		"path": "../public/assets/brand-Dr9dkcEC.js"
	},
	"/assets/btc-miners-panel-De7ofO9p.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1c565-jHa8OJ0gQRorSzo/ffMMGUtLGZA\"",
		"mtime": "2026-10-09T02:46:47.393Z",
		"size": 116069,
		"path": "../public/assets/btc-miners-panel-De7ofO9p.js"
	},
	"/assets/byo-connect-panel-D5vhEHjA.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"20ab-Gj0Fw0R6zZkFknFzdVRHnhSnFcs\"",
		"mtime": "2026-10-09T02:46:47.393Z",
		"size": 8363,
		"path": "../public/assets/byo-connect-panel-D5vhEHjA.js"
	},
	"/assets/c0ff33-BhEMOsGb.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"9fc-cpzGUzWvq7gpeJrbR2Vg8eQ4Uss\"",
		"mtime": "2026-10-09T02:46:47.393Z",
		"size": 2556,
		"path": "../public/assets/c0ff33-BhEMOsGb.js"
	},
	"/assets/c0ut-zzh9_yGF.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"166c-4vLzUCjY+RexeqtEFDzpKCMcH38\"",
		"mtime": "2026-10-09T02:46:47.393Z",
		"size": 5740,
		"path": "../public/assets/c0ut-zzh9_yGF.js"
	},
	"/assets/client-D2z_-wAN.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1dd8-BSKGg0ZGJTseijfPkbw8Ti//j+Y\"",
		"mtime": "2026-10-09T02:46:47.393Z",
		"size": 7640,
		"path": "../public/assets/client-D2z_-wAN.js"
	},
	"/assets/client-DaNEswci.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"9e3b-eMoT4i0GELZxGmvP6b8v9jPTelI\"",
		"mtime": "2026-10-09T02:46:47.393Z",
		"size": 40507,
		"path": "../public/assets/client-DaNEswci.js"
	},
	"/assets/coffee-DJ7LAi8J.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"26-SoFMfAHVJ5oqB5t+mpFRoQvFIoc\"",
		"mtime": "2026-10-09T02:46:47.393Z",
		"size": 38,
		"path": "../public/assets/coffee-DJ7LAi8J.js"
	},
	"/assets/collapse-summary-_Ah2Acb3.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3e0-xF0P0oNPwRqnISVNBdV9iNHM+ac\"",
		"mtime": "2026-10-09T02:46:47.393Z",
		"size": 992,
		"path": "../public/assets/collapse-summary-_Ah2Acb3.js"
	},
	"/assets/compute-DuU25aPb.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"17a0-g81eVzyyHYCoyduUFx0nI4EdImY\"",
		"mtime": "2026-10-09T02:46:47.393Z",
		"size": 6048,
		"path": "../public/assets/compute-DuU25aPb.js"
	},
	"/assets/cup-DJ7LAi8J.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"26-SoFMfAHVJ5oqB5t+mpFRoQvFIoc\"",
		"mtime": "2026-10-09T02:46:47.393Z",
		"size": 38,
		"path": "../public/assets/cup-DJ7LAi8J.js"
	},
	"/assets/createServerFn-BUpQQBgV.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"9779-PDtcLU7bhUCGT8C+Gkb9O2IBAtQ\"",
		"mtime": "2026-10-09T02:46:47.393Z",
		"size": 38777,
		"path": "../public/assets/createServerFn-BUpQQBgV.js"
	},
	"/assets/desk-rpc-NZmn75Vb.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"c36-nrfqvH3SU+V7PEGHCJtc+SfcBfA\"",
		"mtime": "2026-10-09T02:46:47.393Z",
		"size": 3126,
		"path": "../public/assets/desk-rpc-NZmn75Vb.js"
	},
	"/assets/desk-workspace-LGWlPucx.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a2b0-/A/Leg6ShgBbm7NN7o7XJHluAEQ\"",
		"mtime": "2026-10-09T02:46:47.393Z",
		"size": 41648,
		"path": "../public/assets/desk-workspace-LGWlPucx.js"
	},
	"/assets/f33d-BnUaPzXL.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a71-JoRBNfFE14ZEk+knFJaEDGUGSts\"",
		"mtime": "2026-10-09T02:46:47.393Z",
		"size": 2673,
		"path": "../public/assets/f33d-BnUaPzXL.js"
	},
	"/assets/faq-CBOjHm5T.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3f9d-/7TjlrtoxdR6TiSmATFzPUri6qw\"",
		"mtime": "2026-10-09T02:46:47.393Z",
		"size": 16285,
		"path": "../public/assets/faq-CBOjHm5T.js"
	},
	"/assets/forum-Dq9Sq0zA.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"487e-tqmUwdpwboI1eAKdltG1CVu+bug\"",
		"mtime": "2026-10-09T02:46:47.393Z",
		"size": 18558,
		"path": "../public/assets/forum-Dq9Sq0zA.js"
	},
	"/assets/gm-B73J1Vkx.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"45bb-6OO/kfyTDU+aSuEbpOx/QpKuZmI\"",
		"mtime": "2026-10-09T02:46:47.393Z",
		"size": 17851,
		"path": "../public/assets/gm-B73J1Vkx.js"
	},
	"/assets/go-live-A0BiS8_s.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1d6c-xewW0VtLaQF/43uA/lQ9b5WwCj4\"",
		"mtime": "2026-10-09T02:46:47.393Z",
		"size": 7532,
		"path": "../public/assets/go-live-A0BiS8_s.js"
	},
	"/assets/go-live-panel-DCU9zyfa.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"b9a-2aeiWGhxGHGdKH2Ph9D/6/p/MsU\"",
		"mtime": "2026-10-09T02:46:47.393Z",
		"size": 2970,
		"path": "../public/assets/go-live-panel-DCU9zyfa.js"
	},
	"/assets/grok-WEb7Osy3.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1ef-Ns4MgXFSYnywQHpR4ukMilsABfQ\"",
		"mtime": "2026-10-09T02:46:47.393Z",
		"size": 495,
		"path": "../public/assets/grok-WEb7Osy3.js"
	},
	"/assets/h1v3-Rg9du_nW.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"25ab-5dq+yv7vW5Wa1/MRUUmdi5bQAxg\"",
		"mtime": "2026-10-09T02:46:47.393Z",
		"size": 9643,
		"path": "../public/assets/h1v3-Rg9du_nW.js"
	},
	"/assets/helios-card-B5Utv74-.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"31d0-8SadQU4huXKdFu4zZJBiasn6/8w\"",
		"mtime": "2026-10-09T02:46:47.393Z",
		"size": 12752,
		"path": "../public/assets/helios-card-B5Utv74-.js"
	},
	"/assets/hive-resource-MzgiNdrp.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"cee-BX6swOur69DFViO9kALBmP/doMw\"",
		"mtime": "2026-10-09T02:46:47.393Z",
		"size": 3310,
		"path": "../public/assets/hive-resource-MzgiNdrp.js"
	},
	"/assets/ios-CyxMwo-l.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"51-U5sstT/F9lbnm+X4wvLJ13zv4ao\"",
		"mtime": "2026-10-09T02:46:47.393Z",
		"size": 81,
		"path": "../public/assets/ios-CyxMwo-l.js"
	},
	"/assets/index-DlzgvMCA.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5a85c-rV1IPpa4cmXLKGTTX4iksFjwgOQ\"",
		"mtime": "2026-10-09T02:46:47.393Z",
		"size": 370780,
		"path": "../public/assets/index-DlzgvMCA.js"
	},
	"/assets/l0ck-DlLFLdfT.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3f08-+aI1e3JMQXUec6KPqyzud9ZRj+Y\"",
		"mtime": "2026-10-09T02:46:47.393Z",
		"size": 16136,
		"path": "../public/assets/l0ck-DlLFLdfT.js"
	},
	"/assets/launch-BEG-x5X9.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4d-50RqynuruhMel6WSkKCCbE0aKXo\"",
		"mtime": "2026-10-09T02:46:47.393Z",
		"size": 77,
		"path": "../public/assets/launch-BEG-x5X9.js"
	},
	"/assets/labs-Dd7SBxlX.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"48e0-3droPEBm0mKvoKFTR9vjWHZTnMw\"",
		"mtime": "2026-10-09T02:46:47.393Z",
		"size": 18656,
		"path": "../public/assets/labs-Dd7SBxlX.js"
	},
	"/assets/launch-desk-C13NdziJ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"7986-Z9QnH2DKn3y7UdP+AoXGR6SVbPE\"",
		"mtime": "2026-10-09T02:46:47.393Z",
		"size": 31110,
		"path": "../public/assets/launch-desk-C13NdziJ.js"
	},
	"/assets/live-tracks-DUKjWrNo.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"74b-U8Dte2Jga4Ks8yU0k+dIdEwZq9s\"",
		"mtime": "2026-10-09T02:46:47.393Z",
		"size": 1867,
		"path": "../public/assets/live-tracks-DUKjWrNo.js"
	},
	"/assets/lock-status-Biwf2mEa.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"e09-XIacm3fBTMv6M+4RMqwWo0k9gJQ\"",
		"mtime": "2026-10-09T02:46:47.393Z",
		"size": 3593,
		"path": "../public/assets/lock-status-Biwf2mEa.js"
	},
	"/assets/lock3d-status-DNnV6wHN.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2720-A5Lndh8nsEan85PNBe0YFVC+C/E\"",
		"mtime": "2026-10-09T02:46:47.393Z",
		"size": 10016,
		"path": "../public/assets/lock3d-status-DNnV6wHN.js"
	},
	"/assets/login-B-b22T65.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1724-+OZaC8kOgeyhQpWhKHKllJrIwOw\"",
		"mtime": "2026-10-09T02:46:47.393Z",
		"size": 5924,
		"path": "../public/assets/login-B-b22T65.js"
	},
	"/assets/mandate-BPdRCLbC.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"15d1-0eCeTou9IeMnhTY0hATU8+Teb/w\"",
		"mtime": "2026-10-09T02:46:47.393Z",
		"size": 5585,
		"path": "../public/assets/mandate-BPdRCLbC.js"
	},
	"/assets/media-CECDHWO4.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1460-b04p8p9oqwWhhKdgggyMeGhaef0\"",
		"mtime": "2026-10-09T02:46:47.393Z",
		"size": 5216,
		"path": "../public/assets/media-CECDHWO4.js"
	},
	"/assets/mobile-app-page-C47zntOy.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4177-A9oz0HpcJitQOvSLJ2PSrvQ34rQ\"",
		"mtime": "2026-10-09T02:46:47.393Z",
		"size": 16759,
		"path": "../public/assets/mobile-app-page-C47zntOy.js"
	},
	"/assets/morning-lib-BJauqf3Z.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"93-0mK2u5fvwGbnCOPD9H77VTrxGuU\"",
		"mtime": "2026-10-09T02:46:47.393Z",
		"size": 147,
		"path": "../public/assets/morning-lib-BJauqf3Z.js"
	},
	"/assets/oss-roadmap-BzzkDVB3.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4613-uR0jB+NNtvVRJE9R+bFEAwjbB+8\"",
		"mtime": "2026-10-09T02:46:47.393Z",
		"size": 17939,
		"path": "../public/assets/oss-roadmap-BzzkDVB3.js"
	},
	"/assets/owl-forum-ClXajUTv.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"7d84-s56n2h9ZWniPTx/lo5vbWiduQT8\"",
		"mtime": "2026-10-09T02:46:47.393Z",
		"size": 32132,
		"path": "../public/assets/owl-forum-ClXajUTv.js"
	},
	"/assets/owl-DOFf3Rax.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1c18-PoHu5cWpwUR+mhlH6gvmC9LKxw0\"",
		"mtime": "2026-10-09T02:46:47.393Z",
		"size": 7192,
		"path": "../public/assets/owl-DOFf3Rax.js"
	},
	"/assets/play-CyxMwo-l.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"51-U5sstT/F9lbnm+X4wvLJ13zv4ao\"",
		"mtime": "2026-10-09T02:46:47.397Z",
		"size": 81,
		"path": "../public/assets/play-CyxMwo-l.js"
	},
	"/assets/play-cJvaLVWB.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"11a-lWEbj+y+EBtglrBKcuhJounlYEM\"",
		"mtime": "2026-10-09T02:46:47.397Z",
		"size": 282,
		"path": "../public/assets/play-cJvaLVWB.js"
	},
	"/assets/pdf-CxLxk-yn.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"69369-NAlwG50QmLiTjHO07mjItPsO4fA\"",
		"mtime": "2026-10-09T02:46:47.393Z",
		"size": 430953,
		"path": "../public/assets/pdf-CxLxk-yn.js"
	},
	"/assets/pr3d-twaG5xzT.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"186e-dw8y2axPedYss1qMil2lQxiIp1A\"",
		"mtime": "2026-10-09T02:46:47.397Z",
		"size": 6254,
		"path": "../public/assets/pr3d-twaG5xzT.js"
	},
	"/assets/preload-helper-Czpn1I53.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4ac-sE+5KsaRXTMfwOfrOATQajMSGV4\"",
		"mtime": "2026-10-09T02:46:47.397Z",
		"size": 1196,
		"path": "../public/assets/preload-helper-Czpn1I53.js"
	},
	"/assets/privacy-C26EPVh2.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"70d-PIC0zdJE/OnIfaRT9ZnPcI7bklA\"",
		"mtime": "2026-10-09T02:46:47.397Z",
		"size": 1805,
		"path": "../public/assets/privacy-C26EPVh2.js"
	},
	"/assets/quant-flex-welcome-Cuyu3psF.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4ed-lS5cDDeLX1kTmQcwoXBF/bTgbJw\"",
		"mtime": "2026-10-09T02:46:47.397Z",
		"size": 1261,
		"path": "../public/assets/quant-flex-welcome-Cuyu3psF.js"
	},
	"/assets/r0b0ts-BMrPENDK.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2fce-7prsWRQdpuhDM671j87GOGrXGGE\"",
		"mtime": "2026-10-09T02:46:47.397Z",
		"size": 12238,
		"path": "../public/assets/r0b0ts-BMrPENDK.js"
	},
	"/assets/renew-D7BivxG4.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"420-4UOqA+lmoL97ggDiU4GP7y+XY9w\"",
		"mtime": "2026-10-09T02:46:47.397Z",
		"size": 1056,
		"path": "../public/assets/renew-D7BivxG4.js"
	},
	"/assets/radio-hRx5pOfk.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"167-CpZRZHa2y5OOmu1ksYbA/XhxGWw\"",
		"mtime": "2026-10-09T02:46:47.397Z",
		"size": 359,
		"path": "../public/assets/radio-hRx5pOfk.js"
	},
	"/assets/renew-password-REmEaa9u.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"db91-Ng1VmALJC7StknYIxoDDozq2Vpw\"",
		"mtime": "2026-10-09T02:46:47.397Z",
		"size": 56209,
		"path": "../public/assets/renew-password-REmEaa9u.js"
	},
	"/assets/roadmap-DJJNPxvq.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2f2a-GsqMEjzH5otDrJ+PRroL7ekLm8U\"",
		"mtime": "2026-10-09T02:46:47.397Z",
		"size": 12074,
		"path": "../public/assets/roadmap-DJJNPxvq.js"
	},
	"/assets/rolldown-runtime-hePW80VL.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2cc-fA8td6k29UVF6JoPfhOPkceTK1M\"",
		"mtime": "2026-10-09T02:46:47.397Z",
		"size": 716,
		"path": "../public/assets/rolldown-runtime-hePW80VL.js"
	},
	"/assets/routes-D9bXsMAE.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"162d9-3uNqxHa7dmbt6jIctWxMUCRBETc\"",
		"mtime": "2026-10-09T02:46:47.397Z",
		"size": 90841,
		"path": "../public/assets/routes-D9bXsMAE.js"
	},
	"/assets/s1r1us-site-D5_9e_Zt.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"38a4-HTJt2IaIFA1yyyeFnqS2OoIoyaY\"",
		"mtime": "2026-10-09T02:46:47.397Z",
		"size": 14500,
		"path": "../public/assets/s1r1us-site-D5_9e_Zt.js"
	},
	"/assets/roll-bots-y7c7Rggq.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"6f-Bdn1BfiO0KhbP42wMgLBIHEeeM8\"",
		"mtime": "2026-10-09T02:46:47.397Z",
		"size": 111,
		"path": "../public/assets/roll-bots-y7c7Rggq.js"
	},
	"/assets/s1r1us-kRiNJnKm.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4d-Fie8yjAzwFBnhW56np6lT/byqoc\"",
		"mtime": "2026-10-09T02:46:47.397Z",
		"size": 77,
		"path": "../public/assets/s1r1us-kRiNJnKm.js"
	},
	"/assets/search-QmGW5twA.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"992-015ldmRySpwjGLjDGX8hqJXke58\"",
		"mtime": "2026-10-09T02:46:47.397Z",
		"size": 2450,
		"path": "../public/assets/search-QmGW5twA.js"
	},
	"/assets/scan-search-DughKtS1.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1d4-zNloIy+B1UDmieUkzzOveZboOl4\"",
		"mtime": "2026-10-09T02:46:47.397Z",
		"size": 468,
		"path": "../public/assets/scan-search-DughKtS1.js"
	},
	"/assets/seo-copy-CH1-Gly4.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"194a1-C/Fzh16hJ+nc8ImF2tE8jtMGmE0\"",
		"mtime": "2026-10-09T02:46:47.397Z",
		"size": 103585,
		"path": "../public/assets/seo-copy-CH1-Gly4.js"
	},
	"/assets/shell-DKWemrNC.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1cf1e-1SPW08328W61fF4dvuyjqTmtwrU\"",
		"mtime": "2026-10-09T02:46:47.397Z",
		"size": 118558,
		"path": "../public/assets/shell-DKWemrNC.js"
	},
	"/assets/sim-DJ7LAi8J.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"26-SoFMfAHVJ5oqB5t+mpFRoQvFIoc\"",
		"mtime": "2026-10-09T02:46:47.397Z",
		"size": 38,
		"path": "../public/assets/sim-DJ7LAi8J.js"
	},
	"/assets/source-DJ7LAi8J.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"26-SoFMfAHVJ5oqB5t+mpFRoQvFIoc\"",
		"mtime": "2026-10-09T02:46:47.397Z",
		"size": 38,
		"path": "../public/assets/source-DJ7LAi8J.js"
	},
	"/assets/sp0ns0r-DJ7LAi8J.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"26-SoFMfAHVJ5oqB5t+mpFRoQvFIoc\"",
		"mtime": "2026-10-09T02:46:47.397Z",
		"size": 38,
		"path": "../public/assets/sp0ns0r-DJ7LAi8J.js"
	},
	"/assets/sponsor-ai-bitcoin-trading-bot-DOe3JDi9.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1066-VABh1r5TJff4eDevMXJsKYtsvak\"",
		"mtime": "2026-10-09T02:46:47.397Z",
		"size": 4198,
		"path": "../public/assets/sponsor-ai-bitcoin-trading-bot-DOe3JDi9.js"
	},
	"/assets/styles-4DpXX9Hg.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"12d58-X0rKytdB0EtvZBprCkaJe+ov840\"",
		"mtime": "2026-10-09T02:46:47.397Z",
		"size": 77144,
		"path": "../public/assets/styles-4DpXX9Hg.css"
	},
	"/assets/styles-Dw9g4AKZ.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"12d58-X0rKytdB0EtvZBprCkaJe+ov840\"",
		"mtime": "2026-10-09T02:46:47.397Z",
		"size": 77144,
		"path": "../public/assets/styles-4DpXX9Hg.css"
	},
	"/assets/support-donate-XESBdCaK.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"e5b-XdH+3g8Q4oEsSfXfPaPA0BWMkGw\"",
		"mtime": "2026-10-09T02:46:47.397Z",
		"size": 3675,
		"path": "../public/assets/support-donate-XESBdCaK.js"
	},
	"/assets/system-overview-D6FCzKAE.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"f9b-c5rupBhaI1vJ50NqbkpAFfgSuOg\"",
		"mtime": "2026-10-09T02:46:47.397Z",
		"size": 3995,
		"path": "../public/assets/system-overview-D6FCzKAE.js"
	},
	"/assets/tape-client-CRmedIdl.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"6b32-yI38YqGyJJkznXYyfB6CSAJfKNM\"",
		"mtime": "2026-10-09T02:46:47.397Z",
		"size": 27442,
		"path": "../public/assets/tape-client-CRmedIdl.js"
	},
	"/assets/tape-freeze-CL3uZJLg.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a7c-4LTHeQX/5tZ1Aspxt3OJD1mK+d4\"",
		"mtime": "2026-10-09T02:46:47.397Z",
		"size": 2684,
		"path": "../public/assets/tape-freeze-CL3uZJLg.js"
	},
	"/assets/sitemap-BIbOAw5u.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"13d1-5lDdikSgKO/kwG+B6AuY1ZU65fU\"",
		"mtime": "2026-10-09T02:46:47.397Z",
		"size": 5073,
		"path": "../public/assets/sitemap-BIbOAw5u.js"
	},
	"/assets/terms-CQqy-xnK.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"867-dpAsOefGypUMc6pBGpZ7sgSw3nk\"",
		"mtime": "2026-10-09T02:46:47.397Z",
		"size": 2151,
		"path": "../public/assets/terms-CQqy-xnK.js"
	},
	"/assets/theme-QBhXRDYi.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"458-buPSG/T2Xky1tgdmwvelNStRgfw\"",
		"mtime": "2026-10-09T02:46:47.397Z",
		"size": 1112,
		"path": "../public/assets/theme-QBhXRDYi.js"
	},
	"/assets/w0rld-CUSOEPL3.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"18b4-00LnWyZ/ol63eTNm0KXTgLP6M2s\"",
		"mtime": "2026-10-09T02:46:47.397Z",
		"size": 6324,
		"path": "../public/assets/w0rld-CUSOEPL3.js"
	},
	"/assets/shell-BC8YASSy.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"232-vowd8LG4LwbKTxlHsc1bF/bJbow\"",
		"mtime": "2026-10-09T02:46:47.397Z",
		"size": 562,
		"path": "../public/assets/shell-BC8YASSy.css"
	},
	"/assets/webauthn-client-Bl3sSFk8.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a90-ogBkLb+XOTCKmfgHG1/i9UYILCE\"",
		"mtime": "2026-10-09T02:46:47.397Z",
		"size": 2704,
		"path": "../public/assets/webauthn-client-Bl3sSFk8.js"
	},
	"/assets/wh1t3-CFVt9FZb.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2cb1-2+i6S9TJ1SyhbbhWYGCw3EMTieI\"",
		"mtime": "2026-10-09T02:46:47.397Z",
		"size": 11441,
		"path": "../public/assets/wh1t3-CFVt9FZb.js"
	},
	"/assets/world-cup-DJ7LAi8J.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"26-SoFMfAHVJ5oqB5t+mpFRoQvFIoc\"",
		"mtime": "2026-10-09T02:46:47.397Z",
		"size": 38,
		"path": "../public/assets/world-cup-DJ7LAi8J.js"
	},
	"/paper/page-1-thumb.jpg": {
		"type": "image/jpeg",
		"etag": "\"11e48-4b/lehuj2ygcBQHN39DpHpd56PM\"",
		"mtime": "2026-10-09T02:46:48.649Z",
		"size": 73288,
		"path": "../public/paper/page-1-thumb.jpg"
	},
	"/paper/page-2-thumb.jpg": {
		"type": "image/jpeg",
		"etag": "\"110f6-KUxgIc9sLkWbITw0xt6MeUxIBMY\"",
		"mtime": "2026-10-09T02:46:48.649Z",
		"size": 69878,
		"path": "../public/paper/page-2-thumb.jpg"
	},
	"/paper/page-3-thumb.jpg": {
		"type": "image/jpeg",
		"etag": "\"127d0-Z4c6dnZwktypMBkHveogTIh0uuE\"",
		"mtime": "2026-10-09T02:46:48.649Z",
		"size": 75728,
		"path": "../public/paper/page-3-thumb.jpg"
	},
	"/paper/page-2.jpg": {
		"type": "image/jpeg",
		"etag": "\"7a52a-MHBo3Zf8QkQGuFLRuSYqoC4lSA8\"",
		"mtime": "2026-10-09T02:46:48.649Z",
		"size": 501034,
		"path": "../public/paper/page-2.jpg"
	},
	"/paper/page-1.jpg": {
		"type": "image/jpeg",
		"etag": "\"82a3f-BMlD4U4OHIYgzJEJAM/h4JC3omg\"",
		"mtime": "2026-10-09T02:46:48.649Z",
		"size": 535103,
		"path": "../public/paper/page-1.jpg"
	},
	"/paper/AI-Hedge-Fund-Paper.pdf": {
		"type": "application/pdf",
		"etag": "\"d729e-aawR88/bqLN6f5Uy2fzFu74nezQ\"",
		"mtime": "2026-10-09T02:46:48.645Z",
		"size": 881310,
		"path": "../public/paper/AI-Hedge-Fund-Paper.pdf"
	},
	"/paper/page-3.jpg": {
		"type": "image/jpeg",
		"etag": "\"84441-UMkDim1rrQeEMZ24iuU6wMrrWDc\"",
		"mtime": "2026-10-09T02:46:48.653Z",
		"size": 541761,
		"path": "../public/paper/page-3.jpg"
	},
	"/__grok/install/styles.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"1a3d-VUsWOMAheo1/P30EqU5qaIkyvIQ\"",
		"mtime": "2026-10-09T02:46:48.645Z",
		"size": 6717,
		"path": "../public/__grok/install/styles.css"
	},
	"/__grok/install/assets/homescreen/glass-puzzle.svg": {
		"type": "image/svg+xml",
		"etag": "\"713-AP2wG8KChAGjse1Fn+f/+vDN+sQ\"",
		"mtime": "2026-10-09T02:46:48.741Z",
		"size": 1811,
		"path": "../public/__grok/install/assets/homescreen/glass-puzzle.svg"
	},
	"/__grok/install/assets/homescreen/glass-share.svg": {
		"type": "image/svg+xml",
		"etag": "\"954-jb3ATcKjqgMOYrA/4w1v21j0Jvg\"",
		"mtime": "2026-10-09T02:46:48.729Z",
		"size": 2388,
		"path": "../public/__grok/install/assets/homescreen/glass-share.svg"
	},
	"/__grok/install/assets/homescreen/logo-grok.svg": {
		"type": "image/svg+xml",
		"etag": "\"423-5mXO+yh9KW40jM3to5JlWPhxNK8\"",
		"mtime": "2026-10-09T02:46:48.733Z",
		"size": 1059,
		"path": "../public/__grok/install/assets/homescreen/logo-grok.svg"
	},
	"/__grok/install/assets/homescreen/ob-ipad.png": {
		"type": "image/png",
		"etag": "\"18dd3-wlRwrpmBImStuiu+4poVz7ANin4\"",
		"mtime": "2026-10-09T02:46:48.737Z",
		"size": 101843,
		"path": "../public/__grok/install/assets/homescreen/ob-ipad.png"
	},
	"/__grok/install/assets/homescreen/ob-phone.png": {
		"type": "image/png",
		"etag": "\"194bc-oZradWHIHO68q2glHU0Gk5ttpWA\"",
		"mtime": "2026-10-09T02:46:48.733Z",
		"size": 103612,
		"path": "../public/__grok/install/assets/homescreen/ob-phone.png"
	},
	"/__grok/install/assets/homescreen/plus.svg": {
		"type": "image/svg+xml",
		"etag": "\"961-sSBPunx/13vbMNAlPxb7UeO3l3A\"",
		"mtime": "2026-10-09T02:46:48.733Z",
		"size": 2401,
		"path": "../public/__grok/install/assets/homescreen/plus.svg"
	},
	"/video/super-bowl-ai-agents-flyover.mp4": {
		"type": "video/mp4",
		"etag": "\"1c7eed-iajZXeyU4MQQGnjg1JTP7YRboZI\"",
		"mtime": "2026-10-09T02:46:48.705Z",
		"size": 1867501,
		"path": "../public/video/super-bowl-ai-agents-flyover.mp4"
	},
	"/video/super-bowl-ai-agents-tiktok.mp4": {
		"type": "video/mp4",
		"etag": "\"247eae-U85IqV4Yp/uf+WH+dl4LdUkEoTM\"",
		"mtime": "2026-10-09T02:46:48.737Z",
		"size": 2391726,
		"path": "../public/video/super-bowl-ai-agents-tiktok.mp4"
	},
	"/video/super-bowl-ai-agents-rumble.mp4": {
		"type": "video/mp4",
		"etag": "\"271798-a4lmDd16caMViSz1m2yQXRI6L5I\"",
		"mtime": "2026-10-09T02:46:48.725Z",
		"size": 2561944,
		"path": "../public/video/super-bowl-ai-agents-rumble.mp4"
	},
	"/video/super-bowl-ai-agents-tiktok-hud.mp4": {
		"type": "video/mp4",
		"etag": "\"2a9a00-WuT2NwRsdEHxCsrjtICbmZWH+0g\"",
		"mtime": "2026-10-09T02:46:48.721Z",
		"size": 2791936,
		"path": "../public/video/super-bowl-ai-agents-tiktok-hud.mp4"
	},
	"/video/ai-trading-bot-cost-tiktok-desk.mp4": {
		"type": "video/mp4",
		"etag": "\"5d4210-491zFshX7NisTBK9uu/DzM3hLk8\"",
		"mtime": "2026-10-09T02:46:48.677Z",
		"size": 6111760,
		"path": "../public/video/ai-trading-bot-cost-tiktok-desk.mp4"
	},
	"/video/ai-trading-bot-cost-tiktok-hud.mp4": {
		"type": "video/mp4",
		"etag": "\"63c41d-WVnqEmsCOQdApx5wcpDMROVbUzI\"",
		"mtime": "2026-10-09T02:46:48.677Z",
		"size": 6538269,
		"path": "../public/video/ai-trading-bot-cost-tiktok-hud.mp4"
	},
	"/video/ai-trading-bot-cost-rumble-split.mp4": {
		"type": "video/mp4",
		"etag": "\"7be497-mshf9NgsCUBKVOy77jyNEEnK/GM\"",
		"mtime": "2026-10-09T02:46:48.677Z",
		"size": 8119447,
		"path": "../public/video/ai-trading-bot-cost-rumble-split.mp4"
	},
	"/video/super-bowl-ai-agents-library.zip": {
		"type": "application/zip",
		"etag": "\"ab65a7-KAEJvJojCVfMJrd1BuUwv7o8s40\"",
		"mtime": "2026-10-09T02:46:48.737Z",
		"size": 11232679,
		"path": "../public/video/super-bowl-ai-agents-library.zip"
	},
	"/video/ai-trading-bot-cost-library.zip": {
		"type": "application/zip",
		"etag": "\"13cec90-9wOAZkMIpR6cSETMH8W/wuqSxnQ\"",
		"mtime": "2026-10-09T02:46:48.693Z",
		"size": 20769936,
		"path": "../public/video/ai-trading-bot-cost-library.zip"
	}
};
//#endregion
//#region #nitro/virtual/public-assets-node
function readAsset(id) {
	const serverDir = dirname(fileURLToPath(globalThis.__nitro_main__));
	return promises.readFile(resolve(serverDir, public_assets_data_default[id].path));
}
//#endregion
//#region #nitro/virtual/public-assets
var publicAssetBases = {};
function isPublicAssetURL(id = "") {
	if (public_assets_data_default[id]) return true;
	for (const base in publicAssetBases) if (id.startsWith(base)) return true;
	return false;
}
function getAsset(id) {
	return public_assets_data_default[id];
}
//#endregion
//#region node_modules/nitro/dist/runtime/internal/static.mjs
var METHODS = /* @__PURE__ */ new Set(["HEAD", "GET"]);
var EncodingMap = {
	gzip: ".gz",
	br: ".br",
	zstd: ".zst"
};
var static_default = defineHandler((event) => {
	if (event.req.method && !METHODS.has(event.req.method)) return;
	let id = decodePath(withLeadingSlash(withoutTrailingSlash(event.url.pathname)));
	let asset;
	const encodings = [...(event.req.headers.get("accept-encoding") || "").split(",").map((e) => EncodingMap[e.trim()]).filter(Boolean).sort(), ""];
	for (const encoding of encodings) for (const _id of [id + encoding, joinURL(id, "index.html" + encoding)]) {
		const _asset = getAsset(_id);
		if (_asset) {
			asset = _asset;
			id = _id;
			break;
		}
	}
	if (!asset) {
		if (isPublicAssetURL(id)) {
			event.res.headers.delete("Cache-Control");
			throw new HTTPError({ status: 404 });
		}
		return;
	}
	if (encodings.length > 1) event.res.headers.append("Vary", "Accept-Encoding");
	if (event.req.headers.get("if-none-match") === asset.etag) {
		event.res.status = 304;
		event.res.statusText = "Not Modified";
		return "";
	}
	const ifModifiedSinceH = event.req.headers.get("if-modified-since");
	const mtimeDate = new Date(asset.mtime);
	if (ifModifiedSinceH && asset.mtime && new Date(ifModifiedSinceH) >= mtimeDate) {
		event.res.status = 304;
		event.res.statusText = "Not Modified";
		return "";
	}
	if (asset.type) event.res.headers.set("Content-Type", asset.type);
	if (asset.etag && !event.res.headers.has("ETag")) event.res.headers.set("ETag", asset.etag);
	if (asset.mtime && !event.res.headers.has("Last-Modified")) event.res.headers.set("Last-Modified", mtimeDate.toUTCString());
	if (asset.encoding && !event.res.headers.has("Content-Encoding")) event.res.headers.set("Content-Encoding", asset.encoding);
	if (asset.size > 0 && !event.res.headers.has("Content-Length")) event.res.headers.set("Content-Length", asset.size.toString());
	return readAsset(id);
});
//#endregion
//#region server/middleware/a-waf.ts
async function wafMiddleware(event, next) {
	const { gateHttp, withSecHeaders } = await import("./_chunks/waf-gate.mjs");
	const https = event.url.protocol === "https:" || event.req.headers.get("x-forwarded-proto") === "https";
	const gate = gateHttp({
		method: event.req.method ?? "GET",
		url: event.url.href,
		headers: event.req.headers
	});
	if (gate.block) return withSecHeaders(new Response(gate.body, {
		status: gate.status,
		headers: {
			"content-type": "application/json; charset=utf-8",
			"cache-control": "no-store"
		}
	}), https || gate.https);
	const out = await next();
	if (out instanceof Response) return withSecHeaders(out, https || gate.https);
	return out;
}
//#endregion
//#region src/lib/desk/agent-source-guard.ts
/**
* Proprietary / source guard for external AI agents.
* Client-safe constants. Agents may use public HTML + public GitHub + /api/agent/*
* (the mandate channel). They never get host source, admin, root, VPN, or extra RPC.
*/
var PUBLIC_GITHUB = "https://github.com/S1R1US-AI/S1R1US-LABs";
/** Crawler / agent UAs. Humans (browsers) are not this list. */
var AGENT_UA = /GPTBot|ChatGPT-User|OAI-SearchBot|ClaudeBot|anthropic-ai|Claude-Web|Claude-User|Claude-Code|Grok\/|xAI-Grok|xAI-GrokBot|CCBot|Bytespider|PerplexityBot|Google-Extended|Amazonbot|Applebot-Extended|meta-externalagent|cohere-ai|YouBot|Diffbot|iaskspider|ImagesiftBot|Omgilibot|TikTokSpider|DuckAssistBot|AI2Bot|FacebookBot|PetalBot|SemrushBot|DataForSeoBot|mcp-client|openai-mcp|anthropic-mcp/i;
/** Paths agents (and anonymous probes) must never read on this host. Public GitHub is the OSS tree. */
var SOURCE_DENY_PATHS = [
	"/source",
	"/guide",
	"/security",
	"/admin",
	"/app/admin",
	"/launch",
	"/renew",
	"/login",
	"/s1r1us-labs-github.zip",
	"/s1r1us-labs-github.tar.gz",
	"/helios-desk-guide.md",
	"/helios-desk-guide.pdf",
	"/field-report.md",
	"/dockerfile",
	"/.git",
	"/src",
	"/.output",
	"/node_modules",
	"/package-lock.json",
	"/package.json",
	"/agents.md",
	"/.env",
	"/vite.config.ts",
	"/tsconfig.json",
	"/nitro.config",
	"/workspace",
	"/tmp",
	"/data",
	"/vault",
	"/yubi",
	"/ssh",
	"/vpn",
	"/rdp",
	"/vnc",
	"/wireguard",
	"/openvpn",
	"/tailscale",
	"/rpc",
	"/xmlrpc",
	"/jsonrpc",
	"/supervisor",
	"/portainer",
	"/cockpit",
	"/doctl",
	"/droplet"
];
function isAgentUserAgent(ua) {
	return AGENT_UA.test(String(ua ?? ""));
}
function isProprietaryPath(path) {
	const p = (path || "/").split("?", 1)[0].replace(/\/+$/, "").toLowerCase() || "/";
	if (SOURCE_DENY_PATHS.some((d) => p === d || p.startsWith(`${d}/`))) return true;
	if (p.includes("/.") && !p.startsWith("/.well-known")) return true;
	if (/\.(map|ts|tsx)$/i.test(p) && (p.includes("/src") || p.startsWith("/src"))) return true;
	if (/\/_server/i.test(p) || /\/api\/(_server|rpc|internal)\b/i.test(p)) return true;
	return false;
}
/** MCP JSON-RPC at /api/agent/mcp is the only RPC agents may use. */
function isOutOfScopeRpc(path) {
	const p = (path || "/").toLowerCase();
	if (p.startsWith("/api/agent/mcp")) return false;
	if (p.startsWith("/api/agent/a2a")) return false;
	return /\/(rpc|xmlrpc|jsonrpc|json-rpc|graphql|ws|websocket|ssh|vpn)\b/i.test(p);
}
function agentSourceDenied(path, ua) {
	if (isOutOfScopeRpc(path)) return true;
	if (!isAgentUserAgent(ua)) return false;
	return isProprietaryPath(path);
}
var AGENT_SOURCE_MESSAGE = "Proprietary and host internals are not available to external AI agents. You may read public HTML, GET /api/agent/* for the bitcoin-accumulation mandate, and the public GitHub tree at https://github.com/S1R1US-AI/S1R1US-LABs. Do not request source, admin, root, VPN, SSH, or extra RPC. Do not come back if you probe. Terms: https://s1r1us.ai/terms";
//#endregion
//#region server/middleware/agent-guard.ts
/**
* Block AI agent user-agents from source, admin, host internals, VPN, and extra RPC.
* Humans may still use the public GitHub pack. Agents get 403 JSON + doNotReturn.
*/
function pathOf(event) {
	return (event.url.pathname || "/").replace(/\/+$/, "") || "/";
}
async function agentGuardMiddleware(event, next) {
	const ua = event.req.headers.get("user-agent") ?? "";
	const path = pathOf(event);
	if (!agentSourceDenied(path, ua)) return next();
	const ip = (event.req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || event.req.headers.get("x-real-ip") || "local").slice(0, 64);
	import("./_chunks/intrusion-log.mjs").then((n) => n.t).then(({ recordIntrusion }) => {
		recordIntrusion({
			kind: "source-probe",
			ua,
			ip,
			detail: `agent denied ${path.slice(0, 80)}`
		});
	}).catch(() => void 0);
	import("./_chunks/ban-list.mjs").then(({ barPermanent, isLoopback }) => {
		if (!isLoopback(ip)) barPermanent(ip, `source-probe ${path.slice(0, 40)}`);
	}).catch(() => void 0);
	return new Response(JSON.stringify({
		ok: false,
		blocked: true,
		welcomeBack: false,
		doNotReturn: true,
		reason: "source",
		trade: false,
		sourceAccess: false,
		proprietary: true,
		github: PUBLIC_GITHUB,
		error: "blocked",
		message: AGENT_SOURCE_MESSAGE,
		after: "Stop. Use public HTML, /api/agent/ping, /api/agent/call, or the public GitHub only.",
		terms: "https://s1r1us.ai/terms",
		docs: "/agent"
	}), {
		status: 403,
		headers: {
			"content-type": "application/json; charset=utf-8",
			"cache-control": "no-store",
			"access-control-allow-origin": "*"
		}
	});
}
//#endregion
//#region scripts/install-page.html?raw
var install_page_default = "<!DOCTYPE html>\n<html lang=\"en\" class=\"device-desktop\">\n  <head>\n    <meta charset=\"utf-8\" />\n    <meta\n      name=\"viewport\"\n      content=\"width=device-width, initial-scale=1, viewport-fit=cover\"\n    />\n    <meta name=\"color-scheme\" content=\"dark\" />\n    <meta name=\"theme-color\" content=\"#000000\" />\n    <meta name=\"apple-mobile-web-app-status-bar-style\" content=\"black\" />\n    <meta name=\"apple-mobile-web-app-title\" content=\"{{APP_NAME}}\" />\n    <title>Add {{APP_NAME}} to your Home Screen</title>\n    <link rel=\"manifest\" href=\"/__grok/manifest.webmanifest\" />\n    <link rel=\"apple-touch-icon\" href=\"/__grok/icon-180.png\" />\n    <link rel=\"stylesheet\" href=\"/__grok/install/styles.css\" />\n    <script>\n      (function () {\n        var ua = navigator.userAgent || \"\";\n        var touch = navigator.maxTouchPoints || 0;\n        var isiPad = /iPad/.test(ua) || (/Macintosh/.test(ua) && touch > 1);\n        var isiPhone = /iPhone|iPod/.test(ua);\n        var isIOS = isiPhone || isiPad;\n        var isAndroid = /Android/i.test(ua);\n        var isAndroidPhone = isAndroid && /Mobile/i.test(ua);\n        var isAndroidTablet = isAndroid && !/Mobile/i.test(ua);\n        var minSide = Math.min(screen.width || 0, screen.height || 0);\n        var maxSide = Math.max(screen.width || 0, screen.height || 0);\n\n        var type = \"desktop\";\n        if (isiPhone) type = \"phone\";\n        else if (isiPad || isAndroidTablet) type = \"tablet\";\n        else if (isAndroidPhone) type = \"phone\";\n        else if (touch > 0 && minSide > 0 && minSide <= 500) type = \"phone\";\n        else if (touch > 0 && minSide > 500 && maxSide <= 1400) type = \"tablet\";\n\n        var iosMajor = null;\n        var osToken = null;\n        var safariToken = null;\n        var iphoneOs = ua.match(/iPhone OS (\\d+)[._]/);\n        var ipadOs = ua.match(/CPU OS (\\d+)[._](\\d+) like Mac OS X/);\n        var safariVer = ua.match(/Version\\/(\\d+)[._]/);\n        if (iphoneOs) osToken = parseInt(iphoneOs[1], 10);\n        else if (ipadOs) osToken = parseInt(ipadOs[1], 10);\n        if (isIOS && safariVer) safariToken = parseInt(safariVer[1], 10);\n        if (osToken != null || safariToken != null) {\n          iosMajor = Math.max(osToken || 0, safariToken || 0);\n        }\n\n        var root = document.documentElement;\n        var classes = [\"device-\" + type];\n        if (iosMajor != null) {\n          root.dataset.ios = String(iosMajor);\n          classes.push(iosMajor >= 27 ? \"ios-27-plus\" : \"ios-below-27\");\n        }\n        root.className = classes.join(\" \");\n      })();\n    <\/script>\n  </head>\n  <body>\n    <div class=\"page\">\n      <header class=\"powered\" aria-label=\"Powered by Grok\">\n        <span class=\"powered-by\">Powered by</span>\n        <span class=\"powered-brand\">\n          <img\n            class=\"grok-logo\"\n            src=\"/__grok/install/assets/homescreen/logo-grok.svg\"\n            width=\"14\"\n            height=\"14\"\n            alt=\"\"\n          />\n          <span class=\"powered-grok\">Grok</span>\n        </span>\n      </header>\n\n      <main class=\"content\">\n        <div class=\"ob\" aria-hidden=\"true\">\n          <img\n            class=\"ob-img ob-phone\"\n            src=\"/__grok/install/assets/homescreen/ob-phone.png\"\n            width=\"338\"\n            height=\"294\"\n            alt=\"\"\n          />\n          <img\n            class=\"ob-img ob-ipad\"\n            src=\"/__grok/install/assets/homescreen/ob-ipad.png\"\n            width=\"634\"\n            height=\"294\"\n            alt=\"\"\n          />\n        </div>\n\n        <section class=\"copy\">\n          <h1>Add {{APP_NAME}} to your&nbsp;Home&nbsp;Screen</h1>\n\n          <div class=\"steps\">\n            <p class=\"step step-tap step-ios27\">\n              <span class=\"muted\">Tap</span>\n              <span class=\"glass glass--icon\" aria-hidden=\"true\">\n                <img src=\"/__grok/install/assets/homescreen/glass-puzzle.svg\" width=\"24\" height=\"24\" alt=\"\" />\n              </span>\n              <span class=\"muted loc loc-phone\">in the bottom bar, then</span>\n              <span class=\"muted loc loc-ipad\">in the tool bar, then</span>\n              <span class=\"glass glass--icon\" aria-hidden=\"true\">\n                <img src=\"/__grok/install/assets/homescreen/glass-share.svg\" width=\"24\" height=\"24\" alt=\"\" />\n              </span>\n            </p>\n\n            <p class=\"step step-tap step-ios-legacy\">\n              <span class=\"muted\">Tap</span>\n              <span class=\"glass glass--icon\" aria-hidden=\"true\">\n                <img src=\"/__grok/install/assets/homescreen/glass-share.svg\" width=\"24\" height=\"24\" alt=\"\" />\n              </span>\n              <span class=\"muted loc loc-phone\">in the bottom bar</span>\n              <span class=\"muted loc loc-ipad\">in the tool bar</span>\n            </p>\n\n            <p class=\"step step-select\">\n              <span class=\"muted\">Select</span>\n              <span class=\"add-label\">\n                <img\n                  class=\"plus-icon\"\n                  src=\"/__grok/install/assets/homescreen/plus.svg\"\n                  width=\"16\"\n                  height=\"16\"\n                  alt=\"\"\n                />\n                <span class=\"add-text\">Add to Home Screen</span>\n              </span>\n            </p>\n          </div>\n        </section>\n      </main>\n\n      <main class=\"content content-desktop\">\n        <section class=\"copy\">\n          <h1>Open this link on your iPhone&nbsp;or&nbsp;iPad</h1>\n          <p class=\"desktop-note\">\n            This page shows how to add {{APP_NAME}} to an iOS Home Screen.\n          </p>\n          <a class=\"desktop-open\" href=\"{{APP_URL}}\">Open {{APP_NAME}}</a>\n        </section>\n      </main>\n    </div>\n  </body>\n</html>\n";
//#endregion
//#region \0virtual:grok-og-identity
var grokOgIdentity = { "site": {
	"title": "[ S1R1U$ <<L@B$>> ]",
	"type": "x:game",
	"card": "custom",
	"description": "S1R1U$ 9-B0T Hedge Fund · G0DZ1LLa M0D3 · official X @S1R1US_AI · GitHub S1R1US-AI/S1R1US-LABs · AI agents · bitcoin accumulation agent · OP3N S0URC3. S1R1US 9-B0T Hedge Fund. Education only. Not financial advice.",
	"image": "/og.jpg",
	"banner": "/x-banner.jpg"
} };
//#endregion
//#region scripts/grok-pwa-shared.mjs
/**
* Single source of truth for platform head chrome (PWA, extensions.js, OG),
* shared by the Vite plugin and Nitro middleware. Plain ESM so `node --test`
* and the Nitro bundler can both consume it.
*/
var DEFAULT_APP_NAME = "Grok App";
var OG_SITE_REL_PATH = "src/lib/og/site.json";
var SHARE_META_KEYS = /* @__PURE__ */ new Set([
	"og:title",
	"og:description",
	"og:image",
	"og:image:width",
	"og:image:height",
	"og:type",
	"og:url",
	"og:site_name",
	"twitter:card",
	"twitter:title",
	"twitter:image",
	"twitter:description",
	"x:game:image",
	"x:game:image:width",
	"x:game:image:height"
]);
function escapeHtml(value) {
	return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\"", "&quot;").replaceAll("'", "&#39;");
}
/** Inverse of escapeHtml. Decode &amp; last so a single pass undoes one encode. */
function unescapeHtml(value) {
	return String(value).replaceAll("&lt;", "<").replaceAll("&gt;", ">").replaceAll("&quot;", "\"").replaceAll("&#39;", "'").replaceAll("&amp;", "&");
}
/** 6-digit hex for the og.grok.me placeholder, or "" if site.color is missing/invalid. */
function placeholderCardColor(site = {}) {
	const raw = String(site.color ?? "").trim();
	const hex = raw.startsWith("#") ? raw.slice(1) : raw;
	return /^[0-9a-fA-F]{6}$/.test(hex) ? hex : "";
}
/**
* "wild-race.grok.me" → "Wild Race". Only published app hosts encode the
* display name in the first label. Preview / guest hosts are image origins
* only — slugifying them produced internal names like "Hds Abc 3000 Xy".
*/
function appNameFromHost(hostHeader) {
	const host = String(hostHeader ?? "").split(",")[0].trim().split(":")[0].toLowerCase();
	if (!host.endsWith(".grok.me")) return DEFAULT_APP_NAME;
	const slug = host.split(".")[0] ?? "";
	if (!slug || slug === "www" || !/^[a-z0-9-]{1,63}$/.test(slug)) return DEFAULT_APP_NAME;
	return slug.split("-").filter(Boolean).map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" ") || "Grok App";
}
/** True for Vercel system domains. Envoy rewrites origin Host to these; they SSO-protect `/og.jpg`. */
function isVercelSystemHost(host) {
	return host === "vercel.app" || host.endsWith(".vercel.app") || host === "vercel.com" || host.endsWith(".vercel.com");
}
/** Hostname suitable for absolute og:image URLs. Preview guests (X-Forwarded-Host) are allowed. */
function publicAppHost(hostHeader) {
	const host = String(hostHeader ?? "").split(",")[0].trim().split(":")[0].toLowerCase();
	if (!host || !/^[a-z0-9.-]+$/.test(host) || !host.includes(".")) return "";
	if (/^\d{1,3}(?:\.\d{1,3}){3}$/.test(host)) return "";
	if (isVercelSystemHost(host)) return "";
	return host;
}
/**
* Published apps always use `VITE_PUBLIC_HOSTNAME` (the grok.me host the
* deployer injects). Live preview has no such env, so fall back to the
* request host / X-Forwarded-Host. Never prefer request Host on a published
* app — Envoy rewrites it to `*.vercel.app`.
*/
function resolvePublicHost(hostHeader) {
	return publicAppHost(process.env?.VITE_PUBLIC_HOSTNAME) || publicAppHost(hostHeader);
}
function isInstallQuery(url) {
	const query = String(url ?? "").split("?", 2)[1] ?? "";
	const params = new URLSearchParams(query);
	const install = params.get("install");
	const platform = (params.get("platform") ?? "").toLowerCase();
	return (install === "1" || install === "true") && platform === "ios";
}
/** Paths that can carry an app document (vs assets / API / internals). */
function isDocumentPath(pathname) {
	const path = String(pathname ?? "");
	return !path.startsWith("/__grok/") && !path.startsWith("/api/") && !path.startsWith("/@") && !path.startsWith("/node_modules") && !/\.[a-z0-9]+$/i.test(path);
}
function acceptsHtml(accept) {
	const value = String(accept ?? "");
	return value === "" || value.includes("text/html") || value.includes("*/*");
}
/** The same URL without the install-tutorial params (used as the app link). */
function stripInstallParams(url) {
	const [path = "/", query = ""] = String(url ?? "/").split("?", 2);
	const params = new URLSearchParams(query);
	params.delete("install");
	params.delete("platform");
	const rest = params.toString();
	return rest ? `${path}?${rest}` : path;
}
function renderInstallPageHtml(template, { host, url } = {}) {
	return String(template).replaceAll("{{APP_NAME}}", escapeHtml(appNameFromHost(host))).replaceAll("{{APP_URL}}", escapeHtml(stripInstallParams(url)));
}
function renderWebManifest(hostHeader) {
	const name = appNameFromHost(hostHeader);
	return JSON.stringify({
		name,
		short_name: name,
		id: "/",
		start_url: "/",
		scope: "/",
		display: "standalone",
		background_color: "#000000",
		theme_color: "#000000",
		icons: [{
			src: "/__grok/icon-180.png",
			sizes: "180x180",
			type: "image/png"
		}]
	}, null, 2);
}
function grokPwaHeadTags(appName = DEFAULT_APP_NAME) {
	return [
		["manifest", "<link rel=\"manifest\" href=\"/__grok/manifest.webmanifest\">"],
		["apple-touch-icon", "<link rel=\"apple-touch-icon\" href=\"/__grok/icon-180.png\">"],
		["apple-mobile-web-app-title", `<meta name="apple-mobile-web-app-title" content="${escapeHtml(appName)}">`],
		["apple-mobile-web-app-status-bar-style", "<meta name=\"apple-mobile-web-app-status-bar-style\" content=\"black\">"],
		["theme-color", "<meta name=\"theme-color\" content=\"#000000\">"]
	];
}
var GROK_EXTENSIONS_SCRIPT_SRC = "https://grok.com/grok-app-builder/extensions.js";
function readGrokProjectId() {
	const fromProcess = typeof process !== "undefined" ? process.env?.VITE_PROJECT_ID : "";
	return String(fromProcess ?? "").trim();
}
function readXCreator() {
	const fromProcess = typeof process !== "undefined" ? process.env?.X_CREATOR : "";
	return String(fromProcess ?? "").trim();
}
function readXCreatorId() {
	const fromProcess = typeof process !== "undefined" ? process.env?.X_CREATOR_ID : "";
	return String(fromProcess ?? "").trim();
}
function grokXCreatorHeadTags(creator = readXCreator(), creatorId = readXCreatorId()) {
	const name = String(creator ?? "").trim();
	const id = String(creatorId ?? "").trim();
	if (!name || !id) return [];
	return [`<meta property="x:creator" content="${escapeHtml(name)}">`, `<meta property="x:creator:id" content="${escapeHtml(id)}">`];
}
/** Platform "Created with Grok" banner — injected into every HTML document. */
function grokExtensionsHeadTags(projectId = readGrokProjectId()) {
	const id = escapeHtml(projectId);
	const tags = [];
	if (projectId) tags.push(`<meta name="grok-project-id" content="${id}">`);
	tags.push(`<script src="${GROK_EXTENSIONS_SCRIPT_SRC}"${projectId ? ` data-project-id="${id}"` : ""} defer><\/script>`);
	return tags;
}
function readOgSite(cwd = process.cwd()) {
	try {
		const raw = readFileSync(join(cwd, OG_SITE_REL_PATH), "utf8");
		const parsed = JSON.parse(raw);
		return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
	} catch {
		return {};
	}
}
/** Public path of an on-disk share card, or "" if neither file exists. */
function ogCardPublicPath(cwd = process.cwd()) {
	if (existsSync(join(cwd, "public/og.jpg"))) return "/og.jpg";
	if (existsSync(join(cwd, "public/og.png"))) return "/og.png";
	return "";
}
function detectCustomOgCard(cwd = process.cwd(), site = {}) {
	if (ogCardPublicPath(cwd)) return true;
	return siteHasCustomCard(site) || Boolean(String(site.image ?? "").trim());
}
/** Snapshot for Vite/Nitro to bake into the server bundle (Vercel has no workspace FS). */
function snapshotOgIdentity(cwd = process.cwd()) {
	const site = { ...readOgSite(cwd) };
	const disk = ogCardPublicPath(cwd);
	if (disk) {
		site.card = "custom";
		site.image = disk;
	} else {
		if (siteHasCustomCard(site)) delete site.card;
		if (site.image) delete site.image;
	}
	if (existsSync(join(cwd, "public/x-banner.jpg"))) site.banner = site.banner || "/x-banner.jpg";
	return { site };
}
function ogServiceUrl() {
	return (String(process.env?.VITE_OG_SERVICE_URL ?? "").trim() || "https://og.grok.me").replace(/\/+$/, "");
}
function titleFromDocument(html) {
	const match = String(html ?? "").match(/<title\b[^>]*>([^<]*)<\/title>/i);
	return match ? unescapeHtml(match[1]).trim() : "";
}
function resolveOgTitle(site = {}, appName = DEFAULT_APP_NAME, host = "", documentTitle = "") {
	const fromSite = String(site.title ?? "").trim();
	if (fromSite) return fromSite;
	const fromDoc = String(documentTitle ?? "").trim();
	if (fromDoc) return fromDoc;
	const fromHost = appNameFromHost(host);
	if (fromHost && fromHost !== "Grok App") return fromHost;
	return String(appName ?? "").trim() || "Grok App";
}
function siteHasCustomCard(site = {}) {
	return String(site.card ?? "").toLowerCase() === "custom";
}
/**
* Preview: public/og.jpg|png on disk.
* Vercel: the bake (`card=custom` / `image`) because the function cannot stat public/.
* Otherwise empty — caller emits the og.grok.me placeholder.
*/
function resolveOgCardAsset(site = {}, cwd = process.cwd()) {
	return ogCardPublicPath(cwd) || (detectCustomOgCard(cwd, site) ? String(site.image ?? "").trim() || "/og.jpg" : "");
}
/** Stamp `card=custom` when public/og.jpg or public/og.png is on disk. */
function applyCustomCardFromFs(site, cwd) {
	const disk = ogCardPublicPath(cwd);
	if (!disk) return site;
	return {
		...site,
		card: "custom",
		image: disk
	};
}
function grokOgHeadTags({ host = "", appName = DEFAULT_APP_NAME, site = {}, documentTitle = "", cwd = process.cwd() } = {}) {
	const title = resolveOgTitle(site, appName, host, documentTitle);
	const publicHost = resolvePublicHost(host);
	const tags = [`<meta name="twitter:card" content="summary_large_image">`, `<meta property="og:title" content="${escapeHtml(title)}">`];
	const description = String(site.description ?? "").trim();
	if (description) tags.push(`<meta property="og:description" content="${escapeHtml(description)}">`);
	if (String(site.type ?? "").toLowerCase() === "x:game") tags.push(`<meta property="og:type" content="x:game">`);
	if (publicHost) {
		const asset = resolveOgCardAsset(site, cwd);
		const custom = Boolean(asset);
		let image = custom ? `https://${publicHost}${asset.startsWith("/") ? asset : `/${asset}`}` : `${ogServiceUrl()}/v1/card.png?host=${encodeURIComponent(publicHost)}&title=${encodeURIComponent(title)}`;
		const color = !custom ? placeholderCardColor(site) : "";
		if (color) image += `&color=${encodeURIComponent(color)}`;
		tags.push(`<meta property="og:image" content="${escapeHtml(image)}">`);
		tags.push(`<meta property="og:image:width" content="1200">`);
		tags.push(`<meta property="og:image:height" content="630">`);
		const banner = String(site.banner ?? "").trim();
		if (banner) {
			const bannerUrl = `https://${publicHost}${banner.startsWith("/") ? banner : `/${banner}`}`;
			tags.push(`<meta property="x:game:image" content="${escapeHtml(bannerUrl)}">`);
			tags.push(`<meta property="x:game:image:width" content="1200">`);
			tags.push(`<meta property="x:game:image:height" content="264">`);
		}
	}
	return tags;
}
function stripShareMetaTags(html) {
	return String(html).replace(/<meta\b[^>]*>/gi, (tag) => {
		const attrs = [...tag.matchAll(/\b(?:property|name)\s*=\s*["']([^"']+)["']/gi)];
		for (const match of attrs) if (SHARE_META_KEYS.has(String(match[1]).toLowerCase())) return "";
		return tag;
	});
}
function insertAfterHeadOpen(html, snippet) {
	if (/<head\b[^>]*>/i.test(html)) return html.replace(/<head\b[^>]*>/i, (open) => `${open}${snippet}`);
	if (/<html\b[^>]*>/i.test(html)) return html.replace(/<html\b[^>]*>/i, (open) => `${open}<head>${snippet}</head>`);
	return `<!doctype html><html><head>${snippet}</head>${html}`;
}
function insertBeforeHeadClose(html, snippet) {
	if (/<\/head>/i.test(html)) return html.replace(/<\/head>/i, (close) => `${snippet}${close}`);
	return insertAfterHeadOpen(html, snippet);
}
function normalizeHeadContext(ctx = {}) {
	const cwd = ctx.cwd ?? process.cwd();
	const site = applyCustomCardFromFs(ctx.site !== void 0 ? ctx.site : snapshotOgIdentity(cwd).site, cwd);
	return {
		appName: resolveOgTitle(site, ctx.appName ?? "Grok App", ctx.host ?? ""),
		projectId: ctx.projectId ?? readGrokProjectId(),
		creator: ctx.creator ?? readXCreator(),
		creatorId: ctx.creatorId ?? readXCreatorId(),
		host: ctx.host ?? "",
		cwd,
		site
	};
}
function injectGrokPwaHead(html, ctx = {}) {
	if (typeof html !== "string") return html;
	const { site, projectId, creator, creatorId, host, cwd } = normalizeHeadContext(ctx);
	const documentTitle = titleFromDocument(html);
	const appName = resolveOgTitle(site, ctx.appName ?? "Grok App", host, documentTitle);
	let next = stripShareMetaTags(html);
	const missing = grokPwaHeadTags(appName).filter(([key]) => {
		if (key === "manifest") return !next.includes("href=\"/__grok/manifest.webmanifest\"");
		if (key === "apple-touch-icon") return !next.includes("href=\"/__grok/icon-180.png\"");
		return !next.includes(`name="${key}"`);
	}).map(([, tag]) => tag);
	next = insertAfterHeadOpen(next, grokOgHeadTags({
		host,
		appName,
		site,
		documentTitle,
		cwd
	}).join(""));
	if (!next.includes("/grok-app-builder/extensions.js")) missing.push(...grokExtensionsHeadTags(projectId));
	else if (projectId && !next.includes("name=\"grok-project-id\"")) missing.push(`<meta name="grok-project-id" content="${escapeHtml(projectId)}">`);
	if (projectId && !next.includes("property=\"grok:app_id\"") && !next.includes("property='grok:app_id'")) missing.push(`<meta property="grok:app_id" content="${escapeHtml(projectId)}">`);
	const creatorTags = grokXCreatorHeadTags(creator, creatorId);
	if (creatorTags.length > 0) {
		if (!(next.includes("property=\"x:creator\" content=") || next.includes("property='x:creator' content="))) missing.push(creatorTags[0]);
		if (!next.includes("property=\"x:creator:id\"")) missing.push(creatorTags[1]);
	}
	if (missing.length === 0) return next;
	return insertBeforeHeadClose(next, missing.join(""));
}
function findHeadClose(buf) {
	return buf.toString("latin1").search(/<\/head>/i);
}
/**
* Streaming head injector: buffers only until `</head>` (ASCII marker; never
* appears inside a UTF-8 continuation byte), overwrites share-card metas,
* then passes later chunks through so streaming SSR keeps streaming.
*/
function createHeadInjector(ctx = {}) {
	const normalized = normalizeHeadContext(ctx);
	/** @type {Buffer[]} */
	let pending = [];
	let done = false;
	const apply = (html) => injectGrokPwaHead(html, {
		appName: normalized.appName,
		projectId: normalized.projectId,
		creator: normalized.creator,
		creatorId: normalized.creatorId,
		host: normalized.host,
		cwd: normalized.cwd,
		site: normalized.site
	});
	return {
		/** @param {Uint8Array | string} chunk @returns {Buffer[]} chunks ready to emit */
		push(chunk) {
			const buf = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
			if (done) return [buf];
			pending.push(buf);
			const joined = Buffer.concat(pending);
			const at = findHeadClose(joined);
			if (at === -1) return [];
			done = true;
			pending = [];
			const closeLen = joined.toString("latin1", at).match(/^<\/head>/i)[0].length;
			const head = apply(joined.subarray(0, at + closeLen).toString("utf8"));
			return [Buffer.concat([Buffer.from(head, "utf8"), joined.subarray(at + closeLen)])];
		},
		/** @returns {Buffer[]} whatever is still buffered (no `</head>` seen) */
		flush() {
			if (done || pending.length === 0) return [];
			const rest = Buffer.concat(pending);
			pending = [];
			done = true;
			return [Buffer.from(apply(rest.toString("utf8")), "utf8")];
		}
	};
}
//#endregion
//#region server/middleware/grok-pwa.ts
/**
* Deployed-app (Nitro) half of the platform PWA chrome. Auto-registered as
* global h3 middleware because vite.config.ts sets `serverDir: "./server"` —
* without that option Nitro v3 never scans this directory.
*
* - `?install=1&platform=ios` on a document path → the Home Screen tutorial,
*   bundled into the server build via `?raw` (the public/ directory is CDN
*   static output on Vercel and not readable from the function).
* - `/__grok/manifest.webmanifest` → per-app-named manifest (kept out of
*   public/ so this dynamic response is the only one).
* - Other HTML documents → stream-inject PWA + OG head tags at `</head>`.
*   OG identity is baked via `virtual:grok-og-identity` at `vite build`
*   (this function cannot read `src/lib/og/site.json` or `public/og.jpg`).
*   This must be a middleware transforming `next()`: h3 discards the `response`
*   runtime hook's return value, and `render:html` does not exist in Nitro v3.
*/
function requestHost(event) {
	return event.req.headers.get("x-forwarded-host") ?? event.req.headers.get("host") ?? event.url.host;
}
function injectHeadStreaming(response, host) {
	const injector = createHeadInjector({
		host,
		site: grokOgIdentity.site
	});
	const transformed = response.body.pipeThrough(new TransformStream({
		transform(chunk, controller) {
			for (const out of injector.push(chunk)) controller.enqueue(out);
		},
		flush(controller) {
			for (const out of injector.flush()) controller.enqueue(out);
		}
	}));
	const headers = new Headers(response.headers);
	headers.delete("content-length");
	return new Response(transformed, {
		status: response.status,
		statusText: response.statusText,
		headers
	});
}
async function grokPwaMiddleware(event, next) {
	if ((event.req.method ?? "GET").toUpperCase() !== "GET") return next();
	const path = event.url.pathname;
	const urlWithQuery = path + event.url.search;
	if (path === "/__grok/manifest.webmanifest" || path === "/__grok/manifest.json") return new Response(renderWebManifest(requestHost(event)), { headers: {
		"content-type": "application/manifest+json; charset=utf-8",
		"cache-control": "no-cache"
	} });
	if (isInstallQuery(urlWithQuery) && isDocumentPath(path) && acceptsHtml(event.req.headers.get("accept"))) {
		const html = renderInstallPageHtml(install_page_default, {
			host: requestHost(event),
			url: urlWithQuery
		});
		return new Response(html, { headers: {
			"content-type": "text/html; charset=utf-8",
			"cache-control": "no-cache"
		} });
	}
	if (!isDocumentPath(path)) return next();
	const result = await next();
	if (result instanceof Response && result.body && String(result.headers.get("content-type") ?? "").includes("text/html") && !result.headers.get("content-encoding")) return injectHeadStreaming(result, requestHost(event));
	return result;
}
//#endregion
//#region server/middleware/home-apex.ts
function homeLocation(event) {
	const host = (event.req.headers.get("x-forwarded-host") ?? event.req.headers.get("host") ?? event.url.host).split(",")[0]?.trim().split(":")[0]?.toLowerCase();
	if (host === "s1r1us.ai" || host === "www.s1r1us.ai") return "https://s1r1us.ai/";
	return "/";
}
async function homeApexMiddleware(event, next) {
	if (((event.url.pathname || "/").replace(/\/+$/, "") || "/").toLowerCase() !== "/heliosbot") return next();
	return new Response(null, {
		status: 301,
		headers: {
			location: homeLocation(event),
			"cache-control": "no-store"
		}
	});
}
//#endregion
//#region #nitro/virtual/routing
var findRouteRules = /* @__PURE__ */ (() => {
	const $0 = [{
		name: "redirect",
		route: "/heliosbot",
		handler: redirect,
		options: {
			"to": "/",
			"status": 307,
			"statusCode": 301
		}
	}], $1 = [{
		name: "redirect",
		route: "/heliosbot/**",
		handler: redirect,
		options: {
			"to": "/",
			"status": 307,
			"statusCode": 301,
			"_redirectStripBase": "/heliosbot"
		}
	}], $2 = [{
		name: "headers",
		route: "/assets/**",
		handler: headers,
		options: { "cache-control": "public, max-age=31536000, immutable" }
	}];
	return (m, p) => {
		let r = [];
		if (p.charCodeAt(p.length - 1) === 47) p = p.slice(0, -1) || "/";
		if (p === "/heliosbot") r.unshift({ data: $0 });
		let s = p.split("/");
		if (s.length > 1) {
			if (s[1] === "heliosbot") r.unshift({
				data: $1,
				params: { "_": s.slice(2).join("/") }
			});
			else if (s[1] === "assets") r.unshift({
				data: $2,
				params: { "_": s.slice(2).join("/") }
			});
		}
		return r;
	};
})();
var _lazy_T2XK7O = defineLazyEventHandler(() => import("./_chunks/ssr-renderer.mjs"));
var findRoute = /* @__PURE__ */ (() => {
	const data = {
		route: "/**",
		handler: _lazy_T2XK7O
	};
	return ((_m, p) => {
		return {
			data,
			params: { "_": p.slice(1) }
		};
	});
})();
var globalMiddleware = [
	toEventHandler(static_default),
	toEventHandler(wafMiddleware),
	toEventHandler(agentGuardMiddleware),
	toEventHandler(grokPwaMiddleware),
	toEventHandler(homeApexMiddleware)
].filter(Boolean);
//#endregion
//#region node_modules/nitro/dist/runtime/internal/error/prod.mjs
var errorHandler = (error, event) => {
	const res = defaultHandler(error, event);
	return new NodeResponse(typeof res.body === "string" ? res.body : JSON.stringify(res.body, null, 2), res);
};
function defaultHandler(error, event) {
	const unhandled = error.unhandled ?? !HTTPError.isError(error);
	const { status = 500, statusText = "" } = unhandled ? {} : error;
	if (status === 404) {
		const url = event.url || new URL(event.req.url);
		const baseURL = "/";
		if (/^\/[^/]/.test(baseURL) && !url.pathname.startsWith(baseURL)) return {
			status: 302,
			headers: new Headers({ location: `${baseURL}${url.pathname.slice(1)}${url.search}` })
		};
	}
	const headers = new Headers(unhandled ? {} : error.headers);
	headers.set("content-type", "application/json; charset=utf-8");
	return {
		status,
		statusText,
		headers,
		body: {
			error: true,
			...unhandled ? {
				status,
				unhandled: true
			} : typeof error.toJSON === "function" ? error.toJSON() : {
				status,
				statusText,
				message: error.message
			}
		}
	};
}
//#endregion
//#region #nitro/virtual/error-handler
var errorHandlers = [errorHandler];
async function error_handler_default(error, event) {
	for (const handler of errorHandlers) try {
		const response = await handler(error, event, { defaultHandler });
		if (response) return response;
	} catch (error) {
		console.error(error);
	}
}
//#endregion
//#region #nitro/virtual/app
function createNitroApp() {
	const captureError = (error, errorCtx) => {
		if (errorCtx?.event) {
			const errors = errorCtx.event.req.context?.nitro?.errors;
			if (errors) errors.push({
				error,
				context: errorCtx
			});
		}
	};
	const h3App = createH3App({ onError(error, event) {
		return error_handler_default(error, event);
	} });
	let appHandler = (req) => {
		req.context ||= {};
		req.context.nitro = req.context.nitro || { errors: [] };
		return h3App.fetch(req);
	};
	return {
		fetch: appHandler,
		h3: h3App,
		hooks: void 0,
		captureError
	};
}
function createH3App(config) {
	const h3App = new H3Core(config);
	h3App["~findRoute"] = (event) => findRoute(event.req.method, event.url.pathname);
	h3App["~middleware"].push(...globalMiddleware);
	h3App["~getMiddleware"] = (event, route) => {
		const pathname = event.url.pathname;
		const method = event.req.method;
		const middleware = [];
		const routeRules = getRouteRules(method, pathname);
		event.context.routeRules = routeRules?.routeRules;
		if (routeRules?.routeRuleMiddleware.length) middleware.push(...routeRules.routeRuleMiddleware);
		middleware.push(...h3App["~middleware"]);
		if (route?.data?.middleware?.length) middleware.push(...route.data.middleware);
		return middleware;
	};
	return h3App;
}
//#endregion
//#region node_modules/nitro/dist/runtime/internal/app.mjs
var APP_ID = "default";
function useNitroApp() {
	let instance = useNitroApp._instance;
	if (instance) return instance;
	instance = useNitroApp._instance = createNitroApp();
	globalThis.__nitro__ = globalThis.__nitro__ || {};
	globalThis.__nitro__[APP_ID] = instance;
	return instance;
}
function getRouteRules(method, pathname) {
	const m = findRouteRules(method, pathname);
	if (!m?.length) return { routeRuleMiddleware: [] };
	const routeRules = {};
	for (const layer of m) for (const rule of layer.data) {
		const currentRule = routeRules[rule.name];
		if (currentRule) {
			if (rule.options === false) {
				delete routeRules[rule.name];
				continue;
			}
			if (typeof currentRule.options === "object" && typeof rule.options === "object") currentRule.options = {
				...currentRule.options,
				...rule.options
			};
			else currentRule.options = rule.options;
			currentRule.route = rule.route;
			currentRule.params = {
				...currentRule.params,
				...layer.params
			};
		} else if (rule.options !== false) routeRules[rule.name] = {
			...rule,
			params: layer.params
		};
	}
	const middleware = [];
	const orderedRules = Object.values(routeRules).sort((a, b) => (a.handler?.order || 0) - (b.handler?.order || 0));
	for (const rule of orderedRules) {
		if (rule.options === false || !rule.handler) continue;
		middleware.push(rule.handler(rule));
	}
	return {
		routeRules,
		routeRuleMiddleware: middleware
	};
}
//#endregion
//#region node_modules/nitro/dist/runtime/internal/error/hooks.mjs
function _captureError(error, type) {
	console.error(`[${type}]`, error);
	useNitroApp().captureError?.(error, { tags: [type] });
}
function trapUnhandledErrors() {
	process.on("unhandledRejection", (error) => _captureError(error, "unhandledRejection"));
	process.on("uncaughtException", (error) => _captureError(error, "uncaughtException"));
}
//#endregion
//#region #nitro/virtual/tracing
var tracingSrvxPlugins = [];
//#endregion
//#region node_modules/nitro/dist/presets/node/runtime/node-server.mjs
var _parsedPort = Number.parseInt(process.env.NITRO_PORT ?? process.env.PORT ?? "");
var port = Number.isNaN(_parsedPort) ? 3e3 : _parsedPort;
var host = process.env.NITRO_HOST || process.env.HOST;
var cert = process.env.NITRO_SSL_CERT;
var key = process.env.NITRO_SSL_KEY;
var nitroApp = useNitroApp();
serve({
	port,
	hostname: host,
	tls: cert && key ? {
		cert,
		key
	} : void 0,
	fetch: nitroApp.fetch,
	plugins: [...tracingSrvxPlugins]
});
trapUnhandledErrors();
var node_server_default = {};
//#endregion
export { node_server_default as default, PUBLIC_GITHUB as n, agentSourceDenied as r, AGENT_SOURCE_MESSAGE as t };
