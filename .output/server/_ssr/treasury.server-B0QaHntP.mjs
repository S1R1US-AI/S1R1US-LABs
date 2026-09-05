import { r as getSql } from "./db-DsPMHH9G.mjs";
import { d as isEvmAddress, u as isBtcReceiveAddress } from "./security-D71QYeVL.mjs";
import { hmacKey } from "./access.server-Cb5mEDCx.mjs";
import { n as guardedFetch } from "./net-guard-C3s3LqYg.mjs";
import { n as PROFIT_BTC_RECEIVE } from "./treasury-VcYm63db.mjs";
import { createCipheriv, createDecipheriv, createHmac, randomBytes } from "node:crypto";
//#region node_modules/.nitro/vite/services/ssr/assets/treasury.server-B0QaHntP.js
var PROFIT_BTC_ADDRESS = PROFIT_BTC_RECEIVE;
function emptyVault() {
	return {
		profitAddress: PROFIT_BTC_ADDRESS,
		sparrowAddress: "",
		mainUuid: "",
		agentUuid: "",
		usdcAddress: ""
	};
}
async function vaultKey() {
	const pepper = await hmacKey();
	return createHmac("sha256", pepper).update("s1rius-desk-vault-aes-v1").digest();
}
function encrypt(plain, key) {
	const iv = randomBytes(12);
	const cipher = createCipheriv("aes-256-gcm", key, iv);
	return {
		ciphertext: Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]).toString("base64"),
		iv: iv.toString("base64"),
		tag: cipher.getAuthTag().toString("base64")
	};
}
function decrypt(row, key) {
	const decipher = createDecipheriv("aes-256-gcm", key, Buffer.from(row.iv, "base64"));
	decipher.setAuthTag(Buffer.from(row.tag, "base64"));
	return Buffer.concat([decipher.update(Buffer.from(row.ciphertext, "base64")), decipher.final()]).toString("utf8");
}
function cleanUsdc(raw) {
	const a = (raw ?? "").trim();
	return isEvmAddress(a) ? a : "";
}
function normalize(parsed) {
	return {
		profitAddress: isBtcReceiveAddress(parsed.profitAddress ?? "") ? parsed.profitAddress : PROFIT_BTC_ADDRESS,
		sparrowAddress: parsed.sparrowAddress ?? "",
		mainUuid: parsed.mainUuid ?? "",
		agentUuid: parsed.agentUuid ?? "",
		usdcAddress: cleanUsdc(parsed.usdcAddress)
	};
}
async function readVault() {
	const sql = await getSql();
	const key = await vaultKey();
	const rows = await sql`
    select ciphertext, iv, tag from desk_vault where id = 'treasury' limit 1
  `;
	if (!rows[0]) {
		const seeded = emptyVault();
		await writeVault(seeded);
		return seeded;
	}
	const parsed = JSON.parse(decrypt(rows[0], key));
	const next = normalize(parsed);
	if ((parsed.usdcAddress ?? "").trim() !== next.usdcAddress) return writeVault(next);
	return next;
}
async function writeVault(next) {
	const sql = await getSql();
	const key = await vaultKey();
	const payload = normalize(next);
	const enc = encrypt(JSON.stringify(payload), key);
	await sql`
    insert into desk_vault (id, ciphertext, iv, tag, updated_at)
    values ('treasury', ${enc.ciphertext}, ${enc.iv}, ${enc.tag}, now())
    on conflict (id) do update set
      ciphertext = excluded.ciphertext,
      iv = excluded.iv,
      tag = excluded.tag,
      updated_at = now()
  `;
	return payload;
}
async function profitChain() {
	const address = (await readVault()).profitAddress;
	const explorer = `https://www.blockchain.com/explorer/addresses/btc/${address}`;
	const empty = {
		explorer,
		btc: null,
		incoming: null,
		outgoing: null,
		txCount: null,
		source: "unavailable"
	};
	try {
		const res = await guardedFetch(`https://mempool.space/api/address/${address}`, {
			headers: {
				Accept: "application/json",
				"User-Agent": "Mozilla/5.0"
			},
			signal: AbortSignal.timeout(1e4)
		});
		if (res.ok) {
			const j = await res.json();
			const funded = Number(j.chain_stats?.funded_txo_sum ?? 0);
			const spent = Number(j.chain_stats?.spent_txo_sum ?? 0);
			const pendIn = Number(j.mempool_stats?.funded_txo_sum ?? 0);
			const pendOut = Number(j.mempool_stats?.spent_txo_sum ?? 0);
			return {
				explorer,
				btc: (funded - spent + pendIn - pendOut) / 1e8,
				incoming: funded / 1e8,
				outgoing: spent / 1e8,
				txCount: j.chain_stats?.tx_count ?? null,
				source: "mempool.space · blockchain.com explorer"
			};
		}
	} catch {}
	try {
		const res = await guardedFetch(`https://blockchain.info/balance?active=${encodeURIComponent(address)}`, {
			headers: {
				Accept: "application/json",
				"User-Agent": "Mozilla/5.0"
			},
			signal: AbortSignal.timeout(1e4)
		});
		if (!res.ok) return empty;
		const row = (await res.json())[address];
		if (!row) return empty;
		const received = Number(row.total_received ?? 0);
		const final = Number(row.final_balance ?? 0);
		return {
			explorer,
			btc: final / 1e8,
			incoming: received / 1e8,
			outgoing: (received - final) / 1e8,
			txCount: row.n_tx ?? null,
			source: "blockchain.info"
		};
	} catch {
		return empty;
	}
}
var USDC_BASE = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
var USDC_ETH = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
var ETH_RPCS = ["https://ethereum.publicnode.com", "https://cloudflare-eth.com"];
var BASE_RPCS = ["https://mainnet.base.org", "https://base.publicnode.com"];
var RPC_UA = {
	"Content-Type": "application/json",
	"User-Agent": "S1R1US-desk/1.0"
};
async function erc20Usdc(rpc, token, holder) {
	const data = `0x70a08231000000000000000000000000${holder.slice(2).toLowerCase()}`;
	const res = await guardedFetch(rpc, {
		method: "POST",
		headers: RPC_UA,
		body: JSON.stringify({
			jsonrpc: "2.0",
			id: 1,
			method: "eth_call",
			params: [{
				to: token,
				data
			}, "latest"]
		}),
		signal: AbortSignal.timeout(8e3)
	});
	if (!res.ok) return null;
	const j = await res.json();
	if (!j.result || j.result === "0x") return null;
	return Number(BigInt(j.result)) / 1e6;
}
async function firstUsdc(rpcs, token, holder) {
	for (const rpc of rpcs) try {
		const n = await erc20Usdc(rpc, token, holder);
		if (n != null) return n;
	} catch {}
	return null;
}
async function eoaMeta(rpc, holder) {
	try {
		const [codeRes, nonceRes] = await Promise.all([guardedFetch(rpc, {
			method: "POST",
			headers: RPC_UA,
			body: JSON.stringify({
				jsonrpc: "2.0",
				id: 1,
				method: "eth_getCode",
				params: [holder, "latest"]
			}),
			signal: AbortSignal.timeout(8e3)
		}), guardedFetch(rpc, {
			method: "POST",
			headers: RPC_UA,
			body: JSON.stringify({
				jsonrpc: "2.0",
				id: 2,
				method: "eth_getTransactionCount",
				params: [holder, "latest"]
			}),
			signal: AbortSignal.timeout(8e3)
		})]);
		if (!codeRes.ok || !nonceRes.ok) return null;
		const codeJ = await codeRes.json();
		const nonceJ = await nonceRes.json();
		const code = codeJ.result ?? "0x";
		const nonceHex = nonceJ.result ?? "0x0";
		const eoa = !code || code === "0x" || code === "0x0";
		const nonce = nonceHex && nonceHex !== "0x" ? Number(BigInt(nonceHex)) : 0;
		return {
			eoa,
			nonce: Number.isFinite(nonce) ? nonce : 0
		};
	} catch {
		return null;
	}
}
async function usdcChain() {
	const address = (await readVault()).usdcAddress;
	const empty = {
		address,
		usdc: null,
		ethUsdc: null,
		baseUsdc: null,
		network: "not set",
		explorer: "https://www.coinbase.com/advanced-trade",
		ethExplorer: "",
		baseExplorer: "",
		kind: "empty"
	};
	if (!isEvmAddress(address)) return empty;
	const [eth, base, meta] = await Promise.all([
		firstUsdc(ETH_RPCS, USDC_ETH, address),
		firstUsdc(BASE_RPCS, USDC_BASE, address),
		eoaMeta(ETH_RPCS[0], address)
	]);
	const ethEx = `https://etherscan.io/token/${USDC_ETH}?a=${address}`;
	const baseEx = `https://basescan.org/token/${USDC_BASE}?a=${address}`;
	const parts = [eth != null ? `ETH ${eth.toFixed(2)}` : null, base != null ? `Base ${base.toFixed(2)}` : null].filter(Boolean);
	const total = eth == null && base == null ? null : (eth ?? 0) + (base ?? 0);
	const holding = (eth ?? 0) + (base ?? 0) > 0;
	const kind = !meta?.eoa ? "contract — not a Wallet EOA; Coinbase.com Receive contracts get swept" : holding ? "self-custody EOA — USDC sitting (not swept)" : meta.nonce === 0 ? "self-custody EOA — unused, ready for native USDC" : "self-custody EOA — 0 USDC now (sent onward or never funded)";
	return {
		address,
		usdc: total,
		ethUsdc: eth,
		baseUsdc: base,
		network: parts.length ? parts.join(" · ") : "Ethereum + Base (no USDC yet)",
		explorer: (base ?? 0) > (eth ?? 0) ? baseEx : ethEx,
		ethExplorer: ethEx,
		baseExplorer: baseEx,
		kind
	};
}
//#endregion
export { profitChain, readVault, usdcChain, writeVault };
