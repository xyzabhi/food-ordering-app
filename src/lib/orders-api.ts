import type { ApiProduct } from "@/src/lib/products-api";
import { getApiBaseUrl } from "@/src/lib/api-base";

export type OrderRequestItem = {
  product_id: string;
  quantity: number;
};

export type PlacedOrder = {
  id: string;
  couponCode: string;
  items: OrderRequestItem[];
  products: ApiProduct[];
  totalPrice: number;
  discount: number;
  finalPrice: number;
  createdAt: string;
};

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

function parsePlacedOrder(data: unknown): PlacedOrder | null {
  if (!isRecord(data)) return null;
  const id = data.id;
  const rawCoupon = data.couponCode;
  const couponCode =
    rawCoupon === undefined || rawCoupon === null
      ? ""
      : typeof rawCoupon === "string"
        ? rawCoupon
        : null;
  const items = data.items;
  const products = data.products;
  const totalPrice = data.totalPrice;
  const discount = data.discount;
  const finalPrice = data.finalPrice;
  const createdAt = data.createdAt;
  if (typeof id !== "string" || couponCode === null) return null;
  if (!Array.isArray(items) || !Array.isArray(products)) return null;
  if (
    typeof totalPrice !== "number" ||
    typeof discount !== "number" ||
    typeof finalPrice !== "number" ||
    typeof createdAt !== "string"
  ) {
    return null;
  }
  const parsedItems: OrderRequestItem[] = [];
  for (const row of items) {
    if (!isRecord(row)) return null;
    const pid = row.product_id;
    const qty = row.quantity;
    if (typeof pid !== "string" || typeof qty !== "number" || qty < 1 || !Number.isInteger(qty)) {
      return null;
    }
    parsedItems.push({ product_id: pid, quantity: qty });
  }
  const parsedProducts: ApiProduct[] = [];
  for (const row of products) {
    if (!isRecord(row)) return null;
    if (
      typeof row.id !== "string" ||
      typeof row.name !== "string" ||
      typeof row.price !== "number" ||
      typeof row.category !== "string" ||
      typeof row.image !== "string"
    ) {
      return null;
    }
    parsedProducts.push({
      id: row.id,
      name: row.name,
      price: row.price,
      category: row.category,
      image: row.image,
    });
  }
  return {
    id,
    couponCode,
    items: parsedItems,
    products: parsedProducts,
    totalPrice,
    discount,
    finalPrice,
    createdAt,
  };
}

export type PlaceOrderResult =
  | { ok: true; order: PlacedOrder }
  | { ok: false; message: string; status: number };

export async function placeOrder(
  items: OrderRequestItem[],
  couponCode: string,
): Promise<PlaceOrderResult> {
  const url = `${getApiBaseUrl()}/orders`;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "omit",
      body: JSON.stringify({ items, couponCode }),
    });

    if (res.status === 201) {
      let data: unknown;
      try {
        data = await res.json();
      } catch {
        return { ok: false, message: "Invalid JSON in order response", status: res.status };
      }
      const order = parsePlacedOrder(data);
      if (!order) {
        return { ok: false, message: "Invalid order response shape", status: res.status };
      }
      return { ok: true, order };
    }

    let message = `Order failed (${res.status})`;
    try {
      const body = (await res.json()) as unknown;
      if (isRecord(body) && typeof body.error === "string") {
        message = body.error;
      }
    } catch {
      /* ignore */
    }
    return { ok: false, message, status: res.status };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Network error";
    return { ok: false, message, status: 0 };
  }
}
