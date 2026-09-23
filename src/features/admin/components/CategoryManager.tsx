"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { CategoryRecord, MenuItemRecord } from "@/shared/types/app";
import { Pencil, Trash2, Plus, X } from "lucide-react";

export default function CategoryManager() {
  const [categories, setCategories] = useState<CategoryRecord[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItemRecord[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryRecord | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [nameAm, setNameAm] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [descriptionAm, setDescriptionAm] = useState("");
  const [status, setStatus] = useState(true);
  const [orderIndex, setOrderIndex] = useState("0");

  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const fetchData = async () => {
    const [categoriesResponse, menuResponse] = await Promise.all([
      fetch("/api/categories"),
      fetch("/api/menu"),
    ]);
    const [categoriesData, menuData] = await Promise.all([
      categoriesResponse.json(),
      menuResponse.json(),
    ]);
    return { categoriesData, menuData };
  };

  useEffect(() => {
    let isMounted = true;
    const loadInitialData = async () => {
      setIsLoading(true);
      const { categoriesData, menuData } = await fetchData();
      if (!isMounted) return;
      setCategories(categoriesData);
      setMenuItems(Array.isArray(menuData) ? menuData : []);
      setIsLoading(false);
    };
    void loadInitialData();
    return () => { isMounted = false; };
  }, []);

  const loadData = async () => {
    const { categoriesData, menuData } = await fetchData();
    setCategories(categoriesData);
    setMenuItems(Array.isArray(menuData) ? menuData : []);
  };

  const openNewForm = () => {
    setEditingCategory(null);
    setName("");
    setNameAm("");
    setImage("");
    setDescription("");
    setDescriptionAm("");
    setStatus(true);
    setOrderIndex("0");
    setIsFormOpen(true);
  };

  const openEditForm = (category: CategoryRecord) => {
    setEditingCategory(category);
    setName(category.name);
    setNameAm(category.nameAm ?? "");
    setImage(category.image ?? "");
    setDescription(category.description ?? "");
    setDescriptionAm(category.descriptionAm ?? "");
    setStatus(category.status ?? true);
    setOrderIndex(category.orderIndex?.toString() ?? "0");
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingCategory(null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    setMessage("");

    const payload = {
      name: name.trim(),
      nameAm: nameAm.trim() || undefined,
      image: image.trim(),
      description: description.trim(),
      descriptionAm: descriptionAm.trim() || undefined,
      status,
      orderIndex: parseInt(orderIndex, 10) || 0,
    };

    try {
      const response = await fetch(editingCategory ? `/api/categories/${editingCategory.id}` : "/api/categories", {
        method: editingCategory ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message ?? "Unable to save category.");
      
      closeForm();
      await loadData();
    } catch (err: any) {
      alert(err.message || "An error occurred.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (category: CategoryRecord, usageCount: number) => {
    if (usageCount > 0) {
      alert(`This category contains ${usageCount} menu items. Move these items to another category before deleting it.`);
      return;
    }

    if (!confirm(`Are you sure you want to delete the "${category.name}" category?`)) return;

    const response = await fetch(`/api/categories/${category.id}`, { method: "DELETE" });
    if (!response.ok) {
      const data = await response.json();
      alert(data.message ?? "Unable to delete category.");
      return;
    }
    await loadData();
  };

  // Prevent background scrolling on mobile when form is open
  useEffect(() => {
    if (isFormOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [isFormOpen]);

  // Sort categories by orderIndex then by name
  const sortedCategories = [...categories].sort((a, b) => {
    if (a.orderIndex !== b.orderIndex) return (a.orderIndex || 0) - (b.orderIndex || 0);
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="relative min-h-screen">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-8 sticky top-0 md:relative z-20 bg-background/95 backdrop-blur-md pt-2 pb-4 border-b border-border md:border-none">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">Categories</h1>
          <p className="text-sm text-muted-foreground mt-1 hidden sm:block">
            Organize your menu into clear, navigable sections.
          </p>
        </div>
        <button
          onClick={openNewForm}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-primary text-primary-foreground font-bold tracking-wide uppercase hover:bg-[#7bc235] transition-transform active:scale-95 shadow-[0_4px_14px_rgba(139,212,63,0.3)] w-full sm:w-auto"
        >
          <Plus className="w-5 h-5" />
          <span>Add Category</span>
        </button>
      </div>

      {/* ── Content Grid ── */}
      {isLoading ? (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
          {[1,2,3,4].map((i) => (
            <div key={i} className="h-48 rounded-3xl bg-[#242424] animate-pulse" />
          ))}
        </div>
      ) : sortedCategories.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center rounded-3xl border border-dashed border-[#3A3D40] bg-[#242424]/50">
          <div className="w-16 h-16 rounded-full bg-[#3A3D40] flex items-center justify-center mb-4 text-2xl">
            📂
          </div>
          <h3 className="text-xl font-bold text-[#F7F7F2]">No categories yet</h3>
          <p className="text-[#A7ABB0] text-sm max-w-md mt-2 mb-6">
            Create categories to help customers find what they are looking for quickly.
          </p>
          <button onClick={openNewForm} className="px-6 py-2.5 rounded-full bg-white/10 text-[#F7F7F2] font-bold text-sm hover:bg-white/20 transition-colors">
            Create Category
          </button>
        </div>
      ) : (
        <div className="grid gap-3 sm:gap-5 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 pb-10">
          {sortedCategories.map((category) => {
            const usageCount = menuItems.filter((item) => {
              const categoryName = typeof item.category === "string" ? item.category : item.category?.name;
              return categoryName === category.name;
            }).length;

            return (
              <article key={category.id} className="bg-[#242424] rounded-3xl border border-[#3A3D40] overflow-hidden flex flex-col justify-between transition-all hover:border-primary/40 relative">
                {/* ── Image & Badges ── */}
                <div className="relative h-28 sm:h-40 w-full bg-black/40 border-b border-[#3A3D40]">
                  {category.image ? (
                    <Image src={category.image} alt={category.name} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-white/5 text-3xl">
                      📂
                    </div>
                  )}
                  {/* Status Badge */}
                  <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex items-center gap-1 sm:gap-1.5 px-2 py-1 sm:px-2.5 sm:py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/10">
                    <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${category.status !== false ? "bg-[#8BD43F]" : "bg-[#D95C5C]"}`} />
                    <span className="text-[8px] sm:text-[10px] font-bold text-white uppercase tracking-wider">
                      {category.status !== false ? "Active" : "Hidden"}
                    </span>
                  </div>
                  <div className="absolute top-2 right-2 sm:top-3 sm:right-3 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full bg-primary/90 text-primary-foreground text-[8px] sm:text-[10px] font-bold uppercase tracking-widest shadow-lg">
                    {usageCount} item{usageCount !== 1 ? 's' : ''}
                  </div>
                </div>

                <div className="p-3 sm:p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm sm:text-lg font-bold text-[#F7F7F2] leading-tight mb-1">{category.name}</h3>
                    {category.description && (
                      <p className="text-[10px] sm:text-sm text-[#A7ABB0] mt-1 sm:mt-2 line-clamp-2">{category.description}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between px-3 pb-3 sm:px-5 sm:pb-5 gap-2">
                  <button onClick={() => openEditForm(category)} className="flex-1 py-1.5 sm:py-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20 font-bold text-xs sm:text-sm hover:bg-primary hover:text-primary-foreground transition-colors flex items-center justify-center gap-1.5 sm:gap-2">
                    <Pencil className="w-3 h-3 sm:w-4 sm:h-4" /> <span className="hidden sm:inline">Edit Category</span><span className="sm:hidden">Edit</span>
                  </button>
                  <button onClick={() => handleDelete(category, usageCount)} className="p-1.5 sm:p-2.5 rounded-xl border border-[#3A3D40] text-[#D95C5C] hover:bg-[#D95C5C]/10 transition-colors">
                    <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* ── Form Overlay ── */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center sm:p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={closeForm} />
          <div className="relative w-full max-w-lg max-h-[90vh] md:max-h-[85vh] h-full sm:h-auto animate-in slide-in-from-bottom-full md:slide-in-from-bottom-10 md:fade-in duration-300 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col bg-[#111111] md:bg-[#242424] md:border md:border-[#3A3D40] overflow-hidden">
            
            <div className="flex items-center justify-between p-4 md:p-6 border-b border-[#3A3D40] sticky top-0 bg-[#111111] md:bg-[#242424] z-10">
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-[#F7F7F2]">{editingCategory ? "Edit Category" : "Create Category"}</h2>
                <p className="text-xs md:text-sm text-[#A7ABB0] mt-1">Configure section details.</p>
              </div>
              <button onClick={closeForm} className="p-2 rounded-full bg-white/5 text-[#A7ABB0] hover:text-[#F7F7F2] hover:bg-white/10 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 md:p-6">
              <form id="category-form" onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#A7ABB0]">Name (English) *</label>
                  <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Main Course" className="w-full rounded-xl border border-[#3A3D40] bg-[#111111] px-4 py-3 text-sm text-[#F7F7F2] outline-none transition-all focus:border-primary" required />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#A7ABB0]">Name (Amharic)</label>
                  <input value={nameAm} onChange={(e) => setNameAm(e.target.value)} placeholder="e.g. ዋና ምግብ" className="w-full rounded-xl border border-[#3A3D40] bg-[#111111] px-4 py-3 text-sm text-[#F7F7F2] outline-none transition-all focus:border-primary font-amharic" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#A7ABB0]">Description (English)</label>
                  <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Brief description of this section" rows={2} className="w-full rounded-xl border border-[#3A3D40] bg-[#111111] px-4 py-3 text-sm text-[#F7F7F2] outline-none transition-all focus:border-primary resize-none" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#A7ABB0]">Description (Amharic)</label>
                  <textarea value={descriptionAm} onChange={(e) => setDescriptionAm(e.target.value)} placeholder="የዚህ ክፍል አጭር መግለጫ" rows={2} className="w-full rounded-xl border border-[#3A3D40] bg-[#111111] px-4 py-3 text-sm text-[#F7F7F2] outline-none transition-all focus:border-primary resize-none font-amharic" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#A7ABB0]">Image URL (Optional)</label>
                  <input value={image} onChange={(e) => setImage(e.target.value)} placeholder="https://..." className="w-full rounded-xl border border-[#3A3D40] bg-[#111111] px-4 py-3 text-sm text-[#F7F7F2] outline-none transition-all focus:border-primary" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#A7ABB0]">Display Order</label>
                    <input type="number" value={orderIndex} onChange={(e) => setOrderIndex(e.target.value)} placeholder="0" className="w-full rounded-xl border border-[#3A3D40] bg-[#111111] px-4 py-3 text-sm text-[#F7F7F2] outline-none transition-all focus:border-primary" />
                    <p className="text-[10px] text-[#A7ABB0]">Lower numbers appear first.</p>
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#A7ABB0]">Visibility</label>
                    <button type="button" onClick={() => setStatus(!status)} className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl border transition-all ${status ? "bg-[#8BD43F]/10 border-[#8BD43F]/30 text-[#8BD43F]" : "bg-[#D95C5C]/10 border-[#D95C5C]/30 text-[#D95C5C]"}`}>
                      <span className="font-bold text-sm">{status ? "Active" : "Hidden"}</span>
                      <div className={`w-3 h-3 rounded-full ${status ? "bg-[#8BD43F]" : "bg-[#D95C5C]"}`} />
                    </button>
                  </div>
                </div>
              </form>
            </div>

            <div className="p-4 md:p-6 border-t border-[#3A3D40] bg-[#111111] md:bg-[#242424] sticky bottom-0">
              <button type="submit" form="category-form" disabled={isSaving} className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-black tracking-wide uppercase hover:bg-[#7bc235] transition-colors disabled:opacity-50">
                {isSaving ? "Saving..." : (editingCategory ? "Update Category" : "Create Category")}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
