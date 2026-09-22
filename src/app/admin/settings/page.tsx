import { requireAdmin } from "@/server/auth/session";
import SettingsClient from "./SettingsClient";

export const metadata = {
  title: "Settings - Aroma Admin",
};

export default async function AdminSettingsPage() {
  const session = await requireAdmin();
  
  return <SettingsClient user={session?.user} />;
}
