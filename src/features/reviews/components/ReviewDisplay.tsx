"use client";

import { Star } from "lucide-react";
import { ReviewRecord } from "@/shared/types/app";

type ReviewDisplayProps = {
  reviews: ReviewRecord[];
  averageRating: number;
  totalReviews: number;
};

export default function ReviewDisplay({
  reviews,
  averageRating,
  totalReviews,
}: ReviewDisplayProps) {
  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      <div className="flex items-center gap-4 rounded-2xl border border-zinc-800/50 bg-[#292C2B]/20 p-6">
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold">{averageRating}</span>
            <span className="text-lg text-zinc-500">/5</span>
          </div>
          <div className="mt-2 flex gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="h-4 w-4"
                fill={i < Math.round(averageRating) ? "#b68d40" : "transparent"}
                stroke={i < Math.round(averageRating) ? "#b68d40" : "#52525b"}
              />
            ))}
          </div>
          <p className="mt-2 text-sm text-zinc-400">{totalReviews} reviews</p>
        </div>
      </div>

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <p className="py-8 text-center text-zinc-500">No reviews yet. Be the first to review!</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="rounded-2xl border border-zinc-800/50 bg-[#292C2B]/20 p-5 hover:border-brand-500/20 transition-all"
            >
              <div className="mb-3 flex items-start justify-between">
                <div>
                  <p className="font-semibold text-zinc-100">{review.name}</p>
                  <p className="text-xs text-zinc-500">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4"
                      fill={i < review.rating ? "#b68d40" : "transparent"}
                      stroke={i < review.rating ? "#b68d40" : "#52525b"}
                    />
                  ))}
                </div>
              </div>
              <p className="text-sm text-zinc-300">{review.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
