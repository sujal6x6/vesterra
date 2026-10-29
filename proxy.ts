import { NextResponse, type NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const hostname = request.nextUrl.hostname.toLowerCase();
  const apexHostname = hostname.startsWith("www.") ? hostname.slice(4) : "";
  const isSupportedApexDomain =
    apexHostname === "vesterragroup.in" || apexHostname === "vesterragroup.com";

  if (isSupportedApexDomain) {
    const canonicalUrl = request.nextUrl.clone();
    canonicalUrl.hostname = apexHostname;
    canonicalUrl.protocol = "https:";
    canonicalUrl.port = "";
    return NextResponse.redirect(canonicalUrl, 308);
  }

  const response = NextResponse.next();
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "SAMEORIGIN");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  if (request.nextUrl.protocol === "https:") {
    response.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  }
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|assets/|favicon.svg|styles.css|theme.css|polish.css|home-editorial.css|main.js).*)"],
};
