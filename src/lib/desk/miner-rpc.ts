/**
 * BTC M1N3Rz RPCs. Admin session required (system /admin or /app/admin copy).
 * Each admin scope reads + writes ONLY its own stratum config. Read-only free
 * public CKPool data — never Coinbase, never keys.
 */
import { createServerFn } from "@tanstack/react-start";
import type { MinerConfig } from "./btc-miners";

async function minerScope(token: string): Promise<"system" | "app" | null> {
  const { verifyAccessToken } = await import("./access.server");
  if (await verifyAccessToken(token)) return "system";
  const { verifyAppAdminToken } = await import("./app-admin");
  if (verifyAppAdminToken(token)) return "app";
  return null;
}

export const fetchBtcMiners = createServerFn({ method: "POST" })
  .validator((input: { token: string }) => input)
  .handler(async ({ data }) => {
    const scope = await minerScope(data.token);
    if (!scope) {
      return { ok: false as const, error: "Admin session required", scope: null, config: null, view: null };
    }
    const { loadMinerConfig, minerStatsView } = await import("./btc-miners.server");
    const config = loadMinerConfig(scope);
    const view = await minerStatsView(config.address);
    return { ok: true as const, error: null as string | null, scope, config, view };
  });

export const saveBtcMiners = createServerFn({ method: "POST" })
  .validator((input: { token: string; config: Partial<MinerConfig> }) => input)
  .handler(async ({ data }) => {
    const scope = await minerScope(data.token);
    if (!scope) {
      return { ok: false as const, error: "Admin session required", scope: null, config: null, view: null };
    }
    const { minerAddressError, stratumError } = await import("./btc-miners");
    const bad =
      stratumError(String(data.config?.stratum ?? "")) ??
      stratumError(String(data.config?.backup ?? "")) ??
      minerAddressError(String(data.config?.address ?? ""));
    if (bad) {
      return { ok: false as const, error: bad, scope, config: null, view: null };
    }
    const { saveMinerConfig, minerStatsView } = await import("./btc-miners.server");
    const config = saveMinerConfig(scope, data.config ?? {});
    const view = await minerStatsView(config.address);
    return { ok: true as const, error: null as string | null, scope, config, view };
  });
