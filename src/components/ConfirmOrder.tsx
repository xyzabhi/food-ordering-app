"use client";

import Image from "next/image";
import { useEffect, useId } from "react";
import { createPortal } from "react-dom";
import type { PlacedOrder } from "@/src/lib/orders-api";
import { formatUsd } from "@/src/lib/format";

function CheckIcon() {
  return (
    <div
      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#1fb185]"
      aria-hidden
    >
      <svg width={28} height={28} viewBox="0 0 24 24" fill="none">
        <path
          d="M6 12.5l4 4 8-9"
          stroke="white"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

function qtyForProduct(order: PlacedOrder, productId: string): number {
  const line = order.items.find((i) => i.product_id === productId);
  return line?.quantity ?? 0;
}

export type ConfirmOrderModalProps = {
  open: boolean;
  order: PlacedOrder | null;
  onStartNewOrder: () => void;
};

export default function ConfirmOrderModal({
  open,
  order,
  onStartNewOrder,
}: ConfirmOrderModalProps) {
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onStartNewOrder();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onStartNewOrder]);

  if (!open || !order) return null;
  if (typeof window === "undefined") return null;

  const created = new Date(order.createdAt);
  const createdLabel = Number.isNaN(created.getTime())
    ? order.createdAt
    : created.toLocaleString();

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center p-0 sm:items-center sm:p-4"
      role="presentation"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/55 backdrop-blur-[2px] transition-opacity"
        aria-label="Close dialog"
        onClick={onStartNewOrder}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-10 flex max-h-[min(92dvh,100dvh)] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl bg-white shadow-[0_24px_80px_rgba(45,40,38,0.18)] sm:max-h-[min(90dvh,800px)] sm:rounded-2xl sm:ring-1 sm:ring-[#2D2826]/[0.06]"
      >
        <div className="flex min-h-0 flex-1 flex-col px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-8 sm:px-8 sm:pb-6 sm:pt-10">
          <div className="flex shrink-0 flex-col gap-4 sm:flex-row sm:items-start sm:gap-5">
            <CheckIcon />
            <div className="min-w-0 flex-1">
              <h2
                id={titleId}
                className="font-display text-2xl font-semibold tracking-tight text-[#2D2826] sm:text-[1.75rem]"
              >
                Order Confirmed
              </h2>
              <p className="mt-1.5 text-sm text-[#8A827A] sm:text-[15px]">
                We hope you enjoy your food!
              </p>
              <p className="mt-2 font-mono text-xs text-[#8A827A]">Order #{order.id}</p>
              {order.couponCode ? (
                <p className="mt-1 text-xs font-medium text-[#C73B0F]">
                  Coupon: <span className="font-semibold">{order.couponCode}</span>
                </p>
              ) : null}
              <p className="mt-1 text-xs text-[#8A827A]">{createdLabel}</p>
            </div>
          </div>

          <div className="mt-6 flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl bg-[#FAF7F3] p-4 sm:mt-8 sm:p-5">
            <ul
              className="min-h-0 max-h-[min(52dvh,22rem)] flex-1 overflow-y-auto overscroll-y-contain [-webkit-overflow-scrolling:touch] touch-pan-y divide-y divide-[#2D2826]/[0.08] sm:max-h-[min(48dvh,28rem)]"
              aria-label="Order items"
            >
              {order.products.map((p) => {
                const qty = qtyForProduct(order, p.id);
                const subtotal = qty * p.price;
                return (
                  <li key={p.id} className="flex gap-3 py-4 first:pt-0">
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-[#eee] sm:h-16 sm:w-16">
                      <Image
                        src={p.image}
                        alt={p.name}
                        fill
                        className="object-cover"
                        sizes="64px"
                        unoptimized
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold leading-snug text-[#3D3530]">{p.name}</p>
                      <p className="mt-1 text-sm">
                        <span className="font-semibold tabular-nums text-[#C73B0F]">{qty}x</span>
                        <span className="text-[#8A827A]"> @ {formatUsd(p.price)}</span>
                      </p>
                    </div>
                    <p className="shrink-0 self-start text-sm font-semibold tabular-nums text-[#3D3530] sm:text-base">
                      {formatUsd(subtotal)}
                    </p>
                  </li>
                );
              })}
            </ul>

            <div className="mt-4 shrink-0 space-y-2 border-t border-[#2D2826]/[0.08] pt-4 text-sm">
              <div className="flex justify-between text-[#6B6560]">
                <span>Subtotal</span>
                <span className="font-medium tabular-nums">{formatUsd(order.totalPrice)}</span>
              </div>
              {order.discount > 0 ? (
                <div className="flex justify-between text-[#2E7D32]">
                  <span>Discount</span>
                  <span className="font-medium tabular-nums">−{formatUsd(order.discount)}</span>
                </div>
              ) : null}
              <div className="flex items-baseline justify-between border-t border-[#2D2826]/[0.08] pt-2">
                <span className="text-sm font-medium text-[#6B6560]">Total</span>
                <span className="text-xl font-bold tabular-nums text-[#2D2826]">
                  {formatUsd(order.finalPrice)}
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onStartNewOrder}
            className="mt-6 w-full min-h-12 shrink-0 touch-manipulation rounded-xl bg-[#C73B0F] py-3.5 text-center text-sm font-bold tracking-wide text-white shadow-[0_4px_16px_rgba(199,59,15,0.35)] transition active:bg-[#9e2e0b] sm:mt-8 sm:hover:bg-[#b5340d]"
          >
            Start New Order
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
