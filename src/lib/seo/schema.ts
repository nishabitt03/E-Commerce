import { getSiteUrl, SITE_NAME } from "@/lib/constants";
import { getCategoryLabel } from "@/lib/utils/product-params";
import type { Product } from "@/types/product";

export function buildProductJsonLd(product: Product) {
  const url = `${getSiteUrl()}/products/${product.slug}`;

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images,
    sku: product.variants[0]?.sku ?? product.id,
    brand: {
      "@type": "Brand",
      name: product.brand,
    },
    offers: {
      "@type": "Offer",
      url,
      priceCurrency: "INR",
      price: product.price.toFixed(2),
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
    },
  };

  if (product.reviewCount > 0 && product.rating > 0) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
    };
  }

  return schema;
}

export function buildBreadcrumbJsonLd(product: Product) {
  const site = getSiteUrl();

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: site,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Shop",
        item: `${site}/products`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: getCategoryLabel(product.category),
        item: `${site}/products?category=${product.category}`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: product.name,
        item: `${site}/products/${product.slug}`,
      },
    ],
  };
}

export function buildOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: getSiteUrl(),
    description:
      "Performance-minded skincare with clean formulas and concern-based discovery.",
  };
}

export function buildWebsiteJsonLd() {
  const site = getSiteUrl();

  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: site,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${site}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}
