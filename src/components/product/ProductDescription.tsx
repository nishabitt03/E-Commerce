interface ProductDescriptionProps {
  description: string;
}

export function ProductDescription({ description }: ProductDescriptionProps) {
  return (
    <section aria-labelledby="description-heading">
      <h2 id="description-heading" className="text-2xl text-foreground">
        Description
      </h2>
      <p className="mt-4 max-w-3xl leading-relaxed text-muted">{description}</p>
    </section>
  );
}
