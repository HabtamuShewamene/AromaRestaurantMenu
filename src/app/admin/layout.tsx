"use client";

import { BarChart3, Coffee, LayoutDashboard, ListTree, Settings, ShoppingBag, Utensils, Package, Star } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Manage Menu", href: "/admin/menu", icon: Utensils },
  { name: "Categories", href: "/admin/categories", icon: ListTree },
  { name: "Orders", href: "/admin/orders", icon: ShoppingBag },
  { name: "Inventory", href: "/admin/inventory", icon: Package },
  { name: "Reviews", href: "/admin/reviews", icon: Star },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-[#050505]">
      <aside className="fixed z-40 h-full w-64 border-r border-white/5 bg-zinc-950/50 backdrop-blur-xl">
        <div className="p-8">
          <Link href="/admin/dashboard" className="mb-10 flex items-center gap-2">
            <Coffee className="h-6 w-6 text-gold-500" />
            <span className="text-xl font-bold tracking-tighter text-gradient">ADMIN PORTAL</span>
          </Link>

          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 font-medium transition-all ${
                    isActive
                      ? "bg-gold-500/10 text-gold-400 font-semibold border border-gold-500/20"
                      : "text-zinc-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Icon className={`h-5 w-5 ${isActive ? "text-gold-400" : "text-zinc-400"}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="absolute right-8 bottom-8 left-8">
          <Link href="/" className="flex items-center gap-3 rounded-xl px-4 py-3 font-medium text-zinc-500 transition-all hover:bg-white/5 hover:text-white">
            <Settings className="h-5 w-5" /> Storefront
          </Link>
        </div>
      </aside>

      <main className="ml-64 flex-1 p-12">{children}</main>
    </div>
  );
}
