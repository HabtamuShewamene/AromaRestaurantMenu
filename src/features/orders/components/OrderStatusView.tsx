"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Clock,
  ChefHat,
  Bell,
  UtensilsCrossed,
  Sparkles,
  ArrowLeft,
  XCircle,
  ShoppingBag,
} from "lucide-react";
import Link from "next/link";
import { OrderRecord, OrderStatus } from "@/shared/types/app";

const ORDER_STAGES: Array<{ status: OrderStatus; label: string; description: string; icon: any }> = [
  { status: "NEW", label: "Order Received", description: "Your order has been sent to our kitchen.", icon: Clock },
  { status: "CONFIRMED", label: "Confirmed", description: "Kitchen reviewed and accepted your order.", icon: CheckCircle2 },
  { status: "PREPARING", label: "In Preparation", description: "Our culinary artisans are crafting your dishes.", icon: ChefHat },
  { status: "READY", label: "Ready to Serve", description: "Your dishes are plated and ready.", icon: Bell },
  { status: "SERVED", label: "Served", description: "Delivered to your table. Enjoy your meal!", icon: UtensilsCrossed },
  { status: "COMPLETED", label: "Completed", description: "Dining experience completed. Thank you!", icon: Sparkles },
];

function getStageIndex(status: string) {
  const norm = status.toUpperCase();
  if (norm === "PENDING" || norm === "NEW") return 0;
  if (norm === "CONFIRMED") return 1;
  if (norm === "PREPARING") return 2;
  if (norm === "READY") return 3;
  if (norm === "SERVED") return 4;
  if (norm === "COMPLETED") return 5;
  return 0;
}

export default function OrderStatusView({ initialOrder }: { initialOrder: OrderRecord }) {
  const [order, setOrder] = useState<OrderRecord>(initialOrder);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Poll order status every 5 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        setIsRefreshing(true);
        const res = await fetch(`/api/orders/${order.id}`);
        if (res.ok) {
          const latest: OrderRecord = await res.json();
          if (latest && latest.id === order.id) {
            setOrder(latest);
          }
        }
      } catch (err) {
        console.error("Failed to poll order status:", err);
      } finally {
        setIsRefreshing(false);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [order.id]);

  const isCancelled = order.status.toUpperCase() === "CANCELLED";
  const currentStageIdx = getStageIndex(order.status);
  const orderRef = order.id.slice(-6).toUpperCase();

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href={order.tableNumber ? `/table/${order.tableNumber}` : "/menu"}
          className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Menu</span>
        </Link>
        {isRefreshing && (
          <span className="text-[11px] text-zinc-500 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-ping" />
            Live Sync
          </span>
        )}
      </div>

      {/* Hero Header */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl text-center space-y-3 relative overflow-hidden border border-white/10 shadow-2xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/20 text-gold-400 text-xs font-semibold uppercase tracking-wider">
          Order #{orderRef}
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white font-playfair">
          {isCancelled
            ? "Order Cancelled"
            : order.status.toUpperCase() === "COMPLETED"
            ? "Order Completed"
            : "We're Preparing Your Order"}
        </h1>
        <p className="text-zinc-400 text-sm max-w-md mx-auto leading-relaxed">
          {order.tableNumber
            ? `Table ${order.tableNumber} • Dine-in Experience`
            : "Takeaway • Pickup Order"}
        </p>
      </div>

      {/* Lifecycle Progress Bar */}
      {!isCancelled ? (
        <div className="p-6 rounded-3xl bg-[#111111] border border-white/5 space-y-6">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Live Kitchen & Serving Progress
          </h2>

          <div className="space-y-4">
            {ORDER_STAGES.map((stage, idx) => {
              const isPast = idx < currentStageIdx;
              const isCurrent = idx === currentStageIdx;
              const isFuture = idx > currentStageIdx;
              const Icon = stage.icon;

              return (
                <div
                  key={stage.status}
                  className={`flex items-start gap-4 p-3.5 rounded-2xl transition-all ${
                    isCurrent
                      ? "bg-gold-500/10 border border-gold-500/30 shadow-[0_0_20px_rgba(182,141,64,0.1)]"
                      : isPast
                      ? "opacity-60 bg-zinc-950/40"
                      : "opacity-30 bg-zinc-950/20"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                      isCurrent
                        ? "bg-gold-500 text-black shadow-[0_0_15px_rgba(182,141,64,0.5)]"
                        : isPast
                        ? "bg-green-500/20 text-green-400 border border-green-500/40"
                        : "bg-zinc-800 text-zinc-500"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3
                        className={`text-sm font-bold ${
                          isCurrent ? "text-gold-300" : isPast ? "text-white" : "text-zinc-500"
                        }`}
                      >
                        {stage.label}
                      </h3>
                      {isCurrent && (
                        <span className="text-[10px] uppercase tracking-wider font-bold text-gold-400 animate-pulse">
                          Active Stage
                        </span>
                      )}
                      {isPast && (
                        <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-zinc-400 mt-0.5">{stage.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="p-6 rounded-3xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-400">
          <XCircle className="w-6 h-6 flex-shrink-0" />
          <p className="text-sm font-medium">This order was cancelled. Please speak with staff if this was unexpected.</p>
        </div>
      )}

      {/* Order Summary Breakdown */}
      <div className="p-6 rounded-3xl bg-[#111111] border border-white/5 space-y-4">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
          Ordered Items
        </h2>

        <div className="divide-y divide-white/5">
          {order.items.map((item, idx) => (
            <div key={idx} className="py-3 flex items-start justify-between gap-4 text-sm">
              <div className="space-y-1">
                <p className="font-semibold text-white">
                  <span className="text-gold-400 mr-2">{item.quantity}x</span>
                  {item.name}
                </p>
                {item.addons && item.addons.length > 0 && (
                  <div className="text-xs text-zinc-400 space-y-0.5 ml-6">
                    {item.addons.map((a, i) => (
                      <p key={i}>
                        + {a.name} {a.price > 0 ? `(${a.price.toFixed(2)} ETB)` : ""}
                      </p>
                    ))}
                  </div>
                )}
                {item.notes && (
                  <p className="text-xs text-zinc-500 italic ml-6">"{item.notes}"</p>
                )}
              </div>
              <span className="font-mono text-zinc-300 font-medium">
                {item.price * item.quantity > 0 ? `${(item.price * item.quantity).toFixed(2)} ETB` : "Free"}
              </span>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-white/10 flex items-center justify-between">
          <span className="font-bold text-white text-base">Total</span>
          <span className="font-mono font-bold text-xl text-gold-400 font-playfair">
            {order.totalAmount.toFixed(2)} ETB
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <Link
          href={order.tableNumber ? `/table/${order.tableNumber}` : "/menu"}
          className="flex-1 py-3.5 px-6 rounded-2xl bg-gold-500 text-black font-bold text-sm text-center hover:bg-gold-400 transition-all flex items-center justify-center gap-2"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Add More Dishes</span>
        </Link>
      </div>
    </div>
  );
}
