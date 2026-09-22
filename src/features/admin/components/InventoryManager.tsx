"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Package, Save, X } from "lucide-react";
import { IngredientRecord } from "@/shared/types/app";

export default function InventoryManager() {
  const [ingredients, setIngredients] = useState<IngredientRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<IngredientRecord>>({});
  const [isCreating, setIsCreating] = useState(false);

  const loadIngredients = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/admin/inventory");
      const data = await response.json();
      setIngredients(Array.isArray(data) ? data : []);
    } catch {
      setMessage("Failed to load inventory.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadIngredients();
  }, []);

  const handleCreate = () => {
    setIsCreating(true);
    setEditingId(null);
    setFormData({
      name: "",
      currentStock: 0,
      unit: "kg",
      minimumStock: 0
    });
  };

  const handleEdit = (item: IngredientRecord) => {
    setIsCreating(false);
    setEditingId(item.id);
    setFormData({ ...item });
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingId(null);
    setFormData({});
  };

  const handleSave = async () => {
    try {
      const url = isCreating ? "/api/admin/inventory" : `/api/admin/inventory/${editingId}`;
      const method = isCreating ? "POST" : "PUT";
      
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to save");
      }

      setMessage(`Ingredient ${isCreating ? "created" : "updated"} successfully.`);
      handleCancel();
      await loadIngredients();
    } catch {
      setMessage("An error occurred while saving.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this ingredient?")) return;
    try {
      const response = await fetch(`/api/admin/inventory/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error();
      setMessage("Ingredient deleted.");
      await loadIngredients();
    } catch {
      setMessage("Failed to delete ingredient.");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mb-2 text-4xl font-bold">Inventory Management</h1>
          <p className="text-muted-foreground">Track and manage raw ingredients and stock levels.</p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 rounded-xl bg-primary px-5 py-3 font-bold text-primary-foreground transition-transform hover:scale-105"
        >
          <Plus className="h-5 w-5" /> Add Ingredient
        </button>
      </div>

      {message && (
        <div className="rounded-2xl border border-primary/20 bg-primary/10 p-4 text-sm text-primary">
          {message}
        </div>
      )}

      {/* Form Inline Editor */}
      {(isCreating || editingId) && (
        <div className="glass-card rounded-3xl p-6 border border-primary/30">
          <h2 className="mb-4 text-xl font-bold">{isCreating ? "New Ingredient" : "Edit Ingredient"}</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase">Name</label>
              <input
                type="text"
                value={formData.name || ""}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full rounded-xl border border-border bg-card/50 px-4 py-2 outline-none focus:border-primary"
                placeholder="e.g. Arabica Beans"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase">Stock</label>
              <input
                type="number"
                value={formData.currentStock || ""}
                onChange={(e) => setFormData({ ...formData, currentStock: Number(e.target.value) })}
                className="w-full rounded-xl border border-border bg-card/50 px-4 py-2 outline-none focus:border-primary"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase">Unit</label>
              <input
                type="text"
                value={formData.unit || ""}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                className="w-full rounded-xl border border-border bg-card/50 px-4 py-2 outline-none focus:border-primary"
                placeholder="e.g. kg, ml, pcs"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase">Minimum Stock</label>
              <input
                type="number"
                step="0.01"
                value={formData.minimumStock || ""}
                onChange={(e) => setFormData({ ...formData, minimumStock: Number(e.target.value) })}
                className="w-full rounded-xl border border-border bg-card/50 px-4 py-2 outline-none focus:border-primary"
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <button onClick={handleCancel} className="flex items-center gap-2 rounded-xl border border-zinc-700 px-4 py-2 text-muted-foreground hover:bg-zinc-800">
              <X className="h-4 w-4" /> Cancel
            </button>
            <button onClick={handleSave} className="flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2 text-primary-foreground font-bold hover:bg-primary">
              <Save className="h-4 w-4" /> Save
            </button>
          </div>
        </div>
      )}

      {/* Inventory List */}
      <div className="glass-card overflow-hidden rounded-3xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-muted-foreground">
            <thead className="bg-foreground/5 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-6 py-4">Ingredient Name</th>
                <th className="px-6 py-4">Current Stock</th>
                <th className="px-6 py-4">Min Stock</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">Loading inventory...</td>
                </tr>
              ) : ingredients.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">No ingredients found.</td>
                </tr>
              ) : (
                ingredients.map((item) => (
                  <tr key={item.id} className="transition-colors hover:bg-foreground/5">
                    <td className="px-6 py-4 font-medium text-foreground flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-card">
                        <Package className="h-4 w-4 text-muted-foreground" />
                      </div>
                      {item.name}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-md ${item.currentStock < item.minimumStock ? 'bg-red-500/10 text-red-400' : 'bg-green-500/10 text-green-400'}`}>
                        {item.currentStock} {item.unit}
                      </span>
                    </td>
                    <td className="px-6 py-4">{item.minimumStock} {item.unit}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="rounded-lg bg-zinc-800 p-2 text-muted-foreground transition-colors hover:bg-zinc-700 hover:text-foreground"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="rounded-lg bg-red-500/10 p-2 text-red-500 transition-colors hover:bg-red-500/20"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
