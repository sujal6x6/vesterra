import { adminAuthConfigured, adminSessionCookie, createAdminSession, verifyAdminPassword } from "@/lib/admin-session";

export const dynamic = "force-dynamic";

export async function POST(request:Request) {
  if (!adminAuthConfigured()) return Response.json({error:"Admin login is not configured."},{status:503});
  const form = await request.formData();
  const password = String(form.get("password") || "");
  const returnTo = safeReturn(String(form.get("return_to") || "/admin"));
  if (!await verifyAdminPassword(password)) return Response.redirect(new URL(`/admin/login?error=1&return_to=${encodeURIComponent(returnTo)}`,request.url),303);
  const response = Response.redirect(new URL(returnTo,request.url),303);
  response.headers.append("set-cookie",adminSessionCookie(await createAdminSession()));
  return response;
}

function safeReturn(value:string) { return value.startsWith("/") && !value.startsWith("//") ? value : "/admin"; }
