"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Star, Flame, Plus, Check } from "lucide-react";
import { useState } from "react";
import { MenuItemRecord } from "@/shared/types/app";
import { useCart } from "@/components/providers/CartProvider";

type MenuCardProps = {
  item: MenuItemRecord & { averageRating?: number; totalReviews?: number };
  onViewDetails?: (item: MenuItemRecord) => void;
  index?: number;
};

export default function MenuCard({
  item,
  onViewDetails,
  index = 0,
}: MenuCardProps) {
  const { addToCart } = useCart();
  const [justAdded, setJustAdded] = useState(false);
  const rating = item.averageRating || 0;
  const reviewCount = item.totalReviews || 0;

  const categoryName =
    typeof item.category === "string" ? item.category : item.category.name;

  const hasAddons = Boolean(item.addonGroups && item.addonGroups.length > 0);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!item.isAvailable) return;
    if (hasAddons) {
      onViewDetails?.(item);
      return;
    }
    addToCart(item, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: index * 0.07,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ y: -4 }}
      onClick={() => onViewDetails?.(item)}
      className="group relative cursor-pointer overflow-hidden rounded-[1.75rem] flex flex-col"
      style={{
        background: "rgba(16, 16, 16, 0.9)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.06)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
        transition: "box-shadow 0.4s ease, border-color 0.4s ease",
      }}
    >
      {/* ── Food Image ── */}
      <div className="relative h-44 sm:h-48 overflow-hidden rounded-t-[1.75rem]">
        <Image
          src={item.image}
          alt={item.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Price badge */}
        <div
          className="absolute top-3 right-3 px-3 py-1 rounded-full text-sm font-bold text-gold-300 font-playfair"
          style={{
            background: "rgba(8,8,8,0.8)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(182,141,64,0.3)",
          }}
        >
          ${item.price.toFixed(2)}
        </div>

        {/* Availability / Dietary badges */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap max-w-[70%]">
          <span
            className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
              item.isAvailable
                ? "bg-green-500/20 text-green-400 border border-green-500/30"
                : "bg-red-500/20 text-red-400 border border-red-500/30"
            }`}
          >
            {item.isAvailable ? "Available" : "Sold Out"}
          </span>
          {item.isFeatured && (
            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-gold-500/20 text-gold-300 border border-gold-500/40">
              Chef Pick
            </span>
          )}
        </div>

        {/* Rating badge */}
        {reviewCount > 0 && (
          <div
            className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full"
            style={{
              background: "rgba(8,8,8,0.75)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <Star className="w-3 h-3 fill-gold-400 text-gold-400" />
            <span className="text-xs font-bold text-gold-400">
              {rating.toFixed(1)}
            </span>
            <span className="text-[10px] text-zinc-500">({reviewCount})</span>
          </div>
        )}
      </div>

      {/* ── Card Content ── */}
      <div className="flex flex-col flex-1 p-4 pt-3.5">
        {/* Category */}
        <p className="text-[10px] uppercase tracking-[0.2em] text-gold-500 font-semibold mb-1">
          {categoryName}
        </p>

        {/* Name */}
        <h3 className="font-semibold text-white text-base leading-snug mb-1.5 line-clamp-1 font-playfair">
          {item.name}
        </h3>

        {/* Description */}
        <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2 mb-4 flex-1">
          {item.description}
        </p>

        {/* ── Actions ── */}
        <div className="mt-auto pt-3 border-t border-white/5 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails?.(item);
            }}
            className="text-xs font-semibold text-zinc-400 hover:text-white transition-colors uppercase tracking-wider py-1.5 px-2 rounded-lg hover:bg-white/5"
          >
            Details
          </button>
          
          <button
            type="button"
            disabled={!item.isAvailable}
            onClick={handleAddToCart}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              !item.isAvailable
                ? "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                : justAdded
                ? "bg-green-500 text-black shadow-[0_0_12px_rgba(34,197,94,0.4)]"
                : "bg-gold-500 text-black hover:bg-gold-400 hover:scale-105 active:scale-95 shadow-[0_2px_10px_rgba(182,141,64,0.25)]"
            }`}
          >
            {justAdded ? (
              <>
                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Added</span>
              </>
            ) : hasAddons ? (
              <>
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Customize</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </motion.article>
  );
}
