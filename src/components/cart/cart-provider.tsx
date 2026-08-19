"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import {
  addLine,
  calculateCartTotals,
  createCartLine,
  removeLine as removeLineFrom,
  setLineQuantity as setLineQuantityIn,
  type CartLine,
  type CartTotals,
} from "@/lib/cart";
import {
  getCartServerSnapshot,
  getCartSnapshot,
  subscribeToCart,
  writeCart,
} from "@/lib/cart-storage";
import type { Product, ProductVariant } from "@/lib/products";

type CartContextValue = {
  lines: CartLine[];
  totals: CartTotals;
  /**
   * Sunucu render'inda ve ilk boyamada sepet bos gorunur; depodan okunana
   * kadar false kalir. Rozette ve sepet sayfasinda "bos sepet" ile "henuz
   * okunmadi" durumlarini ayirmak icin kullanilir.
   */
  isReady: boolean;
  addProduct: (
    product: Product,
    variant: ProductVariant,
    quantity?: number,
  ) => void;
  setQuantity: (lineId: string, quantity: number) => void;
  removeLine: (lineId: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

const subscribeToNothing = () => () => {};
const alwaysTrue = () => true;
const alwaysFalse = () => false;

/**
 * Sepet durumu. Veri lib/cart-storage.ts'teki tarayici deposundan gelir,
 * kurallar (ekleme, adet, toplamlar) lib/cart.ts'teki saf fonksiyonlardadir.
 */
export function CartProvider({ children }: { children: ReactNode }) {
  const lines = useSyncExternalStore(
    subscribeToCart,
    getCartSnapshot,
    getCartServerSnapshot,
  );

  // Hydration bitince true olur; sunucu ciktisinda false.
  const isReady = useSyncExternalStore(
    subscribeToNothing,
    alwaysTrue,
    alwaysFalse,
  );

  const addProduct = useCallback(
    (product: Product, variant: ProductVariant, quantity = 1) => {
      writeCart(
        addLine(getCartSnapshot(), createCartLine(product, variant, quantity)),
      );
    },
    [],
  );

  const setQuantity = useCallback((lineId: string, quantity: number) => {
    writeCart(setLineQuantityIn(getCartSnapshot(), lineId, quantity));
  }, []);

  const removeLine = useCallback((lineId: string) => {
    writeCart(removeLineFrom(getCartSnapshot(), lineId));
  }, []);

  const clear = useCallback(() => writeCart([]), []);

  const value = useMemo<CartContextValue>(
    () => ({
      lines,
      totals: calculateCartTotals(lines),
      isReady,
      addProduct,
      setQuantity,
      removeLine,
      clear,
    }),
    [lines, isReady, addProduct, setQuantity, removeLine, clear],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart yalnızca CartProvider içinde kullanılabilir.");
  }
  return context;
}
