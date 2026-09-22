import { cn } from "@/lib/utils";

interface RatingProps {
  value: number;
  reviewCount?: number;
  size?: "sm" | "md";
  className?: string;
}

export function Rating({
  value,
  reviewCount,
  size = "sm",
  className,
}: RatingProps) {
  const stars = Array.from({ length: 5 }, (_, index) => {
    const filled = value >= index + 1;
    const half = !filled && value >= index + 0.5;

    return (
      <span
        key={index}
        aria-hidden="true"
        className={cn(
          size === "sm" ? "text-sm" : "text-base",
          filled || half ? "text-warning" : "text-border"
        )}
      >
        {half ? "★" : "★"}
      </span>
    );
  });

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <div
        className="flex items-center gap-0.5"
        role="img"
        aria-label={`Rated ${value.toFixed(1)} out of 5`}
      >
        {stars}
      </div>
      <span className="text-sm text-muted">
        {value.toFixed(1)}
        {typeof reviewCount === "number" ? ` (${reviewCount})` : null}
      </span>
    </div>
  );
}
