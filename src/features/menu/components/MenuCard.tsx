"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Flame } from "lucide-react";
import { useState } from "react";
import { MenuItemRecord } from "@/shared/types/app";

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
  const rating = item.averageRating || 0;
  const reviewCount = item.totalReviews || 0;

  const categoryName =
    typeof item.category === "string" ? item.category : item.category.name;


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
      onMouseEnter={(e) => {
        const el = e.currentTarget;
        el.style.boxShadow =
          "0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(182,141,64,0.2), 0 0 40px rgba(182,141,64,0.06)";
        el.style.borderColor = "rgba(182,141,64,0.25)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget;
        el.style.boxShadow = "0 4px 24px rgba(0,0,0,0.4)";
        el.style.borderColor = "rgba(255,255,255,0.06)";
      }}
    >
      {/* ── Food Image ── */}
      <div className="relative h-40 sm:h-44 overflow-hidden rounded-t-[1.75rem]">
        <Image
          src={item.image}
          alt={item.name}
          fill
          sizes="(max-width: 768px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Price badge */}
        <div
          className="absolute top-3 right-3 px-3 py-1 rounded-full text-sm font-bold text-gold-300"
          style={{
            background: "rgba(8,8,8,0.75)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: "1px solid rgba(182,141,64,0.25)",
          }}
        >
          ${item.price.toFixed(2)}
        </div>

        {/* Availability badge */}
        <div
          className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
            item.isAvailable
              ? "bg-green-500/20 text-green-400 border border-green-500/30"
              : "bg-red-500/20 text-red-400 border border-red-500/30"
          }`}
        >
          {item.isAvailable ? "Available" : "Sold Out"}
        </div>

        {/* Rating badge */}
        {reviewCount > 0 && (
          <div
            className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full"
            style={{
              background: "rgba(8,8,8,0.7)",
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

        {/* Popular badge */}
        {reviewCount > 5 && rating > 4.5 && (
          <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-orange-500/20 border border-orange-500/30">
            <Flame className="w-3 h-3 text-orange-400" />
            <span className="text-[10px] font-bold text-orange-400">Hot</span>
          </div>
        )}
      </div>

      {/* ── Card Content ── */}
      <div className="flex flex-col flex-1 p-4 pt-3.5">
        {/* Category */}
        <p className="text-[10px] uppercase tracking-[0.2em] text-gold-500/70 font-medium mb-1">
          {categoryName}
        </p>

        {/* Name */}
        <h3 className="font-semibold text-white text-sm leading-tight mb-1.5 line-clamp-1">
          {item.name}
        </h3>

        {/* Description */}
        <p className="text-xs text-zinc-500 leading-relaxed line-clamp-2 mb-4 flex-1">
          {item.description}
        </p>

        {/* ── Actions ── */}
        <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails?.(item);
            }}
            className="text-xs font-semibold text-gold-400/80 hover:text-gold-400 transition-colors uppercase tracking-widest"
          >
            Details
          </button>
          
          <div className="flex items-center gap-1">
            <div className={`w-1.5 h-1.5 rounded-full ${item.isAvailable ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-[10px] text-zinc-500 uppercase tracking-tighter">
              {item.isAvailable ? "In Stock" : "Sold Out"}
            </span>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
