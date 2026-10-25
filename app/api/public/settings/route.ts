import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { siteSettings } from "@/db/schema";
import { siteDefaults } from "@/lib/site-defaults";

export const dynamic = "force-dynamic";

export async function GET() {
  const rows = await getDb().select().from(siteSettings).where(eq(siteSettings.id, "site")).limit(1);
  const saved = rows[0]?.data ? JSON.parse(rows[0].data) : {};
  return Response.json({ settings: deepMerge(siteDefaults, saved) }, { headers: { "cache-control": "no-store" } });
}

function deepMerge(base: Record<string, any>, saved: Record<string, any>) {
  const result = { ...base };
  for (const [key, value] of Object.entries(saved || {})) {
    result[key] = value && typeof value === "object" && !Array.isArray(value)
      ? deepMerge((base[key] as Record<string, any>) || {}, value)
      : value;
  }
  return result;
}
