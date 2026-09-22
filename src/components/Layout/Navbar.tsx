"use client";

import Link from "next/link";
import { User, ChefHat, Menu as MenuIcon, X, ShoppingBag, Shield } from "lucide-react";
import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { useCart } from "@/components/providers/CartProvider";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: session } = useSession();
  const { cartCount } = useCart();
  const pathname = usePathname();
  const role = (session?.user as { role?: string } | undefined)?.role;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border backdrop-blur-2xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex items-center justify-center w-12 h-12 relative group-hover:scale-105 transition-transform">
              <img src="/aroma-logo.png?v=3" alt="Aroma Logo" className="w-full h-full object-contain" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-foreground font-playfair group-hover:text-brand-300 transition-colors">
                AROMA
              </span>
              <span className="text-[10px] tracking-[0.25em] text-primary font-semibold uppercase -mt-1">
                Restaurant
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-8 md:flex">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors ${
                pathname === "/" ? "text-primary font-semibold" : "text-muted-foreground hover:text-primary"
              }`}
            >
              Home
            </Link>
            <Link
              href="/menu"
              className={`text-sm font-medium transition-colors ${
                pathname === "/menu" ? "text-primary font-semibold" : "text-muted-foreground hover:text-primary"
              }`}
            >
              Menu
            </Link>
            {session && (
              <Link
                href="/orders"
                className={`text-sm font-medium transition-colors ${
                  pathname === "/orders" ? "text-primary font-semibold" : "text-muted-foreground hover:text-primary"
                }`}
              >
                My Orders
              </Link>
            )}
            {role === "ADMIN" && (
              <div className="flex items-center gap-2">
                <Link
                  href="/kitchen"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs font-bold text-amber-400 hover:bg-amber-500/20 transition-all"
                >
                  <ChefHat className="h-3.5 w-3.5" /> Kitchen KDS
                </Link>
                <Link
                  href="/admin/dashboard"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary/10 border border-primary/30 text-xs font-bold text-primary hover:bg-primary/20 transition-all"
                >
                  <Shield className="h-3.5 w-3.5" /> Admin
                </Link>
              </div>
            )}

            <div className="ml-2 flex items-center gap-3 border-l border-border pl-6">
              <ThemeToggle />
              
              {/* Cart Button with Dynamic Badge */}
              <Link
                href="/cart"
                className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-white/[0.04] border border-border text-foreground hover:text-primary hover:border-primary/40 hover:bg-primary/10 transition-all group"
                aria-label="Shopping Cart"
              >
                <ShoppingBag className="w-5 h-5 transition-transform group-hover:scale-110" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center min-w-[20px] h-[20px] px-1 text-[11px] font-bold text-primary-foreground bg-primary rounded-full shadow-[0_0_12px_rgba(182,141,64,0.8)] animate-pulse-gold">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* User Session */}
              {session ? (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-white/[0.03] border border-border">
                    <User className="h-4 w-4 text-primary" />
                    <span className="text-xs font-medium text-muted-foreground max-w-[100px] truncate">
                      {session.user?.name || "Customer"}
                    </span>
                  </div>
                  <button
                    onClick={() => signOut()}
                    className="text-xs text-muted-foreground hover:text-red-400 transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="rounded-2xl bg-primary px-5 py-2.5 text-xs font-bold text-primary-foreground transition-all hover:scale-105 hover:bg-primary shadow-[0_2px_12px_rgba(182,141,64,0.3)]"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Actions */}
          <div className="flex items-center gap-4 md:hidden">
            <ThemeToggle />
            <Link
              href="/cart"
              className="relative p-2.5 rounded-xl bg-foreground/5 border border-border text-muted-foreground hover:text-primary"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] text-[10px] font-bold text-primary-foreground bg-primary rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>

            <button
              onClick={() => setIsMenuOpen((open) => !open)}
              className="p-2.5 rounded-xl bg-foreground/5 text-muted-foreground"
              aria-label="Toggle Menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMenuOpen && (
        <div className="glass animate-in slide-in-from-top border-t border-border duration-300 md:hidden bg-background/95 backdrop-blur-2xl">
          <div className="space-y-3 px-6 pt-4 pb-6">
            <Link
              href="/"
              onClick={() => setIsMenuOpen(false)}
              className="block py-2 text-base font-medium text-foreground hover:text-primary"
            >
              Home
            </Link>
            <Link
              href="/menu"
              onClick={() => setIsMenuOpen(false)}
              className="block py-2 text-base font-medium text-foreground hover:text-primary"
            >
              Menu Explorer
            </Link>
            <Link
              href="/cart"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center justify-between py-2 text-base font-medium text-foreground hover:text-primary"
            >
              <span>Shopping Cart</span>
              <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-xs font-bold">
                {cartCount} items
              </span>
            </Link>
            {session && (
              <Link
                href="/orders"
                onClick={() => setIsMenuOpen(false)}
                className="block py-2 text-base font-medium text-foreground hover:text-primary"
              >
                Order History
              </Link>
            )}
            {role === "ADMIN" && (
              <Link
                href="/admin/dashboard"
                onClick={() => setIsMenuOpen(false)}
                className="block py-2 text-base font-medium text-primary"
              >
                Admin Dashboard
              </Link>
            )}
            <div className="border-t border-border pt-4 mt-2 flex items-center justify-between">
              {session ? (
                <div className="flex items-center justify-between w-full">
                  <span className="text-sm text-muted-foreground">{session.user?.name}</span>
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      signOut();
                    }}
                    className="text-sm font-bold text-red-400 hover:underline"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full text-center py-3 rounded-xl bg-primary font-bold text-primary-foreground"
                >
                  Sign In / Register
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
