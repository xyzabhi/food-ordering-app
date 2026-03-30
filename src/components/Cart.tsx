"use client";

import Spinner from "@/src/components/Spinner";
import { formatUsd } from "@/src/lib/format";

export type CartLineItem = {
  productId: string;
  name: string;
  unitPrice: number;
  quantity: number;
};

function TreeIcon() {
  return (
    <svg width={22} height={22} viewBox="0 0 24 24" className="shrink-0" aria-hidden>
      <path fill="#2E7D32" d="M12 2 4 14h4.5v6h7v-6H20L12 2z" />
    </svg>
  );
}

function EmptyCartIllustration({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M40 40h20l8 40h88l12-48H56"
        stroke="currentColor"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="76" cy="124" r="10" stroke="currentColor" strokeWidth={3} />
      <circle cx="140" cy="124" r="10" stroke="currentColor" strokeWidth={3} />
      <path
        d="M48 36c0-8 6-14 14-14h24"
        stroke="currentColor"
        strokeWidth={3}
        strokeLinecap="round"
        opacity={0.45}
      />
      <path
        d="M100 52v24M88 64h24"
        stroke="currentColor"
        strokeWidth={2.5}
        strokeLinecap="round"
        opacity={0.35}
      />
    </svg>
  );
}

export type CartPromoState =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "valid"; discountPercent: number }
  | { kind: "invalid" }
  | { kind: "error" };

type CartProps = {
  lines: CartLineItem[];
  onRemove: (productId: string) => void;
  onConfirmOrder: () => void | Promise<void>;
  couponCode: string;
  onCouponChange: (value: string) => void;
  onCheckPromo?: () => void;
  promoState?: CartPromoState;
  checkoutError: string | null;
  checkoutLoading: boolean;
  /** Mobile bottom sheet: show close control */
  onClose?: () => void;
  /** `sheet` = inside mobile drawer (tighter layout, more list scroll area) */
  variant?: "sidebar" | "sheet";
};

