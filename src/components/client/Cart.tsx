import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";
import { CartItemRecord } from "@/types/app";

type CartProps = {
  items: CartItemRecord[];
  onIncrease: (id: string) => void;
  onDecrease: (id: string) => void;
  onRemove: (id: string) => void;
  onCheckout: () => void;
  isCheckingOut: boolean;
  canCheckout: boolean;
};

export default function Cart({
  items,
  onIncrease,
  onDecrease,
  onRemove,
  onCheckout,
  isCheckingOut,
  canCheckout,
}: CartProps) {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <section className="glass-card rounded-3xl p-8">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Your Cart</h2>
        <span className="text-sm text-zinc-500">{items.length} items</span>
      </div>
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/[0.02] p-4">
            <div className="flex items-center gap-4">
              <div className="relative h-16 w-16 overflow-hidden rounded-2xl">
                <Image src={item.image} alt={item.name} fill sizes="64px" className="object-cover" />
              </div>
              <div>
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-sm text-zinc-500">{item.category}</p>
                <p className={`text-xs font-bold ${item.isAvailable ? "text-green-500" : "text-red-500"}`}>
                  {item.isAvailable ? "Available" : "Out of Stock"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 rounded-full border border-white/10 px-3 py-2">
                <button onClick={() => onDecrease(item.id)} className="hover:text-gold-500">
                  <Minus className="h-4 w-4" />
                </button>
                <span className="min-w-4 text-center text-sm font-bold">{item.quantity}</span>
                <button onClick={() => onIncrease(item.id)} className="hover:text-gold-500">
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <button onClick={() => onRemove(item.id)} className="rounded-full p-2 text-zinc-500 transition-colors hover:bg-red-500/10 hover:text-red-500">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            <span className="font-mono text-gold-500">${(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
      </div>
      <div className="mt-8 border-t border-white/5 pt-6">
        <div className="mb-6 flex items-center justify-between text-lg">
          <span>Total</span>
          <span className="font-bold text-gold-500">${total.toFixed(2)}</span>
        </div>
        <button
          onClick={onCheckout}
          disabled={!canCheckout || isCheckingOut || items.length === 0}
          className="w-full rounded-2xl bg-gold-600 py-4 font-bold text-black transition-colors hover:bg-gold-700 disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-400"
        >
          {isCheckingOut ? "Placing Order..." : canCheckout ? "Checkout" : "Sign In To Checkout"}
        </button>
      </div>
    </section>
  );
}
