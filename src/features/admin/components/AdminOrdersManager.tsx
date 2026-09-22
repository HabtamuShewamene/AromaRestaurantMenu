"use client";

import { useEffect, useState, useCallback } from "react";
import OrderCard from "@/features/admin/components/OrderCard";
import FilterBar from "@/features/menu/components/FilterBar";
import { OrderRecord, OrderStatus } from "@/shared/types/app";
import { RefreshCw } from "lucide-react";

const ORDER_FILTERS = [
  "All",
  "NEW",
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
      // background failure silent
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      setIsLoading(true);
      await fetchOrders();
      if (isMounted) setIsLoading(false);
    };
    void load();
    return () => { isMounted = false; };
  }, [fetchOrders]);

  useEffect(() => {
    const interval = setInterval(async () => {
      setIsRefreshing(true);
      await fetchOrders();
      setIsRefreshing(false);
    }, 10000); // 10s polling for orders is safe
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

  const filteredOrders = activeFilter === "All"
    ? orders
    : orders.filter((order) => {
        const norm = order.status.toUpperCase();
        if (activeFilter === "NEW") return norm === "NEW" || norm === "PENDING" || norm === "CONFIRMED";
        return norm === activeFilter;
      });

  return (
    <div className="min-h-screen pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-8 sticky top-0 md:relative z-20 bg-background/95 backdrop-blur-md pt-2 pb-4 border-b border-border md:border-none">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">Orders</h1>
            {isRefreshing && <RefreshCw className="w-4 h-4 text-primary animate-spin" />}
          </div>
          <p className="text-sm text-muted-foreground mt-1 hidden sm:block">
            Monitor and process incoming guest requests.
          </p>
        </div>
      </div>

      <div className="mb-6 overflow-x-auto no-scrollbar pb-2">
        <FilterBar categories={ORDER_FILTERS} activeCategory={activeFilter} onSelect={setActiveFilter} />
      </div>

      {message && (
        <div className="mb-6 p-4 rounded-xl bg-primary/10 border border-primary/20 text-primary text-sm font-bold animate-fade-in">
          {message}
        </div>
      )}

      {isLoading ? (
        <div className="grid gap-3 sm:gap-5 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {[1,2,3].map(i => <div key={i} className="h-64 rounded-3xl bg-[#242424] animate-pulse" />)}
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center rounded-3xl border border-dashed border-[#3A3D40] bg-[#242424]/50">
          <div className="w-16 h-16 rounded-full bg-[#3A3D40] flex items-center justify-center mb-4 text-2xl">📝</div>
          <h3 className="text-xl font-bold text-[#F7F7F2]">No orders found</h3>
          <p className="text-[#A7ABB0] text-sm max-w-md mt-2">
            No orders match the current filter criteria.
          </p>
        </div>
      ) : (
        <div className="grid gap-3 sm:gap-5 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {filteredOrders.map(order => (
            <OrderCard key={order.id} order={order} onUpdateStatus={updateStatus} />
          ))}
        </div>
      )}
    </div>
  );
}
