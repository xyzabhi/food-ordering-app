import Image from "next/image";
import Link from "next/link";
import { fetchProductById } from "@/src/lib/products-api";
import { formatUsd } from "@/src/lib/format";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProductDetailPage({ params }: PageProps) {
  const { id } = await params;
  const result = await fetchProductById(id);

  const back = (
    <Link
      href="/"
      className="text-sm font-semibold text-[#C73B0F] underline-offset-4 transition hover:underline"
    >
      ← Back to menu
    </Link>
  );

  if (!result.ok) {
    return (
      <main
        id="main-content"
        className="min-h-dvh bg-[#F7F5F2] px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[max(1.5rem,env(safe-area-inset-top))] sm:px-8 sm:pt-12"
      >
        <div className="mx-auto max-w-lg">
          {back}
          <div className="mt-6 rounded-2xl border border-red-100/90 bg-red-50/90 p-6 shadow-sm">
            <h1 className="text-lg font-semibold text-red-900">
              {result.notFound ? "Product not found" : "Could not load product"}
            </h1>
            <p className="mt-2 text-sm text-red-800/90">{result.message}</p>
          </div>
        </div>
      </main>
    );
  }

  const p = result.product;

  return (
    <main
      id="main-content"
      className="min-h-dvh bg-[#F7F5F2] px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[max(1.5rem,env(safe-area-inset-top))] sm:px-8 sm:pt-12"
    >
      <div className="mx-auto max-w-md">
        {back}
        <article className="mt-8 overflow-hidden rounded-2xl border border-[#2D2826]/[0.06] bg-white shadow-[0_4px_28px_rgba(45,40,38,0.08)]">
          <div className="relative aspect-[4/3] w-full">
            <Image
              src={p.image}
              alt={p.name}
              fill
              className="object-cover"
              sizes="(max-width: 448px) 100vw, 448px"
              unoptimized
            />
          </div>
          <div className="px-6 py-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#9A8478]">{p.category}</p>
            <h1 className="font-display mt-2 text-3xl font-semibold leading-tight tracking-tight text-[#2D2826]">
              {p.name}
            </h1>
            <p className="mt-4 text-2xl font-semibold tabular-nums text-[#C73B0F]">{formatUsd(p.price)}</p>
            <p className="mt-6 text-sm leading-relaxed text-[#6B6560]">
              Add this item from the{" "}
              <Link
                href="/"
                className="font-semibold text-[#C73B0F] underline-offset-4 hover:underline"
              >
                menu
              </Link>
              .
            </p>
          </div>
        </article>
      </div>
    </main>
  );
}
