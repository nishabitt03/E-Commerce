interface HowToUseProps {
  steps: string[];
}

export function HowToUse({ steps }: HowToUseProps) {
  if (steps.length === 0) return null;

  return (
    <section aria-labelledby="howto-heading">
      <h2 id="howto-heading" className="text-2xl text-foreground">
        How to use
      </h2>
      <ol className="mt-4 list-decimal space-y-2 pl-5 text-muted">
        {steps.map((step) => (
          <li key={step} className="pl-1">
            {step}
          </li>
        ))}
      </ol>
    </section>
  );
}
