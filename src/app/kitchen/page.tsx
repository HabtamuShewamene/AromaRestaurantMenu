import KitchenDisplay from "@/features/kitchen/components/KitchenDisplay";
import { redirect } from "next/navigation";
import { getAppSession } from "@/server/auth/session";

export const metadata = {
  title: "Kitchen Display System | Aroma Restaurant",
  description: "Live kitchen display system for active kitchen order processing and real-time station management.",
};

export default async function KitchenPage() {
  const session = await getAppSession();
  if (session?.user?.role !== "ADMIN") redirect("/login?callbackUrl=/kitchen");
  return <KitchenDisplay />;
}
