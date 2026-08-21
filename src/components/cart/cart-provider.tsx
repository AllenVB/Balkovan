"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
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
  getCouponServerSnapshot,
  getCouponSnapshot,
  getUsePointsServerSnapshot,
  getUsePointsSnapshot,
  subscribeToCart,
  writeCart,
  writeCoupon,
  writeUsePoints,
} from "@/lib/cart-storage";
import { demoAccount } from "@/lib/account";
import { refreshCartAction } from "@/server/actions";
import { findCoupon } from "@/lib/promotions";
import {
  getShippingServerSnapshot,
  getShippingSnapshot,
  subscribeToCheckout,
} from "@/lib/checkout-storage";
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
  /** Uygulanmis kupon kodu; yoksa null. */
  couponCode: string | null;
  /** Kod gecerliyse uygular ve true doner; gecersizse hicbir sey yapmaz. */
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  /**
   * Sepet acildiginda veritabaniyla karsilastirilir; degisen satirlar burada
   * listelenir ki musteriye "fiyat guncellendi" denebilsin.
   */
  priceChanges: CartChange[];
  dismissPriceChanges: () => void;
  /** Musterinin elindeki bal puani. */
  availablePoints: number;
  useLoyaltyPoints: boolean;
  setUseLoyaltyPoints: (value: boolean) => void;
};

export type CartChange =
  | { kind: "fiyat"; name: string; oldPriceInKurus: number; newPriceInKurus: number }
  | { kind: "kaldirildi"; name: string; sebep: "satista-degil" | "stok-bitti" }
  | { kind: "adet"; name: string; newQuantity: number };

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

  const clear = useCallback(() => {
    writeCart([]);
    writeCoupon(null);
    writeUsePoints(false);
  }, []);

  const couponCode = useSyncExternalStore(
    subscribeToCart,
    getCouponSnapshot,
    getCouponServerSnapshot,
  );

  const applyCoupon = useCallback((code: string) => {
    const coupon = findCoupon(code);
    if (!coupon) return false;
    writeCoupon(coupon.code);
    return true;
  }, []);

  const removeCoupon = useCallback(() => writeCoupon(null), []);

  const useLoyaltyPoints = useSyncExternalStore(
    subscribeToCart,
    getUsePointsSnapshot,
    getUsePointsServerSnapshot,
  );

  const setUseLoyaltyPoints = useCallback(
    (value: boolean) => writeUsePoints(value),
    [],
  );

  // Puan bakiyesi su an ornek hesaptan geliyor; oturum acan gercek kullanici
  // backend fazinda buraya baglanacak.
  const availablePoints = demoAccount.loyaltyPoints;

  // Kargo secimi odeme adiminda yapiliyor ama toplamlar tek yerden geliyor;
  // secim degisince sepet ve ozet birlikte guncellensin.
  const shippingOptionId = useSyncExternalStore(
    subscribeToCheckout,
    getShippingSnapshot,
    getShippingServerSnapshot,
  );

  const [priceChanges, setPriceChanges] = useState<CartChange[]>([]);
  const dismissPriceChanges = useCallback(() => setPriceChanges([]), []);

  // Sepet ilk okunduğunda bir kez tazelenir: fiyat degistiyse ya da urun
  // satistan kalktiysa sepet duzeltilir ve degisiklik musteriye bildirilir.
  const refreshedRef = useRef(false);
  useEffect(() => {
    if (!isReady || refreshedRef.current || lines.length === 0) return;
    refreshedRef.current = true;

    let cancelled = false;
    void (async () => {
      try {
        const fresh = await refreshCartAction(
          lines.map((line) => ({
            productSlug: line.productSlug,
            variantWeightGrams: line.variantWeightGrams,
          })),
        );
        if (cancelled) return;

        const changes: CartChange[] = [];
        const updated = lines.flatMap((line) => {
          const match = fresh.find(
            (item) =>
              item.productSlug === line.productSlug &&
              item.variantWeightGrams === line.variantWeightGrams,
          );

          // Urun satistan kalkmis: satiri sepetten cikar.
          if (!match || !match.current) {
            changes.push({
              kind: "kaldirildi",
              name: line.name,
              sebep: "satista-degil",
            });
            return [];
          }

          const current = match.current;

          // Stok tukenmisse satir sepette kalmamali; kalirsa siparis her
          // denemede "stok yok" ile reddedilir ve musteri cikmaza girer.
          if (current.stock <= 0) {
            changes.push({
              kind: "kaldirildi",
              name: current.name,
              sebep: "stok-bitti",
            });
            return [];
          }

          if (current.unitPriceInKurus !== line.unitPriceInKurus) {
            changes.push({
              kind: "fiyat",
              name: current.name,
              oldPriceInKurus: line.unitPriceInKurus,
              newPriceInKurus: current.unitPriceInKurus,
            });
          }

          // Stok adetten azsa adet stoga cekilir.
          const quantity = Math.min(line.quantity, current.stock);
          if (quantity !== line.quantity) {
            changes.push({ kind: "adet", name: current.name, newQuantity: quantity });
          }

          return [
            {
              ...line,
              name: current.name,
              variantLabel: current.variantLabel,
              image: current.image,
              tag: current.badge,
              threeForTwo: current.threeForTwo,
              unitPriceInKurus: current.unitPriceInKurus,
              quantity,
            },
          ];
        });

        if (changes.length > 0) {
          setPriceChanges(changes);
          writeCart(updated);
        }
      } catch {
        // Tazeleme basarisiz olursa sepet oldugu gibi kalir; siparis
        // adiminda sunucu dogrulamasi yine de yanlis fiyati engeller.
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isReady, lines]);

  const value = useMemo<CartContextValue>(
    () => ({
      lines,
      totals: calculateCartTotals(lines, {
        couponCode,
        loyaltyPoints: availablePoints,
        useLoyaltyPoints,
        shippingOptionId,
      }),
      isReady,
      addProduct,
      setQuantity,
      removeLine,
      clear,
      couponCode,
      applyCoupon,
      removeCoupon,
      priceChanges,
      dismissPriceChanges,
      availablePoints,
      useLoyaltyPoints,
      setUseLoyaltyPoints,
    }),
    [
      lines,
      couponCode,
      shippingOptionId,
      priceChanges,
      dismissPriceChanges,
      availablePoints,
      useLoyaltyPoints,
      setUseLoyaltyPoints,
      isReady,
      addProduct,
      setQuantity,
      removeLine,
      clear,
      applyCoupon,
      removeCoupon,
    ],
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
