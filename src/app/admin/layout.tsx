"use client";

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
  Store,
  Menu as MenuIcon,
  X,
  Home
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useState } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

  const navGroups = [
    {
      label: "Operations",
      items: [
        { label: "Kitchen Display", href: "/kitchen", icon: ChefHat },
        { label: "Live Orders", href: "/admin/orders", icon: ShoppingBag },
        { label: "Tables & QR", href: "/admin/tables", icon: QrCode },
        { label: "Waiter Requests", href: "/admin/waiter-requests", icon: BellRing },
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

  const bottomNavItems = [
    { label: "Home", href: "/admin/dashboard", icon: Home },
    { label: "Orders", href: "/admin/orders", icon: ShoppingBag },
    { label: "Kitchen", href: "/kitchen", icon: ChefHat },
    { label: "Menu", href: "/admin/menu", icon: Utensils },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      {/* --- DESKTOP SIDEBAR --- */}
      <aside className="hidden md:flex fixed z-40 h-full w-64 border-r border-border bg-card/80 backdrop-blur-xl flex-col justify-between overflow-y-auto no-scrollbar">
        <div className="p-6">
          <Link href="/admin/dashboard" className="mb-8 flex items-center gap-2.5">
            <div className="flex items-center justify-center w-10 h-10 relative">
              <img src="/aroma-logo.png?v=3" alt="Aroma Logo" className="w-full h-full object-contain" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold tracking-tight text-foreground font-playfair">AROMA</span>
              <span className="text-[9px] tracking-[0.2em] text-primary font-semibold uppercase -mt-1">
                Admin Portal
              </span>
            </div>
          </Link>

          <nav className="space-y-6">
            {navGroups.map((group) => (
              <div key={group.label} className="space-y-1.5">
                <p className="px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
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
                          ? "bg-primary/15 text-primary border border-primary/30 shadow-[0_0_12px_rgba(139,212,63,0.15)]"
                          : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground"
                      }`}
                    >
                      <Icon className={`h-4 w-4 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            ))}
          </nav>
        </div>

        <div className="p-6 border-t border-border">
          <Link
            href="/"
            className="flex items-center gap-2.5 rounded-xl px-3.5 py-2 text-xs font-semibold text-muted-foreground hover:bg-foreground/5 hover:text-foreground transition-all"
          >
            <Store className="h-4 w-4 text-muted-foreground" />
            <span>Customer Storefront</span>
          </Link>
        </div>
      </aside>

      {/* --- MOBILE HEADER --- */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-40 h-16 bg-card/90 backdrop-blur-xl border-b border-border flex items-center justify-between px-4">
        <Link href="/admin/dashboard" className="flex items-center gap-2">
          <img src="/aroma-logo.png?v=3" alt="Aroma Logo" className="w-8 h-8 object-contain" />
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-tight text-foreground font-playfair leading-none">AROMA</span>
            <span className="text-[8px] tracking-[0.2em] text-primary font-semibold uppercase">Admin</span>
          </div>
        </Link>
        <ThemeToggle />
      </header>

      {/* --- MAIN CONTENT --- */}
      {/* pt-20 for mobile header, pb-24 for mobile bottom nav, md:ml-64 for desktop sidebar */}
      <main className="flex-1 md:ml-64 pt-20 pb-24 md:pt-8 md:pb-8 p-4 sm:p-8 min-h-screen">
        {children}
      </main>

      {/* --- MOBILE BOTTOM NAVIGATION --- */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border px-2 py-2 flex items-center justify-around pb-safe">
        {bottomNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.label}
              href={item.href}
              className="flex flex-col items-center justify-center gap-1 p-2 min-w-[64px]"
            >
              <div className={`p-1.5 rounded-full transition-colors ${isActive ? 'bg-primary/20 text-primary' : 'text-muted-foreground'}`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className={`text-[9px] font-medium ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
        
        {/* Mobile More Button */}
        <button
          onClick={() => setIsMoreMenuOpen(true)}
          className="flex flex-col items-center justify-center gap-1 p-2 min-w-[64px]"
        >
          <div className="p-1.5 rounded-full text-muted-foreground transition-colors hover:bg-foreground/5">
            <MenuIcon className="w-5 h-5" />
          </div>
          <span className="text-[9px] font-medium text-muted-foreground">More</span>
        </button>
      </nav>

      {/* --- MOBILE MORE DRAWER --- */}
      {isMoreMenuOpen && (
        <div className="md:hidden fixed inset-0 z-[100] flex flex-col justify-end">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setIsMoreMenuOpen(false)} />
          <div className="relative w-full bg-card rounded-t-3xl border-t border-border overflow-hidden animate-in slide-in-from-bottom-full duration-200">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <span className="font-bold text-foreground">More Options</span>
              <button onClick={() => setIsMoreMenuOpen(false)} className="p-2 rounded-full bg-foreground/5 text-muted-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="max-h-[70vh] overflow-y-auto p-4 space-y-6 pb-8">
              {navGroups.map((group) => (
                <div key={group.label} className="space-y-2">
                  <p className="px-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                    {group.label}
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
                      return (
                        <Link
                          key={item.label}
                          href={item.href}
                          onClick={() => setIsMoreMenuOpen(false)}
                          className={`flex items-center gap-3 p-3 rounded-xl border ${
                            isActive 
                            ? 'bg-primary/10 border-primary/30 text-primary' 
                            : 'bg-background border-border text-foreground'
                          }`}
                        >
                          <Icon className="w-4 h-4 opacity-70" />
                          <span className="text-xs font-medium">{item.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
              <div className="pt-4 border-t border-border">
                <Link
                  href="/"
                  className="flex items-center justify-center gap-2 p-3 w-full rounded-xl bg-background border border-border text-muted-foreground"
                >
                  <Store className="w-4 h-4" />
                  <span className="text-xs font-medium">Exit to Storefront</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
