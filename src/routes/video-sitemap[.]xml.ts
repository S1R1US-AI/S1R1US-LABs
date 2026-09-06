import { createFileRoute } from "@tanstack/react-router";
import { SEO_CANONICAL } from "@/lib/brand";
import { OFFICIAL_PROPERTIES } from "@/lib/desk/official-presence";
import { VIDEO_CLIPS } from "@/lib/desk/video-library";

function xml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function videoSitemapXml() {
  const origin = SEO_CANONICAL.replace(/\/$/, "");
  const reserved = OFFICIAL_PROPERTIES.filter((p) => !p.live && (p.kind === "youtube" || p.kind === "rumble" || p.kind === "tiktok"));
  const comment = reserved.map((p) => `${p.name} reserved ${p.url}`).join("; ");
  const clips = VIDEO_CLIPS.map(
    (v) => `  <url>
    <loc>${origin}/media</loc>
    <video:video>
      <video:content_loc>${origin}${v.href}</video:content_loc>
      <video:player_loc>${origin}/media#${v.id}</video:player_loc>
      <video:title>${xml(v.title)}</video:title>
      <video:description>${xml(v.seo)}</video:description>
      <video:thumbnail_loc>${origin}/s1r1us-godzilla-logo.jpg</video:thumbnail_loc>
      <video:duration>${v.durationSec}</video:duration>
      <video:family_friendly>yes</video:family_friendly>
      <video:live>no</video:live>
      <video:requires_subscription>no</video:requires_subscription>
      <video:publication_date>2026-09-06</video:publication_date>
      <video:tag>AI Trading Bot Cost</video:tag>
      <video:tag>AI agents</video:tag>
      <video:tag>bitcoin accumulation agent</video:tag>
    </video:video>
  </url>`,
  ).join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<!-- ${comment}. Hosted AI Trading Bot Cost library on /media. -->
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
  <url>
    <loc>${origin}/media</loc>
    <lastmod>2026-09-06</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
${clips}
</urlset>
`;
}

export const Route = createFileRoute("/video-sitemap.xml")({
  server: {
    handlers: {
      GET: () =>
        new Response(videoSitemapXml(), {
          headers: {
            "content-type": "application/xml; charset=utf-8",
            "cache-control": "public, max-age=300",
          },
        }),
    },
  },
});
