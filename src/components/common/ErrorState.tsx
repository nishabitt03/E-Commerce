"use client";

import { cn } from "@/lib/utils";

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = "Something went wrong",
  description = "We couldn't load the products. Please try again.",
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-lg border border-border bg-surface px-6 py-16 text-center",
        className
      )}
      role="alert"
    >
      <h2 className="text-xl text-foreground">{title}</h2>
      <p className="mt-2 max-w-md text-sm text-muted">{description}</p>
      {onRetry ? (
        <button type="button" className="btn btn-primary mt-6" onClick={onRetry}>
          Try Again
        </button>
      ) : null}
    </div>
  );
}
