import { ProductGridSkeleton } from "@/components/product/ProductCardSkeleton";

export default function SearchLoading() {
  return (
    <div className="container-page py-8 sm:py-10" aria-busy="true">
      <div className="mb-8 h-10 w-40 animate-pulse rounded bg-border/70" />
      <div className="mb-8 h-11 max-w-xl animate-pulse rounded-md bg-border/70" />
      <ProductGridSkeleton count={6} />
    </div>
  );
}
