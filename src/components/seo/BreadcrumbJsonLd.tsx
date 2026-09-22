import { JsonLd } from "@/components/seo/JsonLd";
import { buildBreadcrumbJsonLd } from "@/lib/seo/schema";
import type { Product } from "@/types/product";

export function BreadcrumbJsonLd({ product }: { product: Product }) {
  return <JsonLd data={buildBreadcrumbJsonLd(product)} />;
}
