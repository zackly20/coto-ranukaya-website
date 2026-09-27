"use client";

import { createContext, useContext, useMemo, useReducer, type ReactNode } from "react";

export type CartItem = {
  menuId: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  notes: string;
};

type CartState = { items: CartItem[] };

type Action =
  | { type: "add"; item: Omit<CartItem, "quantity"> & { quantity?: number } }
  | { type: "remove"; menuId: number }
  | { type: "setQty"; menuId: number; quantity: number }
  | { type: "setNotes"; menuId: number; notes: string }
  | { type: "clear" };

function reducer(state: CartState, action: Action): CartState {
  switch (action.type) {
    case "add": {
      const qty = Math.max(1, action.item.quantity ?? 1);
      const existing = state.items.find((i) => i.menuId === action.item.menuId);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.menuId === action.item.menuId
              ? { ...i, quantity: Math.min(99, i.quantity + qty), notes: action.item.notes || i.notes }
              : i
          ),
        };
      }
      return { items: [...state.items, { ...action.item, quantity: qty }] };
    }
    case "remove":
      return { items: state.items.filter((i) => i.menuId !== action.menuId) };
    case "setQty":
      return {
        items: state.items.map((i) =>
          i.menuId === action.menuId
            ? { ...i, quantity: Math.max(1, Math.min(99, action.quantity)) }
            : i
        ),
      };
    case "setNotes":
      return {
        items: state.items.map((i) => (i.menuId === action.menuId ? { ...i, notes: action.notes } : i)),
      };
    case "clear":
      return { items: [] };
    default:
      return state;
  }
}

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotal: number;
  add: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  remove: (menuId: number) => void;
  setQty: (menuId: number, quantity: number) => void;
  setNotes: (menuId: number, notes: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function loadInitial(): CartState {
  if (typeof window === "undefined") return { items: [] };
  try {
    const raw = localStorage.getItem("cm_cart");
    if (raw) return JSON.parse(raw) as CartState;
  } catch {
    // ignore
  }
  return { items: [] };
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadInitial);

  const value = useMemo<CartContextValue>(() => {
    const subtotal = state.items.reduce((s, i) => s + i.price * i.quantity, 0);
    const count = state.items.reduce((s, i) => s + i.quantity, 0);
    return {
      items: state.items,
      count,
      subtotal,
      add: (item) => dispatch({ type: "add", item }),
      remove: (menuId) => dispatch({ type: "remove", menuId }),
      setQty: (menuId, quantity) => dispatch({ type: "setQty", menuId, quantity }),
      setNotes: (menuId, notes) => dispatch({ type: "setNotes", menuId, notes }),
      clear: () => dispatch({ type: "clear" }),
    };
  }, [state]);

  // Persist to localStorage
  useMemo(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("cm_cart", JSON.stringify(state));
    }
  }, [state]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
