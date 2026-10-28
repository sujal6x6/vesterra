import { adminAuthConfigured, adminSessionCookie, createAdminSession, verifyAdminPassword } from "@/lib/admin-session";
import { consumeRateLimit, rateLimitResponse } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

export async function POST(request:Request) {
  if (!adminAuthConfigured()) return Response.json({error:"Admin login is not configured."},{status:503});
  const rate = await consumeRateLimit(request,"admin-login",8,15*60);
  if (!rate.allowed) return rateLimitResponse(rate.retryAfter);
  const form = await request.formData();
  const password = String(form.get("password") || "");
  const returnTo = safeReturn(String(form.get("return_to") || "/admin"));
  if (!await verifyAdminPassword(password)) return Response.redirect(new URL(`/admin/login?error=1&return_to=${encodeURIComponent(returnTo)}`,request.url),303);
  return new Response(null,{
    status:303,
    headers:{
      location:new URL(returnTo,request.url).toString(),
      "set-cookie":adminSessionCookie(await createAdminSession()),
    },
  });
}

function safeReturn(value:string) { return value.startsWith("/") && !value.startsWith("//") ? value : "/admin"; }
