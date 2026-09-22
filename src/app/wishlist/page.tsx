import type { Metadata } from "next";
import { WishlistContent } from "@/components/wishlist/WishlistContent";
import { createNoIndexMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createNoIndexMetadata(
  "Wishlist",
  "Products you saved on Lumina Skin."
);

export default function WishlistPage() {
  return (
    <div className="container-page py-8 sm:py-10">
      <WishlistContent />
    </div>
  );
}
