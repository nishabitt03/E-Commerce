"use client";

import { cn } from "@/lib/utils";
import { useHasMounted } from "@/hooks/use-has-mounted";
import { trackEvent } from "@/lib/analytics/analytics";
import { useToastStore } from "@/store/toast-store";
import { useWishlistStore } from "@/store/wishlist-store";
import type { Product } from "@/types/product";

interface WishlistButtonProps {
  product: Product;
  variant?: "icon" | "button";
  className?: string;
}

export function WishlistButton({
  product,
  variant = "icon",
  className,
}: WishlistButtonProps) {
  const mounted = useHasMounted();
  const hasItem = useWishlistStore((state) => state.hasItem(product.id));
  const toggleItem = useWishlistStore((state) => state.toggleItem);
  const showToast = useToastStore((state) => state.show);

  const saved = mounted && hasItem;

  function handleClick() {
    const nowSaved = toggleItem(product);
    showToast(
      nowSaved ? "Added to wishlist" : "Removed from wishlist"
    );
    trackEvent(nowSaved ? "wishlist_add" : "wishlist_remove", {
      productId: product.id,
      productName: product.name,
    });
  }

  if (variant === "button") {
    return (
      <button
        type="button"
        className={cn("btn btn-ghost w-full border border-border", className)}
        onClick={handleClick}
        aria-pressed={saved}
        aria-label={
          saved
            ? `Remove ${product.name} from wishlist`
            : `Add ${product.name} to wishlist`
        }
      >
        {saved ? "♥ Remove from Wishlist" : "♡ Add to Wishlist"}
      </button>
    );
  }

  return (
    <button
      type="button"
      className={cn(
        "inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface/95 text-foreground transition-colors hover:border-primary hover:text-primary",
        saved && "border-primary text-primary",
        className
      )}
      onClick={handleClick}
      aria-pressed={saved}
      aria-label={
        saved
          ? `Remove ${product.name} from wishlist`
          : `Add ${product.name} to wishlist`
      }
    >
      <HeartIcon filled={saved} />
    </button>
  );
}

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z" />
    </svg>
  );
}
