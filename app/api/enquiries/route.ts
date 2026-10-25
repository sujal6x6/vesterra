import { getDb } from "@/db";
import { enquiries } from "@/db/schema";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body || body.website) return Response.json({ ok: true });
  const name = clean(body.name, 120);
  const phone = clean(body.phone, 40);
  const interest = clean(body.interest, 80) || "General enquiry";
  const message = clean(body.message, 1000);
  if (!name || !phone) return Response.json({ error: "Name and phone are required." }, { status: 400 });
  await getDb().insert(enquiries).values({ name, phone, interest, message });
  return Response.json({ ok: true }, { status: 201 });
}

function clean(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}
