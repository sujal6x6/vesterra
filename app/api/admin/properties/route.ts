import { desc } from "drizzle-orm";
import { getDb } from "@/db";
import { properties } from "@/db/schema";
import { requireAdminApi } from "@/lib/admin-auth";
import { readJsonObject, type JsonObject } from "@/lib/request-json";

export const dynamic = "force-dynamic";

export async function GET() {
  const auth = await requireAdminApi(); if (auth.error) return auth.error;
  return Response.json({ properties: await getDb().select().from(properties).orderBy(desc(properties.createdAt)) });
}

export async function POST(request: Request) {
  const auth = await requireAdminApi(); if (auth.error) return auth.error;
  const body = await readJsonObject(request);
  if (!body) return Response.json({ error: "Invalid property." }, { status:400 });
  const title = clean(body?.title, 160); const location = clean(body?.location, 160);
  if (!title || !location) return Response.json({ error: "Title and location are required." }, { status: 400 });
  const slug = slugify(clean(body?.slug, 180) || title);
  if (!slug) return Response.json({ error: "A valid property slug is required." }, { status: 400 });
  try {
    await getDb().insert(properties).values(toValues(body, { title, location, slug }));
    return Response.json({ ok: true }, { status: 201 });
  } catch (error) {
    if (String(error).toLowerCase().includes("unique")) return Response.json({ error: "That property URL is already in use." }, { status: 409 });
    throw error;
  }
}

export function clean(value: unknown, max: number) { return typeof value === "string" ? value.trim().slice(0, max) : ""; }
export function slugify(value: string) { return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 160); }
export function toValues(body: JsonObject, fixed?: { title:string; location:string; slug:string }) {
  return {
    title: fixed?.title ?? clean(body.title, 160), slug: fixed?.slug ?? slugify(clean(body.slug, 180) || clean(body.title, 160)), location: fixed?.location ?? clean(body.location, 160),
    propertyType: clean(body.propertyType, 80) || "Residential", price: clean(body.price, 80) || "Price on request",
    bedrooms: Math.max(0, Number(body.bedrooms) || 0), bathrooms: Math.max(0, Number(body.bathrooms) || 0), area: clean(body.area, 80),
    imageUrl: clean(body.imageUrl, 1000), description: clean(body.description, 5000), status: clean(body.status, 50) || "Available",
    featured: body.featured === true || body.featured === "on", published: body.published !== false,
  };
}
