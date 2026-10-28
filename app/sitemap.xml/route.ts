import { desc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { properties } from "@/db/schema";
import { getSiteSettings, normaliseSiteUrl } from "@/lib/site-settings";
import { propertyImageFor } from "@/lib/property-images";

export const dynamic = "force-dynamic";

const escapeXml = (value:string) => value.replace(/[<>&'\"]/g, (char) => ({"<":"&lt;",">":"&gt;","&":"&amp;","'":"&apos;",'"':"&quot;"}[char] || char));

export async function GET() {
  const { seo } = await getSiteSettings();
  if (!seo.sitemapEnabled) return new Response("Sitemap disabled", { status: 404 });
  const siteUrl = normaliseSiteUrl(seo.siteUrl);
  const rows = await getDb().select().from(properties).where(eq(properties.published, true)).orderBy(desc(properties.updatedAt));
  const staticPages = ["", "/about", "/services", "/properties", "/contact"];
  const urls = [
    ...staticPages.map((path) => `<url><loc>${escapeXml(siteUrl + path)}</loc><changefreq>${path === "" ? "weekly" : "monthly"}</changefreq><priority>${path === "" ? "1.0" : path === "/properties" ? "0.9" : "0.7"}</priority></url>`),
    ...rows.map((property) => {
      const image = propertyImageFor(property);
      const imageXml = seo.includePropertyImages && image ? `<image:image><image:loc>${escapeXml(new URL(image, siteUrl).toString())}</image:loc><image:title>${escapeXml(property.title)}</image:title></image:image>` : "";
      return `<url><loc>${escapeXml(`${siteUrl}/property/${property.slug}`)}</loc><lastmod>${new Date(property.updatedAt).toISOString()}</lastmod><changefreq>weekly</changefreq><priority>0.8</priority>${imageXml}</url>`;
    }),
  ].join("");
  const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">${urls}</urlset>`;
  return new Response(xml, { headers: { "content-type": "application/xml; charset=utf-8", "cache-control": "no-store" } });
}
