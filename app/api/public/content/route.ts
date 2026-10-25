import { asc, desc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { gallery, reviews } from "@/db/schema";

export const dynamic = "force-dynamic";

export async function GET() {
  const db = getDb();
  const [reviewRows, galleryRows] = await Promise.all([
    db.select({ id:reviews.id, name:reviews.name, rating:reviews.rating, title:reviews.title, message:reviews.message, verified:reviews.verified, createdAt:reviews.createdAt }).from(reviews).where(eq(reviews.status, "approved")).orderBy(desc(reviews.createdAt)),
    db.select({ id:gallery.id, type:gallery.type, url:gallery.url, title:gallery.title, caption:gallery.caption }).from(gallery).where(eq(gallery.published, true)).orderBy(asc(gallery.position), asc(gallery.id)),
  ]);
  return Response.json({ reviews: reviewRows, gallery: galleryRows }, { headers: { "cache-control": "no-store" } });
}
