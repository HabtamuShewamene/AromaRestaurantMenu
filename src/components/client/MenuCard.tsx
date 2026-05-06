"use client";

import Image from "next/image";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { MenuItemRecord } from "@/types/app";

type MenuCardProps = {
  item: MenuItemRecord;
  onAddToCart?: (item: MenuItemRecord, quantity: number) => void;
};

export default function MenuCard({ item, onAddToCart }: MenuCardProps) {
  const [quantity, setQuantity] = useState(1);
  const categoryName = typeof item.category === "string" ? item.category : item.category.name;

  return (
    <article className="glass-card group overflow-hidden rounded-3xl">
      <div className="relative h-64 overflow-hidden">
        <Image
          src={item.image}
          alt={item.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-4 right-4 rounded-full bg-black/60 px-3 py-1 font-bold text-gold-400 backdrop-blur-md">
          ${item.price.toFixed(2)}
        </div>
      </div>
      <div className="p-8">
        <div className="mb-3">
          <h3 className="text-2xl font-bold">{item.name}</h3>
          <div className="mt-2 flex items-center gap-3">
            <p className="text-xs uppercase tracking-[0.2em] text-gold-500/80">{categoryName}</p>
            <span
              className={`rounded-full px-3 py-1 text-[11px] font-bold ${
                item.isAvailable ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
              }`}
            >
              {item.isAvailable ? "In Stock" : "Out of Stock"}
            </span>
          </div>
        </div>
        <p className="mb-6 line-clamp-2 text-sm text-zinc-400">{item.description}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 rounded-full border border-white/5 bg-zinc-800/50 px-4 py-2">
            <button className="hover:text-gold-500" onClick={() => setQuantity((current) => Math.max(1, current - 1))}>
              <Minus className="h-4 w-4" />
            </button>
            <span className="w-4 text-center text-sm font-bold">{quantity}</span>
            <button className="hover:text-gold-500" onClick={() => setQuantity((current) => current + 1)}>
              <Plus className="h-4 w-4" />
            </button>
          </div>
          {onAddToCart ? (
            <button
              disabled={!item.isAvailable}
              onClick={() => onAddToCart(item, quantity)}
              className="flex items-center gap-2 rounded-full bg-gold-600 px-6 py-2 text-sm font-bold text-black transition-all hover:bg-gold-700 disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-400"
            >
              <ShoppingCart className="h-4 w-4" /> Add
            </button>
          ) : (
            <span className="rounded-full border border-white/10 px-4 py-2 text-sm text-zinc-400">Preview Only</span>
          )}
        </div>
      </div>
    </article>
  );
}
