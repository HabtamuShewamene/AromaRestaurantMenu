"use client";

import { useEffect, useState } from "react";
import { CheckCircle, XCircle, Trash2 } from "lucide-react";
import { ReviewRecord, MenuItemRecord } from "@/types/app";

export default function AdminReviewManager() {
  const [reviews, setReviews] = useState<(ReviewRecord & { menuItemName?: string })[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadReviews = async () => {
      try {
        setIsLoading(true);
        // Fetch all menu items to map IDs to names
        const itemsResponse = await fetch("/api/menu");
        const items: MenuItemRecord[] = await itemsResponse.json();
        const itemMap = Object.fromEntries(items.map((item) => [item._id, item.name]));

        // Fetch all reviews (including unapproved ones)
        const reviewsResponse = await fetch("/api/reviews?menuItemId=all");
        let reviewsData = [];

        if (reviewsResponse.ok) {
          reviewsData = await reviewsResponse.json();
        } else {
          // Fallback: fetch reviews through admin endpoint if available
          const adminResponse = await fetch("/api/admin/reviews");
          if (adminResponse.ok) {
            reviewsData = await adminResponse.json();
          }
        }

        const enrichedReviews = Array.isArray(reviewsData)
          ? reviewsData.map((review) => ({
              ...review,
              menuItemName: itemMap[review.menuItem] || "Unknown Item",
            }))
          : [];

        setReviews(enrichedReviews);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load reviews");
      } finally {
        setIsLoading(false);
      }
    };

    void loadReviews();
  }, []);

  const handleApprove = async (reviewId: string) => {
    try {
      const response = await fetch(`/api/reviews/${reviewId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isApproved: true }),
      });

      if (!response.ok) throw new Error("Failed to approve review");

      setReviews((prev) =>
        prev.map((review) =>
          review._id === reviewId ? { ...review, isApproved: true } : review
        )
      );
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to approve review");
    }
  };

  const handleReject = async (reviewId: string) => {
    try {
      const response = await fetch(`/api/reviews/${reviewId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to reject review");

      setReviews((prev) => prev.filter((review) => review._id !== reviewId));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to reject review");
    }
  };

  const pendingReviews = reviews.filter((r) => !r.isApproved);
  const approvedReviews = reviews.filter((r) => r.isApproved);

  if (isLoading)
    return <p className="py-8 text-center text-zinc-400">Loading reviews...</p>;

  if (error)
    return (
      <p className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-500">
        {error}
      </p>
    );

  return (
    <div className="space-y-8">
      {/* Pending Reviews */}
      <div>
        <h3 className="mb-4 text-lg font-bold">
          Pending Approval ({pendingReviews.length})
        </h3>
        {pendingReviews.length === 0 ? (
          <p className="py-6 text-center text-zinc-500">No pending reviews</p>
        ) : (
          <div className="space-y-3">
            {pendingReviews.map((review) => (
              <div
                key={review._id}
                className="rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-5"
              >
                <div className="mb-2 flex items-start justify-between">
                  <div>
                    <p className="font-bold text-zinc-100">{review.name}</p>
                    <p className="text-xs text-zinc-400">
                      {review.menuItemName} • {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className={`h-3 w-3 rounded-full ${
                          i < review.rating ? "bg-gold-500" : "bg-zinc-700"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="mb-3 text-sm text-zinc-300">{review.comment}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleApprove(review._id)}
                    className="flex items-center gap-2 rounded-lg bg-green-600 px-3 py-2 text-sm font-bold text-white hover:bg-green-700 transition-all"
                  >
                    <CheckCircle className="h-4 w-4" /> Approve
                  </button>
                  <button
                    onClick={() => handleReject(review._id)}
                    className="flex items-center gap-2 rounded-lg bg-red-600 px-3 py-2 text-sm font-bold text-white hover:bg-red-700 transition-all"
                  >
                    <XCircle className="h-4 w-4" /> Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Approved Reviews */}
      <div className="border-t border-zinc-800 pt-8">
        <h3 className="mb-4 text-lg font-bold">
          Approved ({approvedReviews.length})
        </h3>
        {approvedReviews.length === 0 ? (
          <p className="py-6 text-center text-zinc-500">No approved reviews</p>
        ) : (
          <div className="space-y-3">
            {approvedReviews.map((review) => (
              <div
                key={review._id}
                className="rounded-2xl border border-green-500/20 bg-green-500/5 p-5 flex items-start justify-between"
              >
                <div className="flex-1">
                  <p className="font-bold text-zinc-100">{review.name}</p>
                  <p className="text-xs text-zinc-400">
                    {review.menuItemName} • {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                  <p className="mt-2 text-sm text-zinc-300">{review.comment}</p>
                </div>
                <button
                  onClick={() => handleReject(review._id)}
                  className="rounded-lg p-2 text-zinc-400 hover:bg-red-500/10 hover:text-red-500 transition-all"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
