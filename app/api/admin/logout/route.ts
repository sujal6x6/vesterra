import { clearAdminSessionCookie } from "@/lib/admin-session";

export async function GET(request:Request) {
  const url = new URL(request.url);
  const requested = url.searchParams.get("return_to") || "/";
  const returnTo = requested.startsWith("/") && !requested.startsWith("//") ? requested : "/";
  return new Response(null,{
    status:303,
    headers:{
      location:new URL(returnTo,request.url).toString(),
      "set-cookie":clearAdminSessionCookie(),
    },
  });
}
