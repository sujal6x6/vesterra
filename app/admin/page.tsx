import { requireChatGPTUser } from "@/app/chatgpt-auth";
import AdminClient from "./admin-client";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const metadata:Metadata = { title: "Admin", robots: { index: false, follow: false } };

export default async function AdminPage() {
  const user = await requireChatGPTUser("/admin");
  return <AdminClient user={user.displayName} signOutPath="/api/admin/logout?return_to=/" />;
}
