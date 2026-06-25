"use client";

import { useEffect, useState } from "react";
import MenuForm from "@/features/admin/components/MenuForm";
import MenuItemCard from "@/features/admin/components/MenuItemCard";
import FilterBar from "@/features/menu/components/FilterBar";
import SearchBar from "@/features/menu/components/SearchBar";
import { CategoryRecord, MenuItemRecord } from "@/shared/types/app";

export default function AdminMenuManager() {
  const [items, setItems] = useState<MenuItemRecord[]>([]);
  const [categories, setCategories] = useState<CategoryRecord[]>([]);
  const [editingItem, setEditingItem] = useState<MenuItemRecord | null>(null);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    const [menuResponse, categoriesResponse] = await Promise.all([
      fetch("/api/menu"),
      fetch("/api/categories"),
    ]);
    const [menuData, categoriesData] = await Promise.all([menuResponse.json(), categoriesResponse.json()]);
    return { menuData, categoriesData };
  };

  useEffect(() => {
    let isMounted = true;

    const loadInitialData = async () => {
      setIsLoading(true);
      const { menuData, categoriesData } = await fetchData();
      if (!isMounted) {
        return;
      }
      setItems(menuData);
      setCategories(categoriesData);
      setIsLoading(false);
    };

    void loadInitialData();

    return () => {
      isMounted = false;
    };
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    const { menuData, categoriesData } = await fetchData();
    setItems(menuData);
    setCategories(categoriesData);
    setIsLoading(false);
  };

  const saveItem = async (payload: {
    name: string;
    price: number;
    description: string;
    image: string;
    category?: string;
    categoryName?: string;
    isAvailable: boolean;
  }) => {
    const response = await fetch(editingItem ? `/api/menu/${editingItem.id}` : "/api/menu", {
      method: editingItem ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message ?? "Unable to save menu item.");
    }

    setMessage(editingItem ? "Menu item updated." : "Menu item created.");
    setEditingItem(null);
    await loadData();
  };

  const deleteItem = async (id: string) => {
    const response = await fetch(`/api/menu/${id}`, { method: "DELETE" });
    const data = await response.json();
    if (!response.ok) {
      setMessage(data.message ?? "Unable to delete item.");
      return;
    }
    setMessage("Menu item deleted.");
    await loadData();
  };

  const toggleAvailability = async (item: MenuItemRecord) => {
    const response = await fetch(`/api/menu/${item.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isAvailable: !item.isAvailable }),
    });

    const data = await response.json();
    if (!response.ok) {
      setMessage(data.message ?? "Unable to change availability.");
      return;
    }

    setMessage(`${item.name} is now ${item.isAvailable ? "unavailable" : "available"}.`);
    await loadData();
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
  const editingCategoryId =
    editingItem && typeof editingItem.category !== "string" ? editingItem.category.id : "";

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="mb-2 text-4xl font-bold">Menu Management</h1>
          <p className="text-zinc-500">
            Admins can add, edit, delete, and hide menu items while clients stay read-only.
          </p>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          <div className="glass-card rounded-2xl p-4">
            <p className="text-sm text-zinc-500">Items</p>
            <p className="text-2xl font-bold">{items.length}</p>
          </div>
          <div className="glass-card rounded-2xl p-4">
            <p className="text-sm text-zinc-500">Available</p>
            <p className="text-2xl font-bold text-green-500">{items.filter((item) => item.isAvailable).length}</p>
          </div>
          <div className="glass-card rounded-2xl p-4">
            <p className="text-sm text-zinc-500">Categories</p>
            <p className="text-2xl font-bold">{categories.length}</p>
          </div>
        </div>
      </div>

      {message ? <div className="rounded-2xl border border-gold-500/20 bg-gold-500/10 p-4 text-sm text-gold-400">{message}</div> : null}

      <MenuForm
        key={editingItem?.id ?? "new-item-form"}
        categories={categories}
        initialValues={editingItem ?? undefined}
        initialCategoryId={editingCategoryId}
        submitLabel={editingItem ? "Update Item" : "Create Item"}
        onSubmit={saveItem}
        onCancel={editingItem ? () => setEditingItem(null) : undefined}
      />

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <SearchBar value={search} onChange={setSearch} placeholder="Search items, categories, or descriptions..." />
        <FilterBar categories={filterCategories} activeCategory={activeCategory} onSelect={setActiveCategory} />
      </div>

      {isLoading ? (
        <p className="text-zinc-500">Loading menu items...</p>
      ) : filteredItems.length === 0 ? (
        <div className="glass-card rounded-3xl p-10 text-center text-zinc-400">
          No menu items matched the current search or category filter.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredItems.map((item) => (
            <MenuItemCard
              key={item.id}
              item={item}
              onEdit={setEditingItem}
              onDelete={deleteItem}
              onToggleAvailability={toggleAvailability}
            />
          ))}
        </div>
      )}
    </div>
  );
}
