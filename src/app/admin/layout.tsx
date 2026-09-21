"use client";

<<<<<<< HEAD
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
=======
import {
  BarChart3,
  ChefHat,
  LayoutDashboard,
  ListTree,
  ShoppingBag,
  Utensils,
  Package,
  Star,
  QrCode,
  BellRing,
  Receipt,
  Store,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
>>>>>>> d034e7030184471ff69b5318637ae74846dbc349

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

<<<<<<< HEAD
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
=======
  const navGroups = [
    {
      label: "Operations",
      items: [
        { label: "Live Orders", href: "/admin/orders", icon: ShoppingBag },
        { label: "Tables & QR", href: "/admin/tables", icon: QrCode },
        { label: "Waiter Requests", href: "/admin/waiter-requests", icon: BellRing },
        { label: "Billing & Settle", href: "/admin/billing", icon: Receipt },
      ],
    },
    {
      label: "Menu & Stock",
      items: [
        { label: "Manage Menu", href: "/admin/menu", icon: Utensils },
        { label: "Categories", href: "/admin/categories", icon: ListTree },
        { label: "Inventory", href: "/admin/inventory", icon: Package },
        { label: "Reviews", href: "/admin/reviews", icon: Star },
      ],
    },
    {
      label: "Overview",
      items: [
        { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
        { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
      ],
    },
  ];

  return (
    <div className="flex min-h-screen bg-[#050505]">
      {/* Sidebar */}
      <aside className="fixed z-40 h-full w-64 border-r border-white/5 bg-zinc-950/80 backdrop-blur-xl flex flex-col justify-between overflow-y-auto no-scrollbar">
        <div className="p-6">
          <Link href="/admin/dashboard" className="mb-8 flex items-center gap-2.5">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gold-500/15 border border-gold-500/30">
              <ChefHat className="h-5 w-5 text-gold-400" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold tracking-tight text-white font-playfair">AROMA</span>
              <span className="text-[9px] tracking-[0.2em] text-gold-500 font-semibold uppercase -mt-1">
                Admin Portal
              </span>
            </div>
          </Link>

          <nav className="space-y-6">
            {navGroups.map((group) => (
              <div key={group.label} className="space-y-1.5">
                <p className="px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">
                  {group.label}
                </p>
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));

                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all ${
                        isActive
                          ? "bg-gold-500/15 text-gold-300 border border-gold-500/30 shadow-[0_0_12px_rgba(182,141,64,0.15)]"
                          : "text-zinc-400 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <Icon className={`h-4 w-4 ${isActive ? "text-gold-400" : "text-zinc-500"}`} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            ))}
>>>>>>> d034e7030184471ff69b5318637ae74846dbc349
          </nav>
        </div>

        <div className="p-6 border-t border-white/5">
          <Link
            href="/"
            className="flex items-center gap-2.5 rounded-xl px-3.5 py-2 text-xs font-semibold text-zinc-400 hover:bg-white/5 hover:text-white transition-all"
          >
            <Store className="h-4 w-4 text-zinc-500" />
            <span>Customer Storefront</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 flex-1 p-8 sm:p-10">{children}</main>
    </div>
  );
}
