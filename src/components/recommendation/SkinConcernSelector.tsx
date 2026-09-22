"use client";

import { cn } from "@/lib/utils";
import type { SkinConcern } from "@/types/product";

export const CONCERN_OPTIONS: Array<{
  id: SkinConcern;
  label: string;
  description: string;
}> = [
  { id: "acne", label: "Acne", description: "Oil & blemish care" },
  { id: "dryness", label: "Dryness", description: "Barrier & hydration" },
  {
    id: "pigmentation",
    label: "Pigmentation",
    description: "Even-looking tone",
  },
  {
    id: "sun-protection",
    label: "Sun Protection",
    description: "Daily SPF habits",
  },
  {
    id: "sensitive-skin",
    label: "Sensitive Skin",
    description: "Gentle formulas",
  },
  { id: "dullness", label: "Dullness", description: "Fresh, bright finish" },
];

interface SkinConcernSelectorProps {
  selected: SkinConcern | null;
  onSelect: (concern: SkinConcern) => void;
}

export function SkinConcernSelector({
  selected,
  onSelect,
}: SkinConcernSelectorProps) {
  return (
    <div
      className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6"
      role="radiogroup"
      aria-label="Skin concerns"
    >
      {CONCERN_OPTIONS.map((option) => {
        const isSelected = selected === option.id;
        return (
          <button
            key={option.id}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => onSelect(option.id)}
            className={cn(
              "rounded-lg border px-3 py-4 text-left transition-colors",
              isSelected
                ? "border-primary bg-primary text-primary-foreground shadow-[var(--shadow-sm)]"
                : "border-border bg-surface text-foreground hover:border-primary"
            )}
          >
            <span className="block text-sm font-semibold">{option.label}</span>
            <span
              className={cn(
                "mt-1 block text-xs",
                isSelected ? "text-primary-foreground/85" : "text-muted"
              )}
            >
              {option.description}
            </span>
          </button>
        );
      })}
    </div>
  );
}
