import ReviewManager from "@/features/admin/components/ReviewManager";

export default function AdminReviewsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="mb-3 text-5xl font-bold">
          Review <span className="text-gold-500">Moderation</span>
        </h1>
        <p className="max-w-3xl text-lg text-zinc-500">
          Approve or reject customer reviews. Pending reviews are hidden until approved. Approved reviews appear on menu items for other customers to see.
        </p>
      </div>

      <div className="glass-card rounded-3xl p-8">
        <ReviewManager />
      </div>
    </div>
  );
}
