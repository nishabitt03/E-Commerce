interface ProductBenefitsProps {
  benefits: string[];
}

export function ProductBenefits({ benefits }: ProductBenefitsProps) {
  if (benefits.length === 0) return null;

  return (
    <section aria-labelledby="benefits-heading">
      <h2 id="benefits-heading" className="text-2xl text-foreground">
        Key Benefits
      </h2>
      <ul className="mt-4 space-y-2">
        {benefits.map((benefit) => (
          <li key={benefit} className="flex gap-2 text-muted">
            <span className="text-success" aria-hidden="true">
              ✓
            </span>
            <span>{benefit}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
