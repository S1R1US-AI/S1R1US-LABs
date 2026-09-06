import { createRootRoute, HeadContent, Outlet, Scripts, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AuthProvider } from "@/lib/auth/provider";
import { MatrixSaver } from "@/components/matrix-saver";
import { PracticeEngine } from "@/components/practice-engine";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import appCss from "../styles.css?url";

import { SEO_DESCRIPTION, SEO_KEYWORDS, SEO_TITLE } from "@/lib/brand";
import { xBannerAbsUrl } from "@/lib/og/public-host";

export const Route = createRootRoute({
  head: () => {
    const xBanner = xBannerAbsUrl();
    return {
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: SEO_TITLE },
      { name: "description", content: SEO_DESCRIPTION },
      { name: "keywords", content: SEO_KEYWORDS },
      { name: "robots", content: "index,follow" },
      { name: "author", content: "S1R1US Labs" },
      { name: "theme-color", content: "#000000" },
      ...(xBanner ? [{ property: "x:game:image", content: xBanner }] : []),
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg?v=gz1" },
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/__grok/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/__grok/icon-180.png" },
      { rel: "sitemap", type: "application/xml", href: "/sitemap.xml" },
      { rel: "alternate", type: "text/plain", href: "/llms.txt", title: "llms.txt" },
      { rel: "alternate", type: "application/json", href: "/api/agent/call", title: "Bot 7 agent feed" },
      { rel: "preconnect", href: "https://fonts.bunny.net", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.bunny.net/css?family=ibm-plex-sans:400,500,600,400i|ibm-plex-mono:400,500,600,700&display=swap",
      },
    ],
    };
  },
  component: () => (
    <html lang="en" className="antialiased" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="bg-bg font-sans text-fg">
        <PreviewHostBridge />
        <AuthProvider>
          <Outlet />
        </AuthProvider>
        <DeskChrome />
        <Scripts />
      </body>
    </html>
  ),
});

function publicHost(host: string) {
  const h = host.split(":")[0]?.toLowerCase() ?? "";
  return h === "s1r1us.ai" || h === "www.s1r1us.ai";
}

function DeskChrome() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [host, setHost] = useState("");
  useEffect(() => setHost(window.location.hostname), []);
  if (path.startsWith("/s1r1us") || path.startsWith("/renew") || path.startsWith("/login") || publicHost(host)) return null;
  return (
    <>
      <MatrixSaver />
      <PracticeEngine />
    </>
  );
}
