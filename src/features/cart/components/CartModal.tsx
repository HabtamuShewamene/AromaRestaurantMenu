"use client";

import { useCart } from "@/components/providers/CartProvider";
import CartManager from "./CartManager";
import { X } from "lucide-react";
import { useEffect } from "react";

export default function CartModal() {
  const { isCartOpen, setIsCartOpen } = useCart();

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isCartOpen]);

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 pt-16 pb-8 overflow-y-auto">
      {/* Modal Container */}
      <div 
        className="relative w-full max-w-3xl bg-background rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-5 border-b border-border bg-background/95 backdrop-blur">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-primary font-bold mb-1">Order Summary</p>
            <h2 className="text-2xl font-bold font-playfair text-foreground">Your Dining Cart</h2>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-2 rounded-full bg-foreground/5 hover:bg-foreground/10 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content (CartManager handles its own internal layout) */}
        <div className="p-6 overflow-y-auto">
          <CartManager />
        </div>
      </div>
      
      {/* Click outside listener area */}
      <div 
        className="absolute inset-0 -z-10" 
        onClick={() => setIsCartOpen(false)}
        aria-hidden="true"
      />
    </div>
  );
}
