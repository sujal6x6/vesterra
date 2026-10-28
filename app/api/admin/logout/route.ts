import { clearAdminSessionCookie } from "@/lib/admin-session";

export async function GET(request:Request) {
  const url = new URL(request.url);
  const requested = url.searchParams.get("return_to") || "/";
  const returnTo = requested.startsWith("/") && !requested.startsWith("//") ? requested : "/";
  const response = Response.redirect(new URL(returnTo,request.url),303);
  response.headers.append("set-cookie",clearAdminSessionCookie());
  return response;
}
