import type { ApiProduct } from "@/src/lib/products-api";
import ProductCard from "@/src/components/ProductCard";

export default function ProductGrid({ products }: { products: ApiProduct[] }) {
  if (products.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-gray-200 bg-white/60 px-4 py-12 text-center text-sm text-gray-600">
        No products returned from the API.
      </p>
    );
  }

  return (
    <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <li key={product.id}>
          <ProductCard product={product} />
        </li>
      ))}
    </ul>
  );
}
