"use client";

import { useEffect, useState } from "react";
import FilterBar from "@/components/client/FilterBar";
import MenuCard from "@/components/client/MenuCard";
import SearchBar from "@/components/client/SearchBar";
import { CategoryRecord, CartItemRecord, MenuItemRecord } from "@/types/app";

const CART_STORAGE_KEY = "cafe-menu-cart";

export default function MenuExplorer() {
  const [items, setItems] = useState<MenuItemRecord[]>([]);
  const [categories, setCategories] = useState<CategoryRecord[]>([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      const [menuResponse, categoriesResponse] = await Promise.all([
        fetch("/api/menu"),
        fetch("/api/categories"),
      ]);

      const [menuData, categoriesData] = await Promise.all([
        menuResponse.json(),
        categoriesResponse.json(),
      ]);

      setItems(menuData);
      setCategories(categoriesData);
      setIsLoading(false);
    };

    void loadData();
  }, []);

  const addToCart = (item: MenuItemRecord, quantity: number) => {
    if (!item.isAvailable) {
      setMessage(`${item.name} is currently unavailable.`);
      return;
    }

    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    const currentItems: CartItemRecord[] = raw ? JSON.parse(raw) : [];
    const existing = currentItems.find((entry) => entry.menuItem === item._id);
    const categoryName = typeof item.category === "string" ? item.category : item.category.name;

    const nextItems = existing
      ? currentItems.map((entry) =>
          entry.menuItem === item._id ? { ...entry, quantity: entry.quantity + quantity } : entry
        )
      : [
          ...currentItems,
          {
            id: crypto.randomUUID(),
            menuItem: item._id,
            name: item.name,
            price: item.price,
            quantity,
            image: item.image,
            category: categoryName,
            isAvailable: item.isAvailable,
          },
        ];

    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(nextItems));
    window.dispatchEvent(new Event("cart-updated"));
    setMessage(`${item.name} added to cart.`);
  };

  const filteredItems = items.filter((item) => {
    const categoryName = typeof item.category === "string" ? item.category : item.category.name;
    const matchesCategory = activeCategory === "All" || categoryName === activeCategory;
    const query = search.trim().toLowerCase();
    const matchesSearch =
      query.length === 0 ||
      item.name.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query) ||
      categoryName.toLowerCase().includes(query);

    return matchesCategory && matchesSearch;
  });

  const filterCategories = ["All", ...categories.map((category) => category.name)];

  return (
    <section className="mx-auto max-w-7xl px-4 pt-32 pb-24">
      <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-3 text-sm uppercase tracking-[0.3em] text-gold-500">Cafe Menu</p>
          <h1 className="text-5xl font-bold tracking-tight">Browse every drink, pastry, and plate.</h1>
          <p className="mt-4 max-w-2xl text-zinc-500">
            Clients can search, filter, check stock status, and add available items straight to cart.
          </p>
        </div>
        <SearchBar value={search} onChange={setSearch} />
      </div>

      <div className="mb-10">
        <FilterBar categories={filterCategories} activeCategory={activeCategory} onSelect={setActiveCategory} />
      </div>

      {message ? <div className="mb-6 rounded-2xl border border-gold-500/20 bg-gold-500/10 p-4 text-sm text-gold-400">{message}</div> : null}

      {isLoading ? (
        <p className="text-zinc-500">Loading menu...</p>
      ) : filteredItems.length === 0 ? (
        <div className="glass-card rounded-3xl p-10 text-center text-zinc-400">
          No menu items matched your search or category filter.
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {filteredItems.map((item) => (
            <MenuCard key={item._id} item={item} onAddToCart={addToCart} />
          ))}
        </div>
      )}
    </section>
  );
}
