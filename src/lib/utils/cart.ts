import type { CartItem, CartTotals } from "@/types/cart";
import type { Product, ProductVariant } from "@/types/product";

export function getCartItemKey(
  productId: string,
  variantId?: string
): string {
  return `${productId}::${variantId ?? "default"}`;
}

export function isSameCartItem(
  item: Pick<CartItem, "productId" | "variantId">,
  productId: string,
  variantId?: string
): boolean {
  return (
    item.productId === productId &&
    (item.variantId ?? undefined) === (variantId ?? undefined)
  );
}

export function createCartItem(
  product: Product,
  quantity: number,
  variant?: ProductVariant
): CartItem {
  const price = variant?.price ?? product.price;
  const maxStock = variant?.stock ?? product.stock;

  return {
    productId: product.id,
    slug: product.slug,
    name: product.name,
    brand: product.brand,
    image: product.images[0] ?? "",
    price,
    originalPrice: product.originalPrice,
    quantity: Math.max(1, Math.min(quantity, Math.max(maxStock, 0))),
    variantId: variant?.id,
    variantLabel: variant?.label,
    maxStock,
  };
}

export function calculateCartTotals(items: CartItem[]): CartTotals {
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Simple mock promo: 10% off orders ≥ ₹1000, capped at ₹200
  const discount =
    subtotal >= 1000 ? Math.min(200, Math.round(subtotal * 0.1)) : 0;

  const afterDiscount = Math.max(0, subtotal - discount);
  const shipping = afterDiscount === 0 || afterDiscount >= 999 ? 0 : 49;
  const total = afterDiscount + shipping;

  return { subtotal, discount, shipping, total, itemCount };
}
