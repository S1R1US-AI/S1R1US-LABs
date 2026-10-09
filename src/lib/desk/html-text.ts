/**
 * Turn a feed title (RSS/Atom) into plain text: strip markup, then decode the
 * common HTML entities. `&amp;` is decoded last so `&amp;lt;` stays `&lt;`.
 */
export function decodeFeedText(s: string): string {
  let out = s;
  let prev: string;
  do {
    prev = out;
    out = out.replace(/<[^<>]*>/g, "");
  } while (out !== prev);
  return out
    .replace(/[<>]/g, "")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&");
}
