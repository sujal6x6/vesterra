import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { siteSettings } from "@/db/schema";
import { siteDefaults } from "@/lib/site-defaults";

export async function getSiteSettings() {
  try {
    const rows = await getDb().select().from(siteSettings).where(eq(siteSettings.id, "site")).limit(1);
    const saved = rows[0]?.data ? JSON.parse(rows[0].data) : {};
    return deepMerge(siteDefaults, saved) as typeof siteDefaults;
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

function deepMerge(base: Record<string, any>, saved: Record<string, any>) {
  const result = { ...base };
  for (const [key, value] of Object.entries(saved || {})) {
    result[key] = value && typeof value === "object" && !Array.isArray(value)
      ? deepMerge((base[key] as Record<string, any>) || {}, value as Record<string, any>)
      : value;
  }
  return result;
}
