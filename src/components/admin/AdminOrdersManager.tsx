"use client";

import { useEffect, useState } from "react";
import OrderCard from "@/components/admin/OrderCard";
import FilterBar from "@/components/client/FilterBar";
import { OrderRecord, OrderStatus } from "@/types/app";

const ORDER_FILTERS = ["All", "PENDING", "PREPARING", "READY", "COMPLETED", "CANCELLED"];

export default function AdminOrdersManager() {
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [activeFilter, setActiveFilter] = useState("All");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const loadOrders = async () => {
    setIsLoading(true);
    const response = await fetch("/api/orders");
    const data = await response.json();
    if (!response.ok) {
      setMessage(data.message ?? "Unable to load orders.");
      setIsLoading(false);
      return;
    }
    setOrders(data);
    setIsLoading(false);
  };

  useEffect(() => {
    void loadOrders();
  }, []);

  const updateStatus = async (id: string, status: OrderStatus) => {
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

    setOrders((currentOrders) => currentOrders.map((order) => (order._id === id ? data : order)));
    setMessage(`Order status updated to ${status}.`);
  };

  const filteredOrders =
    activeFilter === "All" ? orders : orders.filter((order) => order.status === activeFilter);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="mb-2 text-4xl font-bold">Order Management</h1>
          <p className="text-zinc-500">
            Admins can view every order and move it through the kitchen workflow from pending to completed.
          </p>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          <div className="glass-card rounded-2xl p-4">
            <p className="text-sm text-zinc-500">Total Orders</p>
            <p className="text-2xl font-bold">{orders.length}</p>
          </div>
          <div className="glass-card rounded-2xl p-4">
            <p className="text-sm text-zinc-500">Pending</p>
            <p className="text-2xl font-bold text-gold-500">{orders.filter((order) => order.status === "PENDING").length}</p>
          </div>
          <div className="glass-card rounded-2xl p-4">
            <p className="text-sm text-zinc-500">Ready</p>
            <p className="text-2xl font-bold text-green-500">{orders.filter((order) => order.status === "READY").length}</p>
          </div>
        </div>
      </div>

      <FilterBar categories={ORDER_FILTERS} activeCategory={activeFilter} onSelect={setActiveFilter} />
      {message ? <div className="rounded-2xl border border-gold-500/20 bg-gold-500/10 p-4 text-sm text-gold-400">{message}</div> : null}

      {isLoading ? (
        <p className="text-zinc-500">Loading orders...</p>
      ) : filteredOrders.length === 0 ? (
        <div className="glass-card rounded-3xl p-10 text-center text-zinc-400">
          No orders found for this status filter.
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {filteredOrders.map((order) => (
            <OrderCard key={order._id} order={order} onStatusChange={updateStatus} />
          ))}
        </div>
      )}
    </div>
  );
}
