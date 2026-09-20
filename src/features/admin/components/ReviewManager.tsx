"use client";

import { useEffect, useState } from "react";
import { CheckCircle, XCircle, Trash2, Shield, Mail, Globe, Calendar, Info, Star } from "lucide-react";
import { ReviewRecord } from "@/shared/types/app";

export default function AdminReviewManager() {
  const [reviews, setReviews] = useState<ReviewRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadReviews = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/admin/reviews");
        const reviewsData = response.ok ? await response.json() : [];
        setReviews(Array.isArray(reviewsData) ? reviewsData : []);
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
          review.id === reviewId ? { ...review, isApproved: true } : review
        )
      );
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to approve review");
    }
  };

  const handleReject = async (reviewId: string) => {
    if (!confirm("Are you sure you want to delete this review permanently?")) return;
    
    try {
      const response = await fetch(`/api/reviews/${reviewId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete review");

      setReviews((prev) => prev.filter((review) => review.id !== reviewId));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete review");
    }
  };

  const pendingReviews = reviews.filter((review) => !review.isApproved);
  const approvedReviews = reviews.filter((review) => review.isApproved);

  if (isLoading) {
    return <div className="py-20 text-center text-zinc-500 animate-pulse">Loading moderation queue...</div>;
  }

  return (
    <div className="space-y-12">
      {/* ── Pending Reviews ── */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
          <h3 className="text-xl font-bold">Pending Moderation</h3>
          <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 text-[10px] font-bold uppercase tracking-wider">
            {pendingReviews.length} New
          </span>
        </div>

        {pendingReviews.length === 0 ? (
          <div className="glass-card rounded-[2rem] p-12 text-center border-dashed border-white/5">
            <Shield className="w-10 h-10 text-zinc-800 mx-auto mb-4" />
            <p className="text-zinc-500">Moderation queue is empty.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {pendingReviews.map((review) => (
              <ReviewModerationCard 
                key={review.id} 
                review={review} 
                onApprove={handleApprove} 
                onReject={handleReject}
              />
            ))}
          </div>
        )}
      </section>

      {/* ── Approved Reviews ── */}
      <section className="pt-8 border-t border-white/5">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <h3 className="text-xl font-bold">Approved History</h3>
        </div>

        <div className="grid gap-3">
          {approvedReviews.map((review) => (
            <div
              key={review.id}
              className="group flex items-center justify-between gap-4 p-4 rounded-2xl bg-zinc-900/40 border border-white/5 hover:bg-zinc-900 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-bold text-zinc-100 text-sm">{review.name}</p>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-green-500/10 text-green-500 font-bold uppercase">Approved</span>
                </div>
                <p className="text-xs text-zinc-500 line-clamp-1 italic">
                  "{review.comment}"
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="hidden sm:block text-right">
                   <p className="text-[10px] text-zinc-600 font-mono uppercase tracking-tighter">{review.item?.name}</p>
                   <p className="text-[10px] text-zinc-700">{new Date(review.createdAt).toLocaleDateString()}</p>
                </div>
                <button
                  onClick={() => handleReject(review.id)}
                  className="p-2 text-zinc-600 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
          {approvedReviews.length === 0 && <p className="text-sm text-zinc-600 italic px-4">No reviews approved yet.</p>}
        </div>
      </section>
    </div>
  );
}

function ReviewModerationCard({ review, onApprove, onReject }: any) {
  return (
    <div className="glass-card rounded-[2rem] p-6 border-amber-500/10 hover:border-amber-500/20 transition-all">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Reviewer Details */}
        <div className="md:w-1/3 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gold-500/10 flex items-center justify-center text-gold-500 font-bold text-lg">
              {review.name[0]}
            </div>
            <div>
              <p className="font-bold text-white">{review.name}</p>
              <div className="flex items-center gap-1.5 text-gold-500">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-3 h-3 ${i < review.rating ? 'fill-current' : 'opacity-20'}`} 
                  />
                ))}
              </div>
            </div>
          </div>
          
          <div className="space-y-2 pt-2 border-t border-white/5">
            <DetailRow icon={Mail} label="Email" value={review.email} />
            <DetailRow icon={Globe} label="IP Address" value={review.ipAddress || "Unknown"} />
            <DetailRow icon={Calendar} label="Submitted" value={new Date(review.createdAt).toLocaleString()} />
            <DetailRow icon={Info} label="Target" value={review.item?.name || "Unknown Item"} />
          </div>
        </div>

        {/* Content & Actions */}
        <div className="flex-1 flex flex-col justify-between">
          <div className="bg-white/[0.03] rounded-2xl p-5 mb-6">
             <p className="text-zinc-200 leading-relaxed">
               "{review.comment}"
             </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onApprove(review.id)}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-green-500 text-black font-bold hover:bg-green-400 transition-all shadow-[0_4px_20px_rgba(34,197,94,0.3)]"
            >
              <CheckCircle className="w-4 h-4" /> Approve Review
            </button>
            <button
              onClick={() => onReject(review.id)}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-zinc-900 text-zinc-400 border border-white/5 font-bold hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/20 transition-all"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ icon: Icon, label, value }: any) {
  return (
    <div className="flex items-center gap-2 text-[11px]">
      <Icon className="w-3.5 h-3.5 text-zinc-600" />
      <span className="text-zinc-500">{label}:</span>
      <span className="text-zinc-300 font-mono truncate">{value}</span>
    </div>
  );
}
