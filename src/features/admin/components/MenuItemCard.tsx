"use client";

import Image from "next/image";
import { MoreVertical, EyeOff, Pencil, Trash2, Eye } from "lucide-react";
import { MenuItemRecord } from "@/shared/types/app";
import { useState, useRef, useEffect } from "react";

type MenuItemCardProps = {
  item: MenuItemRecord;
  onEdit: (item: MenuItemRecord) => void;
  onDelete: (id: string) => void;
  onToggleAvailability: (item: MenuItemRecord) => void;
};

export default function MenuItemCard({ item, onEdit, onDelete, onToggleAvailability }: MenuItemCardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const categoryName = typeof item.category === "string" ? item.category : item.category?.name || "Uncategorized";

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <article className="bg-[#242424] rounded-2xl border border-[#3A3D40] overflow-hidden flex flex-col group transition-all hover:border-primary/40 relative">
      {/* ── Image ── */}
      <div className="relative h-40 sm:h-48 w-full bg-black/40 shrink-0">
        <Image
          src={item.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80"}
          alt={item.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className={`object-cover transition-transform duration-500 group-hover:scale-105 ${
            !item.isAvailable ? "grayscale opacity-60" : ""
          }`}
        />

        {/* Availability Badge */}
        <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/10">
          <div className={`w-2 h-2 rounded-full ${item.isAvailable ? "bg-[#8BD43F]" : "bg-[#D95C5C]"}`} />
          <span className="text-[10px] font-bold text-white uppercase tracking-wider">
            {item.isAvailable ? "Available" : "Hidden"}
          </span>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between gap-2">
        <div className="flex flex-col gap-1">
          {/* Name */}
          <h3 className="text-sm sm:text-base font-bold text-[#F7F7F2] line-clamp-2 leading-snug">{item.name}</h3>

          {/* Category */}
          <p className="text-xs font-semibold text-[#A7ABB0] uppercase tracking-wider line-clamp-1">
            {categoryName}
          </p>

          {/* Price */}
          <span className="font-mono text-sm font-black text-[#8BD43F]">{item.price.toFixed(2)} ETB</span>
        </div>

        {/* ── Actions ── */}
        <div className="flex items-center justify-between pt-3 border-t border-[#3A3D40]">
          <button
            onClick={() => onEdit(item)}
            className="flex-1 py-2 rounded-xl bg-primary/10 text-primary border border-primary/20 font-bold text-xs hover:bg-primary hover:text-primary-foreground transition-colors flex items-center justify-center gap-1.5"
          >
            <Pencil className="w-3.5 h-3.5" />
            Edit
          </button>

          <div className="relative ml-2" ref={menuRef}>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`p-2 rounded-xl border transition-colors ${
                isMenuOpen
                  ? "bg-[#3A3D40] border-[#A7ABB0] text-[#F7F7F2]"
                  : "bg-transparent border-[#3A3D40] text-[#A7ABB0] hover:text-[#F7F7F2] hover:bg-white/5"
              }`}
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {/* Dropdown Menu */}
            {isMenuOpen && (
              <div className="absolute right-0 bottom-full mb-2 w-48 bg-[#111111] border border-[#3A3D40] rounded-2xl shadow-2xl overflow-hidden z-20 animate-in fade-in slide-in-from-bottom-2 duration-150">
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    onToggleAvailability(item);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-[#F7F7F2] hover:bg-white/5 transition-colors border-b border-[#3A3D40]"
                >
                  {item.isAvailable ? (
                    <>
                      <EyeOff className="w-4 h-4 text-[#A7ABB0]" />
                      Hide from Menu
                    </>
                  ) : (
                    <>
                      <Eye className="w-4 h-4 text-[#8BD43F]" />
                      Make Available
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    if (confirm("Are you sure you want to permanently delete this item?")) {
                      onDelete(item.id);
                    }
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-[#D95C5C] hover:bg-[#D95C5C]/10 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Item
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}


