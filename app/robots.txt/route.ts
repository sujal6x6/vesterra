import { getSiteSettings, normaliseSiteUrl } from "@/lib/site-settings";

export const dynamic = "force-dynamic";

export async function GET() {
  const { seo } = await getSiteSettings();
  const siteUrl = normaliseSiteUrl(seo.siteUrl);
  const rules = seo.robotsIndex
    ? `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api/\n`
    : `User-agent: *\nDisallow: /\n`;
  const sitemap = seo.sitemapEnabled ? `Sitemap: ${siteUrl}/sitemap.xml\n` : "";
  return new Response(`${rules}${sitemap}`, { headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store" } });
}
