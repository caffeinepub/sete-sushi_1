import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { CartItem, Offer } from "../lib/types";

// ── Cart Context Types ─────────────────────────────────────────────────────

interface CartContextValue {
  items: CartItem[];
  addToCart: (offer: Offer, qty?: number) => void;
  removeFromCart: (offerId: string) => void;
  updateQty: (offerId: string, qty: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

const CART_STORAGE_KEY = "sete_cart_items";

function loadCartFromStorage(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as CartItem[];
  } catch {
    return [];
  }
}

function saveCartToStorage(items: CartItem[]) {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch {
    // ignore storage errors
  }
}

// ── Cart Provider ──────────────────────────────────────────────────────────

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => loadCartFromStorage());
  const [isOpen, setIsOpen] = useState(false);

  // Persist cart to localStorage whenever items change
  useEffect(() => {
    saveCartToStorage(items);
  }, [items]);

  const addToCart = useCallback((offer: Offer, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.offer.id === offer.id);
      if (existing) {
        return prev.map((i) =>
          i.offer.id === offer.id
            ? { ...i, quantity: Math.min(10, i.quantity + qty) }
            : i,
        );
      }
      return [...prev, { offer, quantity: Math.min(10, qty) }];
    });
  }, []);

  const removeFromCart = useCallback((offerId: string) => {
    setItems((prev) => prev.filter((i) => i.offer.id !== offerId));
  }, []);

  const updateQty = useCallback((offerId: string, qty: number) => {
    if (qty <= 0) {
      setItems((prev) => prev.filter((i) => i.offer.id !== offerId));
    } else {
      setItems((prev) =>
        prev.map((i) =>
          i.offer.id === offerId ? { ...i, quantity: Math.min(10, qty) } : i,
        ),
      );
    }
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const totalItems = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity, 0),
    [items],
  );

  const totalPrice = useMemo(
    () => items.reduce((sum, i) => sum + i.offer.price * i.quantity, 0),
    [items],
  );

  const value = useMemo(
    () => ({
      items,
      addToCart,
      removeFromCart,
      updateQty,
      clearCart,
      totalItems,
      totalPrice,
      isOpen,
      openCart,
      closeCart,
    }),
    [
      items,
      addToCart,
      removeFromCart,
      updateQty,
      clearCart,
      totalItems,
      totalPrice,
      isOpen,
      openCart,
      closeCart,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// ── useCart Hook ───────────────────────────────────────────────────────────

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return ctx;
}
