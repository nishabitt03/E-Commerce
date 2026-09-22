import Link from "next/link";
import { brands } from "@/data/products";

export function Brands() {
  return (
    <section className="container-page py-14 sm:py-16" aria-labelledby="brands-heading">
      <div className="mb-8 text-center">
        <h2 id="brands-heading" className="text-3xl text-foreground">
          Trusted brands
        </h2>
        <p className="mt-2 text-muted">
          Independent labs we stock for clarity, barrier care, and daily SPF
        </p>
      </div>

      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {brands.map((brand) => (
          <li key={brand}>
            <Link
              href={`/products?brand=${encodeURIComponent(brand)}`}
              className="flex min-h-24 items-center justify-center rounded-lg border border-border bg-surface px-4 text-center font-semibold text-foreground transition-colors hover:border-primary hover:text-primary"
            >
              {brand}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
