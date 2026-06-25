"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { CartItemRecord, MenuItemRecord } from "@/shared/types/app";

const CART_STORAGE_KEY = "cafe-menu-cart";

interface CartContextType {
  cartItems: CartItemRecord[];
  addToCart: (item: MenuItemRecord, quantity: number) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItemRecord[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        setCartItems(JSON.parse(saved));
      }
    } catch (error) {
      console.error("Failed to load cart from storage:", error);
    }
    setIsInitialized(true);
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
      // Dispatch custom event for external listeners if any (compatibility)
      window.dispatchEvent(new Event("cart-updated"));
    }
  }, [cartItems, isInitialized]);

  const addToCart = (item: MenuItemRecord, quantity: number) => {
    if (!item.isAvailable) return;

    setCartItems((prev) => {
      const existing = prev.find((i) => i.itemId === item.id);
      if (existing) {
        return prev.map((i) =>
          i.itemId === item.id ? { ...i, quantity: i.quantity + quantity } : i
        );
      }

      const categoryName = typeof item.category === "string" ? item.category : item.category.name;

      return [
        ...prev,
        {
          id: crypto.randomUUID(),
          itemId: item.id,
          name: item.name,
          price: item.price,
          quantity,
          image: item.image,
          category: categoryName,
          isAvailable: item.isAvailable,
        },
      ];
    });
  };

  const removeFromCart = (id: string) => {
    setCartItems((prev) => prev.filter((i) => i.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCartItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity } : i))
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
