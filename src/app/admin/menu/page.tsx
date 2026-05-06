"use client";

import MenuForm from "@/components/admin/MenuForm";
import MenuItemCard from "@/components/admin/MenuItemCard";
import { Search, Plus, Check, X } from "lucide-react";
import { useState } from "react";

type MenuStateItem = {
  id: number;
  name: string;
  price: number;
  category: string;
  isAvailable: boolean;
  image: string;
};

export default function ManageMenu() {
  const [items, setItems] = useState<MenuStateItem[]>([
    {
      id: 1,
      name: "Vanilla Latte",
      price: 5.5,
      category: "Hot Coffee",
      isAvailable: true,
      image: "https://images.unsplash.com/photo-1595434066389-99c30150fc64?q=80&w=800&auto=format&fit=crop",
    },
    {
      id: 2,
      name: "Avocado Toast",
      price: 12,
      category: "Food",
      isAvailable: true,
      image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=800&auto=format&fit=crop",
    },
    {
      id: 3,
      name: "Almond Croissant",
      price: 4.5,
      category: "Pastries",
      isAvailable: false,
      image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=800&auto=format&fit=crop",
    },
  ]);

  const toggleAvailability = (id: number) => {
    setItems((currentItems) =>
      currentItems.map((item) => (item.id === id ? { ...item, isAvailable: !item.isAvailable } : item))
    );
  };

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mb-2 text-4xl font-bold">Menu Management</h1>
          <p className="text-zinc-500">Add, edit, and manage your cafe offerings.</p>
        </div>
        <button className="flex items-center gap-2 rounded-xl bg-gold-600 px-6 py-3 font-bold text-black transition-all hover:bg-gold-700">
          <Plus className="h-5 w-5" /> New Item
        </button>
      </div>

      <MenuForm categories={["Hot Coffee", "Cold Brew", "Food", "Pastries"]} />

      <div className="glass-card overflow-hidden rounded-3xl">
        <div className="flex items-center justify-between border-b border-white/5 bg-zinc-900/20 p-8">
          <div className="relative w-96">
            <Search className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              placeholder="Search items by name or category..."
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950 py-3 pr-4 pl-12 outline-none transition-all focus:border-gold-500"
            />
          </div>
          <div className="flex gap-4">
            <select className="rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm outline-none focus:border-gold-500">
              <option>All Categories</option>
              <option>Hot Coffee</option>
              <option>Cold Brew</option>
              <option>Food</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 text-sm text-zinc-500">
                <th className="px-8 py-6 font-medium">Item Name</th>
                <th className="px-8 py-6 font-medium">Category</th>
                <th className="px-8 py-6 font-medium">Price</th>
                <th className="px-8 py-6 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {items.map((item) => (
                <tr key={item.id} className="group transition-all hover:bg-white/[0.02]">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 overflow-hidden rounded-lg">
                        <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                      </div>
                      <span className="font-bold">{item.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="rounded-full bg-zinc-800 px-3 py-1 text-xs font-medium text-zinc-400">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-8 py-6 font-mono text-gold-500">${item.price.toFixed(2)}</td>
                  <td className="px-8 py-6">
                    <button
                      onClick={() => toggleAvailability(item.id)}
                      className={`flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold transition-all ${
                        item.isAvailable ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                      }`}
                    >
                      {item.isAvailable ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                      {item.isAvailable ? "Available" : "Out of Stock"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <MenuItemCard
            key={`card-${item.id}`}
            item={{
              id: String(item.id),
              name: item.name,
              category: item.category,
              price: item.price,
              image: item.image,
              isAvailable: item.isAvailable,
            }}
          />
        ))}
      </div>
    </div>
  );
}
