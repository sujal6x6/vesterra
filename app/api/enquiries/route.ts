import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { enquiries, siteSettings } from "@/db/schema";
import { consumeRateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { readJsonObject } from "@/lib/request-json";

type Integrations = {
  crmEnabled?:boolean; crmWebhookUrl?:string; crmApiToken?:string; crmProvider?:string; crmLeadSource?:string;
  metaPixelId?:string; metaAccessToken?:string; metaConversionsEnabled?:boolean; metaTestEventCode?:string;
};

export async function POST(request: Request) {
  const body = await readJsonObject(request);
  if (!body || body.website) return Response.json({ ok: true });
  const rate = await consumeRateLimit(request,"enquiry",5,10*60);
  if (!rate.allowed) return rateLimitResponse(rate.retryAfter);
  const name = clean(body.name, 120);
  const phone = clean(body.phone, 40);
  const interest = clean(body.interest, 80) || "General enquiry";
  const message = clean(body.message, 1000);
  if (!name || !phone) return Response.json({ error: "Name and phone are required." }, { status: 400 });
  const db = getDb();
  await db.insert(enquiries).values({ name, phone, interest, message });
  const rows = await db.select().from(siteSettings).where(eq(siteSettings.id, "site")).limit(1);
  const stored:unknown = rows[0]?.data ? JSON.parse(rows[0].data) : {};
  const integrations = integrationSettings(stored);
  const lead = { name, phone, interest, message, source: integrations.crmLeadSource || "Vesterra website", createdAt: new Date().toISOString() };
  await Promise.allSettled([
    sendToCrm(integrations, lead),
    sendToMeta(integrations, lead, request.url),
  ]);
  return Response.json({ ok: true }, { status: 201 });
}

function clean(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

async function sendToCrm(integrations: Integrations, lead: Record<string, string>) {
  if (!integrations.crmEnabled) return;
  const url = safeHttpsUrl(integrations.crmWebhookUrl);
  if (!url) return;
  const headers: Record<string, string> = { "content-type": "application/json", "x-vesterra-event": "lead.created" };
  if (integrations.crmApiToken) headers.authorization = `Bearer ${String(integrations.crmApiToken).slice(0, 1000)}`;
  await fetch(url, { method: "POST", headers, body: JSON.stringify({ event: "lead.created", provider: integrations.crmProvider || "Custom webhook", lead }), signal: AbortSignal.timeout(5000) });
}

async function sendToMeta(integrations: Integrations, lead: Record<string, string>, sourceUrl: string) {
  const pixelId = String(integrations.metaPixelId || "").replace(/\D/g, "");
  const token = String(integrations.metaAccessToken || "");
  if (!integrations.metaConversionsEnabled || !pixelId || !token) return;
  const phoneHash = await sha256(lead.phone.replace(/\D/g, ""));
  const payload: Record<string, unknown> = {
    data: [{
      event_name: "Lead",
      event_time: Math.floor(Date.now() / 1000),
      action_source: "website",
      event_source_url: sourceUrl,
      user_data: { ph: [phoneHash] },
      custom_data: { content_name: lead.interest, lead_source: lead.source },
    }],
    access_token: token,
  };
  if (integrations.metaTestEventCode) payload.test_event_code = String(integrations.metaTestEventCode).slice(0, 100);
  await fetch(`https://graph.facebook.com/${pixelId}/events`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload), signal: AbortSignal.timeout(5000) });
}

function integrationSettings(value:unknown):Integrations {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const integrations = (value as Record<string,unknown>).integrations;
  return integrations && typeof integrations === "object" && !Array.isArray(integrations) ? integrations as Integrations : {};
}

function safeHttpsUrl(value: unknown) {
  try {
    const url = new URL(String(value || ""));
    return url.protocol === "https:" ? url.toString() : "";
  } catch { return ""; }
}

async function sha256(value: string) {
  const bytes = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return [...new Uint8Array(bytes)].map(byte => byte.toString(16).padStart(2, "0")).join("");
}
