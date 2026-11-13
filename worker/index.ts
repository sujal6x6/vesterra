import handler from "vinext/server/fetch-handler";
import { runWithConnectorBinding } from "../lib/connector-context";
import type { ConnectorBinding } from "../lib/connector-contract.mjs";

import { getMaintenanceMode } from "../lib/maintenance";
import maintenanceHtml from "./maintenance.html?raw";

const maintenanceBypass = /^(?:\/(?:admin|api\/admin|api\/media|assets|_next)(?:\/|$)|\/(?:signin-with-chatgpt|signout-with-chatgpt|callback|favicon\.svg)\/?$)/;

async function maintenanceResponse(request: Request, pathname: string) {
  if (maintenanceBypass.test(pathname)) return null;

  try {
    if (!await getMaintenanceMode()) return null;
  } catch (error) {
    console.error("Could not read maintenance mode", error);
    return null;
  }

  const api = pathname.startsWith("/api/");
  const headers = {
    "Cache-Control": "no-store",
    "Retry-After": "300",
    "Content-Type": api ? "application/json; charset=utf-8" : "text/html; charset=utf-8",
  };
  const body = api ? JSON.stringify({ error: "Website maintenance is in progress." }) : maintenanceHtml;
  return new Response(request.method === "HEAD" ? null : body, { status: 503, headers });
}

const worker = {
  async fetch(request: Request, env: Cloudflare.Env, ctx: ExecutionContext<{ CONNECTORS?: ConnectorBinding }>) {
    const url = new URL(request.url);
    const local = url.hostname === "localhost" || url.hostname === "127.0.0.1";
    if (!local && (url.protocol === "http:" || request.headers.get("x-forwarded-proto") === "http")) {
      url.protocol = "https:";
      return Response.redirect(url,308);
    }
    const maintenance = await maintenanceResponse(request, url.pathname);
    if (maintenance) {
      if (!local) applySecurityHeaders(maintenance.headers);
      return maintenance;
    }

    let binding = ctx.props?.CONNECTORS;
    // Local preview emulates the same request-scoped capability. This branch and
    // the auxiliary service binding are absent from production builds.
    if (import.meta.env.DEV && !binding && env.CONNECTORS) {
      const preview = env.CONNECTORS;
      const expiresAt = Date.now() + 60_000;
      binding = {
        async getContext() {
          if (Date.now() >= expiresAt) return { status: "request_context_expired" };
          return preview.getContext?.() ?? { status: "binding_unavailable" };
        },
        async invoke(connectorId, actionName, args) {
          if (Date.now() >= expiresAt) {
            return { status: "request_context_expired", message: "This request has expired. Please try again." };
          }
          return preview.invoke(connectorId, actionName, args);
        },
      };
    }
    const response = await runWithConnectorBinding(binding, () => handler.fetch(request, env, ctx));
    const secured = new Response(response.body,response);
    if (!local) applySecurityHeaders(secured.headers);
    return secured;
  },
};

function applySecurityHeaders(headers:Headers) {
  headers.set("strict-transport-security","max-age=31536000; includeSubDomains");
  headers.set("content-security-policy",[
    "default-src 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    "frame-ancestors 'none'",
    "form-action 'self'",
    "script-src 'self' 'unsafe-inline' https://connect.facebook.net",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self' data:",
    "connect-src 'self' https://graph.facebook.com https://www.facebook.com",
    "upgrade-insecure-requests",
  ].join("; "));
  headers.set("x-frame-options","DENY");
  headers.set("x-content-type-options","nosniff");
  headers.set("referrer-policy","strict-origin-when-cross-origin");
  headers.set("permissions-policy","camera=(), microphone=(), geolocation=(), payment=()");
  headers.set("cross-origin-opener-policy","same-origin");
}

export default worker;
