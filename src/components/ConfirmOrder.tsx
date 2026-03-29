"use client";

import Image from "next/image";
import { useEffect, useId } from "react";
import { createPortal } from "react-dom";
import type { CartLineItem } from "@/src/components/Cart";
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

export type ConfirmOrderModalProps = {
  open: boolean;
  lines: CartLineItem[];
  getProductImage: (productId: number) => string | undefined;
  onStartNewOrder: () => void;
};

export default function ConfirmOrderModal({
  open,
  lines,
  getProductImage,
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

  if (!open) return null;
  if (typeof window === "undefined") return null;

  const orderTotal = lines.reduce((s, l) => s + l.quantity * l.unitPrice, 0);

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
        className="relative z-10 flex max-h-[min(92dvh,100dvh)] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl bg-white shadow-xl sm:max-h-[min(90dvh,800px)] sm:rounded-2xl"
      >
        <div className="flex min-h-0 flex-1 flex-col px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-8 sm:px-8 sm:pb-6 sm:pt-10">
          <div className="flex shrink-0 flex-col gap-4 sm:flex-row sm:items-start sm:gap-5">
            <CheckIcon />
            <div className="min-w-0 flex-1">
              <h2
                id={titleId}
                className="text-2xl font-bold tracking-tight text-[#2a2a2a] sm:text-[1.65rem]"
              >
                Order Confirmed
              </h2>
              <p className="mt-1.5 text-sm text-[#9E9E9E] sm:text-[15px]">
                We hope you enjoy your food!
              </p>
            </div>
          </div>

          <div className="mt-6 flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl bg-[#fcf8f5] p-4 sm:mt-8 sm:p-5">
            <ul
              className="min-h-0 max-h-[min(52dvh,22rem)] flex-1 overflow-y-auto overscroll-y-contain [-webkit-overflow-scrolling:touch] touch-pan-y divide-y divide-[#ebe6e1] sm:max-h-[min(48dvh,28rem)]"
              aria-label="Order items"
            >
              {lines.map((line) => {
                const img = getProductImage(line.productId);
                const subtotal = line.quantity * line.unitPrice;
                return (
                  <li key={line.productId} className="flex gap-3 py-4 first:pt-0">
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-[#eee] sm:h-16 sm:w-16">
                      {img ? (
                        <Image
                          src={img}
                          alt={line.name}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      ) : null}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold leading-snug text-[#4D4D4D]">{line.name}</p>
                      <p className="mt-1 text-sm">
                        <span className="font-semibold text-[#D25B32]">{line.quantity}x</span>
                        <span className="text-[#9E9E9E]"> @ {formatUsd(line.unitPrice)}</span>
                      </p>
                    </div>
                    <p className="shrink-0 self-start text-sm font-semibold text-[#6B6B6B] sm:text-base">
                      {formatUsd(subtotal)}
                    </p>
                  </li>
                );
              })}
            </ul>

            <div className="mt-4 shrink-0 flex items-baseline justify-between border-t border-[#ebe6e1] pt-4">
              <span className="text-sm font-medium text-[#6B6B6B]">Order Total</span>
              <span className="text-xl font-bold text-[#2a2a2a]">{formatUsd(orderTotal)}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={onStartNewOrder}
            className="mt-6 w-full min-h-12 shrink-0 touch-manipulation rounded-xl bg-[#c73b0f] py-3.5 text-center text-sm font-bold text-white shadow-sm transition active:bg-[#a8320d] sm:mt-8 sm:hover:bg-[#b0340d]"
          >
            Start New Order
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
