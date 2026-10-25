import { sql } from "drizzle-orm";
import { getDb } from "@/db";
import { enquiries, gallery, reviews } from "@/db/schema";
import { requireAdminApi } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const auth = await requireAdminApi();
  if (auth.error) return auth.error;
  const db = getDb();
  const [leadRows, reviewRows, galleryRows] = await Promise.all([
    db.select({ status: enquiries.status, count: sql<number>`count(*)` }).from(enquiries).groupBy(enquiries.status),
    db.select({ status: reviews.status, count: sql<number>`count(*)` }).from(reviews).groupBy(reviews.status),
    db.select({ count: sql<number>`count(*)` }).from(gallery),
  ]);
  const leads = Object.fromEntries(leadRows.map((row) => [row.status, Number(row.count)]));
  const reviewCounts = Object.fromEntries(reviewRows.map((row) => [row.status, Number(row.count)]));
  return Response.json({
    stats: {
      leadsNew: leads.new || 0,
      leadsTotal: Object.values(leads).reduce((a, b) => a + b, 0),
      reviewsPending: reviewCounts.pending || 0,
      reviewsPublished: reviewCounts.approved || 0,
      gallery: Number(galleryRows[0]?.count || 0),
    },
  });
}
