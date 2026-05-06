"use client";

import { useState } from "react";
import { CategoryRecord, MenuItemRecord } from "@/types/app";

type MenuFormProps = {
  categories: CategoryRecord[];
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
  }) => Promise<void>;
  onCancel?: () => void;
};

export default function MenuForm({
  categories,
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
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    setError("");

    try {
      await onSubmit({
        name,
        price: Number(price),
        description,
        image,
        category: category || undefined,
        categoryName: category ? undefined : categoryName || undefined,
        isAvailable,
      });

      if (!initialValues?._id) {
        setName("");
        setPrice("");
        setDescription("");
        setImage("");
        setCategory("");
        setCategoryName("");
        setIsAvailable(true);
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
        <h2 className="text-2xl font-bold">{initialValues?._id ? "Edit Menu Item" : "Create Menu Item"}</h2>
        <p className="mt-2 text-sm text-zinc-500">Add products, change pricing, and control availability from one form.</p>
      </div>
      {error ? <p className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-500">{error}</p> : null}
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
      <div className="grid gap-4 md:grid-cols-3">
        <input
          type="number"
          value={price}
          onChange={(event) => setPrice(event.target.value)}
          placeholder="Price"
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
          <option value="">Create from new category name</option>
          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>
        <input
          value={image}
          onChange={(event) => setImage(event.target.value)}
          placeholder="Image URL"
          className="w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-5 py-4 outline-none transition-all focus:border-gold-500"
          required
        />
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
      <label className="flex items-center gap-3 text-sm text-zinc-300">
        <input
          type="checkbox"
          checked={isAvailable}
          onChange={(event) => setIsAvailable(event.target.checked)}
          className="h-4 w-4 rounded border-zinc-700 bg-zinc-950 text-gold-500"
        />
        Item is available for clients
      </label>
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isSaving}
          className="rounded-2xl bg-gold-600 px-6 py-3 font-bold text-black transition-colors hover:bg-gold-700 disabled:bg-zinc-700 disabled:text-zinc-400"
        >
          {isSaving ? "Saving..." : submitLabel}
        </button>
        {onCancel ? (
          <button type="button" onClick={onCancel} className="rounded-2xl border border-white/10 px-6 py-3 font-bold text-zinc-200 transition-colors hover:border-gold-500 hover:text-gold-500">
            Cancel
          </button>
        ) : null}
      </div>
    </form>
  );
}
