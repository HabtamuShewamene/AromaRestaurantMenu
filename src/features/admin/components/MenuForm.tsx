"use client";

import { useState } from "react";
import { CategoryRecord, MenuItemRecord, IngredientRecord, FoodIngredientRecord } from "@/shared/types/app";

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
    vegetarian?: boolean;
    vegan?: boolean;
    spicy?: boolean;
    sugarFree?: boolean;
    allergens?: string[];
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

  // Dietary & Allergens
  const [vegetarian, setVegetarian] = useState(initialValues?.vegetarian ?? false);
  const [vegan, setVegan] = useState(initialValues?.vegan ?? false);
  const [spicy, setSpicy] = useState(initialValues?.spicy ?? false);
  const [sugarFree, setSugarFree] = useState(initialValues?.sugarFree ?? false);
  const [allergens, setAllergens] = useState(initialValues?.allergens?.join(", ") ?? "");
  
  // Recipe state
  const [recipe, setRecipe] = useState<FoodIngredientRecord[]>(initialValues?.recipe ?? []);
  const [selectedIng, setSelectedIng] = useState("");
  const [ingQty, setIngQty] = useState("");

  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");

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

    // prevent duplicates
    if (recipe.some(r => r.ingredientId === selectedIng)) {
      alert("Ingredient already added. Remove it first to update quantity.");
      return;
    }

    setRecipe([...recipe, { ingredientId: selectedIng, quantity: qty }]);
    setSelectedIng("");
    setIngQty("");
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    setError("");

    try {
      const allergensArray = allergens
        .split(",")
        .map(a => a.trim())
        .filter(Boolean);

      await onSubmit({
        name,
        price: Number(price),
        description,
        image,
        category: category || undefined,
        categoryName: category ? undefined : categoryName || undefined,
        isAvailable,
        vegetarian,
        vegan,
        spicy,
        sugarFree,
        allergens: allergensArray,
        recipe,
      });

      if (!initialValues?.id) {
        setName("");
        setPrice("");
        setDescription("");
        setImage("");
        setCategory("");
        setCategoryName("");
        setIsAvailable(true);
        setVegetarian(false);
        setVegan(false);
        setSpicy(false);
        setSugarFree(false);
        setAllergens("");
        setRecipe([]);
      }
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to save menu item");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="glass-card space-y-6 rounded-3xl p-8">
      <div>
        <h2 className="text-2xl font-bold">{initialValues?.id ? "Edit Menu Item" : "Create Menu Item"}</h2>
        <p className="mt-2 text-sm text-zinc-500">Add products, configure dietary preferences, and build recipes.</p>
      </div>
      
      {error ? <p className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-500">{error}</p> : null}
      
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Item name"
            className="w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-5 py-4 outline-none transition-all focus:border-gold-500"
            required
          />
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Description"
            className="min-h-32 w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-5 py-4 outline-none transition-all focus:border-gold-500"
            required
          />
          <div className="grid gap-4 md:grid-cols-2">
            <input
              type="number"
              value={price}
              onChange={(event) => setPrice(event.target.value)}
              placeholder="Price ($)"
              className="w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-5 py-4 outline-none transition-all focus:border-gold-500"
              min="0"
              step="0.01"
              required
            />
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-5 py-4 outline-none transition-all focus:border-gold-500"
            >
              <option value="">Create from new category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          {!category ? (
            <input
              value={categoryName}
              onChange={(event) => setCategoryName(event.target.value)}
              placeholder="New category name"
              className="w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-5 py-4 outline-none transition-all focus:border-gold-500"
              required
            />
          ) : null}

          {/* Dietary Properties */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5 space-y-4">
            <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider">Dietary Properties</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Vegetarian", checked: vegetarian, setChecked: setVegetarian, color: "text-green-400" },
                { label: "Vegan", checked: vegan, setChecked: setVegan, color: "text-emerald-400" },
                { label: "Spicy", checked: spicy, setChecked: setSpicy, color: "text-red-400" },
                { label: "Sugar Free", checked: sugarFree, setChecked: setSugarFree, color: "text-blue-400" },
              ].map((item) => (
                <label key={item.label} className="flex items-center gap-2 text-sm text-zinc-300 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={(e) => item.setChecked(e.target.checked)}
                    className="rounded border-zinc-700 bg-zinc-950 text-gold-500 focus:ring-gold-500"
                  />
                  <span className={item.checked ? item.color : "text-zinc-400"}>{item.label}</span>
                </label>
              ))}
            </div>

            <div className="pt-2">
              <label className="block text-xs text-zinc-400 mb-1 uppercase tracking-wider">Allergens (comma-separated)</label>
              <input
                value={allergens}
                onChange={(e) => setAllergens(e.target.value)}
                placeholder="e.g. Dairy, Nuts, Gluten"
                className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-sm outline-none focus:border-gold-500"
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Image Upload */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
            <label className="block text-sm text-zinc-400 mb-3">Item Image URL or Upload</label>
            <input
              value={image}
              onChange={(event) => setImage(event.target.value)}
              placeholder="https://..."
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 outline-none transition-all focus:border-gold-500 mb-3"
              required
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={isUploading}
              className="w-full text-sm file:mr-4 file:rounded-xl file:border-0 file:bg-gold-600 file:px-4 file:py-2 file:font-bold file:text-black hover:file:bg-gold-500 transition-all cursor-pointer"
            />
            {isUploading ? <p className="text-sm text-gold-500 mt-2 animate-pulse">Uploading image to Cloudinary...</p> : null}
          </div>

          {/* Recipe Builder */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
            <h3 className="text-sm font-semibold text-zinc-300 mb-3 uppercase tracking-wider">Recipe Builder</h3>
            <p className="text-xs text-zinc-500 mb-4">Connect raw inventory to automatically deduct stock on sale.</p>
            
            {recipe.length > 0 && (
              <ul className="space-y-2 mb-4">
                {recipe.map((r, i) => {
                   const ing = ingredients?.find(x => x.id === r.ingredientId);
                   return (
                     <li key={i} className="flex items-center justify-between bg-zinc-950 p-3 rounded-xl border border-white/5 text-sm">
                       <span className="font-medium text-zinc-200">{ing?.name || r.ingredientName || "Unknown"}</span>
                       <div className="flex items-center gap-4">
                         <span className="text-gold-400 font-mono">{r.quantity} {ing?.unit}</span>
                         <button type="button" onClick={() => setRecipe(recipe.filter((_, idx) => idx !== i))} className="text-red-500/80 hover:text-red-400 transition-colors">
                           Remove
                         </button>
                       </div>
                     </li>
                   )
                })}
              </ul>
            )}
            
            <div className="flex gap-2">
               <select 
                  value={selectedIng} 
                  onChange={e => setSelectedIng(e.target.value)}
                  className="flex-1 rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-2 text-sm outline-none focus:border-gold-500"
               >
                 <option value="">Select Ingredient</option>
                 {ingredients?.map(ing => <option key={ing.id} value={ing.id}>{ing.name} ({ing.unit})</option>)}
               </select>
               <input 
                  type="number" 
                  step="0.01" 
                  placeholder="Qty" 
                  value={ingQty} 
                  onChange={e => setIngQty(e.target.value)}
                  className="w-24 rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-2 text-sm outline-none focus:border-gold-500"
               />
               <button type="button" onClick={handleAddIngredient} className="bg-zinc-800 text-zinc-300 px-4 rounded-xl font-bold text-sm hover:bg-zinc-700 hover:text-white transition-colors">Add</button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-white/5 pt-6 mt-4">
        <label className="flex items-center gap-3 text-sm text-zinc-300 cursor-pointer group select-none">
          <input
            type="checkbox"
            checked={isAvailable}
            onChange={(event) => setIsAvailable(event.target.checked)}
            className="rounded border-zinc-700 bg-zinc-950 text-gold-500 focus:ring-gold-500 w-5 h-5"
          />
          Item is available for clients
        </label>
        
        <div className="flex gap-3">
          {onCancel ? (
            <button type="button" onClick={onCancel} className="rounded-xl border border-white/10 px-6 py-2.5 font-bold text-zinc-400 transition-colors hover:border-white/20 hover:text-white hover:bg-white/5">
              Cancel
            </button>
          ) : null}
          <button
            type="submit"
            disabled={isSaving}
            className="rounded-xl bg-gold-600 px-6 py-2.5 font-bold text-black transition-all hover:bg-gold-500 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
          >
            {isSaving ? "Saving..." : submitLabel}
          </button>
        </div>
      </div>
    </form>
  );
}
