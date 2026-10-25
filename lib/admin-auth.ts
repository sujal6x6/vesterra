import { getChatGPTUser } from "@/app/chatgpt-auth";

export async function requireAdminApi() {
  const user = await getChatGPTUser();
  if (!user) {
    return { user: null, error: Response.json({ error: "Authentication required" }, { status: 401 }) };
  }
  return { user, error: null };
}
