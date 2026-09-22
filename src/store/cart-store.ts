"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { trackEvent } from "@/lib/analytics/analytics";
import {
  calculateCartTotals,
  createCartItem,
  isSameCartItem,
} from "@/lib/utils/cart";
import type { CartItem, CartTotals } from "@/types/cart";
import type { Product, ProductVariant } from "@/types/product";

interface AddItemInput {
  product: Product;
  quantity?: number;
  variant?: ProductVariant;
}

interface AddItemResult {
  ok: boolean;
  message: string;
}

interface CartState {
  items: CartItem[];
  addItem: (input: AddItemInput) => AddItemResult;
  removeItem: (productId: string, variantId?: string) => void;
  increaseQuantity: (productId: string, variantId?: string) => AddItemResult;
  decreaseQuantity: (productId: string, variantId?: string) => void;
  updateQuantity: (
    productId: string,
    quantity: number,
    variantId?: string
  ) => AddItemResult;
  clearCart: () => void;
  getTotals: () => CartTotals;
  getItemCount: () => number;
  hasItem: (productId: string, variantId?: string) => boolean;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: ({ product, quantity = 1, variant }) => {
        const maxStock = variant?.stock ?? product.stock;
        const price = variant?.price ?? product.price;

        if (maxStock <= 0) {
          return { ok: false, message: "This product is out of stock." };
        }

        const existing = get().items.find((item) =>
          isSameCartItem(item, product.id, variant?.id)
        );
        const nextQuantity = (existing?.quantity ?? 0) + quantity;

        if (nextQuantity > maxStock) {
          return {
            ok: false,
            message: "Cannot add more than available stock.",
          };
        }

        set((state) => {
          if (existing) {
            return {
              items: state.items.map((item) =>
                isSameCartItem(item, product.id, variant?.id)
                  ? {
                      ...item,
                      quantity: nextQuantity,
                      maxStock,
                      price,
                    }
                  : item
              ),
            };
          }

          return {
            items: [
              ...state.items,
              createCartItem(product, quantity, variant),
            ],
          };
        });

        trackEvent("add_to_cart", {
          productId: product.id,
          productName: product.name,
          price,
          quantity,
        });

        return { ok: true, message: "Product added to your cart." };
      },

      removeItem: (productId, variantId) => {
        const item = get().items.find((cartItem) =>
          isSameCartItem(cartItem, productId, variantId)
        );

        set((state) => ({
          items: state.items.filter(
            (cartItem) => !isSameCartItem(cartItem, productId, variantId)
          ),
        }));

        if (item) {
          trackEvent("remove_from_cart", {
            productId: item.productId,
            productName: item.name,
          });
        }
      },

      increaseQuantity: (productId, variantId) => {
        const item = get().items.find((cartItem) =>
          isSameCartItem(cartItem, productId, variantId)
        );

        if (!item) {
          return { ok: false, message: "Item not found in cart." };
        }

        if (item.quantity >= item.maxStock) {
          return {
            ok: false,
            message: "Cannot add more than available stock.",
          };
        }

        set((state) => ({
          items: state.items.map((cartItem) =>
            isSameCartItem(cartItem, productId, variantId)
              ? { ...cartItem, quantity: cartItem.quantity + 1 }
              : cartItem
          ),
        }));

        return { ok: true, message: "Quantity updated." };
      },

      decreaseQuantity: (productId, variantId) => {
        set((state) => ({
          items: state.items.map((item) => {
            if (!isSameCartItem(item, productId, variantId)) return item;
            return {
              ...item,
              quantity: Math.max(1, item.quantity - 1),
            };
          }),
        }));
      },

      updateQuantity: (productId, quantity, variantId) => {
        const item = get().items.find((cartItem) =>
          isSameCartItem(cartItem, productId, variantId)
        );

        if (!item) {
          return { ok: false, message: "Item not found in cart." };
        }

        if (quantity < 1) {
          return { ok: false, message: "Quantity must be at least 1." };
        }

        if (quantity > item.maxStock) {
          return {
            ok: false,
            message: "Cannot add more than available stock.",
          };
        }

        set((state) => ({
          items: state.items.map((cartItem) =>
            isSameCartItem(cartItem, productId, variantId)
              ? { ...cartItem, quantity }
              : cartItem
          ),
        }));

        return { ok: true, message: "Quantity updated." };
      },

      clearCart: () => set({ items: [] }),

      getTotals: () => calculateCartTotals(get().items),

      getItemCount: () =>
        get().items.reduce((sum, item) => sum + item.quantity, 0),

      hasItem: (productId, variantId) =>
        get().items.some((item) =>
          isSameCartItem(item, productId, variantId)
        ),
    }),
    {
      name: "lumina-cart",
      version: 1,
      partialize: (state) => ({ items: state.items }),
    }
  )
);
