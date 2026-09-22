import type { Metadata } from "next";
import { OrdersContent } from "@/components/orders/OrdersContent";
import { createNoIndexMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createNoIndexMetadata(
  "My Orders",
  "Track your Lumina Skin orders."
);

export default function OrdersPage() {
  return (
    <div className="container-page py-8 sm:py-10">
      <OrdersContent />
    </div>
  );
}
