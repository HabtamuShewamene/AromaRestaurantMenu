"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Search, SlidersHorizontal, History, TrendingUp, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useLanguage } from "@/components/providers/LanguageProvider";

type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  onFilterToggle?: () => void;
  placeholder?: string;
  popularSearches?: string[];
};

export default function SearchBar({
  value,
  onChange,
  onFilterToggle,
  placeholder,
  popularSearches = [],
}: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const { locale, t } = useLanguage();
  const resolvedPlaceholder = placeholder || t("menu.search_placeholder");

  useEffect(() => {
    const saved = localStorage.getItem("recentSearches");
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch {
        // ignore parse error
      }
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (searchTerm: string) => {
    onChange(searchTerm);
    if (!searchTerm.trim()) return;
    
    const updated = [searchTerm.trim(), ...recentSearches.filter(s => s.toLowerCase() !== searchTerm.toLowerCase())].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem("recentSearches", JSON.stringify(updated));
    setIsFocused(false);
  };

  const clearRecent = () => {
    setRecentSearches([]);
    localStorage.removeItem("recentSearches");
  };

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="relative w-full z-50"
    >
      <div
        className="flex items-center gap-3 rounded-2xl px-4 py-3 sm:px-5 sm:py-4 transition-all duration-300"
        style={{
          background: "rgba(18, 18, 18, 0.95)",
          backdropFilter: "blur(24px) saturate(1.8)",
          WebkitBackdropFilter: "blur(24px) saturate(1.8)",
          border: isFocused ? "1px solid rgba(182,141,64,0.4)" : "1px solid rgba(255,255,255,0.08)",
          boxShadow: isFocused 
            ? "0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(182,141,64,0.1), inset 0 1px 0 rgba(255,255,255,0.04)"
            : "0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.04)",
        }}
      >
        {/* Search icon */}
        <div className="flex-shrink-0">
          <Search className={`w-5 h-5 transition-colors ${isFocused ? 'text-primary' : 'text-primary/70'}`} strokeWidth={1.5} />
        </div>

        {/* Input */}
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch(value);
            }
          }}
          placeholder={resolvedPlaceholder}
          className="flex-1 bg-transparent text-foreground placeholder-zinc-600 text-sm font-medium outline-none"
        />

        {/* Clear icon */}
        {value && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={() => onChange("")}
            className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-zinc-800 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </motion.button>
        )}

        {/* Divider */}
        <div className="w-px h-5 bg-foreground/10 flex-shrink-0 mx-1" />

        {/* Filter button */}
        <button 
          onClick={onFilterToggle}
          className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-xl bg-primary/10 border border-primary/20 hover:bg-primary/20 transition-all"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-primary" />
        </button>
      </div>

      {/* Search Dropdown */}
      <AnimatePresence>
        {isFocused && (recentSearches.length > 0 || popularSearches.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 p-4 rounded-2xl border border-border shadow-2xl overflow-hidden"
            style={{
              background: "rgba(18, 18, 18, 0.98)",
              backdropFilter: "blur(20px)",
            }}
          >
            {recentSearches.length > 0 && (
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <History className="w-3.5 h-3.5" /> {t("menu.recent")}
                  </h4>
                  <button onClick={clearRecent} className="text-[10px] text-zinc-600 hover:text-muted-foreground uppercase">{t("menu.clear")}</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((term, i) => (
                    <button
                      key={i}
                      onMouseDown={(e) => {
                        e.preventDefault(); // Prevents input onBlur
                        handleSearch(term);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-card border border-border text-sm text-muted-foreground hover:bg-zinc-800 hover:text-foreground transition-colors"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {popularSearches.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-primary/80 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                  <TrendingUp className="w-3.5 h-3.5" /> {t("menu.popular")}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {popularSearches.map((term, i) => (
                    <button
                      key={i}
                      onMouseDown={(e) => {
                        e.preventDefault(); // Prevents input onBlur
                        handleSearch(term);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-primary/5 border border-primary/10 text-sm text-brand-200 hover:bg-primary/10 transition-colors"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
