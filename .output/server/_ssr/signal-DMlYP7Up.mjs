import { c as predAnalyst, t as BOT_ROSTER } from "./prediction-markets-BXpIiy7X.mjs";
import { a as MINER_TICKERS, d as clipForNav, i as MAG7_TICKERS } from "./proxy-book-CtmrAojx.mjs";
//#region ../../workspace/node_modules/.nitro/vite/services/ssr/assets/signal-DMlYP7Up.js
function roster(id) {
	const row = BOT_ROSTER.find((b) => b.id === id);
	return {
		name: row?.name ?? id,
		layer: row?.layer ?? "",
		sources: row?.feed ? [row.feed] : []
	};
}
function q(quotes, symbol) {
	return quotes.find((x) => x.symbol === symbol);
}
function fmtPct(n) {
	if (n == null || Number.isNaN(n)) return "n/a";
	return `${n > 0 ? "+" : ""}${n.toFixed(2)}%`;
}
function usdM(n) {
	if (n == null || !Number.isFinite(n)) return "n/a";
	return `${n >= 0 ? "+" : "-"}$${(Math.abs(n) / 1e6).toFixed(0)}M`;
}
function goldBtcVsMedian(snap) {
	const oz = snap.goldBtc.ozPerBtc;
	const series = snap.goldBtc.series.map((p) => p.ozPerBtc).filter((n) => Number.isFinite(n) && n > 0);
	if (oz == null || !Number.isFinite(oz) || series.length < 8) return {
		oz,
		vsMed: null,
		med: null
	};
	const sorted = [...series].sort((a, b) => a - b);
	const med = sorted[Math.floor(sorted.length / 2)];
	return {
		oz,
		vsMed: (oz - med) / med,
		med
	};
}
var BTC_BUY_RE = /bitcoin|btc|purchas|acquir|treasury|addition/i;
var DILUTE_RE = /atm|at-the-market|offering|convertible|dilut|note offering|senior notes/i;
var ROTATION_RE = /rotat(?:e|ion)|into bitcoin|into btc|debasement|digital gold|gold.{0,28}bitcoin|bitcoin.{0,28}gold|nasdaq.{0,40}bitcoin|ai bubble|401\s*\(?k\)?|endowment|strategic bitcoin reserve|bitcoin reserve|insurance.{0,20}bitcoin|etf inflow|whale.{0,20}(buy|accumul)/i;
function runBots(snap) {
	const live = (id, summary, bullets, stance) => ({
		id,
		...roster(id),
		status: "live",
		summary,
		bullets,
		stance
	});
	const ibit = q(snap.quotes, "IBIT");
	const spy = q(snap.quotes, "SPY");
	const dxy = q(snap.quotes, "DX-Y");
	const gld = q(snap.quotes, "GLD");
	const vnq = q(snap.quotes, "VNQ");
	const slv = q(snap.quotes, "SLV");
	const sil = q(snap.quotes, "SIL");
	const gdx = q(snap.quotes, "GDX");
	const nvda = q(snap.quotes, "NVDA");
	const qqq = q(snap.quotes, "QQQ");
	const mag7 = MAG7_TICKERS.map((s) => q(snap.quotes, s)).filter(Boolean);
	const mag7Avg = mag7.length > 0 ? mag7.reduce((s, x) => s + (x.changePct ?? 0), 0) / mag7.length : null;
	const material = snap.filings.filter((f) => /8-K|10-Q|10-K/i.test(f.form)).slice(0, 6);
	const buys = material.filter((f) => BTC_BUY_RE.test(`${f.title} ${f.name}`) && !DILUTE_RE.test(f.title));
	const dilutes = material.filter((f) => DILUTE_RE.test(f.title));
	const filings = live("filings", buys.length ? `${buys.length} BTC-treasury event(s) in the DAT book — demand, not equity beta.` : dilutes.length ? `${dilutes.length} ATM/offering print(s) — paper supply, not a BTC bid.` : material.length ? `${material.length} material filing(s), none read as a BTC purchase.` : "No 8-K / 10-Q / 10-K in MSTR · COIN · MARA · SMLR.", [
		...buys.map((f) => `BUY-EVENT ${f.name} ${f.form} · ${f.filed} · ${f.title}`),
		...dilutes.map((f) => `DILUTE ${f.name} ${f.form} · ${f.filed} · ${f.title}`),
		...material.filter((f) => !buys.includes(f) && !dilutes.includes(f)).map((f) => `${f.name} ${f.form} · ${f.filed} · ${f.title}`)
	].slice(0, 4), buys.length >= 1 ? "ACCUMULATE" : dilutes.length >= 1 ? "WAIT" : "HOLD");
	const etfFlow = snap.capital.etfFlow;
	const datBtc = snap.capital.dats.reduce((s, d) => s + (d.btc ?? 0), 0);
	const flowOut = etfFlow != null && etfFlow < -5e7;
	const flowFomo = etfFlow != null && etfFlow > 4e8;
	const earnings = live("earnings", etfFlow != null ? `BTC demand: US spot ETF ${usdM(etfFlow)} last session. DAT book ${datBtc.toLocaleString("en-US", { maximumFractionDigits: 0 })} BTC. IBIT ${fmtPct(ibit?.changePct)} vs Coinbase ${fmtPct(snap.btc.changePct)}.` : `ETF flow missing this cycle. DAT book ${datBtc.toLocaleString("en-US", { maximumFractionDigits: 0 })} BTC. IBIT ${fmtPct(ibit?.changePct)}.`, [
		`ETF net ${usdM(etfFlow)} — this is the vote (outflow = accumulate, melt-up = wait).`,
		`DAT treasuries ${snap.capital.dats.length} names / ${datBtc.toLocaleString("en-US", { maximumFractionDigits: 0 })} BTC.`,
		ibit ? `IBIT ${fmtPct(ibit.changePct)} last ${ibit.last ?? "—"}` : "IBIT unavailable",
		`Label only, not a vote: ${[
			"MSTR",
			...MINER_TICKERS,
			"NVDA"
		].map((s) => `${s} ${fmtPct(q(snap.quotes, s)?.changePct)}`).join(" · ")}`
	], flowOut ? "ACCUMULATE" : flowFomo ? "WAIT" : "HOLD");
	const btcLagGold = (ibit?.changePct ?? 0) - (gld?.changePct ?? 0) < -1.2;
	const riskOff = (spy?.changePct ?? 0) < -1 && (dxy?.changePct ?? 0) > .3;
	const gb = goldBtcVsMedian(snap);
	const ratioCheap = gb.vsMed != null && gb.vsMed <= -.08;
	const ratioRich = gb.vsMed != null && gb.vsMed >= .12;
	const chaseMetals = (gld?.changePct ?? 0) > .4 && (slv?.changePct ?? 0) > .5 && (ibit?.changePct ?? 0) > 2;
	const sector = live("sector", `RV: IBIT ${fmtPct(ibit?.changePct)} vs GLD ${fmtPct(gld?.changePct)}. BTC ${gb.oz != null ? `${gb.oz.toFixed(1)} oz` : "n/a"} gold (${gb.vsMed != null ? fmtPct(gb.vsMed * 100) : "n/a"} vs 1y median). DXY ${fmtPct(dxy?.changePct)} SPY ${fmtPct(spy?.changePct)}.`, [
		ibit && gld ? `Session vote: IBIT minus GLD = ${fmtPct((ibit.changePct ?? 0) - (gld.changePct ?? 0))}` : "IBIT/GLD incomplete",
		gb.vsMed != null ? `Valuation vote: BTC/gold ${ratioCheap ? "cheap (accumulate)" : ratioRich ? "rich (wait)" : "near median"} · ${gb.oz?.toFixed(1)} oz vs med ${gb.med?.toFixed(1)}` : "BTC/gold 1y median incomplete",
		riskOff ? "Risk-off: dollar bid + equity dip (vote if BTC also offered)." : "No dollar/equity risk-off pair.",
		`Label only — CB gold stock, silver AUM, Mag7 ${fmtPct(mag7Avg)} · NVDA ${fmtPct(nvda?.changePct)} · SLV ${fmtPct(slv?.changePct)} · GDX ${fmtPct(gdx?.changePct)} · SIL ${fmtPct(sil?.changePct)}. Stock pies do not vote.`
	], chaseMetals ? "WAIT" : ratioCheap || btcLagGold || riskOff && (ibit?.changePct ?? snap.btc.changePct ?? 0) < 0 ? "ACCUMULATE" : ratioRich ? "WAIT" : "HOLD");
	const fg = snap.fearGreed;
	const greed = (fg?.value ?? 50) >= 70;
	const fear = (fg?.value ?? 50) <= 30;
	const sentiment = live("sentiment", fg ? `Fear & Greed ${fg.value} (${fg.label}). Headlines are context, not a vote.` : `${snap.headlines.length} headlines. Fear & Greed missing — no mood vote.`, [...fg ? [`Alternative.me ${fg.value} — ${fg.label} (vote: ≤30 accumulate, ≥70 wait)`] : ["F&G missing"], ...snap.headlines.slice(0, 3).map((h) => `Label: ${h.source}: ${h.title}`)], fear ? "ACCUMULATE" : greed ? "WAIT" : "HOLD");
	const forms4 = snap.filings.filter((f) => /^[345]$/.test(f.form));
	const ibitCh = ibit?.changePct ?? snap.btc.changePct ?? 0;
	const qqqCh = qqq?.changePct;
	const nvdaCh = nvda?.changePct;
	const gldCh = gld?.changePct;
	const vnqCh = vnq?.changePct;
	const btcBid = ibitCh > .25;
	const fromNasdaq = btcBid && qqqCh != null && ibitCh - qqqCh >= 1.4;
	const fromAi = btcBid && nvdaCh != null && ibitCh - nvdaCh >= 1.8;
	const fromGoldPaper = btcBid && gldCh != null && ibitCh - gldCh >= 1.4 && gldCh < .25;
	const fromCre = btcBid && vnqCh != null && ibitCh - vnqCh >= 1.4 && vnqCh < .3;
	const intoNasdaq = qqqCh != null && qqqCh > 1 && ibitCh - qqqCh <= -1.6 && ibitCh < .2;
	const rotHits = [
		fromNasdaq,
		fromAi,
		fromGoldPaper,
		fromCre
	].filter(Boolean).length;
	const whaleBuy = snap.whales.filter((w) => w.side === "buy").reduce((s, w) => s + w.usd, 0);
	const whaleSell = snap.whales.filter((w) => w.side === "sell").reduce((s, w) => s + w.usd, 0);
	const whaleNet = whaleBuy - whaleSell;
	const whaleConfirm = whaleNet > 25e4;
	const whaleFade = whaleNet < -25e4;
	const rotNews = snap.headlines.filter((h) => ROTATION_RE.test(h.title));
	const newsConfirm = rotNews.length >= 1;
	const rotationIn = rotHits >= 2 || rotHits >= 1 && (whaleConfirm || newsConfirm);
	const rotationOut = intoNasdaq && (whaleFade || rotHits === 0);
	const rotation = live("rotation", rotationIn ? `Capital rotating into BTC: ${[
		fromNasdaq ? "Nasdaq→BTC" : null,
		fromAi ? "AI→BTC" : null,
		fromGoldPaper ? "paper gold→BTC" : null,
		fromCre ? "CRE→BTC" : null
	].filter(Boolean).join(" · ")}. Whale net ${usdM(whaleNet)}.` : rotationOut ? `Capital leaving BTC into Nasdaq (QQQ ${fmtPct(qqqCh)} vs IBIT ${fmtPct(ibitCh)}). Do not chase AI.` : `No confirmed rotation. IBIT ${fmtPct(ibitCh)} QQQ ${fmtPct(qqqCh)} NVDA ${fmtPct(nvdaCh)} GLD ${fmtPct(gldCh)}. Whale net ${usdM(whaleNet)}. BTC.D ${snap.onchain.btcDom != null ? `${snap.onchain.btcDom.toFixed(1)}%` : "n/a"}.`, [
		`Nasdaq: IBIT minus QQQ = ${qqqCh != null ? fmtPct(ibitCh - qqqCh) : "n/a"}${fromNasdaq ? " · IN" : ""}`,
		`AI: IBIT minus NVDA = ${nvdaCh != null ? fmtPct(ibitCh - nvdaCh) : "n/a"}${fromAi ? " · IN" : ""}`,
		`Paper gold: IBIT minus GLD = ${gldCh != null ? fmtPct(ibitCh - gldCh) : "n/a"}${fromGoldPaper ? " · IN" : ""}`,
		`CRE: IBIT minus VNQ = ${vnqCh != null ? fmtPct(ibitCh - vnqCh) : "n/a"}${fromCre ? " · IN" : ""}`,
		`Whale overlay ${usdM(whaleNet)} (buy ${usdM(whaleBuy)} / sell ${usdM(whaleSell)})${whaleConfirm ? " · confirms" : whaleFade ? " · fades" : ""}`,
		`BTC.D ${snap.onchain.btcDom != null ? `${snap.onchain.btcDom.toFixed(1)}%` : "n/a"} (Alternative.me global)`,
		rotNews[0] ? `Copy: ${rotNews[0].source}: ${rotNews[0].title}` : "No rotation copy in free RSS this cycle.",
		forms4.length ? `Label — ${forms4.length} Form 3/4/5 (does not vote).` : "Form 4 label quiet."
	], rotationIn ? "ACCUMULATE" : rotationOut ? "WAIT" : "HOLD");
	const lanes = [
		{
			id: "filings",
			lane: "event",
			brief: filings
		},
		{
			id: "earnings",
			lane: "flow",
			brief: earnings
		},
		{
			id: "sector",
			lane: "rv",
			brief: sector
		},
		{
			id: "sentiment",
			lane: "mood",
			brief: sentiment
		},
		{
			id: "rotation",
			lane: "rotation",
			brief: rotation
		}
	];
	const buyLanes = [...new Set(lanes.filter((x) => x.brief.stance === "ACCUMULATE" || x.brief.stance === "BUY").map((x) => x.lane))];
	const waitLanes = [...new Set(lanes.filter((x) => x.brief.stance === "WAIT").map((x) => x.lane))];
	const twoSource = buyLanes.length >= 2;
	return [
		filings,
		earnings,
		sector,
		sentiment,
		rotation,
		live("coordinator", twoSource ? `Orthogonal confirm: ${buyLanes.join(" + ")} (${buyLanes.length} lanes).` : `No two-lane confirm. Buy lanes: ${buyLanes.join(", ") || "none"}. Wait lanes: ${waitLanes.join(", ") || "none"}.`, [
			`Event (filings): ${filings.stance}`,
			`Flow (ETF/DAT): ${earnings.stance}`,
			`Relative value (BTC vs gold): ${sector.stance}`,
			`Mood (F&G): ${sentiment.stance}`,
			`Rotation (Nasdaq/AI/gold paper + whales + copy): ${rotation.stance}`,
			twoSource ? "Maker-checker HIT — independent lanes." : "Maker-checker MISS — need two of event/flow/RV/mood/rotation."
		], twoSource ? "ACCUMULATE" : waitLanes.length >= 2 ? "WAIT" : "HOLD")
	];
}
function heliosCall(snap, briefs, navUsd) {
	const rsi = snap.rsi14;
	const fg = snap.fearGreed?.value ?? 50;
	const ls = snap.positioning.longShort;
	const funding = snap.positioning.fundingRate;
	const sellWall = snap.positioning.sellWallUsd;
	const buyWall = snap.positioning.buyWallUsd;
	const wallBias = snap.positioning.wallBias;
	const longsPaying = funding != null && funding > 1e-4;
	const shortsPaying = funding != null && funding < -1e-4;
	const asia = snap.asia;
	const kimchi = asia.kimchiPct;
	const cnyPrem = asia.cnyOtc.premiumPct;
	const em = snap.em;
	const emHot = em.regions.filter((r) => r.flow === "INFLOW" && (r.premiumPct ?? 0) > 2.5).length;
	const emBid = em.net.inflow >= 3;
	const emOffer = em.net.outflow >= 2;
	const coord = briefs.find((b) => b.id === "coordinator");
	const rot = briefs.find((b) => b.id === "rotation");
	const twoSource = coord?.stance === "ACCUMULATE" || coord?.stance === "BUY";
	const etfFlow = snap.capital.etfFlow;
	const ibit = q(snap.quotes, "IBIT");
	const gld = q(snap.quotes, "GLD");
	const cheapVsGold = ibit != null && gld != null && (ibit.changePct ?? 0) - (gld.changePct ?? 0) < -1.2;
	const gb = goldBtcVsMedian(snap);
	const ratioCheap = gb.vsMed != null && gb.vsMed <= -.08;
	const ratioRich = gb.vsMed != null && gb.vsMed >= .12;
	const etfMelt = etfFlow != null && etfFlow > 35e7 && (rsi == null || rsi >= 50);
	const macd50 = snap.macd50;
	const macd200 = snap.macd200;
	const macdDiscount = macd50?.hist != null && macd50.hist < 0 || macd200?.hist != null && macd200.hist < 0;
	const pred = predAnalyst(snap.predictionMarkets, snap.btc.price);
	const checks = [
		{
			label: "Two orthogonal lanes (coordinator)",
			pass: Boolean(twoSource)
		},
		{
			label: "RSI(14) hourly < 45",
			pass: rsi != null && rsi < 45
		},
		{
			label: "Fear & Greed ≤ 55",
			pass: fg <= 55
		},
		{
			label: "Long/short not crowded (>1.6, OI-weighted)",
			pass: ls == null || ls < 1.6
		},
		{
			label: "Funding not overheated (>0.05%, longs paying)",
			pass: funding == null || funding < 5e-4
		},
		{
			label: sellWall != null && buyWall != null && buyWall > 0 ? `Sell wall not 2× buy wall near last (now ${(sellWall / buyWall).toFixed(1)}×)` : "Sell wall not 2× buy wall near last",
			pass: sellWall == null || buyWall == null || sellWall < buyWall * 2
		},
		{
			label: "Kimchi premium not crowded (>3%)",
			pass: kimchi == null || kimchi < 3
		},
		{
			label: "CNY OTC USDT not overheating (>2%)",
			pass: cnyPrem == null || cnyPrem < 2
		},
		{
			label: "EM tape not crowded (3+ regions hot)",
			pass: emHot < 3
		},
		{
			label: "ETF session not a melt-up",
			pass: !etfMelt
		},
		{
			label: "BTC not rich vs gold (oz/BTC ≤ +12% vs 1y median)",
			pass: !ratioRich
		},
		{
			label: "Not rotating out of BTC into Nasdaq/AI",
			pass: rot?.stance !== "WAIT"
		},
		{
			label: "Mempool not a fee spike (fastest < 50 sat/vB)",
			pass: snap.onchain.feeFast == null || snap.onchain.feeFast < 50
		},
		{
			label: pred.checkLabel,
			pass: pred.overlayPass
		}
	];
	const passed = checks.filter((c) => c.pass).length;
	const asiaFomo = kimchi != null && kimchi >= 4 || cnyPrem != null && cnyPrem >= 3 || emHot >= 3;
	const asiaDiscount = kimchi != null && kimchi <= -1.5 || emOffer;
	let stance = "HOLD";
	if (rsi != null && rsi < 30 && fg <= 40 && !asiaFomo && !etfMelt && !pred.fomo) stance = "BUY";
	else if (passed >= 3 && (twoSource || fg <= 35 || rsi != null && rsi < 40 || asiaDiscount || cheapVsGold || ratioCheap || macdDiscount || pred.discount)) stance = "ACCUMULATE";
	else if (rsi != null && rsi > 72 && fg >= 75) stance = "HOLD";
	else if (passed <= 1 && fg >= 70 || asiaFomo && fg >= 60 || etfMelt || ratioRich && fg >= 60 || pred.fomo && fg >= 55) stance = "WAIT";
	const conviction = (stance === "BUY" || stance === "ACCUMULATE") && twoSource && passed >= 4 ? "HIGH" : passed >= 3 ? "MEDIUM" : "LOW";
	const clipUsd = clipForNav(navUsd, stance);
	const px = snap.btc.price ?? 0;
	const thesis = [
		`Overseer: all six lanes plus tape, leverage, Asia, EM, ETF, BTC/gold ratio, rotation (Nasdaq/AI/paper gold) + whale overlay + Polymarket/Kalshi pred sub-analyst (label, not a 1–6 vote). Gold/silver stock pies, Mag7 as beta, CB tonnes do not vote.`,
		`BTC ${px ? px.toLocaleString("en-US", { maximumFractionDigits: 0 }) : "n/a"} on Coinbase.`,
		rsi != null ? `Hourly RSI(14) ${rsi.toFixed(1)}.` : "RSI unavailable.",
		macd50 || macd200 ? `MACD-50 hist ${macd50 ? macd50.hist.toFixed(1) : "n/a"} · MACD-200 hist ${macd200 ? macd200.hist.toFixed(1) : "n/a"}${macdDiscount ? " — histogram discount, accumulate." : "."}` : "",
		snap.fearGreed ? `Fear & Greed ${snap.fearGreed.value} (${snap.fearGreed.label}).` : "",
		ls != null ? `OI-weighted long/short ${ls.toFixed(2)} across public perps.` : "",
		funding != null ? `Funding ${(funding * 100).toFixed(4)}% — ${longsPaying ? "longs paying (crowded longs losing carry)" : shortsPaying ? "shorts paying (shorts losing carry)" : "flat carry"}.` : "",
		sellWall != null || buyWall != null ? `Walls sell ${sellWall != null ? usdM(sellWall) : "n/a"} vs buy ${buyWall != null ? usdM(buyWall) : "n/a"} (${wallBias}).` : "",
		...(snap.positioning.venues ?? []).map((v) => `${v.name} LS ${v.longShort != null ? v.longShort.toFixed(2) : "n/a"} fund ${v.fundingRate != null ? `${(v.fundingRate * 100).toFixed(3)}%` : "n/a"} OI ${v.openInterestUsd != null ? usdM(v.openInterestUsd) : "n/a"}.`),
		etfFlow != null ? `US spot ETF ${usdM(etfFlow)}.` : "",
		cheapVsGold ? "IBIT lagging gold this session — BTC cheap vs metal." : "",
		gb.vsMed != null ? `BTC/gold ${gb.oz?.toFixed(1)} oz (1y median ${gb.med?.toFixed(1)}, ${fmtPct(gb.vsMed * 100)})${ratioCheap ? " — cheap, accumulate." : ratioRich ? " — rich vs gold, do not chase." : "."}` : "",
		`Session ${asia.session}.`,
		kimchi != null ? `Upbit kimchi ${kimchi >= 0 ? "+" : ""}${kimchi.toFixed(2)}% vs Coinbase.` : "Kimchi unavailable.",
		asia.hkPremiumPct != null ? `HashKey HK ${asia.hkPremiumPct >= 0 ? "+" : ""}${asia.hkPremiumPct.toFixed(2)}%.` : "",
		asia.cnyOtc.usdtCny != null ? `CNY OTC USDT ${asia.cnyOtc.usdtCny.toFixed(3)} vs FX ${asia.cnyOtc.officialCny?.toFixed(3) ?? "n/a"} (${asia.cnyOtc.premiumPct != null ? `${asia.cnyOtc.premiumPct >= 0 ? "+" : ""}${asia.cnyOtc.premiumPct.toFixed(2)}%` : "n/a"}).` : "CNY OTC unavailable.",
		`Binance is not used (geo-blocked). Asia tape is Upbit/Bithumb, HashKey, OKX, HTX.`,
		`EM flow ${em.net.inflow} inflow / ${em.net.outflow} outflow / ${em.net.flat} flat${emBid ? " — broad EM bid." : ""}.`,
		...em.regions.map((r) => `${r.name} ${r.flow}${r.premiumPct != null ? ` ${r.premiumPct >= 0 ? "+" : ""}${r.premiumPct.toFixed(1)}%` : ""}.`),
		rot ? `Rotation ${rot.stance}: ${rot.summary}` : "",
		pred.summary,
		`Polymarket: ${pred.polymarket.headline}`,
		`Kalshi: ${pred.kalshi.headline}`,
		`NVDA / Mag7 / silver AUM / CB gold pies / hashrate-by-region are labels unless Rotation says Nasdaq/AI/paper-gold is moving vs IBIT. Sector votes gold valuation; Rotation votes capital leaving those sleeves into BTC.`,
		`Primary mandate: accumulate bitcoin. Never sell bitcoin. Never short bitcoin.`,
		`Stops do not dump BTC — they block add-on buys into a loser. BTC stays BTC.`
	].filter(Boolean).join(" ");
	const brief = `${conviction} ${stance}. Clip $${Math.round(clipUsd)}. Pred overlay ${pred.stance} — ${pred.checkLabel}. Stack bitcoin — never sell, never short. Preview only. Dry-run on your Coinbase. This host never trades.`;
	const preview = {
		product_id: "BTC-USD",
		side: "BUY",
		type: "market",
		quote_size: String(Math.max(clipUsd, 10))
	};
	const cli = stance === "BUY" || stance === "ACCUMULATE" ? `coinbase orders preview --dry-run product_id=BTC-USD side=BUY type=market quote_size=${Math.max(clipUsd, 10)}` : `coinbase products ticker BTC-USD`;
	checks.push({
		label: "Preview / dry-run only (no orders create)",
		pass: !cli.includes("orders create")
	});
	checks.push({
		label: "Never sell bitcoin — never short",
		pass: true
	});
	return {
		stance,
		conviction,
		clipUsd,
		brief,
		thesis,
		checks,
		cli,
		preview
	};
}
//#endregion
export { runBots as n, heliosCall as t };
