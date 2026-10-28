import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { siteSettings } from "@/db/schema";
import { requireAdminApi } from "@/lib/admin-auth";
import { siteDefaults } from "@/lib/site-defaults";
import { isJsonObject, readJsonObject } from "@/lib/request-json";
import { deepMerge } from "@/lib/deep-merge";

export const dynamic = "force-dynamic";

export async function GET() {
  const auth = await requireAdminApi();
  if (auth.error) return auth.error;
  const rows = await getDb().select().from(siteSettings).where(eq(siteSettings.id, "site")).limit(1);
  return Response.json({ settings: rows[0]?.data ? deepMerge(siteDefaults, JSON.parse(rows[0].data)) : siteDefaults });
}

export async function PUT(request: Request) {
  const auth = await requireAdminApi();
  if (auth.error) return auth.error;
  const body = await readJsonObject(request);
  if (!body || !isJsonObject(body.settings)) return Response.json({ error: "Invalid settings." }, { status: 400 });
  const settings = body.settings;
  const data = JSON.stringify(settings).slice(0, 50000);
  await getDb().insert(siteSettings).values({ id: "site", data }).onConflictDoUpdate({
    target: siteSettings.id,
    set: { data, updatedAt: new Date().toISOString() },
  });
  return Response.json({ settings });
}
