import { desc } from "drizzle-orm";
import { getDb } from "@/db";
import { reviews } from "@/db/schema";
import { requireAdminApi } from "@/lib/admin-auth";
import { readJsonObject } from "@/lib/request-json";

export const dynamic = "force-dynamic";

export async function GET() {
  const auth = await requireAdminApi(); if (auth.error) return auth.error;
  return Response.json({ reviews: await getDb().select().from(reviews).orderBy(desc(reviews.createdAt)) });
}

export async function POST(request: Request) {
  const auth = await requireAdminApi(); if (auth.error) return auth.error;
  const body = await readJsonObject(request);
  if (!body?.name || !body?.message) return Response.json({ error: "Name and review are required." }, { status: 400 });
  await getDb().insert(reviews).values({ name: String(body.name).slice(0,120), title: String(body.title || "").slice(0,160), message: String(body.message).slice(0,2000), rating: Math.max(1, Math.min(5, Number(body.rating) || 5)), status: body.status === "approved" ? "approved" : "pending" });
  return Response.json({ ok: true }, { status: 201 });
}
