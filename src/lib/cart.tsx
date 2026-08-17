import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { Dish } from "./menu-data";

export type CartLine = { dish: Dish; qty: number };

type Ctx = {
  lines: CartLine[];
  add: (dish: Dish) => void;
  remove: (id: string) => void;
  clear: () => void;
  count: number;
  subtotal: number;
  service: number;
  total: number;
};

const CartContext = createContext<Ctx | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);

  const value = useMemo<Ctx>(() => {
    const subtotal = lines.reduce((s, l) => s + l.dish.price * l.qty, 0);
    const service = Math.round(subtotal * 0.1 * 100) / 100;
    return {
      lines,
      add: (dish) =>
        setLines((prev) => {
          const hit = prev.find((l) => l.dish.id === dish.id);
          if (hit) return prev.map((l) => (l.dish.id === dish.id ? { ...l, qty: l.qty + 1 } : l));
          return [...prev, { dish, qty: 1 }];
        }),
      remove: (id) =>
        setLines((prev) =>
          prev.flatMap((l) =>
            l.dish.id === id ? (l.qty > 1 ? [{ ...l, qty: l.qty - 1 }] : []) : [l],
          ),
        ),
      clear: () => setLines([]),
      count: lines.reduce((s, l) => s + l.qty, 0),
      subtotal,
      service,
      total: Math.round((subtotal + service) * 100) / 100,
    };
  }, [lines]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
