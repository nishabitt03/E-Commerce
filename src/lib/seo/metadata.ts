import type { Metadata } from "next";
import { getSiteUrl, SITE_DESCRIPTION, SITE_NAME } from "@/lib/constants";
import type { Product } from "@/types/product";

const siteUrl = () => getSiteUrl();

export function createBaseMetadata(overrides: Metadata = {}): Metadata {
  return {
    metadataBase: new URL(siteUrl()),
    title: {
      default: `${SITE_NAME} | Performance Skincare`,
      template: `%s | ${SITE_NAME}`,
    },
    description: SITE_DESCRIPTION,
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      locale: "en_IN",
      title: `${SITE_NAME} | Performance Skincare`,
      description: SITE_DESCRIPTION,
      url: siteUrl(),
    },
    twitter: {
      card: "summary_large_image",
      title: `${SITE_NAME} | Performance Skincare`,
      description: SITE_DESCRIPTION,
    },
    ...overrides,
  };
}

export function createNoIndexMetadata(
  title: string,
  description: string
): Metadata {
  return createBaseMetadata({
    title,
    description,
    robots: {
      index: false,
      follow: false,
    },
  });
}

export function createProductMetadata(product: Product): Metadata {
  const url = `${siteUrl()}/products/${product.slug}`;
  const title = product.name;
  const description = product.description;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      title: `${product.name} | ${SITE_NAME}`,
      description,
      url,
      images: product.images[0]
        ? [{ url: product.images[0], alt: product.name }]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} | ${SITE_NAME}`,
      description,
      images: product.images[0] ? [product.images[0]] : undefined,
    },
  };
}

export function createSearchMetadata(query?: string): Metadata {
  const title = query
    ? `Search results for “${query}”`
    : "Search products";
  const description = query
    ? `Browse Lumina Skin products matching “${query}”.`
    : "Search serums, moisturizers, SPF, and more.";

  return {
    title,
    description,
    robots: {
      // Avoid indexing arbitrary query URLs as thin/duplicate content
      index: false,
      follow: true,
    },
  };
}
