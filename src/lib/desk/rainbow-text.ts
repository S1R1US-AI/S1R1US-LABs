import {
  MENU_BOARD,
  TAB_BOWL,
  TAB_CALLOUT,
  TAB_CUP,
  TAB_GM,
  TAB_GM_AUTO,
  TAB_HIVE,
  TAB_KING_MANUAL,
  TAB_KING_ROUND,
  TAB_KING_UNI,
} from "../brand.ts";

/** Public G0Dz1LLa M0D3 names. The older spellings stay accepted so existing text keeps its styling. */
export const GM_NAMES = [
  "G0Dz1LLa M0D3 AUTO",
  "G0Dz1LLa M0D3 M@NU@L",
  "G0Dz1LLa M0D3",
  TAB_GM,
  TAB_GM_AUTO,
  "G M0D3 M@NU@L",
];

export const RAINBOW_BITS: readonly string[] = [
  ...GM_NAMES,
  MENU_BOARD,
  TAB_CALLOUT,
  TAB_KING_MANUAL,
  TAB_KING_ROUND,
  TAB_KING_UNI,
  TAB_BOWL,
  TAB_CUP,
  TAB_HIVE,
];

export const GOLD_BITS: readonly string[] = ["S1R1US Pr3d1ctions", "Pr3d1ctions"];

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Longest names first, so "G0Dz1LLa M0D3 AUTO" wins over "G0Dz1LLa M0D3". */
const SPLIT_RE = new RegExp(
  `(${[...new Set([...GOLD_BITS, ...RAINBOW_BITS])]
    .sort((a, b) => b.length - a.length)
    .map(escape)
    .join("|")})`,
  "g",
);

export type RainbowPart = { text: string; style: "rainbow" | "gold" | "plain" };

/** Split running text into rainbow names, gold names and plain text. */
export function splitRainbowText(text: string): RainbowPart[] {
  return text
    .split(SPLIT_RE)
    .filter((p) => p !== "")
    .map((p) => ({
      text: p,
      style: GOLD_BITS.includes(p) ? "gold" : RAINBOW_BITS.includes(p) ? "rainbow" : "plain",
    }));
}
