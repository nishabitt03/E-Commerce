"use client";

interface QuantitySelectorProps {
  value: number;
  min?: number;
  max: number;
  onChange: (value: number) => void;
}

export function QuantitySelector({
  value,
  min = 1,
  max,
  onChange,
}: QuantitySelectorProps) {
  const decreaseDisabled = value <= min || max <= 0;
  const increaseDisabled = value >= max || max <= 0;

  return (
    <div>
      <p className="mb-2 text-sm font-semibold text-foreground" id="quantity-label">
        Quantity
      </p>
      <div
        className="inline-flex items-center rounded-md border border-border bg-surface"
        role="group"
        aria-labelledby="quantity-label"
      >
        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center text-lg disabled:opacity-40"
          aria-label="Decrease quantity"
          disabled={decreaseDisabled}
          onClick={() => onChange(Math.max(min, value - 1))}
        >
          −
        </button>
        <span className="min-w-10 text-center text-sm font-semibold" aria-live="polite">
          {value}
        </span>
        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center text-lg disabled:opacity-40"
          aria-label="Increase quantity"
          disabled={increaseDisabled}
          onClick={() => onChange(Math.min(max, value + 1))}
        >
          +
        </button>
      </div>
    </div>
  );
}
