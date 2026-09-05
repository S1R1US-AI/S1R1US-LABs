import type { LeverageVenue, Quote, SlowCapitalTape, SlowPool } from "./types";

function q(quotes: Quote[], symbol: string) {
  return quotes.find((x) => x.symbol === symbol);
}

function vs(ibit: number | null | undefined, other: number | null | undefined) {
  if (ibit == null || other == null || Number.isNaN(ibit) || Number.isNaN(other)) return null;
  return ibit - other;
}

/** Bump this ISO date on every weekly free-source hunt. */
export const POOLS_REVIEWED = "2026-09-02";
export function buildSlowCapital(quotes: Quote[], venues: LeverageVenue[]): SlowCapitalTape {
  const ibit = q(quotes, "IBIT");
  const vnq = q(quotes, "VNQ");
  const kie = q(quotes, "KIE");
  const qqq = q(quotes, "QQQ");
  const ibitCh = ibit?.changePct ?? null;
  const hl = venues.find((v) => /hyperliquid/i.test(v.name) || v.id === "hl" || v.id === "hyperliquid");

  const pools: SlowPool[] = [
    {
      id: "cre",
      name: "Commercial real estate",
      sleeve: "CRE / REITs",
      status: "watch",
      disclosedUsd: null,
      proxy: "VNQ",
      proxyChg: vnq?.changePct ?? null,
      vsIbit: vs(ibitCh, vnq?.changePct),
      note: "No public CRE→BTC AUM. VNQ vs IBIT is the paper-REIT rotation proxy. Positive vs IBIT = BTC taking the sleeve.",
    },
    {
      id: "retire",
      name: "401(k) / IRA",
      sleeve: "Retirement",
      status: "pipe",
      disclosedUsd: null,
      proxy: "IBIT",
      proxyChg: ibitCh,
      vsIbit: 0,
      note: "Spot BTC ETFs are the live pipe (IRA, brokerage). Fidelity still does not list crypto ETPs as a designated 401(k) menu item — SDB windows only. Size is IBIT/FBTC AUM on the capital tape, not a 401(k) print.",
    },
    {
      id: "insure",
      name: "Life / P&C insurers",
      sleeve: "Insurance GIA",
      status: "watch",
      disclosedUsd: 100_000_000,
      proxy: "KIE",
      proxyChg: kie?.changePct ?? null,
      vsIbit: vs(ibitCh, kie?.changePct),
      note: "MassMutual disclosed ~$100M BTC (2020). NAIC does not publish a live insurer BTC book. KIE = insurance equity proxy vs IBIT.",
    },
    {
      id: "endow",
      name: "University endowments",
      sleeve: "NACUBO",
      status: "watch",
      disclosedUsd: null,
      proxy: null,
      proxyChg: null,
      vsIbit: null,
      note: "No free live endowment BTC feed. Yale/Harvard-style books do not print BTC. Watch 13-F / NACUBO — label only.",
    },
    {
      id: "tx",
      name: "Texas strategic reserve",
      sleeve: "US state",
      status: "holding",
      disclosedUsd: null,
      proxy: "IBIT",
      proxyChg: ibitCh,
      vsIbit: null,
      note: "First state to buy (via ETF, 2025–26). Size is not on a public 5-minute feed. Law + purchase = holding, not a live bar.",
    },
    {
      id: "nh",
      name: "New Hampshire",
      sleeve: "US state",
      status: "law",
      disclosedUsd: null,
      proxy: null,
      proxyChg: null,
      vsIbit: null,
      note: "Passed. Treasurer may invest up to 5% of eligible funds in crypto ETFs (and metals). No live BTC print.",
    },
    {
      id: "az",
      name: "Arizona",
      sleeve: "US state",
      status: "law",
      disclosedUsd: null,
      proxy: null,
      proxyChg: null,
      vsIbit: null,
      note: "HB 2749 signed: digital-asset reserve from unclaimed property. Not a live AUM feed.",
    },
    {
      id: "bills",
      name: "Other state bills",
      sleeve: "US state",
      status: "bill",
      disclosedUsd: null,
      proxy: null,
      proxyChg: null,
      vsIbit: null,
      note: "30+ states have filed SBR-style bills (MA, OH, SD, FL, UT, WY, etc.). Track bitcoinlaws.io / Congress — not Yahoo.",
    },
    {
      id: "fed",
      name: "US federal SBR",
      sleeve: "Federal",
      status: "bill",
      disclosedUsd: null,
      proxy: null,
      proxyChg: null,
      vsIbit: null,
      note: "S.954 BITCOIN Act / ARMA-style bills. Forfeiture stockpile exists; a strategic buy program is not law. No live Treasury BTC ticker.",
    },
    {
      id: "agents",
      name: "AI / agent desks",
      sleeve: "On-chain perps",
      status: hl?.openInterestUsd ? "pipe" : "watch",
      disclosedUsd: hl?.openInterestUsd ?? null,
      proxy: "HYPE",
      proxyChg: null,
      vsIbit: null,
      note: "No census of AI agent AUM. Hyperliquid public OI is the free stand-in for automated desks. Not the same as 401(k) money.",
    },
    {
      id: "qqq",
      name: "Nasdaq / duration capital",
      sleeve: "Public equity",
      status: "pipe",
      disclosedUsd: null,
      proxy: "QQQ",
      proxyChg: qqq?.changePct ?? null,
      vsIbit: vs(ibitCh, qqq?.changePct),
      note: "Largest fast pool. Rotation Analyst already votes IBIT vs QQQ. This row is the same tape, visible as a pool.",
    },
  ];

  return {
    source: "Yahoo VNQ/KIE/IBIT/QQQ · Hyperliquid public OI · state laws (CNBC / bitcoinlaws, 2026) · Fidelity 401(k) disclosure · weekly hunt",
    reviewedAt: POOLS_REVIEWED,
    pools,
  };
}
