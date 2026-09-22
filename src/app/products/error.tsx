"use client";

import { useEffect } from "react";
import { ErrorState } from "@/components/common/ErrorState";

export default function ProductsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container-page py-16">
      <ErrorState
        title="Unable to load products"
        description="Something went wrong while loading the catalog. Please try again."
        onRetry={reset}
      />
    </div>
  );
}
