import type { Metadata } from "next";
import { CartContent } from "@/components/cart/CartContent";
import { createNoIndexMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createNoIndexMetadata(
  "Your Cart",
  "Review items in your Lumina Skin cart before checkout."
);

export default function CartPage() {
  return (
    <div className="container-page py-8 sm:py-10">
      <CartContent />
    </div>
  );
}
