"use client";

import { useEffect, useState, useRef } from "react";
import { X, Plus, Minus, ShoppingBag, Check } from "lucide-react";
import Image from "next/image";
import { MenuItemRecord, OrderItemAddonRecord } from "@/shared/types/app";
import { useCart } from "@/components/providers/CartProvider";

type MenuItemDetailProps = {
  item: MenuItemRecord;
  onClose: () => void;
};

export default function MenuItemDetail({ item, onClose }: MenuItemDetailProps) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedAddons, setSelectedAddons] = useState<Record<string, OrderItemAddonRecord[]>>({});
  const [notes, setNotes] = useState("");
  const [justAdded, setJustAdded] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // Focus trap and Escape-to-close accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    
    // Auto-focus modal wrapper for screen readers / keyboard nav
    if (modalRef.current) {
      modalRef.current.focus();
    }

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Handle clicking outside modal to close
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Initialize default options for required groups
  useEffect(() => {
    if (item.addonGroups && item.addonGroups.length > 0) {
      const initial: Record<string, OrderItemAddonRecord[]> = {};
      item.addonGroups.forEach((group) => {
        if (group.required && group.options.length > 0) {
          const firstAvailable = group.options.find((o) => o.isAvailable) || group.options[0];
          initial[group.id] = [
            {
              addonOptionId: firstAvailable.id,
              name: firstAvailable.name,
              price: firstAvailable.price,
              quantity: 1,
            },
          ];
        } else {
          initial[group.id] = [];
        }
      });
      setSelectedAddons(initial);
    }
  }, [item]);

  const categoryName = typeof item.category === "string" ? item.category : item.category.name;

  const handleOptionToggle = (
    groupId: string,
    option: { id: string; name: string; price: number },
    maxSelect: number
  ) => {
    setSelectedAddons((prev) => {
      const currentList = prev[groupId] || [];
      const exists = currentList.find((a) => a.addonOptionId === option.id);

      if (maxSelect === 1) {
        // Single-select radio behavior
        return {
          ...prev,
          [groupId]: [
            {
              addonOptionId: option.id,
              name: option.name,
              price: option.price,
              quantity: 1,
            },
          ],
        };
      }

      // Multi-select toggle
      if (exists) {
        return {
          ...prev,
          [groupId]: currentList.filter((a) => a.addonOptionId !== option.id),
        };
      }

      if (currentList.length >= maxSelect) {
        return prev; // Reached max selections limit
      }

      return {
        ...prev,
        [groupId]: [
          ...currentList,
          {
            addonOptionId: option.id,
            name: option.name,
            price: option.price,
            quantity: 1,
          },
        ],
      };
    });
  };

  const flattenedAddons: OrderItemAddonRecord[] = Object.values(selectedAddons).flat();
  const addonsTotalUnit = flattenedAddons.reduce((sum, a) => sum + a.price * (a.quantity || 1), 0);
  const unitPrice = item.price + addonsTotalUnit;
  const totalPrice = unitPrice * quantity;

  const missingRequiredGroup = (item.addonGroups || []).find(
    (g) => g.required && (!selectedAddons[g.id] || selectedAddons[g.id].length < Math.max(1, g.minSelect))
  );

  const canAddToCart = item.isAvailable && !missingRequiredGroup;

  const handleAddToCart = () => {
    if (!canAddToCart) return;
    addToCart(item, quantity, flattenedAddons, notes.trim());
    setJustAdded(true);
    setTimeout(() => {
      setJustAdded(false);
      onClose();
    }, 1200);
  };

  return (
    <div 
      className="fixed inset-0 z-[70] flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 transition-all duration-300"
      onClick={handleBackdropClick}
    >
      <div 
        ref={modalRef}
        tabIndex={-1}
        className="relative flex flex-col w-full max-w-xl max-h-[85vh] overflow-hidden rounded-[2rem] sm:rounded-3xl bg-card shadow-[0_0_40px_rgba(182,141,64,0.15)] border border-primary/20 outline-none"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Edge-to-edge Image Header */}
        <div className="relative h-48 sm:h-64 w-full flex-shrink-0">
          <Image
            src={item.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80"}
            alt={item.name}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 800px"
            className="object-cover"
          />
          {/* Gradient fade to blend into background */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#292C2B] via-[#292C2B]/20 to-transparent" />
          
          {/* Close button layered on top of image */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 sm:top-5 sm:right-5 z-30 rounded-full bg-background/40 backdrop-blur-md p-2.5 text-foreground/90 hover:bg-background/60 hover:text-foreground hover:scale-105 active:scale-95 transition-all shadow-lg border border-border"
            aria-label="Close details"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-5 sm:p-7 space-y-7 -mt-6 sm:-mt-10 relative z-20 pb-8 sm:pb-10">
          
          {/* Title and Pricing */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 sm:gap-4">
              <div>
                <p className="text-[10px] sm:text-xs uppercase tracking-[0.25em] text-primary font-bold mb-1.5">{categoryName}</p>
                <h2 id="modal-title" className="text-lg sm:text-2xl font-bold text-foreground font-playfair leading-tight line-clamp-3">{item.name}</h2>
              </div>
              <p className="text-xl sm:text-3xl font-bold text-primary font-playfair whitespace-nowrap">{item.price.toFixed(2)} Birr</p>
            </div>
            
            {/* Rating Summary & Badges */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              {/* Mock compact rating summary */}
              <div className="flex items-center gap-1 bg-foreground/5 px-2.5 py-1 rounded-lg border border-border w-fit shadow-inner">
                <span className="text-primary text-sm leading-none">★</span>
                <span className="text-foreground text-sm font-bold leading-none">4.8</span>
                <span className="text-muted-foreground text-xs ml-0.5 leading-none">(24)</span>
              </div>

              <span
                className={`rounded-full px-3 py-1 font-bold text-[10px] sm:text-xs uppercase tracking-wider ${
                  item.isAvailable
                    ? "bg-green-500/15 text-green-400 border border-green-500/30"
                    : "bg-red-500/15 text-red-400 border border-red-500/30"
                }`}
              >
                {item.isAvailable ? "In Stock" : "Sold Out"}
              </span>
              
              {/* Dietary Tags */}
              {item.allergens?.map((alg, i) => (
                <span key={i} className="rounded-full px-3 py-1 font-bold text-[10px] sm:text-xs uppercase tracking-wider bg-orange-500/10 text-orange-400 border border-orange-500/20">
                  {alg}
                </span>
              ))}
            </div>

            <p className="text-muted-foreground text-sm leading-relaxed mt-2">{item.description}</p>
          </div>

          {/* Customization Options */}
          {item.addonGroups && item.addonGroups.length > 0 && (
            <div className="space-y-5 pt-4 border-t border-border">
              <h3 className="text-sm font-bold uppercase tracking-wider text-primary">Customizations</h3>

              {item.addonGroups.map((group) => {
                const selectedInGroup = selectedAddons[group.id] || [];

                return (
                  <div key={group.id} className="p-4 sm:p-5 rounded-2xl bg-card/80 border border-primary/10 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                        {group.name} 
                        {group.required && <span className="bg-primary/20 text-primary text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border border-primary/20">Required</span>}
                      </h4>
                      <span className="text-xs font-medium text-muted-foreground bg-background/40 px-2 py-1 rounded-md">
                        {group.maxSelect === 1 ? "Select 1" : `Up to ${group.maxSelect}`}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {group.options.map((opt) => {
                        const isSelected = selectedInGroup.some((a) => a.addonOptionId === opt.id);

                        return (
                          <button
                            key={opt.id}
                            type="button"
                            disabled={!opt.isAvailable}
                            onClick={() =>
                              handleOptionToggle(
                                group.id,
                                { id: opt.id, name: opt.name, price: opt.price },
                                group.maxSelect
                              )
                            }
                            className={`flex items-center justify-between p-3.5 rounded-xl border text-sm font-medium transition-all active:scale-[0.98] ${
                              !opt.isAvailable
                                ? "opacity-40 cursor-not-allowed bg-card border-border text-zinc-600"
                                : isSelected
                                ? "bg-primary/15 border-primary/40 text-brand-300 shadow-[0_0_15px_rgba(182,141,64,0.15)] ring-1 ring-primary/50"
                                : "bg-card border-border text-muted-foreground hover:bg-zinc-800 hover:border-zinc-700"
                            }`}
                          >
                            <span className="truncate pr-2">{opt.name}</span>
                            <span className={`font-bold ml-2 whitespace-nowrap ${isSelected ? 'text-primary' : 'text-muted-foreground'}`}>
                              {opt.price > 0 ? `+${opt.price.toFixed(2)} Birr` : "Free"}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Special Requests */}
          <div className="pt-4 border-t border-border space-y-3">
            <div className="flex items-center justify-between">
              <label htmlFor="special-instructions" className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Special Instructions
              </label>
              <span className={`text-[10px] font-bold tracking-wider ${notes.length > 130 ? 'text-red-400' : 'text-muted-foreground'}`}>
                {notes.length}/150
              </span>
            </div>
            <textarea
              id="special-instructions"
              value={notes}
              maxLength={150}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Extra hot, no cinnamon, sauce on side..."
              className="w-full bg-card/80 border border-border rounded-xl px-4 py-3.5 text-sm text-foreground placeholder-zinc-600 outline-none focus:border-primary focus:bg-card transition-colors resize-none h-24 shadow-inner"
            />
          </div>
        </div>

        {/* Sticky Glassmorphism Footer */}
        <div className="flex-shrink-0 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-primary/20 bg-card/95 backdrop-blur-xl px-5 sm:px-7 py-4 pb-8 sm:pb-5 sm:py-5 z-30 relative">
          
          {/* Quantity Controls - Large Touch Targets */}
          <div className="flex items-center justify-between w-full sm:w-auto bg-card p-1.5 rounded-2xl border border-border shadow-inner">
            <button
              type="button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-12 h-12 sm:w-10 sm:h-10 rounded-xl bg-card flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-zinc-800 transition-colors active:bg-zinc-700"
              aria-label="Decrease quantity"
            >
              <Minus className="w-5 h-5 sm:w-4 sm:h-4" />
            </button>
            <span className="w-12 sm:w-10 text-center font-bold text-foreground text-lg sm:text-base">{quantity}</span>
            <button
              type="button"
              onClick={() => setQuantity(quantity + 1)}
              className="w-12 h-12 sm:w-10 sm:h-10 rounded-xl bg-card flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-zinc-800 transition-colors active:bg-zinc-700"
              aria-label="Increase quantity"
            >
              <Plus className="w-5 h-5 sm:w-4 sm:h-4" />
            </button>
          </div>

          {/* Add to Cart Button */}
          <button
            type="button"
            disabled={!canAddToCart}
            onClick={handleAddToCart}
            className={`w-full sm:flex-1 sm:min-w-[240px] flex items-center justify-center gap-2 py-4 sm:py-3.5 px-6 rounded-2xl font-bold text-base sm:text-sm transition-all shadow-lg ${
              !item.isAvailable
                ? "bg-zinc-800 text-muted-foreground cursor-not-allowed"
                : missingRequiredGroup
                ? "bg-zinc-800 text-muted-foreground border border-primary/30 cursor-not-allowed"
                : justAdded
                ? "bg-green-500 text-primary-foreground shadow-[0_0_20px_rgba(34,197,94,0.4)] scale-[1.02]"
                : "bg-primary text-primary-foreground hover:bg-primary hover:scale-[1.02] active:scale-[0.98] shadow-[0_4px_20px_rgba(182,141,64,0.3)]"
            }`}
          >
            {justAdded ? (
              <>
                <Check className="w-5 h-5 sm:w-4 sm:h-4 stroke-[2.5]" />
                <span>Added to Cart ({totalPrice.toFixed(2)} Birr)</span>
              </>
            ) : missingRequiredGroup ? (
              <span>Please select: {missingRequiredGroup.name}</span>
            ) : (
              <>
                <ShoppingBag className="w-5 h-5 sm:w-4 sm:h-4" />
                <span>Add to Cart • {totalPrice.toFixed(2)} Birr</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
