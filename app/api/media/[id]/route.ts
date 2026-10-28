import { readImage } from "@/lib/media-storage";

export const dynamic = "force-dynamic";

export async function GET(_request:Request,context:{ params:Promise<{ id:string }> }) {
  const { id } = await context.params;
  const image = await readImage(id);
  if (!image) return new Response("Image not found.",{ status:404 });
  return new Response(image.bytes.buffer as ArrayBuffer,{ headers:{
    "content-type":image.type,
    "content-length":String(image.size),
    "cache-control":"public, max-age=31536000, immutable",
    "content-disposition":`inline; filename="${image.name}"`,
    "x-content-type-options":"nosniff",
  } });
}
