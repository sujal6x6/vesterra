import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { siteSettings } from "@/db/schema";

export type RateLimitResult = { allowed:boolean; retryAfter:number };

export async function consumeRateLimit(request:Request, scope:string, limit:number, windowSeconds:number):Promise<RateLimitResult> {
  const address = clientAddress(request);
  if (!address) return { allowed:true, retryAfter:0 };
  const now = Math.floor(Date.now() / 1000);
  const id = `rate:${scope}:${await digest(address)}`;
  const db = getDb();
  const row = (await db.select({ data:siteSettings.data }).from(siteSettings).where(eq(siteSettings.id,id)).limit(1))[0];
  let state = parseState(row?.data);
  if (!state || state.resetAt <= now) state = { count:0, resetAt:now + windowSeconds };
  if (state.count >= limit) return { allowed:false, retryAfter:Math.max(1,state.resetAt-now) };
  state.count += 1;
  const data = JSON.stringify(state);
  await db.insert(siteSettings).values({ id, data }).onConflictDoUpdate({ target:siteSettings.id, set:{ data, updatedAt:new Date().toISOString() } });
  return { allowed:true, retryAfter:0 };
}

export function rateLimitResponse(retryAfter:number) {
  return Response.json({ error:"Too many requests. Please try again later." },{ status:429, headers:{ "retry-after":String(retryAfter) } });
}

function clientAddress(request:Request) {
  return request.headers.get("cf-connecting-ip") || request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "";
}

function parseState(value?:string) {
  try {
    const parsed = JSON.parse(value || "") as { count?:unknown; resetAt?:unknown };
    return Number.isFinite(parsed.count) && Number.isFinite(parsed.resetAt)
      ? { count:Number(parsed.count), resetAt:Number(parsed.resetAt) }
      : null;
  } catch { return null; }
}

async function digest(value:string) {
  const bytes = await crypto.subtle.digest("SHA-256",new TextEncoder().encode(value));
  return [...new Uint8Array(bytes)].slice(0,16).map((byte)=>byte.toString(16).padStart(2,"0")).join("");
}
