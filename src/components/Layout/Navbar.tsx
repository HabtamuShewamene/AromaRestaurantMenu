"use client";

import Link from "next/link";
import { User, ChefHat, Menu as MenuIcon, X, ShoppingBag, Shield } from "lucide-react";
import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { useCart } from "@/components/providers/CartProvider";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: session } = useSession();
  const { cartCount } = useCart();
  const pathname = usePathname();
  const role = (session?.user as { role?: string } | undefined)?.role;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10 backdrop-blur-2xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-gold-500/15 border border-gold-500/30 group-hover:bg-gold-500/25 transition-all shadow-[0_0_20px_rgba(182,141,64,0.2)]">
              <ChefHat className="h-5 w-5 text-gold-400" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-white font-playfair group-hover:text-gold-300 transition-colors">
                AROMA
              </span>
              <span className="text-[10px] tracking-[0.25em] text-gold-500 font-semibold uppercase -mt-1">
                Restaurant
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-8 md:flex">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors ${
                pathname === "/" ? "text-gold-400 font-semibold" : "text-zinc-300 hover:text-gold-400"
              }`}
            >
              Home
            </Link>
            <Link
              href="/menu"
              className={`text-sm font-medium transition-colors ${
                pathname === "/menu" ? "text-gold-400 font-semibold" : "text-zinc-300 hover:text-gold-400"
              }`}
            >
              Menu
            </Link>
            {session && (
              <Link
                href="/orders"
                className={`text-sm font-medium transition-colors ${
                  pathname === "/orders" ? "text-gold-400 font-semibold" : "text-zinc-300 hover:text-gold-400"
                }`}
              >
                My Orders
              </Link>
            )}
            {role === "ADMIN" && (
              <Link
                href="/admin/dashboard"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gold-500/10 border border-gold-500/30 text-xs font-bold text-gold-400 hover:bg-gold-500/20 transition-all"
              >
                <Shield className="h-3.5 w-3.5" /> Admin Panel
              </Link>
            )}

            <div className="ml-2 flex items-center gap-3 border-l border-white/10 pl-6">
              {/* Cart Button with Dynamic Badge */}
              <Link
                href="/cart"
                className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-white/[0.04] border border-white/10 text-zinc-200 hover:text-gold-400 hover:border-gold-500/40 hover:bg-gold-500/10 transition-all group"
                aria-label="Shopping Cart"
              >
                <ShoppingBag className="w-5 h-5 transition-transform group-hover:scale-110" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center min-w-[20px] h-[20px] px-1 text-[11px] font-bold text-black bg-gold-500 rounded-full shadow-[0_0_12px_rgba(182,141,64,0.8)] animate-pulse-gold">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* User Session */}
              {session ? (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-white/[0.03] border border-white/5">
                    <User className="h-4 w-4 text-gold-500" />
                    <span className="text-xs font-medium text-zinc-300 max-w-[100px] truncate">
                      {session.user?.name || "Customer"}
                    </span>
                  </div>
                  <button
                    onClick={() => signOut()}
                    className="text-xs text-zinc-400 hover:text-red-400 transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="rounded-2xl bg-gold-500 px-5 py-2.5 text-xs font-bold text-black transition-all hover:scale-105 hover:bg-gold-400 shadow-[0_2px_12px_rgba(182,141,64,0.3)]"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Right Controls */}
          <div className="flex items-center gap-2 md:hidden">
            <Link
              href="/cart"
              className="relative p-2.5 rounded-xl bg-white/5 border border-white/10 text-zinc-300 hover:text-gold-400"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] text-[10px] font-bold text-black bg-gold-500 rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>

            <button
              onClick={() => setIsMenuOpen((open) => !open)}
              className="p-2.5 rounded-xl bg-white/5 text-zinc-300"
              aria-label="Toggle Menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMenuOpen && (
        <div className="glass animate-in slide-in-from-top border-t border-white/10 duration-300 md:hidden bg-[#0a0a0a]/95 backdrop-blur-2xl">
          <div className="space-y-3 px-6 pt-4 pb-6">
            <Link
              href="/"
              onClick={() => setIsMenuOpen(false)}
              className="block py-2 text-base font-medium text-zinc-200 hover:text-gold-400"
            >
              Home
            </Link>
            <Link
              href="/menu"
              onClick={() => setIsMenuOpen(false)}
              className="block py-2 text-base font-medium text-zinc-200 hover:text-gold-400"
            >
              Menu Explorer
            </Link>
            <Link
              href="/cart"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center justify-between py-2 text-base font-medium text-zinc-200 hover:text-gold-400"
            >
              <span>Shopping Cart</span>
              <span className="px-2 py-0.5 rounded-full bg-gold-500/20 text-gold-400 text-xs font-bold">
                {cartCount} items
              </span>
            </Link>
            {session && (
              <Link
                href="/orders"
                onClick={() => setIsMenuOpen(false)}
                className="block py-2 text-base font-medium text-zinc-200 hover:text-gold-400"
              >
                Order History
              </Link>
            )}
            {role === "ADMIN" && (
              <Link
                href="/admin/dashboard"
                onClick={() => setIsMenuOpen(false)}
                className="block py-2 text-base font-medium text-gold-400"
              >
                Admin Dashboard
              </Link>
            )}
            <div className="border-t border-white/10 pt-4 mt-2 flex items-center justify-between">
              {session ? (
                <div className="flex items-center justify-between w-full">
                  <span className="text-sm text-zinc-400">{session.user?.name}</span>
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
                  className="w-full text-center py-3 rounded-xl bg-gold-500 font-bold text-black"
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
