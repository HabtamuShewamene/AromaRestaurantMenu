"use client";

import { useEffect, useState } from "react";
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

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const response = await fetch(`/api/reviews?menuItemId=${item.id}`);
        const data = await response.json();
        setReviews(data.reviews || []);
        setAverageRating(data.averageRating || 0);
        setTotalReviews(data.totalReviews || 0);
      } catch {
        // Silently fail
      } finally {
        setIsLoading(false);
      }
    };

    void loadReviews();
  }, [item.id]);

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

  const handleReviewSubmitted = async () => {
    try {
      const response = await fetch(`/api/reviews?menuItemId=${item.id}`);
      const data = await response.json();
      setReviews(data.reviews || []);
      setAverageRating(data.averageRating || 0);
      setTotalReviews(data.totalReviews || 0);
    } catch {
      // Silently fail
    }
  };

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-[#111111] border border-white/10 shadow-2xl">
        {/* Sticky Modal Header */}
        <div className="sticky top-0 z-20 flex items-center justify-between border-b border-white/10 bg-[#111111]/95 px-6 py-4 backdrop-blur-md">
          <h2 className="text-xl font-bold text-white font-playfair">{item.name}</h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-zinc-400 hover:bg-white/10 hover:text-white transition-all"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Item Image and Info */}
          <div className="space-y-4">
            <div className="relative h-64 w-full overflow-hidden rounded-2xl">
              <Image
                src={item.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80"}
                alt={item.name}
                fill
                sizes="600px"
                className="object-cover"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-gold-500 font-semibold">{categoryName}</p>
                  <p className="text-3xl font-bold text-gold-400 font-playfair">{item.price.toFixed(2)} Birr</p>
                </div>
                <span
                  className={`rounded-full px-3.5 py-1.5 font-bold text-xs uppercase tracking-wider ${
                    item.isAvailable
                      ? "bg-green-500/15 text-green-400 border border-green-500/30"
                      : "bg-red-500/15 text-red-400 border border-red-500/30"
                  }`}
                >
                  {item.isAvailable ? "In Stock" : "Sold Out"}
                </span>
              </div>
              <p className="text-zinc-300 text-sm leading-relaxed">{item.description}</p>
            </div>
          </div>

          {/* Add-on Groups / Customization Options */}
          {item.addonGroups && item.addonGroups.length > 0 && (
            <div className="space-y-5 pt-4 border-t border-white/10">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gold-400">Customizations</h3>

              {item.addonGroups.map((group) => {
                const selectedInGroup = selectedAddons[group.id] || [];

                return (
                  <div key={group.id} className="p-4 rounded-2xl bg-zinc-950 border border-white/5 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-semibold text-white">
                        {group.name} {group.required && <span className="text-gold-400 text-xs">*Required</span>}
                      </h4>
                      <span className="text-[11px] text-zinc-500">
                        {group.maxSelect === 1 ? "Select 1" : `Up to ${group.maxSelect}`}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
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
                            className={`flex items-center justify-between p-3 rounded-xl border text-xs font-medium transition-all ${
                              !opt.isAvailable
                                ? "opacity-40 cursor-not-allowed bg-zinc-900 border-zinc-800 text-zinc-600"
                                : isSelected
                                ? "bg-gold-500/15 border-gold-500/40 text-gold-300 shadow-[0_0_12px_rgba(182,141,64,0.15)]"
                                : "bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800"
                            }`}
                          >
                            <span className="truncate">{opt.name}</span>
                            <span className="font-bold text-zinc-400 ml-2">
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

          {/* Special Requests / Item Notes */}
          <div className="pt-2">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block mb-1.5">
              Special Instructions (Optional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Extra hot, no cinnamon, sauce on side..."
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-600 outline-none focus:border-gold-500"
            />
          </div>

          {/* Add to Cart Footer Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/10 sticky bottom-0 bg-[#111111] py-3 -mx-6 px-6">
            <div className="flex items-center gap-3 bg-zinc-950 px-3 py-2 rounded-2xl border border-white/10">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 rounded-xl bg-zinc-900 flex items-center justify-center text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-8 text-center font-bold text-white text-base">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="w-8 h-8 rounded-xl bg-zinc-900 flex items-center justify-center text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <button
              type="button"
              disabled={!canAddToCart}
              onClick={handleAddToCart}
              className={`flex-1 min-w-[200px] flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl font-bold text-sm transition-all shadow-lg ${
                !item.isAvailable
                  ? "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                  : missingRequiredGroup
                  ? "bg-zinc-800 text-zinc-400 border border-gold-500/30 cursor-not-allowed"
                  : justAdded
                  ? "bg-green-500 text-black shadow-[0_0_20px_rgba(34,197,94,0.4)]"
                  : "bg-gold-500 text-black hover:bg-gold-400 hover:scale-[1.02] active:scale-[0.98] shadow-[0_4px_20px_rgba(182,141,64,0.3)]"
              }`}
            >
              {justAdded ? (
                <>
                  <Check className="w-4 h-4 stroke-[2.5]" />
                  <span>Added to Cart ({totalPrice.toFixed(2)} Birr)</span>
                </>
              ) : missingRequiredGroup ? (
                <span>Please select: {missingRequiredGroup.name}</span>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Cart • {totalPrice.toFixed(2)} Birr</span>
                </>
              )}
            </button>
          </div>

          {/* Ingredients & Allergens */}
          {((item.ingredients && item.ingredients.length > 0) || (item.allergens && item.allergens.length > 0)) && (
            <div className="pt-4 space-y-4 border-t border-white/10">
              {item.allergens && item.allergens.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-red-400/80 mb-2 uppercase tracking-wider">Allergens</h4>
                  <div className="flex flex-wrap gap-2">
                    {item.allergens.map((alg, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-red-500/10 text-red-400 rounded-full text-xs font-medium border border-red-500/20"
                      >
                        {alg}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
