import type { ComponentPropsWithoutRef } from "react";

type SpinnerProps = Omit<ComponentPropsWithoutRef<"span">, "children"> & {
  className?: string;
  /** Light spinner for dark / primary buttons */
  variant?: "default" | "onPrimary";
};

export default function Spinner({
  className = "size-5",
  variant = "default",
  "aria-label": ariaLabel = "Loading",
  ...props
}: SpinnerProps) {
  const hidden = props["aria-hidden"] === true || props["aria-hidden"] === "true";
  const ring =
    variant === "onPrimary"
      ? "border-white/35 border-t-white"
      : "border-[#E8E3DD] border-t-[#C73B0F]";
  return (
    <span
      className={`shrink-0 rounded-full border-2 animate-spin ${ring} ${className}`}
      role={hidden ? undefined : "status"}
      aria-label={hidden ? undefined : ariaLabel}
      {...props}
    />
  );
}
