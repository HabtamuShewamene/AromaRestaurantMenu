"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { CartItemRecord, MenuItemRecord } from "@/shared/types/app";

const CART_STORAGE_KEY = "aroma-restaurant-cart";
const TABLE_STORAGE_KEY = "aroma-restaurant-table";

export type TableContextType = {
  tableId: string;
  tableNumber: number;
  tableLabel?: string | null;
  tableSessionId: string;
};

interface CartContextType {
  cartItems: CartItemRecord[];
  addToCart: (
    item: MenuItemRecord,
    quantity: number,
    notes?: string
  ) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
  tableContext: TableContextType | null;
  setTableContext: (context: TableContextType | null) => void;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItemRecord[]>([]);
  const [tableContext, setTableContextState] = useState<TableContextType | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load cart and table context from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }
      const savedTable = localStorage.getItem(TABLE_STORAGE_KEY);
      if (savedTable) {
        setTableContextState(JSON.parse(savedTable));
      }
    } catch (error) {
      console.error("Failed to load cart/table state:", error);
    }
    setIsInitialized(true);
  }, []);

  // Persist cart
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
      window.dispatchEvent(new Event("cart-updated"));
    }
  }, [cartItems, isInitialized]);

  // Persist table context
  const setTableContext = (context: TableContextType | null) => {
    setTableContextState(context);
    if (context) {
      localStorage.setItem(TABLE_STORAGE_KEY, JSON.stringify(context));
    } else {
      localStorage.removeItem(TABLE_STORAGE_KEY);
    }
  };

  const addToCart = (
    item: MenuItemRecord,
    quantity: number,
    notes: string = ""
  ) => {
    if (!item.isAvailable) return;

    setCartItems((prev) => {
      // Check if an item with identical item ID and notes exists
      const existingIndex = prev.findIndex((i) => {
        return i.itemId === item.id && (i.notes || "") === (notes || "");
      });

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }

      const categoryName =
        typeof item.category === "string" ? item.category : item.category.name;

      return [
        ...prev,
        {
          id: (Date.now().toString(36) + Math.random().toString(36).slice(2)),
          itemId: item.id,
          name: item.name,
          price: item.price,
          quantity,
          image: item.image,
          category: categoryName,
          isAvailable: item.isAvailable,
          notes: notes || undefined,
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

  const cartTotal = cartItems.reduce((acc, item) => {
    return acc + item.price * item.quantity;
  }, 0);

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
        tableContext,
        setTableContext,
        isCartOpen,
        setIsCartOpen,
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
