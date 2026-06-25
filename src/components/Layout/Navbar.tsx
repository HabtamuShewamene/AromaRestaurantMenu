"use client";

import Link from "next/link";
import { User, Coffee, Menu as MenuIcon, X } from "lucide-react";
import { useState } from "react";
import { signOut, useSession } from "next-auth/react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: session } = useSession();
  const role = (session?.user as { role?: string } | undefined)?.role;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Coffee className="h-8 w-8 text-gold-500" />
            <span className="text-2xl font-bold tracking-tighter text-gradient">ELITE CAFE</span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            <Link href="/menu" className="text-sm font-medium transition-colors hover:text-gold-500">
              Menu
            </Link>
            {role === "ADMIN" && (
              <Link
                href="/admin/dashboard"
                className="text-sm font-medium text-gold-400 transition-colors hover:text-gold-300"
              >
                Admin Panel
              </Link>
            )}
            <div className="ml-4 flex items-center gap-4">
              {session ? (
                <button onClick={() => signOut()} className="rounded-full p-2 transition-colors hover:bg-white/5">
                  <User className="h-5 w-5 text-gold-500" />
                </button>
              ) : (
                <Link
                  href="/login"
                  className="rounded-full bg-gold-600 px-6 py-2 text-sm font-bold text-black transition-all hover:scale-105 hover:bg-gold-700"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen((open) => !open)} className="p-2">
              {isMenuOpen ? <X className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="glass animate-in slide-in-from-top border-t border-white/10 duration-300 md:hidden">
          <div className="space-y-4 px-4 pt-2 pb-6">
            <Link href="/menu" className="block py-2 text-lg font-medium">
              Menu
            </Link>
            {role === "ADMIN" && (
              <Link href="/admin/dashboard" className="block py-2 text-lg font-medium text-gold-400">
                Admin Panel
              </Link>
            )}
            <div className="flex items-center justify-between border-t border-white/10 pt-4">
              {session ? (
                <button onClick={() => signOut()} className="font-medium text-gold-500">
                  Sign Out
                </button>
              ) : (
                <Link href="/login" className="font-medium text-gold-500">
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
