import { JsonLd } from "@/components/seo/JsonLd";
import { buildProductJsonLd } from "@/lib/seo/schema";
import type { Product } from "@/types/product";

export function ProductJsonLd({ product }: { product: Product }) {
  return <JsonLd data={buildProductJsonLd(product)} />;
}
