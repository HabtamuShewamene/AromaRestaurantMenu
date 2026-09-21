import TableManager from "@/features/admin/components/TableManager";

export const metadata = {
  title: "Tables & QR Management | Aroma Admin",
  description: "Manage restaurant tables, active visits, and printable QR codes.",
};

export default function AdminTablesPage() {
  return <TableManager />;
}
