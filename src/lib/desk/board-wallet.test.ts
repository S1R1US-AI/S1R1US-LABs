import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { secp256k1 } from "@noble/curves/secp256k1.js";
import { keccak_256 } from "@noble/hashes/sha3.js";
import { bytesToHex } from "@noble/hashes/utils.js";
import {
  challengeMessage,
  parseWalletAddress,
  recoverEvmAddress,
  shortWallet,
  verifyEvmPersonalSign,
} from "./board-wallet.ts";

function signPersonal(priv: Uint8Array, message: string) {
  const encoded = new TextEncoder().encode(message);
  const prefix = `\x19Ethereum Signed Message:\n${encoded.length}`;
  const body = new Uint8Array(prefix.length + encoded.length);
  body.set(new TextEncoder().encode(prefix), 0);
  body.set(encoded, prefix.length);
  const hash = keccak_256(body);
  const sig = secp256k1.sign(hash, priv);
  const compact = sig.toCompactRawBytes();
  const v = (sig.recovery ?? 0) + 27;
  const full = new Uint8Array(65);
  full.set(compact, 0);
  full[64] = v;
  return `0x${bytesToHex(full)}`;
}

function evmAddressFromPriv(priv: Uint8Array) {
  const pub = secp256k1.getPublicKey(priv, false);
  return `0x${bytesToHex(keccak_256(pub.slice(1)).slice(12))}`;
}

describe("board-wallet", () => {
  it("parses MetaMask, bitcoin, and Solana addresses", () => {
    const evm = parseWalletAddress("0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48");
    assert.equal(evm.ok, true);
    if (evm.ok) {
      assert.equal(evm.chain, "evm");
      assert.equal(evm.address.startsWith("0x"), true);
      assert.equal(shortWallet(evm.address, "evm").includes("…"), true);
    }
    const btc = parseWalletAddress("bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4");
    assert.equal(btc.ok, true);
    if (btc.ok) assert.equal(btc.chain, "btc");
    const sol = parseWalletAddress("7EcDhSYGxXyscszYEp35KHN8vvw3svAuLKTzXwCFLtV");
    assert.equal(sol.ok, true);
    if (sol.ok) assert.equal(sol.chain, "sol");
    assert.equal(parseWalletAddress("https://evil.test").ok, false);
    assert.equal(parseWalletAddress("not-an-addr").ok, false);
  });

  it("recovers a MetaMask personal_sign and rejects a wrong address", () => {
    const priv = secp256k1.utils.randomPrivateKey();
    const addr = evmAddressFromPriv(priv);
    const msg = challengeMessage({ name: "HUMAN-01", id: "ag_test", nonce: "abc123", at: "2026-09-06T00:00:00.000Z" });
    const sig = signPersonal(priv, msg);
    const rec = recoverEvmAddress(msg, sig);
    assert.equal(rec, addr);
    const ok = verifyEvmPersonalSign({ message: msg, signature: sig, address: addr });
    assert.equal(ok.ok, true);
    const bad = verifyEvmPersonalSign({
      message: msg,
      signature: sig,
      address: "0x000000000000000000000000000000000000dEaD",
    });
    assert.equal(bad.ok, false);
  });
});
