import { o as __toESM } from "../_runtime.mjs";
import { H as require_react, x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { L as TAB_LAB, n as APP_NAME, t as APP_CALLS } from "./brand-iv-XZ0o2.mjs";
import { f as looksLikeSecret } from "./security-LsSQVjJ2.mjs";
import { n as runBots, t as heliosCall } from "./signal-BqWu6ECB.mjs";
import { h as useOperator } from "./operator-Mf8Bhxch.mjs";
import { _ as useDeskTape, p as peekDeskTape, r as STOP_DEFAULT, u as initialStop, v as usePaper } from "./store-CmU31tUT.mjs";
import { c as fgTone, n as Button, s as cn } from "./renew-password-CkoXvjlb.mjs";
import { a as Radio } from "../_libs/lucide-react.mjs";
import { c as Shell, s as Panel } from "./shell-ORcVF3D4.mjs";
import { a as bannerTone, n as HeliosCard, o as money, r as PaperCard, s as stanceClass, t as CallWords } from "./helios-card-B5_3M1Zb.mjs";
import { i as askHelios, t as TapeFreezeBanner } from "./grok-SzEUGxaV.mjs";
import { t as SeoCopy } from "./seo-copy-BYIzP5_n.mjs";
import { t as LiveTracks } from "./live-tracks-Cgs4VDpT.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/helios-DWB8tLJJ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/** Slider zeros until live tape arrives. Never a market print. */
var DEFAULT_KNOBS = {
	price: 0,
	rsi: 50,
	fg: 50,
	longShort: 1,
	fundingPct: 0,
	kimchi: 0,
	cnyOtc: 0,
	emHot: 0,
	emOut: 0,
	etfFlowM: 0,
	goldOz: 18
};
var EM_META = [
	{
		id: "UAE",
		name: "UAE"
	},
	{
		id: "ME",
		name: "Middle East"
	},
	{
		id: "RU",
		name: "Russia"
	},
	{
		id: "AF",
		name: "Africa"
	},
	{
		id: "SA",
		name: "South America"
	}
];
function fgLabel(v) {
	if (v <= 24) return "Extreme Fear";
	if (v <= 44) return "Fear";
	if (v <= 55) return "Neutral";
	if (v <= 74) return "Greed";
	return "Extreme Greed";
}
var LAB_PRESETS = [
	{
		id: "live",
		name: "Live tape",
		blurb: "No overlay. Bot 7 reads the last validated pull.",
		knobs: { ...DEFAULT_KNOBS }
	},
	{
		id: "crash",
		name: "Crash bid",
		blurb: "RSI panic, extreme fear, EM offering — does Bot 7 BUY or wait the knife?",
		knobs: {
			...DEFAULT_KNOBS,
			rsi: 27,
			fg: 18,
			longShort: .82,
			fundingPct: -.01,
			kimchi: -2.1,
			cnyOtc: -1.2,
			emHot: 0,
			emOut: 2,
			etfFlowM: -180,
			goldOz: 15.2
		}
	},
	{
		id: "discount",
		name: "Asia discount",
		blurb: "Upbit and EM at a discount. Accumulation without a crash print.",
		knobs: {
			...DEFAULT_KNOBS,
			rsi: 38,
			fg: 32,
			kimchi: -1.8,
			cnyOtc: -.4,
			emHot: 0,
			emOut: 2,
			etfFlowM: -40,
			goldOz: 16.4
		}
	},
	{
		id: "fomo",
		name: "Asia FOMO",
		blurb: "Crowded kimchi, CNY OTC heat, longs paying. Mandate says do not chase.",
		knobs: {
			...DEFAULT_KNOBS,
			rsi: 71,
			fg: 78,
			longShort: 1.72,
			fundingPct: .06,
			kimchi: 4.6,
			cnyOtc: 3.1,
			emHot: 2,
			etfFlowM: 420,
			goldOz: 20.8
		}
	},
	{
		id: "em",
		name: "EM crowded",
		blurb: "Four regions hot. Coordinator should block a chase.",
		knobs: {
			...DEFAULT_KNOBS,
			rsi: 49,
			fg: 64,
			emHot: 4,
			emOut: 0,
			etfFlowM: 80
		}
	},
	{
		id: "trim",
		name: "Trim heat",
		blurb: "RSI > 72 and greed ≥ 75 — paper inventory only, never a short.",
		knobs: {
			...DEFAULT_KNOBS,
			rsi: 78,
			fg: 82,
			longShort: 1.85,
			fundingPct: .07,
			kimchi: 2.4,
			emHot: 3,
			etfFlowM: 510,
			goldOz: 21.5
		}
	},
	{
		id: "gold",
		name: "Cheap vs gold",
		blurb: "BTC/gold oz cheap vs the 1y median. Sector votes accumulate.",
		knobs: {
			...DEFAULT_KNOBS,
			rsi: 44,
			fg: 48,
			goldOz: 14.8,
			etfFlowM: -20
		}
	},
	{
		id: "etf",
		name: "ETF melt",
		blurb: "$500M session inflow with RSI ≥ 50 — Bot 7 should WAIT the melt-up.",
		knobs: {
			...DEFAULT_KNOBS,
			rsi: 56,
			fg: 66,
			etfFlowM: 500,
			longShort: 1.45
		}
	}
];
function knobsFromSnap(snap) {
	const hot = snap.em.regions.filter((r) => r.flow === "INFLOW").length;
	const out = snap.em.regions.filter((r) => r.flow === "OUTFLOW").length;
	return {
		price: snap.btc.price ?? 0,
		rsi: snap.rsi14 ?? 50,
		fg: snap.fearGreed?.value ?? 50,
		longShort: snap.positioning.longShort ?? 1,
		fundingPct: (snap.positioning.fundingRate ?? 0) * 100,
		kimchi: snap.asia.kimchiPct ?? 0,
		cnyOtc: snap.asia.cnyOtc.premiumPct ?? 0,
		emHot: hot,
		emOut: out,
		etfFlowM: (snap.capital.etfFlow ?? 0) / 1e6,
		goldOz: snap.goldBtc.ozPerBtc ?? 18
	};
}
function flowAt(i, hot, out) {
	if (i < hot) return {
		flow: "INFLOW",
		premiumPct: 3.2
	};
	if (i < hot + out) return {
		flow: "OUTFLOW",
		premiumPct: -2.1
	};
	return {
		flow: "FLAT",
		premiumPct: .2
	};
}
/** Overlay what-if knobs onto a LIVE snapshot. Never invent ETF/DAT/filings/holders. */
function overlayLive(live, k) {
	const hot = Math.max(0, Math.min(5, Math.round(k.emHot)));
	const out = Math.max(0, Math.min(5 - hot, Math.round(k.emOut)));
	const regions = live.em.regions.length ? live.em.regions.map((r, i) => {
		const { flow, premiumPct } = flowAt(i, hot, out);
		return {
			...r,
			flow,
			premiumPct
		};
	}) : EM_META.map((m, i) => {
		const { flow, premiumPct } = flowAt(i, hot, out);
		return {
			id: m.id,
			name: m.name,
			flow,
			premiumPct,
			venues: [{
				id: m.id,
				region: m.id,
				name: m.name,
				kind: "spot",
				lastUsd: k.price,
				premiumPct
			}]
		};
	});
	const inflow = regions.filter((r) => r.flow === "INFLOW").length;
	const outflow = regions.filter((r) => r.flow === "OUTFLOW").length;
	const oz = k.goldOz > 0 ? k.goldOz : live.goldBtc.ozPerBtc;
	return {
		...live,
		btc: {
			...live.btc,
			price: k.price > 0 ? k.price : live.btc.price
		},
		rsi14: k.rsi,
		fearGreed: {
			value: Math.round(k.fg),
			label: fgLabel(k.fg)
		},
		positioning: {
			...live.positioning,
			longShort: k.longShort,
			fundingRate: k.fundingPct / 100
		},
		asia: {
			...live.asia,
			kimchiPct: k.kimchi,
			cnyOtc: {
				...live.asia.cnyOtc,
				premiumPct: k.cnyOtc
			}
		},
		em: {
			...live.em,
			net: {
				inflow,
				outflow,
				flat: Math.max(0, regions.length - inflow - outflow)
			},
			regions
		},
		capital: {
			...live.capital,
			etfFlow: Number.isFinite(k.etfFlowM) ? k.etfFlowM * 1e6 : live.capital.etfFlow
		},
		goldBtc: {
			...live.goldBtc,
			ozPerBtc: oz,
			btcPerOz: oz != null && oz > 0 ? 1 / oz : live.goldBtc.btcPerOz
		},
		errors: [...live.errors.filter((e) => !e.startsWith("what-if")), "what-if overlay — knobs on live tape, not a feed"]
	};
}
function fmtSigned(n, d = 2, suffix = "%") {
	if (n == null || !Number.isFinite(n)) return "—";
	return `${n >= 0 ? "+" : ""}${n.toFixed(d)}${suffix}`;
}
/** Market-structure read Bot 7 uses. Labs overlay this; Desk paints the live pull. */
function readStructure(snap) {
	const rsi = snap.rsi14;
	const fg = snap.fearGreed?.value ?? null;
	const ls = snap.positioning.longShort;
	const funding = snap.positioning.fundingRate;
	const kimchi = snap.asia.kimchiPct;
	const cny = snap.asia.cnyOtc.premiumPct;
	const emHot = snap.em.regions.filter((r) => r.flow === "INFLOW" && (r.premiumPct ?? 0) > 2.5).length;
	const emOut = snap.em.net.outflow;
	const etf = snap.capital.etfFlow;
	const oz = snap.goldBtc.ozPerBtc;
	const series = snap.goldBtc.series.map((p) => p.ozPerBtc).filter((n) => Number.isFinite(n) && n > 0);
	const med = series.length >= 8 ? [...series].sort((a, b) => a - b)[Math.floor(series.length / 2)] : null;
	const vsMed = oz != null && med != null && med > 0 ? (oz - med) / med : null;
	const crowdedLongs = ls != null && ls > 1.6 || funding != null && funding > 5e-4;
	const asiaFomo = kimchi != null && kimchi >= 3 || cny != null && cny >= 2;
	const asiaDiscount = kimchi != null && kimchi <= -1.5 || emOut >= 2;
	const emCrowded = emHot >= 3;
	const etfMelt = etf != null && etf > 35e7 && (rsi == null || rsi >= 50);
	const panic = rsi != null && rsi < 30 && (fg == null || fg <= 40);
	const greedTrim = rsi != null && rsi > 72 && (fg ?? 0) >= 75;
	const cheapGold = vsMed != null && vsMed <= -.08;
	const richGold = vsMed != null && vsMed >= .12;
	const rows = [
		{
			id: "rsi",
			label: "RSI(14) 1h",
			value: rsi != null ? rsi.toFixed(1) : "—",
			heat: rsi != null && rsi < 40 ? "bid" : rsi != null && rsi > 70 ? "chase" : "neutral"
		},
		{
			id: "fg",
			label: "Fear & Greed",
			value: fg != null ? `${fg} ${snap.fearGreed?.label ?? fgLabel(fg)}` : "—",
			heat: fg != null && fg <= 40 ? "bid" : fg != null && fg >= 70 ? "chase" : "neutral"
		},
		{
			id: "ls",
			label: "Long/short",
			value: ls != null ? ls.toFixed(2) : "—",
			heat: ls != null && ls > 1.6 ? "chase" : ls != null && ls < .9 ? "bid" : "neutral"
		},
		{
			id: "fund",
			label: "Funding",
			value: funding != null ? `${(funding * 100).toFixed(3)}%` : "—",
			heat: funding != null && funding > 5e-4 ? "chase" : funding != null && funding < -1e-4 ? "bid" : "neutral"
		},
		{
			id: "kimchi",
			label: "Kimchi",
			value: fmtSigned(kimchi),
			heat: kimchi != null && kimchi >= 3 ? "chase" : kimchi != null && kimchi <= -1.5 ? "bid" : "neutral"
		},
		{
			id: "cny",
			label: "CNY OTC",
			value: fmtSigned(cny),
			heat: cny != null && cny >= 2 ? "chase" : cny != null && cny <= -1 ? "bid" : "neutral"
		},
		{
			id: "em",
			label: "EM regions",
			value: `${snap.em.net.inflow} in / ${snap.em.net.outflow} out`,
			heat: emCrowded ? "chase" : emOut >= 2 ? "bid" : "neutral"
		},
		{
			id: "etf",
			label: "US spot ETF",
			value: etf == null ? "—" : `${etf >= 0 ? "+" : "−"}$${(Math.abs(etf) / 1e6).toFixed(0)}M`,
			heat: etfMelt ? "chase" : etf != null && etf < -5e7 ? "bid" : "neutral"
		},
		{
			id: "gold",
			label: "BTC / gold oz",
			value: oz != null ? `${oz.toFixed(1)}${vsMed != null ? ` (${vsMed >= 0 ? "+" : ""}${(vsMed * 100).toFixed(0)}% vs 1y)` : ""}` : "—",
			heat: cheapGold ? "bid" : richGold ? "chase" : "neutral"
		}
	];
	const tags = [];
	if (panic) tags.push({
		id: "panic",
		label: "RSI panic / fear",
		heat: "bid"
	});
	if (asiaDiscount) tags.push({
		id: "asia-bid",
		label: "Asia/EM discount",
		heat: "bid"
	});
	if (cheapGold) tags.push({
		id: "gold-bid",
		label: "Cheap vs gold",
		heat: "bid"
	});
	if (etf != null && etf < -5e7) tags.push({
		id: "etf-out",
		label: "ETF outflow",
		heat: "bid"
	});
	if (crowdedLongs) tags.push({
		id: "ls",
		label: "Crowded longs",
		heat: "chase"
	});
	if (asiaFomo) tags.push({
		id: "asia-fomo",
		label: "Asia FOMO",
		heat: "chase"
	});
	if (emCrowded) tags.push({
		id: "em",
		label: "EM crowded",
		heat: "chase"
	});
	if (etfMelt) tags.push({
		id: "etf",
		label: "ETF melt-up",
		heat: "chase"
	});
	if (greedTrim) tags.push({
		id: "trim",
		label: "Trim heat",
		heat: "chase"
	});
	if (richGold) tags.push({
		id: "gold-rich",
		label: "Rich vs gold",
		heat: "chase"
	});
	if (!tags.length) tags.push({
		id: "quiet",
		label: "No crowded / discount print",
		heat: "neutral"
	});
	return {
		rows,
		tags
	};
}
function HeliosLab() {
	const [knobs, setKnobs] = (0, import_react.useState)(DEFAULT_KNOBS);
	const [preset, setPreset] = (0, import_react.useState)("live");
	const [grok, setGrok] = (0, import_react.useState)(null);
	const [grokErr, setGrokErr] = (0, import_react.useState)(null);
	const [asking, setAsking] = (0, import_react.useState)(false);
	const [copied, setCopied] = (0, import_react.useState)(false);
	const [liveNote, setLiveNote] = (0, import_react.useState)(null);
	const { snap: liveTape, loading: loadingLive, refresh: loadTape } = useDeskTape();
	const cash = usePaper((s) => s.cashUsd);
	const btc = usePaper((s) => s.btc);
	const profitBtc = usePaper((s) => s.profitBtc);
	const fills = usePaper((s) => s.fills);
	const fill = usePaper((s) => s.fill);
	const reset = usePaper((s) => s.reset);
	const log = useOperator((s) => s.log);
	const unlocked = useOperator((s) => s.unlocked);
	const role = useOperator((s) => s.role);
	const isAdmin = unlocked && role === "admin";
	const whatIf = Boolean(liveTape && preset !== "live");
	const liveBriefs = (0, import_react.useMemo)(() => liveTape ? runBots(liveTape) : [], [liveTape]);
	const liveNav = cash + (btc + (profitBtc ?? 0)) * (liveTape?.btc.price ?? 0);
	const liveCall = (0, import_react.useMemo)(() => liveTape ? heliosCall(liveTape, liveBriefs, liveNav) : null, [
		liveTape,
		liveBriefs,
		liveNav
	]);
	const engine = liveTape ? whatIf ? overlayLive(liveTape, knobs) : liveTape : null;
	const labBriefs = (0, import_react.useMemo)(() => engine ? runBots(engine) : [], [engine]);
	const labCall = (0, import_react.useMemo)(() => engine ? heliosCall(engine, labBriefs, liveNav) : null, [
		engine,
		labBriefs,
		liveNav
	]);
	function patch(partial) {
		setPreset("custom");
		setKnobs((k) => ({
			...k,
			...partial
		}));
	}
	function applyPreset(id) {
		if (id === "live") {
			setPreset("live");
			if (liveTape) setKnobs(knobsFromSnap(liveTape));
			setGrok(null);
			setGrokErr(null);
			return;
		}
		const p = LAB_PRESETS.find((x) => x.id === id);
		if (!p) return;
		setPreset(id);
		const livePx = liveTape?.btc.price ?? 0;
		setKnobs({
			...p.knobs,
			price: livePx || p.knobs.price
		});
		setGrok(null);
		setGrokErr(null);
	}
	(0, import_react.useEffect)(() => {
		if (!liveTape) return;
		if (preset === "live") setKnobs(knobsFromSnap(liveTape));
		setLiveNote(`Live Coinbase ${money(liveTape.btc.price ?? 0, 0)} · 5 min poll · ${liveTape.errors.length ? `degraded ${liveTape.errors.join(", ")}` : "all sources live"}`);
	}, [liveTape, preset]);
	async function loadLive() {
		setLiveNote(null);
		try {
			await loadTape();
			const live = peekDeskTape();
			if (live) {
				setKnobs(knobsFromSnap(live));
				setPreset("live");
				setGrok(null);
				setLiveNote(`Loaded Coinbase ${money(live.btc.price ?? 0, 0)}. M2 ${live.macro.m2.last != null ? `$${(live.macro.m2.last / 1e3).toFixed(2)}T` : "n/a"} (${live.macro.m2.asOf ?? "FRED"}).`);
			}
		} catch (e) {
			setLiveNote(e instanceof Error ? e.message : "Live tape failed");
		}
	}
	async function onAskGrok() {
		if (!unlocked || !engine || !labCall) return;
		setAsking(true);
		setGrokErr(null);
		try {
			const res = await askHelios({ data: {
				token: useOperator.getState().token,
				snapshot: engine,
				briefs: labBriefs,
				call: labCall
			} });
			if (!res.ok) setGrokErr(res.error);
			else {
				setGrok(res.text);
				log("grok", "Ask Grok");
			}
		} catch (e) {
			setGrokErr(e instanceof Error ? e.message : "Grok request failed");
		} finally {
			setAsking(false);
		}
	}
	function executeClip(c) {
		if (!unlocked || role !== "admin") return;
		const px = liveTape?.btc.price;
		if (!px || !c || c.clipUsd <= 0) return;
		if (c.stance === "TRIM") {
			const qty = Math.min(btc, c.clipUsd / px);
			if (qty <= 0) return;
			fill({
				at: (/* @__PURE__ */ new Date()).toISOString(),
				side: "SELL",
				usd: qty * px,
				btc: qty,
				price: px,
				note: `${APP_CALLS} lab ${c.stance} ${c.conviction}`,
				kind: "trim"
			});
			log("fill", `Paper SELL ${c.clipUsd}`);
			return;
		}
		const usd = Math.min(cash, c.clipUsd);
		if (usd <= 0) return;
		fill({
			at: (/* @__PURE__ */ new Date()).toISOString(),
			side: "BUY",
			usd,
			btc: usd / px,
			price: px,
			note: `${APP_CALLS} lab ${c.stance} ${c.conviction}`,
			kind: "clip",
			stopPrice: initialStop(px, STOP_DEFAULT),
			peakPrice: px
		});
		log("fill", `Paper BUY ${c.clipUsd}`);
	}
	async function copyCli(text) {
		if (looksLikeSecret(text) || text.includes("orders create")) {
			log("reject", "Blocked unsafe CLI copy");
			return;
		}
		await navigator.clipboard.writeText(text);
		log("copy", "Preview CLI copied");
		setCopied(true);
		window.setTimeout(() => setCopied(false), 1400);
	}
	const flipped = (liveCall?.checks ?? []).filter((c) => {
		const lab = labCall?.checks.find((x) => x.label === c.label);
		return lab != null && lab.pass !== c.pass;
	});
	const activeLab = LAB_PRESETS.find((p) => p.id === preset);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, {
		right: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
			variant: "primary",
			onClick: () => void loadLive(),
			disabled: loadingLive,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Radio, { className: "size-4" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "hidden sm:inline",
					children: "refresh data"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "sm:hidden",
					children: "refresh"
				})
			]
		}),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeoCopy, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TapeFreezeBanner, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium tracking-[0.08em] text-accum uppercase",
						children: TAB_LAB
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-1 max-w-2xl text-2xl font-bold tracking-tight text-medium sm:text-3xl",
						children: APP_NAME
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-4 flex flex-wrap gap-2",
					children: [LAB_PRESETS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: preset === p.id ? "primary" : "outline",
						"aria-pressed": preset === p.id,
						onClick: () => applyPreset(p.id),
						children: p.name
					}, p.id)), preset === "custom" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "primary",
						"aria-pressed": true,
						children: "Custom"
					}) : null]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-4 text-sm text-muted",
					children: preset === "custom" ? "Custom overlay — move a slider, Bot 7 re-runs on the live tape." : activeLab?.blurb
				}),
				liveNote ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-4 font-mono text-xs text-muted",
					children: liveNote
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CompareCalls, {
					live: liveCall,
					lab: whatIf ? labCall : liveCall,
					whatIf
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StructureBoard, {
					live: liveTape,
					lab: engine,
					whatIf
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 space-y-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
						kicker: "Variables",
						title: "Drive the accumulation call",
						kickerClass: "text-high",
						titleClass: "text-medium",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-6 sm:grid-cols-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mb-2 font-mono text-[11px] tracking-[0.14em] text-muted uppercase",
									children: "Tape"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Knob, {
									label: "BTC-USD",
									value: money(knobs.price, 0),
									min: 4e4,
									max: 15e4,
									step: 100,
									raw: knobs.price,
									onChange: (n) => patch({ price: n })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Knob, {
									label: "RSI(14) hourly",
									value: knobs.rsi.toFixed(0),
									min: 10,
									max: 90,
									step: 1,
									raw: knobs.rsi,
									onChange: (n) => patch({ rsi: n })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Knob, {
									label: "Fear & Greed",
									value: `${Math.round(knobs.fg)}`,
									min: 5,
									max: 95,
									step: 1,
									raw: knobs.fg,
									onChange: (n) => patch({ fg: n }),
									tone: fgTone(knobs.fg)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Knob, {
									label: "OKX long/short",
									value: knobs.longShort.toFixed(2),
									min: .5,
									max: 2.4,
									step: .02,
									raw: knobs.longShort,
									onChange: (n) => patch({ longShort: n })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Knob, {
									label: "Funding %",
									value: `${knobs.fundingPct.toFixed(3)}%`,
									min: -.03,
									max: .12,
									step: .005,
									raw: knobs.fundingPct,
									onChange: (n) => patch({ fundingPct: n })
								})
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mb-2 font-mono text-[11px] tracking-[0.14em] text-muted uppercase",
									children: "Flow"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Knob, {
									label: "Kimchi %",
									value: `${knobs.kimchi >= 0 ? "+" : ""}${knobs.kimchi.toFixed(1)}%`,
									min: -5,
									max: 8,
									step: .1,
									raw: knobs.kimchi,
									onChange: (n) => patch({ kimchi: n })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Knob, {
									label: "CNY OTC %",
									value: `${knobs.cnyOtc >= 0 ? "+" : ""}${knobs.cnyOtc.toFixed(1)}%`,
									min: -4,
									max: 6,
									step: .1,
									raw: knobs.cnyOtc,
									onChange: (n) => patch({ cnyOtc: n })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Knob, {
									label: "EM inflow regions",
									value: String(Math.round(knobs.emHot)),
									min: 0,
									max: 5,
									step: 1,
									raw: knobs.emHot,
									onChange: (n) => patch({ emHot: n })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Knob, {
									label: "EM outflow regions",
									value: String(Math.round(knobs.emOut)),
									min: 0,
									max: 5,
									step: 1,
									raw: knobs.emOut,
									onChange: (n) => patch({ emOut: n })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Knob, {
									label: "US spot ETF $M",
									value: `${knobs.etfFlowM >= 0 ? "+" : ""}${knobs.etfFlowM.toFixed(0)}`,
									min: -400,
									max: 800,
									step: 10,
									raw: knobs.etfFlowM,
									onChange: (n) => patch({ etfFlowM: n })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Knob, {
									label: "BTC / gold oz",
									value: knobs.goldOz.toFixed(1),
									min: 10,
									max: 28,
									step: .1,
									raw: knobs.goldOz,
									onChange: (n) => patch({ goldOz: n })
								})
							] })]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4 lg:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeliosCard, {
							kicker: whatIf ? "Bot 7 · this lab" : "Bot 7 · live tape",
							title: `${APP_CALLS}`,
							call: labCall,
							grok,
							grokErr,
							asking,
							copied,
							canFill: isAdmin && Boolean(labCall && labCall.clipUsd > 0 && liveTape?.btc.price),
							canAct: isAdmin,
							onAsk: () => void onAskGrok(),
							onCopy: () => {
								if (labCall) copyCli(labCall.cli);
							},
							onFill: () => {
								if (labCall) executeClip(labCall);
							},
							tape: engine ? {
								price: engine.btc.price,
								rsi: engine.rsi14,
								rsiAvg: engine.rsiAvg,
								fg: engine.fearGreed?.value ?? null,
								fgLabel: engine.fearGreed?.label,
								fetchedAt: engine.fetchedAt
							} : null
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4",
							children: [whatIf && flipped.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
								kicker: "Delta",
								title: "Checks that flipped",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
									className: "space-y-1.5 font-mono text-xs",
									children: flipped.map((c) => {
										const lab = labCall?.checks.find((x) => x.label === c.label);
										return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: c.pass ? "text-up" : "text-down",
												children: c.pass ? "LIVE PASS" : "LIVE FAIL"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-muted",
												children: " → "
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: lab?.pass ? "text-up" : "text-down",
												children: lab?.pass ? "LAB PASS" : "LAB FAIL"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "ml-2 text-muted",
												children: c.label
											})
										] }, c.label);
									})
								})
							}) : null, isAdmin ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PaperCard, {
								mounted: true,
								cash,
								btc,
								profitBtc: profitBtc ?? 0,
								px: liveTape?.btc.price ?? 0,
								fills,
								onReset: unlocked ? reset : void 0
							}) : null]
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BotDelta, {
					live: liveBriefs,
					lab: labBriefs,
					whatIf
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LiveTracks, {
					briefs: labBriefs,
					kicker: whatIf ? "THIS LAB · B0TS 1–6" : "B0TS 1–6",
					title: whatIf ? "Lab analysts under this overlay" : "Live Hedge Fund analysts",
					note: whatIf ? "How bots 1–6 vote if this lab’s structure holds. Compare the Live column above to see what flipped." : "Visual summary of bots 1–6 on the live pull. Pick a lab or move a slider to predict a different structure."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-4 text-xs text-muted",
					children: [
						"Paper NAV ",
						money(liveNav || 1e3, 0),
						". Clip is 1% NAV on ACCUMULATE, 2% on BUY, 1% on TRIM. Desk is the live view of bots 1–6 and Bot 7. L@B is for strategy experiments only — knobs never write a feed."
					]
				})
			]
		})
	});
}
function CompareCalls({ live, lab, whatIf }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-3 sm:grid-cols-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CallChip, {
			label: "Live tape",
			call: live
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CallChip, {
			label: whatIf ? "This lab" : "Lab = live",
			call: lab
		})]
	});
}
function heatClass(heat) {
	if (heat === "bid") return "text-high";
	if (heat === "chase") return "text-sell";
	return "text-muted";
}
function StructureBoard({ live, lab, whatIf }) {
	const liveRead = live ? readStructure(live) : null;
	const labRead = lab ? readStructure(lab) : null;
	const rows = labRead?.rows ?? [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
		className: "mt-4",
		kicker: "Market structure",
		title: whatIf ? "Live tape vs this lab" : "Live structure Bot 7 is reading",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-3 text-xs text-muted",
				children: "Sliders rewrite these prints on a copy of the last pull. Bid = accumulate-friendly. Chase = crowded / do not chase. Desk stays on the live column."
			}),
			labRead?.tags.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mb-3 flex flex-wrap gap-2",
				children: labRead.tags.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: cn("rounded-sm border border-rule px-2 py-1 font-mono text-[11px] uppercase tracking-[0.08em]", heatClass(t.heat)),
					children: [whatIf ? "Lab · " : "", t.label]
				}, t.id))
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-x-auto",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full text-left text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "font-mono text-[11px] tracking-[0.08em] text-muted uppercase",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "pb-2 pr-3 font-medium",
								children: "Variable"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "pb-2 pr-3 font-medium",
								children: "Live"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "pb-2 font-medium",
								children: whatIf ? "This lab" : "Lab = live"
							})
						]
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: rows.map((row) => {
						const lv = liveRead?.rows.find((r) => r.id === row.id);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-t border-rule/70",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-2 pr-3",
									children: row.label
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: cn("py-2 pr-3 font-mono text-xs tabular-nums", heatClass(lv?.heat ?? "neutral")),
									children: lv?.value ?? "—"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: cn("py-2 font-mono text-xs tabular-nums", heatClass(row.heat)),
									children: row.value
								})
							]
						}, row.id);
					}) })]
				})
			})
		]
	});
}
function CallChip({ label, call }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-lg border border-rule bg-surface p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: cn("font-mono text-[11px] tracking-[0.14em] uppercase", bannerTone(call)),
				children: label
			}),
			call ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CallWords, {
				call,
				className: "mt-1 text-xl font-semibold"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-xl font-semibold text-muted",
				children: "—"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-1 font-mono text-xs text-muted",
				children: ["clip ", call ? money(call.clipUsd, 0) : "—"]
			})
		]
	});
}
function BotDelta({ live, lab, whatIf }) {
	const rows = lab.map((b, i) => ({
		lab: b,
		live: live.find((x) => x.id === b.id) ?? live[i]
	}));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
		className: "mt-4",
		kicker: "B0TS 1–6",
		title: "Live vs this lab",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "overflow-x-auto",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full text-left text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "font-mono text-[11px] tracking-[0.08em] text-muted uppercase",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "pb-2 pr-3 font-medium",
							children: "Analyst"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "pb-2 pr-3 font-medium",
							children: "Live"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "pb-2 font-medium",
							children: whatIf ? "Lab" : "Lab = live"
						})
					]
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: rows.map(({ live: lv, lab: lb }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-t border-rule/70",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "py-2 pr-3",
							children: lb.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: cn("py-2 pr-3 font-mono text-[11px] uppercase", stanceClass(lv?.stance ?? "HOLD")),
							children: lv?.stance ?? "—"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: cn("py-2 font-mono text-[11px] uppercase", stanceClass(lb.stance)),
							children: lb.stance
						})
					]
				}, lb.id)) })]
			})
		})
	});
}
function Knob({ label, value, min, max, step, raw, onChange, tone }) {
	const id = `knob-${label.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}`;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-3 first:mt-0",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-baseline justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
				htmlFor: id,
				className: cn("text-sm", tone),
				children: label
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: cn("font-mono text-xs tabular-nums", tone || "text-muted"),
				children: value
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			id,
			type: "range",
			min,
			max,
			step,
			value: raw,
			onChange: (e) => onChange(Number(e.target.value)),
			className: "mt-1 h-11 w-full cursor-pointer accent-pine"
		})]
	});
}
var SplitComponent = HeliosLab;
//#endregion
export { SplitComponent as component };
