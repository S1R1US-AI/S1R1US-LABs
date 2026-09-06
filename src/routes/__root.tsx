import { createRootRoute, HeadContent, Outlet, Scripts, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AuthProvider } from "@/lib/auth/provider";
import { MatrixSaver } from "@/components/matrix-saver";
import { PracticeEngine } from "@/components/practice-engine";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import { WebMcpBridge } from "@/components/webmcp-bridge";
import appCss from "../styles.css?url";

import { SEO_DESCRIPTION, SEO_KEYWORDS, SEO_TITLE } from "@/lib/brand";
import { xBannerAbsUrl } from "@/lib/og/public-host";
import { liveMeLinks } from "@/lib/desk/official-presence";
import { COMPANY_X_HANDLE } from "@/lib/desk/x-admin";

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
      { name: "robots", content: "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1" },
      { name: "author", content: "S1R1US Labs" },
      { name: "theme-color", content: "#070908" },
      { name: "application-name", content: "S1R1US Labs" },
      { name: "apple-mobile-web-app-title", content: "S1R1US" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
      { name: "msapplication-TileColor", content: "#070908" },
      { name: "msapplication-TileImage", content: "/icon-192.png" },
      { name: "twitter:site", content: COMPANY_X_HANDLE },
      { name: "twitter:creator", content: COMPANY_X_HANDLE },
      ...(xBanner ? [{ property: "x:game:image", content: xBanner }] : []),
    ],
    links: [
      { rel: "icon", href: "/favicon.ico", sizes: "any" },
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg?v=gz2" },
      { rel: "icon", type: "image/png", sizes: "48x48", href: "/favicon-48.png" },
      { rel: "icon", type: "image/png", sizes: "192x192", href: "/icon-192.png" },
      { rel: "icon", type: "image/png", sizes: "512x512", href: "/icon-512.png" },
      { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" },
      { rel: "mask-icon", href: "/favicon.svg", color: "#3dff1a" },
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/manifest.webmanifest" },
      { rel: "manifest", href: "/__grok/manifest.webmanifest" },
      { rel: "sitemap", type: "application/xml", href: "/sitemap.xml" },
      { rel: "sitemap", type: "application/xml", href: "/sitemap-index.xml" },
      { rel: "alternate", type: "application/xml", href: "/video-sitemap.xml", title: "video sitemap" },
      { rel: "alternate", type: "application/json", href: "/entity.json", title: "organization entity" },
      { rel: "alternate", type: "text/plain", href: "/llms.txt", title: "llms.txt" },
      { rel: "alternate", type: "application/json", href: "/api/agent/call", title: "7-B0T agent feed" },
      { rel: "author", href: "/humans.txt" },
      ...liveMeLinks().map((href) => ({ rel: "me" as const, href })),
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
        <WebMcpBridge />
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
