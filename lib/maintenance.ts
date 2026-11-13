import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { siteSettings } from "@/db/schema";

const id = "maintenance";

export async function getMaintenanceMode() {
  const [row] = await getDb().select({ data: siteSettings.data })
    .from(siteSettings).where(eq(siteSettings.id, id)).limit(1);
  return row?.data === "true";
}

export async function setMaintenanceMode(enabled: boolean) {
  const data = JSON.stringify(enabled);
  await getDb().insert(siteSettings).values({ id, data }).onConflictDoUpdate({
    target: siteSettings.id,
    set: { data, updatedAt: new Date().toISOString() },
  });
}
