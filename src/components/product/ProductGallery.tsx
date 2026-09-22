"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const safeImages = images.length > 0 ? images : ["/file.svg"];
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = safeImages[activeIndex] ?? safeImages[0];

  function showPrevious() {
    setActiveIndex((index) => (index === 0 ? safeImages.length - 1 : index - 1));
  }

  function showNext() {
    setActiveIndex((index) => (index === safeImages.length - 1 ? 0 : index + 1));
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[5rem_minmax(0,1fr)]">
      <ul className="order-2 flex gap-2 overflow-x-auto lg:order-1 lg:flex-col lg:overflow-visible">
        {safeImages.map((image, index) => {
          const selected = index === activeIndex;
          return (
            <li key={image + index} className="shrink-0">
              <button
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`Show image ${index + 1} of ${safeImages.length}`}
                aria-pressed={selected}
                className={cn(
                  "relative h-16 w-16 overflow-hidden rounded-md border transition-colors",
                  selected
                    ? "border-primary ring-2 ring-accent/40"
                    : "border-border hover:border-primary"
                )}
              >
                <Image
                  src={image}
                  alt=""
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </button>
            </li>
          );
        })}
      </ul>

      <div className="relative order-1 aspect-[4/5] overflow-hidden rounded-lg border border-border bg-accent-soft lg:order-2">
        <Image
          src={activeImage}
          alt={`${productName} — image ${activeIndex + 1}`}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 45vw"
          className="object-cover"
        />

        {safeImages.length > 1 ? (
          <>
            <button
              type="button"
              onClick={showPrevious}
              className="absolute top-1/2 left-3 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-surface/95 text-foreground"
              aria-label="Previous image"
            >
              ←
            </button>
            <button
              type="button"
              onClick={showNext}
              className="absolute top-1/2 right-3 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-surface/95 text-foreground"
              aria-label="Next image"
            >
              →
            </button>
          </>
        ) : null}
      </div>
    </div>
  );
}
