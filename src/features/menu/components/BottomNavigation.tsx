"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Home, Heart, UtensilsCrossed, ClipboardList, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { icon: Home, label: "Home", href: "/" },
  { icon: UtensilsCrossed, label: "Menu", href: "/menu" },
  { icon: User, label: "Profile", href: "#" },
];

export default function BottomNavigation() {
  const pathname = usePathname();
  const [ripple, setRipple] = useState<string | null>(null);

  const handleClick = (label: string) => {
    setRipple(label);
    setTimeout(() => setRipple(null), 600);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center safe-bottom pb-4 px-4 pointer-events-none">
      <motion.nav
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="flex items-center gap-1 px-4 py-3 rounded-[2rem] pointer-events-auto"
        style={{
          background: "rgba(14, 14, 14, 0.92)",
          backdropFilter: "blur(24px) saturate(2)",
          WebkitBackdropFilter: "blur(24px) saturate(2)",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow:
            "0 -4px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.06)",
        }}
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href !== "#" &&
            (item.href === "/" ? pathname === "/" : pathname.startsWith(item.href));

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
                  className="absolute inset-0 rounded-2xl"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(182,141,64,0.25), rgba(182,141,64,0.1))",
                    border: "1px solid rgba(182,141,64,0.3)",
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}

              {/* Ripple effect */}
              {ripple === item.label && (
                <motion.div
                  initial={{ scale: 0, opacity: 0.4 }}
                  animate={{ scale: 2.5, opacity: 0 }}
                  transition={{ duration: 0.6 }}
                  className="absolute inset-0 rounded-2xl bg-gold-500/20"
                />
              )}

              {/* Icon */}
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-all duration-300 ${
                    isActive
                      ? "text-gold-400 drop-shadow-[0_0_8px_rgba(182,141,64,0.8)]"
                      : "text-zinc-500 group-hover:text-zinc-300"
                  }`}
                  strokeWidth={isActive ? 2 : 1.5}
                />
                {/* Active dot */}
                {isActive && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-gold-400"
                  />
                )}
              </div>

              {/* Label */}
              <span
                className={`text-[9px] mt-1 font-medium tracking-wide transition-colors duration-300 ${
                  isActive ? "text-gold-400" : "text-zinc-600 group-hover:text-zinc-400"
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
