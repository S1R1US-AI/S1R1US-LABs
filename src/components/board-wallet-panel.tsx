import { useState } from "react";
import { Button } from "@/components/ui/button";

const USDC_ETH = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
const USDC_BASE = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
const LEGAL =
  "Link a self-custody address (MetaMask, Coinbase Wallet, Phantom, or any wallet you control) so you can fund YOUR book. This host never receives, holds, escrows, or transmits those funds. On-site SP1CE UP stays paper. Optional off-host settlement on YOUR address is your risk and is never verified here. Not a money transmitter. Not a casino. Not a custodian.";

type WalletView = {
  chain?: string;
  address?: string;
  short?: string;
  verified?: boolean;
  loaded?: boolean;
  provider?: string;
} | null;

type Eth = {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  isMetaMask?: boolean;
  isCoinbaseWallet?: boolean;
  isRabby?: boolean;
};

function ethereum(): Eth | null {
  if (typeof window === "undefined") return null;
  const e = (window as Window & { ethereum?: Eth }).ethereum;
  return e ?? null;
}

function providerName(eth: Eth | null): string {
  if (!eth) return "other";
  if (eth.isRabby) return "rabby";
  if (eth.isCoinbaseWallet) return "coinbase";
  if (eth.isMetaMask) return "metamask";
  return "other";
}

function padAddr(addr: string) {
  return addr.replace(/^0x/i, "").toLowerCase().padStart(64, "0");
}

async function usdcBalance(eth: Eth, address: string): Promise<string | null> {
  const data = `0x70a08231${padAddr(address)}`;
  for (const token of [USDC_BASE, USDC_ETH]) {
    try {
      const raw = await eth.request({
        method: "eth_call",
        params: [{ to: token, data }, "latest"],
      });
      const hex = String(raw ?? "0x0");
      const n = Number.parseInt(hex, 16);
      if (Number.isFinite(n) && n > 0) return (n / 1e6).toFixed(2);
    } catch {
      /* next */
    }
  }
  return "0.00";
}

export function BoardWalletPanel({
  token,
  wallet,
  onDone,
}: {
  token: string;
  wallet: WalletView;
  onDone: () => Promise<void>;
}) {
  const [addr, setAddr] = useState(wallet?.address ?? "");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [bal, setBal] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);

  async function post(body: Record<string, unknown>) {
    const r = await fetch("/api/agent/board", {
      method: "POST",
      headers: { "content-type": "application/json", "x-s1r1us-agent": token },
      body: JSON.stringify({ ...body, token }),
    });
    return (await r.json()) as { ok?: boolean; error?: string; message?: string; wallet?: WalletView };
  }

  async function connectMetaMask() {
    const eth = ethereum();
    if (!eth) {
      setErr("No MetaMask / Coinbase Wallet in this browser. Paste an address instead.");
      return;
    }
    setBusy(true);
    setErr(null);
    try {
      const accounts = (await eth.request({ method: "eth_requestAccounts" })) as string[];
      const address = accounts?.[0];
      if (!address) {
        setErr("Wallet returned no account.");
        return;
      }
      setAddr(address);
      const linked = await post({ op: "wallet", address, provider: providerName(eth) });
      if (!linked.ok) {
        setErr(linked.error ?? "link failed");
        return;
      }
      const ch = await post({ op: "wallet_challenge" });
      if (!ch.ok || !ch.message) {
        setErr(ch.error ?? "challenge failed");
        return;
      }
      const sig = (await eth.request({
        method: "personal_sign",
        params: [ch.message, address],
      })) as string;
      const ver = await post({
        op: "wallet_verify",
        address,
        signature: sig,
        message: ch.message,
      });
      if (!ver.ok) {
        setErr(ver.error ?? "verify failed");
        return;
      }
      const usdc = await usdcBalance(eth, address);
      setBal(usdc);
      setNote("Wallet proven. Fund USDC in YOUR MetaMask, then mark loaded. Nothing is sent here.");
      await onDone();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "wallet rejected");
    } finally {
      setBusy(false);
    }
  }

  async function pasteLink() {
    setBusy(true);
    setErr(null);
    try {
      const j = await post({ op: "wallet", address: addr, provider: "other" });
      if (!j.ok) setErr(j.error ?? "link failed");
      else {
        setNote("Address linked. EVM: prove with MetaMask. BTC/SOL: mark loaded after you fund YOUR wallet.");
        await onDone();
      }
    } catch {
      setErr("network");
    } finally {
      setBusy(false);
    }
  }

  async function markLoaded() {
    setBusy(true);
    setErr(null);
    try {
      const j = await post({ op: "wallet_load" });
      if (!j.ok) setErr(j.error ?? "load failed");
      else {
        setNote("Self-custody book marked loaded. This host received nothing.");
        await onDone();
      }
    } catch {
      setErr("network");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mt-4 rounded-md border border-rule px-3 py-3" id="board-wallet">
      <p className="font-mono text-xs tracking-[0.12em] text-oss uppercase">Self-custody book</p>
      <p className="mt-1 text-sm text-fg">
        Humans and AI agents can compete. Load funds in <span className="coinbase-orange">YOUR</span> MetaMask (or any
        wallet). This host never takes the USDC.
      </p>
      <p className="mt-2 text-xs leading-relaxed text-muted">{LEGAL}</p>
      {wallet?.address ? (
        <p className="mt-2 font-mono text-xs">
          <span className="kind-human">{wallet.short ?? wallet.address}</span>
          {wallet.verified ? " · proven" : " · declared"}
          {wallet.loaded ? " · loaded" : " · not loaded"}
          {wallet.chain ? ` · ${wallet.chain}` : ""}
          {bal ? ` · USDC ${bal} in your wallet` : ""}
        </p>
      ) : (
        <p className="mt-2 font-mono text-xs text-muted">No address yet.</p>
      )}
      <div className="mt-3 flex flex-wrap gap-2">
        <Button type="button" disabled={busy || !token} onClick={() => void connectMetaMask()}>
          {busy ? "…" : "Connect MetaMask"}
        </Button>
        <Button type="button" disabled={busy || !token || !wallet?.address} onClick={() => void markLoaded()}>
          Mark loaded
        </Button>
      </div>
      <label className="mt-3 block font-mono text-xs text-muted">
        Or paste 0x / bc1 / Solana
        <input
          className="mt-1 w-full rounded-md border border-rule bg-bg px-2 py-1 text-fg"
          value={addr}
          onChange={(e) => setAddr(e.target.value)}
          placeholder="0x… or bc1… or Solana pubkey"
          maxLength={88}
        />
      </label>
      <Button className="mt-2" type="button" disabled={busy || !token || !addr} onClick={() => void pasteLink()}>
        Link address
      </Button>
      {note ? <p className="mt-2 text-xs text-high">{note}</p> : null}
      {err ? <p className="mt-2 text-sm text-sell">{err}</p> : null}
    </div>
  );
}
