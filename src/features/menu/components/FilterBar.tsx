"use client";

import { motion } from "framer-motion";
import { UtensilsCrossed, Coffee, BedDouble, Layers } from "lucide-react";

type FilterBarProps = {
  categories: string[];
  activeCategory: string;
  onSelect: (category: string) => void;
};

// Map common category names to icons
const getCategoryIcon = (name: string) => {
  const lower = name.toLowerCase();
  if (lower === "all") return Layers;
  if (lower.includes("drink") || lower.includes("beverage") || lower.includes("coffee")) return Coffee;
  if (lower.includes("room") || lower.includes("service")) return BedDouble;
  return UtensilsCrossed;
};

export default function FilterBar({
  categories,
  activeCategory,
  onSelect,
}: FilterBarProps) {
  return (
    <div className="relative">
      <div className="flex gap-3 overflow-x-auto pb-1 no-scrollbar">
        {categories.map((category, idx) => {
          const isActive = category === activeCategory;
          const Icon = getCategoryIcon(category);

          return (
            <motion.button
              key={category}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              onClick={() => onSelect(category)}
              className="relative flex-shrink-0 flex items-center gap-2 px-3 sm:px-5 py-2 rounded-full text-sm font-medium transition-all duration-300"
              style={
                isActive
                  ? {
                      background:
                        "linear-gradient(135deg, #b68d40, #d8c491, #a47636)",
                      color: "#080808",
                      boxShadow: "0 4px 16px rgba(182,141,64,0.35)",
                    }
                  : {
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      color: "#888",
                    }
              }
              whileTap={{ scale: 0.95 }}
            >
              <Icon
                className="w-3.5 h-3.5"
                strokeWidth={isActive ? 2 : 1.5}
              />
              <span className="whitespace-nowrap">{category}</span>

              {/* Active shimmer */}
              {isActive && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 0.4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-0 rounded-full bg-white/30"
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
