import { ProductGridSkeleton } from "@/components/product/ProductCardSkeleton";

export default function ProductsLoading() {
  return (
    <div className="container-page py-8 sm:py-10" aria-busy="true">
      <div className="mb-8 max-w-2xl space-y-3">
        <div className="h-10 w-48 animate-pulse rounded bg-border/70" />
        <div className="h-4 w-full max-w-md animate-pulse rounded bg-border/70" />
      </div>
      <ProductGridSkeleton count={6} />
    </div>
  );
}
