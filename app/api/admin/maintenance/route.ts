import { requireAdminApi } from "@/lib/admin-auth";
import { getMaintenanceMode, setMaintenanceMode } from "@/lib/maintenance";
import { readJsonObject } from "@/lib/request-json";

export const dynamic = "force-dynamic";

const headers = { "Cache-Control": "no-store" };

export async function GET() {
  const auth = await requireAdminApi();
  if (auth.error) return auth.error;
  return Response.json({ enabled: await getMaintenanceMode() }, { headers });
}

export async function PUT(request: Request) {
  const auth = await requireAdminApi();
  if (auth.error) return auth.error;

  const body = await readJsonObject(request);
  if (typeof body?.enabled !== "boolean") {
    return Response.json({ error: "Expected a boolean maintenance setting." }, { status: 400, headers });
  }

  await setMaintenanceMode(body.enabled);
  return Response.json({ enabled: body.enabled }, { headers });
}
