import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { enquiries } from "@/db/schema";
import { requireAdminApi } from "@/lib/admin-auth";
import { readJsonObject } from "@/lib/request-json";

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const auth = await requireAdminApi(); if (auth.error) return auth.error;
  const { id } = await context.params; const numericId = Number(id);
  const body = await readJsonObject(request) ?? {};
  const patch: { status?: string; note?: string } = {};
  if (typeof body.status === "string" && ["new", "contacted", "closed"].includes(body.status)) patch.status = body.status;
  if (typeof body.note === "string") patch.note = body.note.trim().slice(0, 1000);
  await getDb().update(enquiries).set(patch).where(eq(enquiries.id, numericId));
  return Response.json({ ok: true });
}

export async function DELETE(_: Request, context: { params: Promise<{ id: string }> }) {
  const auth = await requireAdminApi(); if (auth.error) return auth.error;
  const { id } = await context.params;
  await getDb().delete(enquiries).where(eq(enquiries.id, Number(id)));
  return Response.json({ ok: true });
}
