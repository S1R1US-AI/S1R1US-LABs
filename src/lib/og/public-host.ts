/** Hostname suitable for absolute og / x-banner URLs. Skip Vercel system hosts. */
export function publicAppHost(hostHeader?: string): string {
  const host = String(hostHeader ?? "")
    .split(",")[0]
    .trim()
    .split(":")[0]
    .toLowerCase();
  if (!host || !/^[a-z0-9.-]+$/.test(host) || !host.includes(".")) return "";
  if (/^\\d{1,3}(?:\\.\\d{1,3}){3}$/.test(host)) return "";
  if (
    host === "vercel.app" ||
    host.endsWith(".vercel.app") ||
    host === "vercel.com" ||
    host.endsWith(".vercel.com")
  ) {
    return "";
  }
  return host;
}

export function resolvePublicHost(hostHeader?: string): string {
  const envHost =
    typeof process !== "undefined" ? String(process.env?.VITE_PUBLIC_HOSTNAME ?? "") : "";
  return publicAppHost(envHost) || publicAppHost(hostHeader);
}

/** Absolute X feed banner URL, same host guard as og:image. */
export function xBannerAbsUrl(hostHeader?: string): string | undefined {
  const host = resolvePublicHost(hostHeader);
  if (!host) return undefined;
  return `https://${host}/x-banner.jpg`;
}
