"use client";

import { useEffect, useState } from "react";
import MenuForm from "@/features/admin/components/MenuForm";
import MenuItemCard from "@/features/admin/components/MenuItemCard";
import FilterBar from "@/features/menu/components/FilterBar";
import SearchBar from "@/features/menu/components/SearchBar";
import { CategoryRecord, MenuItemRecord } from "@/shared/types/app";
import { Plus } from "lucide-react";

export default function AdminMenuManager() {
  const [items, setItems] = useState<MenuItemRecord[]>([]);
  const [categories, setCategories] = useState<CategoryRecord[]>([]);
  const [ingredients, setIngredients] = useState<any[]>([]);
  
  // State for the form overlay
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItemRecord | null>(null);
  
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    const [menuResponse, categoriesResponse, inventoryResponse] = await Promise.all([
      fetch("/api/menu"),
      fetch("/api/categories"),
      fetch("/api/admin/inventory"),
    ]);
    const [menuData, categoriesData, inventoryData] = await Promise.all([
      menuResponse.json(),
      categoriesResponse.json(),
      inventoryResponse.json(),
    ]);
    return { menuData, categoriesData, inventoryData };
  };

  useEffect(() => {
    let isMounted = true;

    const loadInitialData = async () => {
      setIsLoading(true);
      const { menuData, categoriesData, inventoryData } = await fetchData();
      if (!isMounted) return;
      
      setItems(menuData);
      setCategories(categoriesData);
      setIngredients(Array.isArray(inventoryData) ? inventoryData : []);
      setIsLoading(false);
    };

    void loadInitialData();
    return () => { isMounted = false; };
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    const { menuData, categoriesData, inventoryData } = await fetchData();
    setItems(menuData);
    setCategories(categoriesData);
    setIngredients(Array.isArray(inventoryData) ? inventoryData : []);
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
    recipe?: any[];
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

    closeForm();
    await loadData();
  };

  const deleteItem = async (id: string) => {
    const response = await fetch(`/api/menu/${id}`, { method: "DELETE" });
    if (!response.ok) {
      const data = await response.json();
      alert(data.message ?? "Unable to delete item.");
      return;
    }
    await loadData();
  };

  const toggleAvailability = async (item: MenuItemRecord) => {
    const response = await fetch(`/api/menu/${item.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isAvailable: !item.isAvailable }),
    });

    if (!response.ok) {
      const data = await response.json();
      alert(data.message ?? "Unable to change availability.");
      return;
    }

    await loadData();
  };

  const openNewForm = () => {
    setEditingItem(null);
    setIsFormOpen(true);
  };

  const openEditForm = (item: MenuItemRecord) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingItem(null);
  };

  // Prevent background scrolling on mobile when form is open
  useEffect(() => {
    if (isFormOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isFormOpen]);

  const filteredItems = items.filter((item) => {
    const categoryName = typeof item.category === "string" ? item.category : item.category?.name || "Uncategorized";
    const matchesCategory = activeCategory === "All" || categoryName === activeCategory;
    const query = search.trim().toLowerCase();
    const matchesSearch =
      query.length === 0 ||
      item.name.toLowerCase().includes(query) ||
      (item.description ? item.description.toLowerCase().includes(query) : false) ||
      categoryName.toLowerCase().includes(query);

    return matchesCategory && matchesSearch;
  });

  const filterCategories = ["All", ...categories.map((category) => category.name)];
  const editingCategoryId = editingItem && typeof editingItem.category !== "string" ? editingItem.category?.id : "";

  return (
    <div className="relative min-h-screen">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 md:mb-8 sticky top-0 md:relative z-20 bg-background/95 backdrop-blur-md pt-2 pb-4 border-b border-border md:border-none w-full">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">Menu Management</h1>
          <p className="text-sm text-muted-foreground mt-1 hidden sm:block">
            Create, edit, and organize your digital storefront.
          </p>
        </div>
        
        <button
          onClick={openNewForm}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-primary text-primary-foreground font-bold tracking-wide uppercase hover:bg-[#7bc235] transition-transform active:scale-95 shadow-[0_4px_14px_rgba(139,212,63,0.3)] w-full sm:w-auto"
        >
          <Plus className="w-5 h-5" />
          <span>Add Item</span>
        </button>
      </div>

      {/* ── Filters & Search ── */}
      <div className="flex flex-col gap-4 mb-8">
        <SearchBar value={search} onChange={setSearch} placeholder="Search by name, description, or category..." />
        <FilterBar categories={filterCategories} activeCategory={activeCategory} onSelect={setActiveCategory} />
      </div>

      {/* ── Content Grid ── */}
      {isLoading ? (
        <div className="grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {[1,2,3,4].map((i) => (
            <div key={i} className="h-[360px] rounded-3xl bg-[#242424] animate-pulse" />
          ))}
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center rounded-3xl border border-dashed border-[#3A3D40] bg-[#242424]/50">
          <div className="w-16 h-16 rounded-full bg-[#3A3D40] flex items-center justify-center mb-4 text-2xl">
            🍽️
          </div>
          <h3 className="text-xl font-bold text-[#F7F7F2]">No menu items found</h3>
          <p className="text-[#A7ABB0] text-sm max-w-md mt-2 mb-6">
            We couldn't find anything matching your search. Try adjusting your filters or create a new item.
          </p>
          <button
            onClick={openNewForm}
            className="px-6 py-2.5 rounded-full bg-white/10 text-[#F7F7F2] font-bold text-sm hover:bg-white/20 transition-colors"
          >
            Create New Item
          </button>
        </div>
      ) : (
        <div className="grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 pb-10">
          {filteredItems.map((item) => (
            <MenuItemCard
              key={item.id}
              item={item}
              onEdit={openEditForm}
              onDelete={deleteItem}
              onToggleAvailability={toggleAvailability}
            />
          ))}
        </div>
      )}

      {/* ── Form Overlay (Mobile Sheet / Desktop Modal) ── */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center sm:p-4">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={closeForm}
          />
          <div className="relative w-full max-w-2xl max-h-[90vh] md:max-h-[85vh] h-full sm:h-auto animate-in slide-in-from-bottom-full md:slide-in-from-bottom-10 md:fade-in duration-300 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden">
            <MenuForm
              key={editingItem?.id ?? "new-item"}
              categories={categories}
              ingredients={ingredients}
              initialValues={editingItem ?? undefined}
              initialCategoryId={editingCategoryId}
              submitLabel={editingItem ? "Save Changes" : "Create Item"}
              onSubmit={saveItem}
              onCancel={closeForm}
            />
          </div>
        </div>
      )}
    </div>
  );
}
