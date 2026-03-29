import { getApiBaseUrl } from "@/src/lib/api-base";

export type ApiProduct = {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
};

export type FetchProductsResult =
  | { ok: true; products: ApiProduct[] }
  | { ok: false; message: string };

export type FetchProductByIdResult =
  | { ok: true; product: ApiProduct }
  | { ok: false; message: string; notFound?: boolean };

function isProduct(value: unknown): value is ApiProduct {
  if (!value || typeof value !== "object") return false;
  const o = value as Record<string, unknown>;
  return (
    typeof o.id === "string" &&
    typeof o.name === "string" &&
    typeof o.price === "number" &&
    Number.isFinite(o.price) &&
    typeof o.category === "string" &&
    typeof o.image === "string"
  );
}

export async function fetchProductById(id: string): Promise<FetchProductByIdResult> {
  const encoded = encodeURIComponent(id);
  const url = `${getApiBaseUrl()}/products/${encoded}`;
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (res.status === 404) {
      let message = "Product not found";
      try {
        const body = (await res.json()) as unknown;
        if (
          body &&
          typeof body === "object" &&
          typeof (body as { error?: unknown }).error === "string"
        ) {
          message = (body as { error: string }).error;
        }
      } catch {
        /* ignore */
      }
      return { ok: false, message, notFound: true };
    }
    if (!res.ok) {
      let message = `Could not load product (${res.status})`;
      try {
        const body = (await res.json()) as unknown;
        if (
          body &&
          typeof body === "object" &&
          typeof (body as { error?: unknown }).error === "string"
        ) {
          message = (body as { error: string }).error;
        }
      } catch {
        /* ignore */
      }
      return { ok: false, message };
    }
    const data = (await res.json()) as unknown;
    if (!isProduct(data)) {
      return { ok: false, message: "Invalid product response" };
    }
    return { ok: true, product: data };
  } catch (e) {
    const message =
      e instanceof Error ? e.message : "Network error while loading product";
    return { ok: false, message };
  }
}

export async function fetchProducts(): Promise<FetchProductsResult> {
  const url = `${getApiBaseUrl()}/products`;
  try {
    const res = await fetch(url, { cache: "no-store" });

    if (!res.ok) {
      let message = `Could not load products (${res.status})`;
      try {
        const errBody = (await res.json()) as unknown;
        if (
          errBody &&
          typeof errBody === "object" &&
          typeof (errBody as { error?: unknown }).error === "string"
        ) {
          message = (errBody as { error: string }).error;
        }
      } catch {
        /* ignore JSON parse errors */
      }
      return { ok: false, message };
    }

    const data = (await res.json()) as unknown;
    if (!data || typeof data !== "object" || !("products" in data)) {
      return { ok: false, message: "Invalid response: missing products array" };
    }

    const rawList = (data as { products: unknown }).products;
    if (!Array.isArray(rawList)) {
      return { ok: false, message: "Invalid response: products is not an array" };
    }

    const products = rawList.filter(isProduct);
    return { ok: true, products };
  } catch (e) {
    const message =
      e instanceof Error ? e.message : "Network error while loading products";
    return { ok: false, message };
  }
}
