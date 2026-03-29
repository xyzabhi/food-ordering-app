"use client";

import Image from "next/image";
import Link from "next/link";
import { formatUsd } from "@/src/lib/format";

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
        stroke="#D25B32"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="18" cy="6" r="4" fill="#D25B32" />
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
    <article className="mx-auto w-full max-w-[min(100%,20rem)] overflow-hidden rounded-2xl bg-[#F9F7F5] shadow-sm sm:max-w-[280px]">
      <div className="relative z-20 w-full">
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-t-2xl">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 280px"
            unoptimized
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/10 to-transparent" />
        </div>
        <div className="absolute bottom-0 left-1/2 z-10 -translate-x-1/2 translate-y-1/2">
          {!inCart ? (
            <button
              type="button"
              onClick={onAddToCart}
              className="relative z-10 flex min-h-11 min-w-[44px] cursor-pointer touch-manipulation items-center justify-center gap-2 rounded-full border border-[#E5D9CF] bg-white px-4 py-2.5 text-sm font-medium text-[#4D4D4D] shadow-sm transition active:bg-[#f5f5f5] sm:min-h-0 sm:px-5 sm:active:bg-[#fafafa]"
            >
              <CartPlusIcon />
              Add to Cart
            </button>
          ) : (
            <div
              className="relative z-10 flex min-h-11 min-w-[min(100%,11rem)] max-w-[calc(100vw-2rem)] items-center justify-between gap-1 rounded-full border border-[#E5D9CF] bg-white px-1 py-1 shadow-sm touch-manipulation sm:min-h-0 sm:min-w-[140px] sm:px-2 sm:py-1.5"
              role="group"
              aria-label={`Quantity for ${product.name}`}
            >
              <button
                type="button"
                onClick={onDecrement}
                className="flex size-11 shrink-0 touch-manipulation items-center justify-center rounded-full text-xl font-semibold leading-none text-[#D25B32] transition active:bg-[#FFF4EE] sm:size-9 sm:text-lg sm:hover:bg-[#FFF4EE]"
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className="min-w-[1.75rem] text-center text-base font-semibold tabular-nums text-[#4D4D4D] sm:min-w-[1.5rem] sm:text-sm">
                {quantity}
              </span>
              <button
                type="button"
                onClick={onIncrement}
                className="flex size-11 shrink-0 touch-manipulation items-center justify-center rounded-full text-xl font-semibold leading-none text-[#D25B32] transition active:bg-[#FFF4EE] sm:size-9 sm:text-lg sm:hover:bg-[#FFF4EE]"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="relative z-0 px-5 pb-5 pt-10">
        <p className="text-xs font-medium tracking-wide text-[#9E9E9E]">
          {product.type}
        </p>
        <h2 className="mt-1 text-base font-bold leading-snug text-[#4D4D4D]">
          <Link
            href={`/products/${encodeURIComponent(product.id)}`}
            className="rounded-sm hover:text-[#A6634B] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A6634B]/40 focus-visible:ring-offset-2"
          >
            {product.name}
          </Link>
        </h2>
        <p className="mt-2 text-base font-semibold text-[#A6634B]">{priceLabel}</p>
      </div>
    </article>
  );
}
