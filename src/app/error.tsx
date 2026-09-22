"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ErrorState } from "@/components/common/ErrorState";

export default function GlobalError({
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
        title="Something went wrong"
        description="An unexpected error occurred. You can retry or return home."
        onRetry={reset}
      />
      <div className="mt-6 text-center">
        <Link href="/" className="text-sm font-medium text-primary hover:underline">
          Back to homepage
        </Link>
      </div>
    </div>
  );
}
