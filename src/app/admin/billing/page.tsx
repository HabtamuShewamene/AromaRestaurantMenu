import BillingManager from "@/features/admin/components/BillingManager";

export const metadata = {
  title: "Billing & Settlement | Aroma Admin",
  description: "Manage table bills, payments, and dining session settlements.",
};

export default function AdminBillingPage() {
  return <BillingManager />;
}
