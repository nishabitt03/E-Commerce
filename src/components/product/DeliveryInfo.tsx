export function DeliveryInfo() {
  return (
    <div className="rounded-md border border-border bg-accent-soft/50 p-4 text-sm text-foreground">
      <p className="font-semibold">Delivery information</p>
      <ul className="mt-2 space-y-1.5 text-muted">
        <li>Free delivery on eligible orders</li>
        <li>Delivery available across major Indian cities</li>
        <li>Estimated delivery: 3–5 business days</li>
      </ul>
      <p className="mt-2 text-xs text-muted">
        Shipping details are mocked for this portfolio project.
      </p>
    </div>
  );
}
