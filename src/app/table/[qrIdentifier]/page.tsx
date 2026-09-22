import { notFound } from "next/navigation";
import { getTableByQrIdentifier, getOrCreateActiveSession } from "@/server/services/table.service";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MenuExplorer from "@/features/menu/components/MenuExplorer";
import TableActionBar from "@/features/table/components/TableActionBar";
import TableSessionInitializer from "@/features/table/components/TableSessionInitializer";

type PageProps = {
  params: Promise<{ qrIdentifier: string }>;
};

export default async function TablePage({ params }: PageProps) {
  const { qrIdentifier } = await params;
  const table = await getTableByQrIdentifier(qrIdentifier);

  if (!table) {
    notFound();
  }

  if (table.status === "OUT_OF_SERVICE") {
    return (
      <main className="min-h-screen bg-[#171918] flex items-center justify-center p-4">
        <div className="glass-card max-w-md p-8 rounded-3xl text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 mx-auto flex items-center justify-center text-2xl">
            🛑
          </div>
          <h1 className="text-2xl font-bold text-white font-playfair">Table Unavailable</h1>
          <p className="text-sm text-zinc-400">
            Table {table.number} is currently marked out of service. Please speak with a restaurant staff member for assistance.
          </p>
        </div>
      </main>
    );
  }

  // Get or resolve existing active table session
  const activeSession = await getOrCreateActiveSession(table.id);

  const tableContext = {
    tableId: table.id,
    tableNumber: table.number,
    tableLabel: table.label,
    tableSessionId: activeSession.id,
  };

  return (
    <TableSessionInitializer context={tableContext}>
      <main className="relative min-h-screen bg-[#171918]">
        <Navbar />
        <TableActionBar />
        <MenuExplorer showHero={false} />
        <Footer />
      </main>
    </TableSessionInitializer>
  );
}
