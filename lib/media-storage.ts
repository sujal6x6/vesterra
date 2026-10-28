import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { siteSettings } from "@/db/schema";

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const CHUNK_CHARACTERS = 1_300_000;
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"]);

type StoredMedia = { chunks:number; size:number; type:string; name:string };

export async function storeImage(file:File) {
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) throw new MediaUploadError("Choose a JPG, PNG, WebP, AVIF or GIF image.",415);
  if (!file.size) throw new MediaUploadError("The selected image is empty.",400);
  if (file.size > MAX_IMAGE_BYTES) throw new MediaUploadError("Image size must be 5 MB or less.",413);

  const id = crypto.randomUUID();
  const encoded = bytesToBase64(new Uint8Array(await file.arrayBuffer()));
  const chunks = Array.from({ length:Math.ceil(encoded.length / CHUNK_CHARACTERS) },(_,index)=>encoded.slice(index*CHUNK_CHARACTERS,(index+1)*CHUNK_CHARACTERS));
  const db = getDb();
  const written:string[] = [];
  try {
    for (let index=0; index<chunks.length; index+=1) {
      const key = chunkKey(id,index);
      await db.insert(siteSettings).values({ id:key, data:chunks[index] });
      written.push(key);
    }
    const meta:StoredMedia = { chunks:chunks.length, size:file.size, type:file.type, name:safeName(file.name) };
    await db.insert(siteSettings).values({ id:metaKey(id), data:JSON.stringify(meta) });
  } catch (error) {
    await Promise.allSettled(written.map(key=>db.delete(siteSettings).where(eq(siteSettings.id,key))));
    throw error;
  }
  return { id, url:`/api/media/${id}`, size:file.size, type:file.type, name:safeName(file.name) };
}

export async function readImage(id:string) {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
  const db = getDb();
  const row = (await db.select({ data:siteSettings.data }).from(siteSettings).where(eq(siteSettings.id,metaKey(id))).limit(1))[0];
  const meta = parseMeta(row?.data);
  if (!meta) return null;
  const parts:string[] = [];
  for (let index=0; index<meta.chunks; index+=1) {
    const part = (await db.select({ data:siteSettings.data }).from(siteSettings).where(eq(siteSettings.id,chunkKey(id,index))).limit(1))[0];
    if (!part) return null;
    parts.push(part.data);
  }
  const bytes = base64ToBytes(parts.join(""));
  if (bytes.byteLength !== meta.size) return null;
  return { bytes, ...meta };
}

export class MediaUploadError extends Error {
  constructor(message:string,public status:number) { super(message); }
}

function metaKey(id:string) { return `media:${id}:meta`; }
function chunkKey(id:string,index:number) { return `media:${id}:${String(index).padStart(3,"0")}`; }
function safeName(value:string) { return value.replace(/[^a-z0-9._-]+/gi,"-").slice(0,120) || "image"; }

function parseMeta(value?:string):StoredMedia|null {
  try {
    const parsed = JSON.parse(value || "") as Partial<StoredMedia>;
    return Number.isInteger(parsed.chunks) && Number(parsed.chunks)>0 && Number(parsed.chunks)<=8 && Number.isInteger(parsed.size) && Number(parsed.size)>0 && Number(parsed.size)<=MAX_IMAGE_BYTES && typeof parsed.type==="string" && ALLOWED_IMAGE_TYPES.has(parsed.type)
      ? { chunks:Number(parsed.chunks), size:Number(parsed.size), type:parsed.type, name:typeof parsed.name==="string"?parsed.name:"image" }
      : null;
  } catch { return null; }
}

function bytesToBase64(bytes:Uint8Array) {
  let binary = "";
  for (let offset=0; offset<bytes.length; offset+=32_768) binary += String.fromCharCode(...bytes.subarray(offset,offset+32_768));
  return btoa(binary);
}

function base64ToBytes(value:string) {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let index=0; index<binary.length; index+=1) bytes[index] = binary.charCodeAt(index);
  return bytes;
}
