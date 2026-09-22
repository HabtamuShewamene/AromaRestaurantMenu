"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import OrderCard from "@/features/admin/components/OrderCard";
import { OrderRecord } from "@/shared/types/app";

export default function OrdersHistory() {
  const { data: session, status } = useSession();
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (status !== "authenticated") {
      return;
    }

    const loadOrders = async () => {
      setIsLoading(true);
      const response = await fetch("/api/orders");
      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message ?? "Unable to load your orders.");
        setIsLoading(false);
        return;
      }

      setOrders(data);
      setIsLoading(false);
    };

    void loadOrders();
  }, [status]);

  if (status === "loading") {
    return <p className="text-zinc-500">Loading your account...</p>;
  }

  if (!session?.user) {
    return (
      <div className="glass-card rounded-3xl p-10 text-center">
        <h2 className="mb-3 text-2xl font-bold">Sign in to view your order history</h2>
        <p className="mb-6 text-zinc-500">Clients can place orders and track only their own purchases.</p>
        <Link href="/login" className="rounded-full bg-brand-600 px-6 py-3 font-bold text-black transition-colors hover:bg-brand-700">
          Go To Login
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {message ? <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-500">{message}</div> : null}
      {isLoading ? (
        <p className="text-zinc-500">Loading orders...</p>
      ) : orders.length === 0 ? (
        <div className="glass-card rounded-3xl p-10 text-center text-zinc-400">
          No orders yet. Place one from your cart and it will show up here.
        </div>
      ) : (
        orders.map((order) => <OrderCard key={order.id} order={order} />)
      )}
    </div>
  );
}
