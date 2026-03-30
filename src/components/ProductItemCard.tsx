"use client";

import Image from "next/image";
import Link from "next/link";
import { formatUsd } from "@/src/lib/format";

const accent = "#C73B0F";

function CartPlusIcon() {
  return (
    <svg
      width={20}
      height={20}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
        stroke={accent}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="18" cy="6" r="4" fill={accent} />
      <path
        d="M18 4.5v3M16.5 6h3"
        stroke="white"
        strokeWidth={1.2}
        strokeLinecap="round"
      />
    </svg>
  );
}

export type ProductItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  type: string;
};

export default function ProductItemCard({
  product,
  quantity = 0,
  onAddToCart,
  onIncrement,
  onDecrement,
}: {
  product: ProductItem;
  quantity?: number;
  onAddToCart?: () => void;
  onIncrement?: () => void;
  onDecrement?: () => void;
}) {
  const priceLabel = formatUsd(product.price);

  const inCart = quantity > 0;

  return (
    <article
      className={`group mx-auto w-full max-w-[min(100%,20rem)] overflow-hidden rounded-2xl border-2 bg-white shadow-[0_2px_16px_rgba(45,40,38,0.06)] transition-[box-shadow,transform,border-color] duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(45,40,38,0.12)] sm:max-w-[280px] ${
        inCart
          ? "border-[#C73B0F] shadow-[0_8px_28px_rgba(199,59,15,0.14)]"
          : "border-transparent ring-1 ring-[#2D2826]/[0.05]"
      }`}
    >
      <div className="relative z-20 w-full">
        <div className="relative aspect-square w-full overflow-hidden rounded-t-2xl">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 280px"
            unoptimized
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/[0.18] to-transparent" />
        </div>
        <div className="absolute bottom-0 left-1/2 z-10 -translate-x-1/2 translate-y-1/2">
          {!inCart ? (
            <button
              type="button"
              onClick={onAddToCart}
              className="relative z-10 flex min-h-11 min-w-[44px] cursor-pointer touch-manipulation items-center justify-center gap-2 rounded-full border border-[#E8E0D8] bg-white px-4 py-2.5 text-sm font-semibold text-[#3D3530] shadow-[0_4px_14px_rgba(45,40,38,0.08)] transition hover:border-[#E0D5CA] hover:shadow-[0_6px_20px_rgba(45,40,38,0.1)] active:scale-[0.98] active:bg-[#FAFAF8] sm:min-h-0 sm:px-5"
            >
              <CartPlusIcon />
              Add to Cart
            </button>
          ) : (
            <div
              className="relative z-10 flex min-h-11 min-w-[min(100%,11rem)] max-w-[calc(100vw-2rem)] items-center justify-between gap-0.5 rounded-full bg-[#C73B0F] px-1 py-1 shadow-[0_6px_20px_rgba(199,59,15,0.35)] touch-manipulation sm:min-h-0 sm:min-w-[148px] sm:px-1.5 sm:py-1.5"
              role="group"
              aria-label={`Quantity for ${product.name}`}
            >
              <button
                type="button"
                onClick={onDecrement}
                className="flex size-11 shrink-0 touch-manipulation items-center justify-center rounded-full text-xl font-medium leading-none text-white transition hover:bg-white/15 active:bg-white/25 sm:size-9 sm:text-lg"
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className="min-w-[1.75rem] text-center text-base font-semibold tabular-nums text-white sm:min-w-[1.5rem] sm:text-sm">
                {quantity}
              </span>
              <button
                type="button"
                onClick={onIncrement}
                className="flex size-11 shrink-0 touch-manipulation items-center justify-center rounded-full text-xl font-medium leading-none text-white transition hover:bg-white/15 active:bg-white/25 sm:size-9 sm:text-lg"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="relative z-0 px-5 pb-5 pt-10">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#9A8478]">
          {product.type}
        </p>
        <h2 className="mt-1.5 text-[15px] font-semibold leading-snug text-[#3D3530] sm:text-base">
          <Link
            href={`/products/${encodeURIComponent(product.id)}`}
            className="rounded-sm transition-colors hover:text-[#C73B0F] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C73B0F]/35 focus-visible:ring-offset-2"
          >
            {product.name}
          </Link>
        </h2>
        <p className="mt-2 text-base font-semibold tabular-nums text-[#C73B0F]">{priceLabel}</p>
      </div>
    </article>
  );
}
