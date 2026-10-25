import { and, desc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { properties } from "@/db/schema";

export const dynamic = "force-dynamic";

export async function GET(request:Request) {
  const url = new URL(request.url); const featured = url.searchParams.get("featured")==="1";
  const rows = await getDb().select().from(properties).where(featured ? and(eq(properties.published,true),eq(properties.featured,true)) : eq(properties.published,true)).orderBy(desc(properties.createdAt));
  return Response.json({ properties: featured ? rows.slice(0,6) : rows }, { headers:{"cache-control":"no-store"} });
}
