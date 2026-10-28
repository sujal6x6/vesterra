import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { gallery } from "@/db/schema";
import { requireAdminApi } from "@/lib/admin-auth";
import { readJsonObject } from "@/lib/request-json";

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const auth = await requireAdminApi(); if (auth.error) return auth.error;
  const { id } = await context.params; const body = await readJsonObject(request) ?? {};
  const patch: { published?: boolean; title?: string; caption?: string; position?: number } = {};
  if (typeof body.published === "boolean") patch.published = body.published;
  if (typeof body.title === "string") patch.title = body.title.slice(0,160);
  if (typeof body.caption === "string") patch.caption = body.caption.slice(0,500);
  if (typeof body.position === "number" && Number.isFinite(body.position)) patch.position = body.position;
  await getDb().update(gallery).set(patch).where(eq(gallery.id, Number(id)));
  return Response.json({ ok: true });
}
export async function DELETE(_: Request, context: { params: Promise<{ id: string }> }) {
  const auth = await requireAdminApi(); if (auth.error) return auth.error;
  const { id } = await context.params; await getDb().delete(gallery).where(eq(gallery.id, Number(id)));
  return Response.json({ ok: true });
}
