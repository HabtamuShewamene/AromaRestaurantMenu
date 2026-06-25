"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, Trash2, ShoppingBag, X } from "lucide-react";
import { CartItemRecord } from "@/shared/types/app";

type CartProps = {
  items: CartItemRecord[];
  onIncrease: (id: string) => void;
  onDecrease: (id: string) => void;
  onRemove: (id: string) => void;
  onCheckout: () => void;
  isCheckingOut: boolean;
  canCheckout: boolean;
  onClose?: () => void;
};

export default function Cart({
  items,
  onIncrease,
  onDecrease,
  onRemove,
  onCheckout,
  isCheckingOut,
  canCheckout,
  onClose,
}: CartProps) {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 sm:px-6 pt-5 sm:pt-6 pb-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, rgba(182,141,64,0.2), rgba(182,141,64,0.08))",
              border: "1px solid rgba(182,141,64,0.25)",
            }}
          >
            <ShoppingBag className="w-5 h-5 text-gold-400" />
          </div>
          <div>
            <h2
              className="font-bold text-white leading-tight"
              style={{ fontFamily: "var(--font-playfair, serif)" }}
            >
              Your Order
            </h2>
            <p className="text-xs text-zinc-500">{itemCount} items</p>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4 text-zinc-400" />
          </button>
        )}
      </div>

      {/* Items */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 no-scrollbar">
        <AnimatePresence mode="popLayout">
          {items.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-16 text-center"
            >
              <div
                className="w-16 h-16 rounded-3xl flex items-center justify-center mb-4"
                style={{
                  background: "rgba(182,141,64,0.08)",
                  border: "1px solid rgba(182,141,64,0.15)",
                }}
              >
                <ShoppingBag className="w-7 h-7 text-gold-500/50" />
              </div>
              <p className="text-zinc-500 text-sm font-medium">
                Your cart is empty
              </p>
              <p className="text-zinc-700 text-xs mt-1">
                Add some delicious items!
              </p>
            </motion.div>
          ) : (
            items.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20, height: 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-center gap-3 p-3 rounded-2xl"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                {/* Image */}
                <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden flex-shrink-0">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">
                    {item.name}
                  </p>
                  <p className="text-xs text-zinc-600 mb-1.5">{item.category}</p>

                  {/* Qty controls */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onDecrease(item.id)}
                      className="w-6 h-6 flex items-center justify-center rounded-full bg-white/5 hover:bg-gold-500/20 hover:text-gold-400 transition-all text-zinc-400"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-xs font-bold text-white w-4 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => onIncrease(item.id)}
                      className="w-6 h-6 flex items-center justify-center rounded-full bg-white/5 hover:bg-gold-500/20 hover:text-gold-400 transition-all text-zinc-400"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Price + remove */}
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <span className="text-sm font-bold text-gold-400">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                  <button
                    onClick={() => onRemove(item.id)}
                    className="w-6 h-6 flex items-center justify-center rounded-full text-zinc-600 hover:bg-red-500/15 hover:text-red-400 transition-all"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      {items.length > 0 && (
        <div
          className="px-5 pt-4 pb-6"
          style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
        >
          {/* Subtotal row */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-zinc-500">Subtotal</span>
            <span className="text-sm text-zinc-300">${total.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-zinc-500">Service charge</span>
            <span className="text-xs text-zinc-600">Included</span>
          </div>

          <div
            className="flex items-center justify-between py-3 my-3"
            style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
          >
            <span className="font-semibold text-white">Total</span>
            <span className="font-bold text-lg text-gold-400">
              ${total.toFixed(2)}
            </span>
          </div>

          {/* Checkout button */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={onCheckout}
            disabled={!canCheckout || isCheckingOut}
            className="w-full py-4 rounded-2xl text-sm font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={
              canCheckout
                ? {
                    background:
                      "linear-gradient(135deg, #b68d40, #d8c491, #a47636)",
                    color: "#080808",
                    boxShadow: "0 8px 24px rgba(182,141,64,0.35)",
                  }
                : {
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    color: "#555",
                  }
            }
          >
            {isCheckingOut
              ? "Placing Order…"
              : canCheckout
              ? "Place Order →"
              : "Sign In to Checkout"}
          </motion.button>
        </div>
      )}
    </div>
  );
}
