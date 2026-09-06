export const MORNING_KEEP = 14;
export const MORNING_VISIBLE = 3;
export const MORNING_TITLE = "S1R1U$ M0rning R3p0rt";

export function morningPdfName(id: string) {
  return `S1R1US-Morning-Report-${id}.pdf`;
}

export function morningInlineHref(id: string) {
  return `/morning-pdf/${id}`;
}
