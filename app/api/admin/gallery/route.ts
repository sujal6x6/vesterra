import { asc } from "drizzle-orm";
import { getDb } from "@/db";
import { gallery } from "@/db/schema";
import { requireAdminApi } from "@/lib/admin-auth";
import { readJsonObject } from "@/lib/request-json";

export const dynamic = "force-dynamic";
export async function GET() {
  const auth = await requireAdminApi(); if (auth.error) return auth.error;
  return Response.json({ items: await getDb().select().from(gallery).orderBy(asc(gallery.position), asc(gallery.id)) });
}
export async function POST(request: Request) {
  const auth = await requireAdminApi(); if (auth.error) return auth.error;
  const body = await readJsonObject(request);
  if (!body) return Response.json({ error: "Invalid media item." }, { status:400 });
  const url = typeof body?.url === "string" ? body.url.trim() : "";
  const type = body.type === "video" ? "video" : "image";
  const validUrl = /^https:\/\//i.test(url) || (type === "image" && /^\/api\/media\/[0-9a-f-]{36}$/i.test(url));
  if (!validUrl) return Response.json({ error: type === "image" ? "Upload an image first." : "Use a valid HTTPS video URL." }, { status: 400 });
  await getDb().insert(gallery).values({ url, type, title: String(body.title || "").slice(0,160), caption: String(body.caption || "").slice(0,500), published: body.published !== false, position: Number(body.position) || 0 });
  return Response.json({ ok: true }, { status: 201 });
}
