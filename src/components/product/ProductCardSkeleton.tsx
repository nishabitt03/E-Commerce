import { cn } from "@/lib/utils";

interface ProductCardSkeletonProps {
  className?: string;
}

export function ProductCardSkeleton({ className }: ProductCardSkeletonProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border border-border bg-surface",
        className
      )}
      aria-hidden="true"
    >
      <div className="aspect-[4/5] animate-pulse bg-border/70" />
      <div className="space-y-3 p-4">
        <div className="h-3 w-1/3 animate-pulse rounded bg-border/70" />
        <div className="h-4 w-4/5 animate-pulse rounded bg-border/70" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-border/70" />
        <div className="h-5 w-2/5 animate-pulse rounded bg-border/70" />
        <div className="h-11 w-full animate-pulse rounded-md bg-border/70" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div
      className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3"
      aria-busy="true"
      aria-label="Loading products"
    >
      {Array.from({ length: count }, (_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
}
