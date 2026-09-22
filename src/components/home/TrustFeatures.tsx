const features = [
  {
    title: "Authentic Products",
    description: "Sourced directly from partner labs with batch-level care.",
    icon: ShieldIcon,
  },
  {
    title: "Free Shipping",
    description: "Complimentary delivery on eligible orders across India.",
    icon: TruckIcon,
  },
  {
    title: "Easy Returns",
    description: "Simple returns within the window if a product is not right.",
    icon: ReturnIcon,
  },
  {
    title: "Secure Checkout",
    description: "Encrypted checkout flow with mock payment options.",
    icon: LockIcon,
  },
];

export function TrustFeatures() {
  return (
    <section
      className="border-t border-border bg-accent-soft/60 py-12 sm:py-14"
      aria-labelledby="trust-heading"
    >
      <div className="container-page">
        <h2 id="trust-heading" className="sr-only">
          Why shop with us
        </h2>
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <li key={feature.title} className="flex gap-3">
              <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-surface text-primary shadow-[var(--shadow-sm)]">
                <feature.icon />
              </span>
              <div>
                <h3 className="font-sans text-base font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="mt-1 text-sm text-muted">{feature.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function ShieldIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z"
        stroke="currentColor"
        strokeWidth="1.7"
      />
    </svg>
  );
}

function TruckIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M3 7h11v8H3V7zm11 2h4l3 3v3h-7V9z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <circle cx="7" cy="17" r="1.5" fill="currentColor" />
      <circle cx="17" cy="17" r="1.5" fill="currentColor" />
    </svg>
  );
}

function ReturnIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M7 7H3v4M3 11a8 8 0 1 0 2.3-5.7"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="5" y="10" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.7" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}
