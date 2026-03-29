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
      className="text-sm font-medium text-[#A6634B] underline-offset-2 hover:underline"
    >
      ← Back to menu
    </Link>
  );

  if (!result.ok) {
    return (
      <main
        id="main-content"
        className="min-h-dvh bg-[#f3f1ef] px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[max(1.5rem,env(safe-area-inset-top))] sm:px-6 sm:pt-10"
      >
        <div className="mx-auto max-w-lg">
          {back}
          <div className="mt-6 rounded-2xl border border-red-100 bg-red-50/80 p-6">
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
      className="min-h-dvh bg-[#f3f1ef] px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[max(1.5rem,env(safe-area-inset-top))] sm:px-6 sm:pt-10"
    >
      <div className="mx-auto max-w-md">
        {back}
        <article className="mt-6 overflow-hidden rounded-2xl bg-[#F9F7F5] shadow-sm">
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
          <div className="px-5 py-5">
            <p className="text-xs font-medium tracking-wide text-[#9E9E9E]">{p.category}</p>
            <h1 className="mt-1 text-2xl font-bold text-[#4D4D4D]">{p.name}</h1>
            <p className="mt-3 text-xl font-semibold text-[#A6634B]">{formatUsd(p.price)}</p>
            <p className="mt-6 text-sm text-[#6B6B6B]">
              Add this item from the{" "}
              <Link
                href="/"
                className="font-semibold text-[#A6634B] underline-offset-2 hover:underline"
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
