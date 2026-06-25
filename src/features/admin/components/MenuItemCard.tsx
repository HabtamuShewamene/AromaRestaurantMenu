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
      <div className="mb-4 overflow-hidden rounded-2xl">
        <div className="relative h-44 w-full">
          <Image src={item.image} alt={item.name} fill sizes="(max-width: 1280px) 50vw, 33vw" className="object-cover" />
        </div>
      </div>
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold">{item.name}</h3>
          <p className="text-sm text-zinc-500">{categoryName}</p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-bold ${
            item.isAvailable ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
          }`}
        >
          {item.isAvailable ? "Available" : "Hidden"}
        </span>
      </div>
      <div className="flex items-center justify-between">
        <span className="font-mono text-lg text-gold-500">${item.price.toFixed(2)}</span>
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
