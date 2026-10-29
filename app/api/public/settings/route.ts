import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { siteSettings } from "@/db/schema";
import { siteDefaults } from "@/lib/site-defaults";
import { deepMerge } from "@/lib/deep-merge";
import { isJsonObject } from "@/lib/request-json";

export const dynamic = "force-dynamic";

export async function GET() {
  const rows = await getDb().select().from(siteSettings).where(eq(siteSettings.id, "site")).limit(1);
  const parsed:unknown = rows[0]?.data ? JSON.parse(rows[0].data) : {};
  const saved = isJsonObject(parsed) ? parsed : {};
  const merged = deepMerge(siteDefaults, saved);
  if (merged.hero.title === "Spaces Today.\nGreater Tomorrows.") merged.hero.title = siteDefaults.hero.title;
  if (merged.hero.lead === "Vesterra Group brings together considered spaces, thoughtful experiences and enduring investments — shaping a better tomorrow for people, communities and generations.") merged.hero.lead = siteDefaults.hero.lead;
  if (merged.seo.ogImage === "/assets/properties/vesterra-hero-courtyard.png") merged.seo.ogImage = "/assets/properties/vesterra-hero-courtyard.webp";
  const settings = {
    hero: merged.hero,
    contact: merged.contact,
    social: merged.social,
    seo: merged.seo,
    integrations: {
      metaPixelEnabled: Boolean(merged.integrations?.metaPixelEnabled),
      metaPixelId: String(merged.integrations?.metaPixelId || ""),
    },
  };
  return Response.json({ settings }, { headers: { "cache-control": "no-store" } });
}
