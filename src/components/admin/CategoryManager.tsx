"use client";

import { useEffect, useState } from "react";
import { CategoryRecord, MenuItemRecord } from "@/types/app";

export default function CategoryManager() {
  const [categories, setCategories] = useState<CategoryRecord[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItemRecord[]>([]);
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [editingCategory, setEditingCategory] = useState<CategoryRecord | null>(null);
  const [message, setMessage] = useState("");

  const loadData = async () => {
    const [categoriesResponse, menuResponse] = await Promise.all([
      fetch("/api/categories"),
      fetch("/api/menu"),
    ]);

    const [categoriesData, menuData] = await Promise.all([
      categoriesResponse.json(),
      menuResponse.json(),
    ]);

    setCategories(categoriesData);
    setMenuItems(menuData);
  };

  useEffect(() => {
    void loadData();
  }, []);

  const resetForm = () => {
    setName("");
    setImage("");
    setEditingCategory(null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const response = await fetch(editingCategory ? `/api/categories/${editingCategory._id}` : "/api/categories", {
      method: editingCategory ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, image }),
    });
    const data = await response.json();
    if (!response.ok) {
      setMessage(data.message ?? "Unable to save category.");
      return;
    }

    setMessage(editingCategory ? "Category updated." : "Category created.");
    resetForm();
    await loadData();
  };

  const handleEdit = (category: CategoryRecord) => {
    setEditingCategory(category);
    setName(category.name);
    setImage(category.image ?? "");
  };

  const handleDelete = async (id: string) => {
    const response = await fetch(`/api/categories/${id}`, { method: "DELETE" });
    const data = await response.json();
    if (!response.ok) {
      setMessage(data.message ?? "Unable to delete category.");
      return;
    }

    setMessage("Category deleted.");
    await loadData();
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="mb-2 text-4xl font-bold">Category Management</h1>
        <p className="text-zinc-500">
          Create and maintain menu groups like Coffee, Tea, Pastries, and seasonal specials.
        </p>
      </div>

      {message ? <div className="rounded-2xl border border-gold-500/20 bg-gold-500/10 p-4 text-sm text-gold-400">{message}</div> : null}

      <form onSubmit={handleSubmit} className="glass-card space-y-4 rounded-3xl p-8">
        <div className="grid gap-4 md:grid-cols-2">
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Category name"
            className="rounded-2xl border border-zinc-800 bg-zinc-950 px-5 py-4 outline-none transition-all focus:border-gold-500"
            required
          />
          <input
            value={image}
            onChange={(event) => setImage(event.target.value)}
            placeholder="Optional image URL"
            className="rounded-2xl border border-zinc-800 bg-zinc-950 px-5 py-4 outline-none transition-all focus:border-gold-500"
          />
        </div>
        <div className="flex gap-3">
          <button className="rounded-2xl bg-gold-600 px-6 py-3 font-bold text-black transition-colors hover:bg-gold-700">
            {editingCategory ? "Update Category" : "Create Category"}
          </button>
          {editingCategory ? (
            <button type="button" onClick={resetForm} className="rounded-2xl border border-white/10 px-6 py-3 font-bold text-zinc-200 transition-colors hover:border-gold-500 hover:text-gold-500">
              Cancel
            </button>
          ) : null}
        </div>
      </form>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {categories.map((category) => {
          const usageCount = menuItems.filter((item) => {
            const categoryName = typeof item.category === "string" ? item.category : item.category.name;
            return categoryName === category.name;
          }).length;

          return (
            <article key={category._id} className="glass-card rounded-3xl p-6">
              <div className="mb-4 flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold">{category.name}</h3>
                  <p className="text-sm text-zinc-500">{usageCount} menu items</p>
                </div>
                <span className="rounded-full bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.2em] text-zinc-400">
                  {category.slug}
                </span>
              </div>
              {category.image ? <img src={category.image} alt={category.name} className="mb-4 h-36 w-full rounded-2xl object-cover" /> : null}
              <div className="flex gap-3">
                <button onClick={() => handleEdit(category)} className="rounded-xl border border-white/10 px-4 py-2 text-sm transition-colors hover:border-gold-500 hover:text-gold-500">
                  Edit
                </button>
                <button onClick={() => handleDelete(category._id)} className="rounded-xl border border-red-500/20 px-4 py-2 text-sm text-red-400 transition-colors hover:bg-red-500/10">
                  Delete
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
