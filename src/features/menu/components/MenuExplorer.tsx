"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";
import FilterBar from "@/features/menu/components/FilterBar";
import MenuCard from "@/features/menu/components/MenuCard";
import MenuItemDetail from "@/features/menu/components/MenuItemDetail";
import SearchBar from "@/features/menu/components/SearchBar";
import HeroSection from "@/features/menu/components/HeroSection";
import BottomNavigation from "@/features/menu/components/BottomNavigation";
import { CategoryRecord, MenuItemRecord } from "@/shared/types/app";
import { useLanguage } from "@/components/providers/LanguageProvider";

// ─── Skeleton Card ───────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div
      className="rounded-2xl sm:rounded-[1.75rem] overflow-hidden"
      style={{ background: "rgba(16,16,16,0.9)", border: "1px solid rgba(255,255,255,0.05)" }}
    >
      <div className="skeleton h-32 sm:h-44 w-full" />
      <div className="p-2.5 sm:p-4 space-y-2 sm:space-y-3">
        <div className="skeleton h-2.5 sm:h-3 w-12 sm:w-16 rounded-full" />
        <div className="skeleton h-3.5 sm:h-4 w-3/4 rounded-full" />
        <div className="skeleton h-2.5 sm:h-3 w-full rounded-full" />
        <div className="skeleton h-2.5 sm:h-3 w-2/3 rounded-full" />
        <div className="flex justify-end mt-1.5 sm:mt-2">
          <div className="skeleton h-7 sm:h-9 w-16 sm:w-20 rounded-lg sm:rounded-full" />
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
  
  const { locale, t } = useLanguage();

  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [filters, setFilters] = useState({
    vegetarian: false,
    vegan: false,
    spicy: false,
    sugarFree: false,
    minPrice: "",
    maxPrice: ""
  });

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

  // Helper to get localized category name
  const getCatName = (cat: CategoryRecord | string) => {
    if (typeof cat === "string") return cat;
    return locale === "am" && cat.nameAm ? cat.nameAm : cat.name;
  };

  // ── Filtering ──
  const filteredItems = items.filter((item) => {
    const catNameEN = typeof item.category === "string" ? item.category : item.category.name;
    const catNameLocal = getCatName(item.category);
    
    const matchesCat = activeCategory === "All" || catNameEN === activeCategory || catNameLocal === activeCategory;
    
    const q = search.trim().toLowerCase();
    
    const itemNameLocal = locale === "am" && item.nameAm ? item.nameAm : item.name;
    const itemDescLocal = locale === "am" && item.descriptionAm ? item.descriptionAm : (item.description || "");

    const matchesSearch =
      q.length === 0 ||
      item.name.toLowerCase().includes(q) ||
      itemNameLocal.toLowerCase().includes(q) ||
      itemDescLocal.toLowerCase().includes(q) ||
      catNameLocal.toLowerCase().includes(q);

    if (filters.vegetarian && !item.vegetarian) return false;
    if (filters.vegan && !item.vegan) return false;
    if (filters.spicy && !item.spicy) return false;
    if (filters.sugarFree && !item.sugarFree) return false;
    
    if (filters.minPrice && item.price < parseFloat(filters.minPrice)) return false;
    if (filters.maxPrice && item.price > parseFloat(filters.maxPrice)) return false;

    return matchesCat && matchesSearch;
  });

  const filterCategories = [t("menu.all_categories"), ...categories.map((c) => getCatName(c))];

  // Group filtered items by category for section headers
  const groupedItems: Record<string, MenuItemRecord[]> = {};
  filteredItems.forEach((item) => {
    const catName = getCatName(item.category);
    if (!groupedItems[catName]) groupedItems[catName] = [];
    groupedItems[catName].push(item);
  });

  const popularSearches = [...items]
    .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
    .slice(0, 5)
    .map((item) => locale === "am" && item.nameAm ? item.nameAm : item.name);

  return (
    <div id="menu-explorer" className="relative min-h-screen bg-background">
      {/* ── Hero ── (rendered only when requested) */}
      {showHero && <HeroSection mode="full" />}

      {/* ── Search & Filters Bar ── */}
      <div className="relative z-20 px-4 pt-6 pb-2 max-w-3xl mx-auto space-y-4">
        <SearchBar 
          value={search} 
          onChange={setSearch} 
          popularSearches={popularSearches} 
          onFilterToggle={() => setShowAdvancedFilters(!showAdvancedFilters)}
        />
        
        <AnimatePresence>
          {showAdvancedFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="p-5 rounded-3xl bg-[#121212] border border-border shadow-2xl space-y-5">
                
                {/* Properties */}
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Properties & Diet</h4>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { key: 'vegetarian', label: t("menu.vegetarian"), color: 'bg-green-500/10 text-green-400 border-green-500/30' },
                      { key: 'vegan', label: t("menu.vegan"), color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
                      { key: 'spicy', label: t("menu.spicy"), color: 'bg-red-500/10 text-red-400 border-red-500/30' },
                    ].map(prop => (
                      <button
                        key={prop.key}
                        onClick={() => setFilters({ ...filters, [prop.key]: !filters[prop.key as keyof typeof filters] })}
                        className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                          filters[prop.key as keyof typeof filters] 
                            ? prop.color 
                            : 'bg-card border-border text-muted-foreground hover:bg-zinc-800'
                        }`}
                      >
                        {prop.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price */}
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Price Range (ETB)</h4>
                  <div className="flex items-center gap-4">
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-[10px]">ETB</span>
                      <input 
                        type="number" 
                        placeholder="Min"
                        value={filters.minPrice}
                        onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                        className="w-full bg-card border border-border rounded-xl py-2 pl-7 pr-3 text-foreground placeholder-zinc-600 outline-none focus:border-primary/50 text-sm"
                      />
                    </div>
                    <span className="text-zinc-600">-</span>
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-[10px]">ETB</span>
                      <input 
                        type="number" 
                        placeholder="Max"
                        value={filters.maxPrice}
                        onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                        className="w-full bg-card border border-border rounded-xl py-2 pl-7 pr-3 text-foreground placeholder-zinc-600 outline-none focus:border-primary/50 text-sm"
                      />
                    </div>
                  </div>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Sticky Filter Bar ── */}
      <div ref={filterRef} />
      <div
        className={`sticky top-20 z-30 transition-all duration-400 ${
          filterSticky ? "shadow-2xl bg-background/95 backdrop-blur-2xl border-b border-border" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <FilterBar
            categories={filterCategories}
            activeCategory={activeCategory}
            onSelect={(cat) => {
              if (cat === t("menu.all_categories")) setActiveCategory("All");
              else setActiveCategory(cat);
            }}
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
            <Sparkles className="w-4 h-4 text-primary flex-shrink-0" />
            <span className="text-sm text-foreground whitespace-nowrap">
              {message}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Menu Content Grid ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-48">
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6 mt-4 sm:mt-6">
            {Array.from({ length: 8 }).map((_, i) => (
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
            <p className="font-semibold text-muted-foreground mb-2">
              Nothing found
            </p>
            <p className="text-sm text-zinc-600">
              Try a different search query or select another category
            </p>
          </motion.div>
        ) : (
          <div className="space-y-12 mt-6">
            {Object.entries(groupedItems).map(([category, categoryItems]) => (
              <section key={category}>
                {/* Section Header */}
                <div className="flex items-center gap-4 mb-6">
                  <div>
                    <h2
                      className={`text-2xl sm:text-3xl font-bold text-foreground tracking-tight ${locale === "am" ? "font-amharic" : "font-playfair"}`}
                    >
                      {category}
                    </h2>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {categoryItems.length} curated dish{categoryItems.length !== 1 ? "es" : ""}
                    </p>
                  </div>
                  <div className="flex-1 h-px bg-gradient-to-r from-brand-500/20 to-transparent" />
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
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
