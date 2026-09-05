import type { DeskSnapshot, EmRegion, EmRegionId, Flow } from "./types";

export type LabKnobs = {
  price: number;
  rsi: number;
  fg: number;
  longShort: number;
  fundingPct: number;
  kimchi: number;
  cnyOtc: number;
  emHot: number;
  emOut: number;
  etfFlowM: number;
  goldOz: number;
};

/** Slider zeros until live tape arrives. Never a market print. */
export const DEFAULT_KNOBS: LabKnobs = {
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
  goldOz: 18,
};

const EM_META: { id: EmRegionId; name: string }[] = [
  { id: "UAE", name: "UAE" },
  { id: "ME", name: "Middle East" },
  { id: "RU", name: "Russia" },
  { id: "AF", name: "Africa" },
  { id: "SA", name: "South America" },
];

export function fgLabel(v: number): string {
  if (v <= 24) return "Extreme Fear";
  if (v <= 44) return "Fear";
  if (v <= 55) return "Neutral";
  if (v <= 74) return "Greed";
  return "Extreme Greed";
}

export const LAB_PRESETS: { id: string; name: string; blurb: string; knobs: LabKnobs }[] = [
  { id: "live", name: "Live tape", blurb: "No overlay. Bot 7 reads the last validated pull.", knobs: { ...DEFAULT_KNOBS } },
  {
    id: "crash",
    name: "Crash bid",
    blurb: "RSI panic, extreme fear, EM offering — does Bot 7 BUY or wait the knife?",
    knobs: {
      ...DEFAULT_KNOBS,
      rsi: 27,
      fg: 18,
      longShort: 0.82,
      fundingPct: -0.01,
      kimchi: -2.1,
      cnyOtc: -1.2,
      emHot: 0,
      emOut: 2,
      etfFlowM: -180,
      goldOz: 15.2,
    },
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
      cnyOtc: -0.4,
      emHot: 0,
      emOut: 2,
      etfFlowM: -40,
      goldOz: 16.4,
    },
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
      fundingPct: 0.06,
      kimchi: 4.6,
      cnyOtc: 3.1,
      emHot: 2,
      etfFlowM: 420,
      goldOz: 20.8,
    },
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
      etfFlowM: 80,
    },
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
      fundingPct: 0.07,
      kimchi: 2.4,
      emHot: 3,
      etfFlowM: 510,
      goldOz: 21.5,
    },
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
      etfFlowM: -20,
    },
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
      longShort: 1.45,
    },
  },
];

export function knobsFromSnap(snap: DeskSnapshot): LabKnobs {
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
    goldOz: snap.goldBtc.ozPerBtc ?? 18,
  };
}

function flowAt(i: number, hot: number, out: number): { flow: Flow; premiumPct: number } {
  if (i < hot) return { flow: "INFLOW", premiumPct: 3.2 };
  if (i < hot + out) return { flow: "OUTFLOW", premiumPct: -2.1 };
  return { flow: "FLAT", premiumPct: 0.2 };
}

/** Overlay what-if knobs onto a LIVE snapshot. Never invent ETF/DAT/filings/holders. */
export function overlayLive(live: DeskSnapshot, k: LabKnobs): DeskSnapshot {
  const hot = Math.max(0, Math.min(5, Math.round(k.emHot)));
  const out = Math.max(0, Math.min(5 - hot, Math.round(k.emOut)));
  const regions: EmRegion[] = live.em.regions.length
    ? live.em.regions.map((r, i) => {
        const { flow, premiumPct } = flowAt(i, hot, out);
        return { ...r, flow, premiumPct };
      })
    : EM_META.map((m, i) => {
        const { flow, premiumPct } = flowAt(i, hot, out);
        return {
          id: m.id,
          name: m.name,
          flow,
          premiumPct,
          venues: [{ id: m.id, region: m.id, name: m.name, kind: "spot" as const, lastUsd: k.price, premiumPct }],
        };
      });
  const inflow = regions.filter((r) => r.flow === "INFLOW").length;
  const outflow = regions.filter((r) => r.flow === "OUTFLOW").length;
  const oz = k.goldOz > 0 ? k.goldOz : live.goldBtc.ozPerBtc;
  return {
    ...live,
    btc: { ...live.btc, price: k.price > 0 ? k.price : live.btc.price },
    rsi14: k.rsi,
    fearGreed: { value: Math.round(k.fg), label: fgLabel(k.fg) },
    positioning: {
      ...live.positioning,
      longShort: k.longShort,
      fundingRate: k.fundingPct / 100,
    },
    asia: {
      ...live.asia,
      kimchiPct: k.kimchi,
      cnyOtc: { ...live.asia.cnyOtc, premiumPct: k.cnyOtc },
    },
    em: {
      ...live.em,
      net: { inflow, outflow, flat: Math.max(0, regions.length - inflow - outflow) },
      regions,
    },
    capital: {
      ...live.capital,
      etfFlow: Number.isFinite(k.etfFlowM) ? k.etfFlowM * 1e6 : live.capital.etfFlow,
    },
    goldBtc: {
      ...live.goldBtc,
      ozPerBtc: oz,
      btcPerOz: oz != null && oz > 0 ? 1 / oz : live.goldBtc.btcPerOz,
    },
    errors: [...live.errors.filter((e) => !e.startsWith("what-if")), "what-if overlay — knobs on live tape, not a feed"],
  };
}

