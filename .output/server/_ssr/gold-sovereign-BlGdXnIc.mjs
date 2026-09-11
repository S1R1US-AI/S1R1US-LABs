//#region ../../workspace/node_modules/.nitro/vite/services/ssr/assets/gold-sovereign-BlGdXnIc.js
var GOLD_REGIONS = [
	{
		id: "us",
		name: "United States",
		tonnes: 8133.5,
		estimate: false,
		note: "IMF IFS · Fed / Treasury",
		fill: "#3d7ee8"
	},
	{
		id: "eu",
		name: "EU",
		tonnes: 11860,
		estimate: false,
		note: "National CBs + ECB (UK excluded)",
		fill: "#ff9ec8"
	},
	{
		id: "cn",
		name: "China",
		tonnes: 2366.3,
		estimate: false,
		note: "PBOC official — actual stock may be higher",
		fill: "#ff1f1f"
	},
	{
		id: "ru",
		name: "Russia",
		tonnes: 2283,
		estimate: false,
		note: "Bank of Russia / IMF",
		fill: "#ff8a1f"
	},
	{
		id: "in",
		name: "India",
		tonnes: 880.5,
		estimate: false,
		note: "RBI / IMF",
		fill: "#f97316"
	},
	{
		id: "sa",
		name: "Saudi Arabia",
		tonnes: 323.1,
		estimate: false,
		note: "SAMA / IMF",
		fill: "#eab308"
	},
	{
		id: "uk",
		name: "United Kingdom",
		tonnes: 310.3,
		estimate: false,
		note: "BoE / IMF",
		fill: "#c0c8d4"
	},
	{
		id: "ir",
		name: "Iran",
		tonnes: 320,
		estimate: true,
		note: "IMF last print ~320 t — reporting interrupted",
		fill: "#14b8a6"
	},
	{
		id: "iq",
		name: "Iraq",
		tonnes: 170.9,
		estimate: false,
		note: "CBI / IMF",
		fill: "#22c55e"
	},
	{
		id: "pk",
		name: "Pakistan",
		tonnes: 64.8,
		estimate: false,
		note: "SBP / IMF",
		fill: "#a78bfa"
	},
	{
		id: "kp",
		name: "North Korea",
		tonnes: 36,
		estimate: true,
		note: "No IMF series — open-source estimate only",
		fill: "#6b7280"
	},
	{
		id: "ca",
		name: "Canada",
		tonnes: 0,
		estimate: false,
		note: "BoC sold official gold — IMF 0 t",
		fill: "#7eb8ff"
	}
];
/** Individual central banks (same WGC/IMF book). */
var GOLD_BANKS = [
	{
		id: "us-fed",
		name: "US Treasury / Fed",
		tonnes: 8133.5,
		estimate: false,
		note: "United States",
		fill: "#3d7ee8"
	},
	{
		id: "de",
		name: "Deutsche Bundesbank",
		tonnes: 3350.3,
		estimate: false,
		note: "Germany",
		fill: "#ff9ec8"
	},
	{
		id: "it",
		name: "Banca d'Italia",
		tonnes: 2451.8,
		estimate: false,
		note: "Italy",
		fill: "#f9a8d4"
	},
	{
		id: "fr",
		name: "Banque de France",
		tonnes: 2437,
		estimate: false,
		note: "France",
		fill: "#f472b6"
	},
	{
		id: "pboc",
		name: "People's Bank of China",
		tonnes: 2366.3,
		estimate: false,
		note: "China official",
		fill: "#ff1f1f"
	},
	{
		id: "cbr",
		name: "Bank of Russia",
		tonnes: 2283,
		estimate: false,
		note: "Russia",
		fill: "#ff8a1f"
	},
	{
		id: "snb",
		name: "Swiss National Bank",
		tonnes: 1039.9,
		estimate: false,
		note: "Switzerland",
		fill: "#fb7185"
	},
	{
		id: "rbi",
		name: "Reserve Bank of India",
		tonnes: 880.5,
		estimate: false,
		note: "India",
		fill: "#f97316"
	},
	{
		id: "boj",
		name: "Bank of Japan",
		tonnes: 845.9,
		estimate: false,
		note: "Japan",
		fill: "#a855f7"
	},
	{
		id: "nbp",
		name: "Narodowy Bank Polski",
		tonnes: 632.4,
		estimate: false,
		note: "Poland",
		fill: "#e879f9"
	},
	{
		id: "dnb",
		name: "De Nederlandsche Bank",
		tonnes: 612.5,
		estimate: false,
		note: "Netherlands",
		fill: "#c084fc"
	},
	{
		id: "ecb",
		name: "European Central Bank",
		tonnes: 506.5,
		estimate: false,
		note: "Euro system",
		fill: "#fda4af"
	},
	{
		id: "sama",
		name: "SAMA",
		tonnes: 323.1,
		estimate: false,
		note: "Saudi Arabia",
		fill: "#eab308"
	},
	{
		id: "cbi-ir",
		name: "Central Bank of Iran",
		tonnes: 320,
		estimate: true,
		note: "Last IMF print",
		fill: "#14b8a6"
	},
	{
		id: "boe",
		name: "Bank of England",
		tonnes: 310.3,
		estimate: false,
		note: "United Kingdom",
		fill: "#c0c8d4"
	},
	{
		id: "cbi-iq",
		name: "Central Bank of Iraq",
		tonnes: 170.9,
		estimate: false,
		note: "Iraq",
		fill: "#22c55e"
	},
	{
		id: "sbp",
		name: "State Bank of Pakistan",
		tonnes: 64.8,
		estimate: false,
		note: "Pakistan",
		fill: "#a78bfa"
	},
	{
		id: "kp-cb",
		name: "North Korea CB",
		tonnes: 36,
		estimate: true,
		note: "No IMF series",
		fill: "#6b7280"
	},
	{
		id: "boc",
		name: "Bank of Canada",
		tonnes: 0,
		estimate: false,
		note: "Official stock sold",
		fill: "#7eb8ff"
	}
];
/** Government / sovereign BTC in the named regions. Not ETFs or DATs. */
var BTC_REGIONS = [
	{
		id: "us",
		name: "United States",
		btc: 328372,
		estimate: false,
		note: "Strategic Bitcoin Reserve / seizures — bitcointreasuries",
		fill: "#3d7ee8"
	},
	{
		id: "cn",
		name: "China",
		btc: 19e4,
		estimate: true,
		note: "Seized stock — may have been auctioned; not a declared reserve",
		fill: "#ff1f1f"
	},
	{
		id: "uk",
		name: "United Kingdom",
		btc: 61245,
		estimate: false,
		note: "Treasury-held seizures — not a reserve policy",
		fill: "#c0c8d4"
	},
	{
		id: "eu",
		name: "EU",
		btc: 120,
		estimate: true,
		note: "Finland ~90 BTC + small EU seizures. No euro-area BTC reserve",
		fill: "#ff9ec8"
	},
	{
		id: "ru",
		name: "Russia",
		btc: 1e3,
		estimate: true,
		note: "Arkham / public estimates — not a published CBR reserve",
		fill: "#ff8a1f"
	},
	{
		id: "kp",
		name: "North Korea",
		btc: 2400,
		estimate: true,
		note: "Lazarus-linked — stolen, not a central-bank reserve",
		fill: "#6b7280"
	},
	{
		id: "ir",
		name: "Iran",
		btc: 35e3,
		estimate: true,
		note: "Grok max estimate — sanctioned mining / farm seizures; no confirmed treasury print",
		fill: "#14b8a6"
	},
	{
		id: "pk",
		name: "Pakistan",
		btc: 2e3,
		estimate: true,
		note: "Grok max estimate — enforcement seizures + unreported pilot; no public print",
		fill: "#a78bfa"
	},
	{
		id: "sa",
		name: "Saudi Arabia",
		btc: 2420,
		estimate: true,
		note: "Grok max estimate — no SAMA / PIF disclosure; ceiling for unreported small allocation",
		fill: "#eab308"
	}
];
var TROY_OZ_PER_TONNE = 32150.7465;
//#endregion
export { TROY_OZ_PER_TONNE as i, GOLD_BANKS as n, GOLD_REGIONS as r, BTC_REGIONS as t };
