import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { properties } from "@/db/schema";
import { requireAdminApi } from "@/lib/admin-auth";
import { toValues } from "../route";
import { readJsonObject } from "@/lib/request-json";

export async function PATCH(request: Request, context: { params: Promise<{ id:string }> }) {
  const auth = await requireAdminApi(); if (auth.error) return auth.error;
  const { id } = await context.params; const body = await readJsonObject(request);
  if (!body) return Response.json({ error: "Invalid property." }, { status: 400 });
  const values = toValues(body);
  if (!values.title || !values.location || !values.slug) return Response.json({ error: "Title, location and URL slug are required." }, { status: 400 });
  try {
    await getDb().update(properties).set({ ...values, updatedAt:new Date().toISOString() }).where(eq(properties.id, Number(id)));
    return Response.json({ ok:true });
  } catch (error) {
    if (String(error).toLowerCase().includes("unique")) return Response.json({ error:"That property URL is already in use." }, { status:409 });
    throw error;
  }
}

export async function DELETE(_:Request, context:{ params:Promise<{id:string}> }) {
  const auth = await requireAdminApi(); if (auth.error) return auth.error;
  const { id } = await context.params; await getDb().delete(properties).where(eq(properties.id, Number(id))); return Response.json({ ok:true });
}
