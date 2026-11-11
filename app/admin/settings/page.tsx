import { requireChatGPTUser } from "@/app/chatgpt-auth";
import MaintenancePage from "@/app/admin/maintenance/page";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Website Settings", robots: { index: false, follow: false } };

export default async function WebsiteSettingsPage() {
  await requireChatGPTUser("/admin/settings");
  return <MaintenancePage />;
}