export type StructureHeat = "bid" | "chase" | "neutral";

export type StructureRow = {
  id: string;
  label: string;
  value: string;
  heat: StructureHeat;
};

export type StructureRead = {
  rows: StructureRow[];
  tags: { id: string; label: string; heat: StructureHeat }[];
};

function fmtSigned(n: number | null | undefined, d = 2, suffix = "%") {
  if (n == null || !Number.isFinite(n)) return "—";
  return `${n >= 0 ? "+" : ""}${n.toFixed(d)}${suffix}`;
}

/** Market-structure read Bot 7 uses. Labs overlay this; Desk paints the live pull. */
export function readStructure(snap: DeskSnapshot): StructureRead {
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

  const crowdedLongs = (ls != null && ls > 1.6) || (funding != null && funding > 0.0005);
  const asiaFomo = (kimchi != null && kimchi >= 3) || (cny != null && cny >= 2);
  const asiaDiscount = (kimchi != null && kimchi <= -1.5) || emOut >= 2;
  const emCrowded = emHot >= 3;
  const etfMelt = etf != null && etf > 350_000_000 && (rsi == null || rsi >= 50);
  const panic = rsi != null && rsi < 30 && (fg == null || fg <= 40);
  const greedTrim = rsi != null && rsi > 72 && (fg ?? 0) >= 75;
  const cheapGold = vsMed != null && vsMed <= -0.08;
  const richGold = vsMed != null && vsMed >= 0.12;

  const rows: StructureRow[] = [
    {
      id: "rsi",
      label: "RSI(14) 1h",
      value: rsi != null ? rsi.toFixed(1) : "—",
      heat: rsi != null && rsi < 40 ? "bid" : rsi != null && rsi > 70 ? "chase" : "neutral",
    },
    {
      id: "fg",
      label: "Fear & Greed",
      value: fg != null ? `${fg} ${snap.fearGreed?.label ?? fgLabel(fg)}` : "—",
      heat: fg != null && fg <= 40 ? "bid" : fg != null && fg >= 70 ? "chase" : "neutral",
    },
    {
      id: "ls",
      label: "Long/short",
      value: ls != null ? ls.toFixed(2) : "—",
      heat: ls != null && ls > 1.6 ? "chase" : ls != null && ls < 0.9 ? "bid" : "neutral",
    },
    {
      id: "fund",
      label: "Funding",
      value: funding != null ? `${(funding * 100).toFixed(3)}%` : "—",
      heat: funding != null && funding > 0.0005 ? "chase" : funding != null && funding < -0.0001 ? "bid" : "neutral",
    },
    {
      id: "kimchi",
      label: "Kimchi",
      value: fmtSigned(kimchi),
      heat: kimchi != null && kimchi >= 3 ? "chase" : kimchi != null && kimchi <= -1.5 ? "bid" : "neutral",
    },
    {
      id: "cny",
      label: "CNY OTC",
      value: fmtSigned(cny),
      heat: cny != null && cny >= 2 ? "chase" : cny != null && cny <= -1 ? "bid" : "neutral",
    },
    {
      id: "em",
      label: "EM regions",
      value: `${snap.em.net.inflow} in / ${snap.em.net.outflow} out`,
      heat: emCrowded ? "chase" : emOut >= 2 ? "bid" : "neutral",
    },
    {
      id: "etf",
      label: "US spot ETF",
      value: etf == null ? "—" : `${etf >= 0 ? "+" : "−"}$${(Math.abs(etf) / 1e6).toFixed(0)}M`,
      heat: etfMelt ? "chase" : etf != null && etf < -50_000_000 ? "bid" : "neutral",
    },
    {
      id: "gold",
      label: "BTC / gold oz",
      value: oz != null ? `${oz.toFixed(1)}${vsMed != null ? ` (${vsMed >= 0 ? "+" : ""}${(vsMed * 100).toFixed(0)}% vs 1y)` : ""}` : "—",
      heat: cheapGold ? "bid" : richGold ? "chase" : "neutral",
    },
  ];

  const tags: StructureRead["tags"] = [];
  if (panic) tags.push({ id: "panic", label: "RSI panic / fear", heat: "bid" });
  if (asiaDiscount) tags.push({ id: "asia-bid", label: "Asia/EM discount", heat: "bid" });
  if (cheapGold) tags.push({ id: "gold-bid", label: "Cheap vs gold", heat: "bid" });
  if (etf != null && etf < -50_000_000) tags.push({ id: "etf-out", label: "ETF outflow", heat: "bid" });
  if (crowdedLongs) tags.push({ id: "ls", label: "Crowded longs", heat: "chase" });
  if (asiaFomo) tags.push({ id: "asia-fomo", label: "Asia FOMO", heat: "chase" });
  if (emCrowded) tags.push({ id: "em", label: "EM crowded", heat: "chase" });
  if (etfMelt) tags.push({ id: "etf", label: "ETF melt-up", heat: "chase" });
  if (greedTrim) tags.push({ id: "trim", label: "Trim heat", heat: "chase" });
  if (richGold) tags.push({ id: "gold-rich", label: "Rich vs gold", heat: "chase" });
  if (!tags.length) tags.push({ id: "quiet", label: "No crowded / discount print", heat: "neutral" });

  return { rows, tags };
}
