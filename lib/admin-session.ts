import { env } from "cloudflare:workers";

export const ADMIN_COOKIE = "vesterra_admin";
const SESSION_SECONDS = 8 * 60 * 60;

function runtimeValue(name:string) {
  return String((env as unknown as Record<string, unknown>)[name] || "");
}

export function adminAuthConfigured() {
  return Boolean(runtimeValue("ADMIN_PASSWORD") && runtimeValue("ADMIN_SESSION_SECRET"));
}

export async function verifyAdminPassword(password:string) {
  const expected = runtimeValue("ADMIN_PASSWORD");
  const secret = runtimeValue("ADMIN_SESSION_SECRET");
  if (!expected || !secret || !password) return false;
  const [providedDigest, expectedDigest] = await Promise.all([hmac(password, secret), hmac(expected, secret)]);
  return constantTimeEqual(providedDigest, expectedDigest);
}

export async function createAdminSession() {
  const secret = runtimeValue("ADMIN_SESSION_SECRET");
  if (!secret) throw new Error("Admin authentication is not configured.");
  const payload = toBase64Url(JSON.stringify({
    email: runtimeValue("ADMIN_EMAIL") || "admin@vesterragroup.in",
    name: runtimeValue("ADMIN_NAME") || "Vesterra Administrator",
    exp: Math.floor(Date.now() / 1000) + SESSION_SECONDS,
  }));
  return `${payload}.${await hmac(payload, secret)}`;
}

export async function readAdminSession(cookieHeader:string | null) {
  const token = readCookie(cookieHeader, ADMIN_COOKIE);
  const secret = runtimeValue("ADMIN_SESSION_SECRET");
  if (!token || !secret) return null;
  const [payload, signature, extra] = token.split(".");
  if (!payload || !signature || extra) return null;
  const expected = await hmac(payload, secret);
  if (!constantTimeEqual(signature, expected)) return null;
  try {
    const data = JSON.parse(fromBase64Url(payload)) as {email?:string;name?:string;exp?:number};
    if (!data.email || !data.exp || data.exp <= Math.floor(Date.now() / 1000)) return null;
    return { email:data.email, name:data.name || data.email };
  } catch { return null; }
}

export function adminSessionCookie(token:string) {
  return `${ADMIN_COOKIE}=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${SESSION_SECONDS}`;
}

export function clearAdminSessionCookie() {
  return `${ADMIN_COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`;
}

function readCookie(header:string | null, name:string) {
  if (!header) return "";
  for (const item of header.split(";")) {
    const [key, ...value] = item.trim().split("=");
    if (key === name) return value.join("=");
  }
  return "";
}

async function hmac(value:string, secret:string) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey("raw", encoder.encode(secret), {name:"HMAC",hash:"SHA-256"}, false, ["sign"]);
  const signed = await crypto.subtle.sign("HMAC", key, encoder.encode(value));
  return toBase64Url(String.fromCharCode(...new Uint8Array(signed)));
}

function constantTimeEqual(a:string,b:string) {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let index=0; index<a.length; index++) mismatch |= a.charCodeAt(index) ^ b.charCodeAt(index);
  return mismatch === 0;
}

function toBase64Url(value:string) {
  return btoa(value).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/g,"");
}

function fromBase64Url(value:string) {
  const base64 = value.replace(/-/g,"+").replace(/_/g,"/").padEnd(Math.ceil(value.length / 4) * 4,"=");
  return atob(base64);
}
