import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { reviews } from "@/db/schema";
import { requireAdminApi } from "@/lib/admin-auth";

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const auth = await requireAdminApi(); if (auth.error) return auth.error;
  const { id } = await context.params; const body = await request.json().catch(() => ({}));
  const patch: { status?: string; verified?: boolean } = {};
  if (["pending", "approved", "rejected"].includes(body.status)) patch.status = body.status;
  if (typeof body.verified === "boolean") patch.verified = body.verified;
  await getDb().update(reviews).set(patch).where(eq(reviews.id, Number(id)));
  return Response.json({ ok: true });
}
export async function DELETE(_: Request, context: { params: Promise<{ id: string }> }) {
  const auth = await requireAdminApi(); if (auth.error) return auth.error;
  const { id } = await context.params; await getDb().delete(reviews).where(eq(reviews.id, Number(id)));
  return Response.json({ ok: true });
}
