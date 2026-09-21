"use client";

import { useEffect, useState } from "react";
import { X, Flame, Leaf, Sparkles } from "lucide-react";
import Image from "next/image";
import { MenuItemRecord, ReviewRecord } from "@/shared/types/app";
import ReviewDisplay from "@/features/reviews/components/ReviewDisplay";
import ReviewForm from "@/features/reviews/components/ReviewForm";

type MenuItemDetailProps = {
  item: MenuItemRecord & { ingredientNames?: string[] };
  onClose: () => void;
};

export default function MenuItemDetail({ item, onClose }: MenuItemDetailProps) {
  const [reviews, setReviews] = useState<ReviewRecord[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const response = await fetch(`/api/reviews?menuItemId=${item.id}`);
        const data = await response.json();
        setReviews(data.reviews || []);
        setAverageRating(data.averageRating || 0);
        setTotalReviews(data.totalReviews || 0);
      } catch {
        // Silently fail, reviews just won't load
      } finally {
        setIsLoading(false);
      }
    };

    void loadReviews();
  }, [item.id]);

  const categoryName = typeof item.category === "string" ? item.category : item.category.name;

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

  const ingredientsList = item.ingredientNames && item.ingredientNames.length > 0
    ? item.ingredientNames
    : Array.isArray(item.ingredients)
    ? item.ingredients.map((ing: any) => typeof ing === "string" ? ing : ing.ingredient?.name || ing.name).filter(Boolean)
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-zinc-900 border border-zinc-800">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-zinc-800 bg-zinc-900/95 px-6 py-4 backdrop-blur-md">
          <h2 className="text-2xl font-bold text-white">{item.name}</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-all"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Item Image and Info */}
          <div className="space-y-4">
            <div className="relative h-64 w-full overflow-hidden rounded-2xl">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover"
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-gold-500 font-semibold">{categoryName}</p>
                  <p className="text-3xl font-bold text-gold-400">${item.price.toFixed(2)}</p>
                </div>
                <span
                  className={`rounded-full px-4 py-2 font-bold text-sm ${
                    item.isAvailable
                      ? "bg-green-500/10 text-green-400 border border-green-500/20"
                      : "bg-red-500/10 text-red-400 border border-red-500/20"
                  }`}
                >
                  {item.isAvailable ? "In Stock" : "Out of Stock"}
                </span>
              </div>

              <p className="text-zinc-300 leading-relaxed">{item.description}</p>

              {/* Dietary Tags */}
              <div className="flex flex-wrap gap-2 pt-2">
                {item.vegetarian && (
                  <span className="flex items-center gap-1 px-3 py-1 bg-green-500/10 text-green-400 rounded-full text-xs font-semibold border border-green-500/20">
                    <Leaf className="w-3 h-3" /> Vegetarian
                  </span>
                )}
                {item.vegan && (
                  <span className="flex items-center gap-1 px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-xs font-semibold border border-emerald-500/20">
                    <Leaf className="w-3 h-3" /> Vegan
                  </span>
                )}
                {item.spicy && (
                  <span className="flex items-center gap-1 px-3 py-1 bg-red-500/10 text-red-400 rounded-full text-xs font-semibold border border-red-500/20">
                    <Flame className="w-3 h-3" /> Spicy
                  </span>
                )}
                {item.sugarFree && (
                  <span className="flex items-center gap-1 px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-xs font-semibold border border-blue-500/20">
                    <Sparkles className="w-3 h-3" /> Sugar Free
                  </span>
                )}
              </div>

              {/* Ingredients & Allergens */}
              {(ingredientsList.length > 0 || (item.allergens && item.allergens.length > 0)) && (
                <div className="pt-4 space-y-4 border-t border-zinc-800">
                  {ingredientsList.length > 0 && (
                    <div>
                      <h4 className="text-xs font-semibold text-zinc-400 mb-2 uppercase tracking-wider">Ingredients</h4>
                      <div className="flex flex-wrap gap-2">
                        {ingredientsList.map((ing: string, i: number) => (
                          <span key={i} className="px-3 py-1 bg-zinc-800/80 text-zinc-300 rounded-full text-xs border border-zinc-700">
                            {ing}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {item.allergens && item.allergens.length > 0 && (
                    <div>
                      <h4 className="text-xs font-semibold text-red-400/80 mb-2 uppercase tracking-wider">Allergens</h4>
                      <div className="flex flex-wrap gap-2">
                        {item.allergens.map((alg: string, i: number) => (
                          <span key={i} className="px-3 py-1 bg-red-500/10 text-red-400 rounded-full text-xs font-medium border border-red-500/20">
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

          {/* Reviews Section */}
          <div className="border-t border-zinc-800 pt-6">
            <h3 className="mb-4 text-lg font-bold text-white">⭐ Customer Reviews</h3>
            {isLoading ? (
              <p className="text-zinc-500 text-sm">Loading reviews...</p>
            ) : (
              <ReviewDisplay
                reviews={reviews}
                averageRating={averageRating}
                totalReviews={totalReviews}
              />
            )}
          </div>

          {/* Review Form */}
          <div className="border-t border-zinc-800 pt-6">
            <ReviewForm menuItemId={item.id} onSubmitSuccess={handleReviewSubmitted} />
          </div>
        </div>
      </div>
    </div>
  );
}
