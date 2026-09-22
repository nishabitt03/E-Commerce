import Link from "next/link";
import { getCategoryLabel } from "@/lib/utils/product-params";

interface ProductBreadcrumbsProps {
  category: string;
  productName: string;
}

export function ProductBreadcrumbs({
  category,
  productName,
}: ProductBreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex flex-wrap items-center gap-2 text-sm text-muted">
        <li>
          <Link href="/" className="hover:text-primary">
            Home
          </Link>
        </li>
        <li aria-hidden="true">/</li>
        <li>
          <Link href="/products" className="hover:text-primary">
            Shop
          </Link>
        </li>
        <li aria-hidden="true">/</li>
        <li>
          <Link
            href={`/products?category=${category}`}
            className="hover:text-primary"
          >
            {getCategoryLabel(category)}
          </Link>
        </li>
        <li aria-hidden="true">/</li>
        <li className="font-medium text-foreground" aria-current="page">
          {productName}
        </li>
      </ol>
    </nav>
  );
}
