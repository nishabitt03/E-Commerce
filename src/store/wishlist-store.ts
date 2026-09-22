"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/types/product";

export interface WishlistItem {
  id: string;
  slug: string;
  name: string;
  brand: string;
  image: string;
  price: number;
  originalPrice: number;
  discountPercentage: number;
  rating: number;
  reviewCount: number;
  stock: number;
  images: string[];
  category: string;
}

interface WishlistState {
  items: WishlistItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  toggleItem: (product: Product) => boolean;
  hasItem: (productId: string) => boolean;
  clearWishlist: () => void;
}

function toWishlistItem(product: Product): WishlistItem {
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    brand: product.brand,
    image: product.images[0] ?? "",
    price: product.price,
    originalPrice: product.originalPrice,
    discountPercentage: product.discountPercentage,
    rating: product.rating,
    reviewCount: product.reviewCount,
    stock: product.stock,
    images: product.images,
    category: product.category,
  };
}

/** Rebuild a Product-shaped object for ProductCard reuse. */
export function wishlistItemToProduct(item: WishlistItem): Product {
  return {
    id: item.id,
    slug: item.slug,
    name: item.name,
    brand: item.brand,
    category: item.category,
    description: "",
    ingredients: [],
    benefits: [],
    howToUse: [],
    price: item.price,
    originalPrice: item.originalPrice,
    discountPercentage: item.discountPercentage,
    rating: item.rating,
    reviewCount: item.reviewCount,
    images: item.images.length > 0 ? item.images : [item.image],
    variants: [],
    stock: item.stock,
    concerns: [],
    isBestSeller: false,
    isNewArrival: false,
    reviews: [],
  };
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) => {
        if (get().hasItem(product.id)) return;
        set((state) => ({
          items: [...state.items, toWishlistItem(product)],
        }));
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== productId),
        }));
      },

      toggleItem: (product) => {
        const exists = get().hasItem(product.id);
        if (exists) {
          get().removeItem(product.id);
          return false;
        }
        get().addItem(product);
        return true;
      },

      hasItem: (productId) =>
        get().items.some((item) => item.id === productId),

      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: "lumina-wishlist",
      version: 1,
      partialize: (state) => ({ items: state.items }),
    }
  )
);
