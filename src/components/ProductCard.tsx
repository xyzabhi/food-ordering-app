import Image from "next/image";
import type { ApiProduct } from "@/src/lib/products-api";
import { formatUsd } from "@/src/lib/format";

export default function ProductCard({ product }: { product: ApiProduct }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="relative aspect-[4/3] w-full bg-gray-100">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          unoptimized
        />
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
          {product.category}
        </p>
        <h2 className="text-base font-semibold leading-snug text-gray-900">
          {product.name}
        </h2>
        <p className="mt-auto pt-2 text-lg font-semibold text-[#A6634B]">
          {formatUsd(product.price)}
        </p>
      </div>
    </article>
  );
}
