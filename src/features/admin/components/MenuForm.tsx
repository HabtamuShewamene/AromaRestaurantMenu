"use client";

import { useState } from "react";
import { CategoryRecord, MenuItemRecord, IngredientRecord, FoodIngredientRecord } from "@/shared/types/app";
import { X, Upload, Plus, Trash2, CheckCircle2 } from "lucide-react";
import Image from "next/image";

type MenuFormProps = {
  categories: CategoryRecord[];
  ingredients?: IngredientRecord[];
  initialValues?: Partial<MenuItemRecord>;
  initialCategoryId?: string;
  submitLabel: string;
  onSubmit: (payload: {
    name: string;
    price: number;
    description: string;
    image: string;
    category?: string;
    categoryName?: string;
    isAvailable: boolean;
    recipe?: FoodIngredientRecord[];
  }) => Promise<void>;
  onCancel?: () => void;
};

export default function MenuForm({
  categories,
  ingredients = [],
  initialValues,
  initialCategoryId = "",
  submitLabel,
  onSubmit,
  onCancel,
}: MenuFormProps) {
  const [name, setName] = useState(initialValues?.name ?? "");
  const [price, setPrice] = useState(initialValues?.price?.toString() ?? "");
  const [description, setDescription] = useState(initialValues?.description ?? "");
  const [image, setImage] = useState(initialValues?.image ?? "");
  const [category, setCategory] = useState(initialCategoryId);
  const [categoryName, setCategoryName] = useState("");
  const [isAvailable, setIsAvailable] = useState(initialValues?.isAvailable ?? true);
  
  // Recipe state
  const [recipe, setRecipe] = useState<FoodIngredientRecord[]>(initialValues?.recipe ?? []);
  const [selectedIng, setSelectedIng] = useState("");
  const [ingQty, setIngQty] = useState("");

  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to upload image");
      }

      setImage(data.imageUrl);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Unable to upload image");
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  };

  const handleAddIngredient = () => {
    if (!selectedIng || !ingQty) return;
    const qty = Number(ingQty);
    if (qty <= 0) return;

    if (recipe.some(r => r.ingredientId === selectedIng)) {
      alert("Ingredient already added. Remove it first to update quantity.");
      return;
    }

    setRecipe([...recipe, { ingredientId: selectedIng, quantity: qty }]);
    setSelectedIng("");
    setIngQty("");
  };

  const handleRemoveIngredient = (id: string) => {
    setRecipe(recipe.filter(r => r.ingredientId !== id));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    setError("");
    setSuccess(false);

    try {
      if (!name.trim()) throw new Error("Item name is required.");
      if (Number(price) < 0) throw new Error("Price cannot be negative.");
      if (!category && !categoryName) throw new Error("Category is required.");

      await onSubmit({
        name: name.trim(),
        price: Number(price),
        description: description.trim(),
        image,
        category: category || undefined,
        categoryName: category ? undefined : categoryName.trim() || undefined,
        isAvailable,
        recipe,
      });

      setSuccess(true);
      if (!initialValues?.id) {
        // Only clear if creating a new item
        setName("");
        setPrice("");
        setDescription("");
        setImage("");
        setCategory("");
        setCategoryName("");
        setIsAvailable(true);
        setRecipe([]);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to save menu item");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full bg-[#111111] md:bg-[#242424] md:rounded-3xl md:border md:border-[#3A3D40] overflow-hidden">
      {/* ── Form Header ── */}
      <div className="flex items-center justify-between p-4 md:p-6 border-b border-[#3A3D40] bg-[#111111] md:bg-[#242424] sticky top-0 z-10">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-[#F7F7F2]">
            {initialValues?.id ? "Edit Menu Item" : "Create Menu Item"}
          </h2>
          <p className="text-xs md:text-sm text-[#A7ABB0] mt-1">
            {initialValues?.id ? "Update the details of this item." : "Add a new dish to your menu."}
          </p>
        </div>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="p-2 rounded-full bg-white/5 text-[#A7ABB0] hover:text-[#F7F7F2] hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* ── Form Body ── */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-8">
        
        {/* Messages */}
        {error && (
          <div className="p-4 rounded-xl bg-[#D95C5C]/10 border border-[#D95C5C]/30 text-[#D95C5C] text-sm font-medium">
            {error}
          </div>
        )}
        {success && (
          <div className="p-4 rounded-xl bg-[#8BD43F]/10 border border-[#8BD43F]/30 text-[#8BD43F] text-sm font-medium flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            Item successfully saved!
          </div>
        )}

        {/* ── Core Details ── */}
        <div className="space-y-5">
          <h3 className="text-sm font-bold text-[#F7F7F2] uppercase tracking-wider border-b border-[#3A3D40] pb-2">
            Core Details
          </h3>
          
          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-semibold text-[#A7ABB0]">Item Name *</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Avocado Toast"
                className="w-full rounded-xl border border-[#3A3D40] bg-[#111111] px-4 py-3 text-sm text-[#F7F7F2] outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary/50"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#A7ABB0]">Price (ETB) *</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
                className="w-full rounded-xl border border-[#3A3D40] bg-[#111111] px-4 py-3 text-sm text-[#F7F7F2] outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary/50"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#A7ABB0]">Category *</label>
              <div className="flex gap-2">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="flex-1 rounded-xl border border-[#3A3D40] bg-[#111111] px-4 py-3 text-sm text-[#F7F7F2] outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary/50 appearance-none"
                >
                  <option value="">Select or create new...</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {category === "" && (
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-semibold text-[#A7ABB0]">New Category Name</label>
                <input
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  placeholder="e.g. Breakfast"
                  className="w-full rounded-xl border border-[#3A3D40] bg-[#111111] px-4 py-3 text-sm text-[#F7F7F2] outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary/50"
                />
              </div>
            )}

            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-semibold text-[#A7ABB0]">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the dish..."
                rows={3}
                className="w-full rounded-xl border border-[#3A3D40] bg-[#111111] px-4 py-3 text-sm text-[#F7F7F2] outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary/50 resize-none"
              />
            </div>
          </div>
        </div>

        {/* ── Image & Status ── */}
        <div className="space-y-5">
          <h3 className="text-sm font-bold text-[#F7F7F2] uppercase tracking-wider border-b border-[#3A3D40] pb-2">
            Presentation & Status
          </h3>
          
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#A7ABB0]">Item Image</label>
              <div className="flex flex-col gap-3">
                {image ? (
                  <div className="relative h-32 w-full rounded-xl overflow-hidden border border-[#3A3D40]">
                    <Image src={image} alt="Preview" fill className="object-cover" />
                    <button
                      type="button"
                      onClick={() => setImage("")}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white hover:bg-red-500/80 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center h-32 w-full rounded-xl border-2 border-dashed border-[#3A3D40] bg-white/5 hover:bg-white/10 transition-colors cursor-pointer text-[#A7ABB0] hover:text-[#F7F7F2] hover:border-primary/50 group">
                    {isUploading ? (
                      <span className="text-sm font-medium animate-pulse">Uploading...</span>
                    ) : (
                      <>
                        <Upload className="w-6 h-6 mb-2 text-muted-foreground group-hover:text-primary transition-colors" />
                        <span className="text-xs font-medium">Click to upload image</span>
                      </>
                    )}
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={isUploading} />
                  </label>
                )}
                <input
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="Or paste an image URL"
                  className="w-full rounded-xl border border-[#3A3D40] bg-[#111111] px-4 py-2.5 text-xs text-[#F7F7F2] outline-none focus:border-primary"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#A7ABB0]">Visibility</label>
                <button
                  type="button"
                  onClick={() => setIsAvailable(!isAvailable)}
                  className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl border transition-all ${
                    isAvailable
                      ? "bg-[#8BD43F]/10 border-[#8BD43F]/30 text-[#8BD43F]"
                      : "bg-[#D95C5C]/10 border-[#D95C5C]/30 text-[#D95C5C]"
                  }`}
                >
                  <span className="font-bold text-sm">
                    {isAvailable ? "Available on Menu" : "Hidden from Menu"}
                  </span>
                  <div className={`w-3 h-3 rounded-full ${isAvailable ? "bg-[#8BD43F]" : "bg-[#D95C5C]"}`} />
                </button>
                <p className="text-[10px] text-[#A7ABB0] mt-1">
                  Hidden items will not appear on the customer storefront.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Recipe (Optional) ── */}
        {ingredients.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-[#F7F7F2] uppercase tracking-wider border-b border-[#3A3D40] pb-2">
              Inventory Recipe (Optional)
            </h3>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <select
                value={selectedIng}
                onChange={(e) => setSelectedIng(e.target.value)}
                className="flex-1 rounded-xl border border-[#3A3D40] bg-[#111111] px-4 py-2.5 text-sm text-[#F7F7F2] outline-none focus:border-primary appearance-none"
              >
                <option value="">Select ingredient...</option>
                {ingredients.map((i) => (
                  <option key={i.id} value={i.id}>{i.name} ({i.unit})</option>
                ))}
              </select>
              <input
                type="number"
                min="0"
                step="0.01"
                value={ingQty}
                onChange={(e) => setIngQty(e.target.value)}
                placeholder="Quantity"
                className="w-full sm:w-28 rounded-xl border border-[#3A3D40] bg-[#111111] px-4 py-2.5 text-sm text-[#F7F7F2] outline-none focus:border-primary"
              />
              <button
                type="button"
                onClick={handleAddIngredient}
                className="rounded-xl bg-white/10 px-4 py-2.5 text-sm font-bold text-white hover:bg-white/20 transition-colors flex items-center justify-center gap-1 shrink-0"
              >
                <Plus className="w-4 h-4" /> Add
              </button>
            </div>

            {recipe.length > 0 && (
              <div className="space-y-2 mt-3">
                {recipe.map((r, idx) => {
                  const ingDef = ingredients.find((i) => i.id === r.ingredientId);
                  return (
                    <div key={idx} className="flex items-center justify-between rounded-xl border border-[#3A3D40] bg-white/5 p-3">
                      <div className="text-sm">
                        <span className="font-bold text-[#F7F7F2]">{ingDef?.name || "Unknown"}</span>
                        <span className="text-[#A7ABB0] ml-2">
                          {r.quantity} {ingDef?.unit}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveIngredient(r.ingredientId)}
                        className="p-1.5 rounded-lg text-[#D95C5C] hover:bg-[#D95C5C]/10 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Form Footer Actions ── */}
      <div className="p-4 md:p-6 border-t border-[#3A3D40] bg-[#111111] md:bg-[#242424] flex gap-3 sticky bottom-0">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isSaving}
            className="flex-1 py-3.5 rounded-xl border border-[#3A3D40] text-[#A7ABB0] font-bold hover:text-[#F7F7F2] hover:bg-white/5 transition-colors"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isSaving}
          className="flex-[2] py-3.5 rounded-xl bg-primary text-primary-foreground font-black tracking-wide uppercase hover:bg-[#7bc235] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_14px_rgba(139,212,63,0.3)]"
        >
          {isSaving ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
