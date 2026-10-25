import { desc } from "drizzle-orm";
import { getDb } from "@/db";
import { enquiries } from "@/db/schema";
import { requireAdminApi } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const auth = await requireAdminApi();
  if (auth.error) return auth.error;
  return Response.json({ enquiries: await getDb().select().from(enquiries).orderBy(desc(enquiries.createdAt)) });
}
