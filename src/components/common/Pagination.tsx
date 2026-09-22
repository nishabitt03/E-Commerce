import Link from "next/link";
import { cn } from "@/lib/utils";

interface PaginationProps {
  page: number;
  totalPages: number;
  hrefForPage: (page: number) => string;
  className?: string;
}

export function Pagination({
  page,
  totalPages,
  hrefForPage,
  className,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav
      className={cn("flex flex-wrap items-center justify-center gap-2", className)}
      aria-label="Pagination"
    >
      <PaginationLink
        href={hrefForPage(page - 1)}
        disabled={page <= 1}
        ariaLabel="Go to previous page"
      >
        ← Previous
      </PaginationLink>

      <ul className="flex flex-wrap items-center gap-1">
        {pages.map((pageNumber) => {
          const isActive = pageNumber === page;
          return (
            <li key={pageNumber}>
              {isActive ? (
                <span
                  aria-current="page"
                  className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-md bg-primary px-3 text-sm font-semibold text-primary-foreground"
                >
                  {pageNumber}
                </span>
              ) : (
                <Link
                  href={hrefForPage(pageNumber)}
                  className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-md border border-border bg-surface px-3 text-sm text-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  {pageNumber}
                </Link>
              )}
            </li>
          );
        })}
      </ul>

      <PaginationLink
        href={hrefForPage(page + 1)}
        disabled={page >= totalPages}
        ariaLabel="Go to next page"
      >
        Next →
      </PaginationLink>
    </nav>
  );
}

function PaginationLink({
  href,
  disabled,
  children,
  ariaLabel,
}: {
  href: string;
  disabled: boolean;
  children: React.ReactNode;
  ariaLabel: string;
}) {
  if (disabled) {
    return (
      <span
        className="inline-flex min-h-10 items-center rounded-md border border-transparent px-3 text-sm text-muted opacity-50"
        aria-disabled="true"
      >
        {children}
      </span>
    );
  }

  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      className="inline-flex min-h-10 items-center rounded-md border border-border bg-surface px-3 text-sm text-foreground transition-colors hover:border-primary hover:text-primary"
    >
      {children}
    </Link>
  );
}
