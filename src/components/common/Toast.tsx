"use client";

import { useToastStore } from "@/store/toast-store";

export function Toast() {
  const message = useToastStore((state) => state.message);
  const dismiss = useToastStore((state) => state.dismiss);

  if (!message) return null;

  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-6 z-[60] flex justify-center px-4"
      role="status"
      aria-live="polite"
    >
      <div className="pointer-events-auto flex max-w-sm items-start gap-3 rounded-lg border border-border bg-foreground px-4 py-3 text-sm text-primary-foreground shadow-[var(--shadow-md)]">
        <p className="flex-1">{message}</p>
        <button
          type="button"
          className="shrink-0 text-primary-foreground/80 hover:text-primary-foreground"
          onClick={dismiss}
          aria-label="Dismiss notification"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
