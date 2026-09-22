import Image from "next/image";
import Link from "next/link";
import { getCategoryLabel } from "@/lib/utils/product-params";

const categoryCards = [
  {
    category: "serum",
    description: "Targeted actives for clarity and glow",
    image:
      "https://images.unsplash.com/photo-1620916568918-f9e8e0b6b4c0?w=600&q=80",
  },
  {
    category: "moisturizer",
    description: "Barrier support for every skin type",
    image:
      "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=600&q=80",
  },
  {
    category: "sunscreen",
    description: "Daily SPF with a wearable finish",
    image:
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&q=80",
  },
  {
    category: "cleanser",
    description: "Gentle first steps that do not strip",
    image:
      "https://images.unsplash.com/photo-1631730486572-226b1e412018?w=600&q=80",
  },
  {
    category: "toner",
    description: "Balance texture and prep the skin",
    image:
      "https://images.unsplash.com/photo-1570194065650-d99fb4b38b17?w=600&q=80",
  },
  {
    category: "mask",
    description: "Weekly resets for a fresher look",
    image:
      "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=600&q=80",
  },
];

export function Categories() {
  return (
    <section className="container-page py-14 sm:py-16" aria-labelledby="categories-heading">
      <div className="mb-8 max-w-2xl">
        <h2 id="categories-heading" className="text-3xl text-foreground">
          Shop by category
        </h2>
        <p className="mt-2 text-muted">
          Build a routine one step at a time — start where your skin needs support.
        </p>
      </div>

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categoryCards.map((card) => (
          <li key={card.category}>
            <Link
              href={`/products?category=${card.category}`}
              className="group relative flex min-h-44 overflow-hidden rounded-lg border border-border bg-surface"
            >
              <Image
                src={card.image}
                alt=""
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/35 to-transparent" />
              <div className="relative mt-auto p-5 text-primary-foreground">
                <h3 className="font-sans text-lg font-semibold">
                  {getCategoryLabel(card.category)}
                </h3>
                <p className="mt-1 text-sm text-primary-foreground/85">
                  {card.description}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
