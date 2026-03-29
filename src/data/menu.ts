import type { CartLineItem } from "@/src/components/Cart";
import type { ProductItem } from "@/src/components/ProductItemCard";

const WAFFLE_IMAGE =
  "https://images.unsplash.com/photo-1562376552-0d160a2f238d?auto=format&fit=crop&w=640&q=80";
const TIRAMISU_IMAGE =
  "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=640&q=80";
const CREME_IMAGE =
  "https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=640&q=80";
const PANNA_IMAGE =
  "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=640&q=80";

export const products: ProductItem[] = [
  { id: 1, type: "Cake", name: "Classic Tiramisu", price: 5.5, image: TIRAMISU_IMAGE },
  { id: 2, type: "Creme", name: "Vanilla Bean Crème Brulee", price: 7.0, image: CREME_IMAGE },
  { id: 3, type: "Creme", name: "Vanilla Panna Cotta", price: 6.5, image: PANNA_IMAGE },
  { id: 4, image: WAFFLE_IMAGE, type: "Waffle", name: "Waffle with Berries", price: 6.5 },
  { id: 5, image: WAFFLE_IMAGE, type: "Waffle", name: "Waffle with Berries", price: 6.5 },
  { id: 6, image: WAFFLE_IMAGE, type: "Waffle", name: "Waffle with Berries", price: 6.5 },
  { id: 7, image: WAFFLE_IMAGE, type: "Waffle", name: "Waffle with Berries", price: 6.5 },
  { id: 8, image: WAFFLE_IMAGE, type: "Waffle", name: "Waffle with Berries", price: 6.5 },
  { id: 9, image: WAFFLE_IMAGE, type: "Waffle", name: "Waffle with Berries", price: 6.5 },
];

/** Demo cart; replace with `[]` or fetch when wiring a backend */
export const initialCart: CartLineItem[] = [
  { productId: 1, name: "Classic Tiramisu", unitPrice: 5.5, quantity: 1 },
  { productId: 2, name: "Vanilla Bean Crème Brulee", unitPrice: 7.0, quantity: 4 },
  { productId: 3, name: "Vanilla Panna Cotta", unitPrice: 6.5, quantity: 2 },
];