export default function Cart({
  lines,
  onRemove,
  onConfirmOrder,
  couponCode,
  onCouponChange,
  onCheckPromo,
  promoState = { kind: "idle" },
  checkoutError,
  checkoutLoading,
  onClose,
  variant = "sidebar",
}: CartProps) {
  const totalQty = lines.reduce((s, l) => s + l.quantity, 0);
  const orderTotal = lines.reduce((s, l) => s + l.quantity * l.unitPrice, 0);
  const isSheet = variant === "sheet";
  const promoLoading = promoState.kind === "loading";
  const busy = checkoutLoading || promoLoading;

  return (
    <aside
      aria-busy={busy}
      className={
        isSheet
          ? "flex min-h-0 w-full flex-1 flex-col overflow-hidden bg-transparent p-0"
          : "flex min-h-[min(320px,50dvh)] w-full max-w-md flex-col rounded-2xl border border-[#2D2826]/[0.06] bg-white p-5 shadow-[0_4px_28px_rgba(45,40,38,0.08)] sm:min-h-[min(420px,55vh)] sm:p-7 lg:max-w-none lg:shrink-0 lg:self-start"
      }
    >
      <div className="flex shrink-0 items-center justify-between gap-2">
        <h2 className="text-lg font-bold tracking-tight text-[#C73B0F] sm:text-xl">
          Your Cart ({totalQty})
        </h2>
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            className="flex size-10 touch-manipulation items-center justify-center rounded-full text-[#8A827A] transition hover:bg-[#F7F5F2] active:bg-[#EFEBE6]"
            aria-label="Close cart"
          >
            <svg width={20} height={20} viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M18 6L6 18M6 6l12 12"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
              />
            </svg>
          </button>
        ) : null}
      </div>

      {lines.length === 0 ? (
        <div
          className={
            isSheet
              ? "flex min-h-[40vh] flex-col items-center justify-center gap-5 px-2 py-6 text-center"
              : "flex flex-1 flex-col items-center justify-center gap-5 px-2 py-4 text-center"
          }
        >
          <EmptyCartIllustration className="h-36 w-44 text-[#D4CFC8]" />
          <div className="space-y-1.5">
            <p className="text-sm font-medium text-[#9E9E9E]">Your cart is empty</p>
            <p className="text-xs text-[#BDBDBD]">Add items from the menu to get started</p>
          </div>
        </div>
      ) : (
        <>
          <ul
            className={
              isSheet
                ? "mt-4 min-h-0 flex-1 divide-y divide-[#2D2826]/[0.06] overflow-y-auto overscroll-y-contain [-webkit-overflow-scrolling:touch] touch-pan-y"
                : "mt-5 max-h-[min(40dvh,14rem)] divide-y divide-[#2D2826]/[0.06] overflow-y-auto overscroll-y-contain [-webkit-overflow-scrolling:touch] touch-pan-y sm:max-h-[min(50dvh,20rem)] lg:max-h-[calc(100dvh-22rem)]"
            }
          >
            {lines.map((line) => {
              const subtotal = line.quantity * line.unitPrice;
              return (
                <li key={line.productId} className="flex gap-2 py-3 first:pt-0 sm:gap-3 sm:py-4">
                  <div className="min-w-0 flex-1">
                    <p className="text-[15px] font-semibold leading-snug text-[#3D3530] sm:text-base">
                      {line.name}
                    </p>
                    <div className="mt-1 flex items-baseline justify-between gap-2 text-sm">
                      <p>
                        <span className="font-semibold tabular-nums text-[#C73B0F]">{line.quantity}x</span>
                        <span className="text-[#8A827A]"> @{formatUsd(line.unitPrice)}</span>
                      </p>
                      <p className="shrink-0 font-semibold tabular-nums text-[#3D3530]">{formatUsd(subtotal)}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onRemove(line.productId)}
                    className="flex size-10 shrink-0 touch-manipulation items-center justify-center rounded-full border border-[#E8E3DD] text-[#A39A92] transition hover:border-[#D8D0C8] hover:bg-[#FAFAF8] hover:text-[#6B6560] active:bg-[#F3F0EC] sm:size-8"
                    aria-label={`Remove ${line.name}`}
                  >
                    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" aria-hidden>
                      <path
                        d="M18 6L6 18M6 6l12 12"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="mt-5 flex shrink-0 items-baseline justify-between border-t border-[#2D2826]/[0.08] pt-5">
            <span className="text-sm font-medium text-[#6B6560]">Order Total</span>
            <span className="text-2xl font-bold tabular-nums tracking-tight text-[#2D2826]">{formatUsd(orderTotal)}</span>
          </div>

          <div className="mt-6 flex shrink-0 gap-3 rounded-xl border border-[#E8E3DD]/80 bg-[#FAF7F3] px-4 py-3.5">
            <TreeIcon />
            <p className="text-sm leading-relaxed text-[#4A4540]">
              This is a <span className="font-semibold text-[#2D2826]">carbon-neutral</span> delivery
            </p>
          </div>

          <div className="mt-4 shrink-0 space-y-2">
            <label htmlFor={`cart-coupon-${variant}`} className="sr-only">
              Coupon code
            </label>
            <div className="flex gap-2">
              <input
                id={`cart-coupon-${variant}`}
                type="text"
                value={couponCode}
                onChange={(e) => onCouponChange(e.target.value)}
                placeholder="Coupon (e.g. SAVE10)"
                disabled={busy}
                autoComplete="off"
                className="min-w-0 flex-1 rounded-xl border border-[#E8E3DD] bg-[#FDFCFA] px-3 py-2.5 text-sm text-[#3D3530] placeholder:text-[#A39A92] focus:border-[#C73B0F] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C73B0F]/20 disabled:opacity-60"
              />
              {onCheckPromo ? (
                <button
                  type="button"
                  onClick={() => onCheckPromo()}
                  disabled={busy || !couponCode.trim()}
                  className="shrink-0 touch-manipulation rounded-xl border border-[#E8E3DD] bg-white px-3 py-2.5 text-sm font-semibold text-[#C73B0F] transition enabled:hover:border-[#C73B0F]/40 enabled:hover:bg-[#FFF9F5] enabled:active:bg-[#FFF4EE] disabled:opacity-50"
                >
                  Check
                </button>
              ) : null}
            </div>
            {promoLoading ? (
              <p className="flex items-center gap-2 text-xs text-[#6B6B6B]" role="status">
                <Spinner className="size-3.5" aria-hidden />
                Checking code…
              </p>
            ) : promoState.kind === "valid" ? (
              <p className="text-xs font-medium text-[#2E7D32]">
                Code OK — {promoState.discountPercent}% off
              </p>
            ) : promoState.kind === "invalid" ? (
              <p className="text-xs font-semibold tracking-wide text-red-700">INVALID PROMO</p>
            ) : promoState.kind === "error" ? (
              <p className="text-xs text-[#6B6B6B]">Could not verify code</p>
            ) : null}
          </div>

          {checkoutError ? (
            <p
              className="mt-3 shrink-0 rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-800"
              role="alert"
            >
              {checkoutError}
            </p>
          ) : null}

          <button
            type="button"
            onClick={() => void onConfirmOrder()}
            disabled={busy}
            className={
              isSheet
                ? "mt-6 flex min-h-12 w-full shrink-0 touch-manipulation items-center justify-center gap-2 rounded-xl bg-[#C73B0F] py-3.5 text-center text-sm font-bold tracking-wide text-white shadow-[0_4px_16px_rgba(199,59,15,0.35)] transition enabled:active:bg-[#9e2e0b] enabled:sm:min-h-0 enabled:hover:bg-[#b5340d] disabled:opacity-60"
                : "mt-6 flex min-h-12 w-full touch-manipulation items-center justify-center gap-2 rounded-xl bg-[#C73B0F] py-3.5 text-center text-sm font-bold tracking-wide text-white shadow-[0_4px_16px_rgba(199,59,15,0.35)] transition enabled:active:bg-[#9e2e0b] enabled:sm:min-h-0 enabled:hover:bg-[#b5340d] disabled:opacity-60"
            }
          >
            {checkoutLoading ? (
              <>
                <Spinner className="size-4" variant="onPrimary" aria-hidden />
                <span>Placing order…</span>
              </>
            ) : (
              "Confirm Order"
            )}
          </button>
        </>
      )}
    </aside>
  );
}
