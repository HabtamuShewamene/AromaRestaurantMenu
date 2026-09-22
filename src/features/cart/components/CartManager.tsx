"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Cart from "@/features/cart/components/Cart";
import { useCart } from "@/components/providers/CartProvider";
import { Utensils, AlertCircle } from "lucide-react";

export default function CartManager() {
  const router = useRouter();
  const { data: session } = useSession();
  const {
    cartItems: items,
    updateQuantity,
    removeFromCart,
    clearCart,
    tableContext,
  } = useCart();
  const [message, setMessage] = useState("");
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [guestName, setGuestName] = useState("");
  const [guestPhone, setGuestPhone] = useState("");

  const increase = (id: string) => {
    const item = items.find((i) => i.id === id);
    if (item) updateQuantity(id, item.quantity + 1);
  };

  const decrease = (id: string) => {
    const item = items.find((i) => i.id === id);
    if (item) updateQuantity(id, item.quantity - 1);
  };

  const remove = (id: string) => {
    removeFromCart(id);
  };

  // Checkout is allowed if user is authenticated OR if user is a table guest!
  const hasItems = items.length > 0 && items.every((item) => item.isAvailable);
  const canCheckout = hasItems && (Boolean(session?.user) || Boolean(tableContext));

  const checkout = async () => {
    if (!canCheckout) {
      if (!session?.user && !tableContext) {
        router.push("/login");
        return;
      }
      setMessage("Please remove any unavailable items before proceeding.");
      return;
    }

    setIsCheckingOut(true);
    setMessage("");

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tableId: tableContext?.tableId || null,
          tableNumber: tableContext?.tableNumber || null,
          tableSessionId: tableContext?.tableSessionId || null,
          customerName: guestName.trim() || session?.user?.name || (tableContext ? `Table ${tableContext.tableNumber} Guest` : "Guest Customer"),
          customerPhone: guestPhone.trim() || null,
          orderType: tableContext ? "DINE_IN" : "TAKEAWAY",
          items: items.map((item) => ({
            itemId: item.itemId,
            quantity: item.quantity,
            notes: item.notes || null,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to submit your order.");
      }

      clearCart();
      // Redirect directly to the live Order Confirmation & Status Tracker
      router.push(`/order/${data.id}`);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Unable to place order right now.");
      setIsCheckingOut(false);
    }
  };

  return (
    <section className="space-y-6">
      {/* Table Banner Notice if present */}
      {tableContext && (
        <div className="flex items-center justify-between p-4 rounded-2xl bg-primary/10 border border-primary/20 text-brand-300">
          <div className="flex items-center gap-2.5">
            <Utensils className="w-4 h-4 text-primary flex-shrink-0" />
            <span className="text-sm font-semibold">
              Ordering for Table {tableContext.tableNumber}{" "}
              {tableContext.tableLabel ? `(${tableContext.tableLabel})` : ""}
            </span>
          </div>
          <span className="text-xs bg-primary/20 px-2.5 py-1 rounded-full font-bold uppercase tracking-wider text-primary">
            Dine-in
          </span>
        </div>
      )}

      {message && (
        <div className="flex items-center gap-2 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {items.length === 0 ? (
        <div className="glass-card rounded-3xl p-12 text-center text-muted-foreground space-y-3">
          <p className="text-base font-semibold text-foreground">Your cart is empty</p>
          <p className="text-sm text-muted-foreground">Add items from the menu to create your order.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Guest Table Contact Information (Optional) */}
          {tableContext && !session?.user && (
            <div className="p-5 rounded-3xl bg-[#121212] border border-border space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Guest Details (Optional)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Your Name (Optional)"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="bg-card border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder-zinc-600 outline-none focus:border-primary"
                />
                <input
                  type="tel"
                  placeholder="Phone Number (Optional)"
                  value={guestPhone}
                  onChange={(e) => setGuestPhone(e.target.value)}
                  className="bg-card border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder-zinc-600 outline-none focus:border-primary"
                />
              </div>
            </div>
          )}

          <div className="glass-card rounded-3xl overflow-hidden border border-border">
            <Cart
              items={items}
              onIncrease={increase}
              onDecrease={decrease}
              onRemove={remove}
              onCheckout={checkout}
              isCheckingOut={isCheckingOut}
              canCheckout={canCheckout}
              tableNumber={tableContext?.tableNumber}
            />
          </div>
        </div>
      )}
    </section>
  );
}
