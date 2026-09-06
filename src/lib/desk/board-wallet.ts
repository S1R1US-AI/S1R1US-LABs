/** L3AD3R B0ARD self-custody wallets. Server-only. Never escrow. Never hold keys. */

import { secp256k1 } from "@noble/curves/secp256k1.js";
import { keccak_256 } from "@noble/hashes/sha3.js";
import { bytesToHex, hexToBytes } from "@noble/hashes/utils.js";

export type WalletChain = "evm" | "btc" | "sol";
export type WalletProvider = "metamask" | "coinbase" | "phantom" | "rabby" | "other";

export type BoardWallet = {
  chain: WalletChain;
  address: string;
  verified: boolean;
  verifiedAt: string | null;
  loaded: boolean;
  loadedAt: string | null;
  provider: WalletProvider;
};

export const WALLET_CHALLENGE_MS = 10 * 60 * 1000;
export const USDC_ETH = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
export const USDC_BASE = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";

export const WALLET_LEGAL =
  "Link a self-custody address (MetaMask, Coinbase Wallet, Phantom, or any wallet you control) so you can fund YOUR book. This host never receives, holds, escrows, or transmits those funds. On-site SP1CE UP stays paper. Optional off-host settlement on YOUR address is your risk and is never verified here. Not a money transmitter. Not a casino. Not a custodian.";

const PROVIDERS = new Set<WalletProvider>(["metamask", "coinbase", "phantom", "rabby", "other"]);

const EVM_RE = /^0x[a-fA-F0-9]{40}$/;
const BTC_BECH32 = /^(bc1)[a-z0-9]{25,62}$/;
const BTC_BASE58 = /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/;
const SOL_RE = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;

export function isWalletProvider(raw: string | null | undefined): raw is WalletProvider {
  return PROVIDERS.has(String(raw ?? "").toLowerCase() as WalletProvider);
}

export function parseWalletAddress(raw: string | null | undefined): {
  ok: true;
  chain: WalletChain;
  address: string;
} | { ok: false; error: string } {
  const t = String(raw ?? "").trim();
  if (!t || t.length > 88) return { ok: false, error: "Need a wallet address. MetaMask 0x, bitcoin, or Solana." };
  if (/\s/.test(t) || t.includes("://") || t.includes("<")) {
    return { ok: false, error: "Address only. No URLs." };
  }
  if (EVM_RE.test(t)) {
    return { ok: true, chain: "evm", address: t.toLowerCase() };
  }
  if (BTC_BECH32.test(t.toLowerCase()) || BTC_BASE58.test(t)) {
    return { ok: true, chain: "btc", address: BTC_BECH32.test(t.toLowerCase()) ? t.toLowerCase() : t };
  }
  if (SOL_RE.test(t) && !t.startsWith("0x")) {
    return { ok: true, chain: "sol", address: t };
  }
  return { ok: false, error: "Unrecognized address. Paste a MetaMask 0x, bc1 bitcoin, or Solana pubkey." };
}

export function shortWallet(address: string, chain: WalletChain) {
  if (chain === "evm") return `${address.slice(0, 6)}…${address.slice(-4)}`;
  if (address.length <= 12) return address;
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

export function challengeMessage(input: { name: string; id: string; nonce: string; at?: string }) {
  const at = input.at ?? new Date().toISOString();
  return [
    "S1R1US.ai L3AD3R B0ARD wallet proof",
    `Desk: ${input.name}`,
    `Id: ${input.id}`,
    `Nonce: ${input.nonce}`,
    "This host never holds, escrows, or transmits your funds.",
    "Load USDC / BTC in YOUR wallet only.",
    at,
  ].join("\n");
}

function personalHash(message: string): Uint8Array {
  const encoded = new TextEncoder().encode(message);
  const prefix = `\x19Ethereum Signed Message:\n${encoded.length}`;
  const body = new Uint8Array(prefix.length + encoded.length);
  body.set(new TextEncoder().encode(prefix), 0);
  body.set(encoded, prefix.length);
  return keccak_256(body);
}

function parseSig(raw: string): { compact: Uint8Array; recovery: number } | null {
  const hex = raw.trim().replace(/^0x/i, "");
  if (!/^[0-9a-fA-F]{128,130}$/.test(hex)) return null;
  const bytes = hexToBytes(hex.length === 128 ? hex + "1b" : hex);
  if (bytes.length !== 65) return null;
  let v = bytes[64] ?? 0;
  if (v >= 27) v -= 27;
  if (v !== 0 && v !== 1) return null;
  return { compact: bytes.slice(0, 64), recovery: v };
}

export function recoverEvmAddress(message: string, signature: string): string | null {
  const parsed = parseSig(signature);
  if (!parsed) return null;
  try {
    const hash = personalHash(message);
    const rec = secp256k1.Signature.fromCompact(parsed.compact)
      .addRecoveryBit(parsed.recovery)
      .recoverPublicKey(hash)
      .toRawBytes(false);
    if (rec.length !== 65 || rec[0] !== 4) return null;
    return `0x${bytesToHex(keccak_256(rec.slice(1)).slice(12))}`;
  } catch {
    return null;
  }
}

export function verifyEvmPersonalSign(input: {
  message: string;
  signature: string;
  address: string;
}): { ok: true; address: string } | { ok: false; error: string } {
  const want = parseWalletAddress(input.address);
  if (!want.ok || want.chain !== "evm") return { ok: false, error: "Need an EVM 0x to verify a MetaMask signature." };
  const got = recoverEvmAddress(input.message, input.signature);
  if (!got) return { ok: false, error: "Bad signature. Sign the challenge in MetaMask." };
  if (got !== want.address) return { ok: false, error: "Signature is not from that address." };
  return { ok: true, address: got };
}

export function publicWallet(w: BoardWallet | null | undefined) {
  if (!w) return null;
  return {
    chain: w.chain,
    address: w.address,
    short: shortWallet(w.address, w.chain),
    verified: w.verified,
    loaded: w.loaded,
    provider: w.provider,
    escrow: false as const,
    keysOnThisHost: false as const,
  };
}

export function hydrateWallet(raw: unknown): BoardWallet | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const o = raw as Partial<BoardWallet>;
  const parsed = parseWalletAddress(o.address);
  if (!parsed.ok) return undefined;
  const provider = isWalletProvider(o.provider) ? o.provider : "other";
  return {
    chain: parsed.chain,
    address: parsed.address,
    verified: Boolean(o.verified),
    verifiedAt: typeof o.verifiedAt === "string" ? o.verifiedAt : null,
    loaded: Boolean(o.loaded),
    loadedAt: typeof o.loadedAt === "string" ? o.loadedAt : null,
    provider,
  };
}
