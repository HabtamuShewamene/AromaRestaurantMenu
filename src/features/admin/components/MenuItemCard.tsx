import Image from "next/image";
import { EyeOff, Pencil, Trash2 } from "lucide-react";
import { MenuItemRecord } from "@/shared/types/app";

type MenuItemCardProps = {
  item: MenuItemRecord;
  onEdit: (item: MenuItemRecord) => void;
  onDelete: (id: string) => void;
  onToggleAvailability: (item: MenuItemRecord) => void;
};

export default function MenuItemCard({ item, onEdit, onDelete, onToggleAvailability }: MenuItemCardProps) {
  const categoryName = typeof item.category === "string" ? item.category : item.category.name;

  return (
    <article className="glass-card rounded-3xl p-5">
      <div className="mb-4 overflow-hidden rounded-2xl relative h-44 w-full">
        <Image
          src={item.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80"}
          alt={item.name}
          fill
          sizes="(max-width: 1280px) 50vw, 33vw"
          className="object-cover"
        />
      </div>
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-white">{item.name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-sm text-zinc-500">{categoryName}</p>
            {item.addonGroups && item.addonGroups.length > 0 && (
              <span className="text-[10px] font-bold text-brand-400 bg-brand-500/10 px-2 py-0.5 rounded-full border border-brand-500/20">
                {item.addonGroups.length} Addon Group{item.addonGroups.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-bold ${
            item.isAvailable ? "bg-green-500/10 text-green-500 border border-green-500/30" : "bg-red-500/10 text-red-500 border border-red-500/30"
          }`}
        >
          {item.isAvailable ? "Available" : "Hidden"}
        </span>
      </div>
      <div className="flex items-center justify-between">
        <span className="font-mono text-lg text-brand-500">${item.price.toFixed(2)}</span>
        <div className="flex gap-2">
          <button onClick={() => onToggleAvailability(item)} className="rounded-xl p-2 text-zinc-400 transition-colors hover:bg-white/5 hover:text-white">
            <EyeOff className="h-4 w-4" />
          </button>
          <button onClick={() => onEdit(item)} className="rounded-xl p-2 text-zinc-400 transition-colors hover:bg-white/5 hover:text-white">
            <Pencil className="h-4 w-4" />
          </button>
          <button onClick={() => onDelete(item.id)} className="rounded-xl p-2 text-zinc-400 transition-colors hover:bg-red-500/10 hover:text-red-500">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </article>
  );
}
