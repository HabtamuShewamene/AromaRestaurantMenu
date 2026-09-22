"use client";

import { useEffect, useState, useCallback } from "react";
import OrderCard from "@/features/admin/components/OrderCard";
import FilterBar from "@/features/menu/components/FilterBar";
import { OrderRecord, OrderStatus } from "@/shared/types/app";
import { ShoppingBag, Clock, ChefHat, BellRing, RefreshCw } from "lucide-react";

const ORDER_FILTERS = [
  "All",
  "NEW",
  "CONFIRMED",
  "PREPARING",
  "READY",
  "SERVED",
  "COMPLETED",
  "CANCELLED",
];

export default function AdminOrdersManager() {
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [activeFilter, setActiveFilter] = useState("All");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchOrders = useCallback(async () => {
    try {
      const response = await fetch("/api/orders");
      const data = await response.json();
      if (response.ok && Array.isArray(data)) {
        setOrders(data);
      }
    } catch {
      // Background poll failure silent
    }
  }, []);

  // Initial load
  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      await fetchOrders();
      setIsLoading(false);
    };
    void load();
  }, [fetchOrders]);

  // Live polling every 5 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      setIsRefreshing(true);
      await fetchOrders();
      setIsRefreshing(false);
    }, 5000);
    return () => clearInterval(interval);
  }, [fetchOrders]);

  const updateStatus = async (id: string, status: OrderStatus) => {
    try {
      const response = await fetch(`/api/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message ?? "Unable to update order status.");
        return;
      }

      setOrders((currentOrders) =>
        currentOrders.map((order) => (order.id === id ? data : order))
      );
      setMessage(`Order #${id.slice(-6).toUpperCase()} transitioned to ${status}.`);
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Failed to update order");
    }
  };

  const filteredOrders =
    activeFilter === "All"
      ? orders
      : orders.filter((order) => {
          const norm = order.status.toUpperCase();
          if (activeFilter === "NEW") return norm === "NEW" || norm === "PENDING";
          return norm === activeFilter;
        });

  const newOrdersCount = orders.filter((o) => ["NEW", "PENDING"].includes(o.status.toUpperCase())).length;
  const preparingCount = orders.filter((o) => o.status.toUpperCase() === "PREPARING").length;
  const readyCount = orders.filter((o) => o.status.toUpperCase() === "READY").length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl sm:text-4xl font-bold text-white font-playfair">
              Live Order Management
            </h1>
            {isRefreshing && (
              <RefreshCw className="w-4 h-4 text-brand-400 animate-spin" />
            )}
          </div>
          <p className="text-zinc-400 text-sm">
            Monitor incoming table guest & customer orders and advance them through the kitchen & serving stages.
          </p>
        </div>

        {/* Quick Operational Counters */}
        <div className="grid grid-cols-3 gap-3">
          <div className="glass-card rounded-2xl p-4 border border-blue-500/20 bg-blue-500/5">
            <div className="flex items-center gap-1.5 text-xs text-blue-400 font-semibold mb-1">
              <Clock className="w-3.5 h-3.5" /> New
            </div>
            <p className="text-2xl font-bold text-white font-mono">{newOrdersCount}</p>
          </div>

          <div className="glass-card rounded-2xl p-4 border border-amber-500/20 bg-amber-500/5">
            <div className="flex items-center gap-1.5 text-xs text-amber-400 font-semibold mb-1">
              <ChefHat className="w-3.5 h-3.5" /> In Prep
            </div>
            <p className="text-2xl font-bold text-white font-mono">{preparingCount}</p>
          </div>

          <div className="glass-card rounded-2xl p-4 border border-green-500/20 bg-green-500/5">
            <div className="flex items-center gap-1.5 text-xs text-green-400 font-semibold mb-1">
              <BellRing className="w-3.5 h-3.5" /> Ready
            </div>
            <p className="text-2xl font-bold text-white font-mono">{readyCount}</p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <FilterBar
        categories={ORDER_FILTERS}
        activeCategory={activeFilter}
        onSelect={setActiveFilter}
      />

      {message && (
        <div className="rounded-2xl border border-brand-500/20 bg-brand-500/10 p-4 text-sm text-brand-300 animate-fade-in">
          {message}
        </div>
      )}

      {isLoading ? (
        <div className="py-16 text-center text-zinc-500">Loading orders...</div>
      ) : filteredOrders.length === 0 ? (
        <div className="glass-card rounded-3xl p-12 text-center text-zinc-400 space-y-2">
          <ShoppingBag className="w-8 h-8 text-zinc-600 mx-auto" />
          <p className="font-semibold text-white">No orders in this status</p>
          <p className="text-xs text-zinc-500">New customer orders will appear here automatically in real time.</p>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {filteredOrders.map((order) => (
            <OrderCard key={order.id} order={order} onStatusChange={updateStatus} />
          ))}
        </div>
      )}
    </div>
  );
}
