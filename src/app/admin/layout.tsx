import { Coffee, LayoutDashboard, Utensils, ShoppingBag, Settings } from "lucide-react";
import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#050505]">
      <aside className="fixed z-40 h-full w-64 border-r border-white/5 bg-zinc-950/50 backdrop-blur-xl">
        <div className="p-8">
          <Link href="/admin/dashboard" className="mb-12 flex items-center gap-2">
            <Coffee className="h-6 w-6 text-gold-500" />
            <span className="text-xl font-bold tracking-tighter text-gradient">ADMIN PORTAL</span>
          </Link>

          <nav className="space-y-2">
            <Link
              href="/admin/dashboard"
              className="flex items-center gap-3 rounded-xl bg-gold-600/10 px-4 py-3 font-medium text-gold-500"
            >
              <LayoutDashboard className="h-5 w-5" /> Dashboard
            </Link>
            <Link
              href="/admin/menu"
              className="flex items-center gap-3 rounded-xl px-4 py-3 font-medium text-zinc-400 transition-all hover:bg-white/5 hover:text-white"
            >
              <Utensils className="h-5 w-5" /> Manage Menu
            </Link>
            <Link
              href="/admin/orders"
              className="flex items-center gap-3 rounded-xl px-4 py-3 font-medium text-zinc-400 transition-all hover:bg-white/5 hover:text-white"
            >
              <ShoppingBag className="h-5 w-5" /> Orders
            </Link>
          </nav>
        </div>

        <div className="absolute right-8 bottom-8 left-8">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-xl px-4 py-3 font-medium text-zinc-500 transition-all hover:bg-white/5 hover:text-white"
          >
            <Settings className="h-5 w-5" /> Storefront
          </Link>
        </div>
      </aside>

      <main className="ml-64 flex-1 p-12">{children}</main>
    </div>
  );
}
