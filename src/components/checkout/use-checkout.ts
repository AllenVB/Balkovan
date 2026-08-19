"use client";

import { useCallback, useSyncExternalStore } from "react";
import {
  getAddressServerSnapshot,
  getAddressSnapshot,
  getLastOrderServerSnapshot,
  getLastOrderSnapshot,
  getShippingServerSnapshot,
  getShippingSnapshot,
  subscribeToCheckout,
  writeAddress,
  writeLastOrder,
  writeShippingOption,
} from "@/lib/checkout-storage";
import type { Address, Order } from "@/lib/checkout";

/** Odeme akisinin durumu: adres, kargo secimi ve tamamlanan son siparis. */
export function useCheckout() {
  const address = useSyncExternalStore(
    subscribeToCheckout,
    getAddressSnapshot,
    getAddressServerSnapshot,
  );

  const shippingOptionId = useSyncExternalStore(
    subscribeToCheckout,
    getShippingSnapshot,
    getShippingServerSnapshot,
  );

  const lastOrder = useSyncExternalStore(
    subscribeToCheckout,
    getLastOrderSnapshot,
    getLastOrderServerSnapshot,
  );

  // Sunucu render'inda ve hydration sirasinda depo okunmamis olur; "adres yok"
  // ile "henuz okunmadi" durumlarini ayirmak icin.
  const isReady = useSyncExternalStore(
    subscribeToCheckout,
    alwaysTrue,
    alwaysFalse,
  );

  const setAddress = useCallback(
    (value: Address | null) => writeAddress(value),
    [],
  );
  const setShippingOptionId = useCallback(
    (value: string | null) => writeShippingOption(value),
    [],
  );
  const setLastOrder = useCallback(
    (value: Order | null) => writeLastOrder(value),
    [],
  );

  return {
    address,
    shippingOptionId,
    lastOrder,
    isReady,
    setAddress,
    setShippingOptionId,
    setLastOrder,
  };
}

const alwaysTrue = () => true;
const alwaysFalse = () => false;
