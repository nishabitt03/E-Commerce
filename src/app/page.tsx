import { Suspense } from "react";
import type { Metadata } from "next";
import { BestSellers } from "@/components/home/BestSellers";
import { Brands } from "@/components/home/Brands";
import { Categories } from "@/components/home/Categories";
import { Hero } from "@/components/home/Hero";
import { NewArrivals } from "@/components/home/NewArrivals";
import { RecommendedProducts } from "@/components/home/RecommendedProducts";
import { TrustFeatures } from "@/components/home/TrustFeatures";
import { ProductGridSkeleton } from "@/components/product/ProductCardSkeleton";
import { SkinConcernSection } from "@/components/recommendation/SkinConcernSection";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  getBestSellers,
  getNewArrivals,
  getProducts,
} from "@/lib/api/products";
import { products } from "@/data/products";
import { createBaseMetadata } from "@/lib/seo/metadata";
import {
  buildOrganizationJsonLd,
  buildWebsiteJsonLd,
} from "@/lib/seo/schema";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = createBaseMetadata({
  title: {
    default: `${SITE_NAME} | Performance Skincare`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  alternates: {
    canonical: "/",
  },
});

export default function HomePage() {
  return (
    <>
      <JsonLd data={buildOrganizationJsonLd()} />
      <JsonLd data={buildWebsiteJsonLd()} />
      <Hero />
      <Categories />
      <Suspense fallback={<SectionSkeleton title="Best Sellers" />}>
        <BestSellersSection />
      </Suspense>
      <SkinConcernSection products={products} />
      <Suspense fallback={<SectionSkeleton title="New Arrivals" />}>
        <NewArrivalsSection />
      </Suspense>
      <Suspense fallback={<SectionSkeleton title="Recommended for you" />}>
        <RecommendedSection />
      </Suspense>
      <Brands />
      <TrustFeatures />
    </>
  );
}

async function BestSellersSection() {
  const bestSellers = await getBestSellers(4);
  return <BestSellers products={bestSellers} />;
}

async function NewArrivalsSection() {
  const arrivals = await getNewArrivals(4);
  return <NewArrivals products={arrivals} />;
}

async function RecommendedSection() {
  const result = await getProducts({ sort: "rating", pageSize: 4 });
  return <RecommendedProducts products={result.items} />;
}

function SectionSkeleton({ title }: { title: string }) {
  return (
    <section className="container-page py-14">
      <h2 className="mb-8 text-3xl text-foreground">{title}</h2>
      <ProductGridSkeleton count={4} />
    </section>
  );
}
