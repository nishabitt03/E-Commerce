import Link from "next/link";

export default function ProductNotFound() {
  return (
    <div className="container-page flex flex-col items-center py-20 text-center">
      <h1 className="text-3xl text-foreground">Product not found</h1>
      <p className="mt-3 max-w-md text-muted">
        The product you&apos;re looking for may have been removed or is no longer
        available.
      </p>
      <Link href="/products" className="btn btn-primary mt-8">
        Browse Products
      </Link>
    </div>
  );
}
