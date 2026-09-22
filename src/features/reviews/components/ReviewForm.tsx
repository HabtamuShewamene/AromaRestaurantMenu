"use client";

import { useState } from "react";
import { Star } from "lucide-react";

type ReviewFormProps = {
  menuItemId: string;
  onSubmitSuccess?: () => void;
};

export default function ReviewForm({ menuItemId, onSubmitSuccess }: ReviewFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          menuItemId,
          name: name || "Anonymous",
          email,
          rating,
          comment,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to submit review");
      }

      setMessage("✅ Review submitted! Awaiting admin approval");
      setName("");
      setEmail("");
      setRating(5);
      setComment("");
      
      if (onSubmitSuccess) {
        onSubmitSuccess();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-zinc-800/50 bg-[#292C2B]/20 p-6">
      <h3 className="text-lg font-bold">✍️ Write a Review</h3>

      {message && (
        <p className="rounded-xl bg-green-500/10 p-3 text-sm text-green-400">{message}</p>
      )}
      {error && (
        <p className="rounded-xl bg-red-500/10 p-3 text-sm text-red-400">{error}</p>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <input
          type="text"
          placeholder="Your name (optional)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={50}
          className="rounded-xl border border-zinc-800 bg-[#292C2B] px-4 py-2 text-sm outline-none focus:border-brand-500 transition-all"
        />
        <input
          type="email"
          placeholder="Your email (required)"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="rounded-xl border border-zinc-800 bg-[#292C2B] px-4 py-2 text-sm outline-none focus:border-brand-500 transition-all"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">Star Rating</label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className="transition-all hover:scale-110"
            >
              <Star
                className="h-6 w-6"
                fill={star <= rating ? "#b68d40" : "transparent"}
                stroke={star <= rating ? "#b68d40" : "#52525b"}
              />
            </button>
          ))}
        </div>
      </div>

      <textarea
        placeholder="Share your experience..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        minLength={3}
        maxLength={500}
        required
        rows={4}
        className="w-full rounded-xl border border-zinc-800 bg-[#292C2B] px-4 py-3 text-sm outline-none focus:border-brand-500 transition-all resize-none"
      />

      <p className="text-xs text-zinc-500">
        ✨ Reviews are moderated and will appear after admin approval
      </p>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-xl bg-brand-600 px-4 py-2 font-bold text-black transition-all hover:bg-brand-700 disabled:bg-zinc-700 disabled:text-zinc-400"
      >
        {isSubmitting ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
}
