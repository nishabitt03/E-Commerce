import Image from "next/image";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border bg-surface">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,#e4f1ef_0%,transparent_45%),radial-gradient(circle_at_80%_0%,#d8e0db_0%,transparent_35%)]" />

      <div className="container-page relative grid items-center gap-10 py-14 lg:grid-cols-2 lg:gap-12 lg:py-20">
        <div className="max-w-xl">
          <p className="text-sm font-semibold tracking-[0.16em] text-accent uppercase">
            Everyday barrier care
          </p>
          <h1 className="mt-4 text-4xl text-foreground sm:text-5xl lg:text-[3.4rem]">
            Skin that feels calm, clear, and ready for the day
          </h1>
          <p className="mt-5 text-base text-muted sm:text-lg">
            Shop serums, moisturizers, and SPF built around real concerns —
            without the noise of overcomplicated routines.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/products" className="btn btn-primary">
              Shop Products
            </Link>
            <Link href="/products?category=serum" className="btn btn-secondary">
              Explore Serums
            </Link>
          </div>
        </div>

        <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-lg lg:max-w-none">
          <Image
            src="https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=1200&q=80"
            alt="Skincare bottles arranged on a clean bathroom shelf"
            fill
            priority
            sizes="(max-width: 1024px) 90vw, 40vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
