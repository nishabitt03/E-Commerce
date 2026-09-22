"use client";

import { useEffect, useRef } from "react";
import { trackEvent } from "@/lib/analytics/analytics";

interface SearchTrackerProps {
  query: string;
  resultCount: number;
}

export function SearchTracker({ query, resultCount }: SearchTrackerProps) {
  const lastKey = useRef<string | null>(null);

  useEffect(() => {
    if (!query) return;
    const key = `${query}:${resultCount}`;
    if (lastKey.current === key) return;
    lastKey.current = key;
    trackEvent("search", { query, resultCount });
  }, [query, resultCount]);

  return null;
}
