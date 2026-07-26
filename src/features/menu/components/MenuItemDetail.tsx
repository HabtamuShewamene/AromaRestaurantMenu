"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import Image from "next/image";
import { MenuItemRecord, ReviewRecord } from "@/shared/types/app";
import ReviewDisplay from "@/features/reviews/components/ReviewDisplay";
import ReviewForm from "@/features/reviews/components/ReviewForm";

type MenuItemDetailProps = {
  item: MenuItemRecord;
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
        setReviews(data.reviews);
        setAverageRating(data.averageRating);
        setTotalReviews(data.totalReviews);
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
    // Reload reviews after successful submission
    try {
      const response = await fetch(`/api/reviews?menuItemId=${item.id}`);
      const data = await response.json();
      setReviews(data.reviews);
      setAverageRating(data.averageRating);
      setTotalReviews(data.totalReviews);
    } catch {
      // Silently fail
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-zinc-900 border border-zinc-800">
        <div className="sticky top-0 flex items-center justify-between border-b border-zinc-800 bg-zinc-900/95 px-6 py-4 backdrop-blur-md">
          <h2 className="text-2xl font-bold">{item.name}</h2>
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

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-gold-500">{categoryName}</p>
                  <p className="text-3xl font-bold text-gold-500">${item.price.toFixed(2)}</p>
                </div>
                <span
                  className={`rounded-full px-4 py-2 font-bold text-sm ${
                    item.isAvailable
                      ? "bg-green-500/10 text-green-500"
                      : "bg-red-500/10 text-red-500"
                  }`}
                >
                  {item.isAvailable ? "In Stock" : "Out of Stock"}
                </span>
              </div>
              <p className="text-zinc-300">{item.description}</p>

              {/* Ingredients & Allergens */}
              {((item.ingredients && item.ingredients.length > 0) || (item.allergens && item.allergens.length > 0)) && (
                <div className="pt-4 space-y-4">
                  {item.ingredients && item.ingredients.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-zinc-400 mb-2 uppercase tracking-wider">Ingredients</h4>
                      <div className="flex flex-wrap gap-2">
                        {item.ingredients.map((ing, i) => (
                          <span key={i} className="px-3 py-1 bg-zinc-800 text-zinc-300 rounded-full text-sm border border-zinc-700">
                            {ing}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {item.allergens && item.allergens.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-red-400/80 mb-2 uppercase tracking-wider">Allergens</h4>
                      <div className="flex flex-wrap gap-2">
                        {item.allergens.map((alg, i) => (
                          <span key={i} className="px-3 py-1 bg-red-500/10 text-red-400 rounded-full text-sm border border-red-500/20">
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
            <h3 className="mb-4 text-lg font-bold">⭐ Customer Reviews</h3>
            {isLoading ? (
              <p className="text-zinc-500">Loading reviews...</p>
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
