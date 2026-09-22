import { requireAdmin } from "@/server/auth/session";
import AddonManager from "@/features/admin/components/AddonManager";

export const metadata = {
  title: "Add-ons - Aroma Admin",
};

export default async function AdminAddonsPage() {
  await requireAdmin();
  
  return <AddonManager />;
}
