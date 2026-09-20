import WaiterRequestManager from "@/features/admin/components/WaiterRequestManager";

export const metadata = {
  title: "Waiter Requests | Aroma Admin",
  description: "Manage table service calls, water refills, and guest assistance.",
};

export default function AdminWaiterRequestsPage() {
  return <WaiterRequestManager />;
}
