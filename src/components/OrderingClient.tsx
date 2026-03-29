"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import Cart, { type CartLineItem } from "@/src/components/Cart";
import ConfirmOrderModal from "@/src/components/ConfirmOrder";
import ProductItemCard, { type ProductItem } from "@/src/components/ProductItemCard";
import { placeOrder, type PlacedOrder } from "@/src/lib/orders-api";

function CartFabIcon() {
  return (
    <svg width={26} height={26} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
        stroke="currentColor"
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function OrderingClient({ products }: { products: ProductItem[] }) {
  const [lines, setLines] = useState<CartLineItem[]>([]);
  const [placedOrder, setPlacedOrder] = useState<PlacedOrder | null>(null);
  const [couponCode, setCouponCode] = useState("");
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [mobileCartOpen, setMobileCartOpen] = useState(false);

  const qtyByProductId = useMemo(() => {
    const m = new Map<string, number>();
    for (const line of lines) {
      m.set(line.productId, line.quantity);
    }
    return m;
  }, [lines]);

  const totalQty = useMemo(
    () => lines.reduce((s, l) => s + l.quantity, 0),
    [lines],
  );

  useEffect(() => {
    if (!mobileCartOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileCartOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [mobileCartOpen]);

  const addToCart = useCallback((product: ProductItem) => {
    setLines((prev) => {
      const i = prev.findIndex((l) => l.productId === product.id);
      if (i >= 0) {
        const next = [...prev];
        next[i] = { ...next[i], quantity: next[i].quantity + 1 };
        return next;
      }
      return [
        ...prev,
        {
          productId: product.id,
          name: product.name,
          unitPrice: product.price,
          quantity: 1,
        },
      ];
    });
  }, []);

  const decrementCart = useCallback((product: ProductItem) => {
    setLines((prev) => {
      const i = prev.findIndex((l) => l.productId === product.id);
      if (i < 0) return prev;
      const line = prev[i];
      if (line.quantity <= 1) {
        return prev.filter((l) => l.productId !== product.id);
      }
      const next = [...prev];
      next[i] = { ...line, quantity: line.quantity - 1 };
      return next;
    });
  }, []);

  const removeLine = useCallback((productId: string) => {
    setLines((prev) => prev.filter((l) => l.productId !== productId));
  }, []);

  const confirmOrder = useCallback(async () => {
    if (lines.length === 0) return;
    setCheckoutError(null);
    setCheckoutLoading(true);
    const items = lines.map((l) => ({
      product_id: l.productId,
      quantity: l.quantity,
    }));
    const result = await placeOrder(items, couponCode.trim());
    setCheckoutLoading(false);
    if (!result.ok) {
      setCheckoutError(result.message);
      return;
    }
    setLines([]);
    setCouponCode("");
    setPlacedOrder(result.order);
    setMobileCartOpen(false);
  }, [lines, couponCode]);

  const closeConfirmedModal = useCallback(() => {
    setPlacedOrder(null);
  }, []);

  return (
    <>
      <ConfirmOrderModal
        open={placedOrder !== null}
        order={placedOrder}
        onStartNewOrder={closeConfirmedModal}
      />
      <main
        id="main-content"
        className="min-h-dvh bg-[#f3f1ef] px-4 pb-[max(5.5rem,env(safe-area-inset-bottom))] pt-[max(1.5rem,env(safe-area-inset-top))] sm:px-6 sm:pt-10 lg:pb-[max(2.5rem,env(safe-area-inset-bottom))]"
      >
        <h1 className="text-xl font-semibold tracking-tight text-[#4D4D4D] sm:text-2xl">
          Ordering food app
        </h1>
        <div className="mt-6 flex flex-col gap-8 sm:mt-8 sm:gap-10 lg:flex-row lg:items-start">
          <div className="min-w-0 flex-1">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 xl:grid-cols-3 2xl:grid-cols-4">
              {products.map((product) => (
                <ProductItemCard
                  key={product.id}
                  product={product}
                  quantity={qtyByProductId.get(product.id) ?? 0}
                  onAddToCart={() => addToCart(product)}
                  onIncrement={() => addToCart(product)}
                  onDecrement={() => decrementCart(product)}
                />
              ))}
            </div>
          </div>
          <div className="hidden w-full lg:sticky lg:block lg:top-8 lg:w-[min(100%,380px)]">
            <Cart
              lines={lines}
              onRemove={removeLine}
              onConfirmOrder={confirmOrder}
              couponCode={couponCode}
              onCouponChange={(v) => {
                setCouponCode(v);
                setCheckoutError(null);
              }}
              checkoutError={checkoutError}
              checkoutLoading={checkoutLoading}
            />
          </div>
        </div>

        <button
          type="button"
          onClick={() => setMobileCartOpen(true)}
          className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-30 flex h-14 w-14 touch-manipulation items-center justify-center rounded-full bg-[#A6634B] text-white shadow-lg transition active:scale-95 active:bg-[#95553f] lg:hidden"
          aria-label={totalQty > 0 ? `Open cart, ${totalQty} items` : "Open cart"}
        >
          <CartFabIcon />
          {totalQty > 0 ? (
            <span className="absolute -right-0.5 -top-0.5 flex h-6 min-w-6 items-center justify-center rounded-full bg-[#C73E1D] px-1.5 text-xs font-bold tabular-nums">
              {totalQty > 99 ? "99+" : totalQty}
            </span>
          ) : null}
        </button>

        {mobileCartOpen ? (
          <div className="fixed inset-0 z-[60] lg:hidden">
            <button
              type="button"
              className="absolute inset-0 z-0 bg-black/50 backdrop-blur-[1px]"
              aria-label="Close cart"
              onClick={() => setMobileCartOpen(false)}
            />
            <div className="absolute inset-x-0 bottom-0 z-10 flex max-h-[90dvh] flex-col overflow-hidden rounded-t-2xl bg-white shadow-[0_-8px_32px_rgba(0,0,0,0.15)]">
              <div className="flex shrink-0 justify-center pb-2 pt-3" aria-hidden>
                <div className="h-1 w-10 rounded-full bg-gray-200" />
              </div>
              <div className="flex min-h-0 flex-1 flex-col overflow-hidden px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
                <Cart
                  variant="sheet"
                  lines={lines}
                  onRemove={removeLine}
                  onConfirmOrder={confirmOrder}
                  couponCode={couponCode}
                  onCouponChange={(v) => {
                    setCouponCode(v);
                    setCheckoutError(null);
                  }}
                  checkoutError={checkoutError}
                  checkoutLoading={checkoutLoading}
                  onClose={() => setMobileCartOpen(false)}
                />
              </div>
            </div>
          </div>
        ) : null}
      </main>
    </>
  );
}
