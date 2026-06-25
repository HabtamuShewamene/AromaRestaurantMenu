"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Cart from "@/features/cart/components/Cart";
import { useCart } from "@/components/providers/CartProvider";

export default function CartManager() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { cartItems: items, updateQuantity, removeFromCart, clearCart } = useCart();
  const [message, setMessage] = useState("");
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const increase = (id: string) => {
    const item = items.find(i => i.id === id);
    if (item) updateQuantity(id, item.quantity + 1);
  };

  const decrease = (id: string) => {
    const item = items.find(i => i.id === id);
    if (item) updateQuantity(id, item.quantity - 1);
  };

  const remove = (id: string) => {
    removeFromCart(id);
  };

  const canCheckout = Boolean(session?.user) && items.every((item) => item.isAvailable);

  const checkout = async () => {
    if (!session?.user) {
      router.push("/login");
      return;
    }

    if (!canCheckout) {
      setMessage("Remove unavailable items before placing the order.");
      return;
    }

    setIsCheckingOut(true);
    setMessage("");

    const response = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: items.map((item) => ({
          itemId: item.itemId,
          quantity: item.quantity,
        })),
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      setMessage(data.message ?? "Unable to place order.");
      setIsCheckingOut(false);
      return;
    }

    clearCart();
    setMessage("Order placed successfully. You can track it from your order history.");
    setIsCheckingOut(false);
    router.push("/orders");
  };

  return (
    <section className="space-y-6">
      {status === "loading" ? <p className="text-zinc-500">Checking your session...</p> : null}
      {message ? <div className="rounded-2xl border border-gold-500/20 bg-gold-500/10 p-4 text-sm text-gold-400">{message}</div> : null}
      {items.length === 0 ? (
        <div className="glass-card rounded-3xl p-10 text-center text-zinc-400">
          Your cart is empty. Add items from the menu to place an order.
        </div>
      ) : (
        <Cart
          items={items}
          onIncrease={increase}
          onDecrease={decrease}
          onRemove={remove}
          onCheckout={checkout}
          isCheckingOut={isCheckingOut}
          canCheckout={canCheckout}
        />
      )}
    </section>
  );
}
