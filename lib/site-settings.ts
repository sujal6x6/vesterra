import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { siteSettings } from "@/db/schema";
import { siteDefaults } from "@/lib/site-defaults";
import { deepMerge } from "@/lib/deep-merge";
import { isJsonObject } from "@/lib/request-json";

export async function getSiteSettings() {
  try {
    const rows = await getDb().select().from(siteSettings).where(eq(siteSettings.id, "site")).limit(1);
    const parsed:unknown = rows[0]?.data ? JSON.parse(rows[0].data) : {};
    const merged = deepMerge(siteDefaults,isJsonObject(parsed) ? parsed : {});
    if (merged.seo.ogImage === "/assets/properties/vesterra-hero-courtyard.png") merged.seo.ogImage = "/assets/properties/vesterra-hero-courtyard.webp";
    return merged;
  } catch {
    return siteDefaults;
  }
}

export function absoluteSiteUrl(value: string, siteUrl: string) {
  try { return new URL(value || "/", normaliseSiteUrl(siteUrl)).toString(); }
  catch { return new URL(value || "/", siteDefaults.seo.siteUrl).toString(); }
}

export function normaliseSiteUrl(value: string) {
  const fallback = siteDefaults.seo.siteUrl;
  try { return new URL(value || fallback).origin; }
  catch { return fallback; }
}
