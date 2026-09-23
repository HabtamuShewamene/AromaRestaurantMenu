"use client";

import {
  LayoutDashboard,
  Utensils,
  ListTree,
  PlusCircle,
  ShoppingBag,
  ChefHat,
  QrCode,
  Settings,
  LogOut,
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
      label: "MAIN",
      items: [
        { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
      ],
    },
    {
      label: "MENU",
      items: [
        { label: "Menu Items", href: "/admin/menu", icon: Utensils },
        { label: "Categories", href: "/admin/categories", icon: ListTree },
      ],
    },
    {
      label: "ORDERS",
      items: [
        { label: "Orders", href: "/admin/orders", icon: ShoppingBag },
        { label: "Kitchen", href: "/kitchen", icon: ChefHat },
      ],
    },
    {
      label: "RESTAURANT",
      items: [
        { label: "Tables & QR", href: "/admin/tables", icon: QrCode },
      ],
    },
    {
      label: "SYSTEM",
      items: [
        { label: "Settings", href: "/admin/settings", icon: Settings },
      ],
    },
  ];

  const bottomNavItems = [
    { label: "Dashboard", href: "/admin/dashboard", icon: Home },
    { label: "Orders", href: "/admin/orders", icon: ShoppingBag },
    { label: "Kitchen", href: "/kitchen", icon: ChefHat },
    { label: "Menu", href: "/admin/menu", icon: Utensils },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      {/* --- DESKTOP SIDEBAR --- */}
      <aside className="hidden md:flex fixed z-40 h-full w-64 border-r border-border bg-card flex-col justify-between overflow-y-auto no-scrollbar shadow-sm">
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
                          ? "bg-primary/10 text-primary border border-primary/20"
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

        <div className="p-6 border-t border-border space-y-2">
          <button className="w-full flex items-center gap-2.5 rounded-xl px-3.5 py-2 text-xs font-semibold text-red-500 hover:bg-red-500/10 transition-all">
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* --- MOBILE HEADER --- */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-40 h-16 bg-card border-b border-border flex items-center justify-between px-4">
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
      <main className="flex-1 md:ml-64 pt-20 pb-24 md:pt-8 md:pb-8 p-4 sm:p-8 min-h-screen overflow-x-hidden w-full">
        {children}
      </main>

      {/* --- MOBILE BOTTOM NAV --- */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border pb-safe">
        <div className="flex items-center justify-around h-16 px-2">
          {bottomNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
            
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${
                  isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? "fill-primary/20" : ""}`} />
                <span className="text-[10px] font-semibold">{item.label}</span>
              </Link>
            );
          })}
          
          <button 
            onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
            className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${
              isMoreMenuOpen ? "text-primary" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {isMoreMenuOpen ? <X className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
            <span className="text-[10px] font-semibold">{isMoreMenuOpen ? "Close" : "More"}</span>
          </button>
        </div>
      </div>

      {/* --- MOBILE MORE MENU --- */}
      {isMoreMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-background flex flex-col pt-16 pb-20 overflow-y-auto animate-in fade-in duration-200">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <span className="text-lg font-bold text-foreground">Navigation</span>
            <button
              onClick={() => setIsMoreMenuOpen(false)}
              className="p-2 rounded-xl bg-foreground/5 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Nav Items */}
          <div className="flex-1 px-5 py-4 space-y-2">
            {navGroups.map((group) => (
              <div key={group.label}>
                <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase px-2 mb-2 mt-4">
                  {group.label}
                </p>
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));

                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={() => setIsMoreMenuOpen(false)}
                      className={`flex items-center gap-4 w-full px-4 py-4 rounded-2xl transition-all mb-1 ${
                        isActive
                          ? "bg-primary/10 border border-primary/20 text-primary"
                          : "bg-card border border-border text-foreground hover:bg-foreground/5"
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isActive ? "bg-primary/20" : "bg-foreground/5"}`}>
                        <Icon className={`h-5 w-5 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                      </div>
                      <span className="text-base font-semibold">{item.label}</span>
                      {isActive && <div className="ml-auto w-2 h-2 rounded-full bg-primary" />}
                    </Link>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Logout */}
          <div className="px-5 pb-2">
            <button className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 font-semibold">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                <LogOut className="h-5 w-5" />
              </div>
              <span className="text-base">Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
