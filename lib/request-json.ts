export type JsonObject = Record<string, unknown>;

export async function readJsonObject(request:Request):Promise<JsonObject|null> {
  const value:unknown = await request.json().catch(() => null);
  return isJsonObject(value) ? value : null;
}

export function isJsonObject(value:unknown):value is JsonObject {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
