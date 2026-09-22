import { products } from "@/data/products";
import { calculateCartTotals, createCartItem } from "@/lib/utils/cart";
import type { CartItem, CartTotals } from "@/types/cart";
import type { OrderItem } from "@/types/order";
import type { CartLineInput } from "@/lib/payment/payment-types";

export class TrustedCartError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TrustedCartError";
  }
}

/**
 * Rebuild cart lines from catalog data. Client prices/totals are never trusted.
 */
export function resolveTrustedCart(lines: CartLineInput[]): {
  items: CartItem[];
  totals: CartTotals;
  orderItems: OrderItem[];
} {
  if (!Array.isArray(lines) || lines.length === 0) {
    throw new TrustedCartError("Cart is empty.");
  }

  const items: CartItem[] = [];

  for (const line of lines) {
    if (!line.productId || !Number.isFinite(line.quantity) || line.quantity < 1) {
      throw new TrustedCartError("Invalid cart line.");
    }

    const product = products.find((entry) => entry.id === line.productId);
    if (!product) {
      throw new TrustedCartError(`Unknown product: ${line.productId}`);
    }

    const variant = line.variantId
      ? product.variants.find((entry) => entry.id === line.variantId)
      : product.variants[0];

    if (line.variantId && !variant) {
      throw new TrustedCartError(`Unknown variant for ${product.name}`);
    }

    const stock = variant?.stock ?? product.stock;
    if (stock <= 0) {
      throw new TrustedCartError(`${product.name} is out of stock.`);
    }
    if (line.quantity > stock) {
      throw new TrustedCartError(
        `Only ${stock} unit(s) available for ${product.name}.`
      );
    }

    items.push(createCartItem(product, line.quantity, variant));
  }

  const totals = calculateCartTotals(items);
  const orderItems: OrderItem[] = items.map((item) => ({
    productId: item.productId,
    name: item.name,
    brand: item.brand,
    image: item.image,
    price: item.price,
    quantity: item.quantity,
    variantLabel: item.variantLabel,
  }));

  return { items, totals, orderItems };
}

export function toPaise(amountInr: number): number {
  return Math.round(amountInr * 100);
}
