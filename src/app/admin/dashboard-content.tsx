"use client";

import Link from "next/link";
import { ArrowRight, BarChart3, ListTree, Utensils, Star, ShieldCheck, Clock, Users } from "lucide-react";
import { useEffect, useState } from "react";

type Stats = {
  totalItems: number;
  totalReviews: number;
  pendingReviews: number;
  averageRating: number;
  topItems: Array<{ id: string; name: string; avgRating: number; count: number }>;
};

const adminCapabilities = [
  {
    title: "Menu Control",
    description: "Add items, update price and descriptions, toggle availability, or delete outdated products.",
    href: "/admin/menu",
    icon: Utensils,
  },
  {
    title: "Categories",
    description: "Manage menu categories like Coffee, Tea, Cold Drinks, and Pastries.",
    href: "/admin/categories",
    icon: ListTree,
  },
  {
    title: "Review Moderation",
    description: "Moderate customer reviews and manage approval workflow for menu item feedback.",
    href: "/admin/reviews",
    icon: Star,
  },
  {
    title: "System Analytics",
    description: "Track popular items, revenue, and system-wide performance data.",
    href: "/admin/analytics",
    icon: BarChart3,
  },
];

export default function AdminDashboardContent() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-12">
      <div>
        <h1 className="mb-3 text-5xl font-bold">
          Admin <span className="text-gold-500">Control Center</span>
        </h1>
        <p className="max-w-3xl text-lg text-zinc-500">
          Full control over menu data, review moderation, and system reporting.
        </p>
      </div>

      {/* ── Stats Overview ── */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Menu Items" 
          value={loading ? "..." : stats?.totalItems ?? 0} 
          icon={Utensils} 
          color="blue"
        />
        <StatCard 
          title="Total Reviews" 
          value={loading ? "..." : stats?.totalReviews ?? 0} 
          icon={Users} 
          color="purple"
        />
        <StatCard 
          title="Pending Approval" 
          value={loading ? "..." : stats?.pendingReviews ?? 0} 
          icon={Clock} 
          color="amber"
          highlight={stats?.pendingReviews ? stats.pendingReviews > 0 : false}
        />
        <StatCard 
          title="Avg Rating" 
          value={loading ? "..." : (stats?.averageRating ?? 0).toFixed(1)} 
          icon={Star} 
          color="gold"
        />
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* ── Main Actions ── */}
        <div className="lg:col-span-2 grid gap-6 md:grid-cols-2">
          {adminCapabilities.map((capability) => (
            <Link key={capability.title} href={capability.href} className="glass-card rounded-3xl p-8 transition-all hover:border-gold-500/40 group">
              <div className="mb-6 flex items-center justify-between">
                <div className="rounded-2xl bg-gold-500/10 p-3 text-gold-500 group-hover:bg-gold-500/20 transition-colors">
                  <capability.icon className="h-6 w-6" />
                </div>
                <ArrowRight className="h-5 w-5 text-zinc-500 group-hover:text-gold-500 transition-colors" />
              </div>
              <h2 className="mb-3 text-2xl font-bold">{capability.title}</h2>
              <p className="text-zinc-500 text-sm leading-relaxed">{capability.description}</p>
            </Link>
          ))}
        </div>

        {/* ── Top Rated Items ── */}
        <div className="glass-card rounded-3xl p-8">
          <div className="flex items-center gap-2 mb-6">
            <Star className="h-5 w-5 text-gold-500" />
            <h2 className="text-xl font-bold">Top Rated</h2>
          </div>
          
          <div className="space-y-6">
            {loading ? (
              <div className="animate-pulse space-y-4">
                {[1,2,3].map(i => <div key={i} className="h-12 bg-white/5 rounded-2xl" />)}
              </div>
            ) : stats?.topItems && stats.topItems.length > 0 ? (
              stats.topItems.map((item, idx) => (
                <div key={item.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-zinc-600 w-4">{idx + 1}</span>
                    <div>
                      <p className="font-semibold text-sm">{item.name}</p>
                      <p className="text-[10px] text-zinc-500">{item.count} reviews</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 bg-gold-500/10 px-2 py-1 rounded-lg">
                    <Star className="h-3 w-3 fill-gold-500 text-gold-500" />
                    <span className="text-xs font-bold text-gold-500">{item.avgRating.toFixed(1)}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-zinc-600 italic">No ratings yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color, highlight = false }: any) {
  return (
    <div className={`glass-card rounded-3xl p-6 relative overflow-hidden ${highlight ? 'border-amber-500/30 ring-1 ring-amber-500/20' : ''}`}>
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-2xl bg-zinc-900 border border-white/5`}>
          <Icon className="h-5 w-5 text-zinc-400" />
        </div>
        <div>
          <p className="text-xs text-zinc-500 uppercase tracking-widest font-medium mb-1">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </div>
      {highlight && (
        <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
      )}
    </div>
  );
}
