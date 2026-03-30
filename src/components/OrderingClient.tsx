"use client";

import { useState, useCallback, useEffect, useMemo, useRef, startTransition } from "react";
import Cart, { type CartLineItem, type CartPromoState } from "@/src/components/Cart";
import ConfirmOrderModal from "@/src/components/ConfirmOrder";
import ProductItemCard, { type ProductItem } from "@/src/components/ProductItemCard";
import { checkPromoCode } from "@/src/lib/checkpromo-api";
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
  const [promoState, setPromoState] = useState<CartPromoState>({ kind: "idle" });
  const promoSeq = useRef(0);

  const executePromoCheck = useCallback(async (code: string) => {
    const t = code.trim();
    if (!t) {
      setPromoState({ kind: "idle" });
      return;
    }
    const seq = ++promoSeq.current;
    setPromoState({ kind: "loading" });
    const res = await checkPromoCode(t);
    if (seq !== promoSeq.current) return;
    if (!res.ok) {
      setPromoState({ kind: "error" });
      return;
    }
    if (res.body.valid) {
      setPromoState({ kind: "valid", discountPercent: res.body.discountPercent });
    } else {
      setPromoState({ kind: "invalid" });
    }
  }, []);

  const runCheckPromoClick = useCallback(() => {
    void executePromoCheck(couponCode);
  }, [couponCode, executePromoCheck]);

  useEffect(() => {
    if (lines.length === 0) {
      startTransition(() => {
        setPromoState({ kind: "idle" });
      });
    }
  }, [lines.length]);

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
    promoSeq.current += 1;
    setPromoState({ kind: "idle" });
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
        className="min-h-dvh bg-[#F7F5F2] px-4 pb-[max(5.5rem,env(safe-area-inset-bottom))] pt-[max(1.5rem,env(safe-area-inset-top))] sm:px-8 sm:pt-12 lg:pb-[max(2.5rem,env(safe-area-inset-bottom))] lg:px-10"
      >
        <header className="max-w-4xl">
          <h1 className="font-display text-[2.25rem] font-semibold leading-[1.08] tracking-tight text-[#2D2826] sm:text-5xl sm:leading-[1.05]">
            Menu
          </h1>
          <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-[#6B6560] sm:text-base">
            Curated dishes, prepared to order. Add to your cart and check out when you&apos;re ready.
          </p>
        </header>
        <div className="mt-10 flex flex-col gap-10 sm:mt-12 sm:gap-12 lg:flex-row lg:items-start">
          <div className="min-w-0 flex-1">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-10 xl:grid-cols-3 2xl:grid-cols-4">
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
          <div className="hidden w-full lg:sticky lg:block lg:top-10 lg:w-[min(100%,400px)]">
            <Cart
              lines={lines}
              onRemove={removeLine}
              onConfirmOrder={confirmOrder}
              couponCode={couponCode}
              onCouponChange={(v) => {
                promoSeq.current += 1;
                setCouponCode(v);
                setCheckoutError(null);
                setPromoState({ kind: "idle" });
              }}
              onCheckPromo={runCheckPromoClick}
              promoState={promoState}
              checkoutError={checkoutError}
              checkoutLoading={checkoutLoading}
            />
          </div>
        </div>

        <button
          type="button"
          onClick={() => setMobileCartOpen(true)}
          className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-30 flex h-14 w-14 touch-manipulation items-center justify-center rounded-full bg-[#C73B0F] text-white shadow-[0_8px_28px_rgba(199,59,15,0.4)] transition hover:bg-[#b5340d] active:scale-95 active:bg-[#9e2e0b] lg:hidden"
          aria-label={totalQty > 0 ? `Open cart, ${totalQty} items` : "Open cart"}
        >
          <CartFabIcon />
          {totalQty > 0 ? (
            <span className="absolute -right-0.5 -top-0.5 flex h-6 min-w-6 items-center justify-center rounded-full bg-[#2D2826] px-1.5 text-xs font-bold tabular-nums shadow-sm">
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
            <div className="absolute inset-x-0 bottom-0 z-10 flex max-h-[90dvh] flex-col overflow-hidden rounded-t-[1.25rem] bg-white shadow-[0_-12px_48px_rgba(45,40,38,0.14)] ring-1 ring-[#2D2826]/[0.05]">
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
                    promoSeq.current += 1;
                    setCouponCode(v);
                    setCheckoutError(null);
                    setPromoState({ kind: "idle" });
                  }}
                  onCheckPromo={runCheckPromoClick}
                  promoState={promoState}
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
