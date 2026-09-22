import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ProductViewTracker } from "@/components/analytics/ProductViewTracker";
import { ProductBenefits } from "@/components/product/ProductBenefits";
import { ProductBreadcrumbs } from "@/components/product/ProductBreadcrumbs";
import { ProductDescription } from "@/components/product/ProductDescription";
import { ProductGallery } from "@/components/product/ProductGallery";
import { HowToUse } from "@/components/product/HowToUse";
import { ProductInfo } from "@/components/product/ProductInfo";
import { ProductIngredients } from "@/components/product/ProductIngredients";
import { ProductReviews } from "@/components/product/ProductReviews";
import { RelatedProducts } from "@/components/product/RelatedProducts";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { ProductJsonLd } from "@/components/seo/ProductJsonLd";
import { ApiError } from "@/lib/api/errors";
import {
  getProductBySlug,
  getRecommendedProducts,
} from "@/lib/api/products";
import { createProductMetadata } from "@/lib/seo/metadata";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const product = await getProductBySlug(slug);
    return createProductMetadata(product);
  } catch {
    return { title: "Product not found" };
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  let product;
  try {
    product = await getProductBySlug(slug);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      notFound();
    }
    throw error;
  }

  const related = await getRecommendedProducts(product.id, 4);

  return (
    <div className="container-page py-8 sm:py-10">
      <ProductJsonLd product={product} />
      <BreadcrumbJsonLd product={product} />
      <ProductViewTracker
        productId={product.id}
        productName={product.name}
        price={product.price}
      />

      <ProductBreadcrumbs
        category={product.category}
        productName={product.name}
      />

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-12">
        <ProductGallery images={product.images} productName={product.name} />
        <ProductInfo product={product} />
      </div>

      <div className="mt-14 space-y-12 border-t border-border pt-12">
        <ProductBenefits benefits={product.benefits} />
        <ProductDescription description={product.description} />
        <ProductIngredients ingredients={product.ingredients} />
        <HowToUse steps={product.howToUse} />
        <ProductReviews
          rating={product.rating}
          reviewCount={product.reviewCount}
          reviews={product.reviews}
        />
        <RelatedProducts products={related} />
      </div>
    </div>
  );
}
