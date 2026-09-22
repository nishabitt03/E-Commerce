import type { Metadata } from "next";
import { CheckoutContent } from "@/components/checkout/CheckoutContent";
import { createNoIndexMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createNoIndexMetadata(
  "Checkout",
  "Complete your Lumina Skin order. Demo checkout with mocked payment only."
);

export default function CheckoutPage() {
  return (
    <div className="container-page py-8 sm:py-10">
      <CheckoutContent />
    </div>
  );
}
