"use client";

import Link from "next/link";
import { EmptyState } from "@/components/common/EmptyState";
import { ProductGrid } from "@/components/product/ProductGrid";
import { useHasMounted } from "@/hooks/use-has-mounted";
import {
  useWishlistStore,
  wishlistItemToProduct,
} from "@/store/wishlist-store";

export function WishlistContent() {
  const mounted = useHasMounted();
  const items = useWishlistStore((state) => state.items);
  const clearWishlist = useWishlistStore((state) => state.clearWishlist);

  if (!mounted) {
    return (
      <div className="py-16 text-center text-muted" aria-busy="true">
        Loading wishlist...
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <EmptyState
        title="Your wishlist is empty"
        description="Save products you love and find them here later."
        action={
          <Link href="/products" className="btn btn-primary">
            Explore Products
          </Link>
        }
      />
    );
  }

  const products = items.map(wishlistItemToProduct);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl text-foreground">My Wishlist</h1>
          <p className="mt-1 text-sm text-muted">
            {items.length} product{items.length === 1 ? "" : "s"}
          </p>
        </div>
        <button
          type="button"
          className="text-sm font-medium text-danger hover:underline"
          onClick={() => clearWishlist()}
        >
          Clear Wishlist
        </button>
      </div>

      <ProductGrid
        products={products}
        className="sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      />
    </div>
  );
}
