"use client";

import { useEffect, useState } from "react";
import { AnalyticsRecord } from "@/types/app";

export default function AnalyticsPanel() {
  const [analytics, setAnalytics] = useState<AnalyticsRecord | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadAnalytics = async () => {
      const response = await fetch("/api/analytics");
      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message ?? "Unable to load analytics.");
        return;
      }

      setAnalytics(data);
    };

    void loadAnalytics();
  }, []);

  if (message) {
    return <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-500">{message}</div>;
  }

  if (!analytics) {
    return <p className="text-zinc-500">Loading analytics...</p>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="mb-2 text-4xl font-bold">Analytics</h1>
        <p className="text-zinc-500">
          Admin-only sales insights for revenue, order flow, and popular items.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <div className="glass-card rounded-3xl p-6">
          <p className="text-sm text-zinc-500">Revenue</p>
          <p className="mt-3 text-3xl font-bold text-gold-500">${analytics.totalRevenue.toFixed(2)}</p>
        </div>
        <div className="glass-card rounded-3xl p-6">
          <p className="text-sm text-zinc-500">Orders</p>
          <p className="mt-3 text-3xl font-bold">{analytics.totalOrders}</p>
        </div>
        <div className="glass-card rounded-3xl p-6">
          <p className="text-sm text-zinc-500">Pending</p>
          <p className="mt-3 text-3xl font-bold text-orange-400">{analytics.pendingOrders}</p>
        </div>
        <div className="glass-card rounded-3xl p-6">
          <p className="text-sm text-zinc-500">Avg Order</p>
          <p className="mt-3 text-3xl font-bold">${analytics.averageOrderValue.toFixed(2)}</p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <section className="glass-card rounded-3xl p-8">
          <h2 className="mb-6 text-2xl font-bold">Popular Items</h2>
          <div className="space-y-4">
            {analytics.popularItems.map((item) => (
              <div key={item.name} className="flex items-center justify-between rounded-2xl border border-white/5 p-4">
                <div>
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-sm text-zinc-500">{item.quantity} sold</p>
                </div>
                <span className="font-mono text-gold-500">${item.revenue.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="glass-card rounded-3xl p-8">
          <h2 className="mb-6 text-2xl font-bold">Order Status Mix</h2>
          <div className="space-y-4">
            {analytics.salesByStatus.map((entry) => (
              <div key={entry.status} className="flex items-center justify-between rounded-2xl border border-white/5 p-4">
                <span>{entry.status}</span>
                <span className="font-bold">{entry.count}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
