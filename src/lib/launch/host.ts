import { createServerFn } from "@tanstack/react-start";

function marketingFromHost(host: string) {
  const h = host.split(":")[0]?.toLowerCase() ?? "";
  return h === "s1r1us.ai" || h === "www.s1r1us.ai";
}

export const isMarketingHost = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const { getRequestHost, getRequestHeader } = await import("@tanstack/start-server-core");
    const forwarded = (getRequestHeader("x-forwarded-host") ?? "").split(",")[0]?.trim() ?? "";
    const host = (forwarded || getRequestHost({ xForwardedHost: true })).split(":")[0] ?? "";
    return { host, marketing: marketingFromHost(host) };
  } catch {
    return { host: "", marketing: false };
  }
});
