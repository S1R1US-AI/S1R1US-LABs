/** Longest feed title we process; also bounds the tag-strip loop below. */
export const FEED_TEXT_MAX = 1000;

/**
 * Turn a feed title (RSS/Atom) into plain text: cap the length, strip markup,
 * then decode the common HTML entities. `&amp;` is decoded last so `&amp;lt;`
 * stays `&lt;`.
 */
export function decodeFeedText(s: string): string {
  let out = s.slice(0, FEED_TEXT_MAX);
  let prev: string;
  do {
    prev = out;
    out = out.replace(/<[^<>]*>/g, "");
  } while (out !== prev);
  return out
    .replace(/[<>]/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&amp;/g, "&");
}
