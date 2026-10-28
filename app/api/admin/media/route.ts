import { requireAdminApi } from "@/lib/admin-auth";
import { MediaUploadError, storeImage } from "@/lib/media-storage";

export const dynamic = "force-dynamic";

export async function POST(request:Request) {
  const auth = await requireAdminApi();
  if (auth.error) return auth.error;
  const form = await request.formData().catch(()=>null);
  const image = form?.get("image");
  if (!(image instanceof File)) return Response.json({ error:"Select an image to upload." },{ status:400 });
  try {
    return Response.json(await storeImage(image),{ status:201 });
  } catch (error) {
    if (error instanceof MediaUploadError) return Response.json({ error:error.message },{ status:error.status });
    throw error;
  }
}
