import { chatGPTSignOutPath, requireChatGPTUser } from "@/app/chatgpt-auth";
import AdminClient from "./admin-client";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const user = await requireChatGPTUser("/admin");
  return <AdminClient user={user.displayName} signOutPath={chatGPTSignOutPath("/")} />;
}
