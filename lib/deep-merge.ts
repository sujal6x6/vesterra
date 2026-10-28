import { isJsonObject, type JsonObject } from "@/lib/request-json";

export function deepMerge<T extends JsonObject>(base:T,saved:JsonObject):T {
  const result:JsonObject = { ...base };
  for (const [key,value] of Object.entries(saved)) {
    result[key] = isJsonObject(value)
      ? deepMerge(isJsonObject(base[key]) ? base[key] : {},value)
      : value;
  }
  return result as T;
}
