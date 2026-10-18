// DOM-free HTML tokenizer for the static page tests. It walks the markup once, character by
// character, instead of regex-stripping tags, so comments, quoted attributes and raw-text
// elements (<script>, <style>, matched case-insensitively) are handled the way a browser would.

const RAW_TEXT = new Set(["script", "style"]);
const NAMED = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: "\u00a0" };

/** Decode HTML character references in a single pass, so "&amp;lt;" becomes "&lt;", never "<". */
export function decodeEntities(s) {
  return s.replace(/&(#[xX][0-9a-fA-F]+|#[0-9]+|[a-zA-Z]+);/g, (m, ref) => {
    if (ref[0] === "#") {
      const cp = ref[1] === "x" || ref[1] === "X" ? parseInt(ref.slice(2), 16) : parseInt(ref.slice(1), 10);
      return Number.isFinite(cp) && cp >= 0 && cp <= 0x10ffff ? String.fromCodePoint(cp) : m;
    }
    return Object.hasOwn(NAMED, ref.toLowerCase()) ? NAMED[ref.toLowerCase()] : m;
  });
}

function parseAttrs(src) {
  const attrs = {};
  let i = 0;
  while (i < src.length) {
    while (i < src.length && /[\s/]/.test(src[i])) i++;
    let name = "";
    while (i < src.length && !/[\s/=>]/.test(src[i])) name += src[i++];
    if (!name) { i++; continue; }
    while (i < src.length && /\s/.test(src[i])) i++;
    let value = "";
    if (src[i] === "=") {
      i++;
      while (i < src.length && /\s/.test(src[i])) i++;
      const q = src[i];
      if (q === '"' || q === "'") {
        const end = src.indexOf(q, i + 1);
        value = src.slice(i + 1, end === -1 ? src.length : end);
        i = end === -1 ? src.length : end + 1;
      } else {
        while (i < src.length && !/\s/.test(src[i])) value += src[i++];
      }
    }
    attrs[name.toLowerCase()] = decodeEntities(value);
  }
  return attrs;
}

/** Find the end of a tag starting at `i` (the "<"), skipping ">" inside quoted attribute values. */
function tagEnd(html, i) {
  let q = null;
  for (let j = i + 1; j < html.length; j++) {
    const c = html[j];
    if (q) { if (c === q) q = null; }
    else if (c === '"' || c === "'") q = c;
    else if (c === ">") return j;
  }
  return html.length - 1;
}

/** Tokens: { type: "text" | "comment" | "start" | "end", name?, attrs?, text?, raw? }. */
export function tokenize(html) {
  const out = [];
  const lower = html.toLowerCase();
  let i = 0;
  while (i < html.length) {
    const lt = html.indexOf("<", i);
    if (lt === -1) { out.push({ type: "text", text: html.slice(i) }); break; }
    if (lt > i) out.push({ type: "text", text: html.slice(i, lt) });
    if (html.startsWith("<!--", lt)) {
      const end = html.indexOf("-->", lt + 4);
      out.push({ type: "comment", text: html.slice(lt + 4, end === -1 ? html.length : end) });
      i = end === -1 ? html.length : end + 3;
      continue;
    }
    const m = /^<(\/?)([a-zA-Z][a-zA-Z0-9-]*)/.exec(html.slice(lt, lt + 64));
    if (!m) {
      if (html[lt + 1] === "!" || html[lt + 1] === "?") { i = tagEnd(html, lt) + 1; continue; } // doctype / PI
      out.push({ type: "text", text: "<" });
      i = lt + 1;
      continue;
    }
    const end = tagEnd(html, lt);
    const name = m[2].toLowerCase();
    if (m[1]) { out.push({ type: "end", name }); i = end + 1; continue; }
    const attrs = parseAttrs(html.slice(lt + m[0].length, end));
    const tok = { type: "start", name, attrs };
    out.push(tok);
    i = end + 1;
    if (RAW_TEXT.has(name)) {
      const close = lower.indexOf(`</${name}`, i);
      const stop = close === -1 ? html.length : close;
      tok.raw = html.slice(i, stop);
      if (close === -1) { i = html.length; continue; }
      out.push({ type: "end", name });
      i = tagEnd(html, close) + 1;
    }
  }
  return out;
}

/**
 * Visible text: everything except comments, <script>, <style> and (optionally) <head>; entities decoded.
 * With tagSpace (default) each tag becomes a space so words in separate elements never run together;
 * pass tagSpace: false to keep inline markup (<strong>, <a>) flush with the surrounding text.
 */
export function visibleText(html, { skipHead = true, tagSpace = true } = {}) {
  let inHead = false;
  const parts = [];
  for (const t of tokenize(html)) {
    if (t.type === "start" && t.name === "head") inHead = true;
    else if (t.type === "end" && t.name === "head") inHead = false;
    else if (t.type === "text" && !(skipHead && inHead)) parts.push(decodeEntities(t.text));
    else if (tagSpace && (t.type === "start" || t.type === "end")) parts.push(" ");
  }
  return parts.join("");
}

/** Parsed JSON of every <script type="application/ld+json"> block, in document order. */
export function jsonLd(html) {
  return tokenize(html)
    .filter((t) => t.type === "start" && t.name === "script" && (t.attrs.type || "").toLowerCase() === "application/ld+json")
    .map((t) => JSON.parse(t.raw));
}

/** Decoded text content of the <title> element. */
export function titleText(html) {
  const toks = tokenize(html);
  const i = toks.findIndex((t) => t.type === "start" && t.name === "title");
  if (i === -1) return "";
  let s = "";
  for (let j = i + 1; j < toks.length && !(toks[j].type === "end" && toks[j].name === "title"); j++) if (toks[j].type === "text") s += toks[j].text;
  return decodeEntities(s);
}

/** Content of <meta {attr}="{name}" content="..."> (entity-decoded), or "" when missing. */
export function metaContent(html, attr, name) {
  const t = tokenize(html).find((x) => x.type === "start" && x.name === "meta" && x.attrs[attr] === name);
  return t ? t.attrs.content ?? "" : "";
}

/** Every absolute http(s) URL in a plain-text document, parsed with new URL(); unparsable ones are skipped. */
export function textUrls(text) {
  const urls = [];
  for (const m of text.matchAll(/https?:\/\/[^\s<>"'()]+/g)) {
    try { urls.push(new URL(m[0].replace(/[.,;:]+$/, ""))); } catch { /* not a URL */ }
  }
  return urls;
}

/** True when `url` parses and its host and pathname match exactly. */
export function isUrl(url, host, pathname) {
  let u;
  try { u = url instanceof URL ? url : new URL(url); } catch { return false; }
  return (u.protocol === "https:") && u.host === host && u.pathname === pathname;
}
