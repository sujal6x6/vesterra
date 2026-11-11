import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { siteSettings } from "@/db/schema";
import { requireAdminApi } from "@/lib/admin-auth";
import { siteDefaults } from "@/lib/site-defaults";
import { deepMerge } from "@/lib/deep-merge";
import { isJsonObject, readJsonObject } from "@/lib/request-json";

export const dynamic = "force-dynamic";

export async function GET() {
  const auth = await requireAdminApi();
  if (auth.error) return auth.error;
  const rows = await getDb().select().from(siteSettings).where(eq(siteSettings.id, "site")).limit(1);
  const saved: unknown = rows[0]?.data ? JSON.parse(rows[0].data) : {};
  const settings = deepMerge(siteDefaults, isJsonObject(saved) ? saved : {});
  return Response.json({ maintenance: settings.maintenance });
}

export async function PUT(request: Request) {
  const auth = await requireAdminApi();
  if (auth.error) return auth.error;
  const body = await readJsonObject(request);
  if (!body || !isJsonObject(body.maintenance) || typeof body.maintenance.enabled !== "boolean") {
    return Response.json({ error: "Invalid maintenance settings." }, { status: 400 });
  }
  const rows = await getDb().select().from(siteSettings).where(eq(siteSettings.id, "site")).limit(1);
  const saved: unknown = rows[0]?.data ? JSON.parse(rows[0].data) : {};
  const current = deepMerge(siteDefaults, isJsonObject(saved) ? saved : {});
  const settings = { ...current, maintenance: { ...current.maintenance, enabled: body.maintenance.enabled } };
  const data = JSON.stringify(settings).slice(0, 50000);
  await getDb().insert(siteSettings).values({ id: "site", data }).onConflictDoUpdate({
    target: siteSettings.id,
    set: { data, updatedAt: new Date().toISOString() },
  });
  return Response.json({ maintenance: settings.maintenance });
}
