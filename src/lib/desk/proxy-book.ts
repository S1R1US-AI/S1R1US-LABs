/** Most important public BTC holders for Earnings / Filings — DATs + miners, not the long tail. */
export const PROXY_QUOTES = [
  "MSTR",
  "XXI",
  "MTPLF",
  "SMLR",
  "COIN",
  "IBIT",
  "MARA",
  "RIOT",
  "CLSK",
  "HUT",
  "IREN",
  "NVDA",
] as const;

export const MACRO_QUOTES = ["SPY", "QQQ", "DX-Y", "US10Y", "GLD", "SLV", "GDX", "TLT", "GC=F", "SI=F", "VNQ", "KIE"] as const;

/** Nasdaq duration / debasement trades — Mag 7 only. */
export const MAG7_TICKERS = ["NVDA", "MSFT", "AAPL", "AMZN", "GOOGL", "META", "TSLA"] as const;

/** Physical silver + the two miners that matter for the SoV tape. */
export const SILVER_TICKERS = ["SLV", "SIVR", "PSLV", "SIL", "PAAS", "WPM"] as const;

/** Physical gold + the two names that matter for the SoV tape. */
export const GOLD_TICKERS = ["GLD", "IAU", "PHYS", "GDX", "NEM", "GOLD"] as const;

export const DAT_TICKERS = ["MSTR", "XXI", "MTPLF", "SMLR"] as const;
export const MINER_TICKERS = ["MARA", "RIOT", "CLSK", "HUT", "IREN"] as const;

export const PROXY_CIKS: { cik: string; name: string }[] = [
  { cik: "0001050446", name: "MSTR" },
  { cik: "0001679788", name: "COIN" },
  { cik: "0001507606", name: "MARA" },
  { cik: "0001167419", name: "RIOT" },
  { cik: "0000827876", name: "CLSK" },
  { cik: "0001964789", name: "HUT" },
  { cik: "0001878848", name: "IREN" },
  { cik: "0001554859", name: "SMLR" },
];

/** EDGAR watch — BTC treasury events only. No NVDA, no miner-ops noise. */
export const FILING_CIKS: { cik: string; name: string }[] = [
  { cik: "0001050446", name: "MSTR" },
  { cik: "0001679788", name: "COIN" },
  { cik: "0001507606", name: "MARA" },
  { cik: "0001554859", name: "SMLR" },
];
