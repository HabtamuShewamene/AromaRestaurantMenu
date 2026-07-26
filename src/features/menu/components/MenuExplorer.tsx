"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Sparkles } from "lucide-react";
import FilterBar from "@/features/menu/components/FilterBar";
import MenuCard from "@/features/menu/components/MenuCard";
import MenuItemDetail from "@/features/menu/components/MenuItemDetail";
import SearchBar from "@/features/menu/components/SearchBar";
import HeroSection from "@/features/menu/components/HeroSection";
import BottomNavigation from "@/features/menu/components/BottomNavigation";
import { CategoryRecord, MenuItemRecord } from "@/shared/types/app";

// ─── Skeleton Card ───────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div
      className="rounded-[1.75rem] overflow-hidden"
      style={{ background: "rgba(16,16,16,0.9)", border: "1px solid rgba(255,255,255,0.05)" }}
    >
      <div className="skeleton h-44 w-full" />
      <div className="p-4 space-y-3">
        <div className="skeleton h-3 w-16 rounded-full" />
        <div className="skeleton h-4 w-3/4 rounded-full" />
        <div className="skeleton h-3 w-full rounded-full" />
        <div className="skeleton h-3 w-2/3 rounded-full" />
        <div className="flex justify-end mt-2">
          <div className="skeleton h-9 w-20 rounded-full" />
        </div>
      </div>
    </div>
  );
}


// ─── Main MenuExplorer ────────────────────────────────────────────
export default function MenuExplorer({ showHero = false }: { showHero?: boolean }) {

  const [items, setItems] = useState<MenuItemRecord[]>([]);
  const [categories, setCategories] = useState<CategoryRecord[]>([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<MenuItemRecord | null>(null);

  const filterRef = useRef<HTMLDivElement>(null);
  const [filterSticky, setFilterSticky] = useState(false);

  // ── Load data ──
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [menuRes, catRes] = await Promise.all([
          fetch("/api/menu"),
          fetch("/api/categories"),
        ]);
        const [menuData, catData] = await Promise.all([
          menuRes.json(),
          catRes.json(),
        ]);
        setItems(Array.isArray(menuData) ? menuData : []);
        setCategories(Array.isArray(catData) ? catData : []);
      } catch {
        setItems([]);
        setCategories([]);
        setMessage("Unable to load menu right now.");
      } finally {
        setIsLoading(false);
      }
    };
    void loadData();
  }, []);


  // ── Sticky filter detection ──
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setFilterSticky(!entry.isIntersecting),
      { rootMargin: "-80px 0px 0px 0px", threshold: 0 }
    );
    if (filterRef.current) observer.observe(filterRef.current);
    return () => observer.disconnect();
  }, []);


  // ── Filtering ──
  const filteredItems = items.filter((item) => {
    const catName =
      typeof item.category === "string" ? item.category : item.category.name;
    const matchesCat = activeCategory === "All" || catName === activeCategory;
    const q = search.trim().toLowerCase();
    const matchesSearch =
      q.length === 0 ||
      item.name.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      catName.toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });

  const filterCategories = ["All", ...categories.map((c) => c.name)];

  // Group filtered items by category for section headers
  const groupedItems: Record<string, MenuItemRecord[]> = {};
  filteredItems.forEach((item) => {
    const catName =
      typeof item.category === "string" ? item.category : item.category.name;
    if (!groupedItems[catName]) groupedItems[catName] = [];
    groupedItems[catName].push(item);
  });

  return (
    <div id="menu-explorer" className="relative min-h-screen bg-[#080808]">
      {/* ── Hero ── (rendered only when requested) */}
      {showHero && <HeroSection mode="full" />}

      {/* ── Floating Search (overlapping hero bottom) ── */}
      <div className="relative z-20 px-4 -mt-6 mb-4 max-w-2xl mx-auto">
        <SearchBar value={search} onChange={setSearch} />
      </div>

      {/* ── Sticky Filter Bar ── */}
      <div ref={filterRef} />
      <div
        className={`sticky top-16 z-30 transition-all duration-400 ${
          filterSticky ? "shadow-2xl" : ""
        }`}
        style={
          filterSticky
            ? {
                background: "rgba(8,8,8,0.92)",
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
                borderBottom: "1px solid rgba(255,255,255,0.05)",
              }
            : {}
        }
      >
        <div className="max-w-2xl mx-auto px-4 py-3">
          <FilterBar
            categories={filterCategories}
            activeCategory={activeCategory}
            onSelect={setActiveCategory}
          />
        </div>
      </div>

      {/* ── Toast notification ── */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: 20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 20, x: "-50%" }}
            className="fixed bottom-28 sm:bottom-36 left-1/2 z-50 flex items-center gap-2 px-5 py-3 rounded-2xl shadow-xl"
            style={{
              background: "rgba(18,18,18,0.95)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(182,141,64,0.25)",
            }}
          >
            <Sparkles className="w-4 h-4 text-gold-400 flex-shrink-0" />
            <span className="text-sm text-zinc-200 whitespace-nowrap">
              {message}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Menu Content ── */}
      <main className="max-w-2xl mx-auto px-4 pb-48">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
            {Array.from({ length: 6 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
        ) : filteredItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div
              className="w-20 h-20 rounded-3xl flex items-center justify-center mb-5"
              style={{
                background: "rgba(182,141,64,0.08)",
                border: "1px solid rgba(182,141,64,0.15)",
              }}
            >
              <span className="text-4xl">🍽️</span>
            </div>
            <p className="font-semibold text-zinc-300 mb-2">
              Nothing found
            </p>
            <p className="text-sm text-zinc-600">
              Try a different search or category
            </p>
          </motion.div>
        ) : (
          <div className="space-y-8 mt-6">
            {Object.entries(groupedItems).map(([category, categoryItems]) => (
              <section key={category}>
                {/* Section Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div>
                    <h2
                      className="text-lg font-bold text-white"
                      style={{ fontFamily: "var(--font-playfair, serif)" }}
                    >
                      {category}
                    </h2>
                    <p className="text-xs text-zinc-600">
                      {categoryItems.length} item{categoryItems.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <div className="flex-1 h-px bg-gradient-to-r from-gold-500/20 to-transparent" />
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categoryItems.map((item, i) => (
                    <MenuCard
                      key={item.id}
                      item={item}
                      onViewDetails={setSelectedItem}
                      index={i}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </main>


      {/* ── Item Detail Modal ── */}
      {selectedItem && (
        <MenuItemDetail
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}

      {/* ── Bottom Navigation ── */}
      <BottomNavigation />
    </div>
  );
}
