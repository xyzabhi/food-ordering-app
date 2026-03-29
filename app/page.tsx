import CatalogError from "@/src/components/CatalogError";
import OrderingClient from "@/src/components/OrderingClient";
import type { ProductItem } from "@/src/components/ProductItemCard";
import { fetchProducts, type ApiProduct } from "@/src/lib/products-api";

function apiToProductItem(p: ApiProduct): ProductItem {
  return {
    id: p.id,
    name: p.name,
    price: p.price,
    image: p.image,
    type: p.category,
  };
}

export default async function Home() {
  const result = await fetchProducts();

  if (!result.ok) {
    return <CatalogError message={result.message} />;
  }

  const products = result.products.map(apiToProductItem);

  return <OrderingClient products={products} />;
}
