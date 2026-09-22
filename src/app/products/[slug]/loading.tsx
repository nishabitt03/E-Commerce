export default function ProductLoading() {
  return (
    <div className="container-page py-8 sm:py-10" aria-busy="true" aria-label="Loading product">
      <div className="mb-6 h-4 w-64 animate-pulse rounded bg-border/70" />

      <div className="grid gap-10 lg:grid-cols-2">
        <div className="aspect-[4/5] animate-pulse rounded-lg bg-border/70" />
        <div className="space-y-4">
          <div className="h-3 w-24 animate-pulse rounded bg-border/70" />
          <div className="h-10 w-4/5 animate-pulse rounded bg-border/70" />
          <div className="h-4 w-40 animate-pulse rounded bg-border/70" />
          <div className="h-8 w-32 animate-pulse rounded bg-border/70" />
          <div className="h-11 w-full animate-pulse rounded-md bg-border/70" />
          <div className="h-11 w-full animate-pulse rounded-md bg-border/70" />
          <div className="h-24 w-full animate-pulse rounded-md bg-border/70" />
        </div>
      </div>

      <div className="mt-14 space-y-4 border-t border-border pt-12">
        <div className="h-6 w-48 animate-pulse rounded bg-border/70" />
        <div className="h-20 w-full animate-pulse rounded bg-border/70" />
      </div>
    </div>
  );
}
