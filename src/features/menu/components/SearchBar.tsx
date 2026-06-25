"use client";

import { motion } from "framer-motion";
import { Search, SlidersHorizontal } from "lucide-react";

type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export default function SearchBar({
  value,
  onChange,
  placeholder = "Search dishes, drinks...",
}: SearchBarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="relative w-full"
    >
      <div
        className="flex items-center gap-3 rounded-2xl px-4 py-3 sm:px-5 sm:py-4 transition-all duration-300"
        style={{
          background: "rgba(18, 18, 18, 0.95)",
          backdropFilter: "blur(24px) saturate(1.8)",
          WebkitBackdropFilter: "blur(24px) saturate(1.8)",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow:
            "0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.04)",
        }}
      >
        {/* Search icon */}
        <div className="flex-shrink-0">
          <Search className="w-5 h-5 text-gold-500" strokeWidth={1.5} />
        </div>

        {/* Input */}
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-white placeholder-zinc-600 text-sm font-medium outline-none"
        />

        {/* Right filter icon */}
        {value && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={() => onChange("")}
            className="flex-shrink-0 text-xs text-zinc-500 hover:text-zinc-300 transition-colors px-2"
          >
            Clear
          </motion.button>
        )}

        {/* Divider */}
        <div className="w-px h-5 bg-white/10 flex-shrink-0" />

        {/* Filter button */}
        <button className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-xl bg-gold-500/10 border border-gold-500/20 hover:bg-gold-500/20 transition-all">
          <SlidersHorizontal className="w-3.5 h-3.5 text-gold-400" />
        </button>
      </div>

      {/* Subtle glow on focus */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-300"
        style={{
          background:
            "radial-gradient(ellipse at 50% 100%, rgba(182,141,64,0.08) 0%, transparent 70%)",
        }}
      />
    </motion.div>
  );
}
