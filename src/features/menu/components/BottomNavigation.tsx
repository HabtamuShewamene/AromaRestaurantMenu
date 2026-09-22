"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Home, UtensilsCrossed, ShoppingBag, ClipboardList, Shield, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCart } from "@/components/providers/CartProvider";

export default function BottomNavigation() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { cartCount } = useCart();
  const [ripple, setRipple] = useState<string | null>(null);
  const role = (session?.user as { role?: string } | undefined)?.role;

  const navItems = [
    { icon: Home, label: "Home", href: "/" },
    { icon: UtensilsCrossed, label: "Menu", href: "/menu" },
    { icon: ShoppingBag, label: "Cart", href: "/cart", badge: cartCount },
    { icon: ClipboardList, label: "Orders", href: session ? "/orders" : "/login" },
    {
      icon: role === "ADMIN" ? Shield : User,
      label: role === "ADMIN" ? "Admin" : session ? "Account" : "Sign In",
      href: role === "ADMIN" ? "/admin/dashboard" : session ? "/orders" : "/login",
    },
  ];

  const handleClick = (label: string) => {
    setRipple(label);
    setTimeout(() => setRipple(null), 600);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center safe-bottom pb-4 px-4 pointer-events-none md:hidden">
      <motion.nav
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="flex items-center gap-1 px-3 py-2 rounded-[2rem] pointer-events-auto bg-background/95 backdrop-blur-2xl border border-border shadow-[0_-4px_40px_rgba(0,0,0,0.8),0_0_0_1px_rgba(255,255,255,0.05)]"
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

          return (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => handleClick(item.label)}
              className="relative flex flex-col items-center justify-center w-14 h-14 rounded-2xl group"
            >
              {/* Active background */}
              {isActive && (
                <motion.div
                  layoutId="bottom-nav-active"
                  className="absolute inset-0 rounded-2xl bg-primary/15 border border-primary/30"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}

              {/* Ripple effect */}
              {ripple === item.label && (
                <motion.div
                  initial={{ scale: 0, opacity: 0.4 }}
                  animate={{ scale: 2.5, opacity: 0 }}
                  transition={{ duration: 0.6 }}
                  className="absolute inset-0 rounded-2xl bg-primary/20"
                />
              )}

              {/* Icon & Badge */}
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-all duration-300 ${
                    isActive
                      ? "text-primary drop-shadow-[0_0_8px_rgba(182,141,64,0.8)]"
                      : "text-muted-foreground group-hover:text-foreground"
                  }`}
                  strokeWidth={isActive ? 2 : 1.5}
                />
                
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 flex items-center justify-center min-w-[16px] h-[16px] px-1 text-[9px] font-bold text-primary-foreground bg-primary rounded-full shadow-[0_0_8px_rgba(182,141,64,0.6)]">
                    {item.badge}
                  </span>
                )}

                {/* Active dot */}
                {isActive && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary"
                  />
                )}
              </div>

              {/* Label */}
              <span
                className={`text-[9px] mt-1 font-medium tracking-tight transition-colors duration-300 ${
                  isActive ? "text-primary font-bold" : "text-muted-foreground group-hover:text-muted-foreground"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </motion.nav>
    </div>
  );
}
