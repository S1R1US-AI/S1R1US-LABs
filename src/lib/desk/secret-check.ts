/** Secret detection shared by public forms. Kept separate so public pages do not load the admin security module. */

const SECRET_RE =
  /"privateKey"\s*:|BEGIN (EC |OPENSSH )?PRIVATE KEY|"organizations\/|"apiSecret"\s*:|cdp[_-]?api[_-]?key/i;
const XPRV_RE = /\b([xyz]prv|tprv)[a-zA-Z0-9]{20,}/;
const WIF_RE = /\b[5KL][1-9A-HJ-NP-Za-km-z]{50,52}\b/;
const HEX_KEY_RE = /\b[0-9a-fA-F]{64}\b/;

export function looksLikeCdpSecret(text: string): boolean {
  if (!text || text.length < 20) return false;
  return SECRET_RE.test(text);
}

export function looksLikeWalletSecret(text: string): boolean {
  if (!text) return false;
  const trimmed = text.trim();
  if (XPRV_RE.test(trimmed) || WIF_RE.test(trimmed)) return true;
  if (HEX_KEY_RE.test(trimmed) && !/\s/.test(trimmed) && trimmed.length === 64) return true;
  const words = trimmed.toLowerCase().split(/\s+/);
  if ([12, 15, 18, 21, 24].includes(words.length) && words.every((w) => /^[a-z]{3,8}$/.test(w))) {
    return true;
  }
  return false;
}

export function looksLikeSecret(text: string): boolean {
  return looksLikeCdpSecret(text) || looksLikeWalletSecret(text);
}
